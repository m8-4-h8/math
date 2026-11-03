// Римські числа: читати й записувати. Менша цифра ліворуч віднімається, праворуч — додається.
// Розклад по розрядах: 1984 = M + CM + LXXX + IV.
import { rozkladRymske, rymske } from '../../components/rymski.ts';
import { rymskeLatynytseiu, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const rozklad = (x: number) => rozkladRymske(x);
const poRozriadakh = (x: number) =>
  `${rozklad(x).map(([, z]) => z).join(' + ')} = ${rozklad(x).map(([ch]) => ch).join(' + ')} = ${x}`;

function prochytaty(r: Vypadok, max: number): TrenZavdannia {
  const x = r.chyslo(4, max);
  return {
    pytannia: `Яке число записано римськими цифрами: ${rymske(x)}?`,
    vidpovid: x,
    pidkazka: 'Розбий запис на розряди: тисячі, сотні, десятки, одиниці. Менша цифра перед більшою — віднімаємо.',
    rozviazok: rozklad(x).length > 1 ? poRozriadakh(x) : `${rymske(x)} = ${x}`,
  };
}

function zapysaty(r: Vypadok, max: number): TrenZavdannia {
  const x = r.chyslo(4, max);
  const z = rymske(x);
  return {
    pytannia: `Запиши римськими цифрами число ${x}.`,
    vidpovid: z,
    perevirka: (v) => rymskeLatynytseiu(v).replace(/\s+/g, '') === z,
    pidkazka: 'Пиши по розрядах зліва: спершу тисячі, потім сотні, десятки, одиниці. 4 — IV, 9 — IX, 40 — XL, 90 — XC.',
    rozviazok: rozklad(x).length > 1 ? `${rozklad(x).map(([ch]) => ch).join(' + ')} → ${rozklad(x).map(([, zz]) => zz).join(' + ')} = ${z}` : `${x} → ${z}`,
  };
}

const ZNACHENNIA: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
function chytaty(z: string) {
  let s = 0;
  for (let i = 0; i < z.length; i++) {
    const v = ZNACHENNIA[z[i]];
    s += i + 1 < z.length && ZNACHENNIA[z[i + 1]] > v ? -v : v;
  }
  return s;
}

// Типова помилка: IV і VI, IX і XI, XL і LX — порядок цифр змінює число.
function poriadok(r: Vypadok): TrenZavdannia {
  const [mensha, bilsha] = r.vybir([
    ['I', 'V'],
    ['I', 'X'],
    ['X', 'L'],
    ['X', 'C'],
    ['C', 'D'],
    ['C', 'M'],
  ]);
  const a = mensha + bilsha;
  const b = bilsha + mensha;
  const bilshe = r.shans();
  return {
    pytannia: `Яке число ${bilshe ? 'більше' : 'менше'}: ${a} чи ${b}?`,
    vidpovid: bilshe ? b : a,
    varianty: r.peremishaty([a, b]),
    pidkazka: 'Менша цифра ліворуч від більшої — віднімається, праворуч — додається.',
    rozviazok: `${a} = ${chytaty(a)}, а ${b} = ${chytaty(b)}.`,
  };
}

function diia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(11, 60);
  const b = r.chyslo(4, 39);
  const plius = r.shans() || a <= b;
  const x = plius ? a + b : a - b;
  return {
    pytannia: 'Обчисли й запиши відповідь звичайними (арабськими) цифрами.',
    vyraz: `${rymske(a)} ${plius ? '+' : '−'} ${rymske(b)} =`,
    vidpovid: x,
    pidkazka: 'Спершу прочитай обидва числа, потім рахуй.',
    rozviazok: `${a} ${plius ? '+' : '−'} ${b} = ${x}`,
  };
}

function rik(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(1400, 2030);
  return r.shans()
    ? {
        pytannia: `На старовинній будівлі написано рік ${rymske(x)}. Який це рік?`,
        vidpovid: x,
        pidkazka: 'M — тисяча. Далі сотні, десятки, одиниці.',
        rozviazok: poRozriadakh(x),
      }
    : zapysaty(r, 3999);
}

function stolittia(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(10, 21);
  const z = rymske(x);
  return {
    pytannia: `Століття записують римськими цифрами. Запиши так ${x}-те століття.`,
    vidpovid: z,
    perevirka: (v) => rymskeLatynytseiu(v).replace(/\s+/g, '') === z,
    pidkazka: 'X — 10. Далі додай одиниці: I, II, III, IV, V…',
    rozviazok: `${x} = ${rozklad(x).map(([ch]) => ch).join(' + ')} → ${z}`,
  };
}

export default {
  rivni: ['до 39: I, V, X', 'до 399: L і C, порядок цифр', 'до 3999: роки, століття, дії'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? prochytaty(r, 39) : zapysaty(r, 39);
    if (riven === 2) return r.vybir([() => prochytaty(r, 399), () => zapysaty(r, 399), () => poriadok(r), () => stolittia(r)])();
    return r.vybir([() => prochytaty(r, 3999), () => zapysaty(r, 3999), () => rik(r), () => diia(r), () => poriadok(r)])();
  },
} satisfies Henerator;
