// Відношення: частка двох чисел (у скільки разів одне більше за інше); скорочення відношення;
// величини — в однакових одиницях; поділ числа у даному відношенні (спершу кількість частин).
import { des, mnozh, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function chastka(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 12);
  const k = r.chyslo(2, 9);
  return {
    pytannia: 'Знайди відношення.',
    vyraz: `$${b * k} : ${b} =$`,
    vidpovid: k,
    pidkazka: 'Відношення — це частка: у скільки разів перше число більше за друге.',
    rozviazok: `${b * k} : ${b} = ${k}`,
  };
}

function skorotyty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9);
    if (nsd(p, q) !== 1) continue;
    const k = r.chyslo(2, 9);
    return {
      pytannia: 'Скороти відношення. Запиши через двокрапку, наприклад «2:3».',
      vyraz: `$${p * k} : ${q * k}$`,
      vidpovid: `${p}:${q}`,
      pidkazka: `Поділи обидва числа на НСД(${p * k}; ${q * k}).`,
      rozviazok: `НСД = ${k}; ${p * k} : ${k} = ${p}, ${q * k} : ${k} = ${q}. Відповідь: ${p}:${q}.`,
    };
  }
}

const ODYNYTSI = [
  { velyka: 'м', mala: 'см', k: 100 },
  { velyka: 'кг', mala: 'г', k: 1000 },
  { velyka: 'год', mala: 'хв', k: 60 },
  { velyka: 'дм', mala: 'см', k: 10 },
];

function odynytsi(r: Vypadok): TrenZavdannia {
  const o = r.vybir(ODYNYTSI);
  const dilnyky = [2, 4, 5, 10, 20, 25, 50].filter((d) => o.k % d === 0 && o.k / d >= 2);
  const d = r.vybir(dilnyky.length ? dilnyky : [2]);
  const mala = o.k / d;
  const n = r.chyslo(1, 5);
  return {
    pytannia: `Знайди відношення ${n} ${o.velyka} до ${mala} ${o.mala}.`,
    vidpovid: n * d,
    perevirka: (v) => v.replace(/\s/g, '') === `${n * d}:1`,
    pidkazka: `Спершу переведи в однакові одиниці: 1 ${o.velyka} = ${o.k} ${o.mala}.`,
    rozviazok: `${n} ${o.velyka} — це ${n * o.k} ${o.mala}; ${n * o.k} : ${mala} = ${n * d}.`,
  };
}

function desiatkove(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 9);
  const k = r.chyslo(2, 6);
  return {
    pytannia: 'Знайди відношення.',
    vyraz: `$${des(b * k, 1).replace(',', '{,}')} : ${des(b, 1).replace(',', '{,}')} =$`,
    vidpovid: k,
    pidkazka: 'Помнож обидва члени на 10 — відношення не зміниться.',
    rozviazok: `${des(b * k, 1)} : ${des(b, 1)} = ${b * k} : ${b} = ${k}`,
  };
}

const PODIL = [
  { umova: (s: number, p: number, q: number) => `Мотузку завдовжки ${s} м розрізали на дві частини у відношенні ${p} : ${q}.`, bilsha: 'Яка довжина більшої частини (у м)?', mensha: 'Яка довжина меншої частини (у м)?', od: 'м' },
  {
    umova: (s: number, p: number, q: number) => `${skilky(s, 'цукерку', 'цукерки', 'цукерок')} поділили між Олею і Тарасом у відношенні ${p} : ${q}.`,
    bilsha: 'Скільки цукерок отримав той, кому дісталося більше?',
    mensha: 'Скільки цукерок отримав той, кому дісталося менше?',
  },
  { umova: (s: number, p: number, q: number) => `Для фарби змішали білу і синю у відношенні ${p} : ${q}, усього ${s} л.`, bilsha: 'Скільки літрів тієї фарби, якої більше?', mensha: 'Скільки літрів тієї фарби, якої менше?', od: 'л' },
];

function podil(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9);
    if (nsd(p, q) !== 1) continue;
    const chastyna = r.chyslo(2, 8);
    const s = (p + q) * chastyna;
    const pd = r.vybir(PODIL);
    const bilsha = r.shans();
    const v = (bilsha ? Math.max(p, q) : Math.min(p, q)) * chastyna;
    return {
      pytannia: `${pd.umova(s, p, q)} ${bilsha ? pd.bilsha : pd.mensha}`,
      vidpovid: v,
      odynytsi: pd.od,
      pidkazka: `Усього ${p} + ${q} = ${p + q} ${mnozh(p + q, 'частина', 'частини', 'частин')}. Скільки припадає на одну?`,
      rozviazok: `${p} + ${q} = ${p + q} (частин); ${s} : ${p + q} = ${chastyna} — одна частина; ${chastyna} · ${bilsha ? Math.max(p, q) : Math.min(p, q)} = ${v}.`,
    };
  }
}

export default {
  rivni: ['відношення як частка', 'скорочуємо, різні одиниці', 'ділимо у відношенні'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? chastka(r) : skorotyty(r);
    if (riven === 2) return r.vybir([skorotyty, odynytsi, desiatkove])(r);
    return r.vybir([podil, podil, odynytsi, skorotyty])(r);
  },
} satisfies Henerator;
