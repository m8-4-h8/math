// Третя ознака рівності трикутників (три сторони): яка з трьох ознак за позначками чи записом, відповідний кут —
// навпроти відповідної сторони (і з переставленими буквами), задачі на спільну сторону BD, чотирикутник
// з рівними протилежними сторонами (спільна діагональ), периметри.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { dvaTrykutnyky, konfihuratsiia } from '../trykutnyky.ts';
import type { Forma } from '../trykutnyky.ts';

const OZNAKY = ['за першою ознакою', 'за другою ознакою', 'за третьою ознакою', 'не можна стверджувати'];
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
const kintsi = (i: number) => [i, (i + 1) % 3];
const prylehli = (v: number) => [v, (v + 2) % 3];
/** Сторона навпроти вершини v. */
const navprotyV = (v: number) => (v + 1) % 3;

/** Три кути трикутника (цілі, різні). */
function kuty(r: Vypadok) {
  for (;;) {
    const a = r.chyslo(25, 110);
    const b = r.chyslo(25, 110);
    const c = 180 - a - b;
    if (c >= 20 && a !== b && b !== c && a !== c) return [a, b, c];
  }
}

/** Позначки й правильна відповідь для одного з випадків: 0 — перша, 1 — друга, 2 — третя, 3 — три кути, 4 — кут не між сторонами. */
function vypadok(r: Vypadok, typ: number, l1: string[]) {
  const rysky = [0, 0, 0];
  const dugy = [0, 0, 0];
  if (typ === 0) {
    const v = r.chyslo(0, 2);
    const [s1, s2] = prylehli(v);
    [rysky[s1], rysky[s2], dugy[v]] = [1, 2, 1];
    return { rysky, dugy, vidpovid: OZNAKY[0], rozviazok: `Рівні сторони ${storona(l1, s1)} і ${storona(l1, s2)} та кут ${l1[v]} між ними — перша ознака.` };
  }
  if (typ === 1) {
    const s = r.chyslo(0, 2);
    const [a, b] = kintsi(s);
    [rysky[s], dugy[a], dugy[b]] = [1, 1, 2];
    return { rysky, dugy, vidpovid: OZNAKY[1], rozviazok: `Рівна сторона ${storona(l1, s)} і кути ${l1[a]} та ${l1[b]} при її кінцях — друга ознака.` };
  }
  if (typ === 2) {
    [rysky[0], rysky[1], rysky[2]] = r.peremishaty([1, 2, 3]);
    return { rysky, dugy, vidpovid: OZNAKY[2], rozviazok: 'Рівні три пари сторін — третя ознака.' };
  }
  if (typ === 3) {
    [dugy[0], dugy[1], dugy[2]] = r.peremishaty([1, 2, 3]);
    return { rysky, dugy, vidpovid: OZNAKY[3], rozviazok: 'Рівні лише кути — трикутники можуть мати різні розміри. Жодна ознака не виконується.' };
  }
  const v = r.chyslo(0, 2);
  const w = r.krim(0, 2, [v]);
  const [s1, s2] = prylehli(w);
  [rysky[s1], rysky[s2], dugy[v]] = [1, 2, 1];
  return {
    rysky,
    dugy,
    vidpovid: OZNAKY[3],
    rozviazok: `Рівні сторони ${storona(l1, s1)} і ${storona(l1, s2)}, але позначено кут ${l1[v]}, а не кут ${l1[w]} між ними. Третьої пари сторін немає — жодна ознака не виконується.`,
  };
}

function yakaOznaka(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const typ = r.vybir([0, 1, 2, 2, 3, 4]);
  const { rysky, dugy, vidpovid, rozviazok } = vypadok(r, typ, l1);
  return {
    pytannia: 'Чи рівні трикутники на малюнку? За якою ознакою?',
    malunok: dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, dugy }),
    vidpovid,
    varianty: OZNAKY,
    pidkazka: 'Порахуй пари рівних сторін і подивись, де стоять рівні кути.',
    rozviazok,
  };
}

