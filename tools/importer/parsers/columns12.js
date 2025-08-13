/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main green callout area (heading, subheading, form)
  const mainContainer = element.querySelector('.relative.fl.fl-justify-around.fl-items-center.fl-wrap.w-max-1000');

  // Left column: Contains heading, subheading, and form
  let leftColContent = [];
  if (mainContainer) {
    // Find the info box (heading + subheading)
    const infoBox = mainContainer.querySelector('.fl-1');
    if (infoBox) leftColContent.push(infoBox);
    // Find the form
    const form = mainContainer.querySelector('form');
    if (form) leftColContent.push(form);
  }

  // Find the area with the two white cards
  const cardsContainer = element.querySelector('.relative.z-index-10.fl.fl-justify-around.fl-wrap.w-max-1100');

  // Right column: Both white cards as an array
  let rightColContent = [];
  if (cardsContainer) {
    const cards = Array.from(cardsContainer.querySelectorAll(':scope > div.bg-white.shadow.radius'));
    rightColContent = cards;
  }

  // Table header must match exactly
  const headerRow = ['Columns (columns12)'];
  // Table content row: each column is an array of referenced elements (not clones)
  const contentRow = [leftColContent, rightColContent];

  // Create block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(block);
}
