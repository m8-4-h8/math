// Лінійні рівняння з однією змінною: ax = b; переносимо доданки; розкриваємо дужки; скільки коренів:
// a ≠ 0 — один, 0 · x = 0 — безліч, 0 · x = b (b ≠ 0) — коренів немає.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex, tvd, tz } from '../alhebra.ts';

const VARIANTY = ['один корінь', 'коренів немає', 'безліч коренів'];

function prostе(r: Vypadok): TrenZavdannia {
  const x = r.krim(-12, 12, [0]);
  const a = r.krim(-9, 9, [0, 1]);
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$${tex([0, a])} = ${tz(a * x)}$`,
    vidpovid: ch(x),
    pidkazka: `Поділи ${ch(a * x)} на ${ch(a)}.`,
    rozviazok: `x = ${ch(a * x)} : ${tvd(a)} = ${ch(x)}`,
  };
}

function perenos(r: Vypadok): TrenZavdannia {
  const x = r.krim(-9, 9, [0]);
  const a = r.krim(-9, 9, [0]);
  const c = r.krim(-9, 9, [0, a]);
  const b = r.krim(-15, 15, [0]);
  const d = (a - c) * x + b;
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$${tex([b, a])} = ${tex([d, c])}$`,
    vidpovid: ch(x),
    pidkazka: `Невідомі — ліворуч, числа — праворуч: ${ch(a)}x − ${tvd(c)}x = ${ch(d)} − ${tvd(b)}.`,
    rozviazok: `${ch(a - c)}x = ${ch(d - b)}; x = ${ch(d - b)} : ${tvd(a - c)} = ${ch(x)}`,
  };
}

function duzhky(r: Vypadok): TrenZavdannia {
  const x = r.krim(-9, 9, [0]);
  const a = r.chyslo(2, 8);
  const k = r.krim(-5, 5, [0, 1]);
  const m = r.krim(-6, 6, [0]);
  const c = r.krim(-9, 9, [0, a - k]);
  // ax − k(x − m) = cx + d → (a − k)x + km = cx + d
  const d = (a - k - c) * x + k * m;
  return {
    pytannia: 'Розв’яжи рівняння.',
    vyraz: `$${a}x ${k < 0 ? '+' : '-'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}(x ${m < 0 ? '+' : '-'} ${Math.abs(m)}) = ${tex([d, c])}$`,
    vidpovid: ch(x),
    pidkazka: `Розкрий дужки: ${a}x ${-k < 0 ? '−' : '+'} ${Math.abs(k)}x ${k * m < 0 ? '−' : '+'} ${Math.abs(k * m)}.`,
    rozviazok: `${ch(a - k)}x ${k * m < 0 ? '−' : '+'} ${Math.abs(k * m)} = ${tex([d, c]).replace(/-/g, '−')}; ${ch(a - k - c)}x = ${ch(d - k * m)}; x = ${ch(x)}`,
  };
}

function skilkyKoreniv(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 6);
  const m = r.krim(-6, 6, [0]);
  const typ = r.chyslo(0, 2);
  // a(x + m) + s = ax + t
  const s = r.krim(-9, 9, [0]);
  const t = typ === 1 ? a * m + s : typ === 2 ? a * m + s + r.krim(-5, 5, [0]) : 0;
  const c = typ === 0 ? r.krim(-6, 6, [0, a]) : a;
  const vidpovid = typ === 0 ? 'один корінь' : typ === 1 ? 'безліч коренів' : 'коренів немає';
  return {
    pytannia: `Скільки коренів має рівняння $${a}(x ${m < 0 ? '-' : '+'} ${Math.abs(m)}) ${s < 0 ? '-' : '+'} ${Math.abs(s)} = ${tex([t, c])}$?`,
    vidpovid,
    varianty: VARIANTY,
    pidkazka: 'Розкрий дужки, перенеси x ліворуч. Що залишиться при x?',
    rozviazok:
      typ === 0
        ? `Після спрощення ${ch(a - c)}x = …, коефіцієнт не нуль — один корінь.`
        : `Ліворуч ${a}x ${a * m + s < 0 ? '−' : '+'} ${Math.abs(a * m + s)}, праворуч ${a}x ${t < 0 ? '−' : '+'} ${Math.abs(t)}: 0 · x = ${ch(t - a * m - s)} — ${typ === 1 ? 'правильно при будь-якому x, безліч коренів' : 'неможливо, коренів немає'}.`,
  };
}

export default {
  rivni: ['ax = b', 'переносимо і розкриваємо дужки', 'скільки коренів'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? prostе(r) : perenos(r);
    if (riven === 2) return r.shans(0.6) ? duzhky(r) : perenos(r);
    return r.vybir([skilkyKoreniv, skilkyKoreniv, duzhky])(r);
  },
} satisfies Henerator;
