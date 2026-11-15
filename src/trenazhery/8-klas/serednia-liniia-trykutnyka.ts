// Середня лінія трикутника: половина паралельної сторони (за малюнком), підступ «половина якої сторони»,
// твердження (середня лінія чи медіана), периметри (трикутник із середніх ліній, «відрізаний» трикутник), задачі.
import { type Henerator, type Vypadok, type TrenZavdannia, des } from '../dopomoha.ts';
import { seredniaLiniia, type Storona } from '../serednia.ts';

const TN = ['Так', 'Ні'];
const BUKVY: [string, string, string][] = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['P', 'Q', 'R'],
  ['R', 'S', 'T'],
];
const STORONY: Storona[] = ['AB', 'BC', 'AC'];
/** Середня лінія, паралельна стороні s, сполучає середини двох інших сторін. */
const INSHI: Record<Storona, [Storona, Storona]> = { AC: ['AB', 'BC'], AB: ['BC', 'AC'], BC: ['AB', 'AC'] };
const SEREDYNY: Record<Storona, string> = { AB: 'M', BC: 'N', AC: 'K' };

function imena(b: [string, string, string]) {
  const [A, B, C] = b;
  const storona = (s: Storona) => ({ AB: A + B, BC: B + C, AC: A + C })[s];
  const liniia = (s: Storona) => INSHI[s].map((x) => SEREDYNY[x]).join('');
  const umova = (s: Storona) => {
    const [x, y] = INSHI[s];
    return `${SEREDYNY[x]} і ${SEREDYNY[y]} — середини сторін ${storona(x)} і ${storona(y)} трикутника ${A}${B}${C}`;
  };
  return { trykutnyk: A + B + C, storona, liniia, umova };
}

/** Половина паралельної сторони або навпаки — за малюнком. */
function polovyna(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const s = r.vybir(STORONY);
  const n = imena(b);
  const m = r.chyslo(2, 20);
  const forma = r.vybir(['hostrokutnyi', 'hostrokutnyi2', 'tupokutnyi', 'priamokutnyi'] as const);
  if (r.shans()) {
    return {
      pytannia: `${n.umova(s)}, ${n.storona(s)} = ${2 * m} см. Знайди ${n.liniia(s)}.`,
      malunok: seredniaLiniia({ bukvy: b, linii: [s], forma, pidpysyStorin: { [s]: `${2 * m} см` }, pidpysyLinii: { [s]: '?' } }),
      vidpovid: m,
      odynytsi: 'см',
      pidkazka: `${n.liniia(s)} — середня лінія, паралельна ${n.storona(s)}.`,
      rozviazok: `Середня лінія дорівнює половині паралельної сторони: ${2 * m} : 2 = ${m} см.`,
    };
  }
  return {
    pytannia: `${n.umova(s)}, ${n.liniia(s)} = ${m} см. Знайди ${n.storona(s)}.`,
    malunok: seredniaLiniia({ bukvy: b, linii: [s], forma, pidpysyStorin: { [s]: '?' }, pidpysyLinii: { [s]: `${m} см` } }),
    vidpovid: 2 * m,
    odynytsi: 'см',
    pidkazka: `${n.liniia(s)} — половина сторони ${n.storona(s)}. Множити чи ділити?`,
    rozviazok: `${n.storona(s)} удвічі довша за середню лінію: 2 · ${m} = ${2 * m} см.`,
  };
}

