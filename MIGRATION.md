# Migration Guide

This document explains how to transition from the old HTML files to the new refactored structure.

## What Changed?

### Old Structure (Before)

```
random-draw/
├── random-draw.html          # Everything in one file
├── monte-carlo-test.html     # Everything in one file
└── images/
```

### New Structure (After)

```
random-draw/
├── css/                      # Separated stylesheets
│   ├── common.css
│   ├── random-draw.css
│   └── monte-carlo.css
├── js/                       # Separated JavaScript
│   ├── utils.js
│   ├── random-draw.js
│   └── monte-carlo.js
├── random-draw-new.html      # New main file
├── monte-carlo-test-new.html # New validation file
└── images/
```

## Migration Steps

### Step 1: Test the New Files

1. Open `random-draw-new.html` in your browser
2. Verify all functionality works:
   - ✓ Draw All Rounds button generates draws
   - ✓ Images display correctly for letters A-F
   - ✓ Save to PDF exports correctly
   - ✓ Navigation to validation page works

3. Test `monte-carlo-test-new.html`:
   - ✓ Run 10,000 Samples executes properly
   - ✓ Histogram displays and updates

### Step 2: Install Development Tools (Optional)

If you want to use linting and formatting:

```bash
npm install
```

Then run:

```bash
npm run lint        # Check for errors
npm run format      # Format all files
```

### Step 3: Replace Old Files

Once you've verified everything works:

```bash
# Backup old files (optional)
mv random-draw.html random-draw-old.html
mv monte-carlo-test.html monte-carlo-test-old.html
mv README.md README-old.md

# Rename new files
mv random-draw-new.html random-draw.html
mv monte-carlo-test-new.html monte-carlo-test.html
mv README-new.md README.md

# Update navigation link in random-draw.html if needed
# Change: monte-carlo-test-new.html → monte-carlo-test.html
```

Or you can delete the old files if you don't need them:

```bash
rm random-draw-old.html monte-carlo-test-old.html README-old.md
```

## Key Improvements

### 1. Code Duplication Eliminated ✅

- **Before**: `createPool()`, `shuffle()`, `drawFromPool()` duplicated in both HTML files
- **After**: Shared functions in `js/utils.js`, imported where needed

### 2. Better File Organization ✅

- **Before**: 300+ lines of CSS and JavaScript inline in HTML
- **After**: Separated into modular files by purpose

### 3. No Global Scope Pollution ✅

- **Before**: All functions in global scope
- **After**: ES6 modules with proper imports/exports

### 4. Named Constants ✅

- **Before**: Magic numbers like `9`, `5`, `10000` scattered in code
- **After**: Centralized in `CONFIG` object in `utils.js`

### 5. Pinned Dependencies ✅

- **Before**: CDN links without integrity hashes
- **After**: Versioned with SRI (Subresource Integrity) hashes

### 6. Linting & Formatting ✅

- **Before**: No code quality tools
- **After**: ESLint and Prettier configured

## Troubleshooting

### Issue: Images not loading

**Solution**: Ensure the `images/` folder is in the same directory as the HTML files.

### Issue: "Failed to load module script"

**Solution**: Make sure you're serving the files via HTTP (not file://). Use `npm run serve` or a local web server.

### Issue: PDF generation fails

**Solution**: Check that the CDN scripts for jsPDF and html2canvas loaded correctly. Check browser console for errors.

### Issue: Monte Carlo simulation doesn't start

**Solution**: Verify that `js/utils.js` and `js/monte-carlo.js` are accessible and ES6 modules are supported in your browser.

## Rollback Plan

If you need to rollback to the old files:

```bash
# If you made backups
mv random-draw-old.html random-draw.html
mv monte-carlo-test-old.html monte-carlo-test.html

# Or use git
git checkout random-draw.html monte-carlo-test.html
```

## Next Steps

After migration, consider:

1. Run `npm run lint:fix` to auto-fix any linting issues
2. Run `npm run format` to ensure consistent formatting
3. Set up Git hooks to run linting before commits
4. Add unit tests for the utility functions
5. Consider adding error boundaries and input validation

## Questions?

If you encounter any issues during migration, check:

- Browser console for JavaScript errors
- Network tab for failed resource loads
- Ensure you're using a modern browser with ES6 module support
