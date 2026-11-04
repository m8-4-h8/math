// Прямокутний трикутник: гіпотенуза (за малюнком і без нього), другий гострий кут, ознаки рівності прямокутних
// трикутників за позначками (і пастка «два гострі кути»), відповідні елементи, відношення гострих кутів,
// «на … більший», зовнішній кут, висота рівнобедреного трикутника як спільний катет.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { dvaTrykutnyky, kutyTrykutnyka } from '../trykutnyky.ts';
import type { Forma } from '../trykutnyky.ts';

const LITERY = [['A', 'B', 'C'], ['K', 'M', 'N'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['P', 'Q', 'R']];
const PARY: [string[], string[]][] = [
  [['A', 'C', 'B'], ['K', 'N', 'M']],
  [['A', 'C', 'B'], ['A₁', 'C₁', 'B₁']],
  [['D', 'F', 'E'], ['M', 'P', 'N']],
  [['M', 'K', 'N'], ['P', 'R', 'Q']],
];
const FORMY: Forma[] = ['priamokutnyi', 'priamokutnyi2'];
const POVOROTY = [-50, -35, 25, 40, 150, 160, 200, 230];

/** Сторона навпроти вершини i — дві інші вершини в порядку запису. */
const navproty = (l: string[], i: number) => l.filter((_, j) => j !== i).join('');
const storonyVar = (l: string[]) => [navproty(l, 2), navproty(l, 0), navproty(l, 1)];

function druhyiKut(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [p, q, s] = r.peremishaty([0, 1, 2]); // p — прямий кут, q — відомий гострий, s — шуканий
  const a = r.krim(12, 78, [45]);
  return {
    pytannia: `У трикутнику ${l.join('')} ∠${l[p]} = 90°, ∠${l[q]} = ${a}°. Знайди ∠${l[s]}.`,
    vidpovid: 90 - a,
    odynytsi: '°',
    pidkazka: 'Гострі кути прямокутного трикутника разом дають 90°.',
    rozviazok: `Гострі кути ${l[q]} і ${l[s]} разом 90°, тож кут ${l[s]} дорівнює 90° − ${a}° = ${90 - a}°.`,
  };
}

function hipotenuza(r: Vypadok): TrenZavdannia {
  const bazovi = r.vybir(LITERY);
  const l = r.peremishaty(bazovi); // l[1] — вершина прямого кута на малюнку
  const varianty = storonyVar(bazovi);
  const vidp = varianty.find((v) => !v.includes(l[1]))!;
  if (r.shans()) {
    return {
      pytannia: 'Яка сторона трикутника — гіпотенуза?',
      malunok: kutyTrykutnyka({ forma: r.vybir(FORMY), litery: l, priamyi: true }),
      vidpovid: vidp,
      varianty,
      pidkazka: 'Знайди квадратик. Яка сторона лежить навпроти прямого кута?',
      rozviazok: `Прямий кут — при вершині ${l[1]}. Навпроти нього сторона ${vidp} — гіпотенуза.`,
    };
  }
  return {
    pytannia: `У трикутнику ${bazovi.join('')} кут ${l[1]} прямий. Яка сторона — гіпотенуза?`,
    vidpovid: vidp,
    varianty,
    pidkazka: `Гіпотенуза лежить навпроти прямого кута: на ній немає вершини ${l[1]}.`,
    rozviazok: `Катети виходять з вершини прямого кута ${l[1]}, а сторона ${vidp} лежить навпроти неї — це гіпотенуза.`,
  };
}

const OZNAKY = ['за двома катетами', 'за катетом і гострим кутом', 'за гіпотенузою і гострим кутом', 'за гіпотенузою і катетом', 'не можна стверджувати'];

function yakaOznaka(r: Vypadok): TrenZavdannia {
  // Вершина 1 — прямий кут; сторони 0 і 1 — катети, сторона 2 — гіпотенуза; гострі кути — при вершинах 0 і 2.
  const [l1, l2] = r.vybir(PARY);
  const typ = r.chyslo(0, 4);
  const rysky = [0, 0, 0];
  const dugy = [0, 0, 0];
  const st = (i: number) => (i === 2 ? `${l1[2]}${l1[0]}` : `${l1[i]}${l1[i + 1]}`);
  let rozviazok: string;
  if (typ === 0) {
    [rysky[0], rysky[1]] = [1, 2];
    rozviazok = `Позначено обидва катети: ${st(0)} і ${st(1)}. Це ознака за двома катетами.`;
  } else if (typ === 1) {
    const k = r.chyslo(0, 1);
    const v = r.vybir([0, 2]);
    [rysky[k], dugy[v]] = [1, 1];
    rozviazok = `Позначено катет ${st(k)} і гострий кут ${l1[v]}. Це ознака за катетом і гострим кутом.`;
  } else if (typ === 2) {
    const v = r.vybir([0, 2]);
    [rysky[2], dugy[v]] = [1, 1];
    rozviazok = `Позначено гіпотенузу ${st(2)} (навпроти прямого кута) і гострий кут ${l1[v]}. Це ознака за гіпотенузою і гострим кутом.`;
  } else if (typ === 3) {
    const k = r.chyslo(0, 1);
    [rysky[k], rysky[2]] = [1, 2];
    rozviazok = `Позначено катет ${st(k)} і гіпотенузу ${st(2)}. Це ознака за гіпотенузою і катетом.`;
  } else {
    [dugy[0], dugy[2]] = [1, 2];
    rozviazok = 'Позначено лише гострі кути, жодної сторони. Такі трикутники можуть мати різні розміри — ознаки немає.';
  }
  const vidp = OZNAKY[typ];
  const inshi = r.peremishaty(OZNAKY.filter((o) => o !== vidp)).slice(0, 3);
  return {
    pytannia: 'Чи рівні прямокутні трикутники на малюнку? За якою ознакою?',
    malunok: dvaTrykutnyky({ forma: r.vybir(FORMY), povorot: r.vybir(POVOROTY), dzerkalo: r.shans(), litery1: l1, litery2: l2, rysky, dugy }),
    vidpovid: vidp,
    varianty: OZNAKY.filter((o) => o === vidp || inshi.includes(o)),
    pidkazka: 'Квадратик — прямий кут. Навпроти нього гіпотенуза, при ньому — катети. Що з них позначено?',
    rozviazok,
  };
}

function vidpovidnyi(r: Vypadok): TrenZavdannia {
  // Прямокутні трикутники ABC і KMN з прямими кутами C і N: дві пари рівних елементів → знайти третій елемент.
  const [l1, l2] = r.vybir([
    [['A', 'B', 'C'], ['K', 'M', 'N']],
    [['D', 'E', 'F'], ['M', 'N', 'P']],
    [['A', 'B', 'C'], ['A₁', 'B₁', 'C₁']],
  ]);
  const [A, B, C] = l1;
  const [K, M, N] = l2;
  const typ = r.chyslo(0, 3);
  const umovy = [
    [`${A}${C} = ${K}${N}`, `${B}${C} = ${M}${N}`, 'за двома катетами'],
    [`${A}${C} = ${K}${N}`, `∠${A} = ∠${K}`, 'за катетом і гострим кутом'],
    [`${A}${B} = ${K}${M}`, `∠${B} = ∠${M}`, 'за гіпотенузою і гострим кутом'],
    [`${A}${B} = ${K}${M}`, `${B}${C} = ${M}${N}`, 'за гіпотенузою і катетом'],
  ][typ];
  const pochatok = `У прямокутних трикутниках ${l1.join('')} і ${l2.join('')} кути ${C} і ${N} прямі, ${umovy[0]}, ${umovy[1]}`;
  const vysnovok = `${umovy[2][0].toUpperCase()}${umovy[2].slice(1)} △${l1.join('')} = △${l2.join('')}.`;
  // Шукаємо елемент, якого немає в умові: кут (лише коли гострих кутів не дано) або сторону.
  if ((typ === 0 || typ === 3) && r.shans()) {
    const g = r.krim(15, 75, [45]);
    const [dano, shuk] = r.shans() ? [A, K] : [B, M];
    return {
      pytannia: `${pochatok}, ∠${dano} = ${g}°. Знайди ∠${shuk}.`,
      vidpovid: g,
      odynytsi: '°',
      pidkazka: 'Яка ознака рівності прямокутних трикутників тут працює?',
      rozviazok: `${vysnovok} Кут ${shuk} відповідає куту ${dano}: ${g}°.`,
    };
  }
  const x = r.chyslo(3, 20);
  const mozhlyvi: [string, string][] = [
    [[`${A}${B}`, `${K}${M}`]],
    [[`${B}${C}`, `${M}${N}`], [`${A}${B}`, `${K}${M}`]],
    [[`${A}${C}`, `${K}${N}`], [`${B}${C}`, `${M}${N}`]],
    [[`${A}${C}`, `${K}${N}`]],
  ][typ] as [string, string][];
  const [dano, shuk] = r.vybir(mozhlyvi);
  return {
    pytannia: `${pochatok}, ${dano} = ${x} см. Знайди ${shuk}.`,
    vidpovid: x,
    odynytsi: 'см',
    pidkazka: 'Яка ознака рівності прямокутних трикутників тут працює?',
    rozviazok: `${vysnovok} Сторона ${shuk} відповідає стороні ${dano}: ${x} см.`,
  };
}

const PARY_CHASTYN = [[1, 2], [1, 4], [1, 5], [2, 3], [1, 8], [4, 5], [1, 9], [7, 8], [2, 7], [4, 11], [7, 11], [1, 14]].filter((p) => 90 % (p[0] + p[1]) === 0);

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [m, n] = r.vybir(PARY_CHASTYN);
  const x = 90 / (m + n);
  const menshyi = r.shans();
  const vidp = (menshyi ? m : n) * x;
  return {
    pytannia: `Гострі кути прямокутного трикутника відносяться як ${m} : ${n}. Знайди ${menshyi ? 'менший' : 'більший'} з них.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Гострі кути разом 90°: ${m === 1 ? '' : m}x + ${n}x = 90.`,
    rozviazok: `${m === 1 ? '' : m}x + ${n}x = 90, ${m + n}x = 90, x = ${x}. ${menshyi ? 'Менший' : 'Більший'} кут дорівнює ${menshyi ? m : n} · ${x}° = ${vidp}°.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const x = r.krim(10, 40, [45]);
  const d = 90 - 2 * x;
  const bilshyi = r.shans();
  return {
    pytannia: `Один гострий кут прямокутного трикутника на ${d}° більший за інший. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: bilshyi ? x + d : x,
    odynytsi: '°',
    pidkazka: `Нехай менший кут x, тоді більший x + ${d}. Разом вони 90°.`,
    rozviazok: `x + x + ${d} = 90, 2x = ${90 - d}, x = ${x}. Кути ${x}° і ${x + d}°.`,
  };
}

