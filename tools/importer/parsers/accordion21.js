/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, as in example
  const headerRow = ['Accordion (accordion21)'];
  // Get all accordion items (each .Details__Container-sc-wfooue-0.emWlgh)
  const accordions = Array.from(element.querySelectorAll('.Details__Container-sc-wfooue-0.emWlgh'));
  const rows = [headerRow];
  accordions.forEach((acc) => {
    // Title: always an h3 inside .fl-1
    const fl1 = acc.querySelector('.fl-1');
    let titleEl = null;
    if (fl1) {
      titleEl = fl1.querySelector('h3');
    }
    if (!titleEl) {
      // Fallback: empty div
      titleEl = document.createElement('div');
    }
    // Content: .overflow-hidden > .m-0.p-b-30.dark-gray.fl.fl-wrap
    let contentEl = null;
    const overflow = acc.querySelector('.overflow-hidden');
    if (overflow) {
      contentEl = overflow.querySelector('.m-0.p-b-30.dark-gray.fl.fl-wrap');
      // Check for empty content (all only empty p's)
      if (contentEl && contentEl.textContent.trim() === '') {
        contentEl = document.createElement('div');
      }
    } else {
      contentEl = document.createElement('div');
    }
    // Reference elements directly; do not clone or create unless necessary
    rows.push([titleEl, contentEl]);
  });
  // Create block table with proper header
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element (do not return)
  element.replaceWith(block);
}
