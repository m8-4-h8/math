// Винесення спільного множника за дужки: число — НСД коефіцієнтів, буква — у найменшому степені;
// у дужках — частки від ділення кожного члена; обчислення зручним способом.
import { ch, nsd, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm'];
const st = (x: string, n: number) => (n === 0 ? '' : n === 1 ? x : `${x}^{${n}}`);

function chyslo(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = r.chyslo(2, 9);
  const a = r.chyslo(1, 6);
  const b = r.chyslo(1, 9);
  if (nsd(a, b) !== 1) return chyslo(r);
  const minus = r.shans();
  return {
    pytannia: 'Впиши число.',
    vyraz: `$${k * a === 1 ? '' : k * a}${x} ${minus ? '-' : '+'} ${k * b} = ${k}(${a === 1 ? '' : a}${x} ${minus ? '-' : '+'} \\square)$`,
    vidpovid: b,
    pidkazka: `${k * b} : ${k} = ?`,
    rozviazok: `${k * b} : ${k} = ${b}. Перевірка: ${k} · ${b} = ${k * b} ✓`,
  };
}

function nsdChysel(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.chyslo(2, 12);
    const [a, b] = [r.chyslo(1, 6), r.chyslo(2, 7)];
    if (nsd(a, b) !== 1 || a === b) continue;
    const x = r.vybir(BUKVY);
    const [m, n] = [r.chyslo(2, 5), r.chyslo(1, 4)];
    if (m === n) continue;
    return {
      pytannia: `Яке найбільше число можна винести за дужки в $${k * a}${st(x, m)} + ${k * b}${st(x, n)}$?`,
      vidpovid: k,
      pidkazka: `Знайди НСД(${k * a}; ${k * b}).`,
      rozviazok: `НСД(${k * a}; ${k * b}) = ${k}.`,
    };
  }
}

function stepinBukvy(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [m, n] = r.rizni(2, 1, 7);
  const [a, b] = [r.chyslo(2, 9), r.chyslo(2, 9)];
  return {
    pytannia: `$${a}${st(x, m)} + ${b}${st(x, n)}$. У якому степені винесемо $${x}$ за дужки?`,
    vidpovid: Math.min(m, n),
    pidkazka: `Найменший показник букви ${x} серед членів.`,
    rozviazok: `Найменший показник — ${Math.min(m, n)}: виносимо ${x}${Math.min(m, n) > 1 ? `^${Math.min(m, n)}` : ''}.`,
  };
}

function odnochlen(r: Vypadok): TrenZavdannia {
  for (;;) {
    const x = r.vybir(BUKVY);
    const k = r.chyslo(2, 9);
    const [a, b] = [r.chyslo(1, 5), r.chyslo(1, 7)];
    if (nsd(a, b) !== 1) continue;
    const n = r.chyslo(1, 3);
    const d = r.chyslo(1, 2);
    const minus = r.shans();
    const spilnyi = `${k}${st(x, n)}`;
    return {
      pytannia: 'Впиши число.',
      vyraz: `$${k * a}${st(x, n + d)} ${minus ? '-' : '+'} ${k * b}${st(x, n)} = ${spilnyi}(${a === 1 ? '' : a}${st(x, d)} ${minus ? '-' : '+'} \\square)$`,
      vidpovid: b,
      pidkazka: `Поділи ${k * b}${st(x, n).replace(/[{}]/g, '')} на ${spilnyi.replace(/[{}]/g, '')}.`,
      rozviazok: `${k * b} : ${k} = ${b}, а ${x} скорочується повністю: ${b}.`,
    };
  }
}

function zruchno(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(11, 99);
  const a = r.chyslo(11, 89);
  const s = r.vybir([100, 100, 1000, 10]);
  const b = s - (a % s);
  if (b <= 0 || b === a || a >= s) return zruchno(r);
  return {
    pytannia: 'Обчисли зручним способом.',
    vyraz: `$${k} \\cdot ${a} + ${k} \\cdot ${b} =$`,
    vidpovid: k * s,
    pidkazka: `Винеси ${k} за дужки.`,
    rozviazok: `${k} · (${a} + ${b}) = ${k} · ${s} = ${ch(k * s)}`,
  };
}

export default {
  rivni: ['виносимо число', 'НСД і степінь букви', 'виносимо одночлен, рахуємо зручно'],
  zavdannia(r, riven) {
    if (riven === 1) return chyslo(r);
    if (riven === 2) return r.vybir([nsdChysel, stepinBukvy, chyslo])(r);
    return r.vybir([odnochlen, odnochlen, zruchno])(r);
  },
} satisfies Henerator;
