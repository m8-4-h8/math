// Чотирикутник: елементи (протилежні вершини й сторони, діагоналі), периметр, сума кутів 360° — четвертий кут за
// малюнком і без нього, «чи може бути», рівні кути, відношення, «на … більший», зовнішні кути.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { chotyrykutnyk, type FormaChotyrykutnyka } from '../chotyrykutnyky.ts';

const TN = ['Так', 'Ні'];
const LITERY: [string, string, string, string][] = [
  ['A', 'B', 'C', 'D'],
  ['K', 'L', 'M', 'N'],
  ['M', 'N', 'P', 'K'],
  ['P', 'Q', 'R', 'S'],
  ['E', 'F', 'K', 'M'],
];
/** Кути форм малюнка (приблизно), щоб підписані кути не суперечили тому, що видно. */
const FORMY: [FormaChotyrykutnyka, number[]][] = [
  ['dovilnyi', [76, 109, 97, 77]],
  ['opuklyi2', [75, 100, 84, 100]],
];
const nazva = (l: string[]) => l.join('');
const storona = (l: string[], i: number) => l[i] + l[(i + 1) % 4];

/** Чотири кути опуклого чотирикутника, близькі до кутів форми; n — номер шуканого. */
function kuty(r: Vypadok) {
  const [forma, baza] = r.vybir(FORMY);
  for (;;) {
    const k = baza.map((b) => b + r.chyslo(-12, 12));
    const n = r.chyslo(0, 3);
    k[n] = 360 - k.reduce((s, g, i) => (i === n ? s : s + g), 0);
    if (Math.abs(k[n] - baza[n]) <= 18) return { forma, k, n, inshi: [0, 1, 2, 3].filter((i) => i !== n) };
  }
}

function chetvertyiZaMalunkom(r: Vypadok): TrenZavdannia {
  const { forma, k, n, inshi } = kuty(r);
  const l = r.vybir(LITERY);
  const s = 360 - k[n];
  return {
    pytannia: `Знайди кут ${l[n]} чотирикутника.`,
    malunok: chotyrykutnyk({ forma, bukvy: l, kuty: k.map((g, i) => (i === n ? '?' : `${g}°`)) }),
    vidpovid: k[n],
    odynytsi: '°',
    pidkazka: 'Сума кутів чотирикутника — 360°. Додай три відомі кути й відніми від 360°.',
    rozviazok: `Разом ${inshi.map((i) => `${k[i]}°`).join(' + ')} = ${s}°, тож кут ${l[n]} дорівнює 360° − ${s}° = ${k[n]}°.`,
  };
}

function chetvertyiTekstom(r: Vypadok): TrenZavdannia {
  const { k, n, inshi } = kuty(r);
  const l = r.vybir(LITERY);
  const s = 360 - k[n];
  return {
    pytannia: `У чотирикутнику ${nazva(l)} ${inshi.map((i) => `∠${l[i]} = ${k[i]}°`).join(', ')}. Знайди ∠${l[n]}.`,
    vidpovid: k[n],
    odynytsi: '°',
    pidkazka: 'Сума кутів чотирикутника — 360°, а не 180°.',
    rozviazok: `Разом ${inshi.map((i) => `${k[i]}°`).join(' + ')} = ${s}°, тож кут ${l[n]} дорівнює 360° − ${s}° = ${k[n]}°.`,
  };
}

