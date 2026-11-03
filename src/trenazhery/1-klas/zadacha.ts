// Задача (1 клас): умова, запитання, одна дія. Ціле — додаємо, частину — віднімаємо.
import { dviOsoby, mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Предмет у трьох формах: 2 олівці / 5 олівців; знахідний відмінок для 2–4 збігається з називним.
const PREDMETY: [string, string][] = [
  ['олівці', 'олівців'],
  ['яблука', 'яблук'],
  ['наліпки', 'наліпок'],
  ['кульки', 'кульок'],
  ['машинки', 'машинок'],
  ['книжки', 'книжок'],
  ['цукерки', 'цукерок'],
  ['горіхи', 'горіхів'],
];
// Числа в цих задачах від 2 до 20, тож форми однини не потрібні.
const sk = (n: number, [dva, piat]: [string, string]) => `${n} ${mnozh(n, dva, dva, piat)}`;

function tsile(r: Vypadok, mezha: number): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const a = r.chyslo(2, mezha - 2);
  const b = r.chyslo(2, mezha - a);
  if (r.shans()) {
    const o = osoba(r);
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${sk(a, p)}. ${rid(o, 'Йому', 'Їй')} дали ще ${b}. Скільки ${p[1]} стало в ${rid(o, 'нього', 'неї')}?`,
      vidpovid: a + b,
      pidkazka: 'Дали ще — стало більше. Шукаємо ціле.',
      rozviazok: `Ціле = частина + частина: ${a} + ${b} = ${a + b}.`,
    };
  }
  const [o1, o2] = dviOsoby(r);
  return {
    pytannia: `${o1.imia} має ${sk(a, p)}, а ${o2.imia} — ${sk(b, p)}. Скільки ${p[1]} у них разом?`,
    vidpovid: a + b,
    pidkazka: 'Разом — це ціле. Додаємо частини.',
    rozviazok: `${a} + ${b} = ${a + b}`,
  };
}

function chastyna(r: Vypadok, mezha: number): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const vsi = r.chyslo(4, mezha);
  const b = r.chyslo(2, vsi - 2);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const o = osoba(r);
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${sk(vsi, p)}. ${rid(o, 'Він', 'Вона')} ${rid(o, 'віддав', 'віддала')} другові ${b}. Скільки ${p[1]} лишилось?`,
      vidpovid: vsi - b,
      pidkazka: 'Віддав — стало менше. Шукаємо частину, що лишилась.',
      rozviazok: `Частина = ціле − частина: ${vsi} − ${b} = ${vsi - b}.`,
    };
  }
  if (typ === 1) {
    const [o1, o2] = dviOsoby(r);
    return {
      pytannia: `${o1.imia} і ${o2.imia} разом мають ${sk(vsi, p)}. ${o1.imia} має ${b}. Скільки ${p[1]} має ${o2.imia}?`,
      vidpovid: vsi - b,
      pidkazka: 'Усі разом — це ціле. Одна частина відома, шукаємо іншу.',
      rozviazok: `Частина = ціле − частина: ${vsi} − ${b} = ${vsi - b}.`,
    };
  }
  const d = r.chyslo(Math.ceil(vsi / 2), vsi - 1);
  return {
    pytannia: `У класі ${vsi} ${mnozh(vsi, 'учень', 'учні', 'учнів')}. З них ${d} — дівчатка. Скільки хлопчиків?`,
    vidpovid: vsi - d,
    pidkazka: 'Усі учні — ціле. Дівчатка — частина. Шукаємо іншу частину.',
    rozviazok: `${vsi} − ${d} = ${vsi - d}`,
  };
}

function bulo(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const o = osoba(r);
  const a = r.chyslo(2, 7);
  const b = r.chyslo(2, 10 - a);
  return {
    pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} кілька ${p[1]}. ${rid(o, 'Йому', 'Їй')} подарували ще ${b}, і стало ${a + b}. Скільки ${p[1]} було спочатку?`,
    vidpovid: a,
    pidkazka: `${a + b} — це вже всі разом (ціле). Шукаємо частину, яка була спочатку.`,
    rozviazok: `Шукаємо частину: ${a + b} − ${b} = ${a}.`,
  };
}

export default {
  rivni: ['знайди, скільки разом (до 10)', 'скільки лишилось або скільки разом', 'складніші: що було спочатку, до 20'],
  zavdannia(r, riven) {
    if (riven === 1) return tsile(r, 10);
    if (riven === 2) return r.shans() ? tsile(r, 10) : chastyna(r, 10);
    return r.vybir([() => tsile(r, 20), () => chastyna(r, 20), () => bulo(r)])();
  },
} satisfies Henerator;
