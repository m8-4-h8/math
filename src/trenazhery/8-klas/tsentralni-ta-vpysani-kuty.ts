// Центральні та вписані кути: вписаний — половина центрального (за малюнком), дуга й кути; наслідки (кут на діаметр
// прямий, кути на ту саму дугу рівні, вершина на «своїй» дузі), твердження; трикутник AOB, дуги у відношенні,
// вписаний чотирикутник (кути з різних боків хорди), діаметр і відношення кутів.
import { nsd, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { kolo } from '../kolo.ts';

const TN = ['Так', 'Ні'];
/** Точки на колі, третя вершина й четверта точка — без збігів з центром O. */
const LITERY: [string, string, string, string][] = [
  ['A', 'B', 'C', 'D'],
  ['M', 'N', 'K', 'P'],
  ['P', 'Q', 'R', 'S'],
  ['E', 'F', 'K', 'L'],
];

/** Центральний кут AOB = c (A і B симетрично знизу) і вписаний ACB з вершиною вгорі. */
function malunokPolovyny(r: Vypadok, l: string[], c: number, pidpysO: string, pidpysC: string) {
  const [A, B, C] = l;
  const gC = r.chyslo(65, 115);
  return kolo({
    naKoli: { [A]: 270 - c / 2, [B]: 270 + c / 2, [C]: gC },
    vidrizky: [{ a: 'O', b: A }, { a: 'O', b: B }, { a: C, b: A }, { a: C, b: B }],
    kuty: [{ v: 'O', a: A, b: B, pidpys: pidpysO }, { v: C, a: A, b: B, pidpys: pidpysC, r: 30 }],
  });
}

/** Вписаний — половина центрального або центральний — подвоєний вписаний (за малюнком). */
function polovyna(r: Vypadok): TrenZavdannia {
  const l = r.vybir(LITERY);
  const [A, B, C] = l;
  const c = 2 * r.chyslo(20, 85);
  const v = c / 2;
  if (r.shans()) {
    return {
      pytannia: `${A}, ${B}, ${C} — точки на колі з центром O, ∠${A}O${B} = ${c}°. Знайди вписаний кут ${A}${C}${B}.`,
      malunok: malunokPolovyny(r, l, c, `${c}°`, '?'),
      vidpovid: v,
      odynytsi: '°',
      pidkazka: 'Вписаний кут дорівнює половині центрального, що спирається на ту саму дугу.',
      rozviazok: `∠${A}${C}${B} = ${c}° : 2 = ${v}°.`,
    };
  }
  return {
    pytannia: `${A}, ${B}, ${C} — точки на колі з центром O, вписаний кут ${A}${C}${B} = ${v}°. Знайди центральний кут ${A}O${B}.`,
    malunok: malunokPolovyny(r, l, c, '?', `${v}°`),
    vidpovid: c,
    odynytsi: '°',
    pidkazka: 'Центральний кут удвічі більший за вписаний, що спирається на ту саму дугу.',
    rozviazok: `∠${A}O${B} = 2 · ${v}° = ${c}°.`,
  };
}

/** Дуга й кути на неї: центральний дорівнює дузі, вписаний — половина. */
function duha(r: Vypadok): TrenZavdannia {
  const [A, B] = r.vybir(LITERY);
  const d = 2 * r.chyslo(15, 85);
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    const varianty = [d / 2, d, 2 * d].map((x) => `${x}°`);
    return {
      pytannia: `Дуга ${A}${B} дорівнює ${d}°. Чому дорівнює вписаний кут, що спирається на цю дугу?`,
      vidpovid: `${d / 2}°`,
      varianty,
      pidkazka: 'Центральний кут дорівнює дузі, а вписаний — половина центрального.',
      rozviazok: `${d}° : 2 = ${d / 2}°. ${d}° — це центральний кут, а ${2 * d}° — подвоєна дуга.`,
    };
  }
  if (typ === 2) {
    return {
      pytannia: `Вписаний кут спирається на дугу ${A}${B} і дорівнює ${d / 2}°. Знайди градусну міру дуги ${A}${B}.`,
      vidpovid: d,
      odynytsi: '°',
      pidkazka: 'Вписаний кут — половина дуги, на яку він спирається.',
      rozviazok: `Дуга ${A}${B} = 2 · ${d / 2}° = ${d}°.`,
    };
  }
  return {
    pytannia: `Центральний кут ${A}O${B} дорівнює ${d}°. Знайди більшу дугу ${A}${B}.`,
    vidpovid: 360 - d,
    odynytsi: '°',
    pidkazka: 'Менша дуга дорівнює центральному куту, а разом дві дуги — усе коло, 360°.',
    rozviazok: `Менша дуга — ${d}°, більша — 360° − ${d}° = ${360 - d}°.`,
  };
}

