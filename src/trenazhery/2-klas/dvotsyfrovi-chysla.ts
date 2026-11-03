// Двоцифрові числа: десятки й одиниці, розрядні доданки, порівняння, сусіди, найбільше з цифр.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const des = (n: number) => `${n} ${mnozh(n, 'десяток', 'десятки', 'десятків')}`;
const od = (n: number) => `${n} ${mnozh(n, 'одиниця', 'одиниці', 'одиниць')}`;

function rozriady(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(1, 9);
  const o = r.chyslo(0, 9);
  const n = 10 * d + o;
  return r.vybir<() => TrenZavdannia>([
    () => ({ pytannia: `Скільки десятків у числі ${n}?`, vidpovid: d, pidkazka: 'Перша цифра — десятки.', rozviazok: `${n} — це ${des(d)} і ${od(o)}.` }),
    () => ({ pytannia: `${n} — це ${des(d)} і скільки одиниць?`, vidpovid: o, pidkazka: 'Друга цифра — одиниці.', rozviazok: `${n} — це ${des(d)} і ${od(o)}.` }),
    () => ({
      pytannia: o ? `${des(d)} і ${od(o)} — яке це число?` : `${des(d)} — яке це число?`,
      vidpovid: n,
      pidkazka: 'Спершу пиши десятки, потім одиниці.' + (o ? '' : ' Одиниць немає — пиши 0.'),
      rozviazok: `${10 * d} + ${o} = ${n}`,
    }),
    () => ({
      pytannia: `${d} ${mnozh(d, 'пучок', 'пучки', 'пучків')} по 10 паличок і ще ${Math.max(o, 1)} ${mnozh(Math.max(o, 1), 'паличка', 'палички', 'паличок')}. Скільки всього паличок?`,
      vidpovid: 10 * d + Math.max(o, 1),
      pidkazka: 'Кожен пучок — це десяток.',
      rozviazok: `${des(d)} і ${od(Math.max(o, 1))} — це ${10 * d + Math.max(o, 1)}.`,
    }),
  ])();
}

function rozriadniDodanky(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(1, 9);
  const o = r.chyslo(1, 9);
  const n = 10 * d + o;
  return r.shans()
    ? { pytannia: 'Яке число у віконці?', vyraz: `${n} = ${10 * d} + □`, vidpovid: o, pidkazka: 'Скільки одиниць понад круглі десятки?', rozviazok: `${n} = ${10 * d} + ${o}` }
    : { pytannia: 'Яке число у віконці?', vyraz: `${n} = □ + ${o}`, vidpovid: 10 * d, pidkazka: `${d} десятки (десятків) — це скільки?`, rozviazok: `${n} = ${10 * d} + ${o}` };
}

function porivniaty(a: number, b: number, znak: string) {
  if (znak === '=') return 'Числа однакові.';
  const [da, db] = [Math.floor(a / 10), Math.floor(b / 10)];
  if (da !== db) return `Порівнюємо десятки: ${da} ${da > db ? '>' : '<'} ${db}, тому ${a} ${znak} ${b}.`;
  return `Десятки однакові, порівнюємо одиниці: ${a % 10} ${znak} ${b % 10}, тому ${a} ${znak} ${b}.`;
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(10, 99);
  let b = r.chyslo(10, 99);
  // Часто — «пастка»: ті самі цифри в іншому порядку (56 і 65).
  if (r.shans(0.35) && a % 10 && Math.floor(a / 10) !== a % 10) b = (a % 10) * 10 + Math.floor(a / 10);
  if (r.shans(0.1)) b = a;
  const znak = a > b ? '>' : a < b ? '<' : '=';
  return {
    pytannia: 'Який знак поставити?',
    vyraz: `${a} □ ${b}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Спершу порівнюй десятки. Однакові — тоді одиниці.',
    rozviazok: porivniaty(a, b, znak),
  };
}

function susid(r: Vypadok): TrenZavdannia {
  const n = r.shans(0.4) ? 10 * r.chyslo(2, 9) - r.chyslo(0, 1) : r.chyslo(11, 98);
  return r.shans()
    ? { pytannia: `Яке число йде одразу після ${n}?`, vidpovid: n + 1, pidkazka: 'На 1 більше.', rozviazok: `${n} + 1 = ${n + 1}` }
    : { pytannia: `Яке число стоїть одразу перед ${n}?`, vidpovid: n - 1, pidkazka: 'На 1 менше.', rozviazok: `${n} − 1 = ${n - 1}` };
}

function zTsyfr(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 1, 9);
  const naibilshe = r.shans();
  const [m, v] = [Math.min(a, b), Math.max(a, b)];
  return {
    pytannia: `Склади з цифр ${a} і ${b} ${naibilshe ? 'найбільше' : 'найменше'} двоцифрове число (кожну цифру — один раз).`,
    vidpovid: naibilshe ? 10 * v + m : 10 * m + v,
    pidkazka: naibilshe ? 'Більшу цифру став на місце десятків.' : 'Меншу цифру став на місце десятків.',
    rozviazok: `${10 * v + m} > ${10 * m + v}, бо десятків більше.`,
  };
}

export default {
  rivni: ['десятки й одиниці', 'порівняння й сусіди', 'розрядні доданки і найбільше з цифр'],
  zavdannia(r, riven) {
    if (riven === 1) return rozriady(r);
    if (riven === 2) return r.vybir([rozriady, porivniannia, susid])(r);
    return r.vybir([rozriadniDodanky, porivniannia, susid, zTsyfr])(r);
  },
} satisfies Henerator;
