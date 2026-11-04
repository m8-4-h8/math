// Рівнобедрений трикутник: кути при основі й кут при вершині (за малюнком і без нього), відрізок до основи
// (медіана = бісектриса = висота), ознака за двома рівними кутами, пастка «тупий кут при основі»,
// периметр, зовнішній кут, відношення й «на … більший».
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { rivnobedrenyi } from '../trykutnyky.ts';

const TN = ['Так', 'Ні'];
/** [вершина основи, вершина трикутника, вершина основи, основа відрізка з вершини]. */
const LITERY = [
  ['A', 'B', 'C', 'D'],
  ['M', 'N', 'K', 'P'],
  ['D', 'E', 'F', 'K'],
  ['P', 'Q', 'R', 'S'],
  ['A', 'B', 'C', 'H'],
];

function nazvy(r: Vypadok) {
  const l = r.vybir(LITERY);
  const [a, v, c, d] = l;
  return { l, a, v, c, d, t: `${a}${v}${c}`, os: `${a}${c}`, pro: `рівнобедреного трикутника ${a}${v}${c} з основою ${a}${c}` };
}

function osnovaZVershyny(r: Vypadok): TrenZavdannia {
  const { l, a, v, c, pro } = nazvy(r);
  const b = 2 * r.chyslo(10, 70); // кут при вершині, парний — щоб кути при основі були цілі
  const x = (180 - b) / 2;
  const shuk = r.shans() ? a : c;
  const zMalunkom = r.shans();
  return {
    pytannia: zMalunkom ? `${a}${v} = ${v}${c}. Знайди кут ${shuk}.` : `Кут при вершині ${pro} дорівнює ${b}°. Знайди кут ${shuk}.`,
    malunok: zMalunkom ? rivnobedrenyi({ vershyna: b, litery: l, pidpysyKut: { vershyna: `${b}°`, [shuk === a ? 'osnova1' : 'osnova2']: '?' } }) : undefined,
    vidpovid: x,
    odynytsi: '°',
    pidkazka: `Кути при основі рівні й разом дають 180° − ${b}°.`,
    rozviazok: `Кути ${a} і ${c} рівні, разом 180° − ${b}° = ${180 - b}°. Кожен: ${180 - b}° : 2 = ${x}°.`,
  };
}

function vershynaZOsnovy(r: Vypadok): TrenZavdannia {
  const { l, a, v, c, pro } = nazvy(r);
  const x = r.krim(25, 80, [60]);
  const b = 180 - 2 * x;
  const zMalunkom = r.shans();
  return {
    pytannia: zMalunkom ? `${a}${v} = ${v}${c}. Знайди кут ${v}.` : `Кут при основі ${pro} дорівнює ${x}°. Знайди кут ${v}.`,
    malunok: zMalunkom ? rivnobedrenyi({ vershyna: b, litery: l, pidpysyKut: { vershyna: '?', [r.shans() ? 'osnova1' : 'osnova2']: `${x}°` } }) : undefined,
    vidpovid: b,
    odynytsi: '°',
    pidkazka: `Обидва кути при основі по ${x}°.`,
    rozviazok: `Кути при основі рівні: ${x}° і ${x}°. Кут ${v} дорівнює 180° − 2 · ${x}° = ${b}°.`,
  };
}

const VYDY = ['медіана', 'бісектриса', 'висота'] as const;
const OROBNYI = { медіана: 'медіаною', бісектриса: 'бісектрисою', висота: 'висотою' };

