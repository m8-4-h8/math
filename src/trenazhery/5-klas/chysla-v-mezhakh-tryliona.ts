// Числа в межах трильйона (Скворцова, 5 клас, с. 71–74): лічильні одиниці (мільйон, мільярд, трильйон), запис
// числа за класами («45 мільярдів 128 мільйонів…»), порожні класи, «скільки всього мільйонів», клас цифри,
// порівняння великих чисел, сусіди на межі класів, найменше й найбільше n-цифрове число.
import { ch, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Класи від молодшого: 0 — одиниці, 1 — тисячі, 2 — мільйони, 3 — мільярди, 4 — трильйони.
const NAZVY: [string, string, string][] = [
  ['', '', ''],
  ['тисяча', 'тисячі', 'тисяч'],
  ['мільйон', 'мільйони', 'мільйонів'],
  ['мільярд', 'мільярди', 'мільярдів'],
  ['трильйон', 'трильйони', 'трильйонів'],
];
const KLAS_RODOVYI = ['одиниць', 'тисяч', 'мільйонів', 'мільярдів', 'трильйонів'];
const ODYNYTSIA = [
  { nazva: 'мільйон', nuliv: 6 },
  { nazva: 'мільярд', nuliv: 9 },
  { nazva: 'трильйон', nuliv: 12 },
];

/** Класи числа від старшого: 45 128 000 324 → [45, 128, 0, 324]. */
function klasy(n: number) {
  const k: number[] = [];
  for (let x = n; x > 0; x = Math.floor(x / 1000)) k.unshift(x % 1000);
  return k;
}

/** «45 мільярдів 128 мільйонів 324» — порожні класи пропускаємо, як у підручнику. */
function zaKlasamy(n: number) {
  const k = klasy(n);
  return k
    .map((x, i) => {
      const riven = k.length - 1 - i;
      if (x === 0) return '';
      return riven === 0 ? String(x) : `${x} ${mnozh(x, ...NAZVY[riven])}`;
    })
    .filter(Boolean)
    .join(' ');
}

/** Число з `klasiv` класів; у старшому класі 1–3 цифри; `porozhni` — скільки середніх класів зробити нулями. */
function chyslo(r: Vypadok, klasiv: number, porozhni = 0) {
  const k = [r.chyslo(1, r.vybir([9, 99, 999]))];
  for (let i = 1; i < klasiv; i++) k.push(r.shans(0.3) ? r.chyslo(1, 99) : r.chyslo(100, 999));
  const mozhna = Array.from({ length: klasiv - 1 }, (_, i) => i + 1);
  for (const i of r.peremishaty(mozhna).slice(0, porozhni)) k[i] = 0;
  return k.reduce((a, x) => a * 1000 + x, 0);
}

function zapysh(r: Vypadok, porozhni: number): TrenZavdannia {
  const n = chyslo(r, porozhni ? r.chyslo(4, 5) : r.chyslo(3, 5), porozhni);
  const k = klasy(n);
  return {
    pytannia: `Запиши цифрами: ${zaKlasamy(n)}.`,
    vidpovid: n,
    pidkazka: 'Пиши по класах. У кожному класі, крім першого зліва, — рівно три цифри; клас, якого немає, — 000.',
    rozviazok: `${k.map((x, i) => (i === 0 ? String(x) : String(x).padStart(3, '0'))).join(' | ')} → ${ch(n)}`,
  };
}

function odynytsi(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const o = r.vybir(ODYNYTSIA);
    return {
      pytannia: `Скільки нулів у записі числа ${o.nazva}?`,
      vidpovid: o.nuliv,
      pidkazka: 'Тисяча — 3 нулі. Кожна наступна лічильна одиниця додає ще три.',
      rozviazok: `${o.nazva} — ${ch(10 ** o.nuliv)}, нулів ${o.nuliv}.`,
    };
  }
  // «7 мільярдів — це скільки мільйонів?» і навпаки.
  const i = r.chyslo(2, 4);
  const k = r.chyslo(2, 30);
  const [velyka, mala] = [NAZVY[i], NAZVY[i - 1]];
  if (typ === 1) {
    return {
      pytannia: `${k} ${mnozh(k, ...velyka)} — це скільки ${mala[2]}?`,
      vidpovid: k * 1000,
      pidkazka: `В одному ${velyka[0] === 'мільйон' ? 'мільйоні' : velyka[0] === 'мільярд' ? 'мільярді' : 'трильйоні'} — 1000 ${mala[2]}.`,
      rozviazok: `${k} · 1000 = ${ch(k * 1000)} ${mala[2]}`,
    };
  }
  return {
    pytannia: `${ch(k * 1000)} ${mala[2]} — це скільки ${velyka[2]}?`,
    vidpovid: k,
    pidkazka: `1000 ${mala[2]} становлять один ${velyka[0]}.`,
    rozviazok: `${ch(k * 1000)} : 1000 = ${k} ${mnozh(k, ...velyka)}`,
  };
}

