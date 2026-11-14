// Трапеція: кути при бічній стороні (разом 180°), периметр рівнобічної, кути рівнобічної (рівні при основі),
// твердження (паралелограм — не трапеція), діагоналі рівнобічної; висота й відрізок AH = (AD − BC) : 2,
// кут 60° і 45°, діагональ-бісектриса, переріз насипу.
import { type Henerator, type Vypadok, type TrenZavdannia, des } from '../dopomoha.ts';
import { chotyrykutnyk } from '../chotyrykutnyky.ts';

const TN = ['Так', 'Ні'];
const LITERY: [string, string, string, string][] = [
  ['A', 'B', 'C', 'D'],
  ['K', 'L', 'M', 'N'],
  ['M', 'N', 'P', 'K'],
  ['P', 'Q', 'R', 'S'],
];
const nazva = (l: string[]) => l.join('');
const osnovy = (l: string[]) => `з основами ${l[0]}${l[3]} і ${l[1]}${l[2]}`;
/** На малюнках кути при більшій основі (вершини 0 і 3) гострі, при меншій (1 і 2) — тупі. */
const kutDlia = (r: Vypadok, i: number) => (i === 0 || i === 3 ? r.krim(40, 85, [60, 45]) : r.krim(95, 140, [120, 135]));

/** Кути при бічній стороні: ∠A + ∠B = 180°, ∠C + ∠D = 180°. */
function kutBichnoi(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [i, j] = r.vybir([[0, 1], [1, 0], [2, 3], [3, 2]] as const);
  const g = kutDlia(r, i);
  const kuty: (string | undefined)[] = [];
  kuty[i] = `${g}°`;
  kuty[j] = '?';
  const bichna = i + j === 1 ? `${l[0]}${l[1]}` : `${l[2]}${l[3]}`;
  return {
    pytannia: `${nazva(l)} — трапеція ${osnovy(l)}, ∠${l[i]} = ${g}°. Знайди ∠${l[j]}.`,
    malunok: chotyrykutnyk({ forma: 'trapetsiia', bukvy: l, strilky: [0, 1, 0, 1], kuty }),
    vidpovid: 180 - g,
    odynytsi: '°',
    pidkazka: `Кути ${l[i]} і ${l[j]} прилеглі до бічної сторони ${bichna} — це односторонні кути при паралельних основах.`,
    rozviazok: `Кути при бічній стороні разом дають 180°: 180° − ${g}° = ${180 - g}°.`,
  };
}

/** Периметр рівнобічної трапеції або її бічна сторона за периметром. */
function perymetr(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  for (;;) {
    const a = r.chyslo(2, 15);
    const b = a + r.chyslo(2, 12);
    const c = r.chyslo(3, 15);
    if (2 * c <= b - a) continue;
    const P = a + b + 2 * c;
    if (r.shans()) {
      return {
        pytannia: `Основи рівнобічної трапеції ${nazva(l)} дорівнюють ${a} см і ${b} см, бічна сторона — ${c} см. Знайди периметр.`,
        vidpovid: P,
        odynytsi: 'см',
        pidkazka: 'У рівнобічної трапеції дві бічні сторони однакові.',
        rozviazok: `P = ${a} + ${b} + ${c} + ${c} = ${P} см.`,
      };
    }
    return {
      pytannia: `Периметр рівнобічної трапеції ${nazva(l)} ${P} см, основи ${a} см і ${b} см. Знайди бічну сторону.`,
      vidpovid: c,
      odynytsi: 'см',
      pidkazka: 'Відніми основи від периметра — лишаться дві рівні бічні сторони.',
      rozviazok: `Дві бічні сторони разом: ${P} − ${a} − ${b} = ${2 * c} см, одна — ${2 * c} : 2 = ${c} см.`,
    };
  }
}

