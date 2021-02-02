let languages = {
  EN: "EN", NL: "NL", DE: "DE", FR: "FR",
  _current: "EN",
  default: "EN",
  set current(val) { this._current = this[val.toUpperCase()] || this.default; },
  get current() { return this._current; },
};
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
const types = { month: "months", weekDay: "weekDays", weekDayShort: "weekDaysShort" };
const strings = { months, weekDays, weekDaysShort };
const getStringFor = (type, value, lang = "EN") => strings[type][lang][value];
const month2Str = m => getStringFor(types.month, m, languages.current);
const weekDay2Str = wd => getStringFor(types.weekDay, wd, languages.current);
// noinspection JSUnusedLocalSymbols
const weekDay2ShortStr = wd => getStringFor(types.weekDayShort, wd, languages.current);
// noinspection JSUnusedLocalSymbols stupid webstorm statement by statement sjizl
const yesterday = d => addDays(d, -1);
const displayDate = v => languages.current === "EN" ?
  `${getStringFor(types.weekDay, v.getDay(), languages.current)} ${
      getStringFor(types.month, v.getMonth(), languages.current)} ${v.getDate()} ${v.getFullYear()}` :
  `${getStringFor(types.weekDay, v.getDay(), languages.current)} ${v.getDate()} ${
      getStringFor(types.month, v.getMonth(), languages.current)} ${v.getFullYear()}`;
const addDays = (d, n) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + n));
const addMonths = (d, n) => new Date(Date.UTC(d.getFullYear(), d.getMonth() + n, d.getDate()));
const tomorrow = d => addDays(d, 1);
const firstOfMonth = d => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const nextMonth = d => addMonths(d, 1);
const lastDayOfThisMonth = forDate => {
  let firstOfNextMonth = new Date(forDate);
  firstOfNextMonth.setMonth(forDate.getMonth() + 1);
  return addDays(firstOfNextMonth, -1).getDate();
};
const isWeekend = (d = new Date()) => /sunday|saturday/i.test(weekDays[languages.EN][new Date(d).getDay()]);
const formatDay = date => `${getStringFor(types.weekDay, date.getDay(), languages.current)} ${date.getDate()} ${getStringFor(types.month, date.getMonth(), languages.current)} ${date.getFullYear()}`;
const someDay = (someDate = new Date()) => ({
  day: weekDay2Str(someDate.getDay()),
  dateOnly: `${someDate.getFullYear()}/${someDate.getMonth() + 1}/${someDate.getDate()}`,
  short: languages.current === "EN" ?
    `${lpad(someDate.getMonth() + 1)}/${lpad(someDate.getDate())}` :
    `${lpad(someDate.getDate())}/${lpad(someDate.getMonth() + 1)}`,
  date: someDate,
  display: displayDate(someDate),
  isWeekend: isWeekend(someDate),
})
const lpad = nr => `${nr}`.padStart(2, "0");
const getMonth = (month = new Date().getUTCMonth(), year = new Date().getUTCFullYear()) => {
  let firstOfMonth = someDay(new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)));
  const nDates = lastDayOfThisMonth(firstOfMonth.date);
  return [...Array(nDates - 1)].reduce(a => ([...a, someDay(tomorrow(a.slice(-1)[0].date))]), [firstOfMonth]);
};
const getNDaysFromNow = nDays => {
  let now = new Date();
  let days = [now];
  return [...Array(nDays)].reduce(a => {
    return [...a, tomorrow(a.slice(-1)[0])];
  }, days).map(v => someDay);
};
const getTodayPlusNextWeek = () => {
  let now = new Date();
  let days = [now];
  return [...Array(14)].reduce(a => {
    return [...a, tomorrow(a.slice(-1)[0])];
  }, days)
    .map(v => ({
      day: getStringFor(types.weekDay, v.getDay(), languages.current),
      date: v,
      display: displayDate(v),
      isWeekend: isWeekend(v),
    }));
};
export {
  getMonth,
  month2Str,
  getNDaysFromNow,
  getTodayPlusNextWeek,
  isWeekend,
  formatDay,
  setLang,
};