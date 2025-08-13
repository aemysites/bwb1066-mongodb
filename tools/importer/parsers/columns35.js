/* global WebImporter */
export default function parse(element, { document }) {
  // Find the CTA wrapper which contains the columns
  const ctaWrapper = element.querySelector('.DualCallToAction__CTAWrapper-sc-r0sng3-1');
  if (!ctaWrapper) return;
  // Find all CTA columns
  const ctaColumns = Array.from(ctaWrapper.querySelectorAll('.DualCallToAction__CTA-sc-r0sng3-2'));
  if (ctaColumns.length === 0) return;

  // To get a single header cell spanning all columns, the header row must be an array with a single cell
  const headerRow = ['Columns (columns35)'];
  // The second row contains the CTAs as columns
  const contentRow = ctaColumns;

  // Build the table with the correct structure
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
