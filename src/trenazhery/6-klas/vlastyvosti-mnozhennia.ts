// Переставна і сполучна властивості множення, коефіцієнт (Істер § 37): множники переставляємо й групуємо в зручні
// пари (25 · 4, 0,5 · 2, 125 · 8…), знак — за кількістю мінусів; коефіцієнт буквеного виразу; спрощення добутку
// на кшталт −2a · 3b · (−5) = 30ab.
import { ch, des, tdes, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const tekst = (s: string) => s.replace(/-/g, '−');
/** Коефіцієнт перед буквами для формули: 1 → «», −1 → «-», 3 → «3». */
const koef = (k: number, b: string) => (k === 1 ? b : k === -1 ? `-${b}` : `${tz(k)}${b}`);
const PARY: [number, number][] = [
  // [перший множник у сотих, другий множник]
  [2500, 4],
  [5000, 2],
  [12500, 8],
  [2000, 5],
  [50, 2],
  [25, 4],
  [250, 4],
  [20, 5],
  [125, 8],
];
const BUKVY: [string, string][] = [['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']];
const minusy = (n: number) => `${n} ${mnozh(n, 'мінус', 'мінуси', 'мінусів')}`;

function zruchno(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [a, b] = r.vybir(PARY);
    const c = r.krim(3, 49, [10, 20, 30, 40]);
    const znaky = [r.shans() ? -1 : 1, r.shans() ? -1 : 1, r.shans() ? -1 : 1];
    if (znaky.every((z) => z > 0)) continue;
    // множники: [значення в сотих, запис у формулі, запис у тексті]
    const mn: [number, string, string][] = [
      [znaky[0] * a, tdes(znaky[0] * a, 2), des(a, 2)],
      [znaky[1] * b * 100, tz(znaky[1] * b), String(b)],
      [znaky[2] * c * 100, tz(znaky[2] * c), String(c)],
    ];
    const poriadok = r.peremishaty([0, 1, 2]);
    const zapys = poriadok.map((i, k) => (mn[i][0] < 0 && k > 0 ? `(${mn[i][1]})` : mn[i][1])).join(' \\cdot ');
    const minusiv = znaky.filter((z) => z < 0).length;
    const z = minusiv % 2 ? -1 : 1;
    const para = (a * b) / 100;
    const vidpovid = z * para * c;
    return {
      pytannia: 'Обчисли зручно.',
      vyraz: `$${zapys} =$`,
      vidpovid: ch(vidpovid),
      pidkazka: `Знак: порахуй мінуси. Зручна пара: ${des(a, 2)} · ${b}.`,
      rozviazok: `${minusy(minusiv)} — ${z > 0 ? 'плюс' : 'мінус'}. ${des(a, 2)} · ${b} = ${para}; ${para} · ${c} = ${ch(para * c)}. Відповідь: ${ch(vidpovid)}.`,
    };
  }
}

/** Коефіцієнт виразу, записаного одразу «як треба». */
function koeficient(r: Vypadok): TrenZavdannia {
  const [b1, b2] = r.vybir(BUKVY);
  const bukvy = r.vybir([b1, `${b1}${b2}`, `${b1}${b2}${r.vybir(['c', 'k', 't'])}`]);
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    const k = r.vybir([1, -1]);
    return {
      pytannia: `Назви коефіцієнт виразу $${koef(k, bukvy)}$.`,
      vidpovid: ch(k),
      pidkazka: k > 0 ? 'Коефіцієнт 1 не пишуть.' : 'Мінус перед буквами — це множник −1.',
      rozviazok: k > 0 ? `${bukvy} = 1 · ${bukvy}, коефіцієнт 1.` : `−${bukvy} = −1 · ${bukvy}, коефіцієнт −1.`,
    };
  }
  if (typ === 1) {
    const k = r.krim(-99, 99, [0, 10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, 70, -70, 80, -80, 90, -90]);
    return {
      pytannia: `Назви коефіцієнт виразу $${tdes(k, 1)}${bukvy}$.`,
      vidpovid: des(k, 1),
      pidkazka: 'Коефіцієнт — число перед буквами, разом зі знаком.',
      rozviazok: `Число перед буквами: ${des(k, 1)}.`,
    };
  }
  if (typ === 2) {
    const q = r.chyslo(2, 9);
    const p = r.krim(1, q - 1, Array.from({ length: q }, (_, i) => i).filter((i) => i > 0 && q % i === 0 && i !== 1));
    const z = r.shans() ? -1 : 1;
    return {
      pytannia: `Назви коефіцієнт виразу $${z < 0 ? '-' : ''}\\frac{${p}}{${q}}${bukvy}$.`,
      vidpovid: `${z < 0 ? '−' : ''}${p}/${q}`,
      pokaz: `$${z < 0 ? '-' : ''}\\frac{${p}}{${q}}$`,
      pidkazka: 'Коефіцієнт — число перед буквами, разом зі знаком. Дріб запиши через риску.',
      rozviazok: `Число перед буквами: ${z < 0 ? '−' : ''}${p}/${q}.`,
    };
  }
  const k = r.krim(-20, 20, [0, 1, -1]);
  return {
    pytannia: `Назви коефіцієнт виразу $${tz(k)}${bukvy}$.`,
    vidpovid: ch(k),
    pidkazka: 'Коефіцієнт — число перед буквами, разом зі знаком.',
    rozviazok: `Число перед буквами: ${ch(k)}.`,
  };
}

