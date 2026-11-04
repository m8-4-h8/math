// Співвідношення між сторонами і кутами трикутника: найбільша чи найменша сторона за кутами, найбільший чи найменший
// кут за сторонами, прямий і тупий кут, рівнобедрений трикутник (основа чи бічна сторона), порівняння двох сторін,
// відношення кутів і зовнішній кут.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];

/** Сторона навпроти вершини i: дві інші вершини в порядку запису (BC, AC, AB). */
const navproty = (l: string[], i: number) => l.filter((_, j) => j !== i).join('');
const storonyVar = (l: string[]) => [navproty(l, 2), navproty(l, 0), navproty(l, 1)]; // AB, BC, AC
const kutyVar = (l: string[]) => l.map((x) => `∠${x}`);

/** Три різні кути трикутника (цілі, від 20°). */
function tryKuty(r: Vypadok) {
  for (;;) {
    const a = r.chyslo(20, 120);
    const b = r.chyslo(20, 120);
    const c = 180 - a - b;
    if (c >= 20 && a !== b && b !== c && a !== c) return [a, b, c];
  }
}

function storonaZaKutamy(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const k = tryKuty(r);
  const naib = r.shans();
  const i = k.indexOf(naib ? Math.max(...k) : Math.min(...k));
  const tretii = r.shans(); // дати лише два кути — третій знайти
  const n = r.chyslo(0, 2);
  const dani = [0, 1, 2].filter((j) => !tretii || j !== n).map((j) => `∠${l[j]} = ${k[j]}°`).join(', ');
  const krok = tretii ? `Кут ${l[n]} дорівнює 180° − ${[0, 1, 2].filter((j) => j !== n).map((j) => `${k[j]}°`).join(' − ')} = ${k[n]}°. ` : '';
  return {
    pytannia: `У трикутнику ${l.join('')} ${dani}. Яка сторона ${naib ? 'найбільша' : 'найменша'}?`,
    vidpovid: navproty(l, i),
    varianty: storonyVar(l),
    pidkazka: `${tretii ? `Спершу знайди кут ${l[n]}. ` : ''}${naib ? 'Найбільша' : 'Найменша'} сторона лежить навпроти ${naib ? 'найбільшого' : 'найменшого'} кута.`,
    rozviazok: `${krok}${naib ? 'Найбільший' : 'Найменший'} кут — ${l[i]} (${k[i]}°), навпроти нього сторона ${navproty(l, i)}.`,
  };
}

/** Три різні сторони, з яких складається трикутник. */
function tryStorony(r: Vypadok) {
  for (;;) {
    const s = r.rizni(3, 3, 20);
    if (Math.max(...s) * 2 < s[0] + s[1] + s[2]) return s;
  }
}

function kutZaStoronamy(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const s = tryStorony(r); // s[i] — сторона навпроти вершини i
  const naib = r.shans();
  const i = s.indexOf(naib ? Math.max(...s) : Math.min(...s));
  const dani = r.peremishaty([0, 1, 2]).map((j) => `${navproty(l, j)} = ${s[j]} см`).join(', ');
  return {
    pytannia: `У трикутнику ${l.join('')} ${dani}. Який кут ${naib ? 'найбільший' : 'найменший'}?`,
    vidpovid: `∠${l[i]}`,
    varianty: kutyVar(l),
    pidkazka: `Знайди ${naib ? 'найбільшу' : 'найменшу'} сторону. Якої вершини на ній немає?`,
    rozviazok: `${naib ? 'Найбільша' : 'Найменша'} сторона — ${navproty(l, i)} (${s[i]} см), навпроти неї кут ${l[i]}.`,
  };
}

function priamyiTupyi(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const i = r.chyslo(0, 2);
  const vyd = r.vybir(['прямий', 'тупий']);
  const g = vyd === 'прямий' ? 90 : r.chyslo(95, 150);
  const zChyslom = r.shans();
  return {
    pytannia: `У трикутнику ${l.join('')} кут ${l[i]} ${zChyslom ? `дорівнює ${g}°` : vyd}. Яка сторона найбільша?`,
    vidpovid: navproty(l, i),
    varianty: storonyVar(l),
    pidkazka: `${vyd === 'прямий' ? 'Прямий' : 'Тупий'} кут — найбільший у трикутнику. Яка сторона навпроти нього?`,
    rozviazok: `Два інші кути гострі, тож кут ${l[i]} найбільший, і навпроти нього найбільша сторона ${navproty(l, i)}.`,
  };
}

const RIVNOBEDR = ['основа', 'бічна сторона', 'вони рівні'];