function klasTsyfry(r: Vypadok): TrenZavdannia {
  for (;;) {
    const n = chyslo(r, r.chyslo(3, 5));
    const s = String(n);
    const poz = r.chyslo(0, s.length - 1);
    const t = s[poz];
    if (s.indexOf(t) !== s.lastIndexOf(t)) continue; // цифра має бути одна така
    const riven = Math.floor((s.length - 1 - poz) / 3);
    const varianty = KLAS_RODOVYI.slice(0, klasy(n).length).map((x) => `клас ${x}`);
    return {
      pytannia: `До якого класу належить цифра ${t} у числі ${ch(n)}?`,
      vidpovid: `клас ${KLAS_RODOVYI[riven]}`,
      varianty,
      pidkazka: 'Розбий число на класи по три цифри справа наліво.',
      rozviazok: `Класи: ${klasy(n).map((x, i) => (i === 0 ? String(x) : String(x).padStart(3, '0'))).join(' | ')}. Цифра ${t} — у класі ${KLAS_RODOVYI[riven]}.`,
    };
  }
}

function usiho(r: Vypadok): TrenZavdannia {
  const n = chyslo(r, r.chyslo(4, 5), r.chyslo(0, 1));
  const i = r.chyslo(1, klasy(n).length - 2);
  const v = Math.floor(n / 1000 ** i);
  return {
    pytannia: `Скільки всього ${KLAS_RODOVYI[i]} у числі ${ch(n)}?`,
    vidpovid: v,
    pidkazka: `Відкинь ${i === 1 ? 'клас одиниць — три цифри справа' : `класи праворуч від класу ${KLAS_RODOVYI[i]} — ${3 * i} цифр`}.`,
    rozviazok: `${ch(n)} — це ${ch(v)} ${KLAS_RODOVYI[i]}${n % 1000 ** i ? ` і ще ${ch(n % 1000 ** i)}` : ''}.`,
  };
}

