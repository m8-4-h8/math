// Як змінюється сума і різниця: доданок +k — сума +k; зменшуване +k — різниця +k; від'ємник +k — різниця −k;
// обидва числа різниці на k — різниця не змінюється (так рахують 1000 − 387 = 999 − 386).
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const zmina = (k: number) => (k > 0 ? `+${k}` : `−${-k}`);
const zminaSlovamy = (k: number) => (k === 0 ? 'не зміниться' : k > 0 ? `збільшиться на ${k}` : `зменшиться на ${-k}`);

function suma(r: Vypadok, max: number): TrenZavdannia {
  const a = r.chyslo(Math.floor(max / 4), max);
  const b = r.chyslo(11, Math.floor(max / 4));
  const k = r.vybir([1, 2, 3, 5, 10, 20]) * (r.shans(0.65) ? 1 : -1);
  const pershyi = r.shans();
  const [a2, b2] = pershyi ? [a + k, b] : [a, b + k];
  return {
    pytannia: `Відомо: ${a} + ${b} = ${a + b}. Не рахуючи заново, знайди суму.`,
    vyraz: `${a2} + ${b2} =`,
    vidpovid: a2 + b2,
    pidkazka: `${pershyi ? 'Перший' : 'Другий'} доданок змінився на ${zmina(k)}. Так само зміниться й сума.`,
    rozviazok: `Доданок ${zmina(k)} — і сума ${zmina(k)}: ${a + b} ${k > 0 ? '+' : '−'} ${Math.abs(k)} = ${a2 + b2}`,
  };
}

function riznytsia(r: Vypadok, max: number): TrenZavdannia {
  const b = r.chyslo(Math.floor(max / 5), Math.floor(max / 2));
  const a = b + r.chyslo(Math.floor(max / 5), Math.floor(max / 2));
  const k = r.vybir([1, 2, 5, 10, 20]) * (r.shans(0.6) ? 1 : -1);
  const shcho = r.chyslo(0, 2); // 0 — зменшуване, 1 — від'ємник, 2 — обидва
  const [a2, b2] = shcho === 0 ? [a + k, b] : shcho === 1 ? [a, b + k] : [a + k, b + k];
  const zminaR = shcho === 0 ? k : shcho === 1 ? -k : 0;
  const nazva = ['Зменшуване', 'Від’ємник', 'Обидва числа'][shcho];
  return {
    pytannia: `Відомо: ${a} − ${b} = ${a - b}. Не рахуючи заново, знайди різницю.`,
    vyraz: `${a2} − ${b2} =`,
    vidpovid: a2 - b2,
    pidkazka:
      shcho === 2
        ? 'Обидва числа змінилися однаково — відстань між ними та сама.'
        : shcho === 0
          ? 'Зменшуване змінилося — різниця змінюється так само.'
          : 'Від’ємник більшає — різниця меншає, і навпаки.',
    rozviazok:
      zminaR === 0
        ? `${nazva} ${zmina(k)} — різниця не змінилась: ${a - b}.`
        : `${nazva} ${zmina(k)} — різниця ${zmina(zminaR)}: ${a - b} ${zminaR > 0 ? '+' : '−'} ${Math.abs(zminaR)} = ${a2 - b2}`,
  };
}

