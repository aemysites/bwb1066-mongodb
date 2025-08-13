/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as specified
  const headerRow = ['Columns (columns69)'];

  // 2. Identify columns in the main block (skip SVG divider)
  const mainRowDivs = Array.from(element.querySelectorAll(':scope > div > div'));
  // Confirm we have at least two usable columns
  if (!mainRowDivs || mainRowDivs.length < 2) {
    // Fallback: replace with header only
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // The typical structure is:
  // [leftCol, divider, rightCol] but sometimes SVG divider may be missing
  // If there are only two divs, use both. If three, skip the middle (SVG)
  let leftCol, rightCol;
  if (mainRowDivs.length === 3) {
    leftCol = mainRowDivs[0];
    rightCol = mainRowDivs[2];
  } else {
    leftCol = mainRowDivs[0];
    rightCol = mainRowDivs[1];
  }

  // LEFT COLUMN: logo and stats
  const leftColMain = leftCol.querySelector('.flex.flex-col');
  const leftCellContent = [];
  if (leftColMain) {
    // Logo
    const logoImg = leftColMain.querySelector('img');
    if (logoImg) leftCellContent.push(logoImg);
    // Stats (all .css-pulw89)
    const statsBlocks = Array.from(leftColMain.querySelectorAll('.css-pulw89'));
    statsBlocks.forEach(stat => leftCellContent.push(stat));
  } else {
    // Fallback: push leftCol itself
    leftCellContent.push(leftCol);
  }

  // RIGHT COLUMN: eyebrow, quote, CTA
  const rightCellContent = [];
  // Eyebrow (category)
  const eyebrow = rightCol.querySelector('[automation-testid="flora-Eyebrow"]');
  if (eyebrow) rightCellContent.push(eyebrow);
  // Quote
  const quote = rightCol.querySelector('.font-normal');
  if (quote) rightCellContent.push(quote);
  // CTA Lockup (all CTAs)
  const ctaLockup = rightCol.querySelector('.css-1fel3o7');
  if (ctaLockup) rightCellContent.push(ctaLockup);

  // If right column is otherwise empty, fallback to rightCol itself
  if (!rightCellContent.length) {
    rightCellContent.push(rightCol);
  }

  // 3. Compose the 2-column row for the block
  const columnsRow = [leftCellContent, rightCellContent];

  // 4. Create the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with the new block table
  element.replaceWith(table);
}
