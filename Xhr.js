import Store from "../Modules/Storage.js";
const {Xhr} = (() => {
  const checkXhrError = (result, cb) => {
    if (result.error) {
      alert(`Dat ging helaas fout, server zegt: ${result.message}`);
      throw new TypeError(`Unexpected result from Xhr: ${result.message}`);
    }
    return (cb && cb instanceof Function) ? cb(result) : result;
  }

  async function Xhr(data, method = "POST") {
    if (!data.uri) {
      return alert("Please provice an uri");
    }

    const results = await fetch(
      data.uri, {
      method: method,
      body: JSON.stringify(data),
    })
    .then(r => r.json());

    return data.onerror && data.onerror instanceof Function
      ? data.onerror(results)
      : checkXhrError(results, data.onsuccess || (() => {}));
  }

  return {Xhr};
})();

export default Xhr;
