// Ознаки подільності на 2, 5, 10 (остання цифра) і на 3, 9 (сума цифр); цифра замість зірочки.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const sumaTsyfr = (n: number) => [...String(n)].reduce((s, c) => s + Number(c), 0);

const OZNAKY: Record<number, (n: number) => string> = {
  2: (n) => `Остання цифра ${n % 10} — ${n % 2 === 0 ? 'парна' : 'непарна'}.`,
  5: (n) => `Остання цифра ${n % 10} — ${n % 5 === 0 ? 'це 0 або 5' : 'не 0 і не 5'}.`,
  10: (n) => `Остання цифра ${n % 10} — ${n % 10 === 0 ? 'нуль' : 'не нуль'}.`,
  3: (n) => `Сума цифр ${[...String(n)].join(' + ')} = ${sumaTsyfr(n)} — ${sumaTsyfr(n) % 3 === 0 ? 'ділиться' : 'не ділиться'} на 3.`,
  9: (n) => `Сума цифр ${[...String(n)].join(' + ')} = ${sumaTsyfr(n)} — ${sumaTsyfr(n) % 9 === 0 ? 'ділиться' : 'не ділиться'} на 9.`,
};

function chyDilytsia(r: Vypadok, na: number[]): TrenZavdannia {
  const d = r.vybir(na);
  const tak = r.shans();
  let n = r.chyslo(100, 99999);
  if (tak) n -= n % d;
  else if (n % d === 0) n += 1;
  // Пастка для 3 і 9: число, що ділиться на 3, але не на 9.
  if (d === 9 && !tak && r.shans(0.5)) {
    n = r.chyslo(34, 33333) * 3;
    if (n % 9 === 0) n += 3;
  }
  return {
    pytannia: `Чи ділиться ${ch(n)} на ${d}?`,
    vidpovid: n % d === 0 ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: d === 3 || d === 9 ? `Додай усі цифри. Чи ділиться сума на ${d}?` : 'Подивись на останню цифру.',
    rozviazok: OZNAKY[d](n),
  };
}

function zirochka(r: Vypadok): TrenZavdannia {
  const d = r.vybir([3, 9]);
  // Тризначне або чотиризначне число з однією невідомою цифрою.
  const dovzhyna = r.chyslo(3, 4);
  const tsyfry = Array.from({ length: dovzhyna }, (_, i) => (i === 0 ? r.chyslo(1, 9) : r.chyslo(0, 9)));
  const poz = r.chyslo(1, dovzhyna - 1);
  const inshi = tsyfry.reduce((s, c, i) => (i === poz ? s : s + c), 0);
  const pidkhodiat = Array.from({ length: 10 }, (_, x) => x).filter((x) => (inshi + x) % d === 0);
  const zapys = tsyfry.map((c, i) => (i === poz ? '*' : String(c))).join('');
  if (d === 3) {
    return {
      pytannia: `Яку найменшу цифру можна поставити замість зірочки в ${zapys}, щоб число ділилося на 3?`,
      vidpovid: pidkhodiat[0],
      pidkazka: `Сума відомих цифр — ${inshi}. Скільки треба додати, щоб сума ділилася на 3?`,
      rozviazok: `${inshi} + ${pidkhodiat[0]} = ${inshi + pidkhodiat[0]} — ділиться на 3. Підходять: ${pidkhodiat.join(', ')}; найменша — ${pidkhodiat[0]}.`,
    };
  }
  return {
    pytannia: `Яку цифру поставити замість зірочки в ${zapys}, щоб число ділилося на 9?${pidkhodiat.length > 1 ? ' Якщо підходить кілька — запиши всі через кому.' : ''}`,
    vidpovid: pidkhodiat.join(', '),
    pidkazka: `Сума відомих цифр — ${inshi}. До якого числа, кратного 9, її доповнити?`,
    rozviazok: pidkhodiat.map((x) => `${inshi} + ${x} = ${inshi + x}`).join('; ') + ' — ділиться на 9.',
  };
}

function kilka(r: Vypadok): TrenZavdannia {
  // На які з чисел 2, 3, 5, 9, 10 ділиться число?
  const n = r.chyslo(10, 999) * r.vybir([1, 2, 3, 5, 6, 9, 10, 15, 18]);
  const na = [2, 3, 5, 9, 10].filter((d) => n % d === 0);
  if (!na.length) return kilka(r);
  return {
    pytannia: `На які з чисел 2, 3, 5, 9, 10 ділиться ${ch(n)}? Запиши через кому.`,
    vidpovid: na.join(', '),
    pidkazka: 'Перевір кожне: остання цифра — для 2, 5, 10; сума цифр — для 3 і 9.',
    rozviazok: `Остання цифра ${n % 10}, сума цифр ${sumaTsyfr(n)}. Ділиться на ${na.join(', ')}.`,
  };
}

export default {
  rivni: ['на 2, 5 і 10', 'на 3 і 9', 'цифра замість зірочки'],
  zavdannia(r, riven) {
    if (riven === 1) return chyDilytsia(r, [2, 5, 10]);
    if (riven === 2) return chyDilytsia(r, [3, 9, 3, 9, 2, 5]);
    return r.vybir([zirochka, zirochka, kilka])(r);
  },
} satisfies Henerator;
