/*
 centralized import
 partly exported as [util]
*/
import {
  debugLog,
  log,
  logStatus
} from "./Log.js";

import {initializePrototype} from "./SmallHelpers.js";

import {
  setTagPermission,
  getRestricted,
  allowUnknownHtmlTags,
} from "./DOMCleanup.js";

import {
  createElementFromHtmlString,
  element2DOM,
  insertPositions,
  closestSibling,
} from "./DOM.js";

/* local */
import {
  extensions,
  loop,
} from "./Extensions.js";

// -------------------------------------------------------------------- //
const {$, $$, util} = (() => {
  function ExtendedNodeList(
    inputObject,
    root = document.body,
    position = insertPositions.BeforeEnd) {

    if (ExtendedNodeList.prototype.isSet === undefined) {
      initializePrototype(ExtendedNodeList, extensions);
    }

    this.collection = [];
    this.cssSelector = inputObject && inputObject.trim && inputObject || null;
    const appendCollection = () => this.collection = this.collection.reduce((acc, elem) =>
      elem && elem instanceof HTMLElement ? [...acc, element2DOM(elem, root, position)] : acc, []);

    const selectorRoot = root !== document.body &&
    (inputObject.constructor === String &&
      inputObject.toLowerCase() !== "body") ? root : document;

    try {
      if (!inputObject) {
        return this;
      }

      const isArray = Array.isArray(inputObject);
      this.collection = [];

      if (inputObject instanceof HTMLElement) {
        this.collection = [inputObject];
      } else if (inputObject instanceof NodeList) {
        this.collection = [...inputObject];
      } else if (inputObject instanceof ExtendedNodeList) {
        this.collection = inputObject.collection;
      } else if (isArray || `${inputObject}`.trim().startsWith("<") && `${inputObject}`.trim().endsWith(">")) {
        log(`trying to create ... [${inputObject}]`);

        if (isArray) {
          inputObject.forEach(htmlFragment => {
            const elemCreated = createElementFromHtmlString(htmlFragment);
            if (elemCreated) {
              elemCreated.dataset.invalid &&
              document.body.appendChild(elemCreated.childNodes[0]) ||
              this.collection.push(elemCreated);
            }
          });
        } else {
          const nwElem = createElementFromHtmlString(inputObject);
          if (nwElem) {
            if (nwElem.dataset.invalid || nwElem.querySelector("[data-invalid]")) {
              nwElem.dataset.invalid &&
                document.body.appendChild(nwElem.firstChild) ||
                nwElem.querySelectorAll("[data-invalid]").forEach( el =>
                  document.body.appendChild(el.firstChild) );
            } else {
              this.collection = [nwElem];
            }
          }
        }
        !(root instanceof HTMLBRElement) && appendCollection();
        // remove erroneous elems and append to DOM
        log(`created element: *clean: [${
          (this.collection[0] || {outerHTML: "no element"}).outerHTML.substr(0, 15)}...]`);
      } else if (inputObject && inputObject.trim) {
        this.collection = [...selectorRoot.querySelectorAll(inputObject)];
      }
      return this;
    } catch (err) {
      const msg = `Caught jql selector or html error:\n${err.stack ? err.stack : err.message}`;
      log(msg);
      //^ only if logStatus = on, so
      console.log(msg);
    }
  }

  return {
    $: (...args) => new ExtendedNodeList(...args),
    $$: html => new ExtendedNodeList(html, Object.assign(document.createElement("br"))),
    util: {
      debugLog,
      log,
      logStatus,
      setTagPermission,
      allowUnknownHtmlTags,
      insertPositions,
      getRestricted,
      closestSibling
    }
  };
})();

export {$, $$, util};