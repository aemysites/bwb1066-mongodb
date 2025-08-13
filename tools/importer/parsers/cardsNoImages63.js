/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Cards (cardsNoImages63)'];
  const rows = [headerRow];

  // Each immediate child is a card
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(card => {
    // Gather card content in order: heading, description, lesson count, CTA (if present), external link (if present)
    const main = card.querySelector('.css-3n4zcb');
    const cardContent = document.createElement('div');

    if (main) {
      // Course label (optional)
      const courseLabel = main.querySelector('.css-13cz51v');
      if (courseLabel) {
        cardContent.appendChild(courseLabel);
      }
      // Heading
      const heading = main.querySelector('h4');
      if (heading) {
        cardContent.appendChild(heading);
      }
      // Description
      const desc = main.querySelector('.css-15kzehd');
      if (desc) {
        cardContent.appendChild(desc);
      }
      // Lessons count
      const lessons = main.querySelector('.css-1th96f1');
      if (lessons) {
        cardContent.appendChild(lessons);
      }
    }

    // CTA section
    const ctaDiv = card.querySelector('.css-v3jj0n');
    if (ctaDiv) {
      // External drive link (first a with svg)
      const externalLink = ctaDiv.querySelector('a[target="_blank"][href]');
      if (externalLink) {
        // Create a link element for the href
        const link = document.createElement('a');
        link.href = externalLink.href;
        link.target = '_blank';
        link.textContent = 'External drive folder';
        cardContent.appendChild(document.createElement('br'));
        cardContent.appendChild(link);
      }
      // CTA: View Details (second a with text)
      const detailsLink = ctaDiv.querySelector('a[href]:not([target="_blank"])');
      if (detailsLink) {
        cardContent.appendChild(document.createElement('br'));
        cardContent.appendChild(detailsLink);
      }
    }

    // Only add this card if it has meaningful content
    if (cardContent.childNodes.length > 0) {
      rows.push([cardContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