function elementy(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const i = r.chyslo(0, 3);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const inshi = [0, 1, 2, 3].filter((j) => j !== i).map((j) => l[j]);
    return {
      pytannia: `Яка вершина чотирикутника ${nazva(l)} протилежна вершині ${l[i]}?`,
      vidpovid: l[(i + 2) % 4],
      varianty: inshi,
      pidkazka: `Протилежна вершина не сполучена з ${l[i]} стороною — вона «через одну».`,
      rozviazok: `${l[i]} сполучена сторонами з ${l[(i + 3) % 4]} і ${l[(i + 1) % 4]} — це сусідні вершини. Протилежна — ${l[(i + 2) % 4]}.`,
    };
  }
  if (typ === 1) {
    const inshi = [0, 1, 2, 3].filter((j) => j !== i).map((j) => storona(l, j));
    return {
      pytannia: `Яка сторона чотирикутника ${nazva(l)} протилежна стороні ${storona(l, i)}?`,
      vidpovid: storona(l, (i + 2) % 4),
      varianty: inshi,
      pidkazka: `Протилежна сторона не має з ${storona(l, i)} спільної вершини.`,
      rozviazok: `${storona(l, (i + 3) % 4)} і ${storona(l, (i + 1) % 4)} мають з ${storona(l, i)} спільну вершину — вони сусідні. Протилежна — ${storona(l, (i + 2) % 4)}.`,
    };
  }
  const d = r.shans() ? l[0] + l[2] : l[1] + l[3];
  const [s1, s2] = r.rizni(2, 0, 3).map((j) => storona(l, j));
  return {
    pytannia: `Який з відрізків — діагональ чотирикутника ${nazva(l)}?`,
    vidpovid: d,
    varianty: r.peremishaty([d, s1, s2]),
    pidkazka: 'Діагональ сполучає протилежні вершини, а сторона — сусідні.',
    rozviazok: `${s1} і ${s2} — сторони: вони сполучають сусідні вершини. Діагональ — ${d}.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = [0, 1, 2, 3].map(() => r.chyslo(3, 25));
  const P = a[0] + a[1] + a[2] + a[3];
  if (r.shans()) {
    return {
      pytannia: `Сторони чотирикутника ${nazva(l)}: ${a.map((x, i) => `${storona(l, i)} = ${x} см`).join(', ')}. Знайди його периметр.`,
      vidpovid: P,
      odynytsi: 'см',
      pidkazka: 'Периметр — сума довжин усіх сторін.',
      rozviazok: `Периметр ${a.join(' + ')} = ${P} см.`,
    };
  }
  const n = r.chyslo(0, 3);
  const inshi = [0, 1, 2, 3].filter((i) => i !== n);
  const s = P - a[n];
  return {
    pytannia: `Периметр чотирикутника ${nazva(l)} дорівнює ${P} см, ${inshi.map((i) => `${storona(l, i)} = ${a[i]} см`).join(', ')}. Знайди ${storona(l, n)}.`,
    malunok: chotyrykutnyk({ forma: 'dovilnyi', bukvy: l, storony: a.map((x, i) => (i === n ? '?' : `${x}`)) }),
    vidpovid: a[n],
    odynytsi: 'см',
    pidkazka: 'Від периметра відніми суму трьох відомих сторін.',
    rozviazok: `Три сторони разом ${inshi.map((i) => a[i]).join(' + ')} = ${s} см, тож ${storona(l, n)} = ${P} − ${s} = ${a[n]} см.`,
  };
}

function chyMozhe(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  let g: number[];
  if (typ === 3) {
    // Пастка: сума 180°, як у трикутника.
    for (;;) {
      g = [0, 1, 2].map(() => r.chyslo(20, 60));
      const ost = 180 - g[0] - g[1] - g[2];
      if (ost >= 15 && ost <= 70) break;
    }
    g.push(180 - g[0] - g[1] - g[2]);
  } else {
    const { k } = kuty(r);
    g = [...k];
    if (typ !== 0) g[r.chyslo(0, 3)] += r.vybir([-20, -10, -5, 5, 10, 20]);
  }
  const s = g.reduce((a, b) => a + b, 0);
  const tak = s === 360;
  return {
    pytannia: `Чи може чотирикутник мати кути ${g.slice(0, 3).map((x) => `${x}°`).join(', ')} і ${g[3]}°?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Додай усі чотири кути й порівняй з 360°.',
    rozviazok: `Разом ${g.map((x) => `${x}°`).join(' + ')} = ${s}°. ${tak ? 'Так, сума 360°.' : `Сума не 360°, тож такого чотирикутника немає.${s === 180 ? ' 180° — це сума кутів трикутника.' : ''}`}`,
  };
}

