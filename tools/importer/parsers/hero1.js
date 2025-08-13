/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const headerRow = ['Hero (hero1)'];

  // --- Background Image row ---
  // Find the image URL from inline style on .header-image
  let bgImgUrl = '';
  const bgImgDiv = element.querySelector('.header-image');
  if (bgImgDiv && bgImgDiv.style && bgImgDiv.style.backgroundImage) {
    const match = bgImgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (match && match[1]) {
      bgImgUrl = match[1];
    }
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }
  const bgImgRow = [bgImgEl ? bgImgEl : ''];

  // --- Content row ---
  // Get hero text, description, and links, reusing existing elements
  const contentEls = [];
  const headerInfo = element.querySelector('.header-info');
  if (headerInfo) {
    // Title (hero-text)
    const heroText = headerInfo.querySelector('.hero-text');
    if (heroText) {
      // Use an <h1> for the block headline, as in the example
      const h1 = document.createElement('h1');
      h1.textContent = heroText.textContent.trim();
      contentEls.push(h1);
    }
    // Description (hero-description)
    const heroDesc = headerInfo.querySelector('.hero-description');
    if (heroDesc) {
      // Use a <p> for the description
      const p = document.createElement('p');
      p.textContent = heroDesc.textContent.trim();
      contentEls.push(p);
    }
  }
  // CTA buttons (all links in .hero-links)
  const heroLinks = element.querySelector('.hero-links');
  if (heroLinks) {
    // Reference the original <a> elements directly
    const links = Array.from(heroLinks.querySelectorAll('a'));
    if (links.length > 0) {
      contentEls.push(...links);
    }
  }
  const contentRow = [contentEls];

  // Build and replace block
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
