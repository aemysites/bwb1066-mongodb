/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL (must be robust for future inputs)
  function getBackgroundImageUrl(el) {
    // Find any element with a background-image style
    const candidates = el.querySelectorAll('[style*="background-image"]');
    for (const bgDiv of candidates) {
      const style = bgDiv.getAttribute('style');
      if (style && style.includes('background-image')) {
        const match = style.match(/background-image:\s*url\((['"]?)([^'")]*)\1\)/);
        if (match && match[2] && match[2] !== 'false') {
          return match[2];
        }
      }
    }
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero47)'];

  // 2. Background image row (must include image if found)
  const bgUrl = getBackgroundImageUrl(element);
  let imageRow;
  if (bgUrl) {
    const bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
    imageRow = [bgImgEl];
  } else {
    imageRow = [''];
  }

  // 3. Content row: extract main block of text/content
  let contentCell = '';
  const section = element.querySelector('section');
  if (section) {
    // Find main content container inside section
    let mainContent = section.querySelector('[class*=Container], [class*=WidthContainer]');
    if (!mainContent) mainContent = section;
    contentCell = mainContent;
  } else {
    contentCell = element;
  }

  const contentRow = [contentCell];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
