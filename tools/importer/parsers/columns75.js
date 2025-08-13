/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as required
  const headerRow = ['Columns (columns75)'];

  // Get all first-level child divs (should be four: logo/info, About, Support, Social)
  const footerColumns = Array.from(element.querySelectorAll(':scope > div'));

  // Build the content row, one cell per expected column, pulling all direct children (including text) from each
  function extractCellContent(div) {
    const nodes = [];
    Array.from(div.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        nodes.push(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node);
      }
    });
    if (nodes.length === 0) return '';
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  // Defensive: always output 4 columns, fill missing with ''
  const contentRow = [];
  for (let i = 0; i < 4; i++) {
    if (footerColumns[i]) {
      contentRow.push(extractCellContent(footerColumns[i]));
    } else {
      contentRow.push('');
    }
  }

  // Build and replace
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(block);
}
