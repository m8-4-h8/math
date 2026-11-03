// Розкладання на множники різними способами: спершу виносимо спільний множник, потім — формула (різниця
// квадратів, квадрат суми чи різниці); розкладаємо до кінця.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { dobutok, tex, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b'];

function formula(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const b = r.chyslo(1, 12);
  if (r.shans()) {
    return {
      pytannia: 'Впиши число.',
      vyraz: `$${x}^2 - ${b * b} = (${x} - ${b})(${x} + \\square)$`,
      vidpovid: b,
      pidkazka: `${b * b} — квадрат якого числа?`,
      rozviazok: `Різниця квадратів: ${x}² − ${b}² = (${x} − ${b})(${x} + ${b}).`,
    };
  }
  const minus = r.shans();
  const p: Mnohochlen = [minus ? -b : b, 1];
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${tex(dobutok(p, p), x)} = (${x} ${minus ? '-' : '+'} \\square)^2$`,
    vidpovid: b,
    pidkazka: `${b * b} — квадрат якого числа? Перевір: 2 · ${x} · ? = ${2 * b}${x}.`,
    rozviazok: `Квадрат ${minus ? 'різниці' : 'суми'}: ${b * b} = ${b}², ${2 * b}${x} = 2 · ${x} · ${b}.`,
  };
}

function vynestyIFormula(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = r.chyslo(2, 7);
  const b = r.chyslo(1, 6);
  if (r.shans()) {
    return {
      pytannia: 'Впиши число.',
      vyraz: `$${k}${x}^2 - ${k * b * b} = ${k}(${x} - ${b})(${x} + \\square)$`,
      vidpovid: b,
      pidkazka: `Спершу винеси ${k}: ${k}(${x}² − ${b * b}).`,
      rozviazok: `${k}(${x}² − ${b * b}) = ${k}(${x} − ${b})(${x} + ${b})`,
    };
  }
  const p: Mnohochlen = [b, 1];
  const kv = dobutok(p, p).map((c) => c * k);
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${tex(kv, x)} = ${k}(${x} + \\square)^2$`,
    vidpovid: b,
    pidkazka: `Винеси ${k}: ${k}(${tex(dobutok(p, p), x).replace(/\^\{2\}/, '²')}). Чи не квадрат суми в дужках?`,
    rozviazok: `${k}(${x}² + ${2 * b}${x} + ${b * b}) = ${k}(${x} + ${b})²`,
  };
}

function trySposoby(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = r.chyslo(1, 6);
  const b = r.chyslo(1, 7);
  const kx = k === 1 ? x : `${k}${x}`;
  if (r.shans()) {
    // k x³ − k b² x = kx(x − b)(x + b)
    return {
      pytannia: 'Впиши число.',
      vyraz: `$${kx}^3 - ${k * b * b === 1 ? '' : k * b * b}${x} = ${kx}(${x} - ${b})(${x} + \\square)$`,
      vidpovid: b,
      pidkazka: `Винеси ${kx}: ${kx}(${x}² − ${b * b}). Далі — різниця квадратів.`,
      rozviazok: `${kx}(${x}² − ${b}²) = ${kx}(${x} − ${b})(${x} + ${b})`,
    };
  }
  // x³ − 2b x² + b² x = x(x − b)²
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${x}^3 - ${2 * b}${x}^2 + ${b === 1 ? '' : b * b}${x} = ${x}(${x} - \\square)^2$`,
    vidpovid: b,
    pidkazka: `Винеси ${x}: ${x}(${x}² − ${2 * b}${x} + ${b * b}). Тричлен у дужках — квадрат різниці.`,
    rozviazok: `${x}(${x}² − ${2 * b}${x} + ${b * b}) = ${x}(${x} − ${b})²`,
  };
}

export default {
  rivni: ['одна формула', 'виносимо, потім формула', 'три кроки'],
  zavdannia(r, riven) {
    if (riven === 1) return formula(r);
    if (riven === 2) return r.shans(0.75) ? vynestyIFormula(r) : formula(r);
    return r.shans(0.7) ? trySposoby(r) : vynestyIFormula(r);
  },
} satisfies Henerator;
