// Спосіб групування: спільний множник — дужка; групуємо члени попарно, з кожної пари виносимо своє, щоб
// дужки збіглися (з мінусом — виносимо від’ємне число); обчислення зручним способом.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const PARY = [
  ['a', 'x'],
  ['m', 'n'],
  ['x', 'y'],
  ['b', 'c'],
];
const zn = (k: number) => (k < 0 ? '-' : '+');

function spilnaDuzhka(r: Vypadok): TrenZavdannia {
  const [a, x] = r.vybir(PARY);
  const b = r.krim(-9, 9, [0]);
  const k = r.chyslo(2, 9);
  const duzhka = `${x} ${zn(b)} ${Math.abs(b)}`;
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${a}(${duzhka}) + ${k}(${duzhka}) = (${duzhka})(${a} + \\square)$`,
    vidpovid: k,
    pidkazka: `Спільний множник — дужка (${duzhka.replace('-', '−')}).`,
    rozviazok: `Виносимо (${duzhka.replace('-', '−')}): лишаються ${a} і ${k}.`,
  };
}

function hrupuvaty(r: Vypadok): TrenZavdannia {
  const [a, x] = r.vybir(PARY);
  const b = r.krim(-9, 9, [0]);
  const k = r.krim(-9, 9, [0, 1, -1]);
  // a(x + b) + k(x + b) = ax + ab + kx + kb
  const duzhka = `${x} ${zn(b)} ${Math.abs(b)}`;
  const zapys = `${a}${x} ${zn(b)} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${a} ${zn(k)} ${Math.abs(k)}${x} ${zn(k * b)} ${Math.abs(k * b)}`;
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${zapys} = (${duzhka})(${a} ${zn(k)} \\square)$`,
    vidpovid: Math.abs(k),
    pidkazka:
      k < 0
        ? `З другої пари винось від’ємне число ${ch(k)}, щоб дужка вийшла та сама.`
        : `Перша пара: ${a}(${duzhka.replace('-', '−')}). З другої винось ${k}.`,
    rozviazok: `${a}(${duzhka.replace('-', '−')}) ${k < 0 ? '−' : '+'} ${Math.abs(k)}(${duzhka.replace('-', '−')}) = (${duzhka.replace('-', '−')})(${a} ${k < 0 ? '−' : '+'} ${Math.abs(k)})`,
  };
}

function kubichnyi(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(1, 9);
  const k = r.chyslo(1, 9);
  // x³ + bx² + kx + kb = x²(x + b) + k(x + b)
  return {
    pytannia: 'Впиши число.',
    vyraz: `$x^3 + ${b}x^2 + ${k === 1 ? '' : k}x + ${k * b} = (x + ${b})(x^2 + \\square)$`,
    vidpovid: k,
    pidkazka: `x³ + ${b}x² = x²(x + ${b}). А з другої пари що винесемо?`,
    rozviazok: `x²(x + ${b}) + ${k}(x + ${b}) = (x + ${b})(x² + ${k})`,
  };
}

function zruchno(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.chyslo(11, 39), r.chyslo(11, 39)];
  const s1 = r.vybir([30, 40, 50, 60, 100]);
  const c = r.chyslo(3, s1 - 3);
  const d = s1 - c;
  return {
    pytannia: 'Обчисли зручним способом.',
    vyraz: `$${a} \\cdot ${c} + ${a} \\cdot ${d} + ${b} \\cdot ${c} + ${b} \\cdot ${d} =$`,
    vidpovid: (a + b) * s1,
    pidkazka: `Згрупуй: ${a}(${c} + ${d}) + ${b}(${c} + ${d}).`,
    rozviazok: `(${c} + ${d})(${a} + ${b}) = ${s1} · ${a + b} = ${ch(s1 * (a + b))}`,
  };
}

export default {
  rivni: ['спільна дужка', 'групуємо попарно', 'з мінусом, кубічні й обчислення'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? spilnaDuzhka(r) : hrupuvaty(r);
    if (riven === 2) return hrupuvaty(r);
    return r.vybir([hrupuvaty, kubichnyi, zruchno])(r);
  },
} satisfies Henerator;
