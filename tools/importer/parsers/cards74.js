/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards74)'];
  const cells = [headerRow];

  // Each direct child div is a card
  const cardWrappers = element.querySelectorAll(':scope > div');
  cardWrappers.forEach((cardWrapper) => {
    // The card structure is always: [text & image container] + [link CTA]
    // Find content container
    const contentBlock = cardWrapper.querySelector('.css-1fedho7');
    let imgCell = null;
    let textCellFrag = document.createDocumentFragment();

    // Pull image/icon
    if (contentBlock) {
      // Image is in .css-1f9qc18 or its descendants
      const img = contentBlock.querySelector('.css-1f9qc18 img');
      if (img) {
        imgCell = img;
      } else {
        // fallback: any <img> in content block
        const imgFallback = contentBlock.querySelector('img');
        if (imgFallback) imgCell = imgFallback;
      }
    }

    // Text content:
    if (contentBlock) {
      const title = contentBlock.querySelector('h3');
      if (title) {
        textCellFrag.appendChild(title);
      }
      const description = contentBlock.querySelector('span.css-1dxzy5j');
      if (description) {
        if (title) textCellFrag.appendChild(document.createElement('br'));
        textCellFrag.appendChild(description);
      }
    }

    // CTA link, after content block, direct child of card or last child
    let link = null;
    // Try cardWrapper > a, or next sibling after contentBlock
    link = cardWrapper.querySelector('a');
    if (link) {
      // Keep only the link in context (not a clone)
      textCellFrag.appendChild(document.createElement('br'));
      textCellFrag.appendChild(link);
    }

    // If no image found, use empty string to keep columns consistent
    cells.push([imgCell || '', textCellFrag]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
