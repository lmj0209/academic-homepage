/**
 * Online Editor for Academic Homepage
 * Supports inline editing and data export
 */

// Global state
let isEditMode = false;
let editSiteData = null;

// Initialize editor
function initEditor() {
    // Check if there's a saved draft and offer to restore
    checkForSavedDraft();

    // Create edit button
    const editButton = createEditButton();
    document.body.appendChild(editButton);

    // Create export button
    const exportButton = createExportButton();
    document.body.appendChild(exportButton);

    // Load data for editing
    editSiteData = JSON.parse(JSON.stringify(siteData));

    // Listen for edit button clicks
    editButton.addEventListener('click', toggleEditMode);

    // Listen for export button clicks
    exportButton.addEventListener('click', showExportMenu);

    // Load saved draft from localStorage (silent, without prompt)
    loadSavedDraftSilent();
}

// Check for saved draft and offer to restore
function checkForSavedDraft() {
    try {
        const savedDraft = localStorage.getItem('siteDataDraft');
        if (savedDraft) {
            // Parse the draft
            const draft = JSON.parse(savedDraft);

            // Compare with current data
            const currentStr = JSON.stringify(siteData);
            if (currentStr !== savedDraft) {
                // There's a difference, ask user
                const shouldRestore = confirm('发现保存的草稿数据与当前内容不同。\n\n是否要恢复保存的草稿？\n\n点击"确定"恢复草稿\n点击"取消"使用当前内容');

                if (shouldRestore) {
                    // Apply the draft
                    Object.assign(siteData, draft);

                    // Re-render with draft data
                    init();

                    showNotification('已恢复到保存的草稿', true);

                    // Update editSiteData to match
                    editSiteData = JSON.parse(JSON.stringify(siteData));
                } else {
                    // Clear the draft if user chose not to restore
                    localStorage.removeItem('siteDataDraft');
                }
            }
        }
    } catch (e) {
        console.warn('Failed to check for saved draft:', e);
    }
}

// Create edit mode toggle button
function createEditButton() {
    const button = document.createElement('button');
    button.id = 'edit-mode-btn';
    button.className = 'edit-mode-btn';
    button.innerHTML = '<i class="fas fa-edit"></i> <span>编辑</span>';
    return button;
}

// Toggle edit mode
function toggleEditMode() {
    // 检查是否已初始化 liveEditManager
    if (window.liveEditManager) {
        // 如果在预览模式，先切回编辑模式
        if (window.liveEditManager.isPreviewMode) {
            window.liveEditManager.togglePreviewMode();
        }
    }
}

// 新的编辑模式切换函数
function enterEditMode() {
    // 确保 liveEditManager 已初始化
    if (!window.liveEditManager) {
        console.error('LiveEditManager 未初始化');
        return;
    }

    // 检查并清除保存的草稿提示（如果有）
    const modal = document.querySelector('.auto-apply-modal');
    if (modal) {
        modal.remove();
    }

    // 进入编辑模式
    window.liveEditManager.setupLiveEdit();
}

// Create export menu button
function createExportButton() {
    const button = document.createElement('button');
    button.id = 'export-btn';
    button.className = 'export-btn';
    button.innerHTML = '<i class="fas fa-download"></i> <span>Export</span>';
    return button;
}

