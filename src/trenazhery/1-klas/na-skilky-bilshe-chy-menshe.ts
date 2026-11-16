// На скільки більше чи менше (1 клас, Скворцова с. 61–65): різницеве порівняння — від більшого віднімаємо менше;
// «на кілька більше» — додаємо, «на кілька менше» — віднімаємо. Числа до 10.
import { dviOsoby, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Предмети: [називний 2–4, родовий множини].
const PREDMETY: [string, string][] = [
  ['олівці', 'олівців'],
  ['яблука', 'яблук'],
  ['наліпки', 'наліпок'],
  ['кульки', 'кульок'],
  ['машинки', 'машинок'],
  ['цукерки', 'цукерок'],
  ['горіхи', 'горіхів'],
  ['листівки', 'листівок'],
];
const sk = (n: number, [dva, piat]: [string, string]) => `${n} ${mnozh(n, dva, dva, piat)}`;

// Два ряди кружечків один під одним: сині й помаранчеві. Чисел на малюнку немає — їх треба полічити.
function riady(a: number, b: number) {
  const krok = 26;
  const r = 10;
  const W = 10 * krok + 8;
  const riad = (n: number, y: number, kolir: number) =>
    Array.from({ length: n }, (_, i) => `<circle cx="${4 + i * krok + r}" cy="${y}" r="${r}" fill="var(--ill-${kolir})" fill-opacity="0.55" stroke="var(--ill-${kolir})" stroke-width="1.5"/>`).join('');
  return `<svg viewBox="0 0 ${W} 64" width="${W}" height="64" role="img" aria-label="Два ряди кружечків">${riad(a, 16, 1)}${riad(b, 48, 2)}</svg>`;
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [m, b] = r.rizni(2, 1, 10).sort((x, y) => x - y);
  const syniBilshi = r.shans();
  const [syni, pomar] = syniBilshi ? [b, m] : [m, b];
  const proBilshe = r.shans();
  const [bilshi, menshi] = syniBilshi ? ['синіх', 'помаранчевих'] : ['помаранчевих', 'синіх'];
  return {
    malunok: riady(syni, pomar),
    pytannia: proBilshe ? `На скільки ${bilshi} кружечків більше, ніж ${menshi}?` : `На скільки ${menshi} кружечків менше, ніж ${bilshi}?`,
    vidpovid: b - m,
    pidkazka: 'Склади пари: синій і помаранчевий. Скільки кружечків залишилося без пари?',
    rozviazok: `Синіх ${syni}, помаранчевих ${pomar}. Від більшого віднімаємо менше: ${b} − ${m} = ${b - m}.`,
  };
}

function dvaChysla(r: Vypadok): TrenZavdannia {
  const [m, b] = r.rizni(2, 0, 10).sort((x, y) => x - y);
  const proBilshe = r.shans();
  return {
    pytannia: proBilshe ? `На скільки ${b} більше за ${m}?` : `На скільки ${m} менше за ${b}?`,
    vidpovid: b - m,
    pidkazka: `Від більшого числа відніми менше: ${b} − ${m}.`,
    rozviazok: `${b} − ${m} = ${b - m}`,
  };
}

function zbilshyty(r: Vypadok): TrenZavdannia {
  const bilshe = r.shans();
  const d = r.chyslo(1, 4);
  const a = bilshe ? r.chyslo(2, 10 - d) : r.chyslo(d + 1, 10);
  const vidp = bilshe ? a + d : a - d;
  if (r.shans(0.4)) {
    return {
      pytannia: `Яке число на ${d} ${bilshe ? 'більше' : 'менше'} за ${a}?`,
      vidpovid: vidp,
      pidkazka: bilshe ? `Стільки ж і ще ${d}.` : `Стільки ж, але без ${d}.`,
      rozviazok: `${a} ${bilshe ? '+' : '−'} ${d} = ${vidp}`,
    };
  }
  const p = r.vybir(PREDMETY);
  const [o1, o2] = dviOsoby(r);
  return {
    pytannia: `${o1.imia} має ${sk(a, p)}, а ${o2.imia} — на ${d} ${bilshe ? 'більше' : 'менше'}. Скільки ${p[1]} має ${o2.imia}?`,
    vidpovid: vidp,
    pidkazka: bilshe ? `«На ${d} більше» — стільки ж і ще ${d}. Додаємо.` : `«На ${d} менше» — стільки ж, але без ${d}. Віднімаємо.`,
    rozviazok: `${a} ${bilshe ? '+' : '−'} ${d} = ${vidp}`,
  };
}

function naSkilkyZadacha(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const [o1, o2] = dviOsoby(r);
  const [m, b] = r.rizni(2, 2, 10).sort((x, y) => x - y);
  const pershyiBilshyi = r.shans();
  const [x, y] = pershyiBilshyi ? [b, m] : [m, b];
  const proBilshe = r.shans();
  const [hto, vid] = pershyiBilshyi ? [o1, o2] : [o2, o1];
  return {
    pytannia: `${o1.imia} має ${sk(x, p)}, а ${o2.imia} — ${y}. На скільки ${proBilshe ? `більше ${p[1]} має ${hto.imia}` : `менше ${p[1]} має ${vid.imia}`}?`,
    vidpovid: b - m,
    pidkazka: 'Обидва числа відомі. Шукаємо різницю: від більшого віднімаємо менше.',
    rozviazok: `${b} − ${m} = ${b - m}`,
  };
}

function yakaDiia(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const [o1, o2] = dviOsoby(r);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const [m, b] = r.rizni(2, 2, 10).sort((x, y) => x - y);
    return {
      pytannia: `${o1.imia} має ${sk(b, p)}, а ${o2.imia} — ${m}. Якою дією знайти, на скільки більше ${p[1]} має ${o1.imia}?`,
      vidpovid: 'відніманням',
      varianty: ['додаванням', 'відніманням'],
      pidkazka: 'Обидва числа відомі, шукаємо різницю.',
      rozviazok: `Відніманням: ${b} − ${m} = ${b - m}. Слово «більше» тут не означає «додавай».`,
    };
  }
  const bilshe = typ === 1;
  const d = r.chyslo(1, 4);
  const a = bilshe ? r.chyslo(2, 10 - d) : r.chyslo(d + 1, 10);
  return {
    pytannia: `${o1.imia} має ${sk(a, p)}, а ${o2.imia} — на ${d} ${bilshe ? 'більше' : 'менше'}. Якою дією знайти, скільки ${p[1]} має ${o2.imia}?`,
    vidpovid: bilshe ? 'додаванням' : 'відніманням',
    varianty: ['додаванням', 'відніманням'],
    pidkazka: bilshe ? 'На кілька більше — стільки ж і ще.' : 'На кілька менше — стільки ж, але без.',
    rozviazok: `${bilshe ? 'Додаванням' : 'Відніманням'}: ${a} ${bilshe ? '+' : '−'} ${d} = ${bilshe ? a + d : a - d}.`,
  };
}

