// the html generated from this library is always sanitized
import {createElementFromHtmlString, setTagPermission} from "./DOM.js";

const ModalMessage = (styleSheetLocation = "//cdn.nicon.nl/Modules/Modal.css") => {
  addCssIfNotAlreadyAdded();
  let timer = null;
  const closeIfActive = () => {
    document.querySelector(".between")?.remove();
    document.querySelector(".popupBox")?.remove();
  }
  const isTouchDevice = "ontouchstart" in document.documentElement;
  const clickOrTouch =  isTouchDevice ? "touchend" : "click";
  const positionStuff = (theBox, closerHandle) => {
    theBox.classList.add("showAndCenter");
    if(closerHandle) {
      closerHandle.style.position = "fixed";
      closerHandle.style.left = `${(theBox.offsetWidth) - 18}px`;
    }

    if (theBox.offsetHeight <= 50) {
      theBox.style.padding = "8px";
      if (closerHandle) {
        closerHandle.style.left = `${(theBox.offsetWidth) - 12}px`;
      }
    }
  };
  const endTimer = () => timer && clearTimeout(timer);
  const create = (message, omitOkBttn) => {
    endTimer();
    closeIfActive();
    let okIcon = null;
    window.scrollTo(0, 0);
    const betweenLayer = createElementFromHtmlString(`<div class="between"></div>`);
    document.body.appendChild(betweenLayer);
    const modalBox = createElementFromHtmlString( `
      <div class="popupBox">
        <div data-modalcontent>${message}</div>
      </div>` );

    if (!omitOkBttn) {
      okIcon = createElementFromHtmlString(`<span id="closer" class="closeHandleIcon"></span>`);
      modalBox.insertBefore(okIcon, modalBox.firstChild);
    }

    document.body.appendChild(modalBox);
    timer = setTimeout(() => positionStuff(modalBox, okIcon), 10);
  };
  const remove = callback => {
    endTimer();
    timer = setTimeout(() => {
      closeIfActive();
      if (callback && callback instanceof Function) { callback(); }
    }, 300); // 300 is the fading time (ease-out)
    return this;
  };
  const timed = (message, closeAfter = 2, callback = null, omitOkBttn = false ) => {
    closeIfActive();
    create(message, omitOkBttn);
    const remover = callback ? () => remove(callback) : remove;
    timer = setTimeout(remover, closeAfter * 1000);
  };

  function addCssIfNotAlreadyAdded() {
    setTagPermission("link", true);
    // this enables users to use their own stylesheet (name should end with modal.css)
    if (![...document.styleSheets].find(sheet => sheet.id === "modalcss")) {
      const cssLink = createElementFromHtmlString(`
        <link id="modalcss" href="${styleSheetLocation}" rel="stylesheet"/>` );
      document.querySelector("head").appendChild(cssLink);
    }
    setTagPermission("link", false);
  }

  document.addEventListener(clickOrTouch, evt => {
    const canClose = document.querySelector("#closer");
    if (canClose) {
      const origin = evt.target.closest("#closer");
      if (origin || evt.target.classList.contains("between")) {
        remove(null);
      }
    }
  });

  return {
    create: create,
    createTimed: timed,
    remove: remove
  };
};
export default ModalMessage;