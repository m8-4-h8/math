// Друга ознака рівності трикутників (сторона і два прилеглі кути): яка ознака за позначками на малюнку,
// відповідні елементи, «кути не при стороні» (спершу третій кут через 180°), задачі на типових малюнках
// (AO = OB і рівні кути при A та B; спільна сторона BD з рівними кутами при B і D), периметри.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { dvaTrykutnyky, konfihuratsiia } from '../trykutnyky.ts';
import type { Forma } from '../trykutnyky.ts';

const OZNAKY = ['за першою ознакою', 'за другою ознакою', 'не можна стверджувати'];
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
/** Кінці сторони i — вершини i та i + 1. */
const kintsi = (i: number) => [i, (i + 1) % 3];
/** Кут при вершині v лежить між сторонами v і v − 1. */
const prylehli = (v: number) => [v, (v + 2) % 3];

function malunok(r: Vypadok, rysky: number[], dugy: number[], dodatkovo: Record<string, unknown> = {}, l?: [string[], string[]]) {
  const [l1, l2] = l ?? r.vybir(PARY);
  return dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, dugy, ...dodatkovo });
}

function yakaOznaka(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3); // 0 — перша, 1 — друга, 2 — три кути, 3 — дві сторони і кут не між ними
  const [l1, l2] = r.vybir(PARY);
  const rysky = [0, 0, 0];
  const dugy = [0, 0, 0];
  let vidpovid: string;
  let rozviazok: string;
  if (typ === 0) {
    const v = r.chyslo(0, 2);
    const [s1, s2] = prylehli(v);
    [rysky[s1], rysky[s2], dugy[v]] = [1, 2, 1];
    vidpovid = OZNAKY[0];
    rozviazok = `Рівні дві пари сторін (${storona(l1, s1)} і ${storona(l1, s2)}) і кут ${l1[v]} між ними — це перша ознака.`;
  } else if (typ === 1) {
    const s = r.chyslo(0, 2);
    const [a, b] = kintsi(s);
    [rysky[s], dugy[a], dugy[b]] = [1, 1, 2];
    vidpovid = OZNAKY[1];
    rozviazok = `Рівна сторона ${storona(l1, s)}, а рівні кути ${l1[a]} і ${l1[b]} стоять при її кінцях — це друга ознака.`;
  } else if (typ === 2) {
    [dugy[0], dugy[1], dugy[2]] = r.peremishaty([1, 2, 3]);
    vidpovid = OZNAKY[2];
    rozviazok = 'Рівні лише кути, жодної пари сторін. Трикутники з однаковими кутами можуть мати різні розміри — ознаки немає.';
  } else {
    const v = r.chyslo(0, 2);
    const w = r.krim(0, 2, [v]);
    const [s1, s2] = prylehli(w);
    [rysky[s1], rysky[s2], dugy[v]] = [1, 2, 1];
    vidpovid = OZNAKY[2];
    rozviazok = `Рівні сторони ${storona(l1, s1)} і ${storona(l1, s2)}, але кут між ними — ${l1[w]}, а позначено кут ${l1[v]}. Це не перша ознака, а для другої бракує кута.`;
  }
  return {
    pytannia: 'Чи рівні трикутники на малюнку? За якою ознакою?',
    malunok: malunok(r, rysky, dugy, {}, [l1, l2]),
    vidpovid,
    varianty: OZNAKY,
    pidkazka: 'Перша — дві сторони і кут між ними. Друга — сторона і два кути при її кінцях.',
    rozviazok,
  };
}

