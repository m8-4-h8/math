// Вертикальні кути рівні, сусідні — суміжні (разом 180°), кут між прямими — менший з чотирьох.
// За малюнком і без нього, пастки («сума 100° — отже, вертикальні», «кут між прямими не буває тупим»), задачі.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { peretyn } from '../heometriia.ts';

const TN = ['Так', 'Ні'];

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const kut = r.krim(30, 150, [90]);
  const vidomyi = r.chyslo(1, 4);
  const shukanyi = r.krim(1, 4, [vidomyi]);
  const velychyna = (i: number) => (i % 2 ? kut : 180 - kut); // кути 1 і 3 — kut, 2 і 4 — 180 − kut
  const pidpysy = [1, 2, 3, 4].map((i) => (i === vidomyi ? `${velychyna(i)}°` : '?')) as [string, string, string, string];
  const vertykalni = (vidomyi + shukanyi) % 2 === 0;
  return {
    pytannia: `Знайди кут ${shukanyi} на малюнку.`,
    malunok: peretyn(kut, pidpysy, r.vybir([0, 15, -15, 30])),
    vidpovid: velychyna(shukanyi),
    odynytsi: '°',
    pidkazka: `Кути ${vidomyi} і ${shukanyi} стоять ${vertykalni ? 'навпроти' : 'поруч'}. Які вони?`,
    rozviazok: vertykalni
      ? `Кути ${vidomyi} і ${shukanyi} вертикальні, тож рівні: ${velychyna(shukanyi)}°.`
      : `Кути ${vidomyi} і ${shukanyi} суміжні: 180° − ${velychyna(vidomyi)}° = ${velychyna(shukanyi)}°`,
  };
}

function bezMalunka(r: Vypadok): TrenZavdannia {
  const a = r.krim(20, 160, [90]);
  const vertykalnyi = r.shans();
  return {
    pytannia: `Один із кутів, що утворилися при перетині двох прямих, дорівнює ${a}°. Знайди ${vertykalnyi ? 'вертикальний' : 'суміжний'} з ним кут.`,
    vidpovid: vertykalnyi ? a : 180 - a,
    odynytsi: '°',
    pidkazka: vertykalnyi ? 'Вертикальні кути рівні.' : 'Суміжні кути разом дають 180°.',
    rozviazok: vertykalnyi ? `Вертикальні кути рівні: ${a}°.` : `180° − ${a}° = ${180 - a}°`,
  };
}

function kutMizhPriamymy(r: Vypadok): TrenZavdannia {
  const a = r.krim(15, 165, [90]);
  const m = Math.min(a, 180 - a);
  return {
    pytannia: `Один із кутів, що утворилися при перетині двох прямих, дорівнює ${a}°. Знайди кут між прямими.`,
    vidpovid: m,
    odynytsi: '°',
    pidkazka: 'Кут між прямими — менший з кутів, які утворилися.',
    rozviazok:
      a < 90 ? `Кути ${a}° і ${180 - a}°, менший — ${a}°.` : `Кути ${a}° і 180° − ${a}° = ${m}°, менший — ${m}°. Кут між прямими не буває тупим.`,
  };
}

function chyMozhut(r: Vypadok): TrenZavdannia {
  const a = r.krim(20, 160, [90]);
  const typ = r.chyslo(0, 2);
  const b = typ === 0 ? a : typ === 1 ? 180 - a : 180 - a + r.vybir([-15, -10, 10, 15]);
  const tak = a === b || a + b === 180;
  return {
    pytannia: `Чи можуть при перетині двох прямих утворитися кути ${a}° і ${b}°?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Кути навпроти — рівні, сусідні — разом 180°.',
    rozviazok:
      a === b
        ? 'Так: рівні кути можуть бути вертикальними.'
        : tak
          ? `Так, сусідні кути: ${a}° + ${b}° = 180°`
          : `Ні: кути не рівні, а ${a}° + ${b}° = ${a + b}°, не 180°.`,
  };
}

function sumaDvokh(r: Vypadok): TrenZavdannia {
  // Сума двох кутів не 180° — значить, вони вертикальні, кожен — половина суми.
  const h = r.krim(20, 160, [90]);
  const s = 2 * h;
  const bilshyi = r.shans();
  const inshyi = 180 - h;
  const vidp = bilshyi ? Math.max(h, inshyi) : Math.min(h, inshyi);
  return {
    pytannia: `Сума двох кутів, що утворилися при перетині двох прямих, дорівнює ${s}°. Знайди ${bilshyi ? 'більший' : 'менший'} з чотирьох кутів.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: 'Якби кути були сусідніми, разом дали б 180°. Отже, які це кути?',
    rozviazok: `Сума не 180°, отже, ці кути вертикальні: кожен ${s}° : 2 = ${h}°. Два інші 180° − ${h}° = ${inshyi}°. ${bilshyi ? 'Більший' : 'Менший'} — ${vidp}°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(15, 85);
  const d = 180 - 2 * x;
  return {
    pytannia: `Один із кутів, що утворилися при перетині двох прямих, на ${d}° більший за інший. Знайди більший кут.`,
    vidpovid: x + d,
    odynytsi: '°',
    pidkazka: `Рівні кути — вертикальні, тож ці два кути сусідні: x + x + ${d} = 180.`,
    rozviazok: `Кути не рівні, отже, сусідні: $x + x + ${d} = 180$, $x = ${x}$. Більший кут ${x}° + ${d}° = ${x + d}°`,
  };
}

function sumaTrokh(r: Vypadok): TrenZavdannia {
  const t = r.krim(20, 160, [90]);
  const s = 360 - t;
  return {
    pytannia: `Сума трьох кутів, що утворилися при перетині двох прямих, дорівнює ${s}°. Знайди четвертий кут.`,
    vidpovid: t,
    odynytsi: '°',
    pidkazka: 'Усі чотири кути разом — два розгорнуті кути.',
    rozviazok: `Усі чотири кути разом 180° + 180° = 360°. Четвертий кут 360° − ${s}° = ${t}°`,
  };
}

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [m, n] = r.vybir([
    [1, 2], [1, 3], [1, 5], [2, 3], [4, 5], [2, 7], [5, 7], [7, 8], [3, 7], [7, 11], [1, 8], [4, 11],
  ] as const);
  const x = 180 / (m + n);
  return {
    pytannia: `Два з кутів, що утворилися при перетині двох прямих, відносяться як ${m} : ${n}. Знайди більший з них.`,
    vidpovid: n * x,
    odynytsi: '°',
    pidkazka: 'Кути не рівні — отже, сусідні, разом 180°.',
    rozviazok: `Кути сусідні: $${m === 1 ? '' : m}x + ${n}x = 180$, $x = ${x}$. Більший кут ${n} · ${x}° = ${n * x}°`,
  };
}

export default {
  rivni: ['за одним кутом', 'з підступом', 'рівняння й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zaMalunkom, bezMalunka])(r);
    if (riven === 2) return r.vybir([kutMizhPriamymy, chyMozhut, sumaDvokh, zaMalunkom])(r);
    return r.vybir([naBilshe, sumaTrokh, vidnoshennia, sumaDvokh])(r);
  },
} satisfies Henerator;
