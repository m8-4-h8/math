// Розкриття дужок і подібні доданки: множник перед дужками множимо на кожен доданок (з його знаком);
// мінус перед дужками змінює знаки всіх доданків; подібні доданки — додаємо коефіцієнти; значення виразу
// після спрощення.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'n'];
const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
/** Коефіцієнт перед буквою: 1 → «», −1 → «-», 3 → «3». */
const koef = (k: number, b: string) => (k === 1 ? b : k === -1 ? `-${b}` : `${tz(k)}${b}`);
/** Доданок зі знаком для продовження виразу: « + 5», « - 5», « + 3x». */
const dalі = (k: number, b = '') => (k < 0 ? ` - ${koef(-k, b) || -k}` : ` + ${koef(k, b) || k}`);
const tekst = (s: string) => s.replace(/-/g, '−');

function mnozhnyk(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const k = r.krim(-9, 9, [0, 1, -1]);
  const a = r.chyslo(1, 6);
  const c = r.krim(-9, 9, [0]);
  const [p1, p2] = [k * a, k * c];
  const zliva = `${tz(k)}(${koef(a, b)}${dalі(c)})`;
  if (r.shans()) {
    return {
      pytannia: 'Розкрий дужки. Яке число має стояти замість квадратика?',
      vyraz: `$${zliva} = ${koef(p1, b)} ${p2 < 0 ? '-' : '+'} \\square$`,
      vidpovid: Math.abs(p2),
      pidkazka: `Помнож ${ch(k)} на ${ch(c)}.`,
      rozviazok: `${ch(k)} · ${c < 0 ? `(${ch(c)})` : c} = ${ch(p2)}, тож ${tekst(`${koef(p1, b)}${dalі(p2)}`)}.`,
    };
  }
  return {
    pytannia: `Розкрий дужки. Який коефіцієнт при ${b}?`,
    vyraz: `$${zliva} = \\square ${b}${dalі(p2)}$`,
    vidpovid: ch(p1),
    pidkazka: `Помнож ${ch(k)} на ${a}${b}.`,
    rozviazok: `${ch(k)} · ${a} = ${ch(p1)}, тож ${tekst(`${koef(p1, b)}${dalі(p2)}`)}.`,
  };
}

function minus(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const c = r.chyslo(1, 12);
  const pershaBukva = r.shans();
  const plius = r.shans();
  // −(c − b), −(c + b), −(b − c), −(b + c)
  const vseredyni = pershaBukva ? `${b} ${plius ? '+' : '-'} ${c}` : `${c} ${plius ? '+' : '-'} ${b}`;
  const pravylno = pershaBukva ? `-${b} ${plius ? '-' : '+'} ${c}` : `-${c} ${plius ? '-' : '+'} ${b}`;
  const bezZminy = pershaBukva ? `-${b} ${plius ? '+' : '-'} ${c}` : `-${c} ${plius ? '+' : '-'} ${b}`;
  const vtrachenyiMinus = pershaBukva ? `${b} ${plius ? '-' : '+'} ${c}` : `${c} ${plius ? '-' : '+'} ${b}`;
  return {
    pytannia: `Розкрий дужки: $-(${vseredyni})$`,
    vidpovid: tekst(pravylno),
    varianty: r.peremishaty([pravylno, bezZminy, vtrachenyiMinus].map(tekst)),
    pidkazka: 'Мінус перед дужками змінює знак КОЖНОГО доданка.',
    rozviazok: `Кожен знак змінюємо на протилежний: ${tekst(pravylno)}.`,
  };
}

function podibni(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const k = Array.from({ length: r.chyslo(3, 4) }, () => r.krim(-9, 9, [0]));
  if (k[0] < 0) k[0] = -k[0];
  const s = k.reduce((x, y) => x + y, 0);
  if (s === 0) return podibni(r);
  const vyraz = k.map((v, i) => (i === 0 ? koef(v, b) : dalі(v, b))).join('');
  return {
    pytannia: 'Зведи подібні доданки. Яке число замість квадратика?',
    vyraz: `$${vyraz} = \\square ${b}$`,
    vidpovid: ch(s),
    pidkazka: 'Додай коефіцієнти з їхніми знаками.',
    rozviazok: `${k.map((v, i) => (i === 0 ? ch(v) : v < 0 ? `(${ch(v)})` : v)).join(' + ')} = ${ch(s)}, тож ${tekst(koef(s, b))}.`,
  };
}

function znachennia(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const k = r.chyslo(2, 6);
  const c = r.krim(-6, 6, [0]);
  const m = r.krim(-5, 5, [0, k]);
  const n = r.krim(-6, 6, [0]);
  // k(b + c) − m·b → (k − m)b + kc
  const kx = k - m;
  const vilnyi = k * c;
  const zn = kx * n + vilnyi;
  return {
    pytannia: `Спрости вираз і знайди його значення при $${b} = ${tz(n)}$.`,
    vyraz: `$${k}(${b}${dalі(c)})${dalі(-m, b)}$`,
    vidpovid: ch(zn),
    pidkazka: `Спершу розкрий дужки і зведи подібні: вийде ${tekst(`${koef(kx, b) || '0'}${dalі(vilnyi)}`)}.`,
    rozviazok: `${tekst(`${koef(k, b)}${dalі(vilnyi)}${dalі(-m, b)} = ${koef(kx, b) || '0'}${dalі(vilnyi)}`)}; ${ch(kx)} · ${n < 0 ? `(${ch(n)})` : n} + ${vilnyi < 0 ? `(${ch(vilnyi)})` : vilnyi} = ${ch(zn)}.`,
  };
}

export default {
  rivni: ['множник перед дужками', 'мінус перед дужками, подібні доданки', 'спрости і знайди значення'],
  zavdannia(r, riven) {
    if (riven === 1) return mnozhnyk(r);
    if (riven === 2) return r.vybir([minus, podibni, podibni, mnozhnyk])(r);
    return r.vybir([znachennia, znachennia, podibni, minus])(r);
  },
} satisfies Henerator;
