// Подвійне зведення до одиниці: робота залежить і від кількості виконавців, і від часу. Зводимо по черзі:
// A : n₁ : t₁ — один за одиницю часу, потім · n₂ · t₂; або шукаємо час: A₂ : (u · n₂). Типова помилка —
// звести лише одну величину.
import { ch, mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Sytuatsiia {
  formy: [string, string, string];
  odyn: string;
  robliat: string;
  zroblyat: string;
  robyt: string;
  shcho: (a: number) => string;
  pytSkilky: string;
  chas: (t: number) => string;
  odynChas: string;
  zaSkilky: string;
  /** Окреме формулювання питання про час, якщо загальне не годиться. */
  pytChas?: (n: number, a: number) => string;
  u: [number, number, number];
  odRoboty?: string;
  odChasu?: string;
}

const dni = (t: number) => skilky(t, 'день', 'дні', 'днів');
const khv = (t: number) => `${t} хв`;

const SYTUATSII: Sytuatsiia[] = [
  {
    formy: ['корова', 'корови', 'корів'],
    odyn: 'одна корова',
    robliat: 'з’їдають',
    zroblyat: 'з’їдять',
    robyt: 'з’їдає',
    shcho: (a) => `${ch(a)} кг сіна`,
    pytSkilky: 'Скільки кілограмів сіна',
    chas: dni,
    odynChas: 'за один день',
    zaSkilky: 'На скільки днів',
    pytChas: (n, a) => `На скільки днів вистачить ${ch(a)} кг сіна для ${n} ${mnozh(n, 'корови', 'корів', 'корів')}?`,
    u: [4, 9, 1],
    odRoboty: 'кг',
  },
  {
    formy: ['насос', 'насоси', 'насосів'],
    odyn: 'один насос',
    robliat: 'викачують',
    zroblyat: 'викачають',
    robyt: 'викачує',
    shcho: (a) => `${ch(a)} л води`,
    pytSkilky: 'Скільки літрів води',
    chas: khv,
    odynChas: 'за одну хвилину',
    zaSkilky: 'За скільки хвилин',
    u: [20, 80, 10],
    odRoboty: 'л',
    odChasu: 'хв',
  },
  {
    formy: ['робітник', 'робітники', 'робітників'],
    odyn: 'один робітник',
    robliat: 'виготовляють',
    zroblyat: 'виготовлять',
    robyt: 'виготовляє',
    shcho: (a) => skilky(a, 'деталь', 'деталі', 'деталей'),
    pytSkilky: 'Скільки деталей',
    chas: dni,
    odynChas: 'за один день',
    zaSkilky: 'За скільки днів',
    u: [10, 40, 5],
  },
  {
    formy: ['принтер', 'принтери', 'принтерів'],
    odyn: 'один принтер',
    robliat: 'друкують',
    zroblyat: 'надрукують',
    robyt: 'друкує',
    shcho: (a) => skilky(a, 'сторінку', 'сторінки', 'сторінок'),
    pytSkilky: 'Скільки сторінок',
    chas: khv,
    odynChas: 'за одну хвилину',
    zaSkilky: 'За скільки хвилин',
    u: [10, 30, 5],
    odChasu: 'хв',
  },
  {
    formy: ['майстриня', 'майстрині', 'майстринь'],
    odyn: 'одна майстриня',
    robliat: 'в’яжуть',
    zroblyat: 'зв’яжуть',
    robyt: 'в’яже',
    shcho: (a) => skilky(a, 'шарф', 'шарфи', 'шарфів'),
    pytSkilky: 'Скільки шарфів',
    chas: dni,
    odynChas: 'за один день',
    zaSkilky: 'За скільки днів',
    u: [1, 3, 1],
  },
];

const nazva = (s: Sytuatsiia, n: number) => `${n} ${mnozh(n, ...s.formy)}`;
const taki = (s: Sytuatsiia, n: number) => `${n} ${mnozh(n, '', 'такі', 'таких')} ${mnozh(n, ...s.formy)}`; // n ≥ 2

function dani(r: Vypadok) {
  const s = r.vybir(SYTUATSII);
  const [vid, do_, krok] = s.u;
  const u = vid + krok * r.chyslo(0, (do_ - vid) / krok);
  const [n1, t1] = [r.chyslo(2, 6), r.chyslo(2, 6)];
  const n2 = r.krim(2, 8, [n1]);
  const t2 = r.krim(2, 9, [t1]);
  return { s, u, n1, t1, n2, t2, a: u * n1 * t1, a2: u * n2 * t2 };
}

const umova = (s: Sytuatsiia, n: number, t: number, a: number) => `${nazva(s, n)} за ${s.chas(t)} ${s.robliat} ${s.shcho(a)}.`;

function odyn(r: Vypadok): TrenZavdannia {
  const { s, u, n1, t1, a } = dani(r);
  return {
    pytannia: `${umova(s, n1, t1, a)} ${s.pytSkilky} ${s.robyt} ${s.odyn} ${s.odynChas}?`,
    vidpovid: u,
    odynytsi: s.odRoboty,
    pidkazka: `Спершу ${s.odyn} за ${s.chas(t1)}: ${ch(a)} : ${n1}.`,
    rozviazok: `${ch(a)} : ${n1} = ${u * t1} — ${s.odyn} за ${s.chas(t1)}; ${u * t1} : ${t1} = ${u} — ${s.odynChas}.`,
  };
}

function robota(r: Vypadok): TrenZavdannia {
  const { s, u, n1, t1, n2, t2, a, a2 } = dani(r);
  return {
    pytannia: `${umova(s, n1, t1, a)} ${s.pytSkilky} ${s.zroblyat} ${taki(s, n2)} за ${s.chas(t2)}?`,
    vidpovid: a2,
    odynytsi: s.odRoboty,
    pidkazka: `Зведи по черзі: спершу ${s.odyn} за ${s.chas(t1)}, потім ${s.odynChas}.`,
    rozviazok: `${ch(a)} : ${n1} = ${u * t1}, ${u * t1} : ${t1} = ${u} — ${s.odyn} ${s.odynChas}; ${u} · ${n2} = ${u * n2}, ${u * n2} · ${t2} = ${ch(a2)}. Перевірка: ${ch(a2)} : ${n2} : ${t2} = ${u} ✓`,
  };
}

function chas(r: Vypadok): TrenZavdannia {
  const { s, u, n1, t1, n2, t2, a, a2 } = dani(r);
  return {
    pytannia: `${umova(s, n1, t1, a)} ${s.pytChas ? s.pytChas(n2, a2) : `${s.zaSkilky} ${taki(s, n2)} ${s.zroblyat} ${s.shcho(a2)}?`}`,
    vidpovid: t2,
    odynytsi: s.odChasu,
    pidkazka: `Знайди, скільки робить ${s.odyn} ${s.odynChas}, а потім — ${nazva(s, n2)} разом ${s.odynChas}.`,
    rozviazok: `${ch(a)} : ${n1} : ${t1} = ${u} — ${s.odyn} ${s.odynChas}; ${u} · ${n2} = ${u * n2} — ${nazva(s, n2)} ${s.odynChas}; ${ch(a2)} : ${u * n2} = ${t2}.`,
  };
}

function pomylka(r: Vypadok): TrenZavdannia {
  const { s, u, n1, t1, n2, t2, a, a2 } = dani(r);
  const pravylno = r.shans(0.4);
  const zapys = pravylno ? `${ch(a)} : ${n1} : ${t1} · ${n2} · ${t2} = ${ch(a2)}` : `${ch(a)} : ${n1} · ${n2} = ${ch(u * t1 * n2)}`;
  return {
    pytannia: `${umova(s, n1, t1, a)} Петро порахував, скільки ${s.zroblyat} ${taki(s, n2)} за ${s.chas(t2)}: ${zapys}. Чи правильно?`,
    vidpovid: pravylno ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Чи врахував Петро і кількість, і час?',
    rozviazok: pravylno
      ? `Так: ${ch(a)} : ${n1} : ${t1} = ${u} — ${s.odyn} ${s.odynChas}, потім · ${n2} і · ${t2}.`
      : `Ні. ${ch(u * t1 * n2)} — це ${nazva(s, n2)} за ${s.chas(t1)}, а час Петро не врахував. Правильно: ${ch(a)} : ${n1} : ${t1} · ${n2} · ${t2} = ${ch(a2)}.`,
  };
}

export default {
  rivni: ['один за одиницю часу', 'зводимо двічі', 'шукаємо час і помилку'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? odyn(r) : robota(r);
    if (riven === 2) return r.shans(0.8) ? robota(r) : odyn(r);
    return r.vybir([chas, chas, pomylka, robota])(r);
  },
} satisfies Henerator;
