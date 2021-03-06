import {setTagPermission} from "./DOMCleanup.js";
import {createElementFromHtmlString} from "./DOM.js";
import {loop} from "./Extensions.js";

const cleanWhitespace = str => str.replace(/\s{2,}/g, " ");
const toZeroPaddedEuropeanDate = val => val.split("/").reverse().map(v => `${v}`.padStart(2, "0")).join("/");
const date2EuropeanDate = date => date.toISOString().split("T").shift().split("-").reverse().map(v => `${v}`.padStart(2, "0")).join("-");
const displayHour = h => `${h}`.padStart(2, `0`) + `:00`;
const throwIf = (assertion = false, message = `Unspecified error`, ErrorType = Error) =>
  assertion && (() => {
    throw new ErrorType(message);
  })();
const Logger = (forceConsole = false) => {
  let logEl;
  if (typeof window === "object" && !forceConsole) {
      logEl = document.querySelector("#log") || (() => {
        const pre = Object.assign(document.createElement('pre'), { id: "log" });
        document.body.append(pre);
        return pre;
      })();
  return (...logLines) => {
      if (logLines.length < 1) {
        logEl.textContent = "";
      } else {
        logLines.forEach(s => logEl.textContent += `${s}\n`);
      }
      logEl.normalize();
    };
  }
  return (...logLines) => {
      console.log(logLines.length);
      logLines.length < 1 ?
        console.clear() :
        logLines.forEach(ll => console.log(`* `, ll));  };
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
// no map or forEach, to keep it (more) speedy
const parseAllToTemplate = (objects2Parse, intoTemplate, fallback = String.fromCharCode(0)) => {
  let lines = [...Array(objects2Parse.length)];
  for (let i = 0; i < objects2Parse.length; i += 1) {
    lines[i] = parseTemplate(intoTemplate, objects2Parse[i], fallback);
  }
  return lines.join("");
};
const randomStringExtension = () => {
  const characters = [...Array(26)]
    .map((x, i) => String.fromCharCode(i + 65))
    .concat([...Array(26)].map((x, i) => String.fromCharCode(i + 97)))
    .concat([...Array(10)].map((x, i) => `${i}`));
  const getCharacters = excludes =>
    excludes && characters.filter(c => !~excludes.indexOf(c)) || characters;

  String.getRandom = (len = 12, excludes = []) => {
    const chars = getCharacters(excludes);
    return [...Array(len)]
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  };
  // html element-id's can not start with a number
  String.createRandomHtmlElementId = (len = 12, excludes = []) => {
    const charsWithoutNumbers = getCharacters(excludes.concat('0123456789'.split("")));
    const firstChr = charsWithoutNumbers[Math.floor(Math.random() * charsWithoutNumbers.length)];
    return firstChr.concat(String.getRandom(len - 1, excludes));
  };
};
const repeat = (str, n) => Array(n).join(str);
const parseTemplate = (template, valuesMapping, fallback = String.fromCharCode(0)) =>
  template.replace(/{[^}]+}/g, (match) =>
    valuesMapping[match.slice(1, -1)] || fallback || match);
