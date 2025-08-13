/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row per block spec
  const headerRow = ['Hero (hero80)'];

  // 2. Background image row
  // Locate the div with a background image style or data-bg attribute
  let bgImageUrl = '';
  let bgDiv = null;
  // Find the first child div with background image or data-bg
  const divs = element.querySelectorAll(':scope > div');
  for (const div of divs) {
    if (div.hasAttribute('data-bg') && div.getAttribute('data-bg')) {
      bgDiv = div;
      bgImageUrl = div.getAttribute('data-bg');
      break;
    } else if (
      div.style &&
      div.style.backgroundImage &&
      div.style.backgroundImage.includes('url(')
    ) {
      bgDiv = div;
      const match = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        bgImageUrl = match[1];
        break;
      }
    }
  }
  let bgImgEl = null;
  if (bgImageUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImageUrl;
    bgImgEl.alt = '';
  }
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // 3. Content row: grab all text and structure from header (title, subheading, cta)
  // This should be a single element containing all the hero text and CTA
  // Find the header block (usually the 'header' tag)
  let contentBlock = null;
  const headerEl = element.querySelector('header');
  if (headerEl) {
    // Look for the main text block inside header
    const txtBlock = headerEl.querySelector('.header-text-block');
    if (txtBlock) {
      contentBlock = txtBlock;
    } else {
      contentBlock = headerEl;
    }
  } else {
    // fallback: just use the element
    contentBlock = element;
  }

  // Defensive: If contentBlock is element, don't include the background image for content
  // (contentBlock will contain the header text, not the image background div)
  const contentRow = [contentBlock];

  // Compose table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}