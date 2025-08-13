/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the block name exactly
  const headerRow = ['Search'];

  // Find the relevant search form (by role)
  const form = element.querySelector('form[role="search"]');
  let queryIndexUrl = '';
  let placeholderText = '';
  let searchIcon = null;
  let foundText = [];

  if (form) {
    // Extract the form action as the query index URL
    queryIndexUrl = form.action || '';
    // Find the input placeholder text
    const input = form.querySelector('input[type="text"]');
    if (input && input.placeholder) {
      placeholderText = input.placeholder;
    }
    // Find search icon image (usually inside submit button)
    const iconBtn = form.querySelector('button[type="submit"] img');
    if (iconBtn) {
      searchIcon = iconBtn;
    }
  }

  // Fallback for missing query index URL
  if (!queryIndexUrl) {
    queryIndexUrl = 'https://www.mongodb.com/search';
  }

  // Compose cell content: include search icon, placeholder text, and the query index link
  const cellContent = [];

  // Add search icon if present
  if (searchIcon) {
    cellContent.push(searchIcon);
  }

  // Add placeholder text if present
  if (placeholderText) {
    // Keep semantic meaning: present placeholder as input element
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.placeholder = placeholderText;
    cellContent.push(inputEl);
  }

  // Add the search query index as a link
  const urlLink = document.createElement('a');
  urlLink.href = queryIndexUrl;
  urlLink.textContent = queryIndexUrl;
  urlLink.target = '_blank';
  cellContent.push(urlLink);

  // Compose table cells
  const cells = [
    headerRow,
    [cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
