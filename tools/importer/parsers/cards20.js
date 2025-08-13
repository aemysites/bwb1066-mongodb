/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matching the spec
  const headerRow = ['Cards (cards20)'];

  // Helper: extract image from background-image style
  function extractBgImage(div) {
    if (!div) return null;
    const style = div.getAttribute('style') || '';
    const match = style.match(/url\((['"]?)([^'")]+)\1\)/);
    if (match) {
      const img = document.createElement('img');
      img.src = match[2];
      img.alt = '';
      return img;
    }
    return null;
  }

  // Gather tables
  const cells = [headerRow];

  // Select all immediate .card-container children
  const cardContainers = element.querySelectorAll(':scope > .card-container');
  cardContainers.forEach(cardContainer => {
    // Select relevant sub-elements
    const card = cardContainer.querySelector('.card');
    if (!card) return;

    // Card link (for CTA)
    const link = card.querySelector('a');

    // Image (background)
    const bgDiv = card.querySelector('.h-200 .bg');
    const imgElem = extractBgImage(bgDiv);
    // If no image, keep cell null

    // Text block: title, description, date
    const contentDiv = card.querySelector('.p-20.h-max-220');
    let textElements = [];
    if (contentDiv) {
      // Use the actual existing elements for semantic correctness
      const title = contentDiv.querySelector('h3');
      if (title) textElements.push(title);
      const desc = contentDiv.querySelector('p');
      if (desc) textElements.push(desc);
      // Date (outside contentDiv, inside absolute bottom left)
      const absFooter = card.querySelector('.absolute.bottom.left');
      if (absFooter) {
        const small = absFooter.querySelector('small');
        if (small) textElements.push(small);
      }
    }

    // Wrap all text elements into a <div>, but reference their originals
    // If it is inside a link, wrap text in <a> w/ href
    let textCell;
    if (link) {
      // Only put text block inside link if link exists
      const textDiv = document.createElement('div');
      textElements.forEach(el => textDiv.appendChild(el));
      const linkElem = document.createElement('a');
      linkElem.href = link.href;
      // Preserve target
      if (link.hasAttribute('target')) linkElem.setAttribute('target', link.getAttribute('target'));
      linkElem.appendChild(textDiv);
      textCell = linkElem;
    } else {
      textCell = textElements;
    }

    // Add row
    cells.push([
      imgElem,
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
