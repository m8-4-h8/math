// Таблиця множення і ділення: приклади, віконця, задачі на однакові групи.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Підказка-«якір»: як дійти до добутку від відомого (на 5, на 10, подвоєння).
function yakir(a: number, b: number) {
  if (b === 9) return `${a} · 10 = ${a * 10}, і відніми ${a}.`;
  if (b === 4) return `Подвой ${a} двічі: ${a * 2}, ${a * 4}.`;
  if (b === 6) return `${a} · 5 = ${a * 5}, і ще ${a}.`;
  if (b > 5) return `${a} · 5 = ${a * 5}, і ще ${b - 5} ${mnozh(b - 5, 'раз', 'рази', 'разів')} по ${a}.`;
  return `${Array.from({ length: b }, () => a).join(' + ')}`;
}

function mnozhennia(r: Vypadok, vid: number, do_: number): TrenZavdannia {
  const a = r.chyslo(vid, do_);
  const b = r.chyslo(2, 9);
  const [x, y] = r.shans() ? [a, b] : [b, a];
  return { vyraz: `${x} · ${y} =`, vidpovid: a * b, pidkazka: yakir(a, b), rozviazok: `${x} · ${y} = ${a * b}` };
}

function dilennia(r: Vypadok, vid: number, do_: number): TrenZavdannia {
  const a = r.chyslo(vid, do_);
  const b = r.chyslo(2, 9);
  return {
    vyraz: `${a * b} : ${a} =`,
    vidpovid: b,
    pidkazka: `${a} помножити на яке число дає ${a * b}?`,
    rozviazok: `${a * b} : ${a} = ${b}, бо ${a} · ${b} = ${a * b}.`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  return r.shans()
    ? {
        pytannia: 'Яке число у віконці?',
        vyraz: `${a} · □ = ${a * b}`,
        vidpovid: b,
        pidkazka: `Невідомий множник: ${a * b} : ${a}.`,
        rozviazok: `${a * b} : ${a} = ${b}`,
      }
    : {
        pytannia: 'Яке число у віконці?',
        vyraz: `□ : ${a} = ${b}`,
        vidpovid: a * b,
        pidkazka: `Невідоме ділене: ${b} · ${a}.`,
        rozviazok: `${b} · ${a} = ${a * b}`,
      };
}

// Де лежать (місцевий, знахідний відмінок, «у кожній/кожному») і що лежить (1 / 2–4 / 5+, знахідний).
const UPAKOVKY = [
  { de: 'коробках', kudy: 'коробки', kozhn: 'кожній', shcho: ['олівець', 'олівці', 'олівців'] },
  { de: 'пакетах', kudy: 'пакети', kozhn: 'кожному', shcho: ['яблуко', 'яблука', 'яблук'] },
  { de: 'вазах', kudy: 'вази', kozhn: 'кожній', shcho: ['квітку', 'квітки', 'квіток'] },
  { de: 'кошиках', kudy: 'кошики', kozhn: 'кожному', shcho: ['гриб', 'гриби', 'грибів'] },
] as const;

function zadacha(r: Vypadok): TrenZavdannia {
  const u = r.vybir(UPAKOVKY);
  const [odyn, dva, piat] = u.shcho;
  const forma = (n: number) => `${n} ${mnozh(n, odyn, dva, piat)}`;
  const a = r.chyslo(3, 9);
  const b = r.chyslo(3, 9);
  if (r.shans()) {
    return {
      pytannia: `У ${a} ${u.de} по ${forma(b)}. Скільки ${piat} усього?`,
      vidpovid: a * b,
      pidkazka: `По ${b} взяли ${a} ${mnozh(a, 'раз', 'рази', 'разів')} — множимо.`,
      rozviazok: `${b} · ${a} = ${a * b}`,
    };
  }
  const o = osoba(r);
  return {
    pytannia: `${o.imia} ${rid(o, 'розклав', 'розклала')} ${forma(a * b)} порівну в ${a} ${u.kudy}. Скільки ${piat} у ${u.kozhn}?`,
    vidpovid: b,
    pidkazka: 'Порівну — ділимо.',
    rozviazok: `${a * b} : ${a} = ${b}`,
  };
}

export default {
  rivni: ['множення на 2, 3, 4, 5', 'уся таблиця: множення й ділення', 'віконця і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.75) ? mnozhennia(r, 2, 5) : dilennia(r, 2, 5);
    if (riven === 2) return r.shans() ? mnozhennia(r, 2, 9) : dilennia(r, 2, 9);
    return r.vybir([() => mnozhennia(r, 6, 9), () => dilennia(r, 6, 9), () => vikontse(r), () => zadacha(r)])();
  },
} satisfies Henerator;
