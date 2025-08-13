/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the carousel/slider containing the cards
  const slider = element.querySelector('.keen-slider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.keen-slider__slide'));

  // Table header row as specified
  const rows = [['Cards (cards39)']];

  slides.forEach(slide => {
    // For each card, find the card anchor
    const cardAnchor = slide.querySelector('a');
    if (!cardAnchor) return; // Defensive: skip if not found

    // --- IMAGE CELL ---
    // Look for first image in the card
    const img = cardAnchor.querySelector('img');

    // --- TEXT CELL ---
    const textContent = [];
    // Card title
    const title = cardAnchor.querySelector('h6');
    if (title) textContent.push(title);
    // Card description
    const desc = cardAnchor.querySelector('p');
    if (desc) textContent.push(desc);
    // Card CTA: if there's a button, include a link using anchor's href and the button's text
    const button = cardAnchor.querySelector('button');
    if (button) {
      // Find the inner text span (textlink-link-icon-class)
      const btnText = button.querySelector('.textlink-link-icon-class');
      if (btnText) {
        const ctaLink = document.createElement('a');
        ctaLink.href = cardAnchor.href;
        ctaLink.textContent = btnText.textContent;
        textContent.push(ctaLink);
      }
    }
    // Add a row: [image, [text content]]
    rows.push([
      img,
      textContent
    ]);
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
