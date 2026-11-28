// Маса і місткість. Кілограм і літр (1 клас, Скворцова с. 105–106, 109): маса предмета на терезах у рівновазі,
// що важче (шалька нижче), місткість посудини в банках по 1 л; дії з кілограмами й літрами; задачі.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { terezy, banky } from '../vymiriuvannia.ts';

// Предмети для зважування: [називний, родовий, найбільша правдоподібна маса в кг].
const KRUPNI: [string, string, number][] = [
  ['кавун', 'кавуна', 10],
  ['гарбуз', 'гарбуза', 10],
  ['диня', 'дині', 5],
  ['качан капусти', 'качана капусти', 4],
  ['кошик', 'кошика', 7],
  ['пакунок', 'пакунка', 10],
];

/** Гирі 1, 2, 5 кг, разом не більше max. */
function hyri(r: Vypadok, max: number): number[] {
  const nabory = [[1], [2], [5], [2, 1], [5, 1], [5, 2], [2, 2], [5, 2, 1], [2, 2, 1], [5, 2, 2], [5, 5], [1, 1], [2, 1, 1], [5, 1, 1]];
  return r.vybir(nabory.filter((n) => n.reduce((a, b) => a + b, 0) <= max));
}
const suma = (n: number[]) => n.reduce((a, b) => a + b, 0);

// Маса предмета: терези в рівновазі, з одного боку предмет, з другого — гирі.
function masa(r: Vypadok): TrenZavdannia {
  const [nazva, rodovyi, max] = r.vybir(KRUPNI);
  const h = hyri(r, max);
  const zliva = r.shans();
  return {
    pytannia: `Терези в рівновазі. Яка маса ${rodovyi}?`,
    malunok: terezy(zliva ? { zliva: [nazva], sprava: h } : { zliva: h, sprava: [nazva] }),
    vidpovid: suma(h),
    odynytsi: 'кг',
    pidkazka: h.length > 1 ? 'Маса предмета дорівнює масі всіх гир. Додай їх.' : 'Маса предмета дорівнює масі гирі.',
    rozviazok: h.length > 1 ? `${h.join(' + ')} = ${suma(h)} (кг)` : `Маса ${rodovyi} — ${h[0]} кг, як у гирі.`,
  };
}

// Предмет і гиря на одній шальці, гирі — на другій: маса предмета — різниця.
function masaZHyreiu(r: Vypadok): TrenZavdannia {
  const [nazva, rodovyi, max] = r.vybir(KRUPNI);
  const svoia = r.chyslo(1, 2);
  const h = hyri(r, Math.min(10, max + svoia));
  if (suma(h) <= svoia) return masaZHyreiu(r);
  return {
    pytannia: `Терези в рівновазі. Яка маса ${rodovyi}?`,
    malunok: terezy({ zliva: [nazva, svoia], sprava: h }),
    vidpovid: suma(h) - svoia,
    odynytsi: 'кг',
    pidkazka: `${nazva.charAt(0).toUpperCase() + nazva.slice(1)} і гиря ${svoia} кг разом важать стільки, скільки гирі на другій шальці. Відніми гирю ${svoia} кг.`,
    rozviazok: h.length > 1 ? `${h.join(' + ')} = ${suma(h)} (кг); ${suma(h)} − ${svoia} = ${suma(h) - svoia} (кг)` : `${suma(h)} − ${svoia} = ${suma(h) - svoia} (кг)`,
  };
}

// Що важче — шалька, що опустилася.
const PREDMETY: [string, number][] = [
  ['зошит', 1],
  ['яблуко', 2],
  ['м’яч', 4],
  ['книжка', 5],
  ['диня', 20],
  ['гарбуз', 40],
  ['кавун', 50],
];

function shchoVazhche(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 0, PREDMETY.length - 1).map((i) => PREDMETY[i]);
  const vazhchyi = a[1] > b[1] ? a : b;
  return {
    pytannia: 'Що важче?',
    malunok: terezy({ zliva: [a[0]], sprava: [b[0]], nakhyl: vazhchyi === a ? 'zliva' : 'sprava', opys: 'Терези з двома предметами, одна шалька нижче' }),
    vidpovid: vazhchyi[0],
    varianty: [a[0], b[0]],
    pidkazka: 'Важча шалька опускається.',
    rozviazok: `Опустилася шалька, де ${vazhchyi[0]}. Там важче.`,
  };
}

// Місткість посудини: банки по 1 л.
const POSUDYNY: [string, string][] = [
  ['каструля', 'каструлі'],
  ['відро', 'відра'],
  ['бідон', 'бідона'],
  ['акваріум', 'акваріума'],
  ['таз', 'таза'],
];

function mistkist(r: Vypadok): TrenZavdannia {
  const [nazva, rodovyi] = r.vybir(POSUDYNY);
  const n = r.chyslo(2, 10);
  return {
    pytannia: `Щоб наповнити ${nazva === 'каструля' ? 'каструлю' : nazva}, вилили всю воду з банок по 1 л. Яка місткість ${rodovyi}?`,
    malunok: banky({ kilkist: n, posudyna: nazva, bez_vidpovidi: true }),
    vidpovid: n,
    odynytsi: 'л',
    pidkazka: 'Кожна банка — 1 л. Полічи банки.',
    rozviazok: `${n} ${mnozh(n, 'банка', 'банки', 'банок')} по 1 л — це ${n} л.`,
  };
}