function tsyfr(r: Vypadok): TrenZavdannia {
  const n = chyslo(r, r.chyslo(3, 5), r.chyslo(1, 2));
  const k = String(n).length;
  return {
    pytannia: `Скільки цифр у записі числа «${zaKlasamy(n)}»?`,
    vidpovid: k,
    pidkazka: 'Запиши число цифрами: кожен клас, крім першого, — три цифри, навіть якщо він порожній.',
    rozviazok: `${ch(n)} — ${k} ${mnozh(k, 'цифра', 'цифри', 'цифр')}.`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  const klasiv = r.chyslo(3, 5);
  const a = chyslo(r, klasiv, r.chyslo(0, 1));
  const s = [...String(a)];
  let b: number;
  let slovamy = false;
  const typ = r.chyslo(0, 4);
  if (typ === 0) {
    // На одну цифру менше, зате перша цифра більша: 4 506 788 і 9 506 78.
    b = Number(String(Math.min(9, Number(s[0]) + r.chyslo(1, 5))) + s.slice(2).join(''));
  } else if (typ === 1) {
    // Сусідні цифри переставлені.
    const i = r.chyslo(1, s.length - 2);
    const t = [...s];
    [t[i], t[i + 1]] = [t[i + 1], t[i]];
    b = Number(t.join(''));
  } else if (typ === 2) {
    b = a + r.vybir([-1, 1]) * 10 ** r.chyslo(3, s.length - 2);
  } else {
    // Одне з чисел записане словами за класами; іноді вони рівні.
    slovamy = true;
    b = r.shans(0.4) ? a : a + r.vybir([-1, 1]) * 1000 ** r.chyslo(1, klasiv - 2);
  }
  const znak = a > b ? '>' : a < b ? '<' : '=';
  const zapysA = slovamy ? zaKlasamy(a) : ch(a);
  return {
    pytannia: 'Порівняй.',
    vyraz: `${zapysA} □ ${ch(b)}`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: slovamy
      ? 'Запиши перше число цифрами, а потім порівнюй.'
      : 'Спершу порівняй кількість цифр. Якщо однаково — порівнюй зліва направо до першої різної цифри.',
    rozviazok:
      (slovamy ? `${zaKlasamy(a)} — це ${ch(a)}. ` : '') +
      (znak === '='
        ? 'Числа однакові.'
        : String(a).length !== String(b).length
          ? `У числі ${ch(Math.max(a, b))} більше цифр, тож ${ch(a)} ${znak} ${ch(b)}.`
          : `Перша різна цифра більша в числі ${ch(Math.max(a, b))}, тож ${ch(a)} ${znak} ${ch(b)}.`),
  };
}

function susid(r: Vypadok): TrenZavdannia {
  const n = r.vybir([10 ** r.chyslo(7, 12), r.chyslo(2, 9) * 10 ** r.chyslo(6, 11), r.chyslo(11, 999) * 10 ** r.vybir([6, 9])]);
  return r.shans()
    ? {
        pytannia: `Запиши цифрами число, яке йде одразу після ${ch(n - 1)}.`,
        vidpovid: n,
        pidkazka: 'На 1 більше. Дев’ятки в кінці стають нулями, а цифра перед ними збільшується на 1.',
        rozviazok: `${ch(n - 1)} + 1 = ${ch(n)}`,
      }
    : {
        pytannia: `Запиши цифрами число, яке стоїть одразу перед ${ch(n)}.`,
        vidpovid: n - 1,
        pidkazka: 'На 1 менше. Нулі в кінці стають дев’ятками.',
        rozviazok: `${ch(n)} − 1 = ${ch(n - 1)}`,
      };
}

function kraini(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(7, 13);
  const NAZVA: Record<number, string> = {
    7: 'семицифрове', 8: 'восьмицифрове', 9: "дев'ятицифрове", 10: 'десятицифрове',
    11: 'одинадцятицифрове', 12: 'дванадцятицифрове', 13: 'тринадцятицифрове',
  };
  const slovo = (x: number) => NAZVA[x];
  if (r.shans()) {
    return {
      pytannia: `Запиши найменше ${slovo(k)} число.`,
      vidpovid: 10 ** (k - 1),
      pidkazka: 'Перша цифра — найменша, але не нуль; решта — нулі.',
      rozviazok: `${ch(10 ** (k - 1))}: одиниця і ${k - 1} ${mnozh(k - 1, 'нуль', 'нулі', 'нулів')}.`,
    };
  }
  return {
    pytannia: `Запиши найбільше ${slovo(k)} число.`,
    vidpovid: 10 ** k - 1,
    pidkazka: 'Усі цифри — найбільші.',
    rozviazok: `${ch(10 ** k - 1)}: ${k} дев'яток. Наступне число ${ch(10 ** k)} має вже ${k + 1} ${mnozh(k + 1, 'цифру', 'цифри', 'цифр')}.`,
  };
}

export default {
  rivni: ['лічильні одиниці, запис за класами', 'порожні класи, «скільки всього»', 'порівняння, сусіди, найбільше й найменше'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([odynytsi, (x: Vypadok) => zapysh(x, 0), (x: Vypadok) => zapysh(x, 0), klasTsyfry])(r);
    if (riven === 2) return r.vybir([(x: Vypadok) => zapysh(x, r.chyslo(1, 2)), usiho, tsyfr, odynytsi])(r);
    return r.vybir([porivniannia, porivniannia, susid, kraini, (x: Vypadok) => zapysh(x, 2)])(r);
  },
} satisfies Henerator;
