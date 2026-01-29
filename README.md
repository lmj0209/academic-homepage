# Academic Homepage

A minimal, professional, and easy-to-maintain personal academic homepage for showcasing your profile, research, publications, and achievements.

## Features

### Core Features (V0.1)
- ✅ Responsive two-column layout
- ✅ Profile sidebar with avatar and contact info
- ✅ Top navigation with smooth scroll
- ✅ About Me section with research interests
- ✅ News section with scrollable container
- ✅ Publications with author highlighting and badges
- ✅ Awards timeline
- ✅ Experience timeline
- ✅ Services section (Reviewer/PC Member)

### UI/UX Enhancements (V0.2)
- ✅ Optimized spacing for better visual density
- ✅ Smooth hover transitions
- ✅ Enhanced scrollbar styling
- ✅ Page load animations
- ✅ Mobile-friendly design

### Online Editing (V0.3)
- ✅ Inline edit mode for all content
- ✅ Add/delete functionality for lists
- ✅ Avatar upload with preview
- ✅ Local save with data.js export
- ✅ Draft persistence using localStorage

### Data Management (V0.4)
- ✅ Export as JSON, JavaScript, or Markdown
- ✅ Import data from JSON files
- ✅ Version history with snapshots
- ✅ Restore from previous versions
- ✅ Data validation

### Analytics (V0.5)
- ✅ Local visitor statistics
- ✅ Page views and unique visitors tracking
- ✅ Referrer tracking
- ✅ Daily statistics
- ✅ Export analytics data
- ✅ Placeholder for Clustrmaps integration

### Enhanced Features (V0.6)
- ✅ Full-text search (Ctrl+K)
- ✅ Copy to clipboard (BibTeX, email, title)
- ✅ Print-optimized styles
- ✅ Search button in navigation

### Complete Product (V1.0)
- ✅ Dark mode with auto-detection
- ✅ Theme toggle button
- ✅ SEO enhancement (meta tags, Open Graph)
- ✅ Structured data (Schema.org JSON-LD)
- ✅ Sitemap generation
- ✅ Accessibility features
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ Font size adjustment

## Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- A web server (optional, for local testing)

### Installation

1. Clone or download this repository
2. Edit `js/data.js` to customize your content
3. Open `index.html` in your browser

### Customizing Content

All content is managed through `js/data.js`. Edit this file to update:

- **Profile**: Name, title, institution, email, location, social links
- **About**: Description paragraphs and research interests
- **News**: Timeline of news items with icons
- **Publications**: List of papers with authors, venues, badges, and links
- **Awards**: List of awards with dates
- **Experience**: Timeline of academic and professional experience
- **Services**: List of review and PC member roles

## Usage

### Editing Content

1. Click the "Edit" button in the bottom-right corner
2. Click on any text to edit it inline
3. Use the "+" buttons to add new items
4. Click the trash icon to delete items
5. Click "Save" to export your changes as `data.js`

### Using the Export Menu

1. Click the "Export" button
2. Choose a format:
   - **JSON**: Raw data format
   - **JavaScript**: Ready-to-use data.js file
   - **Markdown**: Human-readable documentation

### Search

- Press `Ctrl+K` (or `Cmd+K` on Mac) to open search
- Or click the search icon in the navigation
- Type to search across publications, news, awards, and experience

### Dark Mode

- Click the moon/sun icon in the navigation
- Theme preference is saved and auto-applied on next visit

### Accessibility

- Use the accessibility menu (icon in bottom-right) to:
  - Toggle reduced motion
  - Toggle high contrast
  - Adjust font size
- Keyboard shortcuts:
  - `Tab`: Navigate between elements
  - `Enter/Space`: Activate buttons and links
  - `Escape`: Close modals and menus
  - `Ctrl+K`: Open search

### Analytics

- View basic statistics in the footer (page views, visitors)
- Click the chart icon for detailed analytics
- Export analytics data for external analysis

### Print

- Click the print icon in the navigation
- Or use browser's print function (Ctrl+P)
- Print styles automatically optimize the output

## Deployment

### Static Hosting

This site can be deployed to any static hosting service:

- **GitHub Pages**: Push to a repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder to Netlify
- **Vercel**: Connect your repository
- **Cloudflare Pages**: Deploy from Git
- **GitHub**: Use gh-pages branch

### Custom Domain

Add your custom domain to your hosting service and update the URL in `js/data.js` if needed.

## Customization

### Styling

Modify CSS variables in `css/variables.css`:

```css
:root {
    /* Colors */
    --color-primary: #2c5282;
    --color-accent: #4299e1;

    /* Font sizes */
    --font-size-base: 16px;

    /* Spacing */
    --space-md: 16px;
}
```

### Adding New Sections

1. Add HTML structure in `index.html`
2. Add rendering function in `js/main.js`
3. Add content structure in `js/data.js`
4. Add styles in `css/components.css`

### Integrating Third-Party Services

#### Clustrmaps

1. Sign up at clustrmaps.com
2. Get your widget code
3. Uncomment the visitor map section in `index.html`
4. Add your widget code

#### Google Analytics

Add your GA tracking code to `<head>` in `index.html`.

## File Structure

```
academic-homepage/
├── index.html          # Main HTML file
├── css/
│   ├── reset.css      # CSS reset
│   ├── variables.css  # CSS variables (colors, spacing, etc.)
│   ├── layout.css     # Layout styles
│   ├── components.css # Component styles
│   └── editor.css     # Editor and features styles
├── js/
│   ├── data.js        # Site content data
│   ├── main.js        # Rendering logic
│   ├── editor.js      # Online editing functionality
│   ├── dataManager.js # Data export/import/version management
│   ├── analytics.js   # Visitor analytics
│   ├── features.js    # Search, print, copy features
│   ├── theme.js       # Dark mode
│   ├── seo.js         # SEO enhancement
│   └── accessibility.js # Accessibility features
├── images/
│   └── avatar.jpg     # Profile picture
└── prd/               # Product documentation
```

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari, Chrome Mobile

## License

This project is open source and available for personal and academic use.

## Contributing

Feel free to fork this project and customize it for your needs. If you find bugs or have suggestions, please open an issue.

## Credits

- Icons: Font Awesome
- Design: Minimal academic style
- Built with: HTML5, CSS3, Vanilla JavaScript

## Version History

- **V1.0**: Complete product with dark mode, SEO, and accessibility
- **V0.6**: Enhanced features (search, print, copy)
- **V0.5**: Visitor statistics integration
- **V0.4**: Data management and backup
- **V0.3**: Online editing functionality
- **V0.2**: UI/UX optimization
- **V0.1**: MVP release
