/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import hero2Parser from './parsers/hero2.js';
import hero10Parser from './parsers/hero10.js';
import hero1Parser from './parsers/hero1.js';
import columns13Parser from './parsers/columns13.js';
import columns3Parser from './parsers/columns3.js';
import columns5Parser from './parsers/columns5.js';
import columns15Parser from './parsers/columns15.js';
import columns12Parser from './parsers/columns12.js';
import accordion21Parser from './parsers/accordion21.js';
import cards23Parser from './parsers/cards23.js';
import carousel17Parser from './parsers/carousel17.js';
import hero16Parser from './parsers/hero16.js';
import columns7Parser from './parsers/columns7.js';
import columns6Parser from './parsers/columns6.js';
import columns8Parser from './parsers/columns8.js';
import hero34Parser from './parsers/hero34.js';
import columns35Parser from './parsers/columns35.js';
import hero36Parser from './parsers/hero36.js';
import columns25Parser from './parsers/columns25.js';
import tabs24Parser from './parsers/tabs24.js';
import video38Parser from './parsers/video38.js';
import cards39Parser from './parsers/cards39.js';
import accordion42Parser from './parsers/accordion42.js';
import hero46Parser from './parsers/hero46.js';
import tableBordered40Parser from './parsers/tableBordered40.js';
import cards20Parser from './parsers/cards20.js';
import hero47Parser from './parsers/hero47.js';
import columns11Parser from './parsers/columns11.js';
import hero48Parser from './parsers/hero48.js';
import columns29Parser from './parsers/columns29.js';
import accordion49Parser from './parsers/accordion49.js';
import cards30Parser from './parsers/cards30.js';
import columns4Parser from './parsers/columns4.js';
import cards57Parser from './parsers/cards57.js';
import hero58Parser from './parsers/hero58.js';
import columns44Parser from './parsers/columns44.js';
import cards64Parser from './parsers/cards64.js';
import hero50Parser from './parsers/hero50.js';
import cardsNoImages28Parser from './parsers/cardsNoImages28.js';
import columns67Parser from './parsers/columns67.js';
import cards68Parser from './parsers/cards68.js';
import cards70Parser from './parsers/cards70.js';
import columns71Parser from './parsers/columns71.js';
import columns72Parser from './parsers/columns72.js';
import cardsNoImages63Parser from './parsers/cardsNoImages63.js';
import columns60Parser from './parsers/columns60.js';
import hero73Parser from './parsers/hero73.js';
import search66Parser from './parsers/search66.js';
import cards74Parser from './parsers/cards74.js';
import columns76Parser from './parsers/columns76.js';
import hero77Parser from './parsers/hero77.js';
import columns79Parser from './parsers/columns79.js';
import cards78Parser from './parsers/cards78.js';
import hero80Parser from './parsers/hero80.js';
import columns65Parser from './parsers/columns65.js';
import hero81Parser from './parsers/hero81.js';
import columns43Parser from './parsers/columns43.js';
import columns69Parser from './parsers/columns69.js';
import carousel51Parser from './parsers/carousel51.js';
import hero56Parser from './parsers/hero56.js';
import hero55Parser from './parsers/hero55.js';
import columns75Parser from './parsers/columns75.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  hero2: hero2Parser,
  hero10: hero10Parser,
  hero1: hero1Parser,
  columns13: columns13Parser,
  columns3: columns3Parser,
  columns5: columns5Parser,
  columns15: columns15Parser,
  columns12: columns12Parser,
  accordion21: accordion21Parser,
  cards23: cards23Parser,
  carousel17: carousel17Parser,
  hero16: hero16Parser,
  columns7: columns7Parser,
  columns6: columns6Parser,
  columns8: columns8Parser,
  hero34: hero34Parser,
  columns35: columns35Parser,
  hero36: hero36Parser,
  columns25: columns25Parser,
  tabs24: tabs24Parser,
  video38: video38Parser,
  cards39: cards39Parser,
  accordion42: accordion42Parser,
  hero46: hero46Parser,
  tableBordered40: tableBordered40Parser,
  cards20: cards20Parser,
  hero47: hero47Parser,
  columns11: columns11Parser,
  hero48: hero48Parser,
  columns29: columns29Parser,
  accordion49: accordion49Parser,
  cards30: cards30Parser,
  columns4: columns4Parser,
  cards57: cards57Parser,
  hero58: hero58Parser,
  columns44: columns44Parser,
  cards64: cards64Parser,
  hero50: hero50Parser,
  cardsNoImages28: cardsNoImages28Parser,
  columns67: columns67Parser,
  cards68: cards68Parser,
  cards70: cards70Parser,
  columns71: columns71Parser,
  columns72: columns72Parser,
  cardsNoImages63: cardsNoImages63Parser,
  columns60: columns60Parser,
  hero73: hero73Parser,
  search66: search66Parser,
  cards74: cards74Parser,
  columns76: columns76Parser,
  hero77: hero77Parser,
  columns79: columns79Parser,
  cards78: cards78Parser,
  hero80: hero80Parser,
  columns65: columns65Parser,
  hero81: hero81Parser,
  columns43: columns43Parser,
  columns69: columns69Parser,
  carousel51: carousel51Parser,
  hero56: hero56Parser,
  hero55: hero55Parser,
  columns75: columns75Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
