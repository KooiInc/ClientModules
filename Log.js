import {createElementFromHtmlString, insertPositions} from "./DOM.js";

let useLogging = false;
const debugLog = {on: () => useLogging = true, off: () => useLogging = false,};
const log = txt => {
    if (!useLogging) { return; }

    if (!document.querySelector("#jql_logger")) {
      const loggingFieldSet = `
      <fieldset style="border: 1px dotted rgb(153, 153, 153); max-width: 800px;">
        <legend style="text-align: center; background-color: rgb(119, 119, 119); padding: 2px 5px; 
            margin-top: -0.5rem; color: white;">Logging</legend>
        <pre id="jql_logger" style="max-width: 800px; max-height: 600px; overflow: auto; white-space: pre-line; margin: 0px;"></pre>
      </fieldset>`;
      const logBlock = createElementFromHtmlString(loggingFieldSet, document.body);
      document.body.insertBefore(logBlock, document.body.childNodes[0]);
    }

    document.querySelector("#jql_logger").textContent += `.${txt}\n`;
  };

const logStatus = () => useLogging;
export {log, debugLog, logStatus};

/*
<fieldset style="border: 1px dotted rgb(153, 153, 153); max-width: 800px;">
  <legend style="text-align: center; background-color: rgb(119, 119, 119); padding: 2px 5px; margin-top: -0.5rem; color: white;">Logging</legend>
  <pre id="log" style="max-width: 800px; max-height: 600px; overflow: auto; white-space: pre-line; margin: 0px;"></pre>
</fieldset>
 */