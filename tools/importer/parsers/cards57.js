/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards57) header, exactly as in the example
  const headerRow = ['Cards (cards57)'];

  // Get all direct <span> children, each wrapping a card <a>
  const cardSpans = Array.from(element.querySelectorAll(':scope > span'));
  
  // Prepare card rows
  const rows = cardSpans.map(cardSpan => {
    // Each card is an <a> inside span
    const cardLink = cardSpan.querySelector('a');
    if (!cardLink) return ['', []];

    // --- IMAGE CELL ---
    // Get the <figure> if present, else <img>
    let imageCell = '';
    const figure = cardLink.querySelector('figure');
    const img = cardLink.querySelector('img');
    if (figure) {
      imageCell = figure;
    } else if (img) {
      imageCell = img;
    }

    // --- TEXT CELL ---
    // Gather all text elements in required order
    const contentSpan = cardLink.querySelector('.css-15ss6cm');
    const textContent = [];
    if (contentSpan) {
      // Title (h5)
      const h5 = contentSpan.querySelector('h5');
      if (h5) textContent.push(h5);
      // Subtitle (span) - professor role
      const subtitle = contentSpan.querySelector('.css-mz5iyk');
      if (subtitle) textContent.push(subtitle);
      // Description (p)
      const desc = contentSpan.querySelector('p');
      if (desc) textContent.push(desc);
      // CTA (button) as link, use cardLink.href
      const button = contentSpan.querySelector('button');
      if (button && cardLink.href) {
        const link = document.createElement('a');
        link.href = cardLink.href;
        link.textContent = button.textContent.trim();
        link.target = '_blank';
        textContent.push(link);
      }
    }
    return [imageCell, textContent];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}