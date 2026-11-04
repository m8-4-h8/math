// Перша ознака рівності трикутників (дві сторони і кут між ними): чи виконується ознака за позначками на малюнку,
// відповідні елементи за порядком букв (і переставленими буквами), задачі на типових малюнках (спільна середина O,
// спільна сторона), периметри.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { dvaTrykutnyky, konfihuratsiia } from '../trykutnyky.ts';
import type { Forma } from '../trykutnyky.ts';

const TN = ['Так', 'Ні'];
const PARY: [string[], string[]][] = [
  [['A', 'B', 'C'], ['K', 'M', 'N']],
  [['A', 'B', 'C'], ['A₁', 'B₁', 'C₁']],
  [['A', 'B', 'C'], ['M', 'N', 'P']],
  [['D', 'E', 'F'], ['K', 'M', 'N']],
  [['D', 'E', 'F'], ['P', 'Q', 'R']],
];
const FORMY: Forma[] = ['hostrokutnyi', 'hostrokutnyi2', 'tupokutnyi'];
const POVOROTY = [-40, -25, 25, 30, 45, 150, 160, 200];

/** Сторона i — між вершинами i та i + 1 (сторону 2 пишемо як AC, а не CA). */
const storona = (l: string[], i: number) => (i === 2 ? `${l[0]}${l[2]}` : `${l[i]}${l[i + 1]}`);
/** Сторони, між якими лежить кут при вершині v: сторона v і сторона v − 1. */
const prylehli = (v: number) => [v, (v + 2) % 3];

/** Три сторони трикутника (цілі, різні, з нерівністю трикутника). */
function storony(r: Vypadok) {
  for (;;) {
    const s = r.rizni(3, 4, 18);
    const [a, b, c] = [...s].sort((x, y) => x - y);
    if (c < a + b) return s;
  }
}
/** Три кути трикутника (різні, гострі або один тупий). */
function kuty(r: Vypadok) {
  for (;;) {
    const a = r.chyslo(25, 110);
    const b = r.chyslo(25, 110);
    const c = 180 - a - b;
    if (c >= 20 && a !== b && b !== c && a !== c) return [a, b, c];
  }
}

function chyRivni(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const v = r.chyslo(0, 2);
  const typ = r.chyslo(0, 2); // 0 — ознака виконується, 1 — кут не між сторонами, 2 — лише дві сторони
  const rysky = [0, 0, 0];
  const dugy = [0, 0, 0];
  let rozviazok: string;
  if (typ === 0) {
    const [s1, s2] = prylehli(v);
    [rysky[s1], rysky[s2]] = [1, 2];
    dugy[v] = 1;
    rozviazok = `Рівні сторони ${storona(l1, s1)} і ${storona(l1, s2)}, а рівний кут ${l1[v]} лежить між ними. Перша ознака виконується.`;
  } else {
    const w = r.krim(0, 2, [v]);
    const [s1, s2] = prylehli(w);
    [rysky[s1], rysky[s2]] = [1, 2];
    if (typ === 1) dugy[v] = 1;
    rozviazok =
      typ === 1
        ? `Рівні сторони ${storona(l1, s1)} і ${storona(l1, s2)}, але кут між ними — ${l1[w]}, а позначено кут ${l1[v]}. Ознака не виконується.`
        : `Позначено лише дві пари рівних сторін, а про кут між ними нічого не відомо. Ознака не виконується.`;
  }
  return {
    pytannia: 'Чи можна за першою ознакою стверджувати, що трикутники рівні?',
    malunok: dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, dugy }),
    vidpovid: typ === 0 ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Потрібні дві пари рівних сторін і рівні кути саме між ними.',
    rozviazok,
  };
}

