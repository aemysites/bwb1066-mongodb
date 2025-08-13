/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Carousel (carousel51)'];

  // Find carousel main slide container
  let slides = [];
  // Find the .fl.relative element (main container for slides)
  const flRel = element.querySelector('.fl.relative');
  if (flRel) {
    // Each child (with .fl-center or .fl) is a slide
    slides = Array.from(flRel.children).filter(
      (div) => div.classList.contains('fl-center') || div.classList.contains('fl')
    );
  }

  // Helper to extract the image element from a slide
  function getSlideImage(slide) {
    const logoAnchor = slide.querySelector('.carousel-logo');
    if (logoAnchor) {
      const img = logoAnchor.querySelector('img');
      if (img && img.src && img.src !== '' && img.src !== window.location.origin + '/') {
        return img;
      }
    }
    return '';
  }

  // Helper to extract text content element from a slide
  function getSlideTextContent(slide) {
    const textDiv = slide.querySelector('.w-max-850');
    if (textDiv) {
      // Remove any empty trailing <br> tags referencing original nodes
      let last = textDiv.lastElementChild;
      while (last && last.tagName === 'BR') {
        textDiv.removeChild(last);
        last = textDiv.lastElementChild;
      }
      // Remove empty <h4> (if present)
      const h4 = textDiv.querySelector('h4');
      if (h4 && h4.textContent.trim() === '') {
        h4.remove();
      }
      // Return empty string if all content is empty
      if (textDiv.textContent.trim() === '' && !textDiv.querySelector('a')) {
        return '';
      }
      return textDiv;
    }
    return '';
  }

  // Compose table rows for each slide
  const rows = slides.map((slide) => {
    const img = getSlideImage(slide);
    const text = getSlideTextContent(slide);
    return [img, text];
  });

  // Build the table cells array
  const cells = [headerRow, ...rows];

  // Create and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
