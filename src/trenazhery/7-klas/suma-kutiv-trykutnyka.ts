// Сума кутів трикутника 180° і зовнішній кут (дорівнює сумі двох кутів, не суміжних з ним): третій кут за малюнком
// і без нього, прямокутний трикутник, зовнішній кут і пастки («суміжний кут — не сума»), відношення й «на … більший».
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { kutyTrykutnyka } from '../trykutnyky.ts';
import type { Forma } from '../trykutnyky.ts';

const TN = ['Так', 'Ні'];
const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];

/** Кути трикутника [при вершині 0, 1, 2] і форма малюнка, що їм приблизно відповідає (тупий чи прямий кут — при вершині 1). */
function kuty(r: Vypadok): { k: number[]; forma: Forma } {
  const typ = r.chyslo(0, 3);
  if (typ === 1) {
    const b = r.chyslo(95, 140);
    const a = r.chyslo(15, 180 - b - 15);
    return { k: [a, b, 180 - a - b], forma: 'tupokutnyi' };
  }
  if (typ === 2) {
    const a = r.krim(20, 70, [45]);
    return { k: [a, 90, 90 - a], forma: 'priamokutnyi' };
  }
  for (;;) {
    const a = r.chyslo(35, 85);
    const b = r.chyslo(35, 85);
    const c = 180 - a - b;
    if (c >= 30 && c <= 88) return { k: [a, b, c], forma: r.vybir(['hostrokutnyi', 'hostrokutnyi2'] as Forma[]) };
  }
}

function tretiiZaMalunkom(r: Vypadok): TrenZavdannia {
  const { k, forma } = kuty(r);
  const l = r.vybir(LITERY);
  const n = r.chyslo(0, 2);
  const [x, y] = [0, 1, 2].filter((i) => i !== n);
  const pidpysy = k.map((g, i) => (i === n ? '?' : `${g}°`));
  return {
    pytannia: `Знайди кут ${l[n]} трикутника.`,
    malunok: kutyTrykutnyka({ forma, litery: l, pidpysy }),
    vidpovid: k[n],
    odynytsi: '°',
    pidkazka: 'Сума кутів трикутника — 180°. Відніми два відомі кути.',
    rozviazok: `Кут ${l[n]} дорівнює 180° − ${k[x]}° − ${k[y]}° = ${k[n]}°.`,
  };
}

function tretiiTekstom(r: Vypadok): TrenZavdannia {
  const { k } = kuty(r);
  const l = r.vybir(LITERY);
  const n = r.chyslo(0, 2);
  const [x, y] = [0, 1, 2].filter((i) => i !== n);
  return {
    pytannia: `У трикутнику ${l.join('')} ∠${l[x]} = ${k[x]}°, ∠${l[y]} = ${k[y]}°. Знайди ∠${l[n]}.`,
    vidpovid: k[n],
    odynytsi: '°',
    pidkazka: 'Сума кутів трикутника — 180°.',
    rozviazok: `Кут ${l[n]} дорівнює 180° − ${k[x]}° − ${k[y]}° = ${k[n]}°.`,
  };
}

function priamokutnyi(r: Vypadok): TrenZavdannia {
  const a = r.krim(12, 78, [45]);
  return {
    pytannia: `Один із гострих кутів прямокутного трикутника дорівнює ${a}°. Знайди другий гострий кут.`,
    vidpovid: 90 - a,
    odynytsi: '°',
    pidkazka: 'Прямий кут забирає 90° із 180°. Скільки лишається на два гострі?',
    rozviazok: `Гострі кути разом 180° − 90° = 90°, тож другий кут 90° − ${a}° = ${90 - a}°.`,
  };
}

/** Зовнішній кут при вершині v (1 або 2) і кути, не суміжні з ним. */
function zovnishnii(r: Vypadok) {
  const { k, forma } = kuty(r);
  const v = r.vybir([1, 2]);
  const [x, y] = [0, 1, 2].filter((i) => i !== v);
  return { k, forma, v, x, y, e: 180 - k[v], l: r.vybir(LITERY) };
}

function zovnZaDvoma(r: Vypadok): TrenZavdannia {
  const { k, forma, v, x, y, e, l } = zovnishnii(r);
  const pidpysy = k.map((g, i) => (i === v ? undefined : `${g}°`));
  return {
    pytannia: `Знайди зовнішній кут трикутника при вершині ${l[v]}.`,
    malunok: kutyTrykutnyka({ forma, litery: l, pidpysy, zovnishnii: { v, pidpys: '?' } }),
    vidpovid: e,
    odynytsi: '°',
    pidkazka: 'Зовнішній кут дорівнює сумі двох кутів трикутника, не суміжних з ним.',
    rozviazok: `Зовнішній кут дорівнює ${k[x]}° + ${k[y]}° = ${e}°.`,
  };
}

function zovnIOdyn(r: Vypadok): TrenZavdannia {
  const { k, v, x, y, e, l } = zovnishnii(r);
  return {
    pytannia: `Зовнішній кут трикутника ${l.join('')} при вершині ${l[v]} дорівнює ${e}°, ∠${l[x]} = ${k[x]}°. Знайди ∠${l[y]}.`,
    vidpovid: k[y],
    odynytsi: '°',
    pidkazka: `Зовнішній кут при ${l[v]} дорівнює ∠${l[x]} + ∠${l[y]}.`,
    rozviazok: `∠${l[x]} + ∠${l[y]} дорівнює ${e}°, тож ∠${l[y]} дорівнює ${e}° − ${k[x]}° = ${k[y]}°.`,
  };
}