function vidpovidnyi(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const zapys = `△${l1.join('')} = △${l2.join('')}`;
  if (r.shans()) {
    const i = r.chyslo(0, 2);
    const x = r.chyslo(3, 25);
    return {
      pytannia: `${zapys}, ${storona(l1, i)} = ${x} см. Знайди ${storona(l2, i)}.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Відповідні вершини — на однакових місцях у записі.',
      rozviazok: `${l1[i]} відповідає ${l2[i]}, ${l1[(i + 1) % 3]} відповідає ${l2[(i + 1) % 3]}, тож ${storona(l2, i)} = ${storona(l1, i)} = ${x} см.`,
    };
  }
  const i = r.chyslo(0, 2);
  const g = r.chyslo(20, 120);
  return {
    pytannia: `${zapys}, ∠${l1[i]} = ${g}°. Знайди ∠${l2[i]}.`,
    vidpovid: g,
    odynytsi: '°',
    pidkazka: 'Відповідні вершини — на однакових місцях у записі.',
    rozviazok: `${l1[i]} відповідає ${l2[i]}, тож ∠${l2[i]} = ∠${l1[i]} = ${g}°.`,
  };
}

function perestavleni(r: Vypadok): TrenZavdannia {
  // △ABC = △MKN: відповідність задає порядок букв, а не алфавіт.
  const [l1, l2] = r.vybir(PARY);
  let vidp = l2;
  while (vidp.join('') === l2.join('')) vidp = r.peremishaty(l2); // vidp[i] відповідає l1[i]
  const zapys = `△${l1.join('')} = △${vidp.join('')}`;
  const [p, q] = r.rizni(2, 0, 2).sort();
  const [i, j] = [vidp.indexOf(l2[p]), vidp.indexOf(l2[q])];
  if (r.shans()) {
    const s = storony(r); // s[k] — сторона k трикутника l1
    const nomer = (a: number, b: number) => ((b - a + 3) % 3 === 1 ? a : b); // сторона між вершинами a і b
    const k = nomer(i, j);
    const dani = [0, 1, 2].map((m) => `${storona(l1, m)} = ${s[m]} см`).join(', ');
    return {
      pytannia: `${zapys}; ${dani}. Знайди ${l2[p]}${l2[q]}.`,
      vidpovid: s[k],
      odynytsi: 'см',
      pidkazka: `Знайди в записі, які вершини відповідають ${l2[p]} і ${l2[q]}.`,
      rozviazok: `${l2[p]} відповідає ${l1[i]}, ${l2[q]} відповідає ${l1[j]}, тож ${l2[p]}${l2[q]} = ${storona(l1, k)} = ${s[k]} см.`,
    };
  }
  const g = kuty(r);
  const dani = [0, 1, 2].map((m) => `∠${l1[m]} = ${g[m]}°`).join(', ');
  return {
    pytannia: `${zapys}; ${dani}. Знайди ∠${l2[p]}.`,
    vidpovid: g[i],
    odynytsi: '°',
    pidkazka: `Яка вершина стоїть у записі на тому самому місці, що й ${l2[p]}?`,
    rozviazok: `${l2[p]} стоїть на ${i + 1}-му місці, як і ${l1[i]}, тож ∠${l2[p]} = ∠${l1[i]} = ${g[i]}°.`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const v = r.chyslo(0, 2);
  const [s1, s2] = prylehli(v);
  const rysky = [0, 0, 0];
  [rysky[s1], rysky[s2]] = [1, 2];
  const dugy = [0, 0, 0];
  dugy[v] = 1;
  const nazad = r.shans(); // відоме число — на другому трикутнику, шукаємо на першому
  const [dano, shukaty] = nazad ? [l2, l1] : [l1, l2];
  let opts: Record<string, unknown>;
  let pytannia: string;
  let vidpovid: number;
  let odynytsi: string;
  let rozviazok: string;
  const pochatok = `${storona(l1, s1)} = ${storona(l2, s1)}, ${storona(l1, s2)} = ${storona(l2, s2)}, ∠${l1[v]} = ∠${l2[v]} — за першою ознакою трикутники рівні.`;
  if (r.shans()) {
    const s = (v + 1) % 3; // сторона навпроти кута v
    const x = r.chyslo(4, 20);
    const pSt = (d: string[]) => [0, 1, 2].map((i) => (i === s ? (d === dano ? `${x} см` : '?') : undefined));
    opts = { pidpysySt1: pSt(l1), pidpysySt2: pSt(l2) };
    pytannia = `Знайди ${storona(shukaty, s)}.`;
    vidpovid = x;
    odynytsi = 'см';
    rozviazok = `${pochatok} Тому ${storona(shukaty, s)} = ${storona(dano, s)} = ${x} см.`;
  } else {
    const w = r.krim(0, 2, [v]);
    const g = r.chyslo(25, 95);
    const pK = (d: string[]) => [0, 1, 2].map((i) => (i === w ? (d === dano ? `${g}°` : '?') : undefined));
    opts = { pidpysyKut1: pK(l1), pidpysyKut2: pK(l2) };
    pytannia = `Знайди кут ${shukaty[w]}.`;
    vidpovid = g;
    odynytsi = '°';
    rozviazok = `${pochatok} Тому ∠${shukaty[w]} = ∠${dano[w]} = ${g}°.`;
  }
  return {
    pytannia,
    malunok: dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, dugy, ...opts }),
    vidpovid,
    odynytsi,
    pidkazka: 'Спершу переконайся, що трикутники рівні. Який елемент відповідає шуканому?',
    rozviazok,
  };
}

const KHREST = 'O — середина відрізків AB і CD, ∠AOC = ∠BOD як вертикальні, тож △AOC = △BOD за першою ознакою.';

function khrest(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const x = r.chyslo(3, 15);
    const [dano, shuk] = r.shans() ? ['AC', 'BD'] : ['BD', 'AC'];
    return {
      pytannia: `Відрізки AB і CD перетинаються в точці O — середині кожного з них. ${dano} = ${x} см. Знайди ${shuk}.`,
      malunok: konfihuratsiia('khrest', { [dano]: `${x} см`, [shuk]: '?' }),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Які трикутники рівні? Яка сторона відповідає відомій?',
      rozviazok: `${KHREST} Сторона ${shuk} відповідає ${dano}, тож ${shuk} = ${x} см.`,
    };
  }
  if (typ === 1 || typ === 2) {
    const g = r.chyslo(25, 80);
    const [dano, shuk, nazva1, nazva2] = typ === 1 ? ['A', 'B', 'OAC', 'OBD'] : ['C', 'D', 'OCA', 'ODB'];
    return {
      pytannia: `Відрізки AB і CD перетинаються в точці O — середині кожного з них. ∠${nazva1} = ${g}°. Знайди ∠${nazva2}.`,
      malunok: konfihuratsiia('khrest', { [dano]: `${g}°`, [shuk]: '?' }),
      vidpovid: g,
      odynytsi: '°',
      pidkazka: 'Які трикутники рівні? Який кут відповідає відомому?',
      rozviazok: `${KHREST} Кут ${nazva2} відповідає куту ${nazva1}: ${g}°.`,
    };
  }
  const [p, q] = [r.chyslo(3, 9), r.chyslo(3, 9)];
  const s = r.chyslo(Math.abs(p - q) + 1, p + q - 1);
  return {
    pytannia: `Відрізки AB і CD перетинаються в точці O — середині кожного з них; AO = ${p} см, CO = ${q} см, AC = ${s} см. Знайди периметр трикутника BOD.`,
    malunok: konfihuratsiia('khrest', { AC: `${s} см` }),
    vidpovid: p + q + s,
    odynytsi: 'см',
    pidkazka: 'Трикутник BOD дорівнює трикутнику AOC. Які в нього сторони?',
    rozviazok: `${KHREST} Тому BO = ${p} см, DO = ${q} см, BD = ${s} см, а периметр ${p} + ${q} + ${s} = ${p + q + s} см.`,
  };
}

const SPILNA = 'AB = CB, ∠ABD = ∠CBD, а BD — спільна сторона, тож △ABD = △CBD за першою ознакою.';
const UMOVA_SP = 'У трикутниках ABD і CBD: AB = CB, ∠ABD = ∠CBD.';

function spilna(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const x = r.chyslo(3, 15);
    return {
      pytannia: `${UMOVA_SP} AD = ${x} см. Знайди CD.`,
      malunok: konfihuratsiia('spilna', { AD: `${x} см`, CD: '?' }),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Яка сторона в цих трикутниках спільна?',
      rozviazok: `${SPILNA} Тому CD = AD = ${x} см.`,
    };
  }
  if (typ === 1) {
    const g = r.chyslo(40, 110);
    return {
      pytannia: `${UMOVA_SP} ∠BAD = ${g}°. Знайди ∠BCD.`,
      malunok: konfihuratsiia('spilna', { A: `${g}°`, C: '?' }),
      vidpovid: g,
      odynytsi: '°',
      pidkazka: 'Доведи рівність трикутників. Який кут відповідає куту BAD?',
      rozviazok: `${SPILNA} Кут BCD відповідає куту BAD: ${g}°.`,
    };
  }
  if (typ === 2) {
    const g = r.chyslo(30, 85);
    return {
      pytannia: `${UMOVA_SP} ∠ADB = ${g}°. Знайди ∠ADC.`,
      malunok: konfihuratsiia('spilna', { ADB: `${g}°` }),
      vidpovid: 2 * g,
      odynytsi: '°',
      pidkazka: 'Кут ADC складається з кутів ADB і CDB. Чи рівні вони?',
      rozviazok: `${SPILNA} Тому ∠CDB = ∠ADB, а ∠ADC дорівнює 2 · ${g}° = ${2 * g}°.`,
    };
  }
  const [ab, ad] = [r.chyslo(4, 12), r.chyslo(3, 10)];
  const bd = r.chyslo(Math.abs(ab - ad) + 1, ab + ad - 1);
  return {
    pytannia: `${UMOVA_SP} AB = ${ab} см, AD = ${ad} см, BD = ${bd} см. Знайди периметр трикутника CBD.`,
    malunok: konfihuratsiia('spilna', {}),
    vidpovid: ab + ad + bd,
    odynytsi: 'см',
    pidkazka: 'Трикутники рівні, тож CB = AB і CD = AD.',
    rozviazok: `${SPILNA} Тому CB = ${ab} см, CD = ${ad} см, і периметр ${ab} + ${ad} + ${bd} = ${ab + ad + bd} см.`,
  };
}

function perymetrRivnykh(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const s = storony(r);
  const i = r.chyslo(0, 2); // яку сторону даємо в другому трикутнику
  const dani = [0, 1, 2].map((m) => (m === i ? `${storona(l2, m)} = ${s[m]} см` : `${storona(l1, m)} = ${s[m]} см`)).join(', ');
  return {
    pytannia: `△${l1.join('')} = △${l2.join('')}; ${dani}. Знайди периметр трикутника ${l2.join('')}.`,
    vidpovid: s[0] + s[1] + s[2],
    odynytsi: 'см',
    pidkazka: 'У рівних трикутників рівні відповідні сторони, тож і периметри рівні.',
    rozviazok: `Сторони трикутника ${l2.join('')} дорівнюють відповідним сторонам ${l1.join('')}, тож периметр ${s[0]} + ${s[1]} + ${s[2]} = ${s[0] + s[1] + s[2]} см.`,
  };
}

export default {
  rivni: ['ознака і відповідні елементи', 'переставлені букви й малюнок', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chyRivni, chyRivni, vidpovidnyi])(r);
    if (riven === 2) return r.vybir([perestavleni, perestavleni, zaMalunkom, chyRivni])(r);
    return r.vybir([khrest, spilna, perymetrRivnykh, zaMalunkom])(r);
  },
} satisfies Henerator;
