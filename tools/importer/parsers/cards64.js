/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly as required
  const headerRow = ['Cards (cards64)'];
  const cells = [headerRow];

  // Defensive: Find all .horizontal-card children
  const cards = Array.from(element.querySelectorAll('.horizontal-card'));

  cards.forEach(card => {
    // First cell: image/icon
    let img = card.querySelector('.card-img-circular');

    // Second cell: text content - preserve structure and reference existing elements where possible
    const textContent = document.createElement('div');
    textContent.style.display = 'flex';
    textContent.style.flexDirection = 'column';

    // Title (often styled)
    const title = card.querySelector('.card-title');
    if (title && title.textContent && title.textContent.trim()) {
      // Use <strong> for bolded heading, matching visual in screenshot
      const titleElem = document.createElement('strong');
      titleElem.textContent = title.textContent.trim();
      textContent.appendChild(titleElem);
    }
    // Description (optional)
    const description = card.querySelector('.card-info');
    if (description && description.textContent && description.textContent.trim()) {
      // Use a <div> for the description
      const descElem = document.createElement('div');
      descElem.textContent = description.textContent.trim();
      textContent.appendChild(descElem);
    }
    // CTA link (optional)
    const cardLinkDiv = card.querySelector('.card-link');
    if (cardLinkDiv) {
      const link = cardLinkDiv.querySelector('a');
      if (link) {
        // Reference original <a>
        textContent.appendChild(link);
      }
    }

    // Add row only if we have either an image or text content
    if (img || textContent.childNodes.length > 0) {
      cells.push([img, textContent]);
    }
  });

  // Only create the block if there are at least header and one card
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