function navpaky(r: Vypadok): TrenZavdannia {
  const p = r.vybir(PREDMETY);
  const q = r.vybir(PREDMETY.filter((x) => x !== p));
  const d = r.chyslo(1, 6);
  const bilshe = r.shans();
  return {
    pytannia: `${q[1].charAt(0).toUpperCase() + q[1].slice(1)} на ${d} ${bilshe ? 'більше' : 'менше'}, ніж ${p[1]}. Тоді ${p[1]}, ніж ${q[1]}, на ${d} …`,
    vidpovid: bilshe ? 'менше' : 'більше',
    varianty: ['більше', 'менше'],
    pidkazka: 'Різниця та сама. Яких предметів залишилося б без пари?',
    rozviazok: `${bilshe ? 'Менше' : 'Більше'}: різниця одна, ${d}. Одних на ${d} більше — отже, інших на ${d} менше.`,
  };
}

export default {
  rivni: ['на скільки більше? малюнок і числа', 'більше на…, менше на…', 'задачі: вибери дію і розв’яжи'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? zaMalunkom(r) : dvaChysla(r);
    if (riven === 2) return r.vybir([zbilshyty, zbilshyty, dvaChysla])(r);
    return r.vybir([naSkilkyZadacha, naSkilkyZadacha, zbilshyty, yakaDiia, yakaDiia, navpaky])(r);
  },
} satisfies Henerator;
