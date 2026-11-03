// Закони множення: переставний і сполучний (шукаємо пари 4 · 25, 2 · 5, 8 · 125), розподільний —
// розкриваємо дужки (6 · 51 = 6 · 50 + 6) і виносимо спільний множник (29 · 64 + 29 · 36 = 29 · 100).
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY = [
  [2, 5, 10],
  [4, 25, 100],
  [5, 20, 100],
  [2, 50, 100],
  [8, 125, 1000],
  [4, 250, 1000],
] as const;

function pary(r: Vypadok, max: number): TrenZavdannia {
  const [a, b, kruhle] = r.vybir(PARY.filter(([, , k]) => k <= max));
  const c = r.chyslo(3, 99);
  const poriadok = r.vybir([
    [a, c, b],
    [b, c, a],
    [c, a, b].reverse(),
  ]);
  return {
    pytannia: 'Обчисли зручно: знайди пару, що дає кругле число.',
    vyraz: `${poriadok.join(' · ')} =`,
    vidpovid: a * b * c,
    pidkazka: `${a} · ${b} = ${kruhle}.`,
    rozviazok: `${a} · ${b} = ${kruhle}; ${kruhle} · ${c} = ${ch(a * b * c)}`,
  };
}

function rozkryty(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(3, 9);
  const kruhle = r.chyslo(2, 9) * r.vybir([10, 100]);
  const d = r.chyslo(1, 3);
  const plius = r.shans();
  const b = plius ? kruhle + d : kruhle - d;
  return {
    pytannia: `Обчисли зручно: ${b} = ${kruhle} ${plius ? '+' : '−'} ${d}.`,
    vyraz: `${a} · ${b} =`,
    vidpovid: a * b,
    pidkazka: `Помнож ${a} на ${kruhle} і на ${d}, а тоді ${plius ? 'додай' : 'відніми'}.`,
    rozviazok: `${a} · ${b} = ${a} · ${kruhle} ${plius ? '+' : '−'} ${a} · ${d} = ${ch(a * kruhle)} ${plius ? '+' : '−'} ${a * d} = ${ch(a * b)}`,
  };
}

function vynesty(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(11, 99);
  const kruhle = r.vybir([10, 100, 100, 1000]);
  const minus = r.shans();
  const b = minus ? kruhle + r.chyslo(1, kruhle - 1) : r.chyslo(1, kruhle - 1);
  const c = minus ? b - kruhle : kruhle - b;
  return {
    pytannia: 'Обчисли зручно: винеси спільний множник за дужки.',
    vyraz: `${a} · ${b} ${minus ? '−' : '+'} ${a} · ${c} =`,
    vidpovid: a * kruhle,
    pidkazka: `Спільний множник ${a}. Що лишиться в дужках?`,
    rozviazok: `${a} · (${b} ${minus ? '−' : '+'} ${c}) = ${a} · ${kruhle} = ${ch(a * kruhle)}`,
  };
}

function sproshchennia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 15);
  const b = r.chyslo(2, 15);
  const minus = r.shans() && a !== b;
  const [p, q] = minus ? [Math.max(a, b), Math.min(a, b)] : [a, b];
  const k = minus ? p - q : p + q;
  return {
    pytannia: 'Спрости вираз. Запиши відповідь, наприклад «12x».',
    vyraz: `${p}x ${minus ? '−' : '+'} ${q}x =`,
    vidpovid: `${k}x`,
    perevirka: (v) => v.replace(/х/gi, 'x').replace(/[\s·*]/g, '').toLowerCase() === `${k}x`,
    pidkazka: `Винеси x за дужки: (${p} ${minus ? '−' : '+'} ${q}) · x.`,
    rozviazok: `(${p} ${minus ? '−' : '+'} ${q}) · x = ${k}x`,
  };
}

export default {
  rivni: ['зручні пари множників', 'розкриваємо дужки', 'виносимо спільний множник'],
  zavdannia(r, riven) {
    if (riven === 1) return pary(r, 100);
    if (riven === 2) return r.shans(0.7) ? rozkryty(r) : pary(r, 1000);
    return r.vybir([vynesty, vynesty, sproshchennia, rozkryty])(r);
  },
} satisfies Henerator;
