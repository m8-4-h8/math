// Задачі на суму двох добутків (3 клас): a · b + c · d; різницеве й кратне порівняння двох добутків;
// обернені задачі — невідома ціна (по скільки) або кількість: (S − a · b) : d.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

type Formy = readonly [string, string, string];

/** Речі для покупки: форми після числа (знахідний відмінок), «за …» (множина), «один …», рід. */
const RECHI: { formy: Formy; za: string; odyn: string }[] = [
  { formy: ['альбом', 'альбоми', 'альбомів'], za: 'альбоми', odyn: 'один альбом' },
  { formy: ['олівець', 'олівці', 'олівців'], za: 'олівці', odyn: 'один олівець' },
  { formy: ['зошит', 'зошити', 'зошитів'], za: 'зошити', odyn: 'один зошит' },
  { formy: ['блокнот', 'блокноти', 'блокнотів'], za: 'блокноти', odyn: 'один блокнот' },
  { formy: ['ручку', 'ручки', 'ручок'], za: 'ручки', odyn: 'одна ручка' },
  { formy: ['фломастер', 'фломастери', 'фломастерів'], za: 'фломастери', odyn: 'один фломастер' },
  { formy: ['гумку', 'гумки', 'гумок'], za: 'гумки', odyn: 'одна гумка' },
];

const sk = (n: number, f: Formy) => `${n} ${mnozh(n, f[0], f[1], f[2])}`;

/**
 * Історія з двома групами: у першій b разів по a, у другій d разів по c.
 * `pershe`/`druhe` — як назвати групи в запитаннях «на скільки більше …».
 */
interface Istoriia {
  umova: (a: number, b: number, c: number, d: number) => string;
  /** Умова, де невідоме c (по скільки в другій групі), а відома загальна сума S. */
  bezC: (a: number, b: number, d: number, S: number) => string;
  vsi: string;
  naSkilky: (pershaBilshe: boolean) => string;
  uSkilky: string;
  od?: string;
  /** Межі для «по скільки» (a, c) і «скільки разів» (b, d); для другої групи — свої, якщо задано. */
  po: [number, number];
  raziv: [number, number];
  po2?: [number, number];
  raziv2?: [number, number];
}

function pokupka(r: Vypadok): Istoriia {
  const [x, y] = r.peremishaty(RECHI).slice(0, 2);
  return {
    umova: (a, b, c, d) => `Купили ${sk(b, x.formy)} по ${a} грн і ${sk(d, y.formy)} по ${c} грн.`,
    bezC: (a, b, d, S) => `Купили ${sk(b, x.formy)} по ${a} грн і ${sk(d, y.formy)}. За всю покупку заплатили ${S} грн. Скільки коштує ${y.odyn}?`,
    vsi: 'Скільки всього грошей заплатили?',
    naSkilky: (p) => `На скільки більше заплатили за ${p ? x.za : y.za}, ніж за ${p ? y.za : x.za}?`,
    uSkilky: `У скільки разів більше заплатили за ${x.za}, ніж за ${y.za}?`,
    od: 'грн',
    po: [2, 10],
    raziv: [2, 9],
  };
}

