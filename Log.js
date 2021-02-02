import {createElementFromHtmlString, insertPositions} from "./DOM.js";
import {addCssIfNotAlreadyAdded} from "./SmallHelpers.js";

let useLogging = false;
const debugLog = {on: () => useLogging = true, off: () => useLogging = false,};
const log = (...args) => {
    if (!useLogging) { return; }

    if (!document.querySelector("#jql_logger")) {
      addCssIfNotAlreadyAdded("logJql", "//cdn.nicon.nl/Modules/logBasic.css");
      const loggingFieldSet = `
      <fieldset id="logBox">
        <legend>Logging</legend>
        <pre id="jql_logger"></pre>
      </fieldset>`;
      const logBlock = createElementFromHtmlString(loggingFieldSet, document.body);
      document.body.insertBefore(logBlock, document.body.childNodes[0]);
    }
    const logBox = document.querySelector("#jql_logger");
    args.forEach(arg => logBox.textContent += `${arg instanceof Object ? JSON.stringify(arg, null, 2) : arg}\n`);
  };

const logStatus = () => useLogging;
export {log, debugLog, logStatus};