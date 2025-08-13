/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const headerRow = ['Hero (hero58)'];

  // --- BACKGROUND IMAGE ROW ---
  // The background SVG is in a div.absolute > img. The only other <img> is the hero illustration.
  // We want the SVG as the background. Let's find it robustly:
  let bgImg = null;
  const bgImgDiv = element.querySelector('div.absolute');
  if (bgImgDiv) {
    const img = bgImgDiv.querySelector('img');
    if (img) bgImg = img;
  }

  // --- CONTENT ROW ---
  // The header/text content is inside a <header> element, with text and CTAs.
  // We want to gather these (using their current element refs):
  let contentEls = [];
  const header = element.querySelector('header');
  if (header) {
    // The superscript is <small>, headline is <h1>, subheading is <h4>, and CTA is .ImageHeader__ActionContainer-sc-nl7yxk-2
    const textBlock = header.querySelector('.header-text-block') || header;
    // Gather text elements, in order:
    const small = textBlock.querySelector('small');
    if (small) contentEls.push(small);
    const h1 = textBlock.querySelector('h1');
    if (h1) contentEls.push(h1);
    const h4 = textBlock.querySelector('h4');
    if (h4) contentEls.push(h4);
    // The CTA container is usually a div holding a link/button
    const ctaContainer = textBlock.querySelector('.ImageHeader__ActionContainer-sc-nl7yxk-2');
    if (ctaContainer) contentEls.push(ctaContainer);
  }
  // Fallback: if header not found, use the element's text content
  if (contentEls.length === 0) {
    contentEls = [element];
  }

  // Compose the table: 1 column, 3 rows.
  const cells = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentEls],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