function rivniKuty(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    // Три рівні кути, четвертий відомий.
    const x = r.chyslo(65, 115);
    const d = 360 - 3 * x;
    return {
      pytannia: `Три кути чотирикутника рівні між собою, а четвертий дорівнює ${d}°. Знайди один з рівних кутів.`,
      vidpovid: x,
      odynytsi: '°',
      pidkazka: `На три рівні кути припадає 360° − ${d}°.`,
      rozviazok: `Три рівні кути разом 360° − ${d}° = ${3 * x}°, тож кожен ${3 * x} : 3 = ${x}°.`,
    };
  }
  if (typ === 1) {
    // Три рівні кути відомі, шукаємо четвертий.
    const x = r.chyslo(65, 115);
    const d = 360 - 3 * x;
    return {
      pytannia: `Три кути чотирикутника дорівнюють по ${x}°. Знайди четвертий кут.`,
      vidpovid: d,
      odynytsi: '°',
      pidkazka: 'Три кути разом — це 3 · x°. Решта до 360° — четвертий кут.',
      rozviazok: `Три кути разом 3 · ${x}° = ${3 * x}°, тож четвертий 360° − ${3 * x}° = ${d}°.`,
    };
  }
  // Два кути по a, два інші рівні між собою.
  const a = r.krim(40, 140, [90]);
  const b = 180 - a;
  return {
    pytannia: `Два кути чотирикутника дорівнюють по ${a}°, а два інші рівні між собою. Знайди один з них.`,
    vidpovid: b,
    odynytsi: '°',
    pidkazka: `Два відомі кути разом 2 · ${a}°. Решту до 360° поділи навпіл.`,
    rozviazok: `Два відомі кути разом 2 · ${a}° = ${2 * a}°, на два інші лишається 360° − ${2 * a}° = ${2 * b}°, тож кожен ${2 * b} : 2 = ${b}°.`,
  };
}

