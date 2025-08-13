/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Hero (hero56)'];

  // --- Extract background image for row 2 ---
  let bgImgCell = '';
  const bgDiv = element.querySelector('.absolute.w-full.h-full .absolute.w-full.h-full');
  let bgUrl = '';
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const match = bgDiv.style.backgroundImage.match(/url\(("|')?([^)"]+)("|')?\)/);
    if (match && match[2] && match[2] !== 'false') {
      bgUrl = match[2];
    }
  }
  if (bgUrl) {
    const img = document.createElement('img');
    img.src = bgUrl;
    bgImgCell = img;
  }

  // --- Extract all non-empty, relevant children for row 3 (content) ---
  let contentCell = '';
  const section = element.querySelector('section');
  if (section) {
    // The content is in the deepest div inside section
    let mainContentDiv = null;
    const divs = section.querySelectorAll('div');
    if (divs.length > 0) {
      mainContentDiv = divs[divs.length - 1];
    }
    if (mainContentDiv) {
      // Gather all non-empty child elements and non-empty text nodes
      const contentArr = [];
      Array.from(mainContentDiv.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Skip headings, paragraphs, etc. that are empty
          if (node.textContent && node.textContent.trim() && node.textContent.trim() !== '[object Object]') {
            contentArr.push(node);
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Non-empty, non-whitespace, non-[object Object] text
          const txt = node.textContent.trim();
          if (txt && txt !== '[object Object]') {
            contentArr.push(document.createTextNode(txt));
          }
        }
      });
      // If there is meaningful content, use it
      if (contentArr.length > 0) {
        contentCell = contentArr;
      } else {
        // Fallback: section text (should be empty, but just in case)
        contentCell = section.innerText.trim();
      }
    }
  }

  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
