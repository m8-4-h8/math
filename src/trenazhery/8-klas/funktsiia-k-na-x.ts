// Функція y = k/x (обернена пропорційність): значення за x, k = x · y за точкою, чи лежить точка на графіку,
// чверті за знаком k, k за малюнком гіперболи, задачі з життя (швидкість і час, робітники й дні, площа).
import { ch, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tvd, tz } from '../alhebra.ts';
import { hiperbola } from '../hiperbola.ts';

/** y = 12/x або y = −12/x — для формули в $...$. */
const fk = (k: number) => `y = ${k < 0 ? '-' : ''}\\dfrac{${Math.abs(k)}}{x}`;
/** Те саме для кнопок і звичайного тексту. */
const fkT = (k: number) => `y = ${k < 0 ? '−' : ''}${Math.abs(k)}/x`;
const tochka = (x: number, y: number) => `$(${tz(x)};\\, ${tz(y)})$`;

/** Точка (x; y) з цілими координатами, |k| = |x · y| від 2 до maxK. */
function para(r: Vypadok, maxX: number, maxY: number, maxK: number): [number, number, number] {
  for (;;) {
    const x = r.krim(-maxX, maxX, [-1, 0, 1]);
    const y = r.krim(-maxY, maxY, [-1, 0, 1]);
    const k = x * y;
    if (Math.abs(k) >= 2 && Math.abs(k) <= maxK) return [x, y, k];
  }
}

function znachennia(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 9, 12, 96);
  return {
    pytannia: `$${fk(k)}$. Знайди $y$, якщо $x = ${tz(x)}$.`,
    vidpovid: ch(y),
    nevidome: '$y$',
    pidkazka: `Підстав x = ${ch(x)}: поділи ${ch(k)} на ${tvd(x)}.`,
    rozviazok: `y = ${ch(k)} : ${tvd(x)} = ${ch(y)}. Перевірка: ${tvd(x)} · ${tvd(y)} = ${ch(k)}`,
  };
}

function kZaTochkoiu(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 9, 12, 96);
  return {
    pytannia: `Графік функції $y = \\dfrac{k}{x}$ проходить через точку ${tochka(x, y)}. Знайди $k$.`,
    vidpovid: ch(k),
    nevidome: '$k$',
    pidkazka: 'Для кожної точки графіка k = x · y.',
    rozviazok: `k = ${tvd(x)} · ${tvd(y)} = ${ch(k)}, тобто ${fkT(k)}.`,
  };
}

function xZaY(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 9, 12, 96);
  return {
    pytannia: `$${fk(k)}$. При якому $x$ значення $y = ${tz(y)}$?`,
    vidpovid: ch(x),
    nevidome: '$x$',
    pidkazka: `${ch(k)} = x · ${tvd(y)}. Знайди x діленням.`,
    rozviazok: `x = ${ch(k)} : ${tvd(y)} = ${ch(x)}. Перевірка: ${ch(k)} : ${tvd(x)} = ${ch(y)}`,
  };
}

function chverti(r: Vypadok): TrenZavdannia {
  const k = r.krim(-30, 30, [-1, 0, 1]);
  const vidp = k > 0 ? 'I і III' : 'II і IV';
  return {
    pytannia: `У яких чвертях лежить графік функції $${fk(k)}$?`,
    vidpovid: vidp,
    varianty: ['I і III', 'II і IV', 'I і II', 'III і IV'],
    pidkazka: 'k = x · y. Який знак у k? Тоді x і y одного чи різних знаків?',
    rozviazok:
      k > 0
        ? `k = ${k} > 0, тож x і y одного знака: (+; +) — I чверть, (−; −) — III.`
        : `k = ${ch(k)} < 0, тож x і y різних знаків: (−; +) — II чверть, (+; −) — IV.`,
  };
}

