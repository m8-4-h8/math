// Ціна, кількість, вартість: В = Ц · К, Ц = В : К, К = В : Ц; зведення до одиниці; дві покупки й решта.
import { ch, mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TOVARY = [
  { forma: ['зошит', 'зошити', 'зошитів'], tsina: [6, 25] },
  { forma: ['олівець', 'олівці', 'олівців'], tsina: [4, 15] },
  { forma: ['ручка', 'ручки', 'ручок'], tsina: [8, 30] },
  { forma: ['книжка', 'книжки', 'книжок'], tsina: [45, 180] },
  { forma: ['альбом', 'альбоми', 'альбомів'], tsina: [20, 60] },
  { forma: ['м’яч', 'м’ячі', 'м’ячів'], tsina: [90, 350] },
  { forma: ['фломастер', 'фломастери', 'фломастерів'], tsina: [5, 18] },
];

const shtuk = (n: number, t: (typeof TOVARY)[number]) => `${n} ${mnozh(n, t.forma[0], t.forma[1], t.forma[2])}`;
const rodovyi = (t: (typeof TOVARY)[number]) => t.forma[2]; // «скільки зошитів»

function tovar(r: Vypadok, maxK: number) {
  const t = r.vybir(TOVARY);
  return { t, tsina: r.chyslo(t.tsina[0], t.tsina[1]), k: r.chyslo(2, maxK) };
}

function odnaDiia(r: Vypadok, maxK: number): TrenZavdannia {
  const { t, tsina, k } = tovar(r, maxK);
  const v = tsina * k;
  const o = osoba(r);
  const kupyv = rid(o, 'купив', 'купила');
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `${o.imia} ${kupyv} ${shtuk(k, t)} по ${tsina} грн. Скільки гривень коштує вся покупка?`,
      vidpovid: v,
      odynytsi: 'грн',
      pidkazka: 'Вартість = ціна · кількість.',
      rozviazok: `${tsina} · ${k} = ${ch(v)} (грн)`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${o.imia} ${kupyv} ${shtuk(k, t)} і ${rid(o, 'заплатив', 'заплатила')} ${ch(v)} грн. Яка ціна однієї штуки?`,
      vidpovid: tsina,
      odynytsi: 'грн',
      pidkazka: 'Ціна = вартість : кількість.',
      rozviazok: `${ch(v)} : ${k} = ${tsina} (грн)`,
    };
  }
  return {
    pytannia: `${o.imia} ${rid(o, 'заплатив', 'заплатила')} ${ch(v)} грн за ${t.forma[1]} по ${tsina} грн. Скільки ${rodovyi(t)} ${kupyv} ${o.imia}?`,
    vidpovid: k,
    odynytsi: 'шт.',
    pidkazka: 'Кількість = вартість : ціна.',
    rozviazok: `${ch(v)} : ${tsina} = ${k} (шт.)`,
  };
}

// Зведення до одиниці: «4 зошити коштують 32 грн. Скільки коштують 7 таких зошитів?»
function doOdynytsi(r: Vypadok, maxK: number): TrenZavdannia {
  const { t, tsina, k } = tovar(r, maxK);
  const k2 = r.krim(2, maxK + 3, [k]);
  const v = tsina * k;
  if (r.shans()) {
    return {
      pytannia: `${shtuk(k, t)} коштують ${ch(v)} грн. Скільки гривень коштують ${shtuk(k2, t)} за тією самою ціною?`,
      vidpovid: tsina * k2,
      odynytsi: 'грн',
      pidkazka: 'Спершу дізнайся, скільки коштує одна штука.',
      rozviazok: `1) ${ch(v)} : ${k} = ${tsina} (грн) — ціна однієї штуки; 2) ${tsina} · ${k2} = ${ch(tsina * k2)} (грн).`,
    };
  }
  // Обернена: скільки штук можна купити за іншу суму.
  return {
    pytannia: `${shtuk(k, t)} коштують ${ch(v)} грн. Скільки таких ${rodovyi(t)} можна купити за ${ch(tsina * k2)} грн?`,
    vidpovid: k2,
    odynytsi: 'шт.',
    pidkazka: 'Спершу ціна однієї штуки, потім — скільки разів вона вміщається в нову суму.',
    rozviazok: `1) ${ch(v)} : ${k} = ${tsina} (грн); 2) ${ch(tsina * k2)} : ${tsina} = ${k2} (шт.).`,
  };
}

function dviPokupky(r: Vypadok): TrenZavdannia {
  const a = tovar(r, 6);
  let b = tovar(r, 6);
  while (b.t === a.t) b = tovar(r, 6);
  const vsoho = a.tsina * a.k + b.tsina * b.k;
  const o = osoba(r);
  if (r.shans()) {
    return {
      pytannia: `${o.imia} ${rid(o, 'купив', 'купила')} ${shtuk(a.k, a.t)} по ${a.tsina} грн і ${shtuk(b.k, b.t)} по ${b.tsina} грн. Скільки гривень коштує вся покупка?`,
      vidpovid: vsoho,
      odynytsi: 'грн',
      pidkazka: 'Знайди вартість кожної покупки окремо, а потім додай.',
      rozviazok: `${a.tsina} · ${a.k} + ${b.tsina} · ${b.k} = ${ch(a.tsina * a.k)} + ${ch(b.tsina * b.k)} = ${ch(vsoho)} (грн)`,
    };
  }
  const bulo = Math.ceil((vsoho + 1) / 100) * 100 + 100 * r.chyslo(0, 3);
  return {
    pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${ch(bulo)} грн і ${rid(o, 'купив', 'купила')} ${shtuk(a.k, a.t)} по ${a.tsina} грн і ${shtuk(b.k, b.t)} по ${b.tsina} грн. Скільки гривень лишилося?`,
    vidpovid: bulo - vsoho,
    odynytsi: 'грн',
    pidkazka: 'Спершу вартість усієї покупки, потім відніми її від того, що було.',
    rozviazok: `1) ${a.tsina} · ${a.k} + ${b.tsina} · ${b.k} = ${ch(vsoho)} (грн); 2) ${ch(bulo)} − ${ch(vsoho)} = ${ch(bulo - vsoho)} (грн).`,
  };
}

export default {
  rivni: ['вартість, ціна чи кількість', 'зведення до одиниці', 'дві покупки, решта, обернені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return odnaDiia(r, 9);
    if (riven === 2) return r.shans(0.6) ? doOdynytsi(r, 9) : odnaDiia(r, 12);
    return r.vybir([dviPokupky, dviPokupky, (rr: Vypadok) => doOdynytsi(rr, 12)])(r);
  },
} satisfies Henerator;
