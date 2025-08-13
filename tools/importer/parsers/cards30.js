/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards30)'];

  // Helper to extract card links from section
  function extractCards(section) {
    const rows = [];
    const anchors = section.querySelectorAll('.css-z5l6vi > a');
    anchors.forEach((a) => {
      // Image/Icon
      const img = a.querySelector('img');
      // Title (as heading: inside .css-ulkukj span)
      let titleEl = a.querySelector('.css-ulkukj span');
      let title = '';
      if (titleEl) {
        title = titleEl.textContent.trim();
      }
      let strong;
      if (title) {
        strong = document.createElement('strong');
        strong.textContent = title;
      }
      // (No description found for these cards in HTML)
      // Compose cell: heading, then link (with everything)
      const textArr = [];
      if (strong) {
        textArr.push(strong);
        textArr.push(document.createElement('br'));
      }
      // Use the anchor itself (referenced, not cloned)
      textArr.push(a);
      rows.push([img, textArr]);
    });
    return rows;
  }

  // Extract main card sections in order
  const cards = [];
  const cardSections = element.querySelectorAll('#section-1, #section-2, #section-3');
  // For each section: image, heading, description, and then child cards
  cardSections.forEach((section, idx) => {
    // Heading
    const heading = section.querySelector('h5');
    let strong;
    if (heading) {
      strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
    }
    // Description
    const descSpan = section.querySelector('span.css-3cyrb7');
    let descDiv;
    if (descSpan) {
      descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
    }
    // Section image (try to match by SVG filename)
    let img = null;
    if (idx === 0) {
      img = element.querySelector('img[src*="atlas-frame2.svg"]');
    } else if (idx === 1) {
      img = element.querySelector('img[src*="atlas-frame3.svg"]');
    } else if (idx === 2) {
      img = element.querySelector('img[src*="atlas-frame4.svg"]');
    }
    // Compose main section card row
    const textArr = [];
    if (strong) {
      textArr.push(strong);
      textArr.push(document.createElement('br'));
    }
    if (descDiv) {
      textArr.push(descDiv);
    }
    cards.push([img, textArr]);
    // Child card links
    const childRows = extractCards(section);
    cards.push(...childRows);
  });

  // Only one table, as in the markdown example
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cards
  ], document);

  // Replace with table
  element.replaceWith(table);
}
