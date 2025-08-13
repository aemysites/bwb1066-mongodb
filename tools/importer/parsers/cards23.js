/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in example
  const cells = [
    ['Cards (cards23)']
  ];

  // Each card is a section under the flex-container
  const cardSections = element.querySelectorAll(':scope section');

  cardSections.forEach(section => {
    // Image/Icon extraction (first cell)
    let image = null;
    const imgContainer = section.querySelector('span[aria-label="card-header"]');
    if (imgContainer) {
      image = imgContainer.querySelector('img');
    }

    // Text cell (second cell): heading, desc, CTA
    const textCellContent = [];
    // Heading (h3)
    const heading = section.querySelector('h3');
    if (heading) textCellContent.push(heading);
    // Description (p)
    const desc = section.querySelector('p');
    if (desc) textCellContent.push(desc);
    // CTA: link text ("Read White Paper"), as a link to the card
    // The CTA is a button within the anchor, but we want the anchor href & text
    const anchor = section.querySelector('a');
    if (anchor) {
      // Find the CTA text inside button
      const ctaBtn = anchor.querySelector('button');
      if (ctaBtn) {
        const ctaTextSpan = ctaBtn.querySelector('.textlink-link-icon-class');
        if (ctaTextSpan && anchor.href) {
          // Create a new <a> referencing the existing document
          const ctaLink = document.createElement('a');
          ctaLink.href = anchor.href;
          ctaLink.textContent = ctaTextSpan.textContent;
          textCellContent.push(ctaLink);
        }
      }
    }

    // Add to cells array
    cells.push([
      image,
      textCellContent
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
