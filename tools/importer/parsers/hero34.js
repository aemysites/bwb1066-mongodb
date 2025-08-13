/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per instructions and markdown
  const headerRow = ['Hero (hero34)'];

  // --- Content Row 1: Background Image ---
  // Find a div with a background-image style as a direct child
  let bgImageUrl = '';
  const bgDiv = Array.from(element.children).find(el => el.tagName === 'DIV' && el.style.backgroundImage);
  if (bgDiv && bgDiv.style.backgroundImage) {
    // Extract clean URL from background-image: url('...');
    const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
    if (match && match[1]) {
      bgImageUrl = match[1];
    }
  }

  let backgroundImg = null;
  if (bgImageUrl) {
    backgroundImg = document.createElement('img');
    backgroundImg.src = bgImageUrl;
    backgroundImg.alt = '';
    // No width/height since source does not specify, but could be styled by CSS
  }

  // --- Content Row 2: Headings and text ---
  // Find the first heading (h1) that is a child of this block
  const heading = Array.from(element.children).find(el => el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4');
  let textContainer = null;
  if (heading) {
    textContainer = document.createElement('div');
    textContainer.appendChild(heading);
  }

  // Compose the rows for the table
  const rows = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [textContainer ? textContainer : '']
  ];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
