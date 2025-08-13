/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure dynamic extraction, not hardcoding
  // 1. Header row: table header matches example
  const headerRow = ['Video'];

  // 2. Extract key video content and all text
  // Find the main video container, which may include iframe and caption/text
  const contentElements = [];

  // Extract iframe (the video)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    // As per instructions, iframe src should be a link
    const videoLink = document.createElement('a');
    videoLink.href = iframe.src;
    videoLink.textContent = iframe.src;
    contentElements.push(videoLink);
  }

  // Extract all visible text except empty or duplicate src
  // Only add unique, meaningful text elements
  const textNodes = Array.from(element.querySelectorAll('*'))
    .filter((el) => el.childNodes.length && Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE))
    .map((el) => el.textContent.trim())
    .filter((txt) => txt && (!iframe || txt !== iframe.src));

  textNodes.forEach((txt) => {
    const p = document.createElement('p');
    p.textContent = txt;
    contentElements.push(p);
  });

  // Ensure at least an empty string if nothing found
  if (contentElements.length === 0) {
    contentElements.push('');
  }

  // 3. Compose the cells array: first row (header), second row (all video and text content in one cell)
  const cells = [headerRow, [contentElements]];

  // 4. Replace original element with structured block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
