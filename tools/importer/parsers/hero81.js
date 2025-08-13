/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must exactly match the example
  const headerRow = ['Hero (hero81)'];

  // --- 2nd row: Background image ---
  // Find the div that actually has the background-image or data-bg attribute
  let bgUrl = '';
  let bgDiv = null;
  // It is the first child of 'element'
  const candidateDivs = element.querySelectorAll(':scope > div');
  for (const div of candidateDivs) {
    if (div.hasAttribute('data-bg') || (div.style && div.style.backgroundImage)) {
      bgDiv = div;
      break;
    }
  }
  // Defensive: fallback if didn't find, just the first child
  if (!bgDiv && candidateDivs.length) bgDiv = candidateDivs[0];

  // Extract URL
  if (bgDiv) {
    bgUrl = bgDiv.getAttribute('data-bg');
    if (!bgUrl && bgDiv.style && bgDiv.style.backgroundImage) {
      // background-image: url("...")
      const bgMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (bgMatch && bgMatch[1]) {
        bgUrl = bgMatch[1];
      }
    }
  }
  let bgImgEl = '';
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  const bgRow = [bgImgEl];

  // --- 3rd row: Content (title, subheading, CTA) ---
  // Find the .GetStarted__Container-sc-1eevhox-0.engOwG (or similar) inside bgDiv
  let contentContainer = null;
  if (bgDiv) {
    // Try to get the most relevant container
    contentContainer = bgDiv.querySelector('div[class*="GetStarted__Container"], div.engOwG');
    // Fallback: any direct child div with h2 or h4
    if (!contentContainer) {
      contentContainer = Array.from(bgDiv.querySelectorAll(':scope > div')).find(div => div.querySelector('h2, h4'));
    }
  }
  // Fallback: search anywhere in element
  if (!contentContainer) {
    contentContainer = element.querySelector('div[class*="GetStarted__Container"], div.engOwG, h2, h4');
  }

  // Compose content
  let contentCell = [];
  if (contentContainer) {
    // Get the heading (h2)
    const heading = contentContainer.querySelector('h2');
    if (heading) contentCell.push(heading);
    // Get the subheading (h4)
    const subheading = contentContainer.querySelector('h4');
    if (subheading) contentCell.push(subheading);
    // CTA button as a link (keep the <a> with button inside)
    const ctaLink = contentContainer.querySelector('a[href]');
    if (ctaLink && ctaLink.querySelector('button')) {
      contentCell.push(ctaLink);
    }
  }
  // If nothing found, but a container exists, fallback to include it whole
  if (contentCell.length === 0 && contentContainer) {
    contentCell = [contentContainer];
  }
  // If all else fails, just empty string
  if (contentCell.length === 0) contentCell = [''];

  const contentRow = [contentCell];

  // Build the table as per the required structure
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