function oznakaTekstom(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const typ = r.vybir([0, 1, 2, 2, 3, 4]);
  const { rysky, dugy, vidpovid, rozviazok } = vypadok(r, typ, l1);
  const umovy = [
    ...[0, 1, 2].filter((i) => rysky[i]).map((i) => `${storona(l1, i)} = ${storona(l2, i)}`),
    ...[0, 1, 2].filter((i) => dugy[i]).map((i) => `∠${l1[i]} = ∠${l2[i]}`),
  ];
  return {
    pytannia: `${r.peremishaty(umovy).join(', ')}. За якою ознакою △${l1.join('')} = △${l2.join('')}?`,
    vidpovid,
    varianty: OZNAKY,
    pidkazka: 'Скільки пар сторін? Де стоять кути: між сторонами чи при кінцях сторони?',
    rozviazok,
  };
}

function navproty(r: Vypadok): TrenZavdannia {
  // △ з переставленими буквами: рівності сторін задано не в «зручному» порядку.
  const [l1, l2] = r.vybir(PARY);
  const p = r.peremishaty([0, 1, 2]); // вершина i першого трикутника відповідає вершині p[i] другого
  const rivnosti = [0, 1, 2].map((s) => {
    const [a, b] = kintsi(s);
    return `${storona(l1, s)} = ${l2[p[a]]}${l2[p[b]]}`;
  });
  const g = kuty(r);
  const i = r.chyslo(0, 2);
  const s = navprotyV(i);
  const [a, b] = kintsi(s);
  const dani = [0, 1, 2].map((m) => `∠${l1[m]} = ${g[m]}°`).join(', ');
  return {
    pytannia: `${r.peremishaty(rivnosti).join(', ')}; ${dani}. Знайди ∠${l2[p[i]]}.`,
    vidpovid: g[i],
    odynytsi: '°',
    pidkazka: `Кут ${l2[p[i]]} лежить навпроти сторони ${l2[p[a]]}${l2[p[b]]}. Якій стороні першого трикутника вона дорівнює?`,
    rozviazok: `За третьою ознакою трикутники рівні. Кут ${l2[p[i]]} лежить навпроти ${l2[p[a]]}${l2[p[b]]}, а вона дорівнює ${storona(l1, s)}, навпроти якої кут ${l1[i]}. Тому ∠${l2[p[i]]} = ∠${l1[i]} = ${g[i]}°.`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const rysky = r.peremishaty([1, 2, 3]);
  const v = r.chyslo(0, 2);
  const g = r.chyslo(25, 110);
  const nazad = r.shans();
  const [dano, shuk] = nazad ? [l2, l1] : [l1, l2];
  const pK = (d: string[]) => [0, 1, 2].map((i) => (i === v ? (d === dano ? `${g}°` : '?') : undefined));
  const s = navprotyV(v);
  return {
    pytannia: `Знайди кут ${shuk[v]}.`,
    malunok: dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, pidpysyKut1: pK(l1), pidpysyKut2: pK(l2) }),
    vidpovid: g,
    odynytsi: '°',
    pidkazka: 'Три пари рівних сторін — які трикутники рівні? Шуканий кут лежить навпроти якої сторони?',
    rozviazok: `Три пари сторін рівні — за третьою ознакою трикутники рівні. Кут ${shuk[v]} лежить навпроти ${storona(shuk, s)}, а кут ${dano[v]} — навпроти рівної їй ${storona(dano, s)}, тож ∠${shuk[v]} = ${g}°.`,
  };
}

const SPILNA = 'AB = CB, AD = CD, а BD — спільна сторона, тож △ABD = △CBD за третьою ознакою.';
const UMOVA_SP = 'AB = CB, AD = CD.';

