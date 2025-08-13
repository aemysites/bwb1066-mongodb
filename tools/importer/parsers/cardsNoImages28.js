/* global WebImporter */
export default function parse(element, { document }) {
  // The block header matches the example: Cards (cardsNoImages28)
  const headerRow = ['Cards (cardsNoImages28)'];

  // We'll collect rows by referencing content from the Champions section only
  const champions = element.querySelector('#Champions.tab-content');
  if (!champions) return;

  // Gather card content: Champion program info, profile card, talk cards
  // Card 1: Main Champion program info (title, description, CTA)
  const championsInfo = champions.children[0];
  const card1Content = Array.from(championsInfo.children);

  // Card 2: Champion profile card
  const profileSection = champions.children[1];
  const card2Content = Array.from(profileSection.children);

  // Cards 3+: Each talk, one card per talk
  const talksSection = champions.children[2];
  let talkCards = [];
  if (talksSection && talksSection.children.length) {
    Array.from(talksSection.children).forEach((talkCard) => {
      // Each talkCard is a card, pass all its children (which is the full card content)
      talkCards.push([talkCard]);
    });
  }

  // Table rows: 1 column only. Each card is a row.
  const cells = [headerRow];
  if (card1Content.length) cells.push([card1Content]);
  if (card2Content.length) cells.push([card2Content]);
  talkCards.forEach((row) => cells.push(row));

  // Create the block table in the exact structure as the example
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the Champions section ONLY, not the whole element
  champions.replaceWith(block);
}
