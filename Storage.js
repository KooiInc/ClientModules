const {Store} = (() => {
  const tryParseJson = jsonTrialValue => {
    if (!jsonTrialValue) { return null; }
    try {
      return JSON.parse(jsonTrialValue);
    } catch (err) {
      return jsonTrialValue;
    }
  };
  const Store = {
    getPlain: key => localStorage.getItem(key),
    retrieveObject: key => tryParseJson(localStorage.getItem(key)),
    setPlain: (key, value) => localStorage.setItem(key, value),
    setJson: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: key => localStorage.removeItem(key),
    clearExcept: (...except) => {
      Object.entries(localStorage).forEach(([key]) => {
        if (!except.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    }
  };
  return {Store};
})();

export default Store;
