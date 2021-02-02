let languages = {
  EN: "EN", NL: "NL", DE: "DE", FR: "FR",
  _current: "EN",
  default: "EN",
  set current(val) { this._current = this[val.toUpperCase()] || this.default; },
  get current() { return this._current; },
};
/** string stuff */
const setLang = (lang = "EN") => languages.current = lang;
const months = {
  NL: "januari, februari, maart, april, mei, juni, juli, augustus, september, oktober, november, december".split(", "),
  EN: "january, february, march, april, may, june, juli, august, september, october, november, december".split(", "),
  DE: "januar, februar, märz, april, mai, juni, juli, august, september, oktober, november, dezember".split(", "),
  FR: "janvier, février, mars, avril, mai, juin, juillet, aôut, septembre, octobre, novembre, décembre".split(", "),
};
const weekDays = {
  NL: "Zondag, Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag, Zaterdag".split(", "),
  EN: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday".split(", "),
  DE: "Sontag, Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag".split(", "),
  FR: "Dimanche, Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi".split(", "),

};
const weekDaysShort = {
  NL: "Zo, Ma, Di, Wo, Do, Vr, Za".split(", "),
  EN: "Su, Mo, Tu, We, Th, Fr, Sa".split(", "),
  DE: "So, Mo, Di, Mi, Do, Fr, Sa".split(", "),
  FR: "Di, Lu, Ma, Me, Je, Ve, Sa".split(", "),
};
const lpad = nr => `${nr}`.padStart(2, "0");
const firstOfMonth = (month = 1, year = 2000) => new Date(Date.UTC(year, month - 1, 1));
const lastOfMonth = (month = 1, year = 2000) => addDays(firstOfMonth(month + 1, year), -1);
// noinspection JSUnusedLocalSymbols stupid webstorm statement by statement sjizl
const nextMonth = (someDate = new Date()) => addMonths(someDate, 1);
const types = { month: "months", weekDay: "weekDays", weekDayShort: "weekDaysShort" };
const strings = { months, weekDays, weekDaysShort };
const getStringFor = (type, value, lang = "EN") => strings[type][lang][value];
const month2Str = m => getStringFor(types.month, m, languages.current);
const weekDay2Str = wd => getStringFor(types.weekDay, wd, languages.current);
// noinspection JSUnusedLocalSymbols stupid webstorm statement by statement sjizl
const weekDay2ShortStr = wd => getStringFor(types.weekDayShort, wd, languages.current);
const dateOnlyStr = (someDate = new Date()) =>
  `${someDate.getFullYear()}/${someDate.getMonth() + 1}/${someDate.getDate()}`;
const dateShortStr = (someDate = new Date()) => languages.current === "EN" ?
  `${lpad(someDate.getMonth() + 1)}/${lpad(someDate.getDate())}` :
  `${lpad(someDate.getDate())}/${lpad(someDate.getMonth() + 1)}`;
const displayDate = v => languages.current === "EN" ?
  `${getStringFor(types.weekDay, v.getDay(), languages.current)} ${getStringFor(types.month, v.getMonth(), languages.current)} ${v.getDate()} ${v.getFullYear()}` :
  `${getStringFor(types.weekDay, v.getDay(), languages.current)} ${v.getDate()} ${getStringFor(types.month, v.getMonth(), languages.current)} ${v.getFullYear()}`;
/** date retrieval methods */
const now = () => new Date(new Date().toUTCString());
const addDays = (d, n) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + n));
const addMonths = (d, n) => new Date(Date.UTC(d.getFullYear(), d.getMonth() + n, d.getDate()));
const tomorrow = (someDate = new Date()) => addDays(someDate, 1);
const lastDayOfMonth = (month, year = 2000) => lastOfMonth(month, year).getDate();
const isWeekend = (d = new Date()) => /sunday|saturday/i.test(weekDays[languages.EN][new Date(d).getDay()]);
const formatDay = date => `${getStringFor(types.weekDay, date.getDay(), languages.current)} ${date.getDate()} ${getStringFor(types.month, date.getMonth(), languages.current)} ${date.getFullYear()}`;
const someDay = (someDate = new Date()) => ({
  day: [someDate.getDay(), weekDay2Str(someDate.getDay())],
  month: month2Str(someDate.getMonth()),
  dateOnly: dateOnlyStr(someDate),
  dateShort: dateShortStr(someDate),
  date: someDate,
  display: displayDate(someDate),
  isWeekend: isWeekend(someDate),
});
/** retrieve range of all dates of [month] in [year]. Note: [month] is NOT zero based */
const getMonth = (month = now().getUTCMonth(), year = now().getUTCFullYear()) => {
  let firstOfCurrentMonth = firstOfMonth(month, year);
  const nDates = lastDayOfMonth(month);
  return [...Array(nDates - 1)]
    .reduce(a =>
      ([...a, someDay(tomorrow(a.slice(-1)[0].date))]), [someDay(firstOfCurrentMonth)]);
};
/** retrieve range of dates: [fromDate] plus or minus ([backward] true) [nDays] */
const getNDaysFromDate = (fromDate = now(), nDays = 6, backward = false) => {
  let days = [backward ? addDays(fromDate, -nDays) : fromDate];
  return [...Array(nDays)].reduce(a => {
    return [...a, tomorrow(a.slice(-1)[0])];
  }, days).map(someDay);
};

const getTodayPlusNextWeek = () => getNDaysFrom(7);
export {
  getMonth,
  month2Str,
  getNDaysFromDate,
  getTodayPlusNextWeek,
  isWeekend,
  formatDay,
  someDay,
  setLang,
};
