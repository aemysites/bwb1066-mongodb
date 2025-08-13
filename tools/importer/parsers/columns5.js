/* global WebImporter */
export default function parse(element, { document }) {
  // Safely query the section (this is always required)
  const section = element.querySelector('section');
  if (!section) return;

  // Find both the graphic and text columns
  const sectionColumns = section.querySelectorAll(':scope > div');
  if (sectionColumns.length < 2) return;

  // Identify left and right columns
  let leftDiv = null;
  let rightDiv = null;
  for (const div of sectionColumns) {
    if (div.className && div.className.includes('Slalom__Graphic')) {
      rightDiv = div;
    } else if (div.className && div.className.includes('Slalom__Text')) {
      leftDiv = div;
    }
  }
  if (!leftDiv || !rightDiv) return;

  // LEFT COLUMN: Gather heading and description (bullets, paragraphs, link/button)
  let leftCellContent = [];
  const leftContentW = leftDiv.querySelector(':scope > div.w-full');
  if (leftContentW) {
    // Heading (h3)
    const heading = leftContentW.querySelector('h3');
    if (heading && heading.textContent.trim()) {
      leftCellContent.push(heading);
    }
    // Description (could be .Slalom__TextDescription-sc-w4dcgz-7 or similar)
    const descEl = leftContentW.querySelector('.Slalom__TextDescription-sc-w4dcgz-7');
    if (descEl) {
      // The description may contain <p>, <div>, <a>, <button>
      // We'll push all children (usually 1 <p> or a <div> with multiple <p>s, <a>, <button>)
      if (descEl.children.length > 0) {
        leftCellContent.push(...descEl.children);
      } else {
        leftCellContent.push(descEl);
      }
    }
  }

  // RIGHT COLUMN: Image or Video
  let rightCellContent = [];
  // Sometimes there's a containing <div> with transform/scale
  let graphicContent = rightDiv.querySelector('img, video');
  if (!graphicContent) {
    // Try to find in a nested div
    const scaleDiv = rightDiv.querySelector('div');
    if (scaleDiv) {
      graphicContent = scaleDiv.querySelector('img, video');
    }
  }
  if (graphicContent) {
    if (graphicContent.tagName === 'IMG') {
      rightCellContent.push(graphicContent);
    } else if (graphicContent.tagName === 'VIDEO') {
      // Represent video as a link to the first <source src>
      const source = graphicContent.querySelector('source');
      if (source && source.src) {
        const videoLink = document.createElement('a');
        videoLink.href = source.src;
        videoLink.textContent = source.src.split('/').pop();
        rightCellContent.push(videoLink);
      }
    }
  }

  // Block header matches example exactly
  const cells = [
    ['Columns (columns5)'],
    [leftCellContent, rightCellContent]
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
