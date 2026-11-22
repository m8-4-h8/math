// Вирази зі змінною (2 клас): значення виразу 9 + a, 15 − b, n + n при заданому значенні змінної;
// яке значення змінної дає задане значення виразу; задачі з буквою.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['a', 'b', 'c', 'k', 'm', 'n', 'p', 'x', 'y'];

/** Вираз зі змінною з числами до 20 (з переходом через десяток) або до 100 (рівень 3). */
function vyraz(r: Vypadok, do100: boolean) {
  const z = r.vybir(BUKVY);
  for (;;) {
    const vyd = r.chyslo(0, 2);
    if (vyd === 0) {
      // n + z або z + n
      const n = do100 ? r.chyslo(11, 79) : r.chyslo(2, 9);
      const x = do100 ? r.chyslo(2, 9) : r.chyslo(2, 9);
      if (!do100 && n + x <= 10) continue;
      if (do100 && n + x > 100) continue;
      const zliva = r.shans();
      return { z, x, tekst: zliva ? `${z} + ${n}` : `${n} + ${z}`, pidst: zliva ? `${x} + ${n}` : `${n} + ${x}`, v: n + x };
    }
    if (vyd === 1) {
      // n − z
      const n = do100 ? r.chyslo(21, 99) : r.chyslo(11, 18);
      const x = r.chyslo(2, 9);
      if (!do100 && n - x >= 10) continue;
      return { z, x, tekst: `${n} − ${z}`, pidst: `${n} − ${x}`, v: n - x };
    }
    // z − n
    const n = r.chyslo(2, 9);
    const x = do100 ? r.chyslo(21, 99) : r.chyslo(11, 18);
    if (!do100 && x - n >= 10) continue;
    return { z, x, tekst: `${z} − ${n}`, pidst: `${x} − ${n}`, v: x - n };
  }
}

function znachennia(r: Vypadok, do100 = false): TrenZavdannia {
  const w = vyraz(r, do100);
  return {
    pytannia: `Знайди значення виразу $${w.tekst.replace('−', '-')}$, якщо $${w.z} = ${w.x}$.`,
    vidpovid: w.v,
    pidkazka: `Підстав ${w.x} замість ${w.z}: ${w.pidst}.`,
    rozviazok: `Якщо ${w.z} = ${w.x}, то ${w.tekst} = ${w.pidst} = ${w.v}`,
  };
}

// Однакові букви — однакові числа: n + n.
function dviBukvy(r: Vypadok): TrenZavdannia {
  const z = r.vybir(BUKVY);
  const x = r.chyslo(4, 9);
  return {
    pytannia: `Знайди значення виразу $${z} + ${z}$, якщо $${z} = ${x}$.`,
    vidpovid: 2 * x,
    pidkazka: `Обидві букви ${z} — це те саме число ${x}.`,
    rozviazok: `Якщо ${z} = ${x}, то ${x} + ${x} = ${2 * x}`,
  };
}

// За значенням виразу знайти значення змінної: 13 − p = 4.
function obernene(r: Vypadok): TrenZavdannia {
  const w = vyraz(r, false);
  return {
    pytannia: `Вираз $${w.tekst.replace('−', '-')}$ дорівнює $${w.v}$. Яке значення змінної $${w.z}$?`,
    vidpovid: w.x,
    nevidome: `$${w.z}$`,
    pidkazka: `Перебери числа: яке число замість ${w.z} дає ${w.v}?`,
    rozviazok: `${w.z} = ${w.x}, бо ${w.pidst} = ${w.v}`,
  };
}

// Числовий вираз чи вираз зі змінною.
function yakyiVyraz(r: Vypadok): TrenZavdannia {
  const z = r.vybir(BUKVY);
  const a = r.chyslo(6, 9);
  const b = r.chyslo(3, 9);
  const c = r.chyslo(11, 18);
  const d = r.chyslo(2, 9);
  const zi = r.shans() ? `${a} + ${z}` : `${c} − ${z}`;
  const vybir = r.peremishaty([zi, `${a} + ${b}`, `${c} − ${d}`]);
  return {
    pytannia: 'Який вираз — вираз зі змінною?',
    vidpovid: zi,
    varianty: vybir,
    pidkazka: 'Шукай вираз, у якому є буква.',
    rozviazok: `${zi} — у ньому є буква ${z}, замість якої можна підставляти різні числа. Інші — числові вирази.`,
  };
}

