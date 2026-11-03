// Рівні фігури: рівні відрізки й кути (однакова міра, навіть у різних одиницях); відповідні сторони й кути
// рівних трикутників за порядком букв; у рівних фігур рівні площі й периметри, але не навпаки.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TRYKUTNYKY = [
  ['A', 'B', 'C'],
  ['K', 'M', 'N'],
  ['D', 'E', 'F'],
  ['P', 'R', 'S'],
];

function vidrizkyKuty(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const a = r.chyslo(2, 15);
    const rivni = r.shans();
    const mm = rivni ? a * 10 : a * 10 + r.vybir([-5, -2, 1, 3, 10]);
    return {
      pytannia: `Відрізок AB = ${a} см, відрізок CD = ${mm} мм. Чи рівні ці відрізки?`,
      vidpovid: rivni ? 'Так' : 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: 'Переведи в однакові одиниці: 1 см = 10 мм.',
      rozviazok: `${a} см = ${a * 10} мм${rivni ? ' — відрізки рівні' : `, а CD = ${mm} мм — не рівні`}.`,
    };
  }
  const a = r.chyslo(15, 170);
  const b = r.shans() ? a : Number(String(a).split('').reverse().join('')) || a + 10;
  const rivni = a === b;
  return {
    pytannia: `Один кут ${a}°, другий — ${b}°. Чи рівні ці кути?`,
    vidpovid: rivni ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Кути рівні, коли в них однакова градусна міра.',
    rozviazok: rivni ? 'Міри однакові — кути рівні.' : `${a}° ≠ ${b}° — кути не рівні.`,
  };
}

function vidpovidni(r: Vypadok): TrenZavdannia {
  const [i, j] = r.rizni(2, 0, TRYKUTNYKY.length - 1);
  const [P, Q] = [TRYKUTNYKY[i], TRYKUTNYKY[j]];
  const zapys = `△${P.join('')} = △${Q.join('')}`;
  if (r.shans()) {
    // Кут: вершина на тому самому місці.
    const k = r.chyslo(0, 2);
    const g = r.chyslo(20, 120);
    return {
      pytannia: `${zapys}, ∠${P[k]} = ${g}°. Знайди ∠${Q[k]}.`,
      vidpovid: g,
      odynytsi: '°',
      pidkazka: `${P[k]} стоїть на ${k + 1}-му місці. Яка буква на ${k + 1}-му місці в другій назві?`,
      rozviazok: `${P[k]} відповідає ${Q[k]}, тож ∠${Q[k]} = ∠${P[k]} = ${g}°.`,
    };
  }
  // Сторона: дві букви на тих самих місцях.
  const storony = [
    [0, 1],
    [1, 2],
    [0, 2],
  ];
  const dovzhyny = r.rizni(3, 3, 15);
  const s = r.chyslo(0, 2);
  const [m, n] = storony[s];
  return {
    pytannia: `${zapys}, ${P[0]}${P[1]} = ${dovzhyny[0]} см, ${P[1]}${P[2]} = ${dovzhyny[1]} см, ${P[0]}${P[2]} = ${dovzhyny[2]} см. Знайди ${Q[m]}${Q[n]}.`,
    vidpovid: dovzhyny[s],
    odynytsi: 'см',
    pidkazka: `${Q[m]}${Q[n]} стоїть на ${m + 1}-му і ${n + 1}-му місцях. Яка сторона першого трикутника на тих самих місцях?`,
    rozviazok: `${Q[m]}${Q[n]} відповідає ${P[m]}${P[n]}, тож ${Q[m]}${Q[n]} = ${dovzhyny[s]} см.`,
  };
}

function ploshchaPerymetr(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const a = r.chyslo(2, 12);
    const b = r.krim(2, 12, [a]);
    const ploshcha = r.shans();
    return {
      pytannia: `Два прямокутники рівні. Сторони першого — ${a} см і ${b} см. ${ploshcha ? 'Яка площа' : 'Який периметр'} другого?`,
      vidpovid: ploshcha ? a * b : 2 * (a + b),
      odynytsi: ploshcha ? 'см²' : 'см',
      pidkazka: 'Рівні фігури збігаються при накладанні — у них однакові сторони, отже й площа, і периметр.',
      rozviazok: ploshcha ? `${a} · ${b} = ${a * b} (см²)` : `(${a} + ${b}) · 2 = ${2 * (a + b)} (см)`,
    };
  }
  if (typ === 1) {
    const s = r.chyslo(3, 9);
    const [a, b] = r.vybir(
      [
        [1, s * s],
        [2, (s * s) / 2],
        [3, (s * s) / 3],
        [4, (s * s) / 4],
      ].filter(([x, y]) => Number.isInteger(y) && y !== s && x !== y),
    );
    return {
      pytannia: `Прямокутник ${b} × ${a} см і квадрат ${s} × ${s} см мають однакову площу ${s * s} см². Чи рівні ці фігури?`,
      vidpovid: 'Ні',
      varianty: ['Так', 'Ні'],
      pidkazka: 'Чи збігуться вони, якщо накласти одну на одну?',
      rozviazok: 'Площі однакові, але сторони різні — при накладанні фігури не збігаються. Рівні фігури мають рівні площі, але не навпаки.',
    };
  }
  const k = r.vybir([2, 3]);
  const mala = r.chyslo(2, 8);
  const velyka = mala * k;
  return {
    pytannia: `Квадрат з периметром ${4 * velyka} см розрізали на ${k * k} рівних квадратів. Знайди периметр одного маленького квадрата.`,
    vidpovid: 4 * mala,
    odynytsi: 'см',
    pidkazka: `Спершу сторона великого квадрата. Скільки маленьких укладається вздовж однієї сторони?`,
    rozviazok: `${4 * velyka} : 4 = ${velyka} (см) — сторона великого; ${velyka} : ${k} = ${mala} (см) — маленького; ${mala} · 4 = ${4 * mala} (см).`,
  };
}

export default {
  rivni: ['рівні відрізки й кути', 'відповідні сторони й кути', 'площа, периметр і розрізання'],
  zavdannia(r, riven) {
    if (riven === 1) return vidrizkyKuty(r);
    if (riven === 2) return r.shans(0.75) ? vidpovidni(r) : vidrizkyKuty(r);
    return r.vybir([ploshchaPerymetr, ploshchaPerymetr, vidpovidni])(r);
  },
} satisfies Henerator;
