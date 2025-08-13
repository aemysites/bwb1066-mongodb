/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Hero (hero46)'];

  // --- Background image row ---
  // Find the first valid background image (not 'false')
  let bgImgElem = null;
  const bgDivs = element.querySelectorAll('[data-bg]');
  for (const div of bgDivs) {
    const bg = div.getAttribute('data-bg');
    if (bg && bg !== 'false' && bg.startsWith('http')) {
      bgImgElem = document.createElement('img');
      bgImgElem.src = bg;
      bgImgElem.setAttribute('loading', 'lazy');
      break;
    }
  }

  // --- Content row ---
  // Find the header area with text and CTA
  let contentCell = [];
  const header = element.querySelector('header');
  if (header) {
    // The main content container inside header
    const contentDiv = header.querySelector('div.relative');
    if (contentDiv) {
      // Heading
      const h1 = contentDiv.querySelector('h1');
      if (h1) contentCell.push(h1);
      // Subheading
      const subDiv = contentDiv.querySelector('.fnt-20');
      if (subDiv) {
        // It may or may not contain a p
        const p = subDiv.querySelector('p');
        if (p) contentCell.push(p);
      }
      // CTA (look for a link with a button inside)
      const ctaDiv = contentDiv.querySelector('.fl.fl-center.w-full');
      if (ctaDiv) {
        const ctaA = ctaDiv.querySelector('a[href]');
        if (ctaA && ctaA.querySelector('button')) {
          // Reference the anchor (not clone)
          contentCell.push(ctaA);
        }
      }
    }
  }

  // Ensure there's always something in the content row (empty div if all missing)
  if (contentCell.length === 0) {
    contentCell = [document.createElement('div')];
  }

  // Compose the table rows as in the example: header, bg image, text/cta
  const cells = [
    headerRow,
    [bgImgElem ? bgImgElem : ''],
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
