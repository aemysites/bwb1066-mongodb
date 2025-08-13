/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion49)'];

  // Gather all the accordion items - each is a direct child div with class (css-157zt8n)
  const accordionItems = element.querySelectorAll(':scope > .css-157zt8n');
  const rows = [headerRow];

  accordionItems.forEach(item => {
    // The title button (contains h6 or just text)
    const button = item.querySelector('button');
    let title = null;
    if (button) {
      // If there is a heading (h6), use it as is; else grab all button content except SVG
      const h6 = button.querySelector('h6');
      if (h6) {
        title = h6;
      } else {
        // Remove SVG if present, so only the textual part is used
        const btnClone = button.cloneNode(true);
        const svg = btnClone.querySelector('svg');
        if (svg) svg.remove();
        // Use all HTML except the SVG (so any formatting is preserved)
        // We extract its child nodes as an array for robustness
        title = Array.from(btnClone.childNodes);
      }
    }

    // The content div (expanded panel)
    const contentDiv = item.querySelector('.css-wrn1hq');

    // If contentDiv is missing, use empty string to avoid errors
    rows.push([
      title || '',
      contentDiv || document.createTextNode('')
    ]);
  });

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
