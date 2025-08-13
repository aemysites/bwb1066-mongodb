/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background/main image (if it exists)
  const img = element.querySelector('img');

  // Find the content container (headline, subheading, CTA)
  const contentRoot = element.querySelector('.css-1rc1plx');

  // Prepare content elements for the content cell
  const contentCellElements = [];
  if (contentRoot) {
    // Title: find the first heading (h1-h6)
    let heading = contentRoot.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentCellElements.push(heading);

    // Subheading: often a span container with text
    // Try .css-ijq421 first, fall back to any paragraph/span with a decent chunk of text
    let subheading = contentRoot.querySelector('.css-ijq421');
    if (!subheading) {
      subheading = Array.from(contentRoot.querySelectorAll('p, span')).find(e => e.textContent.trim().length > 30);
    }
    if (subheading) contentCellElements.push(subheading);

    // CTA: look for a link/button
    let cta = contentRoot.querySelector('a, button');
    if (cta) contentCellElements.push(cta);
  }

  // Compose the table:
  // 1. Header row
  // 2. Image row (may be empty if image does not exist)
  // 3. Content row (may be empty if content does not exist)
  const cells = [
    ['Hero (hero10)'],
    [img ? img : ''],
    [contentCellElements.length ? contentCellElements : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}