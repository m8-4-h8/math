// Задачі на знаходження третього числа (2 клас, Скворцова с. 27–28, 64, 90): третє — «стільки, скільки перше і
// друге разом» (додаємо); третій доданок — усього без двох відомих: S − (a + b); друге число дане через
// «на … більше / менше» — тоді спершу шукаємо його; сума трьох доданків і зайве число.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const sht = (n: number, odyn: string, dva: string, piat: string) => `${n} ${mnozh(n, odyn, dva, piat)}`;

interface SiuzhetSumy {
  /** Умова: перше, друге (готовий текст другого числа) і запитання про третє. */
  tekst: (a: number, druhe: string) => string;
  /** Як назвати друге число в умові «на … більше»: «на 5 більше». */
  odynytsi: string;
  /** Що шукаємо першою дією, якщо друге дане через «на»: «у другій печері». */
  druhe: string;
  tretie: string;
}

function siuzhetySumy(r: Vypadok): SiuzhetSumy[] {
  const o = osoba(r);
  return [
    {
      tekst: (a, d) => `У першій печері ${sht(a, 'кажан', 'кажани', 'кажанів')}, у другій — ${d}, а в третій — стільки, скільки в першій і другій разом. Скільки кажанів у третій печері?`,
      odynytsi: 'к.',
      druhe: 'у другій печері',
      tretie: 'в третій',
    },
    {
      tekst: (a, d) => `У першому акваріумі ${sht(a, 'рибка', 'рибки', 'рибок')}, у другому — ${d}, а в третьому — стільки, скільки в першому і другому разом. Скільки рибок у третьому акваріумі?`,
      odynytsi: 'р.',
      druhe: 'у другому акваріумі',
      tretie: 'в третьому',
    },
    {
      tekst: (a, d) => `${o.imia} ${rid(o, 'намалював', 'намалювала')} ${sht(a, 'трикутник', 'трикутники', 'трикутників')}, чотирикутників — ${d}, а кругів — стільки, скільки трикутників і чотирикутників разом. Скільки кругів ${rid(o, 'він намалював', 'вона намалювала')}?`,
      odynytsi: 'ф.',
      druhe: 'чотирикутників',
      tretie: 'кругів',
    },
    {
      tekst: (a, d) => `Мама спекла ${sht(a, 'пиріжок', 'пиріжки', 'пиріжків')} з капустою, з картоплею — ${d}, а з вишнями — стільки, скільки з капустою і картоплею разом. Скільки пиріжків з вишнями спекла мама?`,
      odynytsi: 'п.',
      druhe: 'з картоплею',
      tretie: 'з вишнями',
    },
    {
      tekst: (a, d) => `На першій клумбі ${sht(a, 'кущ', 'кущі', 'кущів')} троянд, на другій — ${d}, а на третій — стільки, скільки на першій і другій разом. Скільки кущів троянд на третій клумбі?`,
      odynytsi: 'к.',
      druhe: 'на другій клумбі',
      tretie: 'на третій',
    },
  ];
}

// Третє — стільки, скільки перше і друге разом (одна дія).
function sumaProsta(r: Vypadok, do100: boolean): TrenZavdannia {
  const a = do100 ? r.chyslo(12, 48) : r.chyslo(3, 9);
  const b = do100 ? r.chyslo(12, 48) : r.chyslo(Math.max(2, 11 - a), 9);
  const s = r.vybir(siuzhetySumy(r));
  return {
    pytannia: s.tekst(a, String(b)),
    vidpovid: a + b,
    pidkazka: '«Стільки, скільки … разом» — це сума перших двох чисел.',
    rozviazok: `${a} + ${b} = ${a + b} (${s.odynytsi}) — стільки разом, тому ${s.tretie} теж ${a + b}.`,
  };
}

// Друге дане через «на … більше / менше»: спершу друге, потім третє.
function sumaNa(r: Vypadok): TrenZavdannia {
  const s = r.vybir(siuzhetySumy(r));
  const bilshe = r.shans();
  const a = bilshe ? r.chyslo(6, 30) : r.chyslo(12, 40);
  const n = bilshe ? r.chyslo(2, 9) : r.chyslo(2, Math.min(9, a - 3));
  const b = bilshe ? a + n : a - n;
  const znak = bilshe ? '+' : '−';
  return {
    pytannia: s.tekst(a, `на ${n} ${bilshe ? 'більше' : 'менше'}`),
    vidpovid: a + b,
    pidkazka: `Спершу знайди, скільки ${s.druhe}: ${a} ${znak} ${n}.`,
    rozviazok: `1) ${a} ${znak} ${n} = ${b} (${s.odynytsi}) — ${s.druhe}; 2) ${a} + ${b} = ${a + b} (${s.odynytsi}) — ${s.tretie}. Вираз: ${a} + (${a} ${znak} ${n}) = ${a + b}`,
  };
}

// Сума трьох доданків і задача із зайвим числом (картопля — не фрукт).
function tryDodanky(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const [a, b, c] = [r.chyslo(2, 7), r.chyslo(2, 7), r.chyslo(2, 7)];
  const zaive = r.shans();
  return {
    pytannia: `${o.imia} ${rid(o, 'купив', 'купила')} ${a} кг яблук, ${b} кг груш і ${c} кг картоплі. ${zaive ? 'Скільки всього кілограмів фруктів' : 'Скільки всього кілограмів покупок'} ${rid(o, 'він купив', 'вона купила')}?`,
    vidpovid: zaive ? a + b : a + b + c,
    odynytsi: 'кг',
    pidkazka: zaive ? 'Які з покупок — фрукти? Картопля — овоч.' : 'Додай усі три покупки.',
    rozviazok: zaive ? `${a} + ${b} = ${a + b} (кг) — картопля не фрукт, її не додаємо.` : `${a} + ${b} + ${c} = ${a + b + c} (кг)`,
  };
}

