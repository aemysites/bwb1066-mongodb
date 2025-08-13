/* global WebImporter */
export default function parse(element, { document }) {
  // Find the PromotionBanner block
  const banner = element.querySelector('[automation-testid="bonsai-PromotionBanner"]');
  if (!banner) return;

  // --- First: Image row ---
  // Find the image, which is inside the right side of the banner
  // There may be additional wrappers, so recursively look for an <img>
  const img = banner.querySelector('img');

  // --- Second: Text row ---
  // Find the main text wrapper on the left
  const textWrapper = banner.querySelector('[data-testid="promo-banner-text-wrapper"]');
  const textContent = [];
  if (textWrapper) {
    // Find the heading (typically h4)
    const heading = textWrapper.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) textContent.push(heading);
    // Find the main subheading/paragraph (usually the div right after the heading)
    // Look for the div with text (excluding the CTA)
    const divs = Array.from(textWrapper.querySelectorAll('div'));
    if (divs.length > 0) {
      // The first div after the heading is usually the subheading
      // Find the one with the most text content, but skip the CTA wrapper
      const subheading = divs.find(div => div.textContent && div.querySelector('a') === null && div !== textWrapper.querySelector('[data-testid="promotion-banner-cta-wrapper"]'));
      if (subheading) textContent.push(subheading);
    }
    // Find the CTA link (usually inside [data-testid="promotion-banner-cta-wrapper"])
    const ctaWrapper = textWrapper.querySelector('[data-testid="promotion-banner-cta-wrapper"]');
    if (ctaWrapper) {
      const cta = ctaWrapper.querySelector('a[href]');
      if (cta) textContent.push(cta);
    }
  }

  // --- Compose table ---
  const cells = [
    ['Hero (hero16)'],      // Header row
    [img ? img : ''],       // Image row (empty string if no image found)
    [textContent]           // Content row (array of elements for semantic meaning)
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
