/* global WebImporter */
export default function parse(element, { document }) {
  // The correct block only includes the main content tabs, not the left nav summary tabs (i.e., no duplicates)
  // Find the primary content tab container: .css-ydim13 (not .css-7llmpu)
  let mainTabsContainer = element.querySelector('.css-ydim13');
  if (!mainTabsContainer) {
    // As fallback, if .css-ydim13 is missing, look for the largest tab section with code panels
    const candidates = Array.from(element.querySelectorAll('[aria-label="accordion-wrapper"]')).filter(acc => acc.closest('.css-14byl6h'));
    if (candidates.length) {
      mainTabsContainer = candidates[0].closest('.css-ydim13') || candidates[0].parentElement;
    } else {
      return; // If nothing found, don't parse
    }
  }

  // Now, only gather tabs from this container, and deduplicate by label
  const headerRow = ['Tabs'];
  const rows = [headerRow];
  const seenLabels = new Set();

  const accordionWrappers = mainTabsContainer.querySelectorAll('[aria-label="accordion-wrapper"]');

  accordionWrappers.forEach((acc) => {
    // Tab label
    let label = '';
    const tabHead = acc.querySelector('[aria-label="accordion-tab-head"]');
    if (tabHead) {
      const labelEl = tabHead.querySelector('h6, h3, h2, span, div');
      label = (labelEl?.textContent || tabHead.textContent || '').trim();
    }
    if (!label || seenLabels.has(label)) return;
    seenLabels.add(label);

    // Tab content
    const tabBody = acc.querySelector('[aria-label$="tab-body"]');
    const tabContentEls = [];
    if (tabBody) {
      tabBody.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          tabContentEls.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          tabContentEls.push(span);
        }
      });
    }
    if (tabContentEls.length === 0 && tabBody && tabBody.textContent.trim()) {
      tabContentEls.push(document.createTextNode(tabBody.textContent.trim()));
    }
    if (label && tabContentEls.length > 0) {
      rows.push([label, tabContentEls]);
    }
  });

  // Only replace if we have valid tab data (no duplicate nav tabs)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
