// Подібні доданки та їх зведення (Істер § 39): додаємо коефіцієнти подібних доданків; буквені й числові доданки
// зводимо окремо; спрощення виразу з дужками k(x + c) − (m·x + d); значення виразу після спрощення.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'n'];
const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
/** Коефіцієнт перед буквою: 1 → «x», −1 → «-x», 3 → «3x». */
const koef = (k: number, b: string) => (k === 1 ? b : k === -1 ? `-${b}` : `${tz(k)}${b}`);
/** Доданок зі знаком для продовження виразу: « + 5», « - 5», « + 3x». */
const dali = (k: number, b = '') => (k < 0 ? ` - ${b ? koef(-k, b) : -k}` : ` + ${b ? koef(k, b) : k}`);
const tekst = (s: string) => s.replace(/-/g, '−');
const vd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);
/** a·x + c як рядок для формули; без нульових частин. */
function vyrazAX(a: number, c: number, b: string) {
  if (a === 0) return tz(c);
  return c === 0 ? koef(a, b) : `${koef(a, b)}${dali(c)}`;
}

/** Лише буквені доданки: −5a + 4a − a = □a. */
function koeficienty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir(BUKVY);
    const k = Array.from({ length: r.chyslo(3, 4) }, () => r.krim(-9, 9, [0]));
    const s = k.reduce((x, y) => x + y, 0);
    if (s === 0) continue;
    const vyraz = k.map((v, i) => (i === 0 ? koef(v, b) : dali(v, b))).join('');
    return {
      pytannia: 'Зведи подібні доданки. Яке число замість квадратика?',
      vyraz: `$${vyraz} = \\square ${b}$`,
      vidpovid: ch(s),
      pidkazka: `Додай коефіцієнти з їхніми знаками. Пам’ятай: ${b} — це 1${b}.`,
      rozviazok: `${k.map((v, i) => (i === 0 ? ch(v) : vd(v))).join(' + ')} = ${ch(s)}, тож ${tekst(koef(s, b))}.`,
    };
  }
}

/** Буквені й числові доданки впереміш: вибери спрощений вираз. */
function zmishani(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir(BUKVY);
    const [a1, a2] = [r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
    const [c1, c2] = [r.krim(-12, 12, [0]), r.krim(-12, 12, [0])];
    const [a, c] = [a1 + a2, c1 + c2];
    if (a === 0 || c === 0) continue;
    const vyraz = `${koef(a1, b)}${dali(c1)}${dali(a2, b)}${dali(c2)}`;
    const pravylno = vyrazAX(a, c, b);
    const vsiRazom = koef(a + c, b);
    const znak = vyrazAX(a1 - a2, c, b);
    const varianty = new Set([pravylno, vsiRazom, znak]);
    if (varianty.size < 3) continue;
    return {
      pytannia: `Спрости: $${vyraz}$`,
      vidpovid: tekst(pravylno),
      varianty: r.peremishaty([...varianty].map(tekst)),
      pidkazka: `${b}-ки зводимо з ${b}-ками, числа — з числами.`,
      rozviazok: `${tekst(`${koef(a1, b)}${dali(a2, b)} = ${koef(a, b)}`)}; ${ch(c1)} + ${vd(c2)} = ${ch(c)}. Разом: ${tekst(pravylno)}.`,
    };
  }
}

/** k(x + c) − (m·x + d): розкрий дужки і зведи подібні. */
function zDuzhkamy(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir(BUKVY);
    const k = r.krim(-5, 6, [0, 1, -1]);
    const c = r.krim(-6, 6, [0]);
    const m = r.krim(-5, 5, [0]);
    const d = r.krim(-9, 9, [0]);
    const a = k - m;
    const vilnyi = k * c - d;
    if (a === 0 || vilnyi === 0) continue;
    const vyraz = `${tz(k)}(${b}${dali(c)}) - (${koef(m, b)}${dali(d)})`;
    const pravylno = vyrazAX(a, vilnyi, b);
    const bezZminy = vyrazAX(k + m, k * c + d, b); // знаки в других дужках не змінили
    const lyshePershyi = vyrazAX(a, c - d, b); // k помножили лише на x
    const varianty = new Set([pravylno, bezZminy, lyshePershyi]);
    if (varianty.size < 3) continue;
    const rozkryto = `${koef(k, b)}${dali(k * c)}${dali(-m, b)}${dali(-d)}`;
    return {
      pytannia: `Спрости вираз $${vyraz}$.`,
      vidpovid: tekst(pravylno),
      varianty: r.peremishaty([...varianty].map(tekst)),
      pidkazka: `Розкрий дужки: ${tekst(rozkryto)}. Потім зведи подібні.`,
      rozviazok: `${tekst(rozkryto)} = ${tekst(pravylno)}`,
    };
  }
}

/** Спрости і знайди значення: k(x + c) − m·x при x = n. */
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
  const sproshcheno = vyrazAX(kx, vilnyi, b);
  return {
    pytannia: `Спрости вираз і знайди його значення при $${b} = ${tz(n)}$.`,
    vyraz: `$${k}(${b}${dali(c)})${dali(-m, b)}$`,
    vidpovid: ch(zn),
    pidkazka: `Спершу розкрий дужки і зведи подібні: вийде ${tekst(sproshcheno)}.`,
    rozviazok: `${tekst(`${koef(k, b)}${dali(vilnyi)}${dali(-m, b)} = ${sproshcheno}`)}; ${ch(kx)} · ${vd(n)} + ${vd(vilnyi)} = ${ch(zn)}.`,
  };
}

export default {
  rivni: ['зведи подібні доданки', 'букви й числа окремо; розкрий дужки і зведи', 'спрости і знайди значення'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? koeficienty(r) : zmishani(r);
    if (riven === 2) return r.vybir([zmishani, zDuzhkamy, zDuzhkamy, koeficienty])(r);
    return r.vybir([znachennia, znachennia, zDuzhkamy])(r);
  },
} satisfies Henerator;
