// Число за його дробом: частину ділимо на чисельник (одна частина) і множимо на знаменник.
// Плюс розрізняємо дві задачі: «дріб від числа» і «число за дробом».
import { des, mnozh, nsd, tdes, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function drib(r: Vypadok, maxD: number, odynychnyi = false) {
  const d = r.chyslo(2, maxD);
  let n = odynychnyi ? 1 : r.chyslo(1, d - 1);
  while (nsd(n, d) !== 1) n = r.chyslo(1, d - 1);
  return { n, d };
}

const dorivniuie = (n: number) => (n === 1 ? 'дорівнює' : 'дорівнюють');

function zaDrobom(r: Vypadok, maxD: number, odynychnyi = false): TrenZavdannia {
  const { n, d } = drib(r, maxD, odynychnyi);
  const odna = r.chyslo(2, 15);
  const chastyna = n * odna;
  return {
    pytannia: `$${tdrib(n, d)}$ числа ${dorivniuie(n)} ${chastyna}. Знайди число.`,
    vidpovid: d * odna,
    pidkazka: n === 1 ? `Усе число — це ${d} таких частин.` : `Спершу одна частина: ${chastyna} : ${n}. Усе число — ${d} частин.`,
    rozviazok: n === 1 ? `${chastyna} · ${d} = ${d * odna}` : `${chastyna} : ${n} · ${d} = ${odna} · ${d} = ${d * odna}`,
  };
}

const SIUZHETY = [
  (n: number, d: number, ch: number) => ({ tekst: `На екскурсію прийшли $${tdrib(n, d)}$ учнів класу — це ${ch} ${mnozh(ch, 'учень', 'учні', 'учнів')}. Скільки учнів у класі?`, max: 6 }),
  (n: number, d: number, ch: number) => ({ tekst: `Тато проїхав ${ch} км, і це $${tdrib(n, d)}$ усього шляху. Яка довжина всього шляху (у км)?`, max: 40 }),
  (n: number, d: number, ch: number) => ({ tekst: `Оля прочитала ${ch} ${mnozh(ch, 'сторінку', 'сторінки', 'сторінок')}, а це $${tdrib(n, d)}$ книжки. Скільки сторінок у книжці?`, max: 30 }),
  (n: number, d: number, ch: number) => ({ tekst: `За день продали ${ch} кг яблук — $${tdrib(n, d)}$ усіх яблук. Скільки кілограмів яблук було?`, max: 25 }),
];

function zadacha(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 8);
  const sKlas = r.chyslo(0, SIUZHETY.length - 1);
  const odna = r.chyslo(2, sKlas === 0 ? 7 : 20);
  const chastyna = n * odna;
  const s = SIUZHETY[sKlas](n, d, chastyna);
  return {
    pytannia: s.tekst,
    vidpovid: d * odna,
    pidkazka: `Відомо частину, шукаємо ціле: ${chastyna} : ${n} · ${d}.`,
    rozviazok: `${chastyna} : ${n} = ${odna} — одна частина; ${odna} · ${d} = ${d * odna}.`,
  };
}

// Яка це задача: знайти частину чи ціле? Типова помилка — множити, коли треба ділити.
function yakaZadacha(r: Vypadok): TrenZavdannia {
  const { n, d } = drib(r, 6);
  const odna = r.chyslo(3, 12);
  const vidomeTsile = r.shans();
  const ch = vidomeTsile ? d * odna : n * odna;
  return {
    pytannia: vidomeTsile
      ? `У кошику ${ch} яблук, $${tdrib(n, d)}$ з них — червоні. Скільки червоних яблук?`
      : `Червоних яблук ${ch} — це $${tdrib(n, d)}$ усіх яблук у кошику. Скільки яблук у кошику?`,
    vidpovid: vidomeTsile ? n * odna : d * odna,
    pidkazka: vidomeTsile ? 'Відомо все, шукаємо частину — дріб від числа.' : 'Відомо частину, шукаємо все — число за дробом.',
    rozviazok: vidomeTsile ? `${ch} : ${d} · ${n} = ${n * odna}` : `${ch} : ${n} · ${d} = ${d * odna}`,
  };
}

function desiatkovyi(r: Vypadok): TrenZavdannia {
  const desiati = r.vybir([2, 4, 5, 6, 8]);
  const [n, d] = [desiati / nsd(desiati, 10), 10 / nsd(desiati, 10)];
  const odna = r.chyslo(2, 12);
  const chastyna = n * odna;
  return {
    pytannia: `$${tdes(desiati, 1)}$ числа дорівнює ${chastyna}. Знайди число.`,
    vidpovid: d * odna,
    pidkazka: `${des(desiati, 1)} = $${tdrib(desiati, 10)}$${n !== desiati ? ` $= ${tdrib(n, d)}$` : ''}.`,
    rozviazok: `${des(desiati, 1)} = $${tdrib(n, d)}$; ${chastyna} : ${n} · ${d} = ${d * odna}`,
  };
}

export default {
  rivni: ['одна частина: 1/6 числа = 9', 'кілька частин: 3/5 числа = 12', 'задачі і десяткові дроби'],
  zavdannia(r, riven) {
    if (riven === 1) return zaDrobom(r, 10, true);
    if (riven === 2) return r.shans(0.7) ? zaDrobom(r, 10) : zadacha(r);
    return r.vybir([zadacha, zadacha, yakaZadacha, desiatkovyi])(r);
  },
} satisfies Henerator;