const CHETVIRKY = [
  [1, 2, 3, 4], [1, 1, 2, 2], [1, 2, 2, 3], [1, 3, 4, 4], [1, 2, 3, 3], [2, 3, 3, 4], [3, 4, 5, 6], [2, 3, 4, 6],
  [4, 5, 6, 9], [3, 4, 5, 8], [2, 3, 5, 8], [2, 4, 5, 7], [3, 5, 7, 9], [4, 5, 5, 6], [5, 6, 7, 12], [1, 1, 1, 3],
].filter((t) => 360 % (t[0] + t[1] + t[2] + t[3]) === 0 && (t[3] * 360) / (t[0] + t[1] + t[2] + t[3]) < 180);

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const t = r.vybir(CHETVIRKY);
  const sum = t[0] + t[1] + t[2] + t[3];
  const x = 360 / sum;
  const naib = r.shans();
  const m = naib ? t[3] : t[0];
  return {
    pytannia: `Кути чотирикутника відносяться як ${t.join(' : ')}. Знайди ${naib ? 'найбільший' : 'найменший'} кут.`,
    vidpovid: m * x,
    odynytsi: '°',
    pidkazka: `Позначимо кути ${t.map((c) => `${c === 1 ? '' : c}x`).join(', ')} — разом 360°.`,
    rozviazok: `Разом ${t.join(' + ')} = ${sum} частин, тож одна частина 360 : ${sum} = ${x}°. ${naib ? 'Найбільший' : 'Найменший'} кут ${m} · ${x}° = ${m * x}°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  for (;;) {
    const b = r.chyslo(50, 100);
    const d = r.chyslo(5, 40);
    const c = r.chyslo(60, 120);
    const e = 360 - 2 * b - d - c;
    if (e < 50 || e > 150) continue;
    const z = 2 * b + d;
    return {
      pytannia: `У чотирикутнику ${nazva(l)} ∠${l[0]} на ${d}° більший за ∠${l[1]}, ∠${l[2]} = ${c}°, ∠${l[3]} = ${e}°. Знайди ∠${l[0]}.`,
      vidpovid: b + d,
      odynytsi: '°',
      pidkazka: `Разом ∠${l[0]} + ∠${l[1]} = 360° − ${c}° − ${e}°. Позначимо ∠${l[1]} = x, тоді ∠${l[0]} = x + ${d}.`,
      rozviazok: `Нехай ∠${l[1]} = x°, тоді ∠${l[0]} = (x + ${d})°. Разом вони 360° − ${c}° − ${e}° = ${z}°, тож 2x + ${d} = ${z}, x = ${b}, а ∠${l[0]} дорівнює ${b}° + ${d}° = ${b + d}°.`,
    };
  }
}

function kozhenNastupnyi(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const d = 2 * r.chyslo(1, 15);
  const x = 90 - 1.5 * d;
  const naib = r.shans();
  const vidp = naib ? x + 3 * d : x;
  return {
    pytannia: `У чотирикутнику ${nazva(l)} кожен наступний кут на ${d}° більший за попередній: ∠${l[0]} < ∠${l[1]} < ∠${l[2]} < ∠${l[3]}. Знайди ∠${naib ? l[3] : l[0]}.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Позначимо ∠${l[0]} = x, тоді інші кути x + ${d}, x + ${2 * d}, x + ${3 * d}. Разом 360°.`,
    rozviazok: `4x + ${d} + ${2 * d} + ${3 * d} = 360, тож 4x = 360 − ${6 * d} = ${4 * x}, x = ${x}. ${naib ? `∠${l[3]} дорівнює ${x}° + ${3 * d}° = ${vidp}°.` : `∠${l[0]} дорівнює ${x}°.`}`,
  };
}

function zovnishni(r: Vypadok): TrenZavdannia {
  const { k, n, inshi } = kuty(r);
  const l = r.vybir(LITERY);
  const e = inshi.map((i) => 180 - k[i]);
  const s = 360 - k[n];
  return {
    pytannia: `Зовнішні кути чотирикутника ${nazva(l)} при вершинах ${inshi.map((i) => l[i]).join(', ')} дорівнюють ${e.map((x) => `${x}°`).join(', ')}. Знайди кут ${l[n]} чотирикутника.`,
    vidpovid: k[n],
    odynytsi: '°',
    pidkazka: 'Зовнішній кут і кут чотирикутника при тій самій вершині — суміжні: разом 180°.',
    rozviazok: `${inshi.map((i, j) => `Кут ${l[i]} дорівнює 180° − ${e[j]}° = ${k[i]}°.`).join(' ')} Разом ${inshi.map((i) => `${k[i]}°`).join(' + ')} = ${s}°, тож кут ${l[n]} дорівнює 360° − ${s}° = ${k[n]}°.`,
  };
}

const STORONY = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [1, 1, 2, 2], [2, 3, 3, 4], [3, 5, 6, 7], [2, 2, 3, 5], [4, 5, 6, 7]];

function perymetrVidnoshennia(r: Vypadok): TrenZavdannia {
  const t = r.vybir(STORONY);
  const sum = t[0] + t[1] + t[2] + t[3];
  const x = r.chyslo(2, Math.floor(90 / sum) + 2);
  const P = sum * x;
  const naib = r.shans();
  const m = naib ? t[3] : t[0];
  return {
    pytannia: `Сторони чотирикутника відносяться як ${t.join(' : ')}, а його периметр дорівнює ${P} см. Знайди ${naib ? 'найбільшу' : 'найменшу'} сторону.`,
    vidpovid: m * x,
    odynytsi: 'см',
    pidkazka: `Периметр складається з ${t.join(' + ')} частин.`,
    rozviazok: `Разом ${t.join(' + ')} = ${sum} частин, одна частина ${P} : ${sum} = ${x} см. ${naib ? 'Найбільша' : 'Найменша'} сторона ${m} · ${x} = ${m * x} см.`,
  };
}

export default {
  rivni: ['четвертий кут, елементи', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chetvertyiZaMalunkom, chetvertyiZaMalunkom, chetvertyiTekstom, elementy, perymetr])(r);
    if (riven === 2) return r.vybir([chyMozhe, rivniKuty, vidnoshennia, elementy])(r);
    return r.vybir([naBilshe, kozhenNastupnyi, zovnishni, perymetrVidnoshennia, vidnoshennia])(r);
  },
} satisfies Henerator;