/** Кут на діаметр прямий: AB — діаметр, знайди інший гострий кут трикутника ABC. */
function diametr(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const a = r.krim(15, 75, [45]);
  const gC = r.chyslo(40, 140);
  return {
    pytannia: `${A}${B} — діаметр кола, ${C} — точка на колі, ∠${C}${A}${B} = ${a}°. Знайди ∠${C}${B}${A}.`,
    malunok: kolo({
      naKoli: { [A]: 180, [B]: 0, [C]: gC },
      vidrizky: [{ a: A, b: B }, { a: C, b: A }, { a: C, b: B }],
      kuty: [{ v: A, a: B, b: C, pidpys: `${a}°` }, { v: B, a: C, b: A, pidpys: '?' }],
    }),
    vidpovid: 90 - a,
    odynytsi: '°',
    pidkazka: `На яку дугу спирається кут ${C}? Яка вона, якщо ${A}${B} — діаметр?`,
    rozviazok: `∠${A}${C}${B} = 90°, бо спирається на діаметр (півколо 180°). Тож ∠${C}${B}${A} = 180° − 90° − ${a}° = ${90 - a}°.`,
  };
}

/** Вписані кути на ту саму дугу рівні; вершина на «своїй» дузі — спирається на іншу. */
function tsiaSamaDuha(r: Vypadok): TrenZavdannia {
  const [A, B, C, D] = r.vybir(LITERY);
  if (r.shans()) {
    const a = r.chyslo(20, 80);
    return {
      pytannia: `Точки ${C} і ${D} лежать на колі по один бік від хорди ${A}${B}, ∠${A}${C}${B} = ${a}°. Знайди ∠${A}${D}${B}.`,
      vidpovid: a,
      odynytsi: '°',
      pidkazka: 'Обидва кути спираються на ту саму дугу.',
      rozviazok: `Вписані кути, що спираються на ту саму дугу, рівні: ∠${A}${D}${B} = ${a}°.`,
    };
  }
  const d = 2 * r.chyslo(30, 80);
  return {
    pytannia: `Дуга ${A}${B} дорівнює ${d}°, точка ${D} лежить на цій дузі. Знайди ∠${A}${D}${B}.`,
    // Точка D — ближче до B, а підпис дуги — ближче до A, щоб не налягали.
    malunok: kolo({
      naKoli: { [A]: 270 - d / 2, [B]: 270 + d / 2, [D]: 270 + d / 4 },
      vidrizky: [{ a: D, b: A }, { a: D, b: B }],
      kuty: [{ v: D, a: A, b: B, pidpys: '?', r: 18 }],
      dugy: [{ a: A, b: B, pidpys: `${d}°`, t: 0.25 }],
    }),
    vidpovid: (360 - d) / 2,
    odynytsi: '°',
    pidkazka: `Вершина ${D} лежить на дузі ${d}°. На яку дугу тоді спирається кут — ту, що між його сторонами?`,
    rozviazok: `Кут ${A}${D}${B} спирається на іншу дугу: 360° − ${d}° = ${360 - d}°. Тож ∠${A}${D}${B} = ${360 - d}° : 2 = ${(360 - d) / 2}°.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Вписаний кут дорівнює половині центрального кута, що спирається на ту саму дугу.', true, 'Це теорема про вписаний кут.'],
    ['Центральний кут дорівнює дузі, на яку він спирається.', true, 'Так означають градусну міру дуги.'],
    ['Вписані кути, що спираються на ту саму дугу, рівні.', true, 'Кожен з них — половина тієї самої дуги.'],
    ['Вписаний кут, що спирається на діаметр, — прямий.', true, 'Він дорівнює половині півкола: 180° : 2 = 90°.'],
    ['Вписаний кут дорівнює центральному, що спирається на ту саму дугу.', false, 'Вписаний — удвічі менший.'],
    ['Вписаний кут, що спирається на діаметр, дорівнює 180°.', false, '180° — це дуга, а кут — її половина, 90°.'],
    ['Кут з вершиною в будь-якій точці всередині кола — вписаний.', false, 'Вершина вписаного кута лежить на колі.'],
    ['Центральний кут удвічі менший за вписаний на ту саму дугу.', false, 'Навпаки: центральний удвічі більший.'],
    ['Сума двох дуг, на які дві точки ділять коло, дорівнює 180°.', false, 'Разом вони — усе коло, 360°.'],
    ['Вписаний кут може бути тупим.', true, 'Якщо він спирається на дугу, більшу за півколо.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Центральний кут — вершина в центрі, дорівнює дузі; вписаний — вершина на колі, половина дуги.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Трикутник AOB рівнобедрений: від вписаного кута до кута OAB і назад. */
function trykutnykOAB(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  const a = r.chyslo(15, 80);
  const c = 2 * a;
  const b = 90 - a; // ∠OAB = (180° − 2a) : 2
  if (r.shans()) {
    return {
      pytannia: `${A}, ${B}, ${C} — точки на колі з центром O, вписаний кут ${A}${C}${B} = ${a}°. Знайди ∠O${A}${B}.`,
      vidpovid: b,
      odynytsi: '°',
      pidkazka: `Спершу знайди центральний кут ${A}O${B}. Який трикутник ${A}O${B}?`,
      rozviazok: `∠${A}O${B} = 2 · ${a}° = ${c}°. O${A} = O${B} (радіуси), тож ∠O${A}${B} = (180° − ${c}°) : 2 = ${b}°.`,
    };
  }
  return {
    pytannia: `${A}, ${B}, ${C} — точки на колі з центром O, ∠O${A}${B} = ${b}°, а точка ${C} і центр O лежать по один бік від ${A}${B}. Знайди вписаний кут ${A}${C}${B}.`,
    vidpovid: a,
    odynytsi: '°',
    pidkazka: `Трикутник ${A}O${B} рівнобедрений — знайди кут ${A}O${B}, а потім візьми половину.`,
    rozviazok: `∠${A}O${B} = 180° − 2 · ${b}° = ${c}°, а вписаний ∠${A}${C}${B} = ${c}° : 2 = ${a}°.`,
  };
}

/** Вершини трикутника ділять коло на дуги p : q : s — знайди кут трикутника. */
function vidnoshennia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q, s] = [r.chyslo(1, 7), r.chyslo(1, 7), r.chyslo(1, 7)];
    const suma = p + q + s;
    if (360 % suma || (p === q && q === s) || nsd(nsd(p, q), s) > 1) continue;
    const x = 360 / suma;
    const kuty = [p, q, s].map((t) => (t * x) / 2);
    if (kuty.some((k) => !Number.isInteger(k))) continue;
    const typ = r.chyslo(1, 2);
    const vidp = typ === 1 ? Math.max(...kuty) : Math.min(...kuty);
    return {
      pytannia: `Вершини трикутника ділять описане коло на три дуги, що відносяться як ${p} : ${q} : ${s}. Знайди ${typ === 1 ? 'найбільший' : 'найменший'} кут трикутника.`,
      vidpovid: vidp,
      odynytsi: '°',
      pidkazka: `Знайди дуги: ${p}x + ${q}x + ${s}x = 360°. Кожен кут трикутника — вписаний, він дорівнює половині дуги навпроти.`,
      rozviazok: `${suma}x = 360°, x = ${x}°. Дуги ${p * x}°, ${q * x}°, ${s * x}°, кути — їх половини: ${kuty.join('°, ')}°. Перевірка: ${kuty.join(' + ')} = 180.`,
    };
  }
}

/** Точки C і D по різні боки від хорди AB: вписані кути разом 180°. */
function riznoBich(r: Vypadok): TrenZavdannia {
  const [A, B, C, D] = r.vybir(LITERY);
  const a = r.krim(25, 155, [90]);
  return {
    pytannia: `Точки ${C} і ${D} лежать на колі по різні боки від хорди ${A}${B}, ∠${A}${C}${B} = ${a}°. Знайди ∠${A}${D}${B}.`,
    vidpovid: 180 - a,
    odynytsi: '°',
    pidkazka: `Кути спираються на дві різні дуги ${A}${B}, а разом ці дуги — усе коло, 360°.`,
    rozviazok: `Кут ${C} спирається на дугу ${2 * a}°, тож друга дуга — 360° − ${2 * a}° = ${360 - 2 * a}°, а ∠${A}${D}${B} = ${360 - 2 * a}° : 2 = ${180 - a}°.`,
  };
}

/** AB — діаметр, гострі кути трикутника ABC відносяться як p : q. */
function diametrVidnoshennia(r: Vypadok): TrenZavdannia {
  const [A, B, C] = r.vybir(LITERY);
  for (;;) {
    const [p, q] = [r.chyslo(1, 8), r.chyslo(1, 8)];
    if (p === q || 90 % (p + q) || nsd(p, q) > 1) continue;
    const x = 90 / (p + q);
    const bilshyi = r.shans();
    return {
      pytannia: `${A}${B} — діаметр кола, ${C} — точка на колі, ∠${C}${A}${B} : ∠${C}${B}${A} = ${p} : ${q}. Знайди ${bilshyi ? 'більший' : 'менший'} з цих кутів.`,
      vidpovid: (bilshyi ? Math.max(p, q) : Math.min(p, q)) * x,
      odynytsi: '°',
      pidkazka: `Кут ${C} спирається на діаметр. Скільки тоді разом два інші кути?`,
      rozviazok: `∠${A}${C}${B} = 90°, тож ${p}x + ${q}x = 90°, x = ${x}°. Кути ${p * x}° і ${q * x}°.`,
    };
  }
}

export default {
  rivni: ['центральний і вписаний', 'наслідки й підступи', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([polovyna, polovyna, duha])(r);
    if (riven === 2) return r.vybir([diametr, tsiaSamaDuha, tsiaSamaDuha, tverdzhennia])(r);
    return r.vybir([trykutnykOAB, vidnoshennia, riznoBich, diametrVidnoshennia])(r);
  },
} satisfies Henerator;