interface SiuzhetDodanka {
  tekst: (S: number, a: number, b: number) => string;
  odynytsi: string;
  pole?: string; // одиниці біля поля відповіді
  mezhi: [number, number]; // діапазон кожної частини
  krok: number; // числа кратні кроку
}

const DODANKY: SiuzhetDodanka[] = [
  {
    tekst: (S, a, b) => `За блокнот, пенал і ручку заплатили ${S} грн. Блокнот коштує ${a} грн, пенал — ${b} грн. Скільки коштує ручка?`,
    odynytsi: 'грн',
    pole: 'грн',
    mezhi: [10, 60],
    krok: 5,
  },
  {
    tekst: (S, a, b) => `За м'яч, скакалку і свисток заплатили ${S} грн. М'яч коштує ${a} грн, скакалка — ${b} грн. Скільки коштує свисток?`,
    odynytsi: 'грн',
    pole: 'грн',
    mezhi: [10, 60],
    krok: 5,
  },
  {
    tekst: (S, a, b) => `У трьох других класах ${sht(S, 'учень', 'учні', 'учнів')}. У 2-А — ${a}, у 2-Б — ${b}. Скільки учнів у 2-В?`,
    odynytsi: 'у.',
    mezhi: [18, 32],
    krok: 1,
  },
  {
    tekst: (S, a, b) => `На трьох полицях ${sht(S, 'книжка', 'книжки', 'книжок')}. На першій — ${a}, на другій — ${b}. Скільки книжок на третій полиці?`,
    odynytsi: 'кн.',
    mezhi: [12, 40],
    krok: 1,
  },
  {
    tekst: (S, a, b) => `Мотузку завдовжки ${S} м розрізали на три частини. Перша частина — ${a} м, друга — ${b} м. Яка довжина третьої частини?`,
    odynytsi: 'м',
    pole: 'м',
    mezhi: [8, 40],
    krok: 1,
  },
];

function chastyny(r: Vypadok, s: SiuzhetDodanka, kruhli: boolean) {
  const k = s.krok;
  for (;;) {
    const [lo, hi] = [Math.ceil(s.mezhi[0] / k), Math.floor(s.mezhi[1] / k)];
    const [a, b, c] = [r.chyslo(lo, hi) * k, r.chyslo(lo, hi) * k, r.chyslo(lo, hi) * k];
    const S = a + b + c;
    if (S > 100) continue;
    if (kruhli && (a + b) % 10 !== 0 && s.krok === 1) continue;
    return { a, b, c, S };
  }
}

// Третій доданок: усього без двох відомих.
function dodanok(r: Vypadok, kruhli: boolean): TrenZavdannia {
  const s = r.vybir(DODANKY);
  const { a, b, c, S } = chastyny(r, s, kruhli);
  return {
    pytannia: s.tekst(S, a, b),
    vidpovid: c,
    odynytsi: s.pole,
    pidkazka: `Спершу дізнайся, скільки разом перші дві частини: ${a} + ${b}.`,
    rozviazok: `1) ${a} + ${b} = ${a + b} (${s.odynytsi}) — дві відомі частини разом; 2) ${S} − ${a + b} = ${c} (${s.odynytsi}). Перевірка: ${a} + ${b} + ${c} = ${S}`,
  };
}

// Який вираз розв'язує задачу на третій доданок.
function yakyiVyraz(r: Vypadok): TrenZavdannia {
  const s = r.vybir(DODANKY);
  const { a, b, S } = chastyny(r, s, true);
  const vyrazy = r.peremishaty([`${S} − (${a} + ${b})`, `${S} − ${a} + ${b}`, `${a} + ${b}`]);
  const bukvy = ['А', 'Б', 'В'];
  const i = vyrazy.indexOf(`${S} − (${a} + ${b})`);
  return {
    pytannia: `${s.tekst(S, a, b)} Який вираз розв'язує задачу? ${vyrazy.map((v, j) => `${bukvy[j]}) $${v.replace('−', '-')}$`).join(' ')}`,
    vidpovid: bukvy[i],
    varianty: bukvy,
    pidkazka: 'Від усього треба відняти обидві відомі частини разом — їх беремо в дужки.',
    rozviazok: `${bukvy[i]}: від усього (${S}) віднімаємо суму двох відомих частин (${a} + ${b}).`,
  };
}

export default {
  rivni: ['третє — стільки, скільки разом', 'третій доданок', 'складені задачі до 100'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => sumaProsta(x, false), (x: Vypadok) => sumaProsta(x, false), tryDodanky])(r);
    if (riven === 2) return r.vybir([(x: Vypadok) => dodanok(x, true), (x: Vypadok) => dodanok(x, true), yakyiVyraz])(r);
    return r.vybir([sumaNa, sumaNa, (x: Vypadok) => dodanok(x, false), (x: Vypadok) => sumaProsta(x, true)])(r);
  },
} satisfies Henerator;
