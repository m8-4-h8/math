// Округлення натуральних чисел: дивимось на першу відкинуту цифру — 0–4 вниз, 5–9 вгору.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const DO = [
  { k: 10, nazva: 'десятків' },
  { k: 100, nazva: 'сотень' },
  { k: 1000, nazva: 'тисяч' },
  { k: 10000, nazva: 'десятків тисяч' },
  { k: 1000000, nazva: 'мільйонів' },
];

const okruhlyty = (n: number, k: number) => Math.round(n / k) * k;

function chyslo(r: Vypadok, k: number) {
  // Цікаві випадки: перша відкинута цифра 4 або 5; перенос через 9 (3962 → 4000).
  const vyshche = r.chyslo(1, 99) * k * 10; // цифри старші за розряд округлення
  const p = k / 10; // розрядна одиниця першої відкинутої цифри
  const typ = r.chyslo(0, 3);
  if (typ === 0) return vyshche + r.chyslo(0, 9) * k + r.vybir([4, 5]) * p + r.chyslo(0, p - 1);
  if (typ === 1) return vyshche + 9 * k + r.chyslo(5, 9) * p + r.chyslo(0, p - 1);
  return vyshche + r.chyslo(1, 10 * k - 1);
}

function okruhlennia(r: Vypadok, rivni: typeof DO): TrenZavdannia {
  const d = r.vybir(rivni);
  let n = chyslo(r, d.k);
  if (n % d.k === 0) n += r.chyslo(1, d.k - 1);
  const rez = okruhlyty(n, d.k);
  const vidkynuta = Math.floor((n % d.k) / (d.k / 10));
  return {
    pytannia: `Округли ${ch(n)} до ${d.nazva}.`,
    vidpovid: rez,
    pidkazka: 'Подивись на першу цифру, яку відкидаємо: 0–4 — розряд не змінюється, 5–9 — збільшуємо на 1.',
    rozviazok: `Перша відкинута цифра ${vidkynuta} — ${vidkynuta >= 5 ? 'округлюємо вгору' : 'округлюємо вниз'}: ${ch(n)} ≈ ${ch(rez)}.`,
  };
}

function zMezhamy(r: Vypadok): TrenZavdannia {
  // Яке найбільше / найменше число округлюється до заданого?
  const k = r.vybir([10, 100]);
  const tsil = r.chyslo(2, 99) * k;
  const naibilshe = r.shans();
  return {
    pytannia: `Яке ${naibilshe ? 'найбільше' : 'найменше'} натуральне число після округлення до ${k === 10 ? 'десятків' : 'сотень'} дає ${ch(tsil)}?`,
    vidpovid: naibilshe ? tsil + k / 2 - 1 : tsil - k / 2,
    pidkazka: `Вгору до ${ch(tsil)} округлюються числа, у яких відкинута цифра 5–9, вниз — 0–4.`,
    rozviazok: naibilshe
      ? `${ch(tsil + k / 2 - 1)} ≈ ${ch(tsil)}, а ${ch(tsil + k / 2)} ≈ ${ch(tsil + k)}.`
      : `${ch(tsil - k / 2)} ≈ ${ch(tsil)}, а ${ch(tsil - k / 2 - 1)} ≈ ${ch(tsil - k)}.`,
  };
}

function zhyttia(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { tekst: (n: number) => `У місті живе ${ch(n)} людей. Округли це число до тисяч.`, k: 1000, min: 20000, max: 990000 },
    { tekst: (n: number) => `Відстань від Києва до Одеси — ${n} км. Округли до сотень.`, k: 100, min: 470, max: 480 },
    { tekst: (n: number) => `На стадіоні ${ch(n)} глядачів. Округли до десятків тисяч.`, k: 10000, min: 21000, max: 79999 },
    { tekst: (n: number) => `Телефон коштує ${ch(n)} грн. Округли ціну до тисяч.`, k: 1000, min: 4100, max: 29900 },
  ]);
  let n = r.chyslo(s.min, s.max);
  if (n % s.k === 0) n += 1;
  return {
    pytannia: s.tekst(n),
    vidpovid: okruhlyty(n, s.k),
    pidkazka: 'Знайди розряд, до якого округлюємо, і подивись на цифру праворуч від нього.',
    rozviazok: `${ch(n)} ≈ ${ch(okruhlyty(n, s.k))}`,
  };
}

export default {
  rivni: ['до десятків і сотень', 'до тисяч і далі', 'з життя і «яке найбільше»'],
  zavdannia(r, riven) {
    if (riven === 1) return okruhlennia(r, DO.slice(0, 2));
    if (riven === 2) return okruhlennia(r, DO.slice(1));
    return r.vybir([zhyttia, zhyttia, zMezhamy, (rr: Vypadok) => okruhlennia(rr, DO)])(r);
  },
} satisfies Henerator;