const ISTORII: (() => Istoriia)[] = [
  () => ({
    umova: (a, b, c, d) =>
      `На екскурсію приїхали ${sk(b, ['мікроавтобус', 'мікроавтобуси', 'мікроавтобусів'])}, по ${sk(a, ['дитині', 'дитини', 'дітей'])} в кожному, і ${sk(d, ['легковий автомобіль', 'легкові автомобілі', 'легкових автомобілів'])}, по ${sk(c, ['дитині', 'дитини', 'дітей'])} в кожному.`,
    bezC: (a, b, d, S) =>
      `На екскурсію приїхали ${sk(b, ['мікроавтобус', 'мікроавтобуси', 'мікроавтобусів'])}, по ${sk(a, ['дитині', 'дитини', 'дітей'])} в кожному, і ${sk(d, ['легковий автомобіль', 'легкові автомобілі', 'легкових автомобілів'])}. Усього приїхало ${sk(S, ['дитина', 'дитини', 'дітей'])}. Скільки дітей було в кожному легковому автомобілі, якщо в усіх порівну?`,
    vsi: 'Скільки всього дітей приїхало на екскурсію?',
    naSkilky: (p) => `На скільки більше дітей приїхало ${p ? 'мікроавтобусами' : 'легковими автомобілями'}, ніж ${p ? 'легковими автомобілями' : 'мікроавтобусами'}?`,
    uSkilky: 'У скільки разів більше дітей приїхало мікроавтобусами, ніж легковими автомобілями?',
    po: [6, 9],
    raziv: [2, 9],
    po2: [2, 4],
    raziv2: [2, 5],
  }),
  () => ({
    umova: (a, b, c, d) =>
      `Робітники клали тротуарну плитку. До обіду вони працювали ${b} год, щогодини викладаючи ${a} м тротуару, а після обіду — ${d} год, щогодини по ${c} м.`,
    bezC: (a, b, d, S) =>
      `Робітники клали тротуарну плитку. До обіду вони працювали ${b} год, щогодини викладаючи ${a} м тротуару, а після обіду — ${d} год. Усього за день виклали ${S} м. Скільки метрів щогодини викладали після обіду, якщо працювали рівномірно?`,
    vsi: 'Скільки всього метрів тротуару виклали робітники?',
    naSkilky: (p) => `На скільки більше метрів виклали ${p ? 'до обіду' : 'після обіду'}, ніж ${p ? 'після обіду' : 'до обіду'}?`,
    uSkilky: 'У скільки разів більше метрів виклали до обіду, ніж після обіду?',
    od: 'м',
    po: [2, 10],
    raziv: [2, 5],
  }),
  () => ({
    umova: (a, b, c, d) =>
      `Кожній із ${b} чорних норок дали по ${sk(a, ['рибині', 'рибини', 'рибин'])}, а кожній із ${d} білих — по ${sk(c, ['рибині', 'рибини', 'рибин'])}.`,
    bezC: (a, b, d, S) =>
      `Кожній із ${b} чорних норок дали по ${sk(a, ['рибині', 'рибини', 'рибин'])}, а кожній із ${d} білих — порівну. Усього дали ${sk(S, ['рибину', 'рибини', 'рибин'])}. Скільки рибин дали кожній білій норці?`,
    vsi: 'Скільки всього рибин дали норкам?',
    naSkilky: (p) => `На скільки більше рибин дали ${p ? 'чорним' : 'білим'} норкам, ніж ${p ? 'білим' : 'чорним'}?`,
    uSkilky: 'У скільки разів більше рибин дали чорним норкам, ніж білим?',
    po: [2, 6],
    raziv: [2, 9],
  }),
];

const istoriia = (r: Vypadok) => (r.shans(0.45) ? pokupka(r) : r.vybir(ISTORII)());

/** Числа: дві різні пари, обидва добутки табличні, сума не більша за 100. */
function chysla(r: Vypadok, s: Istoriia) {
  for (;;) {
    const a = r.chyslo(...s.po);
    const c = r.chyslo(...(s.po2 ?? s.po));
    const b = r.chyslo(...s.raziv);
    const d = r.chyslo(...(s.raziv2 ?? s.raziv));
    if (a === c && b === d) continue;
    if (a * b + c * d > 100) continue;
    return { a, b, c, d };
  }
}

function suma(r: Vypadok): TrenZavdannia {
  const s = istoriia(r);
  const { a, b, c, d } = chysla(r, s);
  return {
    pytannia: `${s.umova(a, b, c, d)} ${s.vsi}`,
    vidpovid: a * b + c * d,
    odynytsi: s.od,
    pidkazka: 'Запиши коротко таблицею: по скільки, скільки разів, усього. Спершу знайди кожен добуток.',
    rozviazok: `1) ${a} · ${b} = ${a * b}; 2) ${c} · ${d} = ${c * d}; 3) ${a * b} + ${c * d} = ${a * b + c * d}. Вираз: ${a} · ${b} + ${c} · ${d} = ${a * b + c * d}.`,
  };
}

function vyraz(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const c = r.chyslo(2, 9);
  const d = r.chyslo(2, 9);
  const minus = r.shans(0.3) && a * b > c * d;
  return {
    pytannia: 'Обчисли. Спершу множення, потім додавання чи віднімання.',
    vyraz: `${a} · ${b} ${minus ? '−' : '+'} ${c} · ${d} =`,
    vidpovid: minus ? a * b - c * d : a * b + c * d,
    pidkazka: `Спершу ${a} · ${b} і ${c} · ${d}.`,
    rozviazok: `${a} · ${b} = ${a * b}, ${c} · ${d} = ${c * d}, ${a * b} ${minus ? '−' : '+'} ${c * d} = ${minus ? a * b - c * d : a * b + c * d}.`,
  };
}