// Для якого значення змінної вираз більший.
function porivniaty(r: Vypadok): TrenZavdannia {
  const z = r.vybir(BUKVY);
  const [x1, x2] = r.rizni(2, 2, 9).sort((p, q) => p - q);
  const n = r.chyslo(11, 18);
  const minus = r.shans();
  const tekst = minus ? `${n} − ${z}` : `${n} + ${z}`;
  const v = (x: number) => (minus ? n - x : n + x);
  const bilshe = minus ? x1 : x2;
  return {
    pytannia: `Коли значення виразу $${tekst.replace('−', '-')}$ більше: при $${z} = ${x1}$ чи при $${z} = ${x2}$?`,
    vidpovid: `${z} = ${bilshe}`,
    varianty: [`${z} = ${x1}`, `${z} = ${x2}`],
    pidkazka: `Обчисли обидва значення: ${minus ? `${n} − ${x1}` : `${n} + ${x1}`} і ${minus ? `${n} − ${x2}` : `${n} + ${x2}`}.`,
    rozviazok: `Якщо ${z} = ${x1}, то ${minus ? `${n} − ${x1}` : `${n} + ${x1}`} = ${v(x1)}; якщо ${z} = ${x2}, то ${minus ? `${n} − ${x2}` : `${n} + ${x2}`} = ${v(x2)}. Більше при ${z} = ${bilshe}.`,
  };
}

// Задачі з буквою.
function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    const n = r.chyslo(11, 18);
    const x = r.chyslo(2, 9);
    return {
      pytannia: `Сорока назбирала ${n} намистин і $b$ намистин загубила. Скільки намистин у неї залишилося, якщо $b = ${x}$?`,
      vidpovid: n - x,
      pidkazka: `Залишилося ${n} − b. Підстав ${x} замість b.`,
      rozviazok: `${n} − ${x} = ${n - x} (${mnozh(n - x, 'намистина', 'намистини', 'намистин')})`,
    };
  }
  if (vyd === 1) {
    const o = osoba(r);
    const n = r.chyslo(5, 9);
    const x = r.chyslo(3, 9);
    if (n + x <= 10) return zadacha(r);
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} ${n} ${mnozh(n, 'марку', 'марки', 'марок')}, а потім ${rid(o, 'отримав', 'отримала')} у подарунок ще $m$. Скільки марок стало, якщо $m = ${x}$?`,
      vidpovid: n + x,
      pidkazka: `Стало ${n} + m. Підстав ${x} замість m.`,
      rozviazok: `${n} + ${x} = ${n + x} (${mnozh(n + x, 'марка', 'марки', 'марок')})`,
    };
  }
  const n = r.chyslo(30, 90);
  const x = r.chyslo(2, 9);
  return {
    pytannia: `У ящику було $k$ кг яблук, а потім доклали ще ${n} кг. Скільки кілограмів яблук стало в ящику, якщо $k = ${x}$?`,
    vidpovid: n + x,
    odynytsi: 'кг',
    pidkazka: `Стало k + ${n}. Підстав ${x} замість k.`,
    rozviazok: `${x} + ${n} = ${n + x} (кг)`,
  };
}

export default {
  rivni: ['значення виразу', 'букви й пастки', 'до 100 і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return znachennia(r);
    if (riven === 2) return r.vybir([dviBukvy, obernene, yakyiVyraz, porivniaty])(r);
    return r.vybir([(v: Vypadok) => znachennia(v, true), (v: Vypadok) => znachennia(v, true), zadacha, obernene])(r);
  },
} satisfies Henerator;
