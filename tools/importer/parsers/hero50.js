/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image from style or data-bg attribute
  let bgImgUrl = '';
  const bgDiv = element.querySelector('[style*="background-image"]');
  if (bgDiv) {
    // Prefer data-bg if available
    bgImgUrl = bgDiv.getAttribute('data-bg') || '';
    if (!bgImgUrl) {
      // Fallback to extract from style
      const match = (bgDiv.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) bgImgUrl = match[1];
    }
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    // Reference existing image if it matches, otherwise create new
    // We check if the background image is the same as the <img> inside
    const imgInHeader = element.querySelector('header img');
    if (imgInHeader && imgInHeader.src === bgImgUrl) {
      bgImgEl = imgInHeader;
    } else {
      bgImgEl = document.createElement('img');
      bgImgEl.src = bgImgUrl;
    }
  }

  // Extract hero text and CTAs
  const header = element.querySelector('header');
  let heroContent = [];
  if (header) {
    // Find the block with class 'header-text-block' (contains text)
    const textBlock = header.querySelector('.header-text-block');
    if (textBlock) {
      const inner = textBlock.querySelector('div');
      if (inner) {
        heroContent = [...inner.children]; // Reference all direct children (small, h1, h4, etc.)
      }
      // Add CTAs if present
      const ctaBlock = textBlock.querySelector('.ImageHeader__ActionContainer-sc-nl7yxk-2');
      if (ctaBlock && ctaBlock.children.length) {
        heroContent = heroContent.concat([...ctaBlock.children]);
      }
    }
  }

  // Build the table as specified: 1 column, 3 rows
  const cells = [
    ['Hero (hero50)'],
    [bgImgEl ? bgImgEl : ''],
    [heroContent.length ? heroContent : '']
  ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
