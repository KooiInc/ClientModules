let languages = { EN: "EN", NL: "NL", DE: "DE", FR: "FR",
  _current: "EN",
  default: "EN",
  set current(val) { this._current = this[val.toUpperCase()] || this.default; },
  get current() { return this._current; },
};
const setLang = (lang = "EN") => languages.current = lang;
const months = {
  NL: "januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december".split(","),
  EN: "january,february,march,april,may,june,juli,august,september,october,november,december".split(","),
  DE: "Januar Februar März April Mai Juni Juli August September Oktober November Dezember".split(" "),
  FR: "Janvier Février Mars Avril Mai Juin Juillet Aôut Septembre Octobre Novembre Décembre".split(" "),
};
const weekDays = {
  NL: "Zondag, Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag, Zaterdag".split(", "),
  EN: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday".split(", "),
  DE: "Sontag Montag Dienstag Mittwoch Donnertag Freitag Samstag".split(" "),
  FR: "Dimanche Lundi Mardi Mercredi Jeudi Vendredi Samedi".split(" "),

};
const weekDaysShort = {
  NL: "Zo, Ma, Di, Wo, Do, Vr, Za".split(", "),
  EN: "Su, Mo, Tu, We, Th, Fr, Sa".split(", "),
  DE: "So, Mo, Di, Mi, Do, Fr, Sa".split(", "),
  FR: "Di, Lu, Ma, Me, Je, Ve, Sa".split(", "),
};
const types = {month: "months", weekDay: "weekDays", weekDayShort: "weekDaysShort"};
const strings = { months, weekDays, weekDaysShort };
const getStringFor = (type, value, lang = "EN") => strings[type][lang][value];
const month2Str = m => getStringFor(types.month, m, languages.current);
const weekDay2Str = wd => getStringFor(types.weekDay, wd, languages.current);
const weekDay2ShortStr = wd => getStringFor(types.weekDayShort, wd, languages.current);
const addDays = (d, n) => new Date(new Date(d).setDate(d.getDate() + n));
const addMonths = (d, n) => new Date(new Date(d).setMonth(d.getMonth() + n));
const tomorrow = d => addDays(d, 1);
const yesterday = d => addDays(d, -1);
const firstOfMonth = d => new Date(new Date(d).setDate(1));
const nextMonth = d => addMonths(d, 1);
const lastDayOfThisMonth = now => yesterday(firstOfMonth(nextMonth(now)));
const isWeekend = d => /sunday|saturday/i.test(weekDays[languages.EN][d.getDay()]);
const formatDay = date => `${getStringFor(types.weekDay, date.getDay(), languages.current)} ${
  date.getDate()} ${getStringFor(types.month, date.getMonth(), languages.current)} ${date.getFullYear()}`;
const lpad = nr => `${nr}`.padStart(2, "0");
const getMonth = (month = new Date().getMonth()) => {
  let now = new Date();
  const isCurrentMonth = now.getMonth() + 1 === month;

  if (!isCurrentMonth) {
    now = firstOfMonth(new Date(now.setMonth(month - 1)));
  }

  const lastDate = lastDayOfThisMonth(now).getDate();
  const nDates = (isCurrentMonth ? (lastDate - now.getDate() + 1) : lastDate) - 1;
  return [...Array(nDates)].reduce(a => ([...a, tomorrow(a.slice(-1)[0])]), [now]);
};
const getNDaysFromNow = nDays => {
  let now = new Date();
  let days = [now];
  return [...Array(nDays)].reduce(a => {
    return [...a, tomorrow(a.slice(-1)[0])];
  }, days)
    .map(v => ({
      day: weekDay2Str(v.getDay()),
      dateOnly: `${v.getFullYear()}/${v.getMonth() + 1}/${v.getDate()}`,
      short: `${lpad(v.getDate())}/${lpad(v.getMonth() + 1)}`,
      date: v,
      display: `${weekDay2ShortStr(v.getDay())} ${v.getDate()} ${month2Str(v.getMonth())}`,
      isWeekend: isWeekend(v),
    }))
};
const getThisAndNextWeek = () => {
  let now = new Date();
  let days = [now];
  return [...Array(14)].reduce(a => {
    return [...a, tomorrow(a.slice(-1)[0])];
  }, days)
    .map(v => ({
      day: getStringFor(types.weekDay, v.getDay(), languages.current),
      date: v,
      display: `${getStringFor(type.weekDay, v.getDay(), languages.current)} ${
        v.getDate()} ${getStringFor(types.month, v.getMonth(), languages.current)} ${
        v.getFullYear()}`,
      isWeekend: isWeekend(v),
    }))
};
const allMonths = [...Array(11)]
  .reduce((a) =>
      ([...a, nextMonth(firstOfMonth(a.slice(-1)[0]))]),
    [new Date(new Date(new Date().setMonth(0)).setDate(1))]);
const monthsFromNow = () => [...Array(11 - new Date().getMonth())]
  .reduce((a) => ([...a, nextMonth(firstOfMonth(a.slice(-1)[0]))]),
    [new Date(new Date(new Date().setDate(1)))]);
const timesOfDay = [...Array(24)].map((v, i) => `${i}`.padStart(2, `0`))
  .reduce((a, v) => ([...a, ...[`${v}:00`, `${v}:30`]]), []);

export {
  getMonth,
  month2Str,
  timesOfDay,
  monthsFromNow,
  allMonths,
  getNDaysFromNow,
  getThisAndNextWeek,
  formatDay,
  setLang,
};