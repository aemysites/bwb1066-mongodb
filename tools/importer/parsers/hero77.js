/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as in the example
  const headerRow = ['Hero (hero77)'];

  // Row 2: Background Image (optional)
  // Find the <img> for the illustration
  let img = element.querySelector('img');
  const imageRow = [img ? img : ''];

  // Row 3: Title, Subheading, CTA (all inside text container)
  // Find the immediate container with headline, subheading, CTA
  let textContent = '';
  let textContainer;
  // The main section usually has a child div with two columns
  const mainDiv = element.querySelector(':scope > div');
  if (mainDiv) {
    const cols = mainDiv.querySelectorAll(':scope > div');
    // The last column contains text
    if (cols.length > 1) {
      textContainer = cols[1];
    } else {
      // fallback if only one div, could be nested
      textContainer = mainDiv;
    }
  }
  // Safeguard: if not found, fallback to the element itself
  if (!textContainer) textContainer = element;
  const textRow = [textContainer];

  // Compose and insert table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
