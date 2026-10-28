// Римські числа: перетворення і розклад по розрядах (1984 = M + CM + LXXX + IV).
const RIADKY = [
  ['I', 'V', 'X'], // одиниці
  ['X', 'L', 'C'], // десятки
  ['C', 'D', 'M'], // сотні
  ['M', '', ''], // тисячі (до 3000)
];

// Одна цифра розряду римськими знаками: 4 → IV, 8 → VIII, 9 → IX.
function tsyfra(d: number, [odyn, pyat, desiat]: string[]) {
  if (d === 9) return odyn + desiat;
  if (d >= 5) return pyat + odyn.repeat(d - 5);
  if (d === 4) return odyn + pyat;
  return odyn.repeat(d);
}

/** Розклад числа від 1 до 3999 по розрядах: 1984 → [[1000,'M'],[900,'CM'],[80,'LXXX'],[4,'IV']]. */
export function rozkladRymske(x: number): [number, string][] {
  if (!Number.isInteger(x) || x < 1 || x > 3999) throw new Error(`rymski: ${x} — потрібне ціле від 1 до 3999`);
  const out: [number, string][] = [];
  [...String(x)].reverse().forEach((c, r) => {
    const d = Number(c);
    if (d) out.unshift([d * 10 ** r, tsyfra(d, RIADKY[r])]);
  });
  return out;
}

export const rymske = (x: number) => rozkladRymske(x).map(([, z]) => z).join('');
