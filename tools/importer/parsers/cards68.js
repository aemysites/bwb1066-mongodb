/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards68)'];
  const rows = [headerRow];

  // Find the container holding the FlashCards
  const cardsContainer = element.querySelector('[aria-label="flex-container"]');
  if (!cardsContainer) return;

  // Select all FlashCard sections inside the container
  const cardSections = Array.from(cardsContainer.querySelectorAll('section[automation-testid="flora-FlashCard"]'));
  cardSections.forEach((section) => {
    // FIRST CELL: Icon or image
    let imageEl = null;
    const iconSpan = section.querySelector('.css-tbbvni');
    if (iconSpan) {
      const img = iconSpan.querySelector('img');
      if (img) imageEl = img;
    }
    
    // SECOND CELL: Text content (heading, description, CTA)
    const textCellEls = [];
    // Heading
    const heading = section.querySelector('h3');
    if (heading) textCellEls.push(heading);
    // Description
    const descDiv = section.querySelector('[aria-label="text-content"]');
    if (descDiv) {
      // Push all child nodes except <br>
      Array.from(descDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') return;
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCellEls.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // wrap stray text in a <p> for semantic meaning
          const p = document.createElement('p');
          p.textContent = node.textContent;
          textCellEls.push(p);
        }
      });
    }
    // CTA link
    const link = section.querySelector('a');
    if (link) textCellEls.push(link);

    rows.push([imageEl, textCellEls]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
