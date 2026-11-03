// Два числа за сумою і різницею: (сума − різниця) : 2 — менше число, + різниця — більше.
import { dviOsoby, mnozh, rid, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function chysla(r: Vypadok, maxMenshe: number) {
  const menshe = r.chyslo(3, maxMenshe);
  const riznytsia = r.chyslo(2, maxMenshe);
  return { menshe, bilshe: menshe + riznytsia, riznytsia, suma: 2 * menshe + riznytsia };
}

function holi(r: Vypadok, maxMenshe: number): TrenZavdannia {
  const { menshe, bilshe, riznytsia, suma } = chysla(r, maxMenshe);
  const shukaiemoMenshe = r.shans();
  return {
    pytannia: `Сума двох чисел ${suma}, а одне з них на ${riznytsia} більше за інше. Знайди ${shukaiemoMenshe ? 'менше' : 'більше'} число.`,
    vidpovid: shukaiemoMenshe ? menshe : bilshe,
    pidkazka: `Відріж різницю: ${suma} − ${riznytsia}. Що лишилося — два однакові менші числа.`,
    rozviazok: `(${suma} − ${riznytsia}) : 2 = ${menshe} — менше; ${menshe} + ${riznytsia} = ${bilshe} — більше.`,
  };
}

const SIUZHETY = [
  { formy: ['книжка', 'книжки', 'книжок'], de: ['на верхній полиці', 'на нижній'] },
  { formy: ['яблуко', 'яблука', 'яблук'], de: ['в одному кошику', 'в іншому'] },
];

function zadacha(r: Vypadok, maxMenshe: number): TrenZavdannia {
  const { menshe, bilshe, riznytsia, suma } = chysla(r, maxMenshe);
  if (r.shans()) {
    const s = r.vybir(SIUZHETY);
    return {
      pytannia: `${zVelykoi(s.de[0])} і ${s.de[1]} разом ${suma} ${mnozh(suma, s.formy[0], s.formy[1], s.formy[2])}. ${zVelykoi(s.de[0])} на ${riznytsia} більше. Скільки ${s.formy[2]} ${s.de[1]}?`,
      vidpovid: menshe,
      pidkazka: `${zVelykoi(s.de[1])} — менше. Від суми відніми різницю і поділи на 2.`,
      rozviazok: `(${suma} − ${riznytsia}) : 2 = ${menshe}. Перевірка: ${menshe} + ${bilshe} = ${suma} ✓`,
    };
  }
  const [a, b] = dviOsoby(r);
  return {
    pytannia: `${a.imia} і ${b.imia} разом зібрали ${suma} кг ягід. ${a.imia} ${rid(a, 'зібрав', 'зібрала')} на ${riznytsia} кг більше. Скільки кілограмів ${rid(a, 'зібрав', 'зібрала')} ${a.imia}?`,
    vidpovid: bilshe,
    odynytsi: 'кг',
    pidkazka: `Спершу знайди менше число: (${suma} − ${riznytsia}) : 2. Але питають про більше!`,
    rozviazok: `(${suma} − ${riznytsia}) : 2 = ${menshe}; ${menshe} + ${riznytsia} = ${bilshe} (кг).`,
  };
}

function obydva(r: Vypadok): TrenZavdannia {
  const { menshe, bilshe, riznytsia, suma } = chysla(r, 50);
  return {
    pytannia: `Сума двох чисел ${suma}, різниця ${riznytsia}. Знайди обидва числа. Запиши так: 12 і 20.`,
    vidpovid: [`${menshe} і ${bilshe}`, `${menshe}, ${bilshe}`],
    perevirka: (v) => {
      const n = (v.match(/\d+/g) || []).map(Number).sort((x, y) => x - y);
      return n.length === 2 && n[0] === menshe && n[1] === bilshe;
    },
    pidkazka: `(${suma} − ${riznytsia}) : 2 — це менше число.`,
    rozviazok: `(${suma} − ${riznytsia}) : 2 = ${menshe}; ${menshe} + ${riznytsia} = ${bilshe}.`,
  };
}

export default {
  rivni: ['числа до 50', 'задачі до 100', 'обидва числа і пастки'],
  zavdannia(r, riven) {
    if (riven === 1) return holi(r, 20);
    if (riven === 2) return r.shans() ? zadacha(r, 40) : holi(r, 40);
    return r.vybir([() => obydva(r), () => zadacha(r, 60), () => holi(r, 80)])();
  },
} satisfies Henerator;