/** Добуток із числами й буквами: числа множимо окремо, букви — окремо. */
function sprosty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b1, b2] = r.vybir(BUKVY);
    const tryMnozhnyky = r.shans(0.6);
    const k = [r.krim(-8, 8, [0, 1]), r.krim(-8, 8, [0, 1]), tryMnozhnyky ? r.krim(-5, 5, [0, 1]) : 1];
    if (k.every((x) => x > 0)) continue;
    const dobutok = k[0] * k[1] * k[2];
    const vd = (x: number, pershyi: boolean) => (x < 0 && !pershyi ? `(${tz(x)})` : tz(x));
    const chleny = [`${tz(k[0])}${b1}`, k[1] < 0 ? `(${tz(k[1])}${b2})` : `${k[1]}${b2}`];
    if (tryMnozhnyky) chleny.push(vd(k[2], false));
    const minusiv = k.filter((x) => x < 0).length;
    const rozv = `${k.filter((_, i) => i < 2 || tryMnozhnyky).map((x, i) => (x < 0 && i > 0 ? `(${ch(x)})` : ch(x))).join(' · ')} = ${ch(dobutok)} (${minusy(minusiv)}), букви ${b1}${b2}: ${tekst(koef(dobutok, b1 + b2))}.`;
    if (r.shans()) {
      return {
        pytannia: 'Спрости вираз. Яке число має стояти замість квадратика?',
        vyraz: `$${chleny.join(' \\cdot ')} = \\square ${b1}${b2}$`,
        vidpovid: ch(dobutok),
        pidkazka: 'Перемнож усі числа (з їхніми знаками), а букви запиши поруч.',
        rozviazok: rozv,
      };
    }
    const varianty = new Set([koef(dobutok, b1 + b2), koef(-dobutok, b1 + b2), koef(k[0] + k[1] + (tryMnozhnyky ? k[2] : 0), b1 + b2)]);
    if (varianty.size < 3) varianty.add(koef(-(k[0] + k[1] + (tryMnozhnyky ? k[2] : 0)), b1 + b2));
    if (varianty.size < 3) continue;
    return {
      pytannia: `Спрости вираз $${chleny.join(' \\cdot ')}$.`,
      vidpovid: tekst(koef(dobutok, b1 + b2)),
      varianty: r.peremishaty([...varianty].map(tekst)),
      pidkazka: 'Числа множимо окремо, букви — окремо. Знак — за кількістю мінусів.',
      rozviazok: rozv,
    };
  }
}

export default {
  rivni: ['зручні пари множників', 'коефіцієнт виразу', 'спрости добуток чисел і букв'],
  zavdannia(r, riven) {
    if (riven === 1) return zruchno(r);
    if (riven === 2) return r.vybir([koeficient, koeficient, koeficient, zruchno])(r);
    return r.vybir([sprosty, sprosty, sprosty, zruchno, koeficient])(r);
  },
} satisfies Henerator;