function vidpovidnyi(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const s = r.chyslo(0, 2);
  const [a, b] = kintsi(s);
  const umova = `${storona(l1, s)} = ${storona(l2, s)}, ∠${l1[a]} = ∠${l2[a]}, ∠${l1[b]} = ∠${l2[b]}`;
  const pochatok = `Сторона ${storona(l1, s)} і кути при її кінцях дорівнюють стороні ${storona(l2, s)} і кутам при її кінцях — за другою ознакою △${l1.join('')} = △${l2.join('')}.`;
  const c = 3 - a - b; // третя вершина
  if (r.shans()) {
    const t = r.krim(0, 2, [s]);
    const x = r.chyslo(3, 25);
    return {
      pytannia: `У трикутниках ${l1.join('')} і ${l2.join('')}: ${umova}, ${storona(l1, t)} = ${x} см. Знайди ${storona(l2, t)}.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Спершу переконайся, що трикутники рівні. Відповідні вершини — на однакових місцях.',
      rozviazok: `${pochatok} Тому ${storona(l2, t)} = ${storona(l1, t)} = ${x} см.`,
    };
  }
  const g = r.chyslo(20, 110);
  return {
    pytannia: `У трикутниках ${l1.join('')} і ${l2.join('')}: ${umova}, ∠${l1[c]} = ${g}°. Знайди ∠${l2[c]}.`,
    vidpovid: g,
    odynytsi: '°',
    pidkazka: `Чи рівні трикутники? Який кут відповідає куту ${l1[c]}?`,
    rozviazok: `${pochatok} Тому ∠${l2[c]} = ∠${l1[c]} = ${g}°.`,
  };
}

/** Три кути трикутника (цілі, кожен від 20°). */
function kuty(r: Vypadok) {
  for (;;) {
    const a = r.chyslo(25, 110);
    const b = r.chyslo(25, 110);
    const c = 180 - a - b;
    if (c >= 20 && a !== b && b !== c && a !== c) return [a, b, c];
  }
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [l1, l2] = r.vybir(PARY);
  const s = r.chyslo(0, 2);
  const [a, b] = kintsi(s);
  const c = 3 - a - b;
  const rysky = [0, 0, 0];
  const dugy = [0, 0, 0];
  [rysky[s], dugy[a], dugy[b]] = [1, 1, 2];
  const nazad = r.shans();
  const [dano, shuk] = nazad ? [l2, l1] : [l1, l2];
  const pochatok = `${storona(l1, s)} = ${storona(l2, s)}, а кути при їхніх кінцях рівні — за другою ознакою трикутники рівні.`;
  if (r.shans()) {
    const t = r.krim(0, 2, [s]);
    const x = r.chyslo(4, 20);
    const pSt = (d: string[]) => [0, 1, 2].map((i) => (i === t ? (d === dano ? `${x} см` : '?') : undefined));
    return {
      pytannia: `Знайди ${storona(shuk, t)}.`,
      malunok: malunok(r, rysky, dugy, { pidpysySt1: pSt(l1), pidpysySt2: pSt(l2) }, [l1, l2]),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Спершу переконайся, що трикутники рівні. Яка сторона відповідає шуканій?',
      rozviazok: `${pochatok} Тому ${storona(shuk, t)} = ${storona(dano, t)} = ${x} см.`,
    };
  }
  const g = r.chyslo(25, 110);
  const pK = (d: string[]) => [0, 1, 2].map((i) => (i === c ? (d === dano ? `${g}°` : '?') : undefined));
  return {
    pytannia: `Знайди кут ${shuk[c]}.`,
    malunok: malunok(r, rysky, dugy, { pidpysyKut1: pK(l1), pidpysyKut2: pK(l2) }, [l1, l2]),
    vidpovid: g,
    odynytsi: '°',
    pidkazka: 'Спершу переконайся, що трикутники рівні. Який кут відповідає шуканому?',
    rozviazok: `${pochatok} Тому ∠${shuk[c]} = ∠${dano[c]} = ${g}°.`,
  };
}

function neprylehli(r: Vypadok): TrenZavdannia {
  // Рівні сторона й два кути, але один з них не при цій стороні: спершу знайди треті кути.
  const [l1, l2] = r.vybir(PARY);
  const s = r.chyslo(0, 2);
  const [a, b] = r.shans() ? kintsi(s) : kintsi(s).reverse();
  const c = 3 - a - b; // кут не при стороні
  const k = kuty(r);
  const t = r.krim(0, 2, [s]);
  const x = r.chyslo(4, 20);
  return {
    pytannia: `У трикутниках ${l1.join('')} і ${l2.join('')}: ${storona(l1, s)} = ${storona(l2, s)}, ∠${l1[a]} = ∠${l2[a]} = ${k[a]}°, ∠${l1[c]} = ∠${l2[c]} = ${k[c]}°, ${storona(l1, t)} = ${x} см. Знайди ${storona(l2, t)}.`,
    vidpovid: x,
    odynytsi: 'см',
    pidkazka: `Кут ${l1[c]} не прилеглий до ${storona(l1, s)}. Знайди кути ${l1[b]} і ${l2[b]}.`,
    rozviazok: `Кут ${l1[b]} дорівнює 180° − ${k[a]}° − ${k[c]}° = ${k[b]}°, і кут ${l2[b]} так само. Тепер ${storona(l1, s)} = ${storona(l2, s)} і кути при їхніх кінцях рівні — за другою ознакою трикутники рівні, тож ${storona(l2, t)} = ${x} см.`,
  };
}

const KHREST = 'AO = OB, ∠OAC = ∠OBD, а ∠AOC = ∠BOD як вертикальні, тож △AOC = △BOD за другою ознакою.';
const UMOVA_KH = 'Відрізки AB і CD перетинаються в точці O, AO = OB, ∠OAC = ∠OBD.';

function khrest(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0 || typ === 1) {
    const x = r.chyslo(3, 15);
    const [dano, shuk] = typ === 0 ? (r.shans() ? ['CO', 'DO'] : ['DO', 'CO']) : r.shans() ? ['AC', 'BD'] : ['BD', 'AC'];
    return {
      pytannia: `${UMOVA_KH} ${dano} = ${x} см. Знайди ${shuk}.`,
      malunok: konfihuratsiia('khrest', { [dano]: `${x} см`, [shuk]: '?' }, 2),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Які трикутники рівні? Не забудь про вертикальні кути при O.',
      rozviazok: `${KHREST} Сторона ${shuk} відповідає ${dano}, тож ${shuk} = ${x} см.`,
    };
  }
  if (typ === 2) {
    const g = r.chyslo(25, 80);
    const [dano, shuk, n1, n2] = r.shans() ? ['C', 'D', 'OCA', 'ODB'] : ['D', 'C', 'ODB', 'OCA'];
    return {
      pytannia: `${UMOVA_KH} ∠${n1} = ${g}°. Знайди ∠${n2}.`,
      malunok: konfihuratsiia('khrest', { [dano]: `${g}°`, [shuk]: '?' }, 2),
      vidpovid: g,
      odynytsi: '°',
      pidkazka: 'Які трикутники рівні? Який кут відповідає відомому?',
      rozviazok: `${KHREST} Кут ${n2} відповідає куту ${n1}: ${g}°.`,
    };
  }
  const [p, q] = [r.chyslo(3, 9), r.chyslo(3, 9)];
  const s = r.chyslo(Math.abs(p - q) + 1, p + q - 1);
  return {
    pytannia: `${UMOVA_KH} AO = ${p} см, CO = ${q} см, AC = ${s} см. Знайди периметр трикутника BOD.`,
    malunok: konfihuratsiia('khrest', { AC: `${s} см` }, 2),
    vidpovid: p + q + s,
    odynytsi: 'см',
    pidkazka: 'Трикутник BOD дорівнює трикутнику AOC. Які в нього сторони?',
    rozviazok: `${KHREST} Тому BO = ${p} см, DO = ${q} см, BD = ${s} см, а периметр ${p} + ${q} + ${s} = ${p + q + s} см.`,
  };
}

const SPILNA = 'BD — спільна сторона, а кути при її кінцях рівні, тож △ABD = △CBD за другою ознакою.';
const UMOVA_SP = '∠ABD = ∠CBD, ∠ADB = ∠CDB.';

function spilna(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const x = r.chyslo(3, 15);
    const [dano, shuk, kl1, kl2] = r.shans() ? ['AB', 'CB', 'AB', 'BC'] : ['AD', 'CD', 'AD', 'CD'];
    return {
      pytannia: `${UMOVA_SP} ${dano} = ${x} см. Знайди ${shuk}.`,
      malunok: konfihuratsiia('spilna', { [kl1]: `${x} см`, [kl2]: '?' }, 2),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Яка сторона в трикутниках ABD і CBD спільна?',
      rozviazok: `${SPILNA} Тому ${shuk} = ${dano} = ${x} см.`,
    };
  }
  if (typ === 1) {
    const g = r.chyslo(40, 110);
    return {
      pytannia: `${UMOVA_SP} ∠BAD = ${g}°. Знайди ∠BCD.`,
      malunok: konfihuratsiia('spilna', { A: `${g}°`, C: '?' }, 2),
      vidpovid: g,
      odynytsi: '°',
      pidkazka: 'Доведи рівність трикутників. Який кут відповідає куту BAD?',
      rozviazok: `${SPILNA} Кут BCD відповідає куту BAD: ${g}°.`,
    };
  }
  if (typ === 2) {
    const [ab, ad] = [r.chyslo(4, 15), r.chyslo(3, 12)];
    return {
      pytannia: `${UMOVA_SP} AB = ${ab} см, AD = ${ad} см. Знайди периметр чотирикутника ABCD.`,
      malunok: konfihuratsiia('spilna', {}, 2),
      vidpovid: 2 * (ab + ad),
      odynytsi: 'см',
      pidkazka: 'Трикутники рівні, тож CB = AB і CD = AD.',
      rozviazok: `${SPILNA} Тому CB = ${ab} см, CD = ${ad} см, а периметр ${ab} + ${ab} + ${ad} + ${ad} = ${2 * (ab + ad)} см.`,
    };
  }
  const [ab, ad] = [r.chyslo(4, 12), r.chyslo(3, 10)];
  const bd = r.chyslo(Math.abs(ab - ad) + 1, ab + ad - 1);
  return {
    pytannia: `${UMOVA_SP} AB = ${ab} см, AD = ${ad} см, BD = ${bd} см. Знайди периметр трикутника CBD.`,
    malunok: konfihuratsiia('spilna', {}, 2),
    vidpovid: ab + ad + bd,
    odynytsi: 'см',
    pidkazka: 'Трикутник CBD дорівнює трикутнику ABD. Які в нього сторони?',
    rozviazok: `${SPILNA} Тому CB = ${ab} см, CD = ${ad} см, і периметр ${ab} + ${ad} + ${bd} = ${ab + ad + bd} см.`,
  };
}

export default {
  rivni: ['яка ознака', 'відповідні елементи', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([yakaOznaka, yakaOznaka, vidpovidnyi])(r);
    if (riven === 2) return r.vybir([zaMalunkom, zaMalunkom, neprylehli, yakaOznaka])(r);
    return r.vybir([khrest, spilna, neprylehli, zaMalunkom])(r);
  },
} satisfies Henerator;