function zovnISumizhnyi(r: Vypadok): TrenZavdannia {
  // Пастка: кут трикутника при тій самій вершині — суміжний, а не сума.
  const { k, forma, v, e, l } = zovnishnii(r);
  return {
    pytannia: `Зовнішній кут трикутника при вершині ${l[v]} дорівнює ${e}°. Знайди кут ${l[v]} трикутника.`,
    malunok: kutyTrykutnyka({ forma, litery: l, pidpysy: k.map((_, i) => (i === v ? '?' : undefined)), zovnishnii: { v, pidpys: `${e}°` } }),
    vidpovid: k[v],
    odynytsi: '°',
    pidkazka: 'Зовнішній кут і кут трикутника при тій самій вершині — суміжні.',
    rozviazok: `Ці кути суміжні, тож кут ${l[v]} дорівнює 180° − ${e}° = ${k[v]}°.`,
  };
}

function chyMozhe(r: Vypadok): TrenZavdannia {
  const { k } = kuty(r);
  const tak = r.shans();
  const zsuv = tak ? 0 : r.vybir(k[2] > 25 ? [-20, -10, -5, 5, 10, 20] : [5, 10, 20]);
  const g = [k[0], k[1], k[2] + zsuv];
  const s = g[0] + g[1] + g[2];
  return {
    pytannia: `Чи може трикутник мати кути ${g[0]}°, ${g[1]}° і ${g[2]}°?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Додай усі три кути й порівняй зі 180°.',
    rozviazok: `Разом ${g[0]}° + ${g[1]}° + ${g[2]}° = ${s}°. ${tak ? 'Так, сума 180°.' : 'Сума не 180°, тож такого трикутника немає.'}`,
  };
}

const TRIIKY = [
  [1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 7], [3, 4, 5], [1, 2, 6], [4, 5, 9], [1, 4, 7], [2, 5, 8], [3, 5, 7], [5, 6, 7], [1, 1, 2], [2, 2, 5],
].filter((t) => 180 % (t[0] + t[1] + t[2]) === 0);

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [m, n, p] = r.vybir(TRIIKY);
  const x = 180 / (m + n + p);
  const naib = r.shans();
  const vidp = (naib ? p : m) * x;
  return {
    pytannia: `Кути трикутника відносяться як ${m} : ${n} : ${p}. Знайди ${naib ? 'найбільший' : 'найменший'} кут.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Позначимо кути ${m === 1 ? '' : m}x, ${n === 1 ? '' : n}x, ${p}x — разом 180°.`,
    rozviazok: `Разом ${m + n + p} частин, тож одна частина ${180} : ${m + n + p} = ${x}°. ${naib ? 'Найбільший' : 'Найменший'} кут ${naib ? p : m} · ${x}° = ${vidp}°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  for (;;) {
    const b = r.chyslo(20, 70);
    const d = r.chyslo(5, 40);
    const c = 180 - 2 * b - d;
    if (c < 15) continue;
    return {
      pytannia: `У трикутнику ${l.join('')} ∠${l[0]} на ${d}° більший за ∠${l[1]}, а ∠${l[2]} = ${c}°. Знайди ∠${l[0]}.`,
      vidpovid: b + d,
      odynytsi: '°',
      pidkazka: `Разом ∠${l[0]} + ∠${l[1]} = 180° − ${c}°. Позначимо ∠${l[1]} = x, тоді ∠${l[0]} = x + ${d}.`,
      rozviazok: `Нехай ∠${l[1]} = x°, тоді ∠${l[0]} = (x + ${d})°. Разом вони 180° − ${c}° = ${2 * b + d}°, тож 2x + ${d} = ${2 * b + d}, x = ${b}, а ∠${l[0]} дорівнює ${b}° + ${d}° = ${b + d}°.`,
    };
  }
}

function zovnVidnoshennia(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [m, n] = r.vybir([[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [3, 5], [4, 5], [1, 4]] as const);
  const x = r.chyslo(4, Math.floor(160 / (m + n)));
  const e = (m + n) * x;
  return {
    pytannia: `Зовнішній кут трикутника ${l.join('')} при вершині ${l[2]} дорівнює ${e}°, а ∠${l[0]} : ∠${l[1]} = ${m} : ${n}. Знайди ∠${l[1]}.`,
    vidpovid: n * x,
    odynytsi: '°',
    pidkazka: `Зовнішній кут при ${l[2]} дорівнює ∠${l[0]} + ∠${l[1]}: ${m === 1 ? '' : m}x + ${n}x = ${e}.`,
    rozviazok: `∠${l[0]} + ∠${l[1]} дорівнює ${e}°, це ${m + n} частин, одна частина ${e} : ${m + n} = ${x}°. ∠${l[1]} дорівнює ${n} · ${x}° = ${n * x}°.`,
  };
}

export default {
  rivni: ['третій кут', 'зовнішній кут', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([tretiiZaMalunkom, tretiiZaMalunkom, tretiiTekstom, priamokutnyi])(r);
    if (riven === 2) return r.vybir([zovnZaDvoma, zovnIOdyn, zovnISumizhnyi, chyMozhe])(r);
    return r.vybir([vidnoshennia, naBilshe, zovnVidnoshennia, zovnIOdyn])(r);
  },
} satisfies Henerator;
