// Спільна робота: продуктивності додаються (час — ні); A = (p₁ + p₂) · t, t = A : (p₁ + p₂);
// прихована продуктивність (робота : час); продуктивність другого за спільною.
import { ch, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Sytuatsiia {
  pershyi: string;
  druhyi: string;
  dva: string;
  robyt: string;
  robliat: string;
  zrobliat: string;
  zrobyv: string;
  zrobyly: string;
  shcho: (n: number) => string;
  pytSkilky: string;
  za: string;
  chas: (t: number) => string;
  zaSkilky: string;
  p: [number, number, number];
  odRoboty?: string;
  odChasu?: string;
}

const dni = (t: number) => skilky(t, 'день', 'дні', 'днів');
const khv = (t: number) => `${t} хв`;

const SYTUATSII: Sytuatsiia[] = [
  {
    pershyi: 'Один насос',
    druhyi: 'другий',
    dva: 'Два насоси',
    robyt: 'викачує',
    robliat: 'викачують',
    zrobliat: 'викачають',
    zrobyv: 'викачав',
    zrobyly: 'викачали',
    shcho: (n) => `${ch(n)} л води`,
    pytSkilky: 'Скільки літрів води',
    za: 'за хвилину',
    chas: khv,
    zaSkilky: 'За скільки хвилин',
    p: [20, 60, 5],
    odRoboty: 'л',
    odChasu: 'хв',
  },
  {
    pershyi: 'Один принтер',
    druhyi: 'другий',
    dva: 'Два принтери',
    robyt: 'друкує',
    robliat: 'друкують',
    zrobliat: 'надрукують',
    zrobyv: 'надрукував',
    zrobyly: 'надрукували',
    shcho: (n) => skilky(n, 'сторінку', 'сторінки', 'сторінок'),
    pytSkilky: 'Скільки сторінок',
    za: 'за хвилину',
    chas: khv,
    zaSkilky: 'За скільки хвилин',
    p: [10, 30, 1],
    odChasu: 'хв',
  },
  {
    pershyi: 'Один трактор',
    druhyi: 'другий',
    dva: 'Два трактори',
    robyt: 'оре',
    robliat: 'орють',
    zrobliat: 'виорють',
    zrobyv: 'виорав',
    zrobyly: 'виорали',
    shcho: (n) => `${ch(n)} га`,
    pytSkilky: 'Скільки гектарів',
    za: 'за день',
    chas: dni,
    zaSkilky: 'За скільки днів',
    p: [5, 15, 1],
    odRoboty: 'га',
  },
  {
    pershyi: 'Одна бригада',
    druhyi: 'друга',
    dva: 'Дві бригади',
    robyt: 'асфальтує',
    robliat: 'асфальтують',
    zrobliat: 'заасфальтують',
    zrobyv: 'заасфальтувала',
    zrobyly: 'заасфальтували',
    shcho: (n) => `${ch(n)} м дороги`,
    pytSkilky: 'Скільки метрів дороги',
    za: 'за день',
    chas: dni,
    zaSkilky: 'За скільки днів',
    p: [100, 400, 50],
    odRoboty: 'м',
  },
  {
    pershyi: 'Одна майстриня',
    druhyi: 'друга',
    dva: 'Дві майстрині',
    robyt: 'шиє',
    robliat: 'шиють',
    zrobliat: 'пошиють',
    zrobyv: 'пошила',
    zrobyly: 'пошили',
    shcho: (n) => skilky(n, 'сумку', 'сумки', 'сумок'),
    pytSkilky: 'Скільки сумок',
    za: 'за день',
    chas: dni,
    zaSkilky: 'За скільки днів',
    p: [3, 9, 1],
  },
];

function dani(r: Vypadok) {
  const s = r.vybir(SYTUATSII);
  const [vid, do_, krok] = s.p;
  const [i, j] = r.rizni(2, vid / krok, do_ / krok);
  return { s, p1: i * krok, p2: j * krok, t: r.chyslo(2, 8) };
}

const umova = (s: Sytuatsiia, p1: number, p2: number) =>
  `${s.pershyi} ${s.robyt} ${s.shcho(p1)} ${s.za}, ${s.druhyi} — ${s.shcho(p2)}.`;

function razomZaOdynytsiu(r: Vypadok): TrenZavdannia {
  const { s, p1, p2 } = dani(r);
  return {
    pytannia: `${umova(s, p1, p2)} ${s.pytSkilky} вони ${s.zrobliat} разом ${s.za}?`,
    vidpovid: p1 + p2,
    odynytsi: s.odRoboty,
    pidkazka: 'Працюють одночасно — продуктивності додаються.',
    rozviazok: `${p1} + ${p2} = ${p1 + p2}`,
  };
}

function robota(r: Vypadok): TrenZavdannia {
  const { s, p1, p2, t } = dani(r);
  const A = (p1 + p2) * t;
  return {
    pytannia: `${umova(s, p1, p2)} ${s.pytSkilky} вони ${s.zrobliat} разом за ${s.chas(t)}?`,
    vidpovid: A,
    odynytsi: s.odRoboty,
    pidkazka: `Спершу разом ${s.za}: ${p1} + ${p2}. Потім помнож на час.`,
    rozviazok: `(${p1} + ${p2}) · ${t} = ${p1 + p2} · ${t} = ${ch(A)}`,
  };
}

function chas(r: Vypadok): TrenZavdannia {
  const { s, p1, p2, t } = dani(r);
  const A = (p1 + p2) * t;
  return {
    pytannia: `${umova(s, p1, p2)} ${s.zaSkilky} вони разом ${s.zrobliat} ${s.shcho(A)}?`,
    vidpovid: t,
    odynytsi: s.odChasu,
    pidkazka: 'Час = вся робота : (p₁ + p₂). Час не додаємо — додаємо продуктивності.',
    rozviazok: `${ch(A)} : (${p1} + ${p2}) = ${ch(A)} : ${p1 + p2} = ${t}. Перевірка: ${p1} · ${t} + ${p2} · ${t} = ${ch(A)} ✓`,
  };
}

function prykhovana(r: Vypadok): TrenZavdannia {
  const { s, p1, p2, t } = dani(r);
  const [t1, t2] = [r.chyslo(2, 6), r.chyslo(2, 6)];
  const A = (p1 + p2) * t;
  return {
    pytannia: `${s.pershyi} за ${s.chas(t1)} ${s.zrobyv} ${s.shcho(p1 * t1)}, ${s.druhyi} за ${s.chas(t2)} — ${s.shcho(p2 * t2)}. ${s.pytSkilky} вони ${s.zrobliat} разом за ${s.chas(t)}?`,
    vidpovid: A,
    odynytsi: s.odRoboty,
    pidkazka: `Спершу знайди, скільки кожен робить ${s.za}: робота : час.`,
    rozviazok: `${ch(p1 * t1)} : ${t1} = ${p1}, ${ch(p2 * t2)} : ${t2} = ${p2} — ${s.za}; (${p1} + ${p2}) · ${t} = ${ch(A)}`,
  };
}

function druhyi(r: Vypadok): TrenZavdannia {
  const { s, p1, p2, t } = dani(r);
  if (r.shans()) {
    return {
      pytannia: `${s.dva} разом ${s.robliat} ${s.shcho(p1 + p2)} ${s.za}. ${zVelykoiPershyi(s)} ${s.robyt} ${s.shcho(p1)}. ${s.pytSkilky} ${s.robyt} ${s.druhyi} ${s.za}?`,
      vidpovid: p2,
      odynytsi: s.odRoboty,
      pidkazka: 'Від спільної продуктивності відніми продуктивність першого.',
      rozviazok: `${p1 + p2} − ${p1} = ${p2}`,
    };
  }
  const A = (p1 + p2) * t;
  return {
    pytannia: `${s.dva} разом за ${s.chas(t)} ${s.zrobyly} ${s.shcho(A)}. ${zVelykoiPershyi(s)} ${s.robyt} ${s.shcho(p1)} ${s.za}. ${s.pytSkilky} ${s.robyt} ${s.druhyi} ${s.za}?`,
    vidpovid: p2,
    odynytsi: s.odRoboty,
    pidkazka: `Спершу знайди, скільки вони роблять разом ${s.za}.`,
    rozviazok: `${ch(A)} : ${t} = ${p1 + p2} — разом ${s.za}; ${p1 + p2} − ${p1} = ${p2}`,
  };
}

/** «Один насос» → «Перший», «Одна бригада» → «Перша». */
const zVelykoiPershyi = (s: Sytuatsiia) => (s.druhyi === 'друга' ? 'Перша' : 'Перший');

export default {
  rivni: ['разом за одиницю часу', 'скільки зроблять і за який час', 'прихована продуктивність'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? razomZaOdynytsiu(r) : robota(r);
    if (riven === 2) return r.vybir([robota, chas, chas])(r);
    return r.vybir([prykhovana, prykhovana, druhyi, chas])(r);
  },
} satisfies Henerator;
