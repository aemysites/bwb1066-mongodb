/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate carousel slides/sections
  function getSlides(container) {
    // Each top-level child div with .fl-center, or direct .QuoteCarousel__Wrapper...
    const slides = [];
    // Get all direct children
    const directDivs = Array.from(container.querySelectorAll(':scope > div'));
    directDivs.forEach(div => {
      // .fl-center means slide container, or QuoteCarousel__Wrapper-sc-1uned9j-0
      if (
        div.classList.contains('fl-center') ||
        div.className.includes('QuoteCarousel__Wrapper')
      ) {
        slides.push(div);
      } else {
        // Some have wrappers inside
        const wrappers = Array.from(div.querySelectorAll(':scope > .QuoteCarousel__Wrapper-sc-1uned9j-0'));
        wrappers.forEach(w => slides.push(w));
      }
    });
    // Fallback: If the container itself is a slide, and there were no slides found
    if (slides.length === 0 &&
      (container.classList.contains('fl-center') || container.className.includes('QuoteCarousel__Wrapper'))
    ) {
      slides.push(container);
    }
    return slides;
  }

  // Extract slides from the block root
  const slides = getSlides(element);
  const headerRow = ['Carousel (carousel17)'];
  const tableRows = [headerRow];

  slides.forEach(slide => {
    // IMAGE CELL
    let imgCell = null;
    // Find logo area (should have <img> inside)
    let logoArea = slide.querySelector('.carousel-logo, .fl-center');
    let img = null;
    if (logoArea) {
      img = logoArea.querySelector('img');
      if (!img && logoArea.tagName === 'IMG') img = logoArea;
    }
    if (!img) {
      img = slide.querySelector('img');
    }
    // Only proceed if image found
    if (!img) {
      // If no image for the slide, skip this row entirely (structure expects image required)
      return;
    }
    imgCell = img;

    // CONTENT CELL
    // Find main text container
    let textContainer = slide.querySelector('.w-max-850, .p-v-20, .p-mobile-20');
    // Fallback: find first <h4> or <small> if no container
    if (!textContainer) {
      textContainer = document.createElement('div');
      const h4 = slide.querySelector('h4');
      const small = slide.querySelector('small');
      if (h4) textContainer.appendChild(h4);
      if (small) textContainer.appendChild(small);
    }
    // Normalize: remove any navigation arrows or extraneous content from textContainer
    // (not needed here as the structure is usually tight, but safety check)
    // Remove <br> at the end if present
    while (
      textContainer.lastChild &&
      textContainer.lastChild.nodeType === Node.ELEMENT_NODE &&
      textContainer.lastChild.tagName === 'BR'
    ) {
      textContainer.removeChild(textContainer.lastChild);
    }

    // Compose the row
    tableRows.push([imgCell, textContainer]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the table
  element.replaceWith(block);
}