// Show export menu
function showExportMenu() {
    // Remove existing menu if present
    const existingMenu = document.getElementById('export-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    const menu = document.createElement('div');
    menu.id = 'export-menu';
    menu.className = 'export-menu';
    menu.innerHTML = `
        <div class="export-menu-content">
            <h3>Export Data</h3>
            <div class="export-options">
                <button onclick="exportAs('json')" class="export-option">
                    <i class="fas fa-file-code"></i>
                    <span>Export as JSON</span>
                </button>
                <button onclick="exportAs('js')" class="export-option">
                    <i class="fab fa-js"></i>
                    <span>Export as data.js</span>
                </button>
                <button onclick="exportAs('md')" class="export-option">
                    <i class="fab fa-markdown"></i>
                    <span>Export as Markdown</span>
                </button>
            </div>
            <div class="export-menu-footer">
                <button onclick="showVersionHistory()" class="version-history-btn">
                    <i class="fas fa-history"></i>
                    <span>Version History</span>
                </button>
                <button onclick="document.getElementById('import-file').click()" class="import-btn">
                    <i class="fas fa-upload"></i>
                    <span>Import Data</span>
                </button>
                <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)">
            </div>
            <button class="close-menu-btn" onclick="closeExportMenu()"><i class="fas fa-times"></i></button>
        </div>
    `;

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !document.getElementById('export-btn').contains(e.target)) {
                closeExportMenu();
            }
        }, { once: true });
    }, 100);
}

// Close export menu
function closeExportMenu() {
    const menu = document.getElementById('export-menu');
    if (menu) {
        menu.remove();
    }
}

// Export data in specified format
function exportAs(format) {
    // Create snapshot before export
    dataManager.createSnapshot();

    switch (format) {
        case 'json':
            dataManager.exportJSON();
            showNotification('Exported as JSON');
            break;
        case 'js':
            dataManager.exportDataJS();
            showNotification('Exported as data.js');
            break;
        case 'md':
            dataManager.exportMarkdown();
            showNotification('Exported as Markdown');
            break;
    }

    closeExportMenu();
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    dataManager.importJSON(file)
        .then(data => {
            if (confirm('This will replace all current data. Continue?')) {
                // Create snapshot before import
                dataManager.createSnapshot();

                // Apply imported data
                Object.assign(siteData, data);

                // Re-render
                init();
                showNotification('Data imported successfully!');
            }
        })
        .catch(err => {
            alert('Failed to import data: ' + err.message);
        });

    event.target.value = ''; // Reset file input
    closeExportMenu();
}

