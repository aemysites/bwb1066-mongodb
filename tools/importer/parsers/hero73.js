/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero73)'];

  // Get direct children (should be the layout wrapper)
  const outerDivs = element.querySelectorAll(':scope > div');
  // Find primary content div; source is: <div class="css-u5kwlr"><div class="css-sfhlsi">...</div></div>
  let layoutDiv = null;
  if (outerDivs.length === 1) {
    layoutDiv = outerDivs[0];
  } else {
    layoutDiv = element;
  }

  // Get immediate children of layoutDiv (should be 2: left (content) and right (image))
  const innerDivs = layoutDiv.querySelectorAll(':scope > div');
  let contentDiv = null;
  let imageDiv = null;
  // Assign based on which contains an image
  for (const div of innerDivs) {
    if (div.querySelector('img')) {
      imageDiv = div;
    } else {
      contentDiv = div;
    }
  }

  // Second row: Background image (optional)
  let imageRow = [null];
  if (imageDiv) {
    // Look for <img> inside imageDiv
    const img = imageDiv.querySelector('img');
    if (img) {
      imageRow = [img];
    }
  }

  // Third row: Title, subheading, CTA
  let contentRow = [null];
  if (contentDiv) {
    // The structure is <div> -> <div> -> [h3, span, span]
    // Find the innermost div under contentDiv
    let dataDiv = contentDiv;
    const possibleInner = contentDiv.querySelector(':scope > div');
    if (possibleInner) {
      dataDiv = possibleInner;
    }
    // Gather all children for semantic meaning
    // Title: h1, h2, or h3
    const heading = dataDiv.querySelector('h1, h2, h3');
    // Subheading: next span or p
    let subheading = null;
    let cta = null;
    if (heading) {
      // Get siblings after heading
      let el = heading.nextElementSibling;
      if (el) {
        // First is subheading (span or p)
        if (el.tagName.toLowerCase() === 'span' || el.tagName.toLowerCase() === 'p') {
          subheading = el;
          el = el.nextElementSibling;
        }
        // Next is CTA (span containing <a> or direct <a>)
        if (el && el.querySelector && el.querySelector('a')) {
          cta = el;
        } else if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
          cta = el;
        }
      }
    }
    // If heading missing, try to get any heading
    if (!heading) {
      const anyHeading = dataDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (anyHeading) {
        contentRow = [[anyHeading]];
      }
    }
    // Compose content for cell
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (subheading) cellContent.push(subheading);
    if (cta) cellContent.push(cta);
    // Fallback: if nothing, try to add all children
    if (cellContent.length === 0) {
      cellContent.push(...Array.from(dataDiv.children));
    }
    contentRow = [cellContent];
  }
  // Assemble table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