function rivnobedrenyi(r: Vypadok): TrenZavdannia {
  const typ = r.vybir([0, 1, 1, 2, 2]);
  const b = typ === 0 ? 60 : typ === 1 ? 2 * r.chyslo(31, 75) : 2 * r.chyslo(10, 29); // кут при вершині
  const x = (180 - b) / 2;
  const vidp = typ === 0 ? RIVNOBEDR[2] : typ === 1 ? RIVNOBEDR[0] : RIVNOBEDR[1];
  const zOsnovy = r.shans();
  const umova = zOsnovy ? `Кут при основі рівнобедреного трикутника — ${x}°.` : `Кут при вершині рівнобедреного трикутника — ${b}°.`;
  const krok = zOsnovy ? `Кут при вершині дорівнює 180° − 2 · ${x}° = ${b}°.` : `Кути при основі по (180° − ${b}°) : 2 = ${x}°.`;
  const vysnovok =
    typ === 0
      ? 'Усі кути по 60°, тож і сторони рівні.'
      : typ === 1
        ? `Навпроти основи — кут ${b}°, більший за ${x}°, тож основа довша.`
        : `Навпроти бічної сторони — кут ${x}°, більший за ${b}°, тож бічна сторона довша.`;
  return {
    pytannia: `${umova} Що довше: основа чи бічна сторона?`,
    vidpovid: vidp,
    varianty: RIVNOBEDR,
    pidkazka: 'Навпроти основи — кут при вершині, навпроти бічної сторони — кут при основі. Порівняй їх.',
    rozviazok: `${krok} ${vysnovok}`,
  };
}

function porivniaty(r: Vypadok): TrenZavdannia {
  // Порівняти сторони AB (навпроти C) і BC (навпроти A).
  const l = r.vybir(LITERY);
  const [A, B, C] = l;
  const typ = r.chyslo(0, 2);
  const a = r.chyslo(25, 70);
  const c = typ === 0 ? a : typ === 1 ? r.chyslo(a + 5, Math.min(150 - a, a + 60)) : r.chyslo(Math.max(15, a - 50), a - 5);
  const varianty = [`${A}${B} > ${B}${C}`, `${A}${B} < ${B}${C}`, `${A}${B} = ${B}${C}`];
  const vidp = typ === 0 ? varianty[2] : typ === 1 ? varianty[0] : varianty[1];
  return {
    pytannia: `У трикутнику ${l.join('')} ∠${A} = ${a}°, ∠${C} = ${c}°. Порівняй сторони ${A}${B} і ${B}${C}.`,
    vidpovid: vidp,
    varianty,
    pidkazka: `Навпроти якого кута лежить ${A}${B}? А ${B}${C}?`,
    rozviazok: `${A}${B} лежить навпроти кута ${C} (${c}°), ${B}${C} — навпроти кута ${A} (${a}°). ${typ === 0 ? 'Кути рівні, тож і сторони рівні.' : typ === 1 ? `Кут ${C} більший, тож ${A}${B} довша.` : `Кут ${A} більший, тож ${B}${C} довша.`}`,
  };
}

const TRIIKY = [[1, 2, 3], [2, 3, 4], [1, 3, 5], [3, 4, 5], [1, 2, 6], [4, 5, 9], [1, 4, 7], [2, 5, 8], [3, 5, 7], [5, 6, 7], [2, 3, 7], [1, 3, 8]].filter((t) => 180 % (t[0] + t[1] + t[2]) === 0);

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const ch = r.peremishaty(r.vybir(TRIIKY)); // частини кутів при вершинах 0, 1, 2
  const x = 180 / (ch[0] + ch[1] + ch[2]);
  const naib = r.shans();
  const i = ch.indexOf(naib ? Math.max(...ch) : Math.min(...ch));
  return {
    pytannia: `Кути трикутника ${l.join('')} відносяться як ∠${l[0]} : ∠${l[1]} : ∠${l[2]} = ${ch.join(' : ')}. Яка сторона ${naib ? 'найбільша' : 'найменша'}?`,
    vidpovid: navproty(l, i),
    varianty: storonyVar(l),
    pidkazka: `${naib ? 'Найбільший' : 'Найменший'} кут — той, у якого ${naib ? 'найбільше' : 'найменше'} частин.`,
    rozviazok: `${naib ? 'Найбільший' : 'Найменший'} кут — ${l[i]}: він дорівнює ${ch[i]} · ${x}° = ${ch[i] * x}°. Навпроти нього сторона ${navproty(l, i)}.`,
  };
}

function zovnishnii(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [a, b, c] = tryKuty(r);
  const e = a + b; // зовнішній кут при вершині 2
  const k = [a, b, c];
  const naib = r.shans();
  const i = k.indexOf(naib ? Math.max(...k) : Math.min(...k));
  return {
    pytannia: `Зовнішній кут трикутника ${l.join('')} при вершині ${l[2]} дорівнює ${e}°, ∠${l[0]} = ${a}°. Яка сторона ${naib ? 'найбільша' : 'найменша'}?`,
    vidpovid: navproty(l, i),
    varianty: storonyVar(l),
    pidkazka: `Знайди кути ${l[1]} і ${l[2]}: зовнішній кут дорівнює сумі двох кутів, не суміжних з ним.`,
    rozviazok: `Кут ${l[1]} дорівнює ${e}° − ${a}° = ${b}°, кут ${l[2]} дорівнює 180° − ${e}° = ${c}°. ${naib ? 'Найбільший' : 'Найменший'} кут — ${l[i]}, навпроти нього сторона ${navproty(l, i)}.`,
  };
}

export default {
  rivni: ['найбільша сторона, найбільший кут', 'прямий кут, рівнобедрений, порівняння', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([storonaZaKutamy, kutZaStoronamy])(r);
    if (riven === 2) return r.vybir([priamyiTupyi, rivnobedrenyi, porivniaty, storonaZaKutamy])(r);
    return r.vybir([vidnoshennia, zovnishnii, porivniaty, rivnobedrenyi])(r);
  },
} satisfies Henerator;