// a кг ± b кг, a л ± b л, порівняння.
function dii(r: Vypadok): TrenZavdannia {
  const od = r.vybir(['кг', 'л']);
  const a = r.chyslo(1, 9);
  const b = r.chyslo(1, 9);
  if (r.shans(0.25)) {
    const znak = a > b ? '>' : a < b ? '<' : '=';
    return {
      pytannia: 'Порівняй.',
      vyraz: `${a} ${od} □ ${b} ${od}`,
      vidpovid: znak,
      varianty: ['>', '<', '='],
      pidkazka: `Порівняй числа ${a} і ${b}.`,
      rozviazok: `${a} ${znak} ${b}, тому ${a} ${od} ${znak} ${b} ${od}.`,
    };
  }
  if (r.shans() && a + b <= 10) {
    return {
      pytannia: 'Обчисли.',
      vyraz: `${a} ${od} + ${b} ${od} =`,
      vidpovid: a + b,
      odynytsi: od,
      pidkazka: 'Додай числа, а одиницю допиши.',
      rozviazok: `${a} + ${b} = ${a + b} (${od})`,
    };
  }
  const [v, m] = a >= b ? [a, b] : [b, a];
  if (v === m) return dii(r);
  return {
    pytannia: 'Обчисли.',
    vyraz: `${v} ${od} − ${m} ${od} =`,
    vidpovid: v - m,
    odynytsi: od,
    pidkazka: 'Відніми числа, а одиницю допиши.',
    rozviazok: `${v} − ${m} = ${v - m} (${od})`,
  };
}

// Чим вимірюють: кілограмами чи літрами.
const SHCHO: [string, 'у кілограмах' | 'у літрах'][] = [
  ['Скільки важить мішок картоплі', 'у кілограмах'],
  ['Скільки важить кавун', 'у кілограмах'],
  ['Скільки цукру в мішку', 'у кілограмах'],
  ['Скільки важить собака', 'у кілограмах'],
  ['Скільки борошна купила мама', 'у кілограмах'],
  ['Скільки води вміщує відро', 'у літрах'],
  ['Скільки соку в пакеті', 'у літрах'],
  ['Скільки молока в бідоні', 'у літрах'],
  ['Скільки води вміщує акваріум', 'у літрах'],
  ['Скільки супу в каструлі', 'у літрах'],
];

function odynytsia(r: Vypadok): TrenZavdannia {
  const [pyt, vidp] = r.vybir(SHCHO);
  return {
    pytannia: `${pyt}? У чому це вимірюють?`,
    vidpovid: vidp,
    varianty: ['у кілограмах', 'у літрах'],
    pidkazka: 'Масу (скільки важить) — у кілограмах. Скільки рідини вміщує посудина — у літрах.',
    rozviazok: vidp === 'у кілограмах' ? 'Це маса — її вимірюють у кілограмах.' : 'Це місткість, рідина — її вимірюють у літрах.',
  };
}

// Задачі з кілограмами й літрами.
function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 3);
  if (vyd === 0) {
    const a = r.chyslo(1, 9);
    const b = r.chyslo(1, 10 - a);
    const [shcho, pershyi, druhyi] = r.vybir([
      ['соку', 'томатного соку', 'яблучного'],
      ['компоту', 'вишневого компоту', 'грушевого'],
      ['морсу', 'малинового морсу', 'смородинового'],
    ]);
    return {
      pytannia: `Дідусь заготував ${a} л ${pershyi} і ${b} л ${druhyi}. Скільки всього літрів ${shcho} він заготував?`,
      vidpovid: a + b,
      odynytsi: 'л',
      pidkazka: 'Усього — це ціле. Додавай частини.',
      rozviazok: `${a} + ${b} = ${a + b} (л)`,
    };
  }
  if (vyd === 1) {
    const a = r.chyslo(3, 10);
    const b = r.chyslo(1, a - 1);
    return {
      pytannia: `У бідоні було ${a} л молока. ${b} л вилили в каструлю. Скільки літрів молока залишилось у бідоні?`,
      vidpovid: a - b,
      odynytsi: 'л',
      pidkazka: 'Частину вилили — залишилося менше. Віднімай.',
      rozviazok: `${a} − ${b} = ${a - b} (л)`,
    };
  }
  if (vyd === 2) {
    const [m, v] = r.rizni(2, 1, 10).sort((x, y) => x - y);
    return {
      pytannia: `Кавун важить ${v} кг, а диня — ${m} кг. На скільки кілограмів кавун важчий за диню?`,
      vidpovid: v - m,
      odynytsi: 'кг',
      pidkazka: 'На скільки важчий — від більшого числа відніми менше.',
      rozviazok: `${v} − ${m} = ${v - m} (кг)`,
    };
  }
  const c = r.chyslo(1, 8);
  const b = r.chyslo(1, 10 - c);
  const [shcho, dia] = r.vybir([
    ['яблук', 'продали'],
    ['печива', 'віддали'],
    ['картоплі', 'зварили'],
  ]);
  return {
    pytannia: `Після того як ${dia} ${b} кг ${shcho}, залишилося ${c} кг. Скільки кілограмів ${shcho} було спочатку?`,
    vidpovid: b + c,
    odynytsi: 'кг',
    pidkazka: 'Скільки було — це ціле. Невідоме зменшуване шукаємо додаванням.',
    rozviazok: `${c} + ${b} = ${b + c} (кг). Перевірка: ${b + c} − ${b} = ${c}`,
  };
}

export default {
  rivni: ['терези і банки', 'дії з кг і л', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([masa, masa, shchoVazhche, mistkist, mistkist])(r);
    if (riven === 2) return r.vybir([dii, dii, odynytsia, masa])(r);
    return r.vybir([zadacha, zadacha, zadacha, masaZHyreiu])(r);
  },
} satisfies Henerator;