function vidrizokDoOsnovy(r: Vypadok): TrenZavdannia {
  const { l, a, v, c, d, os, pro } = nazvy(r);
  const vyd = r.vybir(VYDY);
  const vidrizok = { mediana: vyd === 'медіана', bisektrysa: vyd === 'бісектриса', vysota: vyd === 'висота' };
  const pochatok = `${v}${d} — ${vyd} ${pro}.`;
  const inshi = VYDY.filter((x) => x !== vyd).map((x) => OROBNYI[x]);
  const vlast = `У рівнобедреному трикутнику ${vyd}, проведена до основи, є також ${inshi[0]} і ${inshi[1]}.`;
  const pytaiemo = r.vybir(VYDY.filter((x) => x !== vyd));
  if (pytaiemo === 'бісектриса') {
    const h = r.chyslo(15, 60);
    return {
      pytannia: `${pochatok} ∠${a}${v}${c} = ${2 * h}°. Знайди ∠${a}${v}${d}.`,
      malunok: rivnobedrenyi({ vershyna: 2 * h, litery: l, kuty: false, vidrizok, pidpysyKut: { polovyna: '?' } }),
      vidpovid: h,
      odynytsi: '°',
      pidkazka: `Чим ще є ${v}${d} у рівнобедреному трикутнику?`,
      rozviazok: `${vlast} Отже, ${v}${d} ділить кут ${v} навпіл: ${2 * h}° : 2 = ${h}°.`,
    };
  }
  if (pytaiemo === 'медіана') {
    const k = r.chyslo(3, 20);
    return {
      pytannia: `${pochatok} ${os} = ${2 * k} см. Знайди ${a}${d}.`,
      malunok: rivnobedrenyi({ vershyna: r.chyslo(40, 100), litery: l, kuty: false, vidrizok, pidpysySt: { polovyna: '?' } }),
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: `Чим ще є ${v}${d} у рівнобедреному трикутнику?`,
      rozviazok: `${vlast} Отже, ${d} — середина ${os}: ${2 * k} : 2 = ${k} см.`,
    };
  }
  return {
    pytannia: `${pochatok} Знайди кут ${a}${d}${v}.`,
    malunok: rivnobedrenyi({ vershyna: r.chyslo(40, 100), litery: l, kuty: false, vidrizok }),
    vidpovid: 90,
    odynytsi: '°',
    pidkazka: `Чим ще є ${v}${d} у рівнобедреному трикутнику?`,
    rozviazok: `${vlast} Отже, ${v}${d} ⊥ ${os}, і кут ${a}${d}${v} прямий — 90°.`,
  };
}

function oznaka(r: Vypadok): TrenZavdannia {
  const { l, a, v, c, t } = nazvy(r);
  const x = r.krim(25, 80, [60]);
  const s = r.chyslo(4, 20);
  if (r.shans()) {
    return {
      pytannia: `У трикутнику ${t} ∠${a} = ∠${c} = ${x}°, ${a}${v} = ${s} см. Знайди ${v}${c}.`,
      malunok: rivnobedrenyi({ vershyna: 180 - 2 * x, litery: l, storony: false, kuty: false, pidpysyKut: { osnova1: `${x}°`, osnova2: `${x}°` }, pidpysySt: { bichna: `${s} см`, bichna2: '?' } }),
      vidpovid: s,
      odynytsi: 'см',
      pidkazka: 'Два кути рівні — отже, трикутник рівнобедрений. Які сторони лежать навпроти рівних кутів?',
      rozviazok: `Кути ${a} і ${c} рівні, тож трикутник рівнобедрений: навпроти них лежать рівні сторони ${v}${c} і ${a}${v}. Отже, ${v}${c} = ${s} см.`,
    };
  }
  // Третій кут треба знайти: ∠B дано, ∠C — ні.
  const b = 180 - 2 * x;
  return {
    pytannia: `У трикутнику ${t} ∠${a} = ${x}°, ∠${v} = ${b}°, ${a}${v} = ${s} см. Знайди ${v}${c}.`,
    vidpovid: s,
    odynytsi: 'см',
    pidkazka: `Спершу знайди кут ${c}.`,
    rozviazok: `Кут ${c} дорівнює 180° − ${x}° − ${b}° = ${x}°, тож ∠${a} = ∠${c} і трикутник рівнобедрений: ${v}${c} = ${a}${v} = ${s} см.`,
  };
}

