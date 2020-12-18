const cleanWhitespace = str => str.replace(/\s{2,}/g, " ");
const toZeroPaddedEuropeanDate = val => val.split("/").reverse().map(v => `${v}`.padStart(2, "0")).join("/");
const date2EuropeanDate = date => date.toISOString().split("T").shift().split("-").reverse().map(v => `${v}`.padStart(2, "0")).join("-");
const displayHour = h => `${h}`.padStart(2, `0`) + `:00`;
const throwIf = (assertion = false, message = `Unspecified error`, ErrorType = Error) =>
  assertion && (() => { throw new ErrorType(message); })();
const Logger = () => {
  let logEl;
  if (typeof window === "object") {
    logEl = document.querySelector("#log") || (() => {
      document.body.append(Object.assign(document.createElement('pre'), {id:"log"}));
      return document.querySelector("#log");
    })();
    return (...logLines) => logLines.forEach(s => logEl.textContent += `${s}\n`);
  } else {
    return (...logLines) => logLines.forEach(ll => console.log(`* `, ll));
  }
};
const time2Fragments = (milliseconds) => {
  milliseconds = Math.abs(milliseconds);
  let secs = Math.floor(Math.abs(milliseconds) / 1000);
  let mins = Math.floor(secs / 60);
  let hours = Math.floor(mins / 60);
  let days = Math.floor(hours / 24);
  const millisecs = Math.floor(Math.abs(milliseconds)) % 1000;

  return {
    days: days,
    hours: hours % 24,
    minutes: mins % 60,
    seconds: secs % 60,
    milliSeconds: millisecs,
  };
};

export {
  cleanWhitespace,
  toZeroPaddedEuropeanDate,
  date2EuropeanDate,
  displayHour,
  throwIf,
  Logger,
  time2Fragments,
};