function zovnishnii(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [p, q, s] = r.peremishaty([0, 1, 2]); // p — прямий кут, зовнішній — при q, шукаємо кут s
  const b = r.krim(12, 78, [45]); // кут s
  const e = 90 + b;
  return {
    pytannia: `У трикутнику ${l.join('')} ∠${l[p]} = 90°, зовнішній кут при вершині ${l[q]} дорівнює ${e}°. Знайди ∠${l[s]}.`,
    vidpovid: b,
    odynytsi: '°',
    pidkazka: `Зовнішній кут при ${l[q]} дорівнює сумі двох кутів, не суміжних з ним: ∠${l[p]} + ∠${l[s]}.`,
    rozviazok: `Зовнішній кут дорівнює ∠${l[p]} + ∠${l[s]}, тож кут ${l[s]} дорівнює ${e}° − 90° = ${b}°.`,
  };
}

function spilnyiKatet(r: Vypadok): TrenZavdannia {
  // AB = CB, BD ⊥ AC: △ABD = △CBD за гіпотенузою і катетом.
  const POCH = 'У трикутнику ABC AB = CB, BD — висота.';
  const ROZV = 'Трикутники ABD і CBD прямокутні, гіпотенузи AB і CB рівні, катет BD спільний — за гіпотенузою і катетом вони рівні.';
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const x = r.chyslo(3, 20);
    return {
      pytannia: `${POCH} AD = ${x} см. Знайди DC.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: 'Які прямокутні трикутники тут рівні? Яка в них спільна сторона?',
      rozviazok: `${ROZV} Тому DC = AD = ${x} см.`,
    };
  }
  if (typ === 1) {
    const g = r.chyslo(15, 70);
    return {
      pytannia: `${POCH} ∠ABD = ${g}°. Знайди ∠ABC.`,
      vidpovid: 2 * g,
      odynytsi: '°',
      pidkazka: 'Трикутники ABD і CBD рівні. Що можна сказати про кути ABD і CBD?',
      rozviazok: `${ROZV} Тому ∠CBD = ∠ABD, а кут ABC дорівнює 2 · ${g}° = ${2 * g}°.`,
    };
  }
  const x = r.chyslo(3, 20);
  return {
    pytannia: `${POCH} AC = ${2 * x} см. Знайди AD.`,
    vidpovid: x,
    odynytsi: 'см',
    pidkazka: 'Трикутники ABD і CBD рівні, тож AD = DC.',
    rozviazok: `${ROZV} Тому AD = DC, і AD дорівнює ${2 * x} : 2 = ${x} см.`,
  };
}

export default {
  rivni: ['гіпотенуза й гострі кути', 'ознаки рівності', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([druhyiKut, hipotenuza, hipotenuza])(r);
    if (riven === 2) return r.vybir([yakaOznaka, yakaOznaka, vidpovidnyi, druhyiKut])(r);
    return r.vybir([vidnoshennia, naBilshe, zovnishnii, spilnyiKatet, vidpovidnyi])(r);
  },
} satisfies Henerator;
