/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children
  const topChildren = Array.from(element.querySelectorAll(':scope > div'));
  // Guard against unexpected structure
  if (topChildren.length < 2) {
    // Not enough structure to build block, exit
    return;
  }

  // The left/center area with text and CTA
  const textBlock = topChildren[0];
  // The right area with the image (decorative)
  const imageBlock = topChildren[1];

  // ===== IMAGE ROW =====
  // Find the image in the block
  let img = null;
  // Look for an <img> element anywhere inside imageBlock
  const imgEl = imageBlock.querySelector('img');
  if (imgEl) {
    img = imgEl;
  }

  // ===== CONTENT ROW =====
  // We'll collect headline(s), description, CTA(s)
  const fragment = document.createDocumentFragment();
  // Headline(s)
  // First headline (may be in a mark)
  const headline1 = textBlock.querySelector('div[class*="169fdbi"] h1');
  if (headline1) {
    fragment.appendChild(headline1);
  }
  // Second headline (may be styled differently)
  const headline2 = textBlock.querySelector('div[class*="17aefia"] h1');
  if (headline2 && headline2 !== headline1) {
    fragment.appendChild(headline2);
  }
  // Description/paragraph
  const desc = textBlock.querySelector('div[class*="131q3t1"]');
  if (desc) {
    fragment.appendChild(desc);
  }
  // CTA buttons/links
  const ctaContainer = textBlock.querySelector('div[class*="6gzj7t"]');
  if (ctaContainer) {
    // All links in the CTA area
    const links = Array.from(ctaContainer.querySelectorAll('a'));
    links.forEach(link => {
      fragment.appendChild(link);
    });
  }

  // Block table construction
  const headerRow = ['Hero (hero48)']; // Must match example exactly
  const imageRow = [img ? img : ''];
  // If nothing in fragment, don't append empty row
  const contentRow = [fragment.childNodes.length > 0 ? fragment : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
