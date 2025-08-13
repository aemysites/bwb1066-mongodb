/* global WebImporter */
export default function parse(element, { document }) {
  // First header row: must be a single cell with the block name
  const blockHeader = ['Table (bordered)'];

  // Second row: the true table column headers
  let columnHeaders = [];
  const listFilters = element.querySelector('.list-filters');
  if (listFilters) {
    columnHeaders = Array.from(listFilters.children).map(c => c.textContent.trim());
  }
  if (columnHeaders.length === 0) {
    columnHeaders = ['Topic', 'Views'];
  }

  // Extract all .list-item blocks (forum posts)
  const contentList = element.querySelector('.content-list');
  if (!contentList) return;
  const listItems = Array.from(contentList.querySelectorAll(':scope > .list-item'));

  // Compose the table rows
  const dataRows = listItems.map(item => {
    // Topic cell
    const titleViews = item.querySelector('.title-views');
    let topicCell = [];
    if (titleViews) {
      const postTitle = titleViews.querySelector('.post-title');
      if (postTitle) {
        Array.from(postTitle.childNodes).forEach(node => topicCell.push(node));
      }
    }
    // Category and tags
    const catTags = item.querySelector('.cat-tags');
    if (catTags) {
      const catContainer = catTags.querySelector('.cat-container');
      if (catContainer) {
        Array.from(catContainer.childNodes).forEach(n => {
          if (n.nodeType === 1 && n.classList.contains('cat-color')) return;
          topicCell.push(document.createTextNode(' '));
          topicCell.push(n);
        });
      }
      catTags.querySelectorAll('.post-tags').forEach(tagDiv => {
        topicCell.push(document.createTextNode(' '));
        Array.from(tagDiv.childNodes).forEach(tagNode => {
          topicCell.push(tagNode);
        });
      });
    }
    // Remove leading/trailing whitespace nodes
    while (topicCell.length && topicCell[0].nodeType === Node.TEXT_NODE && !topicCell[0].textContent.trim()) topicCell.shift();
    while (topicCell.length && topicCell[topicCell.length - 1].nodeType === Node.TEXT_NODE && !topicCell[topicCell.length - 1].textContent.trim()) topicCell.pop();
    if (topicCell.length === 0) topicCell = [''];
    // Views cell
    let viewsCell = '';
    if (titleViews) {
      const postViews = titleViews.querySelector('.post-views');
      if (postViews) {
        viewsCell = postViews.textContent.trim();
      }
    }
    return [topicCell, viewsCell];
  });

  // Compose the final cells array: single header row, then column header row, then data
  const cells = [[blockHeader[0]], columnHeaders, ...dataRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