const addCssIfNotAlreadyAdded = (cssId, styleSheetLocation) => {
  const fileOrigin = /^file:/i.test(location.href);
  setTagPermission("link", true);
  if (![...document.styleSheets].find(sheet => sheet.id === cssId)) {
    const cssLink = createElementFromHtmlString(`
        <link id="${cssId}" href="${fileOrigin ? "https:" : ""}${styleSheetLocation}" rel="stylesheet"/>`);
    document.querySelector("head").appendChild(cssLink);
  }
  setTagPermission("link", false);
};
/* Generic prototype initializer */
const initializePrototype = (ctor, extensions) => {
  Object.entries(extensions).forEach(([key, lambda]) => {
    ctor.prototype[key] = function (...args) {
      return lambda.fn
        ? lambda.fn(this, ...args)
        : loop(this, el => lambda(el, ...args));
    };
  });
  ctor.prototype.isSet = true;
};
// init default values from parameters, allowing to
// maintain falsy values (like null or 0) if applicable
const initDefault = (value, defaultValue, ...includeFalsies) => {
  const empty = value => includeFalsies &&
  includeFalsies.filter(v =>
    value !== undefined && isNaN(value) ? isNaN(v) : v === value)
    .length ?
    false :
    Boolean(value) === false;
  return empty(value) ? defaultValue : value;
};
//const importAsync = (url, callback) => import(url).then(callback);
const createDeepCloneExtension = () => {
  const isImmutable = val =>
    val === null || val === undefined || [String, Boolean, Number].find(V => val.constructor === V);
  const isObjectAndNotArray = obj =>
    (obj.constructor !== Date && !Array.isArray(obj) && JSON.stringify(obj) === "{}") || Object.keys(obj).length;
  const cloneArr = arr => arr.reduce( (acc, value) =>
    [...acc, isObjectAndNotArray(value) ? cloneObj(value) : value], []);
  const isCyclic = obj => {
    try {
      JSON.stringify(obj);
    } catch(err) {
      return err.message;
    }
    return null;
  };

  function cloneObj(obj) {
    const cyclic = isCyclic(obj);
    return cyclic ? {
        error: `Object clone error: the structure is cyclic and can not be cloned, sorry.`,
        initial: obj } :
      Object.keys(obj).length === 0 ? obj :
        Object.entries(obj)
          .reduce( (acc, [key, value]) => ( {
            ...acc,
            [key]:
              Array.isArray(value)
                ? cloneArr(value) :
                !isImmutable(value) && isObjectAndNotArray(value)
                  ? cloneObj(value)
                  : value && value.constructor
                  ? new value.constructor(value)
                  : value } ),  {} );
  }
  Object.clone = cloneObj;
};
const groupDigits = (number, locale = "DecimalComma") => {
  const separators = {
    DecimalDot: { thousands: ",", decimal: "." },
    DecimalComma: { thousands: ".", decimal: "," },
  };
  locale = Object.keys(separators).find(v => v === locale) ? locale : "DecimalComma";

  return number.constructor !== Number ? number : (() => {
    const precision = (number, len) => number.toFixed(12).split(".").pop().slice(0, len);
    const separateIntegerPart = numberPart => {
      let n = [...numberPart];
      let i = -3;

      while (n.length + i > 0) {
        n.splice(i, 0, separators[locale].thousands);
        i -= 4;
      }

      return n.join(``);
    };
    const parts = `${number}`
      .split(/[.,]/)
      .reduce((acc, val, i) =>
        ({ ...acc, [i < 1 ? "integer" : "decimal"]: (i < 1 ? val : precision(number, val.length)) }), {});

    return `${separateIntegerPart(parts.integer)}${
      parts.decimal ? `${separators[locale].decimal}${parts.decimal}` : ``}`;
  })();
};
const curry = fn => {
  const curryFn = (...args1) => args1.length >= fn.length ? fn(...args1) : (...args2) => curryFn(...args1, ...args2);
  return curryFn;
};
const infiniteCurry = (fn, seed) => {
  const reduceValue = (args, seedValue) =>
    args.reduce((acc, a) => fn.call(fn, acc, a), seedValue);
  const next = (...args) =>
    (...x) =>
      !x.length ? reduceValue(args, seed) : next(...args, reduceValue(x, seed));
  return next();
};
const clipBoardFactory = elementId  => {
  return (str = "-1") => {
    const el = (() => {
      const ta = Object.assign(
        document.createElement(`textarea`), {
          id: elementId,
          readonly: true,
          value: str,
          style: `position:absolute;left:-9999px`, }
      );
      document.body.appendChild(ta);
      return ta;
    })();
    el.select();                    // Select the <input> content
    document.execCommand('copy');   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);  // Remove the <input> element
  }
};
const tryParseJson = jsonTrialValue => {
  if (!jsonTrialValue) { return null; }
  try {
    return JSON.parse(jsonTrialValue);
  } catch (err) {
    return jsonTrialValue;
  }
};
const storage = {
  get: key => window.localStorage.getItem(key),
  object: key => tryParseJson(window.localStorage.getItem(key)),
  set: (key, value) => window.localStorage.setItem(key, value),
  setJson: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
  remove: key => window.localStorage.removeItem(key),
  clear: () => window.localStorage.clear()
};
const round2NDecimals = (input, decimals = 2, toString = false) => {
  // just return input value if it's not a recognizable number
  if (input === null || input.constructor === Boolean || isNaN(+input)) {
    return input;
  }

  const currentNOfDecimals = (String(input).split(".")[1] || ``).length - 1;
  // recurse per decimal if necessary
  const converted = currentNOfDecimals > decimals
    ? round2NDecimals( +( `${Math.round( parseFloat( `${input}e${currentNOfDecimals}` )  )}e-${
        currentNOfDecimals}` ), decimals )
    : +( `${Math.round( parseFloat( `${input}e${decimals}` )  )}e-${decimals}` );

  return toString ? converted.toFixed(decimals) : converted;
};

export {
  cleanWhitespace,
  toZeroPaddedEuropeanDate,
  date2EuropeanDate,
  displayHour,
  throwIf,
  Logger,
  time2Fragments,
  parseAllToTemplate,
  parseTemplate,
  randomStringExtension,
  addCssIfNotAlreadyAdded,
  repeat,
  initializePrototype,
  //importAsync,
  initDefault,
  createDeepCloneExtension,
  groupDigits,
  curry,
  infiniteCurry,
  clipBoardFactory,
  storage,
  tryParseJson,
  round2NDecimals,
};
