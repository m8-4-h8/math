// Лінійна функція y = kx + b: b — точка перетину з віссю y (x = 0); з віссю x — розв’язуємо kx + b = 0;
// k > 0 — зростає, k < 0 — спадає; k за точкою на графіку; k і b за двома точками.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex, tvd, tz } from '../alhebra.ts';

function osY(r: Vypadok): TrenZavdannia {
  const [b, k] = [r.krim(-9, 9, [0]), r.krim(-6, 6, [0])];
  return {
    pytannia: `У якій точці осі $y$ графік $y = ${tex([b, k])}$ перетинає цю вісь? Впиши $y$.`,
    vidpovid: ch(b),
    pidkazka: 'На осі y абсциса x = 0. Підстав x = 0.',
    rozviazok: `y(0) = ${ch(k)} · 0 + ${tvd(b)} = ${ch(b)}`,
  };
}

function osX(r: Vypadok): TrenZavdannia {
  const k = r.krim(-6, 6, [0]);
  const x = r.krim(-8, 8, [0]);
  const b = -k * x;
  return {
    pytannia: `При якому $x$ графік $y = ${tex([b, k])}$ перетинає вісь $x$?`,
    vidpovid: ch(x),
    pidkazka: `На осі x ордината y = 0. Розв’яжи ${tex([b, k]).replace(/-/g, '−')} = 0.`,
    rozviazok: `${ch(k)}x = ${ch(-b)}; x = ${ch(-b)} : ${tvd(k)} = ${ch(x)}`,
  };
}

function zrostaie(r: Vypadok): TrenZavdannia {
  const [b, k] = [r.chyslo(-9, 9), r.krim(-9, 9, [0])];
  return {
    pytannia: `Функція $y = ${tex([b, k])}$ зростає чи спадає?`,
    vidpovid: k > 0 ? 'зростає' : 'спадає',
    varianty: ['зростає', 'спадає'],
    pidkazka: 'Подивись на знак k — числа перед x.',
    rozviazok: `k = ${ch(k)} ${k > 0 ? '> 0 — зростає' : '< 0 — спадає'}.`,
  };
}

function kZaTochkoiu(r: Vypadok): TrenZavdannia {
  const [k, b] = [r.krim(-6, 6, [0]), r.krim(-9, 9, [0])];
  const x = r.krim(-4, 5, [0]);
  const y = k * x + b;
  if (r.shans()) {
    return {
      pytannia: `Пряма $y = kx ${b < 0 ? '-' : '+'} ${Math.abs(b)}$ проходить через точку $(${tz(x)};\\, ${tz(y)})$. Знайди $k$.`,
      vidpovid: ch(k),
      nevidome: '$k$',
      pidkazka: `Підстав x = ${ch(x)}, y = ${ch(y)}: ${ch(y)} = k · ${tvd(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}.`,
      rozviazok: `k · ${tvd(x)} = ${ch(y)} − ${tvd(b)} = ${ch(y - b)}; k = ${ch(y - b)} : ${tvd(x)} = ${ch(k)}`,
    };
  }
  return {
    pytannia: `Пряма $y = ${k === 1 ? '' : k === -1 ? '-' : tz(k)}x + b$ проходить через точку $(${tz(x)};\\, ${tz(y)})$. Знайди $b$.`,
    vidpovid: ch(b),
    nevidome: '$b$',
    pidkazka: `Підстав x = ${ch(x)}, y = ${ch(y)}.`,
    rozviazok: `b = ${ch(y)} − ${tvd(k)} · ${tvd(x)} = ${ch(y)} − ${tvd(k * x)} = ${ch(b)}`,
  };
}

function dviTochky(r: Vypadok): TrenZavdannia {
  const [k, b] = [r.krim(-5, 5, [0]), r.krim(-9, 9, [0])];
  const x2 = r.krim(-4, 4, [0]);
  const y2 = k * x2 + b;
  return {
    pytannia: `Пряма $y = kx + b$ проходить через точки $(0;\\, ${tz(b)})$ і $(${tz(x2)};\\, ${tz(y2)})$. Знайди $k$.`,
    vidpovid: ch(k),
    nevidome: '$k$',
    pidkazka: `Точка (0; ${ch(b)}) на осі y, тож b = ${ch(b)}. Тоді ${ch(y2)} = k · ${tvd(x2)} + ${tvd(b)}.`,
    rozviazok: `b = ${ch(b)}; k · ${tvd(x2)} = ${ch(y2)} − ${tvd(b)} = ${ch(y2 - b)}; k = ${ch(y2 - b)} : ${tvd(x2)} = ${ch(k)}`,
  };
}

export default {
  rivni: ['перетин з осями', 'зростає чи спадає, k за точкою', 'k і b за точками'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? osY(r) : osX(r);
    if (riven === 2) return r.vybir([zrostaie, kZaTochkoiu, kZaTochkoiu, osX])(r);
    return r.vybir([dviTochky, dviTochky, kZaTochkoiu])(r);
  },
} satisfies Henerator;
