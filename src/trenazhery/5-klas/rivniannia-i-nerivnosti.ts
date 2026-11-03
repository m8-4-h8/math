// Рівняння і нерівності: невідоме — доданок, зменшуване, від'ємник, множник, ділене чи дільник;
// рівняння у дві дії; найбільший / найменший натуральний розв'язок нерівності.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function odnaDiia(r: Vypadok, dodavannia: boolean): TrenZavdannia {
  const x = r.chyslo(3, dodavannia ? 99 : 12);
  const a = r.chyslo(2, dodavannia ? 99 : 12);
  const typ = r.chyslo(0, 2);
  if (dodavannia) {
    if (typ === 0) return rivniannia(`x + ${a} = ${x + a}`, x, 'Невідомий доданок = сума − відомий доданок.', `x = ${x + a} − ${a} = ${x}`);
    if (typ === 1) return rivniannia(`x − ${a} = ${x}`, x + a, 'Невідоме зменшуване = різниця + від’ємник.', `x = ${x} + ${a} = ${x + a}`);
    return rivniannia(`${x + a} − x = ${a}`, x, 'Невідомий від’ємник = зменшуване − різниця.', `x = ${x + a} − ${a} = ${x}`);
  }
  if (typ === 0) return rivniannia(`${a} · x = ${a * x}`, x, 'Невідомий множник = добуток : відомий множник.', `x = ${a * x} : ${a} = ${x}`);
  if (typ === 1) return rivniannia(`x : ${a} = ${x}`, a * x, 'Невідоме ділене = частка · дільник.', `x = ${x} · ${a} = ${a * x}`);
  return rivniannia(`${a * x} : x = ${a}`, x, 'Невідомий дільник = ділене : частка.', `x = ${a * x} : ${a} = ${x}`);
}

function rivniannia(vyraz: string, vidpovid: number, pidkazka: string, rozviazok: string): TrenZavdannia {
  return { pytannia: 'Розв’яжи рівняння.', vyraz, vidpovid, pidkazka, rozviazok: `${rozviazok}. Перевірка: підстав ${vidpovid} замість x.` };
}

function dviDii(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(2, 15);
  const a = r.chyslo(2, 9);
  const b = r.chyslo(1, 40);
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `${a} · x + ${b} = ${a * x + b}`,
      vidpovid: x,
      pidkazka: `Спершу знайди ${a} · x — це невідомий доданок.`,
      rozviazok: `${a} · x = ${a * x + b} − ${b} = ${a * x}; x = ${a * x} : ${a} = ${x}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `${a} · x − ${b} = ${a * x - b}`,
      vidpovid: x,
      pidkazka: `${a} · x — невідоме зменшуване.`,
      rozviazok: `${a} · x = ${a * x - b} + ${b} = ${a * x}; x = ${a * x} : ${a} = ${x}`,
    };
  }
  if (typ === 2) {
    const c = a * x + r.chyslo(5, 60);
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `${c} − ${a} · x = ${c - a * x}`,
      vidpovid: x,
      pidkazka: `${a} · x — невідомий від’ємник.`,
      rozviazok: `${a} · x = ${c} − ${c - a * x} = ${a * x}; x = ${a * x} : ${a} = ${x}`,
    };
  }
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `(x − ${b}) · ${a} = ${x * a}`,
    vidpovid: x + b,
    pidkazka: `Дужка (x − ${b}) — невідомий множник.`,
    rozviazok: `x − ${b} = ${x * a} : ${a} = ${x}; x = ${x} + ${b} = ${x + b}`,
  };
}

function nerivnist(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 30);
  const b = a + r.chyslo(3, 30);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Яке найбільше натуральне x задовольняє нерівність x + ${a} < ${b}?`,
      vidpovid: b - a - 1,
      pidkazka: `При x = ${b - a} сума дорівнює ${b} — це вже не менше.`,
      rozviazok: `${b - a - 1} + ${a} = ${b - 1} < ${b}, а ${b - a} + ${a} = ${b} — ні. Отже, ${b - a - 1}.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `Яке найменше натуральне x задовольняє нерівність x − ${a} > ${b - a}?`,
      vidpovid: b + 1,
      pidkazka: `При x = ${b} різниця дорівнює ${b - a} — ще не більше.`,
      rozviazok: `${b + 1} − ${a} = ${b - a + 1} > ${b - a}, а ${b} − ${a} = ${b - a} — ні. Отже, ${b + 1}.`,
    };
  }
  const k = r.chyslo(2, 9);
  const m = k * r.chyslo(3, 12);
  return {
    pytannia: `Скільки натуральних x задовольняють нерівність ${k} · x < ${m}?`,
    vidpovid: m / k - 1,
    pidkazka: `${k} · x = ${m} при x = ${m / k}. Потрібні менші натуральні: 1, 2, …`,
    rozviazok: `x = 1, 2, …, ${m / k - 1} — усього ${m / k - 1}.`,
  };
}

export default {
  rivni: ['невідомий доданок, зменшуване, від’ємник', 'невідомий множник, ділене, дільник', 'рівняння у дві дії і нерівності'],
  zavdannia(r, riven) {
    if (riven === 1) return odnaDiia(r, true);
    if (riven === 2) return r.shans(0.75) ? odnaDiia(r, false) : odnaDiia(r, true);
    return r.vybir([dviDii, dviDii, dviDii, nerivnist])(r);
  },
} satisfies Henerator;
