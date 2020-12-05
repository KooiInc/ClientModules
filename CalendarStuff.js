const months = "januari,februaryi,maart,april,mei,juni,juli,augustus,september,oktober,november,december".split(",");
const weekDays = "Zondag, Maandag, Dinsdag, Woensdag, Donderdag, Vrijdag, Zaterdag".split(", ")
const weekDaysShort = "Zo, Ma, Di, Wo, Do, Vr, Za".split(", ")
const month2Str = m => months[m];
const addDays = (d, n) => new Date(new Date(d).setDate(d.getDate() + n));
const addMonths = (d, n) => new Date(new Date(d).setMonth(d.getMonth() + n));
const tomorrow = d => addDays(d, 1);
const yesterday = d => addDays(d, -1);
const firstOfMonth = d => new Date(new Date(d).setDate(1));
const nextMonth = d => addMonths(d, 1);
const lastDayOfThisMonth = now => yesterday(firstOfMonth(nextMonth(now)));
const isWeekend = d => /zaterdag|zondag|sunday|saturday/i.test(weekDays[d.getDay()]);
const formatDay = date => `${weekDays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
const lpad = nr => `${nr}`.padStart(2, "0");

const getMonth = (month = new Date().getMonth()) => {
  let now = new Date();
  const isCurrentMonth = now.getMonth() + 1 === month;

  if (!isCurrentMonth) {
    now = firstOfMonth(new Date(now.setMonth(month - 1)));
  }

  const lastDate = lastDayOfThisMonth(now).getDate();
  const nDates = (isCurrentMonth ? (lastDate - now.getDate() + 1) : lastDate) - 1;
  const nextDates = [...Array(nDates)].reduce(a => ([...a, tomorrow(a.slice(-1)[0])]), [now]);
  return nextDates;
};

const getNDaysFromNow = nDays => {
  let now = new Date();
  let days = [now];
  return [...Array(nDays)].reduce(a => {
      return [...a, tomorrow(a.slice(-1)[0])];
    }, days)
    .map(v => ({
      day: weekDays[v.getDay()],
      dateOnly: `${v.getFullYear()}/${v.getMonth()+1}/${v.getDate()}`,
      short: `${lpad(v.getDate())}/${lpad(v.getMonth()+1)}`,
      date: v,
      display: `${weekDaysShort[v.getDay()]} ${v.getDate()} ${months[v.getMonth()]}`,
      isWeekend: isWeekend(v)
    }))
}

const getThisAndNextWeek = () => {
  let now = new Date();
  let days = [now];
  return [...Array(14)].reduce(a => {
      return [...a, tomorrow(a.slice(-1)[0])];
    }, days)
    .map(v => ({
      day: weekDays[v.getDay()],
      date: v,
      display: `${weekDays[v.getDay()]} ${v.getDate()} ${months[v.getMonth()]} ${v.getFullYear()}`,
      isWeekend: isWeekend(v)
    }))
}

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
  formatDay
};
