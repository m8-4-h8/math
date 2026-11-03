// Різниця квадратів: (a − b)(a + b) = a² − b² і навпаки a² − b² = (a − b)(a + b); квадрат одночлена;
// обчислення в умі: 31 · 29 = 30² − 1², 67² − 33² = (67 − 33)(67 + 33).
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm'];

function dobutok(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const b = r.chyslo(1, 12);
  if (r.shans(0.3)) {
    const k = r.chyslo(2, 9);
    return {
      pytannia: `Піднеси до квадрата $(${k}${x})^2$. Який коефіцієнт вийшов?`,
      vidpovid: k * k,
      pidkazka: `У квадрат підносимо і число: ${k}².`,
      rozviazok: `(${k}${x})² = ${k * k}${x}²`,
    };
  }
  const [p, q] = r.peremishaty([`${x} - ${b}`, `${x} + ${b}`]);
  return {
    pytannia: `Перемнож $(${p})(${q})$. Яке число (вільний член) вийде у відповіді?`,
    vidpovid: ch(-b * b),
    pidkazka: `За формулою: ${x}² − ${b}².`,
    rozviazok: `(${x} − ${b})(${x} + ${b}) = ${x}² − ${b * b}: вільний член ${ch(-b * b)}. Середні члени −${b}${x} і +${b}${x} знищуються.`,
  };
}

function vUmi(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const a = r.vybir([20, 30, 40, 50, 60, 70, 80, 90, 100]);
    const d = r.chyslo(1, 4);
    return {
      pytannia: 'Обчисли зручним способом.',
      vyraz: `$${a + d} \\cdot ${a - d} =$`,
      vidpovid: a * a - d * d,
      pidkazka: `${a + d} · ${a - d} = (${a} + ${d})(${a} − ${d}).`,
      rozviazok: `${a}² − ${d}² = ${ch(a * a)} − ${d * d} = ${ch(a * a - d * d)}`,
    };
  }
  for (;;) {
    const s = r.vybir([50, 100, 100, 200]);
    const a = r.chyslo(s / 2 + 1, s - 1);
    const b = s - a;
    if (a === b) continue;
    return {
      pytannia: 'Обчисли зручним способом.',
      vyraz: `$${a}^2 - ${b}^2 =$`,
      vidpovid: (a - b) * s,
      pidkazka: `(${a} − ${b})(${a} + ${b}).`,
      rozviazok: `(${a} − ${b})(${a} + ${b}) = ${a - b} · ${s} = ${ch((a - b) * s)}`,
    };
  }
}

function rozklasty(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  if (r.shans(0.6)) {
    const b = r.chyslo(1, 13);
    return {
      pytannia: 'Впиши число.',
      vyraz: `$${x}^2 - ${b * b} = (${x} - ${b})(${x} + \\square)$`,
      vidpovid: b,
      pidkazka: `${b * b} — квадрат якого числа?`,
      rozviazok: `${b * b} = ${b}², тож ${x}² − ${b}² = (${x} − ${b})(${x} + ${b}).`,
    };
  }
  const k = r.chyslo(2, 9);
  const b = r.chyslo(1, 7);
  return {
    pytannia: `Яке число стоїть перед $${x}$ у дужках?`,
    vyraz: `$${k * k}${x}^2 - ${b * b} = (\\square ${x} - ${b})(\\square ${x} + ${b})$`,
    vidpovid: k,
    pidkazka: `${k * k}${x}² — квадрат якого одночлена?`,
    rozviazok: `${k * k}${x}² = (${k}${x})², ${b * b} = ${b}²: (${k}${x} − ${b})(${k}${x} + ${b}).`,
  };
}

export default {
  rivni: ['(x − b)(x + b) і квадрат одночлена', 'обчислюємо в умі', 'розкладаємо на множники'],
  zavdannia(r, riven) {
    if (riven === 1) return dobutok(r);
    if (riven === 2) return r.shans(0.7) ? vUmi(r) : dobutok(r);
    return r.shans(0.7) ? rozklasty(r) : vUmi(r);
  },
} satisfies Henerator;