/** Відомі всі три сторони — середня лінія дорівнює половині тієї, якій паралельна. */
function yakoiStorony(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const n = imena(b);
  for (;;) {
    const [x, y, z] = r.rizni(3, 3, 18).map((v) => 2 * v);
    if (x + y <= z || x + z <= y || y + z <= x) continue;
    const dovzh: Record<Storona, number> = { AB: x, BC: y, AC: z };
    const s = r.vybir(STORONY);
    return {
      pytannia: `У трикутнику ${n.trykutnyk}: ${STORONY.map((t) => `${n.storona(t)} = ${dovzh[t]} см`).join(', ')}. ${INSHI[s]
        .map((t) => SEREDYNY[t])
        .join(' і ')} — середини сторін ${INSHI[s].map(n.storona).join(' і ')}. Знайди ${n.liniia(s)}.`,
      malunok: seredniaLiniia({ bukvy: b, linii: [s], pidpysyLinii: { [s]: '?' } }),
      vidpovid: dovzh[s] / 2,
      odynytsi: 'см',
      pidkazka: `Шукай сторону, на якій немає кінців відрізка ${n.liniia(s)}.`,
      rozviazok: `${n.liniia(s)} паралельна ${n.storona(s)}, тож ${n.liniia(s)} — половина ${n.storona(s)}: ${dovzh[s]} : 2 = ${dovzh[s] / 2} см. Половини інших сторін тут ні до чого.`,
    };
  }
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Середня лінія трикутника сполучає середини двох його сторін.', true, 'Це означення середньої лінії.'],
    ['Відрізок, що сполучає вершину трикутника із серединою протилежної сторони, — середня лінія.', false, 'Це медіана. Середня лінія сполучає середини двох сторін.'],
    ['Середня лінія трикутника паралельна одній з його сторін.', true, 'Вона паралельна третій стороні — тій, на якій немає її кінців.'],
    ['Середня лінія дорівнює половині кожної зі сторін, середини яких вона сполучає.', false, 'Вона дорівнює половині третьої сторони, якій паралельна.'],
    ['У трикутника три середні лінії.', true, 'Кожна пара сторін дає одну середню лінію: пар три.'],
    ['Три середні лінії ділять трикутник на чотири рівні трикутники.', true, 'Сторони кожного з чотирьох трикутників — половини сторін даного.'],
    ['Периметр трикутника, утвореного середніми лініями, дорівнює периметру даного трикутника.', false, 'Кожна його сторона вдвічі менша, тож і периметр удвічі менший.'],
    ['Середня лінія може бути довшою за сторону, якій вона паралельна.', false, 'Вона завжди вдвічі коротша за цю сторону.'],
    ['Пряма, що проходить через середину сторони трикутника паралельно другій стороні, містить середню лінію.', true, 'За теоремою Фалеса вона проходить через середину третьої сторони.'],
    ['Будь-який відрізок з кінцями на двох сторонах трикутника, паралельний третій стороні, — середня лінія.', false, 'Кінці мають бути серединами сторін. Паралельних відрізків багато, а середня лінія — одна.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Середня лінія: кінці — середини двох сторін, паралельна третій, дорівнює її половині.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Периметр трикутника із середніх ліній — половина периметра (і навпаки), або сторони відомі. */
function perymetr(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    const p = r.chyslo(6, 60) * 2;
    return {
      pytannia: `Периметр трикутника ${p} см. Знайди периметр трикутника, вершини якого — середини сторін даного.`,
      malunok: seredniaLiniia({ linii: ['AC', 'AB', 'BC'] }),
      vidpovid: p / 2,
      odynytsi: 'см',
      pidkazka: 'Кожна сторона нового трикутника — середня лінія, тобто половина однієї зі сторін даного.',
      rozviazok: `Усі сторони вдвічі менші, тож і периметр: ${p} : 2 = ${p / 2} см.`,
    };
  }
  if (typ === 2) {
    const [x, y, z] = r.rizni(3, 2, 15);
    return {
      pytannia: `Середні лінії трикутника дорівнюють ${x} см, ${y} см і ${z} см. Знайди периметр трикутника.`,
      vidpovid: 2 * (x + y + z),
      odynytsi: 'см',
      pidkazka: 'Кожна сторона трикутника вдвічі довша за середню лінію, яка їй паралельна.',
      rozviazok: `Сторони трикутника ${2 * x}, ${2 * y} і ${2 * z} см, периметр ${2 * x} + ${2 * y} + ${2 * z} = ${2 * (x + y + z)} см.`,
    };
  }
  for (;;) {
    const [x, y, z] = r.rizni(3, 3, 30);
    if (x + y <= z || x + z <= y || y + z <= x) continue;
    const s = x + y + z;
    return {
      pytannia: `Сторони трикутника дорівнюють ${x} см, ${y} см і ${z} см. Знайди периметр трикутника, вершини якого — середини сторін даного.`,
      vidpovid: s % 2 ? des(s * 5, 1) : s / 2,
      odynytsi: 'см',
      pidkazka: 'Знайди половину кожної сторони або одразу половину периметра.',
      rozviazok: `Периметр даного трикутника ${x} + ${y} + ${z} = ${s} см, а трикутника із середніх ліній — удвічі менший: ${s} : 2 = ${des(s * 5, 1)} см.`,
    };
  }
}

/** «Відрізаний» трикутник MBN: його периметр — половина периметра ABC. */
function vidrizanyi(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const n = imena(b);
  for (;;) {
    const [x, y, z] = r.rizni(3, 3, 15).map((v) => 2 * v);
    if (x + y <= z || x + z <= y || y + z <= x) continue;
    const [A, B, C] = b;
    return {
      pytannia: `${n.umova('AC')}, ${A}${B} = ${x} см, ${B}${C} = ${y} см, ${A}${C} = ${z} см. Знайди периметр трикутника M${B}N.`,
      malunok: seredniaLiniia({ bukvy: b, pidpysyStorin: { AB: `${x}`, BC: `${y}`, AC: `${z}` } }),
      vidpovid: (x + y + z) / 2,
      odynytsi: 'см',
      pidkazka: `M${B} і ${B}N — половини сторін, а MN — середня лінія.`,
      rozviazok: `M${B} = ${x} : 2 = ${x / 2} см, ${B}N = ${y} : 2 = ${y / 2} см, MN = ${z} : 2 = ${z / 2} см. Периметр ${x / 2} + ${y / 2} + ${z / 2} = ${(x + y + z) / 2} см — половина периметра ${n.trykutnyk}.`,
    };
  }
}

/** Задачі з життя: стрем'янка, дах, рівнобедрений трикутник. */
function zhyttia(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(1, 3);
  if (typ === 1) {
    const d = r.chyslo(8, 18) * 10;
    if (r.shans()) {
      return {
        pytannia: `Ніжки стрем'янки внизу розставлено на ${d} см. Перекладина сполучає середини ніжок. Яка її довжина?`,
        vidpovid: d / 2,
        odynytsi: 'см',
        pidkazka: 'Ніжки й підлога утворюють трикутник, а перекладина — його середня лінія.',
        rozviazok: `Перекладина паралельна підлозі й дорівнює половині відстані між ніжками: ${d} : 2 = ${d / 2} см.`,
      };
    }
    return {
      pytannia: `Перекладина стрем'янки сполучає середини ніжок і має довжину ${d / 2} см. На яку відстань розставлено ніжки внизу?`,
      vidpovid: d,
      odynytsi: 'см',
      pidkazka: 'Перекладина — середня лінія. Відстань між ніжками вдвічі більша.',
      rozviazok: `2 · ${d / 2} = ${d} см.`,
    };
  }
  if (typ === 2) {
    const sh = r.chyslo(6, 14);
    return {
      pytannia: `Ширина будинку ${sh} м. Дах — рівнобедрений трикутник, а його крокви посередині скріплено горизонтальною балкою між серединами крокв. Яка довжина балки?`,
      vidpovid: sh % 2 ? des(sh * 5, 1) : sh / 2,
      odynytsi: 'м',
      pidkazka: 'Балка сполучає середини двох сторін трикутника — це середня лінія.',
      rozviazok: `Балка — середня лінія, паралельна основі завширшки ${sh} м: ${sh} : 2 = ${des(sh * 5, 1)} м.`,
    };
  }
  for (;;) {
    const osn = r.chyslo(3, 15) * 2;
    const bich = r.chyslo(3, 20);
    if (2 * bich <= osn) continue;
    return {
      pytannia: `Основа рівнобедреного трикутника ${osn} см, бічна сторона ${bich} см. Знайди периметр трикутника, вершини якого — середини сторін даного.`,
      vidpovid: (osn + 2 * bich) / 2,
      odynytsi: 'см',
      pidkazka: 'Периметр трикутника із середніх ліній — половина периметра даного.',
      rozviazok: `Периметр даного: ${osn} + ${bich} + ${bich} = ${osn + 2 * bich} см, половина — ${osn + 2 * bich} : 2 = ${(osn + 2 * bich) / 2} см.`,
    };
  }
}

export default {
  rivni: ['половина сторони', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return polovyna(r);
    if (riven === 2) return r.vybir([yakoiStorony, yakoiStorony, tverdzhennia, polovyna])(r);
    return r.vybir([perymetr, vidrizanyi, zhyttia, yakoiStorony])(r);
  },
} satisfies Henerator;
