/**
 * Live Edit Manager - 实时编辑并自动应用更新
 * 解决方案：利用 localStorage 实现保存即更新的体验
 */

class LiveEditManager {
    constructor() {
        this.storageKey = 'siteLiveEditData';
        this.isPreviewMode = false;
        this.previewToggle = null;
        this.editModeIndicator = null;
        this.hasUnsavedChanges = false;
    }

    /**
     * 初始化
     */
    init() {
        // 删除页面加载时的自动检查，避免误触发恢复提示
        // 只在用户主动请求时才检查已保存的数据

        // 直接初始化编辑器
        this.initEditMode();

        // 监听页面加载完成
        document.addEventListener('DOMContentLoaded', () => {
            this.setupPreviewToggle();
        });

        console.log('Live Edit Manager 初始化完成（不自动检查草稿）');
    }

    /**
     * 显示自动应用提示
     */
    showAutoApplyPrompt(savedData) {
        const modal = document.createElement('div');
        modal.className = 'auto-apply-modal';
        modal.innerHTML = `
            <div class="auto-apply-content">
                <div class="auto-apply-icon">
                    <i class="fas fa-sync-alt"></i>
                </div>
                <div class="auto-apply-message">
                    <h3>检测到已保存的编辑内容</h3>
                    <p>上次编辑的内容已保存，是否要应用？</p>
                    <div class="auto-apply-options">
                        <button id="apply-saved-data" class="apply-primary-btn">
                            <i class="fas fa-check"></i>
                            <span>应用保存的内容</span>
                        </button>
                        <button id="discard-saved-data" class="apply-secondary-btn">
                            <i class="fas fa-times"></i>
                            <span>舍弃，重新编辑</span>
                        </button>
                    </div>
                    <p class="auto-apply-note">
                        <i class="fas fa-info-circle"></i>
                        <span>选择"应用"后，页面内容将更新为上次保存的状态</span>
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定按钮事件
        document.getElementById('apply-saved-data').addEventListener('click', () => {
            this.applySavedData(savedData);
            modal.remove();
        });

        document.getElementById('discard-saved-data').addEventListener('click', () => {
            localStorage.removeItem(this.storageKey);
            this.clearSavedData();
            modal.remove();
            this.initEditMode();
        });
    }

    /**
     * 应用保存的数据
     */
    applySavedData(savedData) {
        // 更新全局 siteData
        Object.assign(siteData, savedData);

        // 重新渲染页面
        if (typeof init === 'function') {
            init();
        }

        // 显示成功提示
        this.showToast('已应用保存的内容', 'success');
    }

    /**
     * 初始化编辑模式
     */
    initEditMode() {
        // 创建实时编辑状态管理器
        this.setupLiveEdit();
    }

    /**
     * 设置实时编辑
     */
    setupLiveEdit() {
        // 创建编辑模式指示器
        this.createEditModeIndicator();

        // 为所有可编辑元素添加实时监听
        this.setupRealTimeListeners();

        // 创建预览切换按钮
        this.createPreviewToggle();

        console.log('Live Edit Manager 初始化完成');
    }

    /**
     * 创建编辑模式指示器
     */
    createEditModeIndicator() {
        if (document.getElementById('edit-mode-indicator')) {
            return;
        }

        const indicator = document.createElement('div');
        indicator.id = 'edit-mode-indicator';
        indicator.className = 'edit-mode-indicator';
        indicator.innerHTML = `
            <div class="edit-status">
                <span class="status-dot"></span>
                <span class="status-text">编辑模式</span>
                <span class="status-divider">|</span>
                <span class="changes-indicator">未保存</span>
            </div>
        `;

        document.body.appendChild(indicator);
        this.editModeIndicator = indicator;
    }

    /**
     * 设置实时监听
     */
    setupRealTimeListeners() {
        // 为常见可编辑元素添加输入监听
        const editableSelectors = [
            '.profile-name[contenteditable="true"]',
            '.profile-title[contenteditable="true"]',
            '.profile-info-item span[contenteditable="true"]',
            '.about-content p[contenteditable="true"]',
            '.interest-tag[contenteditable="true"]',
            '.news-item [contenteditable="true"]',
            '.publication-item [contenteditable="true"]',
            '.award-item [contenteditable="true"]',
            '.experience-item [contenteditable="true"]',
            '.service-item[contenteditable="true"]'
        ];

        editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // 使用 debounce 避免频繁保存
                let debounceTimer;
                const handleInput = () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        this.onEditChange();
                    }, 500);
                };

                // 监听多种输入事件
                element.addEventListener('input', handleInput);
                element.addEventListener('blur', handleInput);

                // 对于 contenteditable 的粘贴事件
                if (element.getAttribute('contenteditable') === 'true') {
                    element.addEventListener('paste', () => {
                        setTimeout(handleInput, 0);
                    });
                }
            });
        });
    }

    /**
     * 编辑内容改变时
     */
    onEditChange() {
        // 标记有未保存的更改
        this.hasUnsavedChanges = true;
        this.updateEditModeIndicator();

        // 实时保存到 localStorage
        this.saveCurrentState();

        // 如果在预览模式，自动切回编辑模式
        if (this.isPreviewMode) {
            this.togglePreviewMode();
        }
    }

    /**
     * 保存当前状态
     */
    saveCurrentState() {
        const currentState = this.collectCurrentState();
        localStorage.setItem(this.storageKey, JSON.stringify(currentState));
        console.log('已保存编辑状态到 localStorage');
    }

    /**
     * 收集当前编辑状态
     */
    collectCurrentState() {
        return {
            profile: {
                name: document.querySelector('.profile-name')?.textContent,
                title: document.querySelector('.profile-title')?.textContent,
                institution: {
                    name: document.querySelector('.profile-institution a')?.textContent
                },
                location: document.querySelector('.profile-info-item span')?.textContent,
                email: document.querySelector('.profile-info-item a')?.textContent
            },
            about: {
                description: Array.from(document.querySelectorAll('.about-content p')).map(p => p.textContent),
                researchInterests: Array.from(document.querySelectorAll('.interest-tag')).map(tag => tag.textContent)
            },
            news: Array.from(document.querySelectorAll('.news-item')).map(item => ({
                date: item.querySelector('.news-date')?.textContent,
                icon: item.querySelector('.news-icon')?.textContent,
                content: item.querySelector('.news-text')?.innerHTML
            })),
            publications: Array.from(document.querySelectorAll('.publication-item')).map((item, idx) => ({
                title: item.querySelector('.pub-title a')?.textContent,
                authors: item.querySelector('.pub-authors')?.textContent,
                venue: item.querySelector('.pub-venue')?.textContent
            })),
            awards: Array.from(document.querySelectorAll('.award-item')).map(item => ({
                date: item.querySelector('.award-date')?.textContent,
                name: item.querySelector('.award-name')?.textContent,
                institution: item.querySelector('.award-institution')?.textContent
            })),
            experience: Array.from(document.querySelectorAll('.experience-item')).map(item => ({
                date: item.querySelector('.exp-date')?.textContent,
                title: item.querySelector('.exp-title')?.textContent,
                institution: item.querySelector('.exp-institution')?.textContent,
                supervisor: item.querySelector('.exp-supervisor')?.textContent
            })),
            services: {
                reviewer: Array.from(document.querySelectorAll('.service-category:first-child .service-item')).map(item => item.textContent),
                pcMember: Array.from(document.querySelectorAll('.service-category:last-child .service-item')).map(item => item.textContent)
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 加载保存的数据
     */
    loadSavedData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
            return null;
        } catch (e) {
            console.error('加载保存的数据失败:', e);
            return null;
        }
    }

    /**
     * 清除保存的数据
     */
    clearSavedData() {
        localStorage.removeItem(this.storageKey);
        console.log('已清除保存的编辑数据');
    }

    /**
     * 更新编辑模式指示器
     */
    updateEditModeIndicator() {
        if (!this.editModeIndicator) return;

        const statusText = this.editModeIndicator.querySelector('.status-text');
        const changesIndicator = this.editModeIndicator.querySelector('.changes-indicator');
        const statusDot = this.editModeIndicator.querySelector('.status-dot');

        if (this.hasUnsavedChanges) {
            statusText.textContent = '编辑模式 (有未保存更改)';
            changesIndicator.textContent = '未保存';
            changesIndicator.classList.add('has-changes');
            statusDot.classList.add('pulse');
        } else {
            statusText.textContent = '编辑模式 (已保存)';
            changesIndicator.textContent = '已保存';
            changesIndicator.classList.remove('has-changes');
            statusDot.classList.remove('pulse');
        }
    }

    /**
     * 创建预览切换按钮
     */
    createPreviewToggle() {
        // 检查是否已存在
        if (document.getElementById('preview-toggle')) {
            return;
        }

        const toggle = document.createElement('button');
        toggle.id = 'preview-toggle';
        toggle.className = 'preview-toggle';
        toggle.innerHTML = `
            <i class="fas fa-eye"></i>
            <span class="preview-text">预览模式</span>
        `;

        toggle.addEventListener('click', () => this.togglePreviewMode());

        // 添加到导航栏
        const nav = document.querySelector('.nav-links');
        if (nav) {
            nav.appendChild(toggle);
        }

        this.previewToggle = toggle;
    }

    /**
     * 切换预览模式
     */
    togglePreviewMode() {
        this.isPreviewMode = !this.isPreviewMode;

        if (this.previewToggle) {
            if (this.isPreviewMode) {
                this.previewToggle.innerHTML = `
                    <i class="fas fa-edit"></i>
                    <span class="preview-text">返回编辑</span>
                `;
                this.previewToggle.classList.add('edit-mode-active');
            } else {
                this.previewToggle.innerHTML = `
                    <i class="fas fa-eye"></i>
                    <span class="preview-text">预览模式</span>
                `;
                this.previewToggle.classList.remove('edit-mode-active');
            }
        }

        // 更新所有可编辑元素的 contenteditable 属性
        this.toggleEditableState();
    }

    /**
     * 切换可编辑状态
     */
    toggleEditableState() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        const editModeButton = document.getElementById('edit-mode-btn');

        editableElements.forEach(element => {
            if (this.isPreviewMode) {
                // 预览模式：禁用编辑
                element.removeAttribute('contenteditable');
                element.classList.remove('is-editing');
            } else {
                // 编辑模式：启用编辑
                element.setAttribute('contenteditable', 'true');
                element.classList.add('is-editing');
            }
        });

        // 更新编辑按钮状态
        if (editModeButton) {
            if (this.isPreviewMode) {
                editModeButton.classList.add('disabled');
                editModeButton.disabled = true;
            } else {
                editModeButton.classList.remove('disabled');
                editModeButton.disabled = false;
            }
        }
    }

    /**
     * 保存并退出编辑模式
     */
    saveAndExit() {
        // 保存当前状态
        this.saveCurrentState();

        // 标记为已保存
        this.hasUnsavedChanges = false;
        this.updateEditModeIndicator();

        // 切换到预览模式（禁用编辑）
        this.isPreviewMode = true;
        this.toggleEditableState();

        // 显示保存成功提示
        this.showToast('保存成功！刷新页面即可看到更新', 'success');
    }

    /**
     * 显示 Toast 提示
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `live-edit-toast toast-${type}`;
        toast.innerHTML = `
            <i class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</i>
            <span class="toast-message">${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

// 全局实例
const liveEditManager = new LiveEditManager();

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    liveEditManager.init();
});

// 暴露给外部使用
window.liveEditManager = liveEditManager;
