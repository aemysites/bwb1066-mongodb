/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec
  const headerRow = ['Cards (cards78)'];

  // Find all card sections (one for each card)
  // The immediate container for cards is [aria-label="flex-container"]
  let flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) flexContainer = element; // fallback if structure changes
  const cardSections = Array.from(flexContainer.querySelectorAll(':scope > section'));

  // Each card becomes a row
  const rows = cardSections.map(section => {
    // FIRST COLUMN: Image/icon
    // This is always the <img> inside a [aria-label="card-header"] span
    let img = section.querySelector('[aria-label="card-header"] img');
    // If not found, fallback to first <img> in section
    if (!img) img = section.querySelector('img');
    // SECOND COLUMN: Text (title + description + CTA)
    // Find heading (h3)
    const heading = section.querySelector('h3');
    // Find description (p)
    const desc = section.querySelector('p');
    // Find CTA: the <a> href from the card's root <a> and the text "Learn more"
    let ctaLink = null;
    let a = section.querySelector(':scope > a');
    if (a) {
      // Find the button with the text for CTA, if available
      const btn = a.querySelector('button');
      let label = 'Learn more';
      if (btn) {
        const span = btn.querySelector('.textlink-link-icon-class, [class*="textlink-link-icon-class"]');
        if (span && span.textContent.trim()) label = span.textContent.trim();
      }
      // Build anchor using the DOM anchor, not recreating
      ctaLink = a.cloneNode(false); // shallow clone, just <a>
      ctaLink.textContent = label;
    }
    // Compose text cell by referencing existing elements (do not clone)
    const cellContents = [];
    if (heading) cellContents.push(heading);
    if (desc) cellContents.push(desc);
    if (ctaLink) cellContents.push(ctaLink);
    // Defensive: fallback to all text if both heading/desc missing
    if (!heading && !desc) {
      // Use all text except image
      const textSpans = Array.from(section.querySelectorAll(':scope > a > span')).filter(s => !s.querySelector('img'));
      cellContents.push(...textSpans);
    }
    // Row is [image, text cell]
    return [img, cellContents];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
