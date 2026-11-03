// Числа від 0 до 10: лічба, наступне й попереднє число, порівняння, пропуски в ряду.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

const ZNACHKY = ['⭐', '🍎', '🐟', '🌸', '🎈', '🐞', '🍓', '⚽'];

function lichba(r: Vypadok, mezha: number): TrenZavdannia {
  const n = r.chyslo(1, mezha);
  return {
    pytannia: 'Скільки тут предметів? Порахуй по одному.',
    vyraz: r.vybir(ZNACHKY).repeat(n),
    vidpovid: n,
    pidkazka: 'Торкайся кожного по черзі й називай: один, два, три…',
    rozviazok: n > 5 ? `П'ять і ще ${n - 5} — це ${n}.` : `Рахуємо по одному: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.`,
  };
}

function susid(r: Vypadok, mezha: number): TrenZavdannia {
  if (r.shans()) {
    const n = r.chyslo(0, mezha - 1);
    return {
      pytannia: `Яке число йде одразу після ${n}?`,
      vidpovid: n + 1,
      pidkazka: 'Наступне число — на 1 більше.',
      rozviazok: `${n} + 1 = ${n + 1}`,
    };
  }
  const n = r.chyslo(1, mezha);
  return {
    pytannia: `Яке число стоїть одразу перед ${n}?`,
    vidpovid: n - 1,
    pidkazka: 'Попереднє число — на 1 менше.',
    rozviazok: `${n} − 1 = ${n - 1}`,
  };
}

function porivniannia(r: Vypadok, mezha: number): TrenZavdannia {
  const a = r.chyslo(0, mezha);
  const b = r.shans(0.15) ? a : r.krim(0, mezha, [a]);
  const znak = a > b ? '>' : a < b ? '<' : '=';
  return {
    pytannia: 'Який знак поставити замість віконця?',
    vyraz: `${a} □ ${b}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Яке число в ряду стоїть далі? Воно більше. Гострий кінчик знака дивиться на менше.',
    rozviazok:
      znak === '=' ? `Числа однакові: ${a} = ${b}.` : `${Math.max(a, b)} більше за ${Math.min(a, b)}, тому ${a} ${znak} ${b}.`,
  };
}

function propusk(r: Vypadok): TrenZavdannia {
  const vgoru = r.shans(0.7);
  const pochatok = vgoru ? r.chyslo(0, 7) : r.chyslo(3, 10);
  const riad = Array.from({ length: 4 }, (_, i) => (vgoru ? pochatok + i : pochatok - i));
  const i = r.chyslo(1, 3);
  const vidpovid = riad[i];
  return {
    pytannia: 'Яке число пропущене в ряду?',
    vyraz: riad.map((x, j) => (j === i ? '□' : String(x))).join(', '),
    vidpovid,
    pidkazka: vgoru ? 'Кожне наступне число на 1 більше.' : 'Тут числа йдуть назад: кожне наступне на 1 менше.',
    rozviazok: riad.join(', '),
  };
}

function mizh(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(1, 9);
  return {
    pytannia: `Яке число стоїть між ${n - 1} і ${n + 1}?`,
    vidpovid: n,
    pidkazka: `Після ${n - 1} одразу йде…`,
    rozviazok: `${n - 1}, ${n}, ${n + 1}`,
  };
}

export default {
  rivni: ['лічба до 5', 'числа до 10', 'сусіди, порівняння і пропуски в ряду'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([lichba, susid, porivniannia])(r, 5);
    if (riven === 2) return r.vybir([lichba, susid, porivniannia])(r, 10);
    return r.vybir([() => susid(r, 10), () => porivniannia(r, 10), () => propusk(r), () => mizh(r)])();
  },
} satisfies Henerator;
