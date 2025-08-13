/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in example
  const headerRow = ['Columns (columns7)'];

  // There are two columns: left (text+button) and right (video)
  // Left column
  const leftCol = element.querySelector(':scope > .css-j58hij');
  let leftCell = [];
  if (leftCol) {
    // Append all direct children of leftCol for full content (h3, span, div[button])
    leftCell = Array.from(leftCol.childNodes).filter(
      n => (n.nodeType === 1 && n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE') ||
           (n.nodeType === 3 && n.textContent.trim())
    );
  }

  // Right column: contains a Wistia video player (custom tag, not iframe)
  // Per requirements, we convert non-img with src/media-id to a link
  const rightCol = element.querySelector(':scope > .css-pplbvd');
  let rightCell = [];
  if (rightCol) {
    // Try to find a wistia-player
    const wistiaEl = rightCol.querySelector('[media-id]');
    if (wistiaEl && wistiaEl.getAttribute('media-id')) {
      const mediaId = wistiaEl.getAttribute('media-id');
      // Create a link referencing the wistia video
      const wistiaLink = document.createElement('a');
      wistiaLink.href = `https://home.wistia.com/medias/${mediaId}`;
      wistiaLink.textContent = 'Watch Video';
      rightCell.push(wistiaLink);
    } else {
      // Fallback: if content, append it
      rightCell = Array.from(rightCol.childNodes).filter(
        n => (n.nodeType === 1 && n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE') ||
             (n.nodeType === 3 && n.textContent.trim())
      );
    }
  }

  // Compose cells for columns block, as in the markdown structure (header + one row with two columns)
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
