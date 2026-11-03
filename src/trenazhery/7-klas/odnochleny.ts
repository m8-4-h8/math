// Одночлени: стандартний вигляд (число попереду, кожна буква один раз); коефіцієнт — разом зі знаком
// (−ab² має коефіцієнт −1); степінь — сума показників усіх букв; множення одночленів; піднесення до степеня.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tz, tvd } from '../alhebra.ts';

const PARY = [
  ['a', 'b'],
  ['x', 'y'],
  ['m', 'n'],
];

/** k · aᵖ · bᵠ для формули. */
function odnochlen(k: number, [a, b]: string[], p: number, q: number) {
  const st = (x: string, n: number) => (n === 0 ? '' : n === 1 ? x : `${x}^{${n}}`);
  const pochatok = k === 1 ? '' : k === -1 ? '-' : tz(k);
  return `${pochatok}${st(a, p)}${st(b, q)}`;
}

function koefStepin(r: Vypadok): TrenZavdannia {
  const bukvy = r.vybir(PARY);
  const k = r.vybir([r.krim(-12, 12, [0]), 1, -1]);
  const [p, q] = [r.chyslo(1, 5), r.chyslo(0, 4)];
  const o = odnochlen(k, bukvy, p, q);
  if (r.shans()) {
    return {
      pytannia: `Назви коефіцієнт одночлена $${o}$.`,
      vidpovid: ch(k),
      pidkazka: Math.abs(k) === 1 ? 'Перед буквами немає числа. Яке число так записують?' : 'Коефіцієнт — число перед буквами разом зі знаком.',
      rozviazok: `Коефіцієнт — ${ch(k)}.`,
    };
  }
  return {
    pytannia: `Назви степінь одночлена $${o}$.`,
    vidpovid: p + q,
    pidkazka: 'Додай показники всіх букв. Буква без показника — це показник 1.',
    rozviazok: q ? `${p} + ${q} = ${p + q}` : `Одна буква з показником ${p}: степінь ${p}.`,
  };
}

function dobutok(r: Vypadok): TrenZavdannia {
  const bukvy = r.vybir(PARY);
  const [k1, k2] = [r.krim(-6, 6, [0, 1]), r.krim(-6, 6, [0, 1])];
  const [p1, q1, p2, q2] = [r.chyslo(1, 4), r.chyslo(0, 3), r.chyslo(1, 3), r.chyslo(1, 4)];
  const zapys = `(${odnochlen(k1, bukvy, p1, q1)}) \\cdot (${odnochlen(k2, bukvy, p2, q2)})`;
  const rez = odnochlen(k1 * k2, bukvy, p1 + p2, q1 + q2);
  if (r.shans()) {
    return {
      pytannia: `Зведи до стандартного вигляду $${zapys}$. Який коефіцієнт вийшов?`,
      vidpovid: ch(k1 * k2),
      pidkazka: 'Перемнож лише числа.',
      rozviazok: `${ch(k1)} · ${tvd(k2)} = ${ch(k1 * k2)}; $${zapys} = ${rez}$`,
    };
  }
  return {
    pytannia: `Зведи до стандартного вигляду $${zapys}$. Який степінь вийшов?`,
    vidpovid: p1 + p2 + q1 + q2,
    pidkazka: `Однакові букви: показники додаємо. Потім додай показники всіх букв.`,
    rozviazok: `$${zapys} = ${rez}$; степінь: ${p1 + p2} + ${q1 + q2} = ${p1 + p2 + q1 + q2}`,
  };
}

function stepin(r: Vypadok): TrenZavdannia {
  const bukvy = r.vybir(PARY);
  const k = r.krim(-3, 3, [0, 1]);
  const n = r.chyslo(2, Math.abs(k) === 3 ? 3 : 4);
  const [p, q] = [r.chyslo(1, 3), r.chyslo(1, 3)];
  const zapys = `(${odnochlen(k, bukvy, p, q)})^{${n}}`;
  const rez = odnochlen(k ** n, bukvy, p * n, q * n);
  if (r.shans()) {
    return {
      pytannia: `Піднеси до степеня $${zapys}$. Який коефіцієнт вийшов?`,
      vidpovid: ch(k ** n),
      pidkazka: `У степінь ${n} підносимо і число ${ch(k)}. ${k < 0 ? (n % 2 ? 'Показник непарний — мінус лишається.' : 'Показник парний — мінус зникає.') : ''}`,
      rozviazok: `${tvd(k)}^${n} = ${ch(k ** n)}; $${zapys} = ${rez}$`,
    };
  }
  return {
    pytannia: `Піднеси до степеня $${zapys}$. Який степінь має результат?`,
    vidpovid: (p + q) * n,
    pidkazka: 'Показник кожної букви множимо на показник степеня, потім додаємо.',
    rozviazok: `$${zapys} = ${rez}$; ${p * n} + ${q * n} = ${(p + q) * n}`,
  };
}

export default {
  rivni: ['коефіцієнт і степінь', 'множимо одночлени', 'підносимо до степеня'],
  zavdannia(r, riven) {
    if (riven === 1) return koefStepin(r);
    if (riven === 2) return r.shans(0.75) ? dobutok(r) : koefStepin(r);
    return r.shans(0.65) ? stepin(r) : dobutok(r);
  },
} satisfies Henerator;
