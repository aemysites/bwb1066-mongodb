/* global WebImporter */
export default function parse(element, { document }) {
  // --- Table Header ---
  const headerRow = ['Hero (hero55)'];

  // --- Background Image Row ---
  let backgroundCell = '';
  const bgDiv = element.querySelector('.absolute.w-full.h-full.lazyloaded');
  if (bgDiv && bgDiv.style && bgDiv.style.backgroundImage) {
    const bgImage = bgDiv.style.backgroundImage;
    // Extract the url from background-image CSS property
    if (bgImage.startsWith('url(')) {
      const url = bgImage.slice(5, -2);
      if (url && url !== 'false') {
        const img = document.createElement('img');
        img.src = url;
        backgroundCell = img;
      }
    }
  }

  // --- Content Row ---
  // Look for the deepest child containing the actual hero content
  let heroContent = null;
  // Direct child with fl.fl-column is standard, but robust fallback:
  const possibleContentWrappers = Array.from(element.querySelectorAll(':scope *'));
  heroContent = possibleContentWrappers.find(
    el => el.classList && el.classList.contains('fl') && el.classList.contains('fl-column')
  );
  if (!heroContent) {
    heroContent = possibleContentWrappers.find(
      el => el.classList && (el.classList.contains('fl-row') || el.classList.contains('txt-center'))
    );
  }
  // If still not found, fallback to first section or inner div
  if (!heroContent) {
    heroContent = element.querySelector('section') || element;
  }

  // Collect all non-empty child elements and text nodes in order, referencing originals
  const contentNodes = [];
  Array.from(heroContent.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Only include elements with visible text (ignore empty headings, spans, etc)
      if (node.textContent && node.textContent.trim() !== '' && node.textContent.trim() !== '[object Object]') {
        contentNodes.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // If it's a text node and non-empty
      const text = node.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        contentNodes.push(p);
      }
    }
  });
  // In extremely rare cases, if heroContent itself is a heading/text node, include it
  if (
    contentNodes.length === 0 &&
    heroContent.textContent &&
    heroContent.textContent.trim() !== '' &&
    heroContent.textContent.trim() !== '[object Object]'
  ) {
    const p = document.createElement('p');
    p.textContent = heroContent.textContent.trim();
    contentNodes.push(p);
  }
  // If still empty, pass empty string
  const contentCell = contentNodes.length > 0 ? contentNodes : '';

  // --- Compose table ---
  const cells = [
    headerRow,
    [backgroundCell],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
