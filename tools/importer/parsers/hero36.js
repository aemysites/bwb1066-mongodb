/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table rows
  const headerRow = ['Hero (hero36)'];

  // Find background image (img tag), if present
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    // Reference the first img element directly
    bgImg = imgs[0];
  }

  // Create block table rows
  // 1. Header row
  // 2. Background image row
  // 3. Content row (empty because no heading/subheading/CTA in this HTML)
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''], // background image row
    [''] // content row
  ];

  // Create table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table block
  element.replaceWith(block);
}
