// Четверте пропорційне: зведення до одиниці (спершу ділимо — «скільки на одну», потім множимо або ділимо);
// спосіб відношень (у скільки разів більше); обернена залежність (більше машин — менше днів).
import { ch, mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Priama {
  umova: (a: number, b: number, c: number) => string;
  u: [number, number, number];
  odynytsi?: string;
  odnaOd: string;
}

const PRIAMI: Priama[] = [
  {
    umova: (a, b, c) => `Автомобіль за ${a} год проїхав ${ch(b)} км. Скільки кілометрів він проїде за ${c} год з тією самою швидкістю?`,
    u: [40, 90, 5],
    odynytsi: 'км',
    odnaOd: 'км за 1 год',
  },
  {
    umova: (a, b, c) => `За ${a} год майстер виготовив ${skilky(b, 'деталь', 'деталі', 'деталей')}. Скільки деталей він виготовить за ${c} год, якщо працюватиме так само?`,
    u: [3, 12, 1],
    odnaOd: 'деталей за 1 год',
  },
  {
    umova: (a, b, c) =>
      `${a} ${mnozh(a, 'однаковий пакет', 'однакові пакети', 'однакових пакетів')} борошна важать ${b} кг. Скільки кілограмів важать ${c} ${mnozh(c, 'такий пакет', 'такі пакети', 'таких пакетів')}?`,
    u: [1, 5, 1],
    odynytsi: 'кг',
    odnaOd: 'кг — один пакет',
  },
  {
    umova: (a, b, c) => `Насос за ${a} год викачує ${ch(b)} л води. Скільки літрів він викачає за ${c} год, якщо працюватиме так само?`,
    u: [50, 150, 10],
    odynytsi: 'л',
    odnaOd: 'л за 1 год',
  },
  {
    umova: (a, b, c) => `${a} кг груш коштують ${ch(b)} грн. Скільки коштують ${c} кг таких груш?`,
    u: [30, 80, 1],
    odynytsi: 'грн',
    odnaOd: 'грн за 1 кг',
  },
];

function priama(r: Vypadok, vidnoshennia: boolean): TrenZavdannia {
  const p = r.vybir(PRIAMI);
  const u = p.u[0] + p.u[2] * r.chyslo(0, (p.u[1] - p.u[0]) / p.u[2]);
  const a = r.chyslo(2, vidnoshennia ? 5 : 9);
  const c = vidnoshennia ? a * r.chyslo(2, 4) : r.krim(2, 12, [a]);
  const b = u * a;
  if (vidnoshennia) {
    const k = c / a;
    return {
      pytannia: p.umova(a, b, c),
      vidpovid: u * c,
      odynytsi: p.odynytsi,
      pidkazka: `У скільки разів ${c} більше, ніж ${a}? У стільки ж разів більший і результат.`,
      rozviazok: `${c} : ${a} = ${k} (${mnozh(k, 'раз', 'рази', 'разів')}); ${ch(b)} · ${k} = ${ch(u * c)}. Перевірка: ${ch(b)} : ${a} = ${u} ${p.odnaOd}, ${u} · ${c} = ${ch(u * c)} ✓`,
    };
  }
  return {
    pytannia: p.umova(a, b, c),
    vidpovid: u * c,
    odynytsi: p.odynytsi,
    pidkazka: `Спершу «на одну»: ${ch(b)} : ${a}.`,
    rozviazok: `${ch(b)} : ${a} = ${u} ${p.odnaOd}; ${u} · ${c} = ${ch(u * c)}`,
  };
}

const RECHI = [
  { odna: 'ручку', dvi: 'ручки', piat: 'ручок', tsina: [10, 25] },
  { odna: 'зошит', dvi: 'зошити', piat: 'зошитів', tsina: [15, 40] },
  { odna: 'олівець', dvi: 'олівці', piat: 'олівців', tsina: [8, 20] },
];

function kilkist(r: Vypadok): TrenZavdannia {
  if (r.shans(0.3)) {
    const k = r.chyslo(3, 5);
    const a = r.chyslo(2, 6);
    const c = r.krim(2, 9, [a]);
    return {
      pytannia: `З ${k * a} кг слив виходить ${a} кг чорносливу. Скільки кілограмів чорносливу вийде з ${k * c} кг слив?`,
      vidpovid: c,
      odynytsi: 'кг',
      pidkazka: `Спершу: скільки кілограмів слив потрібно на 1 кг чорносливу?`,
      rozviazok: `${k * a} : ${a} = ${k} кг слив на 1 кг чорносливу; ${k * c} : ${k} = ${c} кг`,
    };
  }
  const rich = r.vybir(RECHI);
  const [od, ry, pt] = [rich.odna, rich.dvi, rich.piat];
  const tsina = r.chyslo(rich.tsina[0], rich.tsina[1]);
  const a = r.chyslo(2, 6);
  const c = r.krim(2, 12, [a]);
  const odnakovi = mnozh(a, '', 'однакові', 'однакових'); // a ≥ 2
  return {
    pytannia: `За ${a} ${odnakovi} ${mnozh(a, od, ry, pt)} заплатили ${tsina * a} грн. Скільки таких ${pt} можна купити за ${tsina * c} грн?`,
    vidpovid: c,
    pidkazka: `Спершу ціна однієї штуки: ${tsina * a} : ${a}. Потім — скільки разів вона вміщається в ${tsina * c}.`,
    rozviazok: `${tsina * a} : ${a} = ${tsina} (грн) — одна штука; ${tsina * c} : ${tsina} = ${c}. Перевірка: ${tsina} · ${c} = ${tsina * c} ✓`,
  };
}

const raziv = (n: number) => `${n} ${mnozh(n, 'раз', 'рази', 'разів')}`;

const OBERNENI = [
  { odyn: 'екскаватор', dva: 'екскаватори', piat: 'екскаваторів', robota: 'викопують котлован', chas: 'день', chasy: 'дні', chasiv: 'днів', zaSkilky: 'За скільки днів', zrobliat: 'викопають його' },
  { odyn: 'робітник', dva: 'робітники', piat: 'робітників', robota: 'ремонтують дорогу', chas: 'день', chasy: 'дні', chasiv: 'днів', zaSkilky: 'За скільки днів', zrobliat: 'відремонтують її' },
  { odyn: 'насос', dva: 'насоси', piat: 'насосів', robota: 'наповнюють басейн', chas: 'годину', chasy: 'години', chasiv: 'годин', zaSkilky: 'За скільки годин', zrobliat: 'наповнять його' },
];

function obernena(r: Vypadok): TrenZavdannia {
  const o = r.vybir(OBERNENI);
  for (;;) {
    const a = r.chyslo(2, 8);
    const d = r.chyslo(2, 12);
    const c = r.krim(2, 12, [a]);
    if ((a * d) % c !== 0) continue;
    const t = (a * d) / c;
    if (t < 2) continue;
    const nazva = (n: number) => `${n} ${mnozh(n, o.odyn, o.dva, o.piat)}`;
    const chas = (n: number) => `${n} ${mnozh(n, o.chas, o.chasy, o.chasiv)}`;
    return {
      pytannia: `${nazva(a)} ${o.robota} за ${chas(d)}. ${o.zaSkilky} ${c} ${mnozh(c, 'такий', 'такі', 'таких')} ${mnozh(c, o.odyn, o.dva, o.piat)} ${o.zrobliat}?`,
      vidpovid: t,
      pidkazka: `Більше машин чи людей — менше часу. Скільки часу потрібно одному: ${d} · ${a}.`,
      rozviazok: `Один ${o.odyn} працював би у ${raziv(a)} довше: ${d} · ${a} = ${a * d}; а ${c} — у ${raziv(c)} швидше: ${a * d} : ${c} = ${t}.`,
    };
  }
}

export default {
  rivni: ['зведення до одиниці', 'спосіб відношень і кількість', 'обернена залежність'],
  zavdannia(r, riven) {
    if (riven === 1) return priama(r, false);
    if (riven === 2) return r.vybir([(rr: Vypadok) => priama(rr, true), kilkist, kilkist, (rr: Vypadok) => priama(rr, false)])(r);
    return r.vybir([obernena, obernena, kilkist, (rr: Vypadok) => priama(rr, rr.shans())])(r);
  },
} satisfies Henerator;