/** Рівнобічна: кути при основі рівні, при бічній стороні — разом 180°. */
function rivnobichnaKuty(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [i, j] = r.rizni(2, 0, 3);
  const g = kutDlia(r, i);
  // Пари при одній основі: 0 і 3 (більша), 1 і 2 (менша).
  const tsamaOsnova = i + j === 3;
  const vidp = tsamaOsnova ? g : 180 - g;
  const kuty: (string | undefined)[] = [];
  kuty[i] = `${g}°`;
  kuty[j] = '?';
  let poiasn: string;
  if (tsamaOsnova) poiasn = `Кути при основі рівнобічної трапеції рівні: ∠${l[j]} = ∠${l[i]} = ${g}°.`;
  else if (Math.abs(i - j) === 1 || i + j === 3) poiasn = `Кути ${l[i]} і ${l[j]} прилеглі до бічної сторони: 180° − ${g}° = ${vidp}°.`;
  else {
    // Протилежні кути (0 і 2 або 1 і 3): спершу сусідній кут при тій самій основі.
    const k = i === 0 ? 3 : i === 3 ? 0 : i === 1 ? 2 : 1;
    poiasn = `∠${l[k]} = ∠${l[i]} = ${g}° (кути при основі рівні), а ∠${l[j]} прилеглий до ∠${l[k]} при бічній стороні: 180° − ${g}° = ${vidp}°.`;
  }
  return {
    pytannia: `${nazva(l)} — рівнобічна трапеція ${osnovy(l)}, ∠${l[i]} = ${g}°. Знайди ∠${l[j]}.`,
    malunok: chotyrykutnyk({ forma: 'rivnobichna', bukvy: l, strilky: [0, 1, 0, 1], rysky: [1, 0, 1, 0], kuty }),
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: 'Кути при одній основі рівнобічної трапеції рівні, а кути при бічній стороні разом дають 180°.',
    rozviazok: poiasn,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Паралелограм — це трапеція.', false, 'У трапеції паралельна лише одна пара сторін, а в паралелограма — обидві.'],
    ['У трапеції сума кутів, прилеглих до бічної сторони, дорівнює 180°.', true, 'Це односторонні кути при паралельних основах.'],
    ['У будь-якій трапеції кути при більшій основі рівні.', false, 'Це властивість лише рівнобічної трапеції.'],
    ['Діагоналі рівнобічної трапеції рівні.', true, 'Рівнобічна трапеція симетрична, тож її діагоналі однакові.'],
    ['Діагоналі будь-якої трапеції рівні.', false, 'У довільної трапеції діагоналі можуть бути різними.'],
    ['У трапеції може бути рівно три прямі кути.', false, 'Якщо кути A і B прямі, то ∠C + ∠D = 180°, і прямий ще один кут означав би прямокутник.'],
    ['У прямокутної трапеції два прямі кути.', true, 'Бічна сторона перпендикулярна до обох основ — при ній два прямі кути.'],
    ['Основи трапеції паралельні.', true, 'Основи — це і є паралельні сторони.'],
    ['Бічні сторони трапеції паралельні.', false, 'Якби й бічні сторони були паралельні, вийшов би паралелограм.'],
    ['У рівнобічній трапеції кути при меншій основі тупі.', true, 'Кути при більшій основі гострі, а кожен кут при меншій доповнює гострий до 180°.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Трапеція: дві сторони паралельні, дві інші — ні. Рівнобічна — бічні сторони рівні.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Діагоналі рівнобічної трапеції рівні (з зайвим числом). */
function diahonali(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const d = r.chyslo(6, 30);
  const c = r.krim(3, Math.min(d - 1, 20), [d]);
  return {
    pytannia: `${nazva(l)} — рівнобічна трапеція ${osnovy(l)}, ${l[0]}${l[2]} = ${d} см, ${l[0]}${l[1]} = ${c} см. Знайди ${l[1]}${l[3]}.`,
    malunok: chotyrykutnyk({ forma: 'rivnobichna', bukvy: l, strilky: [0, 1, 0, 1], rysky: [1, 0, 1, 0], diahonali: [[0, 2], [1, 3]], shtrykh: false }),
    vidpovid: d,
    odynytsi: 'см',
    pidkazka: `${l[0]}${l[2]} і ${l[1]}${l[3]} — діагоналі рівнобічної трапеції.`,
    rozviazok: `Діагоналі рівнобічної трапеції рівні: ${l[1]}${l[3]} = ${l[0]}${l[2]} = ${d} см. Бічна сторона тут не потрібна.`,
  };
}

/** Висота з вершини меншої основи: AH = (AD − BC) : 2 і навпаки. */
function proektsiia(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(2, 16);
  const x = r.chyslo(1, 9);
  const b = a + 2 * x;
  const [A, B, C, D] = l;
  const umova = `${nazva(l)} — рівнобічна трапеція ${osnovy(l)}, ${B}H — висота.`;
  // Друга основа висоти — K, але не тоді, коли K уже вершина трапеції.
  const E = l.includes('K') ? 'E' : 'K';
  const pidkazka = `Проведи ще висоту ${C}${E}: H${E} = ${B}${C}, а ${A}H = ${E}${D}.`;
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    return {
      pytannia: `${umova} ${B}${C} = ${a} см, ${A}${D} = ${b} см. Знайди ${A}H.`,
      malunok: chotyrykutnyk({ forma: 'rivnobichna', bukvy: l, strilky: [0, 1, 0, 1], rysky: [1, 0, 1, 0], vidrizok: [1, 3, 0.71875, 'H', true], storony: [undefined, `${a}`, undefined, `${b}`] }),
      vidpovid: x,
      odynytsi: 'см',
      pidkazka,
      rozviazok: `${A}H = (${b} − ${a}) : 2 = ${x} см. Перевірка: ${x} + ${a} + ${x} = ${b}.`,
    };
  }
  if (typ === 2) {
    return {
      pytannia: `${umova} ${B}${C} = ${a} см, ${A}H = ${x} см. Знайди ${A}${D}.`,
      vidpovid: b,
      odynytsi: 'см',
      pidkazka,
      rozviazok: `${A}${D} = ${A}H + H${E} + ${E}${D} = ${x} + ${a} + ${x} = ${b} см.`,
    };
  }
  return {
    pytannia: `${umova} ${A}${D} = ${b} см, ${A}H = ${x} см. Знайди ${B}${C}.`,
    vidpovid: a,
    odynytsi: 'см',
    pidkazka,
    rozviazok: `${B}${C} = H${E} = ${b} − ${x} − ${x} = ${a} см.`,
  };
}

/** Рівнобічна трапеція з гострим кутом 60°: бічна сторона = AD − BC (катет проти 30° — половина гіпотенузи). */
function kut60(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(2, 15);
  const x = r.chyslo(1, 8);
  const b = a + 2 * x;
  const [A, B, C, D] = l;
  const bichna = 2 * x;
  const pochatok = `${nazva(l)} — рівнобічна трапеція ${osnovy(l)}, ∠${A} = 60°, ${B}${C} = ${a} см, ${A}${D} = ${b} см.`;
  const pidkazka = `Проведи висоту ${B}H: ${A}H = (${A}${D} − ${B}${C}) : 2, а в трикутнику ${A}${B}H кут ${B} дорівнює 30°.`;
  if (r.shans()) {
    return {
      pytannia: `${pochatok} Знайди бічну сторону.`,
      vidpovid: bichna,
      odynytsi: 'см',
      pidkazka,
      rozviazok: `${A}H = (${b} − ${a}) : 2 = ${x} см. Катет ${A}H лежить проти кута 30°, тож він — половина гіпотенузи ${A}${B}: ${A}${B} = 2 · ${x} = ${bichna} см.`,
    };
  }
  return {
    pytannia: `${pochatok} Знайди периметр трапеції.`,
    vidpovid: a + b + 2 * bichna,
    odynytsi: 'см',
    pidkazka,
    rozviazok: `${A}H = (${b} − ${a}) : 2 = ${x} см, бічна сторона 2 · ${x} = ${bichna} см (катет проти 30°). P = ${a} + ${b} + ${bichna} + ${bichna} = ${a + b + 2 * bichna} см.`,
  };
}

/** Гострий кут 45°: висота дорівнює AH. */
function kut45(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const a = r.chyslo(2, 15);
  const x = r.chyslo(1, 9);
  const b = a + 2 * x;
  const [A, B, C, D] = l;
  return {
    pytannia: `${nazva(l)} — рівнобічна трапеція ${osnovy(l)}, ∠${A} = 45°, ${B}${C} = ${a} см, ${A}${D} = ${b} см. Знайди висоту ${B}H.`,
    vidpovid: x,
    odynytsi: 'см',
    pidkazka: `Трикутник ${A}${B}H прямокутний з кутом 45°. Який він?`,
    rozviazok: `${A}H = (${b} − ${a}) : 2 = ${x} см. У трикутнику ${A}${B}H кути ${A} і ${B} по 45°, тож він рівнобедрений: ${B}H = ${A}H = ${x} см.`,
  };
}

/** Діагональ AC — бісектриса кута A: трикутник ABC рівнобедрений, AB = BC. */
function bisektrysa(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [A, B, C, D] = l;
  const x = r.chyslo(3, 15);
  const pochatok = `У трапеції ${nazva(l)} ${osnovy(l)} діагональ ${A}${C} — бісектриса кута ${A}, ${B}${C} = ${x} см.`;
  const pidkazka = `∠${B}${C}${A} = ∠${C}${A}${D} (різносторонні кути при ${A}${D} ∥ ${B}${C}). Який тоді трикутник ${A}${B}${C}?`;
  if (r.shans()) {
    return {
      pytannia: `${pochatok} Знайди ${A}${B}.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka,
      rozviazok: `∠${B}${A}${C} = ∠${C}${A}${D} (бісектриса) = ∠${B}${C}${A} (різносторонні). Трикутник ${A}${B}${C} рівнобедрений: ${A}${B} = ${B}${C} = ${x} см.`,
    };
  }
  // Трапеція існує, коли з бічних сторін і різниці основ складається трикутник.
  let cd: number;
  let rizn: number;
  do {
    cd = r.chyslo(3, 15);
    rizn = r.chyslo(3, 12);
  } while (!(Math.abs(x - cd) < rizn && rizn < x + cd));
  const ad = x + rizn;
  return {
    pytannia: `${pochatok} ${C}${D} = ${cd} см, ${A}${D} = ${ad} см. Знайди периметр трапеції.`,
    vidpovid: 2 * x + cd + ad,
    odynytsi: 'см',
    pidkazka,
    rozviazok: `Трикутник ${A}${B}${C} рівнобедрений (кути при ${A}${C} рівні), тож ${A}${B} = ${B}${C} = ${x} см. P = ${x} + ${x} + ${cd} + ${ad} = ${2 * x + cd + ad} см.`,
  };
}

/** Переріз насипу — рівнобічна трапеція: на скільки укіс виступає за верхню основу. */
function nasyp(r: Vypadok): TrenZavdannia {
  const verkh = r.chyslo(6, 16);
  const vystup = r.chyslo(2, 9);
  const nyz = verkh + 2 * vystup;
  if (r.shans()) {
    return {
      pytannia: `Переріз насипу під дорогою — рівнобічна трапеція. Зверху ширина насипу ${verkh} м, знизу ${nyz} м. На скільки метрів кожен укіс виступає вбік від верхнього краю?`,
      vidpovid: vystup,
      odynytsi: 'м',
      pidkazka: 'Нижня основа = верхня + два однакові виступи.',
      rozviazok: `(${nyz} − ${verkh}) : 2 = ${vystup} м.`,
    };
  }
  const pol = r.shans();
  return {
    pytannia: `Переріз насипу — рівнобічна трапеція. Зверху ширина ${verkh} м, а кожен укіс виступає вбік на ${pol ? des(vystup * 10 + 5, 1) : vystup} м. Яка ширина насипу знизу?`,
    vidpovid: pol ? des(nyz * 10 + 10, 1) : nyz,
    odynytsi: 'м',
    pidkazka: 'Нижня основа = верхня + два однакові виступи.',
    rozviazok: pol
      ? `${verkh} + 2 · ${des(vystup * 10 + 5, 1)} = ${des(nyz * 10 + 10, 1)} м.`
      : `${verkh} + 2 · ${vystup} = ${nyz} м.`,
  };
}

export default {
  rivni: ['кути й периметр', 'рівнобічна трапеція', 'висота й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kutBichnoi, kutBichnoi, perymetr])(r);
    if (riven === 2) return r.vybir([rivnobichnaKuty, rivnobichnaKuty, tverdzhennia, diahonali])(r);
    return r.vybir([proektsiia, kut60, kut45, bisektrysa, nasyp])(r);
  },
} satisfies Henerator;
