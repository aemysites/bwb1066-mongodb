/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion42)'];
  const rows = [headerRow];

  // Each accordion item is a .Details__Container-sc-wfooue-0
  const accordionItems = Array.from(element.querySelectorAll('.Details__Container-sc-wfooue-0'));

  accordionItems.forEach(item => {
    // Title cell: find the first <h3> inside .fl-1 (the question)
    const title = item.querySelector('.fl-1 > h3');
    // Content cell: find the .overflow-hidden .fl-wrap (the answer)
    const contentWrap = item.querySelector('.overflow-hidden .fl-wrap');
    let contentCell;
    if (contentWrap) {
      // If fl-wrap contains only one <div>, get its children; else use all children of fl-wrap
      if (contentWrap.children.length === 1 && contentWrap.children[0].tagName === 'DIV') {
        contentCell = Array.from(contentWrap.children[0].children);
      } else {
        contentCell = Array.from(contentWrap.children);
      }
      // If there are no children, fallback to its textContent
      if (!contentCell || contentCell.length === 0) {
        if (contentWrap.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = contentWrap.textContent.trim();
          contentCell = [p];
        } else {
          contentCell = [''];
        }
      }
    } else {
      contentCell = [''];
    }
    rows.push([title, contentCell]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