function chyLezhyt(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 8, 9, 60);
  // Хибні точки — з типовою помилкою: протилежний знак або «k = y : x» (точка (x; k · x)).
  const typ = r.vybir(['tak', 'tak', 'znak', 'chastka'] as const);
  let [tx, ty] = [x, y];
  if (typ === 'znak') ty = -y;
  if (typ === 'chastka') {
    tx = r.vybir([-3, -2, 2, 3]);
    ty = k * tx;
    if (Math.abs(ty) > 60) return chyLezhyt(r);
  }
  const lezhyt = tx * ty === k;
  return {
    pytannia: `Чи лежить точка ${tochka(tx, ty)} на графіку функції $${fk(k)}$?`,
    vidpovid: lezhyt ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Порівняй добуток координат точки з k = ${ch(k)}.`,
    rozviazok: `${tvd(tx)} · ${tvd(ty)} = ${ch(tx * ty)}${lezhyt ? ` — дорівнює k, точка лежить на графіку.` : `, а k = ${ch(k)} — не лежить.`}`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 5, 5, 25);
  if (Math.abs(x) === Math.abs(y) && r.shans(0.6)) return zaMalunkom(r);
  return {
    pytannia: 'На малюнку — графік функції $y = \\dfrac{k}{x}$ і точка на ньому. Знайди $k$.',
    malunok: hiperbola({ k, tochky: [{ x, y, punktyr: true }] }),
    vidpovid: ch(k),
    nevidome: '$k$',
    pidkazka: 'Прочитай координати точки за пунктиром до осей і перемнож їх.',
    rozviazok: `Точка (${ch(x)}; ${ch(y)}), тож k = ${tvd(x)} · ${tvd(y)} = ${ch(k)}. Вітки в ${k > 0 ? 'I і III' : 'II і IV'} чвертях — знак k збігається.`,
  };
}

function formulaVaryanty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [x, y, k] = para(r, 6, 9, 54);
    const chastka = y / x;
    // Варіант «y : x» має бути цілим і відмінним від k, а «x + y» — ще одним хибним.
    if (!Number.isInteger(chastka) || chastka === k || Math.abs(chastka) < 2) continue;
    const suma = x + y;
    if ([k, chastka].includes(suma) || Math.abs(suma) < 2) continue;
    return {
      pytannia: `Графік оберненої пропорційності проходить через точку ${tochka(x, y)}. Яка це функція?`,
      vidpovid: fkT(k),
      varianty: r.peremishaty([fkT(k), fkT(chastka), fkT(suma)]),
      pidkazka: 'k = x · y, а не y : x.',
      rozviazok: `k = ${tvd(x)} · ${tvd(y)} = ${ch(k)}, тож ${fkT(k)}. Частка y : x = ${ch(chastka)} — це k для прямої пропорційності y = kx.`,
    };
  }
}

function monotonnist(r: Vypadok): TrenZavdannia {
  const vitka = r.shans() ? 'x > 0' : 'x < 0';
  const x1 = r.chyslo(1, 3);
  const x2 = x1 * r.chyslo(2, 3);
  // k ділиться на x2 (а отже й на x1), щоб у поясненні значення були цілими.
  const k = (r.shans() ? 1 : -1) * x2 * r.chyslo(1, 6);
  if (Math.abs(k) < 2) return monotonnist(r);
  const [a, b] = vitka === 'x > 0' ? [x1, x2] : [-x2, -x1];
  return {
    pytannia: `Функція $${fk(k)}$ на проміжку $${vitka}$ зростає чи спадає?`,
    vidpovid: k > 0 ? 'спадає' : 'зростає',
    varianty: ['зростає', 'спадає'],
    pidkazka: `Візьми два значення x на цьому проміжку, наприклад ${ch(a)} і ${ch(b)}, і порівняй y.`,
    rozviazok: `x = ${ch(a)} дає y = ${ch(k / a)}, а більше x = ${ch(b)} дає y = ${ch(k / b)} — значення ${k > 0 ? 'менше' : 'більше'}. Так буде на всій вітці: при k ${k > 0 ? '> 0 функція спадає' : '< 0 функція зростає'}.`,
  };
}

function dviTochky(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [x1, y1, k] = para(r, 8, 9, 72);
    const x2 = r.krim(-12, 12, [0, x1]);
    if (k % x2) continue;
    const y2 = k / x2;
    return {
      pytannia: `Графік функції $y = \\dfrac{k}{x}$ проходить через точку ${tochka(x1, y1)}. Знайди $y$, якщо $x = ${tz(x2)}$.`,
      vidpovid: ch(y2),
      nevidome: '$y$',
      pidkazka: 'Спершу знайди k = x · y за відомою точкою.',
      rozviazok: `k = ${tvd(x1)} · ${tvd(y1)} = ${ch(k)}; y = ${ch(k)} : ${tvd(x2)} = ${ch(y2)}.`,
    };
  }
}

function abscysa(r: Vypadok): TrenZavdannia {
  const [x, y, k] = para(r, 9, 12, 96);
  const [b] = r.vybir([['A'], ['B'], ['M'], ['P']]);
  return {
    pytannia: `Точка $${b}(a;\\, ${tz(y)})$ лежить на графіку функції $${fk(k)}$. Знайди $a$.`,
    vidpovid: ch(x),
    nevidome: '$a$',
    pidkazka: `Підстав y = ${ch(y)}: ${ch(y)} = ${ch(k)} : a.`,
    rozviazok: `a = ${ch(k)} : ${tvd(y)} = ${ch(x)}. Перевірка: ${ch(k)} : ${tvd(x)} = ${ch(y)}`,
  };
}

function zhyttia(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(1, 4);
  if (typ === 1) {
    // Швидкість і час: v1 · t1 = v2 · t2.
    for (;;) {
      const v1 = 10 * r.chyslo(4, 12);
      const t1 = r.chyslo(2, 6);
      const s = v1 * t1;
      const v2 = 10 * r.chyslo(4, 12);
      if (v2 === v1 || s % v2) continue;
      const t2 = s / v2;
      return {
        pytannia: `Автобус проїжджає відстань між містами за ${t1} год зі швидкістю ${v1} км/год. За скільки годин він проїде цю відстань зі швидкістю ${v2} км/год?`,
        vidpovid: t2,
        odynytsi: 'год',
        pidkazka: 'Відстань стала: швидкість · час = відстань. Знайди відстань.',
        rozviazok: `Відстань ${v1} · ${t1} = ${s} км. t = ${s} : ${v2} = ${t2} год. Швидкість ${v2 > v1 ? 'більша' : 'менша'} — часу ${v2 > v1 ? 'менше' : 'більше'}.`,
      };
    }
  }
  if (typ === 2) {
    // Робітники й дні: n1 · d1 = n2 · d2.
    for (;;) {
      const n1 = r.chyslo(2, 12);
      const d1 = r.chyslo(3, 20);
      const robota = n1 * d1;
      const d2 = r.krim(2, 20, [d1]);
      if (robota % d2) continue;
      const n2 = robota / d2;
      if (n2 > 40 || n2 === n1) continue;
      return {
        pytannia: `${skilky(n1, 'робітник', 'робітники', 'робітників')} виконують замовлення за ${skilky(d1, 'день', 'дні', 'днів')}. Скільки таких самих робітників потрібно, щоб виконати це замовлення за ${skilky(d2, 'день', 'дні', 'днів')}?`,
        vidpovid: n2,
        pidkazka: 'Уся робота — робітники · дні — стала. Порахуй її в «людино-днях».',
        rozviazok: `Уся робота: ${n1} · ${d1} = ${skilky(robota, 'людино-день', 'людино-дні', 'людино-днів')}. ${robota} : ${d2} = ${skilky(n2, 'робітник', 'робітники', 'робітників')}.`,
      };
    }
  }
  if (typ === 3) {
    // Площа прямокутника стала: a · b = S.
    for (;;) {
      const a = r.chyslo(2, 15);
      const b = r.chyslo(2, 15);
      const s = a * b;
      const a2 = r.krim(2, 30, [a, b]);
      if (s % a2 || s / a2 < 2) continue;
      return {
        pytannia: `Прямокутник має площу ${s} см², одна його сторона $a$ см, друга $b$ см, тож $b = \\dfrac{${s}}{a}$. Знайди $b$, якщо $a = ${a2}$ см.`,
        vidpovid: s / a2,
        odynytsi: 'см',
        pidkazka: `b = ${s} : a.`,
        rozviazok: `b = ${s} : ${a2} = ${s / a2} см. Перевірка: ${a2} · ${s / a2} = ${s}`,
      };
    }
  }
  // Ціна й кількість: на ту саму суму.
  for (;;) {
    const c1 = r.chyslo(4, 30);
    const n1 = r.chyslo(3, 12);
    const suma = c1 * n1;
    const c2 = r.krim(4, 40, [c1]);
    if (suma % c2) continue;
    const n2 = suma / c2;
    return {
      pytannia: `За гроші, які є в мами, можна купити ${skilky(n1, 'зошит', 'зошити', 'зошитів')} по ${c1} грн. Скільки зошитів по ${c2} грн можна купити за ці самі гроші?`,
      vidpovid: n2,
      pidkazka: 'Сума стала: ціна · кількість = сума. Знайди суму.',
      rozviazok: `Сума: ${c1} · ${n1} = ${suma} грн. ${suma} : ${c2} = ${skilky(n2, 'зошит', 'зошити', 'зошитів')}.`,
    };
  }
}

export default {
  rivni: ['значення й k', 'чверті, точки, графік', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([znachennia, znachennia, kZaTochkoiu, xZaY])(r);
    if (riven === 2) return r.vybir([chverti, chyLezhyt, chyLezhyt, zaMalunkom, formulaVaryanty, monotonnist])(r);
    return r.vybir([dviTochky, zhyttia, zhyttia, abscysa])(r);
  },
} satisfies Henerator;
