// Координатна пряма (Істер § 27): координата точки за малюнком (одиничний відрізок — одна чи кілька поділок),
// рух прямою праворуч і ліворуч через нуль, відстань між точками (кроки до нуля і далі), цілі числа між
// двома числами, середина відрізка.
import { ch, des, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { promin } from '../malunky.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const NAZVY = ['A', 'B', 'C', 'D', 'K', 'M', 'P'];
const odyn = (n: number) => `${n} ${mnozh(n, 'одиницю', 'одиниці', 'одиниць')}`;

/** Координата за малюнком: пряма від −k·p до k·p, підписані лише кратні p. */
function zaMalunkom(r: Vypadok, kroky: number[]): TrenZavdannia {
  const krok = r.vybir(kroky); // скільки одиниць в одній поділці (у десятих)
  const pidpysy = r.vybir([2, 3, 5]);
  const vlivo = pidpysy === 5 ? 1 : 2; // скільки підписаних проміжків ліворуч від нуля
  const min = -vlivo * pidpysy;
  const dovzhyna = 2 * vlivo * pidpysy;
  const podilka = r.krim(0, dovzhyna, Array.from({ length: dovzhyna + 1 }, (_, i) => i).filter((i) => i % pidpysy === 0));
  const nazva = r.vybir(NAZVY);
  const v = ((podilka + min) * krok) / 10;
  const z = (x: number) => (x < 0 ? `−${des(-x, 1)}` : des(x, 1));
  return {
    pytannia: `Яка координата точки ${nazva}?`,
    malunok: promin(dovzhyna, pidpysy, (i) => z((i + min) * krok), [{ nazva, podilka }]),
    vidpovid: v < 0 ? `−${des(-(podilka + min) * krok, 1)}` : des((podilka + min) * krok, 1),
    pidkazka:
      krok === 10
        ? 'Порахуй поділки від найближчого підпису.'
        : `Сусідні підписи відрізняються на ${des(pidpysy * krok, 1)}, а між ними ${pidpysy} ${mnozh(pidpysy, 'поділка', 'поділки', 'поділок')}. Скільки припадає на одну поділку?`,
    rozviazok: `Одна поділка — ${des(krok, 1)}. Точка на ${Math.abs(podilka + min)} ${mnozh(Math.abs(podilka + min), 'поділку', 'поділки', 'поділок')} ${podilka + min < 0 ? 'ліворуч' : 'праворуч'} від нуля: ${z((podilka + min) * krok)}.`,
  };
}

function rukh(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(-9, 9);
    const k = r.chyslo(2, 12);
    const pravo = r.shans();
    const b = pravo ? a + k : a - k;
    if (Math.sign(a) === Math.sign(b) && r.shans(0.7)) continue; // частіше — через нуль
    const doNulia = Math.abs(a);
    const cherez = Math.sign(a) !== Math.sign(b) && a !== 0 && b !== 0;
    return {
      pytannia: `На координатній прямій точка $A(${tz(a)})$. Точка $B$ лежить на ${odyn(k)} ${pravo ? 'правіше' : 'лівіше'}. Яка координата точки $B$?`,
      vidpovid: ch(b),
      pidkazka: cherez ? `Від ${ch(a)} до нуля — ${doNulia} ${mnozh(doNulia, 'крок', 'кроки', 'кроків')}, решта — по той бік від нуля.` : pravo ? 'Праворуч — координата більшає.' : 'Ліворуч — координата меншає.',
      rozviazok: cherez
        ? `До нуля — ${doNulia}, ще ${k} − ${doNulia} = ${k - doNulia} ${pravo ? 'праворуч' : 'ліворуч'} від нуля: B(${ch(b)}).`
        : a === 0
          ? `Від нуля на ${k} ${pravo ? 'праворуч' : 'ліворуч'}: B(${ch(b)}).`
          : `Точка ${a < 0 ? 'ліворуч' : 'праворуч'} від нуля на ${doNulia}; ${pravo === a > 0 ? `далі від нуля: ${doNulia} + ${k} = ${Math.abs(b)}` : `ближче до нуля: ${doNulia} − ${k} = ${Math.abs(b)}`}. B(${ch(b)}).`,
    };
  }
}

function vidstan(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, -15, 15).sort((x, y) => x - y);
  const [n1, n2] = r.vybir([['A', 'B'], ['M', 'N'], ['C', 'D'], ['K', 'L']]);
  const d = b - a;
  let rozviazok: string;
  if (a < 0 && b > 0) rozviazok = `Від ${ch(a)} до 0 — ${-a}, від 0 до ${b} — ${b}: ${-a} + ${b} = ${d}.`;
  else if (b <= 0) rozviazok = `Обидві точки ліворуч від нуля, на ${-a} і ${-b} одиниць: ${-a} − ${-b} = ${d}.`;
  else rozviazok = `Обидві точки праворуч від нуля: ${b} − ${a} = ${d}.`;
  return {
    pytannia: `Яка відстань між точками $${n1}(${tz(a)})$ і $${n2}(${tz(b)})$ (в одиничних відрізках)?`,
    vidpovid: d,
    pidkazka: a < 0 && b > 0 ? 'Порахуй кроки до нуля з одного боку і з другого, а потім додай.' : 'Обидві точки з одного боку від нуля: віднімай відстані до нуля.',
    rozviazok,
  };
}

function mizh(r: Vypadok): TrenZavdannia {
  const a = -r.chyslo(1, 12);
  const b = r.chyslo(1, 12);
  return {
    pytannia: `Скільки цілих чисел лежить між $${tz(a)}$ і $${b}$ (самі ці числа не рахуємо)?`,
    vidpovid: b - a - 1,
    pidkazka: `Від’ємних між ними: ${-a - 1}, ще нуль і додатні до ${b}.`,
    rozviazok: `Від’ємних — ${-a - 1}, нуль — 1, додатних — ${b - 1}: ${-a - 1} + 1 + ${b - 1} = ${b - a - 1}.`,
  };
}

/** Середина відрізка: на половині відстані від кінця. */
function seredyna(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = -r.chyslo(1, 12);
    const b = r.chyslo(1, 12);
    if ((b - a) % 2 !== 0) continue;
    const c = a + (b - a) / 2;
    return {
      pytannia: `Яка координата середини відрізка з кінцями $A(${tz(a)})$ і $B(${b})$?`,
      vidpovid: ch(c),
      pidkazka: 'Знайди довжину відрізка, поділи навпіл і відійди на стільки від лівого кінця праворуч.',
      rozviazok: `Довжина: ${-a} + ${b} = ${b - a}; половина — ${(b - a) / 2}; від ${ch(a)} праворуч на ${(b - a) / 2}: ${ch(c)}.`,
    };
  }
}

export default {
  rivni: ['координата точки і рух прямою', 'відстань між точками', 'цілі числа між точками, середина, поділка не 1'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(rr: Vypadok) => zaMalunkom(rr, [10]), rukh, rukh])(r);
    if (riven === 2) return r.vybir([vidstan, vidstan, rukh, (rr: Vypadok) => zaMalunkom(rr, [10])])(r);
    return r.vybir([mizh, seredyna, (rr: Vypadok) => zaMalunkom(rr, [5, 20, 50])])(r);
  },
} satisfies Henerator;