function spilna(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const h = r.chyslo(20, 70);
    const [dano, shuk, kl] = r.shans() ? ['ABC', 'CBD', 'CBD'] : ['ABC', 'ABD', 'ABD'];
    return {
      pytannia: `${UMOVA_SP} ∠${dano} = ${2 * h}°. Знайди ∠${shuk}.`,
      malunok: konfihuratsiia('spilna', { [kl]: '?' }, 3),
      vidpovid: h,
      odynytsi: '°',
      pidkazka: 'Трикутники ABD і CBD рівні — тож BD ділить кут B навпіл.',
      rozviazok: `${SPILNA} Тому ∠ABD = ∠CBD, кожен ${2 * h}° : 2 = ${h}°.`,
    };
  }
  if (typ === 1) {
    const g = r.chyslo(40, 120);
    const [dano, shuk, n1, n2] = r.shans() ? ['A', 'C', 'BAD', 'BCD'] : ['C', 'A', 'BCD', 'BAD'];
    return {
      pytannia: `${UMOVA_SP} ∠${n1} = ${g}°. Знайди ∠${n2}.`,
      malunok: konfihuratsiia('spilna', { [dano]: `${g}°`, [shuk]: '?' }, 3),
      vidpovid: g,
      odynytsi: '°',
      pidkazka: `Доведи рівність трикутників. Який кут відповідає куту ${n1}?`,
      rozviazok: `${SPILNA} Кут ${n2} відповідає куту ${n1}: ${g}°.`,
    };
  }
  if (typ === 2) {
    const g = r.chyslo(25, 80);
    return {
      pytannia: `${UMOVA_SP} ∠ADB = ${g}°. Знайди ∠ADC.`,
      malunok: konfihuratsiia('spilna', { ADB: `${g}°` }, 3),
      vidpovid: 2 * g,
      odynytsi: '°',
      pidkazka: 'Кут ADC складається з кутів ADB і CDB. Чи рівні вони?',
      rozviazok: `${SPILNA} Тому ∠CDB = ∠ADB, а ∠ADC дорівнює 2 · ${g}° = ${2 * g}°.`,
    };
  }
  const g = r.chyslo(30, 80);
  return {
    pytannia: `${UMOVA_SP} ∠ABD = ${g}°, ∠BAD = ${180 - g - r.chyslo(20, Math.min(60, 150 - g))}°. Знайди ∠CBD.`,
    malunok: konfihuratsiia('spilna', { ABD: `${g}°`, CBD: '?' }, 3),
    vidpovid: g,
    odynytsi: '°',
    pidkazka: 'Кут BAD тут зайвий. Які трикутники рівні?',
    rozviazok: `${SPILNA} Кут CBD відповідає куту ABD: ${g}°.`,
  };
}

function chotyrykutnyk(r: Vypadok): TrenZavdannia {
  // AB = CD, BC = DA, AC — спільна: △ABC = △CDA (A ↔ C, B ↔ D, C ↔ A).
  const g = r.chyslo(20, 75);
  const [dano, shuk] = r.vybir([
    ['BAC', 'DCA'],
    ['DCA', 'BAC'],
    ['BCA', 'DAC'],
    ['DAC', 'BCA'],
    ['ABC', 'CDA'],
    ['CDA', 'ABC'],
  ]);
  const g2 = dano === 'ABC' || dano === 'CDA' ? r.chyslo(60, 130) : g;
  return {
    pytannia: `У чотирикутнику ABCD: AB = CD, BC = DA, ∠${dano} = ${g2}°. Знайди ∠${shuk}.`,
    vidpovid: g2,
    odynytsi: '°',
    pidkazka: 'Проведи діагональ AC — вона спільна для трикутників ABC і CDA.',
    rozviazok: `У трикутниках ABC і CDA: AB = CD, BC = DA, AC — спільна. За третьою ознакою △ABC = △CDA, тож A відповідає C, B — D, C — A. Кут ${shuk} відповідає куту ${dano}: ${g2}°.`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  let s: number[];
  do {
    s = r.rizni(3, 4, 18);
  } while (Math.max(...s) * 2 >= s[0] + s[1] + s[2]);
  const P = s[0] + s[1] + s[2];
  const [i, j] = r.rizni(2, 0, 2);
  const k = 3 - i - j;
  return {
    pytannia: `△${l1.join('')} = △${l2.join('')}, периметр ${l1.join('')} дорівнює ${P} см, ${storona(l2, i)} = ${s[i]} см, ${storona(l2, j)} = ${s[j]} см. Знайди ${storona(l1, k)}.`,
    vidpovid: s[k],
    odynytsi: 'см',
    pidkazka: `${storona(l1, i)} = ${storona(l2, i)}, ${storona(l1, j)} = ${storona(l2, j)}. Скільки лишається від периметра?`,
    rozviazok: `${storona(l1, i)} = ${s[i]} см, ${storona(l1, j)} = ${s[j]} см, тож ${storona(l1, k)} дорівнює ${P} − ${s[i]} − ${s[j]} = ${s[k]} см.`,
  };
}

export default {
  rivni: ['яка ознака', 'відповідні кути', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([yakaOznaka, yakaOznaka, oznakaTekstom])(r);
    if (riven === 2) return r.vybir([navproty, navproty, zaMalunkom, oznakaTekstom])(r);
    return r.vybir([spilna, spilna, chotyrykutnyk, perymetr])(r);
  },
} satisfies Henerator;
