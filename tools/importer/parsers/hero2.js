/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero2)'];

  // Row 2: background image (optional)
  let bgImgUrl = '';
  // Find header's background image
  const headerDiv = element.querySelector('header');
  if (headerDiv) {
    const absDivs = headerDiv.querySelectorAll('.absolute.w-full.h-full .lazyloaded[data-bg]');
    // Find the first data-bg that is not 'false'
    for (const bgDiv of absDivs) {
      const probed = bgDiv.getAttribute('data-bg');
      if (probed && probed !== 'false' && probed !== '') {
        bgImgUrl = probed;
        break;
      }
    }
  }
  let bgImgEl = '';
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = 'Hero background';
  }
  const backgroundRow = [bgImgEl || ''];

  // Row 3: Title (h1), subheading, CTA (if exists)
  // We want the main content wrapper (the .relative.txt-center child)
  let contentCell = '';
  if (headerDiv) {
    const contentDiv = headerDiv.querySelector('.relative.w-full.w-max-770.p-20.txt-center');
    if (contentDiv) {
      // Use contentDiv directly, as it contains h1 and other content
      contentCell = contentDiv;
    } else {
      // Fallback: just use headerDiv in worst case
      contentCell = headerDiv;
    }
  } else {
    // As a last resort, use the element itself
    contentCell = element;
  }
  const contentRow = [contentCell];

  // Compose table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
