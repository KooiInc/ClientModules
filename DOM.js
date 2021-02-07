// some DOM plumbing
import {
  cleanupHtml,
  getRestricted,
  setTagPermission,
  allowUnknownHtmlTags } from "./DOMCleanup.js";

// insert Element position helper
const adjacents = {
  BeforeBegin: "beforebegin", // before element
  AfterBegin: "afterbegin",   // before first child
  BeforeEnd: "beforeend",     // after last child
  AfterEnd: "afterend" };     // after element

const closestSibling = (elem, selector) => elem.parentNode.querySelector(selector);

// create DOM object from html string
const htmlToVirtualElement = htmlString => {
  const placeholder = Object.assign(document.createElement("div"), { id:"placeholder", innerHTML: htmlString.trim() });

  return placeholder.childNodes.length
    ? cleanupHtml(placeholder)
    : undefined;
};

// add Element to [root] on position [position]
const element2DOM = (elem, root = document.body, position = adjacents.BeforeEnd) =>
  elem && elem instanceof HTMLElement && root.insertAdjacentElement(position, elem);


// create DOM element from [htmlStr
// The resulting element is always cleaned using the
// attrbutes/tags settings. Use element2DOM to
// insert/append etc. it into your DOM
const createElementFromHtmlString = htmlStr => {
  let nwElem = htmlToVirtualElement(htmlStr), isError = false;
  if (!nwElem.children.length) {
      nwElem = document.createElement("span");
      nwElem.dataset.invalid = "See comment in this element";
      nwElem.appendChild(document.createComment(`[${
        htmlStr}] => not valid or not allowed`));
  }

  return nwElem.dataset.invalid ? nwElem : nwElem.children[0];
};

export {
  getRestricted,
  setTagPermission,
  createElementFromHtmlString,
  element2DOM,
  cleanupHtml,
  allowUnknownHtmlTags,
  adjacents as insertPositions,
  closestSibling,
};
