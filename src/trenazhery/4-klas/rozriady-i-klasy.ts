// Розряди і класи багатоцифрових чисел: запис цифрами, цифра в розряді, «скільки всього тисяч»,
// розрядні доданки, порівняння, сусіди на межі класів.
import { ch, slovamy, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Назви розрядів справа наліво: 0 — одиниці, 3 — одиниці тисяч, 6 — одиниці мільйонів.
const ROZRIADY = [
  'одиниць',
  'десятків',
  'сотень',
  'одиниць тисяч',
  'десятків тисяч',
  'сотень тисяч',
  'одиниць мільйонів',
  'десятків мільйонів',
  'сотень мільйонів',
];

// Число з нулями в деяких розрядах — саме на них діти помиляються.
function chyslo(r: Vypadok, tsyfr: number) {
  let n = r.chyslo(1, 9);
  for (let i = 1; i < tsyfr; i++) n = n * 10 + (r.shans(0.3) ? 0 : r.chyslo(0, 9));
  return n;
}

function zapysh(r: Vypadok, tsyfr: number): TrenZavdannia {
  const n = chyslo(r, tsyfr);
  return {
    pytannia: `Запиши цифрами: «${slovamy(n)}».`,
    vidpovid: n,
    pidkazka: 'Пиши по класах, по три цифри. Якщо в класі чогось немає — став нулі.',
    rozviazok: `${ch(n)}`,
  };
}

function tsyfraVRozriadi(r: Vypadok, tsyfr: number): TrenZavdannia {
  const n = chyslo(r, tsyfr);
  const i = r.chyslo(0, tsyfr - 1);
  const tsyfra = Math.floor(n / 10 ** i) % 10;
  const klas = i >= 6 ? 'мільйонів' : i >= 3 ? 'тисяч' : 'одиниць';
  return {
    pytannia: `Яка цифра стоїть у розряді ${ROZRIADY[i]} у числі ${ch(n)}?`,
    vidpovid: tsyfra,
    pidkazka: `Розбий число на класи по три цифри справа. Знайди клас ${klas}.`,
    rozviazok: `Цифра ${tsyfra} у розряді ${ROZRIADY[i]}.`,
  };
}

function usihoTysiach(r: Vypadok, tsyfr: number): TrenZavdannia {
  const n = chyslo(r, tsyfr);
  if (r.shans(0.6)) {
    return {
      pytannia: `Скільки всього цілих тисяч у числі ${ch(n)}?`,
      vidpovid: Math.floor(n / 1000),
      pidkazka: 'Відкинь клас одиниць — останні три цифри.',
      rozviazok: `${ch(n)} — це ${ch(Math.floor(n / 1000))} тис. і ще ${n % 1000}.`,
    };
  }
  return {
    pytannia: `Скільки всього сотень у числі ${ch(n)}?`,
    vidpovid: Math.floor(n / 100),
    pidkazka: 'Відкинь дві останні цифри — десятки й одиниці.',
    rozviazok: `${ch(n)} — це ${ch(Math.floor(n / 100))} сот. і ще ${n % 100}.`,
  };
}

function dodanky(r: Vypadok, tsyfr: number): TrenZavdannia {
  const n = chyslo(r, tsyfr);
  const chastyny = [...String(n)].map((c, i) => Number(c) * 10 ** (tsyfr - 1 - i)).filter(Boolean);
  if (chastyny.length < 3) return zapysh(r, tsyfr);
  if (r.shans()) {
    const i = r.chyslo(0, chastyny.length - 1);
    return {
      pytannia: 'Яке число у віконці?',
      vyraz: `${ch(n)} = ${chastyny.map((x, j) => (j === i ? '□' : ch(x))).join(' + ')}`,
      vidpovid: chastyny[i],
      pidkazka: 'Кожна цифра — це розрядний доданок: цифра й стільки нулів, скільки розрядів праворуч.',
      rozviazok: `${ch(n)} = ${chastyny.map(ch).join(' + ')}`,
    };
  }
  return {
    pytannia: 'Запиши число цифрами.',
    vyraz: `${chastyny.map(ch).join(' + ')} =`,
    vidpovid: n,
    pidkazka: 'Розряди, яких немає серед доданків, заповни нулями.',
    rozviazok: `${chastyny.map(ch).join(' + ')} = ${ch(n)}`,
  };
}

function porivniannia(r: Vypadok, tsyfr: number): TrenZavdannia {
  const a = chyslo(r, tsyfr);
  const s = [...String(a)];
  let b: number;
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    // Ті самі цифри, дві сусідні переставлені: 70 708 і 70 078.
    const i = r.chyslo(1, s.length - 2);
    const t = [...s];
    [t[i], t[i + 1]] = [t[i + 1], t[i]];
    b = Number(t.join(''));
  } else if (typ === 1) {
    b = chyslo(r, tsyfr - 1); // менше цифр — менше число, хоч би якими були цифри
  } else if (typ === 2) {
    b = a;
  } else {
    b = a + r.vybir([-1, 1]) * 10 ** r.chyslo(0, tsyfr - 2);
  }
  const znak = a > b ? '>' : a < b ? '<' : '=';
  const tsyfrA = String(a).length;
  const tsyfrB = String(b).length;
  return {
    pytannia: 'Порівняй.',
    vyraz: `${ch(a)} □ ${ch(b)}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Спершу порівняй кількість цифр. Якщо однаково — порівнюй зліва направо до першої різної цифри.',
    rozviazok:
      znak === '='
        ? 'Числа однакові.'
        : tsyfrA !== tsyfrB
          ? `У числі ${ch(Math.max(a, b))} більше цифр, тож ${ch(a)} ${znak} ${ch(b)}.`
          : `Перша різна цифра більша в ${ch(Math.max(a, b))}, тож ${ch(a)} ${znak} ${ch(b)}.`,
  };
}

function susid(r: Vypadok): TrenZavdannia {
  // Межі класів і розрядів: 999 999 + 1, 10 000 − 1, 309 999 + 1.
  const n = r.vybir([
    10 ** r.chyslo(4, 7),
    r.chyslo(1, 9) * 10 ** r.chyslo(4, 6),
    r.chyslo(10, 99) * 10 ** r.chyslo(3, 4),
    r.chyslo(11, 999) * 1000,
  ]);
  return r.shans()
    ? {
        pytannia: `Запиши цифрами число, яке йде одразу після ${ch(n - 1)}.`,
        vidpovid: n,
        pidkazka: 'На 1 більше. Дев’ятки в кінці стають нулями, а цифра перед ними збільшується.',
        rozviazok: `${ch(n - 1)} + 1 = ${ch(n)}`,
      }
    : {
        pytannia: `Запиши цифрами число, яке стоїть одразу перед ${ch(n)}.`,
        vidpovid: n - 1,
        pidkazka: 'На 1 менше. Нулі в кінці стають дев’ятками.',
        rozviazok: `${ch(n)} − 1 = ${ch(n - 1)}`,
      };
}

function klasy(r: Vypadok): TrenZavdannia {
  const tsyfr = r.chyslo(4, 9);
  const n = chyslo(r, tsyfr);
  const k = Math.ceil(tsyfr / 3);
  return {
    pytannia: `Скільки класів у числі ${ch(n)}?`,
    vidpovid: k,
    varianty: [1, 2, 3],
    pidkazka: 'Розбий число на трійки цифр справа. Неповна трійка зліва — теж клас.',
    rozviazok: `${ch(n)}: ${k === 3 ? 'мільйони, тисячі, одиниці' : 'тисячі, одиниці'} — ${k} класи.`,
  };
}

export default {
  rivni: ['до мільйона: запис і розряди', 'розрядні доданки, порівняння, «скільки всього»', 'мільйони і межі класів'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zapysh, tsyfraVRozriadi])(r, r.chyslo(4, 6));
    if (riven === 2) return r.vybir([dodanky, porivniannia, usihoTysiach, tsyfraVRozriadi])(r, r.chyslo(5, 6));
    return r.vybir([
      () => zapysh(r, r.chyslo(7, 9)),
      () => tsyfraVRozriadi(r, r.chyslo(7, 9)),
      () => dodanky(r, 7),
      () => porivniannia(r, r.chyslo(6, 8)),
      () => usihoTysiach(r, r.chyslo(6, 8)),
      () => susid(r),
      () => klasy(r),
    ])();
  },
} satisfies Henerator;
