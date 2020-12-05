// centralized import
// partly exported as [util]
import {
  debugLog,
  log,
  logStatus
} from "./Log.js";

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

// local
import {
  extensions,
  loop
} from "./Extensions.js";

// no need for this?
const copyNativeProtos = ctor => {
  //copy Element prototype methods
  Object.entries(Object.getOwnPropertyDescriptors(Element.prototype))
    .filter( propDescriptr => propDescriptr.value instanceof Function)
    .forEach( ([key, { value }]) =>
      ctor.prototype[key] = requestAnimationFrame( function(...args) {
        return loop(this, elem => value.apply(elem, args));
      }) );

  // copy NodeList prototype methods
  Object.entries(Object.getOwnPropertyDescriptors(NodeList.prototype))
    .filter( propDescriptr => propDescriptr.value instanceof Function)
    .forEach( ([key]) => {
        ctor.prototype[key] = function(lambda) {
          this.collection[key](lambda);
          return this;
        };
    } );
}

// the prototype initializer
const initializePrototype = (ctor, extensions) => {
  // more complex prototype methods
  Object.entries(extensions).forEach(([key, lambda]) => {
    ctor.prototype[key] = function(...args) {
      return lambda.fn
        ? lambda.fn(this, ...args)
        : loop(this, el => lambda(el, ...args));
    };
  });

  ctor.prototype.isSet = true;
};

// -------------------------------------------------------------------- //
const {$, util} = (() => {
  function ExtendedNodeList(
      inputObject,
      root = document.body,
      position = insertPositions.BeforeEnd ) {

    if (ExtendedNodeList.prototype.isSet === undefined) {
      initializePrototype(ExtendedNodeList, extensions);
    }

    this.collection = [];
    const cleanupAndAppendCollection = () => this.collection = this.collection.reduce( (acc, elem) =>
      !elem.dataset.elementInvalid && [...acc, element2DOM(elem, root, position)] || acc, []
    );

    const selectorRoot = root !== document.body &&
      (inputObject.constructor === String &&
        inputObject.toLowerCase() !== "body") ? root : document;

    try {
      const isArray = Array.isArray(inputObject);

      if (inputObject) {
        if (inputObject instanceof HTMLElement) {
          this.collection = [inputObject];
        } else if (inputObject instanceof NodeList) {
          this.collection = [...inputObject];
        } else if(inputObject instanceof ExtendedNodeList) {
          this.collection = inputObject.collection;
        } else if ( isArray || `${inputObject}`.trim().startsWith("<") ) {
          if (logStatus()) {
            log(`trying to create ... [${inputObject}]`);
          }

          if (isArray) {
            inputObject.forEach( html => {
               const nwElem = createElementFromHtmlString( html, root );
               this.collection.push( nwElem.childNodes[0] );
            });
          } else {
            const nwElem = createElementFromHtmlString(inputObject.trim(), root);
            this.collection = [ nwElem.childNodes[0] ];
          }
          // remove erroneous elems and append to DOM
          cleanupAndAppendCollection();

          if (logStatus()) {
            log(`created element: *clean: [${this.collection[0].outerHTML}]`);
          }
        } else if (inputObject.constructor === String) {
          this.collection = [ ...selectorRoot.querySelectorAll(inputObject) ];
        } else {
          throw new TypeError(`input [${inputObject}] not valid`);
        }
        return this;
      } else {
        throw new TypeError(`ExtCollextion init: no input`);
      }
    } catch (err) {
      const msg = `Caught jql selector or html error:\n${err.stack ? err.stack : err.message}`;
      if (logStatus()) {
        log(msg);
      } else {
        console.log(msg);
      }
    }
  }

  return {
    $: (...args) => new ExtendedNodeList(...args),
    util: {
      debugLog,
      log,
      logStatus,
      setTagPermission,
      allowUnknownHtmlTags,
      insertPositions,
      getRestricted,
      closestSibling }
  };
})();

export {$, util};
