import {createElementFromHtmlString, insertPositions} from "./DOM.js";
import {addCssIfNotAlreadyAdded} from "./SmallHelpers.js";

let useLogging = false;
let cssLocation = "//cdn.nicon.nl/Modules/logBasic.css";
const debugLog = {on: (cssLoc = cssLocation) => { cssLocation = cssLoc; useLogging = true; }, off: () => useLogging = false,};
const log = (...args) => {
    if (!useLogging) { return; }

    if (!document.querySelector("#jql_logger")) {
      addCssIfNotAlreadyAdded("logJql", cssLocation);
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
// plain 'pre' logger factory
const Logger = () => {
  const report = document.querySelector("#report") ||
    document.body.insertAdjacentElement(
      "beforeend",
      Object.assign(document.createElement("pre"), {id: "report"}));
  return (...args) => args.forEach(stuff =>
    report.textContent += (stuff instanceof Object
      ? JSON.stringify(stuff, null, 2) : stuff) + "\n");
}

const logStatus = () => useLogging;
export {log, debugLog, logStatus, Logger};