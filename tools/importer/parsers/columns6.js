/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches block name and variant
  const headerRow = ['Columns (columns6)'];

  // 2. Get the columns container (direct child of section)
  // It may have class .fl.fl-justify-center (per given HTML)
  const columnsContainer = element.querySelector('.fl.fl-justify-center');
  if (!columnsContainer) {
    // Defensive: If not found, nothing to do
    return;
  }

  // 3. Get all direct child column wrappers
  const columnDivs = Array.from(columnsContainer.children);

  // 4. For each column, collect relevant content in order
  const cellsRow = columnDivs.map((col) => {
    const frag = document.createDocumentFragment();
    // a) Get image/icon at top
    const iconDiv = col.querySelector('div.h-50');
    if (iconDiv) {
      const img = iconDiv.querySelector('img');
      if (img) frag.appendChild(img);
    }
    // b) Get heading (h4)
    const heading = col.querySelector('h4');
    if (heading) frag.appendChild(heading);
    // c) Get description text (div.dark-gray.fnt-18)
    const desc = col.querySelector('div.dark-gray.fnt-18');
    if (desc) frag.appendChild(desc);
    return frag;
  });

  // 5. Table rows: header, then content row
  const cells = [
    headerRow,
    cellsRow
  ];

  // 6. Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
