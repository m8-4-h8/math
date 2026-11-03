// Суміжні кути: разом 180°. Знайти суміжний кут за числом і за малюнком, розпізнати пастки
// («сума 180° ще не робить кути суміжними»), задачі «на … більший», «у … разів», «відносяться як».
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { sumizhni } from '../heometriia.ts';

const TN = ['Так', 'Ні'];
const vyd = (g: number) => (g < 90 ? 'гострий' : g === 90 ? 'прямий' : 'тупий');

function zaChyslom(r: Vypadok): TrenZavdannia {
  const a = r.krim(5, 175, [90]);
  return {
    pytannia: `Знайди кут, суміжний з кутом ${a}°.`,
    vidpovid: 180 - a,
    odynytsi: '°',
    pidkazka: 'Суміжні кути разом дають 180°.',
    rozviazok: `180° − ${a}° = ${180 - a}°`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const kut = r.chyslo(25, 155);
  const pravyiVidomyi = r.shans();
  const vidomyi = pravyiVidomyi ? kut : 180 - kut;
  return {
    pytannia: 'Знайди невідомий кут на малюнку.',
    malunok: sumizhni(kut, pravyiVidomyi ? [`${kut}°`, '?'] : ['?', `${180 - kut}°`]),
    vidpovid: 180 - vidomyi,
    odynytsi: '°',
    pidkazka: 'Ці кути суміжні: спільна сторона, а дві інші утворюють пряму.',
    rozviazok: `Кути суміжні, тож невідомий кут 180° − ${vidomyi}° = ${180 - vidomyi}°`,
  };
}

function vydSumizhnoho(r: Vypadok): TrenZavdannia {
  const a = r.vybir([r.chyslo(10, 80), r.chyslo(100, 170), 90]);
  const b = 180 - a;
  return {
    pytannia: `Кут дорівнює ${a}°. Якого виду суміжний з ним кут?`,
    vidpovid: vyd(b),
    varianty: ['гострий', 'прямий', 'тупий'],
    pidkazka: 'Знайди суміжний кут: від 180° відніми даний.',
    rozviazok: `180° − ${a}° = ${b}°, це ${vyd(b)} кут.`,
  };
}

function chySumizhni(r: Vypadok): TrenZavdannia {
  // Пастка: сума 180°, але немає спільної сторони — не суміжні.
  const a = r.krim(20, 160, [90]);
  return {
    pytannia: `Кути ${a}° і ${180 - a}° намальовано окремо, спільної сторони в них немає. Чи суміжні вони?`,
    vidpovid: 'Ні',
    varianty: TN,
    pidkazka: 'Суміжні кути мають спільну сторону, а дві інші сторони лежать на одній прямій.',
    rozviazok: 'Ні. Разом вони дають 180°, але суміжні кути мусять мати спільну сторону.',
  };
}

function chyMozhut(r: Vypadok): TrenZavdannia {
  const a = r.krim(15, 165, [90]);
  const b = r.shans() ? 180 - a : 180 - a + r.vybir([-20, -10, -5, 5, 10, 20]);
  const tak = a + b === 180;
  return {
    pytannia: `Чи можуть бути суміжними кути ${a}° і ${b}°?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Суміжні кути разом дають рівно 180°.',
    rozviazok: tak ? `Так, бо ${a}° + ${b}° = 180°` : `Ні, бо ${a}° + ${b}° = ${a + b}°, а не 180°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(15, 85);
  const d = 180 - 2 * x;
  const bilshyi = r.shans();
  return {
    pytannia: `Один із суміжних кутів на ${d}° більший за другий. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: bilshyi ? x + d : x,
    odynytsi: '°',
    pidkazka: `Менший кут x, більший x + ${d}. Разом — 180°.`,
    rozviazok:
      `$x + x + ${d} = 180$, $2x = ${180 - d}$, $x = ${x}$.` +
      (bilshyi ? ` Більший кут ${x}° + ${d}° = ${x + d}°` : ` Менший кут — ${x}°.`),
  };
}

function uRaziv(r: Vypadok): TrenZavdannia {
  const k = r.vybir([2, 3, 4, 5, 8, 9, 11, 14, 17]);
  const x = 180 / (k + 1);
  const bilshyi = r.shans(0.7);
  return {
    pytannia: `Один із суміжних кутів у ${k} ${k <= 4 ? 'рази' : 'разів'} більший за другий. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: bilshyi ? k * x : x,
    odynytsi: '°',
    pidkazka: `Менший кут x, більший ${k}x. Разом — 180°.`,
    rozviazok:
      `$x + ${k}x = 180$, $${k + 1}x = 180$, $x = ${x}$.` + (bilshyi ? ` Більший кут ${k} · ${x}° = ${k * x}°` : ` Менший кут — ${x}°.`),
  };
}

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [m, n] = r.vybir([
    [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [1, 8], [4, 5], [2, 7], [1, 11], [5, 7],
    [4, 11], [7, 8], [1, 9], [3, 7], [7, 11], [7, 13], [1, 14],
  ] as const);
  const x = 180 / (m + n);
  const bilshyi = r.shans();
  const vidp = (bilshyi ? n : m) * x;
  return {
    pytannia: `Суміжні кути відносяться як ${m} : ${n}. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Кути ${m === 1 ? '' : m}x і ${n}x. Разом — 180°.`,
    rozviazok: `$${m === 1 ? '' : m}x + ${n}x = 180$, $${m + n}x = 180$, $x = ${x}$. Шуканий кут ${bilshyi ? n : m} · ${x}° = ${vidp}°`,
  };
}

function riznytsia(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(10, 85); // менший
  const y = 180 - x;
  const d = y - x;
  const bilshyi = r.shans();
  return {
    pytannia: `Різниця двох суміжних кутів дорівнює ${d}°. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: bilshyi ? y : x,
    odynytsi: '°',
    pidkazka: `Система: x + y = 180, x − y = ${d}.`,
    rozviazok: bilshyi
      ? `Додаємо рівняння x + y = 180 і x − y = ${d}: подвоєний більший кут дорівнює ${180 + d}°, тож більший кут ${180 + d}° : 2 = ${y}°`
      : `Віднімаємо рівняння: подвоєний менший кут дорівнює ${180 - d}°, тож менший кут ${180 - d}° : 2 = ${x}°`,
  };
}

export default {
  rivni: ['знайди суміжний кут', 'з підступом', 'рівняння й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zaChyslom, zaMalunkom])(r);
    if (riven === 2) return r.vybir([vydSumizhnoho, chySumizhni, chyMozhut, zaMalunkom])(r);
    return r.vybir([naBilshe, uRaziv, vidnoshennia, riznytsia])(r);
  },
} satisfies Henerator;