function pastka(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const g = r.chyslo(90, 150);
    return {
      pytannia: `Чи може кут при основі рівнобедреного трикутника дорівнювати ${g}°?`,
      vidpovid: 'Ні',
      varianty: TN,
      pidkazka: 'Кути при основі рівні. Скільки разом дають два такі кути?',
      rozviazok: `Тоді обидва кути при основі по ${g}°, разом ${2 * g}° — ${g === 90 ? 'уже вся сума кутів трикутника, і на кут при вершині нічого не лишається' : 'більше, ніж сума всіх трьох кутів трикутника'}. Не може.`,
    };
  }
  if (typ === 1) {
    const g = r.chyslo(90, 160);
    return {
      pytannia: `Чи може кут при вершині рівнобедреного трикутника дорівнювати ${g}°?`,
      vidpovid: 'Так',
      varianty: TN,
      pidkazka: 'Скільки тоді лишається на два кути при основі?',
      rozviazok: `Так: кути при основі тоді по (180° − ${g}°) : 2, обидва гострі. Рівнобедрений трикутник буває ${g === 90 ? 'прямокутним' : 'тупокутним'}.`,
    };
  }
  // Чи рівнобедрений трикутник з такими кутами?
  const x = r.krim(25, 80, [60]);
  const tak = r.shans();
  const a = x;
  const b = tak ? 180 - 2 * x : r.krim(Math.max(20, 180 - 2 * x - 30), Math.min(130, 180 - x - 20), [180 - 2 * x, x, (180 - x) / 2]);
  const c = 180 - a - b;
  return {
    pytannia: `Два кути трикутника — ${a}° і ${b}°. Чи рівнобедрений він?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Знайди третій кут. Чи є серед трьох кутів два рівні?',
    rozviazok: `Третій кут дорівнює 180° − ${a}° − ${b}° = ${c}°. ${tak ? `Два кути по ${a}° — трикутник рівнобедрений.` : 'Усі три кути різні — трикутник не рівнобедрений.'}`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const { t } = nazvy(r);
  const typ = r.chyslo(0, 2);
  if (typ === 2) {
    // Бічна сторона на d см більша за основу.
    const o = r.chyslo(3, 15);
    const d = r.chyslo(1, 8);
    const b = o + d;
    const P = 2 * b + o;
    return {
      pytannia: `Бічна сторона рівнобедреного трикутника на ${d} см більша за основу, а периметр дорівнює ${P} см. Знайди основу.`,
      vidpovid: o,
      odynytsi: 'см',
      pidkazka: `Нехай основа x, тоді бічні сторони по x + ${d}.`,
      rozviazok: `x + (x + ${d}) + (x + ${d}) = ${P}, 3x + ${2 * d} = ${P}, 3x = ${P - 2 * d}, x = ${o}. Основа ${o} см.`,
    };
  }
  let b: number;
  let o: number;
  do {
    b = r.chyslo(4, 25);
    o = r.chyslo(3, 30);
  } while (o >= 2 * b || o === b);
  const P = 2 * b + o;
  if (typ === 0) {
    return {
      pytannia: `Периметр рівнобедреного трикутника ${t} дорівнює ${P} см, основа — ${o} см. Знайди бічну сторону.`,
      vidpovid: b,
      odynytsi: 'см',
      pidkazka: 'Відніми основу від периметра — лишаться дві рівні бічні сторони.',
      rozviazok: `Дві бічні сторони разом ${P} − ${o} = ${2 * b} см, кожна ${2 * b} : 2 = ${b} см.`,
    };
  }
  return {
    pytannia: `Периметр рівнобедреного трикутника ${t} дорівнює ${P} см, бічна сторона — ${b} см. Знайди основу.`,
    vidpovid: o,
    odynytsi: 'см',
    pidkazka: 'Бічних сторін дві, і вони рівні.',
    rozviazok: `Основа дорівнює ${P} − 2 · ${b} = ${o} см.`,
  };
}

function zovnishnii(r: Vypadok): TrenZavdannia {
  const { l, a, v, c, pro } = nazvy(r);
  if (r.shans()) {
    // Зовнішній кут при вершині основи C.
    const x = r.krim(25, 80, [60]);
    const e = 180 - x;
    const b = 180 - 2 * x;
    return {
      pytannia: `${a}${v} = ${v}${c}, зовнішній кут при вершині ${c} дорівнює ${e}°. Знайди кут ${v}.`,
      malunok: rivnobedrenyi({ vershyna: b, litery: l, pidpysyKut: { zovnishnii: `${e}°`, vershyna: '?' } }),
      vidpovid: b,
      odynytsi: '°',
      pidkazka: `Зовнішній кут і кут ${c} — суміжні. Знайди кут ${c}, а з ним і кут ${a}.`,
      rozviazok: `Кут ${c} дорівнює 180° − ${e}° = ${x}°, і кут ${a} теж ${x}°. Кут ${v} дорівнює 180° − 2 · ${x}° = ${b}°.`,
    };
  }
  // Зовнішній кут при вершині B — сума двох рівних кутів при основі.
  const x = r.krim(15, 85, [60]);
  return {
    pytannia: `Зовнішній кут при вершині ${v} ${pro} дорівнює ${2 * x}°. Знайди кут ${a}.`,
    vidpovid: x,
    odynytsi: '°',
    pidkazka: 'Зовнішній кут дорівнює сумі двох кутів, не суміжних з ним. А вони рівні.',
    rozviazok: `Зовнішній кут при ${v} дорівнює ∠${a} + ∠${c}, а ці кути рівні: ${2 * x}° : 2 = ${x}°.`,
  };
}

function vidnoshennia(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    // Кут при вершині в k разів більший за кут при основі: x + x + kx = 180.
    const k = r.vybir([2, 3, 4, 7, 8, 10]);
    const x = 180 / (k + 2);
    const shuk = r.shans();
    return {
      pytannia: `Кут при вершині рівнобедреного трикутника в ${k} рази більший за кут при основі. Знайди ${shuk ? 'кут при вершині' : 'кут при основі'}.`.replace(/в (7|8|10) рази/, 'в $1 разів'),
      vidpovid: shuk ? k * x : x,
      odynytsi: '°',
      pidkazka: `Нехай кут при основі x, тоді кут при вершині ${k}x. Разом: x + x + ${k}x = 180.`,
      rozviazok: `x + x + ${k}x = 180, ${k + 2}x = 180, x = ${x}. Кут при основі ${x}°, кут при вершині ${k} · ${x}° = ${k * x}°.`,
    };
  }
  // Кут при вершині на d° більший за кут при основі: 3x + d = 180.
  const x = r.krim(25, 55, [60]);
  const d = 180 - 3 * x;
  const shuk = r.shans();
  return {
    pytannia: `Кут при вершині рівнобедреного трикутника на ${d}° більший за кут при основі. Знайди ${shuk ? 'кут при вершині' : 'кут при основі'}.`,
    vidpovid: shuk ? x + d : x,
    odynytsi: '°',
    pidkazka: `Нехай кут при основі x, тоді кут при вершині x + ${d}. Разом: x + x + x + ${d} = 180.`,
    rozviazok: `3x + ${d} = 180, 3x = ${180 - d}, x = ${x}. Кут при основі ${x}°, кут при вершині ${x}° + ${d}° = ${x + d}°.`,
  };
}

export default {
  rivni: ['кути', 'медіана, бісектриса, висота й ознака', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([osnovaZVershyny, vershynaZOsnovy, osnovaZVershyny, vershynaZOsnovy, pastka])(r);
    if (riven === 2) return r.vybir([vidrizokDoOsnovy, vidrizokDoOsnovy, oznaka, pastka])(r);
    return r.vybir([perymetr, zovnishnii, vidnoshennia, perymetr, zovnishnii])(r);
  },
} satisfies Henerator;