function yakZminytsia(r: Vypadok, tilkySuma = false): TrenZavdannia {
  const k = r.vybir([2, 5, 10, 20, 100]);
  // Перевіряємо на прикладі: для суми 3k + 2k, для різниці 5k − 2k.
  const [x, y] = [3 * k, 2 * k];
  const [m, v] = [5 * k, 2 * k];
  const vypadky = [
    { umova: `один доданок збільшити на ${k}`, z: k, shcho: 'сума', pryklad: `${x} + ${y} = ${x + y}; ${x + k} + ${y} = ${x + y + k}` },
    { umova: `один доданок зменшити на ${k}`, z: -k, shcho: 'сума', pryklad: `${x} + ${y} = ${x + y}; ${x - k} + ${y} = ${x + y - k}` },
    { umova: `один доданок збільшити на ${k}, а другий — зменшити на ${k}`, z: 0, shcho: 'сума', pryklad: `${x} + ${y} = ${x + y}; ${x + k} + ${y - k} = ${x + y}` },
    { umova: `зменшуване збільшити на ${k}`, z: k, shcho: 'різниця', pryklad: `${m} − ${v} = ${m - v}; ${m + k} − ${v} = ${m - v + k}` },
    { umova: `від’ємник збільшити на ${k}`, z: -k, shcho: 'різниця', pryklad: `${m} − ${v} = ${m - v}; ${m} − ${v + k} = ${m - v - k}` },
    { umova: `від’ємник зменшити на ${k}`, z: k, shcho: 'різниця', pryklad: `${m} − ${v} = ${m - v}; ${m} − ${v - k} = ${m - v + k}` },
    { umova: `зменшуване і від’ємник збільшити на ${k}`, z: 0, shcho: 'різниця', pryklad: `${m} − ${v} = ${m - v}; ${m + k} − ${v + k} = ${m - v}` },
  ];
  const c = r.vybir(tilkySuma ? vypadky.filter((x) => x.shcho === 'сума') : vypadky);
  return {
    pytannia: `Як зміниться ${c.shcho}, якщо ${c.umova}?`,
    vidpovid: zminaSlovamy(c.z),
    varianty: [zminaSlovamy(k), zminaSlovamy(-k), zminaSlovamy(0)],
    pidkazka: 'Візьми зручні числа й перевір на прикладі.',
    rozviazok: `Перевіримо: ${c.pryklad}. Отже, ${c.shcho} ${zminaSlovamy(c.z)}.`,
  };
}

// 1000 − 387 = 999 − 386; 503 − 298 = 505 − 300; 47 + 38 = 50 + 35.
function zruchno(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const a = 10 ** r.chyslo(2, 3) * r.chyslo(1, 5);
    const b = r.chyslo(Math.floor(a / 10), a - 11);
    return {
      pytannia: 'Обчисли зручно: зменш обидва числа на 1 — позичати не доведеться.',
      vyraz: `${a} − ${b} =`,
      vidpovid: a - b,
      pidkazka: `${a} − ${b} = ${a - 1} − ${b - 1}`,
      rozviazok: `${a} − ${b} = ${a - 1} − ${b - 1} = ${a - b}`,
    };
  }
  if (typ === 1) {
    const kruhle = 100 * r.chyslo(1, 8);
    const d = r.chyslo(1, 4);
    const b = kruhle - d;
    const a = r.chyslo(kruhle + 10, kruhle + 400);
    return {
      pytannia: 'Обчисли зручно: зроби від’ємник круглим.',
      vyraz: `${a} − ${b} =`,
      vidpovid: a - b,
      pidkazka: `Додай ${d} до обох чисел — різниця не зміниться.`,
      rozviazok: `${a} − ${b} = ${a + d} − ${kruhle} = ${a - b}`,
    };
  }
  const a = 10 * r.chyslo(2, 9) - r.chyslo(1, 3);
  const d = 10 - (a % 10);
  const b = r.chyslo(d + 11, 89);
  return {
    pytannia: 'Обчисли зручно: перенеси кілька одиниць з одного доданка в інший.',
    vyraz: `${a} + ${b} =`,
    vidpovid: a + b,
    pidkazka: `Додай ${d} до ${a} і стільки ж забери від ${b}.`,
    rozviazok: `${a} + ${b} = ${a + d} + ${b - d} = ${a + b}`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = 100 * r.chyslo(2, 9);
  const b = r.chyslo(101, a - 50);
  const d = r.chyslo(1, 3);
  return {
    pytannia: 'Яке число у віконці, щоб різниця не змінилась?',
    vyraz: `${a} − ${b} = ${a - d} − □`,
    vidpovid: b - d,
    pidkazka: `Зменшуване зменшили на ${d}. Від’ємник треба змінити так само.`,
    rozviazok: `${a} − ${b} = ${a - d} − ${b - d} = ${a - b}`,
  };
}

export default {
  rivni: ['зміна суми', 'зміна різниці', 'рахуємо зручно'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.75) ? suma(r, 99) : yakZminytsia(r, true);
    if (riven === 2) return r.vybir([() => riznytsia(r, 999), () => riznytsia(r, 999), () => suma(r, 999), () => yakZminytsia(r)])();
    return r.vybir([zruchno, zruchno, vikontse, (rr: Vypadok) => riznytsia(rr, 999)])(r);
  },
} satisfies Henerator;