function yakyiVyraz(r: Vypadok): TrenZavdannia {
  const s = istoriia(r);
  const { a, b, c, d } = chysla(r, s);
  const pravylnyi = `${a} · ${b} + ${c} · ${d}`;
  const khybni = [`(${a} + ${c}) · (${b} + ${d})`, `${a} · ${b} + ${c}`];
  const vsi = r.peremishaty([pravylnyi, ...khybni]);
  const bukvy = ['А', 'Б', 'В'];
  return {
    pytannia: `${s.umova(a, b, c, d)} ${s.vsi} Який вираз розв'язує задачу? ${vsi.map((v, i) => `${bukvy[i]}) ${v}`).join('  ')}`,
    vidpovid: bukvy[vsi.indexOf(pravylnyi)],
    varianty: bukvy,
    pidkazka: 'У кожній групі множимо свої числа: по скільки на скільки разів. Потім додаємо.',
    rozviazok: `${pravylnyi} = ${a * b + c * d}: спершу кожен добуток, потім сума.`,
  };
}

function naSkilky(r: Vypadok): TrenZavdannia {
  const s = istoriia(r);
  for (;;) {
    const { a, b, c, d } = chysla(r, s);
    if (a * b === c * d) continue;
    const p = a * b > c * d;
    const [x, y] = p ? [a * b, c * d] : [c * d, a * b];
    return {
      pytannia: `${s.umova(a, b, c, d)} ${s.naSkilky(p)}`,
      vidpovid: x - y,
      odynytsi: s.od,
      pidkazka: 'Знайди обидва добутки, а тоді віднімай від більшого менший.',
      rozviazok: `1) ${a} · ${b} = ${a * b}; 2) ${c} · ${d} = ${c * d}; 3) ${x} − ${y} = ${x - y}.`,
    };
  }
}

function uSkilky(r: Vypadok): TrenZavdannia {
  const s = istoriia(r);
  for (;;) {
    const { a, b, c, d } = chysla(r, s);
    if (a * b <= c * d || (a * b) % (c * d) !== 0) continue;
    const k = (a * b) / (c * d);
    return {
      pytannia: `${s.umova(a, b, c, d)} ${s.uSkilky}`,
      vidpovid: k,
      pidkazka: '«У скільки разів більше» — більше число ділимо на менше. Спершу знайди обидва добутки.',
      rozviazok: `1) ${a} · ${b} = ${a * b}; 2) ${c} · ${d} = ${c * d}; 3) ${a * b} : ${c * d} = ${k}.`,
    };
  }
}

function obernena(r: Vypadok): TrenZavdannia {
  const s = istoriia(r);
  const { a, b, c, d } = chysla(r, s);
  const S = a * b + c * d;
  return {
    pytannia: s.bezC(a, b, d, S),
    vidpovid: c,
    odynytsi: s.od,
    pidkazka: `Спершу знайди, скільки припадає на першу групу: ${a} · ${b}. Решту поділи на ${d}.`,
    rozviazok: `1) ${a} · ${b} = ${a * b}; 2) ${S} − ${a * b} = ${c * d}; 3) ${c * d} : ${d} = ${c}. Вираз: (${S} − ${a} · ${b}) : ${d} = ${c}.`,
  };
}

/** Обернена задача про покупку: невідома кількість речей другого виду. */
function skilkyKupyly(r: Vypadok): TrenZavdannia {
  const [x, y] = r.peremishaty(RECHI).slice(0, 2);
  const s = pokupka(r);
  const { a, b, c, d } = chysla(r, s);
  const S = a * b + c * d;
  return {
    pytannia: `Купили ${sk(b, x.formy)} по ${a} грн і кілька ${y.formy[2]} по ${c} грн. Усього заплатили ${S} грн. Скільки ${y.formy[2]} купили?`,
    vidpovid: d,
    pidkazka: `Скільки заплатили за ${x.za}? Решта грошей — за ${y.za}.`,
    rozviazok: `1) ${a} · ${b} = ${a * b}; 2) ${S} − ${a * b} = ${c * d}; 3) ${c * d} : ${c} = ${d}. Вираз: (${S} − ${a} · ${b}) : ${c} = ${d}.`,
  };
}

export default {
  rivni: ['сума двох добутків', 'на скільки і в скільки разів більше', 'обернені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([suma, suma, suma, vyraz, yakyiVyraz])(r);
    if (riven === 2) return r.vybir([naSkilky, naSkilky, uSkilky, suma])(r);
    return r.vybir([obernena, obernena, skilkyKupyly, naSkilky])(r);
  },
} satisfies Henerator;
