import {createElementFromHtmlString, setTagPermission} from "//cdn.nicon.nl/Modules/DOM.js";

const ModalMessage = (styleSheetLocation = "//cdn.nicon.nl/Modules/Modal.css") => {
  addCssIfNotAlreadyAdded();
  let timer = null;
  const closeIfActive = () => {
    document.querySelector(".between")?.remove();
    document.querySelector(".alertBox")?.remove();
  }
  const isTouchDevice = "ontouchstart" in document.documentElement;
  const clickOrTouch =  isTouchDevice ? "touchend" : "click";
  const positionStuff = (theBox, theOkBttn) => {
    theBox.style.display = "block";
    theBox.classList.add("isDone");
    if(theOkBttn) {
      theOkBttn.style.position = "fixed";
      theOkBttn.style.left = `${(theBox.offsetWidth) - 18}px`;
    }

    if (theBox.offsetHeight <= 50) {
      theBox.style.padding = "8px";
      if (theOkBttn) {
        theOkBttn.style.left = `${(theBox.offsetWidth) - 12}px`;
      }
    }
  };
  const endTimer = () => timer && clearTimeout(timer);
  const create = (message, omitOkBttn) => {
    endTimer();
    closeIfActive();
    let okIcon = null;
    window.scrollTo(0, 0);
    const betweenLayer = Object.assign( document.createElement("div"), { className: "between" } );
    document.body.appendChild(betweenLayer);
    const modalBox = createElementFromHtmlString( `
      <div class="alertBox centeredHV" style="display:none">
        <div data-modalcontent>${message}</div>
      </div>`.trim() );
    console.log(modalBox);
    if (!omitOkBttn) {
      okIcon = createElementFromHtmlString(`<span id="alertOk" class="okHandle"></span>`);
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
    // this enables users to use their own stylesheet (named modal.css)
    if (![...document.styleSheets].find(sheet => /modal\.css/i.test(sheet.href))) {
      const cssLink = createElementFromHtmlString(`
        <link id="modalcss" href="${styleSheetLocation}" rel="stylesheet"/>` );
      document.querySelector("head").appendChild(cssLink);
    }
  }

  document.addEventListener(clickOrTouch, evt => {
    const origin = evt.target;
    if (document.querySelector("#alertOk")
      && (origin.id === "alertOk"
        || origin.classList.contains("between"))) {
      remove(null);
    }
  });

  return {
    create: create,
    createTimed: timed,
    remove: remove
  };
};
export default ModalMessage;