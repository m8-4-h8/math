// Трицифрові числа: сотні, десятки, одиниці; розрядні доданки; порівняння; сусіди; скільки всього десятків.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const sot = (n: number) => `${n} ${mnozh(n, 'сотня', 'сотні', 'сотень')}`;
const des = (n: number) => `${n} ${mnozh(n, 'десяток', 'десятки', 'десятків')}`;
const od = (n: number) => `${n} ${mnozh(n, 'одиниця', 'одиниці', 'одиниць')}`;

function chyslo(r: Vypadok) {
  const s = r.chyslo(1, 9);
  const d = r.shans(0.15) ? 0 : r.chyslo(0, 9);
  const o = r.shans(0.15) ? 0 : r.chyslo(0, 9);
  return { s, d, o, n: 100 * s + 10 * d + o };
}

function rozriady(r: Vypadok): TrenZavdannia {
  const { s, d, o, n } = chyslo(r);
  const sklad = [s && sot(s), d && des(d), o && od(o)].filter(Boolean).join(', ');
  return r.vybir<() => TrenZavdannia>([
    () => ({ pytannia: `Скільки сотень у числі ${n}?`, vidpovid: s, pidkazka: 'Перша цифра — сотні.', rozviazok: `${n}: ${sklad}.` }),
    () => ({ pytannia: `Яка цифра стоїть у розряді десятків числа ${n}?`, vidpovid: d, pidkazka: 'Десятки — друга цифра (посередині).', rozviazok: `${n}: ${sot(s)}, ${des(d)}, ${od(o)}.` }),
    () => ({ pytannia: `Яка цифра стоїть у розряді одиниць числа ${n}?`, vidpovid: o, pidkazka: 'Одиниці — остання цифра.', rozviazok: `${n}: ${sot(s)}, ${des(d)}, ${od(o)}.` }),
    () => ({
      pytannia: `Запиши цифрами: ${sklad}.`,
      vidpovid: n,
      pidkazka: 'Сотні, десятки, одиниці — по черзі. Якщо розряду немає, пиши 0.',
      rozviazok: `${100 * s} + ${10 * d} + ${o} = ${n}`,
    }),
  ])();
}

function dodanky(r: Vypadok): TrenZavdannia {
  const { s, d, o, n } = chyslo(r);
  const chastyny = [100 * s, 10 * d, o].filter(Boolean);
  if (chastyny.length < 2) return rozriady(r);
  const i = r.chyslo(0, chastyny.length - 1);
  return {
    pytannia: 'Яке число у віконці?',
    vyraz: `${n} = ${chastyny.map((x, j) => (j === i ? '□' : String(x))).join(' + ')}`,
    vidpovid: chastyny[i],
    pidkazka: 'Розклади число на сотні, десятки й одиниці.',
    rozviazok: `${n} = ${chastyny.join(' + ')}`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(100, 999);
  let b = r.chyslo(100, 999);
  const typ = r.chyslo(0, 3);
  if (typ === 0) b = Number(String(a).split('').reverse().join('')) >= 100 ? Number(String(a).split('').reverse().join('')) : b;
  if (typ === 1) b = a - (a % 100) + r.chyslo(0, 99); // ті самі сотні
  if (typ === 2 && r.shans(0.3)) b = a;
  const znak = a > b ? '>' : a < b ? '<' : '=';
  return {
    pytannia: 'Який знак поставити?',
    vyraz: `${a} □ ${b}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Порівнюй зліва: спершу сотні, потім десятки, потім одиниці.',
    rozviazok: znak === '=' ? 'Числа однакові.' : `${Math.max(a, b)} > ${Math.min(a, b)}, тому ${a} ${znak} ${b}.`,
  };
}

function susid(r: Vypadok): TrenZavdannia {
  const n = r.shans(0.4) ? 100 * r.chyslo(2, 9) + r.vybir([0, 0, 10, 90]) - r.chyslo(0, 1) : r.chyslo(101, 998);
  return r.shans()
    ? { pytannia: `Яке число йде одразу після ${n}?`, vidpovid: n + 1, pidkazka: 'На 1 більше. Якщо одиниць стає 10 — це новий десяток.', rozviazok: `${n} + 1 = ${n + 1}` }
    : { pytannia: `Яке число стоїть одразу перед ${n}?`, vidpovid: n - 1, pidkazka: 'На 1 менше.', rozviazok: `${n} − 1 = ${n - 1}` };
}

function usihoDesiatkiv(r: Vypadok): TrenZavdannia {
  const { s, d, o, n } = chyslo(r);
  if (r.shans()) {
    return {
      pytannia: `Скільки всього десятків у числі ${n}?`,
      vidpovid: 10 * s + d,
      pidkazka: `У кожній сотні 10 десятків. ${sot(s)} — це ${10 * s} десятків, і ще ${d}.`,
      rozviazok: `${n} = ${10 * s + d} дес. і ${o} од. Відповідь: ${10 * s + d}.`,
    };
  }
  // Цифра, яка трапляється в числі лише раз (у 266 шістка двозначна — про неї не питаємо).
  const tsyfry = [s, d, o];
  const odnorazovi = [0, 1, 2].filter((i) => tsyfry[i] > 0 && tsyfry.filter((x) => x === tsyfry[i]).length === 1);
  if (!odnorazovi.length) return rozriady(r);
  const poz = r.vybir(odnorazovi);
  const tsyfra = tsyfry[poz];
  const znachennia = tsyfra * [100, 10, 1][poz];
  return {
    pytannia: `Що означає цифра ${tsyfra} у числі ${n}? Запиши числом.`,
    vidpovid: znachennia,
    pidkazka: 'Подивись, у якому розряді стоїть цифра: сотні, десятки чи одиниці?',
    rozviazok: `Цифра ${tsyfra} стоїть у розряді ${['сотень', 'десятків', 'одиниць'][poz]} — це ${znachennia}.`,
  };
}

export default {
  rivni: ['сотні, десятки, одиниці', 'розрядні доданки й порівняння', 'сусіди й «скільки всього десятків»'],
  zavdannia(r, riven) {
    if (riven === 1) return rozriady(r);
    if (riven === 2) return r.vybir([dodanky, porivniannia, rozriady])(r);
    return r.vybir([susid, usihoDesiatkiv, porivniannia, dodanky])(r);
  },
} satisfies Henerator;
