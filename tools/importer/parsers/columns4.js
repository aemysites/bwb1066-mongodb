/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be EXACTLY one cell: ['Columns (columns4)']
  const headerRow = ['Columns (columns4)'];

  // Get all tab buttons (each is a column)
  const buttons = Array.from(element.querySelectorAll('button[automation-testid="bonsai-LogoTabs-LogoTab"]'));

  // Each button's visible content (the full button, not just the image) should go in a separate column
  // This keeps semantic meaning and allows for future variations
  const columns = buttons.map(btn => btn);

  // The block table: first row header, second row with all columns
  const rows = [
    headerRow,
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