// Show version history
function showVersionHistory() {
    closeExportMenu();

    const versions = dataManager.getVersions();
    const modal = document.createElement('div');
    modal.id = 'version-modal';
    modal.className = 'version-modal';

    let versionsHTML = '';
    if (versions.length === 0) {
        versionsHTML = '<p class="no-versions">No saved versions yet. Export data to create snapshots.</p>';
    } else {
        versionsHTML = versions.map(v => `
            <div class="version-item" data-id="${v.id}">
                <div class="version-info">
                    <div class="version-label">${v.label}</div>
                    <div class="version-date">${new Date(v.timestamp).toLocaleString()}</div>
                </div>
                <div class="version-actions">
                    <button onclick="restoreVersion(${v.id})" class="restore-btn" title="Restore">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button onclick="deleteVersion(${v.id})" class="delete-version-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    modal.innerHTML = `
        <div class="version-modal-content">
            <div class="version-modal-header">
                <h3>Version History</h3>
                <button class="close-modal-btn" onclick="closeVersionModal()"><i class="fas fa-times"></i></button>
            </div>
            <div class="version-list">
                ${versionsHTML}
            </div>
            ${versions.length > 0 ? `
                <div class="version-modal-footer">
                    <button onclick="clearAllVersions()" class="clear-versions-btn">Clear All Versions</button>
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);
}

// Close version modal
function closeVersionModal() {
    const modal = document.getElementById('version-modal');
    if (modal) {
        modal.remove();
    }
}

// Restore version
function restoreVersion(versionId) {
    if (dataManager.restoreSnapshot(versionId)) {
        closeVersionModal();
    }
}

// Delete version
function deleteVersion(versionId) {
    if (dataManager.deleteSnapshot(versionId)) {
        closeVersionModal();
        showVersionHistory(); // Refresh the list
    }
}

// Clear all versions
function clearAllVersions() {
    if (dataManager.clearVersions()) {
        closeVersionModal();
    }
}

// Toggle edit mode on/off
function toggleEditMode() {
    isEditMode = !isEditMode;
    const button = document.getElementById('edit-mode-btn');

    if (isEditMode) {
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-save"></i> <span>Save</span>';
        document.body.classList.add('edit-mode');
        enableEditing();
    } else {
        saveChanges();
    }
}

// Enable editing on all contenteditable elements
function enableEditing() {
    // Make profile fields editable
    makeProfileEditable();

    // Make about section editable
    makeAboutEditable();

    // Make news items editable with add/delete functionality
    makeNewsEditable();

    // Make publications editable with add/delete functionality
    makePublicationsEditable();

    // Make awards editable with add/delete functionality
    makeAwardsEditable();

    // Make experience editable with add/delete functionality
    makeExperienceEditable();

    // Make services editable
    makeServicesEditable();

    // Enable avatar upload
    enableAvatarUpload();

    // Show save buttons and delete buttons
    document.querySelectorAll('.add-btn, .delete-btn').forEach(btn => {
        btn.style.display = 'inline-flex';
    });
}

// Disable editing mode
function disableEditing() {
    const button = document.getElementById('edit-mode-btn');
    button.classList.remove('active');
    button.innerHTML = '<i class="fas fa-edit"></i> <span>Edit</span>';
    document.body.classList.remove('edit-mode');

    // Hide save and delete buttons
    document.querySelectorAll('.add-btn, .delete-btn').forEach(btn => {
        btn.style.display = 'none';
    });

    // Remove contenteditable
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.removeAttribute('contenteditable');
    });

    // Remove edit buttons
    document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
        btn.remove();
    });
}

// Save changes and export data
function saveChanges() {
    // Collect all edited data
    collectEditedData();

    // Save to localStorage
    saveToLocalStorage();

    // Generate new data.js content
    const newDataJS = generateDataJSContent();

    // Show save notification with better options
    showSaveNotification(newDataJS);
}

// Generate data.js file content
function generateDataJSContent() {
    return `/**
 * Site Data - JSON structure for academic homepage
 * Edit this file to update the website content
 * Last updated: ${new Date().toLocaleString()}
 */

const siteData = ${JSON.stringify(editSiteData, null, 4)};
`;
}

// Show save notification with copy functionality
function showSaveNotification(dataJSContent) {
    // Remove existing notification
    const existing = document.querySelector('.save-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
        <div class="save-notification-header">
            <div class="save-icon">
                <i class="fas fa-check-circle"></i>
                <span>保存成功！</span>
            </div>
            <button class="close-save-btn" onclick="this.closest('.save-notification').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="save-notification-body">
            <div class="save-steps">
                <div class="step-number">1</div>
                <div class="step-content">
                    <strong>复制新的数据代码</strong>
                    <p>点击下方按钮复制完整代码</p>
                </div>
                <div class="step-action">
                    <button onclick="copyNewData()" class="copy-main-btn">
                        <i class="fas fa-copy"></i>
                        <span>复制 data.js 代码</span>
                    </button>
                </div>
            </div>

            <div class="step-divider">
                <i class="fas fa-arrow-down"></i>
            </div>

            <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                    <strong>替换项目中的 data.js 文件</strong>
                    <p>打开 <code>js/data.js</code> 文件，粘贴新代码并保存</p>
                </div>
                <div class="step-info">
                    <div class="info-label">文件路径：</div>
                    <div class="info-path">js/data.js</div>
                </div>
            </div>

            <div class="step-divider">
                <i class="fas fa-arrow-down"></i>
            </div>

            <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                    <strong>刷新页面查看更新</strong>
                    <p>保存文件后，按 <kbd>F5</kbd> 或刷新浏览器</p>
                </div>
                <div class="step-action">
                    <button onclick="location.reload()" class="refresh-btn">
                        <i class="fas fa-sync"></i>
                        <span>刷新页面</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="save-notification-footer">
            <button onclick="downloadDataFile()" class="download-option-btn">
                <i class="fas fa-download"></i>
                <span>或下载文件（备份用）</span>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Store data for copy function
    window.currentDataJSContent = dataJSContent;

    // Disable edit mode
    disableEditing();
}

// Copy new data.js content to clipboard
function copyNewData() {
    if (window.currentDataJSContent) {
        navigator.clipboard.writeText(window.currentDataJSContent).then(() => {
            showNotification('✓ 代码已复制到剪贴板！', true);
        }).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = window.currentDataJSContent;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showNotification('✓ 代码已复制到剪贴板！', true);
            } catch (e) {
                alert('复制失败，请手动选择复制');
            }
            document.body.removeChild(textarea);
        });
    }
}

// Collect edited data from DOM
function collectEditedData() {
    // Profile
    editSiteData.profile.name.en = document.querySelector('.profile-name')?.textContent || editSiteData.profile.name.en;
    editSiteData.profile.title = document.querySelector('.profile-title')?.textContent || editSiteData.profile.title;
    editSiteData.profile.institution.name = document.querySelector('.profile-institution a')?.textContent || editSiteData.profile.institution.name;
    editSiteData.profile.location = document.querySelector('.profile-info-item span')?.textContent || editSiteData.profile.location;
    editSiteData.profile.email = document.querySelector('.profile-info-item a')?.textContent || editSiteData.profile.email;

    // About
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    editSiteData.about.description = Array.from(aboutParagraphs).map(p => p.textContent);

    const interestTags = document.querySelectorAll('.interest-tag');
    editSiteData.about.researchInterests = Array.from(interestTags).map(tag => tag.textContent);

    // News
    const newsItems = document.querySelectorAll('.news-item');
    editSiteData.news = Array.from(newsItems).map(item => ({
        date: item.querySelector('.news-date')?.textContent || '',
        icon: item.querySelector('.news-icon')?.textContent || '📝',
        content: item.querySelector('.news-text')?.innerHTML || ''
    }));

    // Publications
    const pubItems = document.querySelectorAll('.publication-item');
    editSiteData.publications.items = Array.from(pubItems).map(item => ({
        title: item.querySelector('.pub-title a')?.textContent || '',
        authors: item.querySelector('.pub-authors')?.textContent || '',
        venue: item.querySelector('.pub-venue')?.textContent || '',
        badges: Array.from(item.querySelectorAll('.badge')).map(b => b.classList.contains('ccf-a') ? 'ccf-a' :
            b.classList.contains('ccf-b') ? 'ccf-b' :
            b.classList.contains('ccf-c') ? 'ccf-c' :
            b.classList.contains('oral') ? 'oral' :
            b.classList.contains('poster') ? 'poster' :
            b.classList.contains('best-paper') ? 'best-paper' : ''),
        links: Array.from(item.querySelectorAll('.pub-link')).map(l => ({
            label: l.textContent,
            url: l.href
        }))
    }));

    // Awards
    const awardItems = document.querySelectorAll('.award-item');
    editSiteData.awards = Array.from(awardItems).map(item => ({
        date: item.querySelector('.award-date')?.textContent || '',
        name: item.querySelector('.award-name')?.textContent || '',
        institution: item.querySelector('.award-institution')?.textContent || ''
    }));

    // Experience
    const expItems = document.querySelectorAll('.experience-item');
    editSiteData.experience = Array.from(expItems).map(item => ({
        date: item.querySelector('.exp-date')?.textContent || '',
        title: item.querySelector('.exp-title')?.textContent || '',
        institution: item.querySelector('.exp-institution')?.textContent || '',
        supervisor: item.querySelector('.exp-supervisor')?.textContent || ''
    }));

    // Services
    const reviewerItems = document.querySelectorAll('.service-category:first-child .service-item');
    editSiteData.services.reviewer = Array.from(reviewerItems).map(item => item.textContent);

    const pcMemberItems = document.querySelectorAll('.service-category:last-child .service-item');
    editSiteData.services.pcMember = Array.from(pcMemberItems).map(item => item.textContent);
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('siteDataDraft', JSON.stringify(editSiteData, null, 4));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// Load saved draft from localStorage
function loadSavedDraft() {
    try {
        const savedDraft = localStorage.getItem('siteDataDraft');
        if (savedDraft) {
            const confirmLoad = confirm('A saved draft was found. Would you like to restore it?');
            if (confirmLoad) {
                editSiteData = JSON.parse(savedDraft);
                siteData = JSON.parse(JSON.stringify(editSiteData));
                init(); // Re-render with saved data
                showNotification('Draft restored!');
            }
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// Load saved draft silently (without confirmation prompt)
function loadSavedDraftSilent() {
    try {
        const savedDraft = localStorage.getItem('siteDataDraft');
        if (savedDraft) {
            // Only restore if there's a real difference
            const currentStr = JSON.stringify(siteData);
            if (currentStr !== savedDraft) {
                editSiteData = JSON.parse(savedDraft);
                siteData = JSON.parse(JSON.stringify(editSiteData));
                // Re-render with saved data
                init();

                console.log('Restored draft from localStorage automatically');
            }
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// Download data as JavaScript file
function downloadDataFile() {
    const content = `/**
 * Site Data - JSON structure for academic homepage
 * Edit this file to update the website content
 */

const siteData = ${JSON.stringify(editSiteData, null, 4)};
`;

    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Make profile editable
function makeProfileEditable() {
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.contentEditable = 'true';
        profileName.dataset.editField = 'name';
    }

    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle) {
        profileTitle.contentEditable = 'true';
        profileTitle.dataset.editField = 'title';
    }

    const profileInstitution = document.querySelector('.profile-institution');
    if (profileInstitution) {
        profileInstitution.contentEditable = 'true';
        profileInstitution.dataset.editField = 'institution';
    }

    const profileLocation = document.querySelector('.profile-info-item span');
    if (profileLocation) {
        profileLocation.contentEditable = 'true';
        profileLocation.dataset.editField = 'location';
    }

    const profileEmail = document.querySelector('.profile-info-item a');
    if (profileEmail) {
        profileEmail.contentEditable = 'true';
        profileEmail.dataset.editField = 'email';
    }
}

// Make about section editable
function makeAboutEditable() {
    const aboutParagraphs = document.querySelectorAll('.about-content p');
    aboutParagraphs.forEach(p => {
        p.contentEditable = 'true';
        p.dataset.editField = 'description';
    });

    // Add button to add new paragraph
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent && !aboutContent.querySelector('.add-paragraph-btn')) {
        const addBtn = createAddButton('Add Paragraph', () => {
            const newP = document.createElement('p');
            newP.contentEditable = 'true';
            newP.textContent = 'New paragraph text...';
            newP.dataset.editField = 'description';
            aboutContent.appendChild(newP);
        });
        addBtn.classList.add('add-paragraph-btn');
        aboutContent.appendChild(addBtn);
    }

    // Make interest tags editable
    const interestTags = document.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => {
        tag.contentEditable = 'true';
        tag.dataset.editField = 'interest';
        addDeleteButton(tag);
    });

    // Add button to add new interest tag
    const interestTagsContainer = document.querySelector('.interest-tags');
    if (interestTagsContainer && !interestTagsContainer.querySelector('.add-interest-btn')) {
        const addBtn = createAddButton('+ Add Interest', () => {
            const newTag = document.createElement('span');
            newTag.className = 'interest-tag';
            newTag.contentEditable = 'true';
            newTag.textContent = 'New Interest';
            newTag.dataset.editField = 'interest';
            addDeleteButton(newTag);
            interestTagsContainer.appendChild(newTag);
        });
        addBtn.classList.add('add-interest-btn');
        interestTagsContainer.appendChild(addBtn);
    }
}

// Make news items editable
function makeNewsEditable() {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        const dateEl = item.querySelector('.news-date');
        if (dateEl) {
            dateEl.contentEditable = 'true';
            dateEl.dataset.editField = 'news-date';
        }

        const iconEl = item.querySelector('.news-icon');
        if (iconEl) {
            iconEl.contentEditable = 'true';
            iconEl.dataset.editField = 'news-icon';
        }

        const contentEl = item.querySelector('.news-text');
        if (contentEl) {
            contentEl.contentEditable = 'true';
            contentEl.dataset.editField = 'news-content';
        }

        addDeleteButton(item);
    });

    // Add button to add new news item
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer && !newsContainer.querySelector('.add-news-btn')) {
        const addBtn = createAddButton('+ Add News', () => {
            const newItem = document.createElement('div');
            newItem.className = 'news-item';
            newItem.innerHTML = `
                <div class="news-icon" contenteditable="true">📝</div>
                <div class="news-content">
                    <div class="news-date" contenteditable="true">2024.01</div>
                    <div class="news-text" contenteditable="true">New news item...</div>
                </div>
            `;
            addDeleteButton(newItem);
            newsContainer.appendChild(newItem);
        });
        addBtn.classList.add('add-news-btn');
        newsContainer.parentElement.insertBefore(addBtn, newsContainer);
    }
}

// Make publications editable
function makePublicationsEditable() {
    const pubItems = document.querySelectorAll('.publication-item');
    pubItems.forEach(item => {
        const titleEl = item.querySelector('.pub-title a');
        if (titleEl) {
            titleEl.contentEditable = 'true';
            titleEl.dataset.editField = 'pub-title';
        }

        const authorsEl = item.querySelector('.pub-authors');
        if (authorsEl) {
            authorsEl.contentEditable = 'true';
            authorsEl.dataset.editField = 'pub-authors';
        }

        const venueEl = item.querySelector('.pub-venue');
        if (venueEl) {
            venueEl.contentEditable = 'true';
            venueEl.dataset.editField = 'pub-venue';
        }

        addDeleteButton(item);
    });

    // Add button to add new publication
    const pubContainer = document.querySelector('.publication-list');
    if (pubContainer && !pubContainer.querySelector('.add-pub-btn')) {
        const addBtn = createAddButton('+ Add Publication', () => {
            const newItem = document.createElement('div');
            newItem.className = 'publication-item';
            newItem.innerHTML = `
                <div class="pub-title">
                    <a href="#" contenteditable="true" target="_blank">New Publication Title</a>
                </div>
                <div class="pub-authors" contenteditable="true">Author Names</div>
                <div class="pub-venue" contenteditable="true">Conference/Journal, 2024</div>
                <div class="pub-links">
                    <a href="#" class="pub-link" target="_blank">PDF</a>
                </div>
            `;
            addDeleteButton(newItem);
            pubContainer.appendChild(newItem);
        });
        addBtn.classList.add('add-pub-btn');
        pubContainer.parentElement.insertBefore(addBtn, pubContainer);
    }
}

// Make awards editable
function makeAwardsEditable() {
    const awardItems = document.querySelectorAll('.award-item');
    awardItems.forEach(item => {
        const dateEl = item.querySelector('.award-date');
        if (dateEl) {
            dateEl.contentEditable = 'true';
            dateEl.dataset.editField = 'award-date';
        }

        const nameEl = item.querySelector('.award-name');
        if (nameEl) {
            nameEl.contentEditable = 'true';
            nameEl.dataset.editField = 'award-name';
        }

        const institutionEl = item.querySelector('.award-institution');
        if (institutionEl) {
            institutionEl.contentEditable = 'true';
            institutionEl.dataset.editField = 'award-institution';
        }

        addDeleteButton(item);
    });

    // Add button to add new award
    const awardsList = document.querySelector('.awards-list');
    if (awardsList && !awardsList.querySelector('.add-award-btn')) {
        const addBtn = createAddButton('+ Add Award', () => {
            const newItem = document.createElement('li');
            newItem.className = 'award-item';
            newItem.innerHTML = `
                <div class="award-date" contenteditable="true">2024</div>
                <div class="award-content">
                    <div class="award-name" contenteditable="true">New Award</div>
                    <div class="award-institution" contenteditable="true">Institution</div>
                </div>
            `;
            addDeleteButton(newItem);
            awardsList.appendChild(newItem);
        });
        addBtn.classList.add('add-award-btn');
        awardsList.parentElement.insertBefore(addBtn, awardsList);
    }
}

// Make experience editable
function makeExperienceEditable() {
    const expItems = document.querySelectorAll('.experience-item');
    expItems.forEach(item => {
        const dateEl = item.querySelector('.exp-date');
        if (dateEl) {
            dateEl.contentEditable = 'true';
            dateEl.dataset.editField = 'exp-date';
        }

        const titleEl = item.querySelector('.exp-title');
        if (titleEl) {
            titleEl.contentEditable = 'true';
            titleEl.dataset.editField = 'exp-title';
        }

        const institutionEl = item.querySelector('.exp-institution');
        if (institutionEl) {
            institutionEl.contentEditable = 'true';
            institutionEl.dataset.editField = 'exp-institution';
        }

        const supervisorEl = item.querySelector('.exp-supervisor');
        if (supervisorEl) {
            supervisorEl.contentEditable = 'true';
            supervisorEl.dataset.editField = 'exp-supervisor';
        }

        addDeleteButton(item);
    });

    // Add button to add new experience
    const expContainer = document.querySelector('.experience-timeline');
    if (expContainer && !expContainer.querySelector('.add-exp-btn')) {
        const addBtn = createAddButton('+ Add Experience', () => {
            const newItem = document.createElement('div');
            newItem.className = 'experience-item';
            newItem.innerHTML = `
                <div class="exp-date" contenteditable="true">2024 - Present</div>
                <div class="exp-title" contenteditable="true">New Position</div>
                <div class="exp-institution" contenteditable="true">Institution</div>
                <div class="exp-supervisor" contenteditable="true">Advisor: Prof. Name</div>
            `;
            addDeleteButton(newItem);
            expContainer.appendChild(newItem);
        });
        addBtn.classList.add('add-exp-btn');
        expContainer.parentElement.insertBefore(addBtn, expContainer);
    }
}

// Make services editable
function makeServicesEditable() {
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.contentEditable = 'true';
        item.dataset.editField = 'service';
        addDeleteButton(item);
    });

    // Add buttons to add new service items
    const serviceCategories = document.querySelectorAll('.service-category');
    serviceCategories.forEach(category => {
        const serviceItems = category.querySelector('.service-items');
        if (serviceItems && !category.querySelector('.add-service-btn')) {
            const addBtn = createAddButton('+ Add Service', () => {
                const newItem = document.createElement('span');
                newItem.className = 'service-item';
                newItem.contentEditable = 'true';
                newItem.textContent = 'New Service';
                newItem.dataset.editField = 'service';
                addDeleteButton(newItem);
                serviceItems.appendChild(newItem);
            });
            addBtn.classList.add('add-service-btn');
            category.appendChild(addBtn);
        }
    });
}

// Enable avatar upload
function enableAvatarUpload() {
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.title = 'Click to change avatar';

        avatar.addEventListener('click', () => {
            if (!isEditMode) return;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        // Update preview
                        avatar.src = event.target.result;
                        // Store for later export
                        editSiteData.profile.avatarData = event.target.result;
                        showNotification('Avatar updated! Save to apply changes.');
                    };
                    reader.readAsDataURL(file);
                }
            });

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
    }
}

// Create add button
function createAddButton(text, onClick) {
    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.innerHTML = `<i class="fas fa-plus"></i> ${text}`;
    btn.addEventListener('click', onClick);
    return btn;
}

// Add delete button to element
function addDeleteButton(element) {
    if (element.querySelector('.delete-btn')) return;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this item?')) {
            element.remove();
        }
    });
    element.appendChild(deleteBtn);
}

// Show notification
function showNotification(message, isSuccess = true) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export draft
function exportDraft() {
    collectEditedData();
    downloadDataFile();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main initialization
    setTimeout(initEditor, 100);
});
