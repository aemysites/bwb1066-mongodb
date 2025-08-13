/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Cards (cards70)'];

  // Get the grid of card divs
  const grid = element.querySelector(':scope > div > div');
  if (!grid) return;

  // Each card div is a direct child of grid
  const cardDivs = Array.from(grid.children);
  const rows = [headerRow];

  cardDivs.forEach(card => {
    // Image/Icon extraction
    let imgEl = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // Text cell extraction (title and description)
    const textCell = [];
    const title = card.querySelector('h6');
    if (title) textCell.push(title);
    const desc = card.querySelector('span');
    if (desc) textCell.push(desc);
    // If neither title nor desc found, add fallback (should NOT happen in provided HTML)

    // Only add imgEl if present; if not, cell will be null and createTable supports this.
    rows.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
