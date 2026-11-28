// Невідомі зменшуване і від'ємник (1 клас, Скворцова с. 99, 130–131): зменшуване — ціле, тому до різниці додаємо
// від'ємник; від'ємник — частина, тому від зменшуваного віднімаємо різницю. Задачі «скільки було?» і «скільки
// забрали?», двоцифрові числа без переходу через десяток.
import { mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Різниця і від'ємник від 1, зменшуване до max. */
function chastyny(r: Vypadok, max: number) {
  const c = r.chyslo(1, max - 1);
  const b = r.chyslo(1, max - c);
  return [c, b];
}

// □ − b = c.
function zmenshuvane(r: Vypadok, max: number): TrenZavdannia {
  const [c, b] = chastyny(r, max);
  const a = c + b;
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `□ − ${b} = ${c}`,
    vidpovid: a,
    pidkazka: `Зменшуване — ціле. До різниці ${c} додай від’ємник ${b}.`,
    rozviazok: `${c} + ${b} = ${a}. Перевірка: ${a} − ${b} = ${c}`,
  };
}

// a − □ = c.
function vidiemnyk(r: Vypadok, max: number): TrenZavdannia {
  const [c, b] = chastyny(r, max);
  const a = c + b;
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `${a} − □ = ${c}`,
    vidpovid: b,
    pidkazka: `Від’ємник — частина. Від зменшуваного ${a} відніми різницю ${c}.`,
    rozviazok: `${a} − ${c} = ${b}. Перевірка: ${a} − ${b} = ${c}`,
  };
}

// □ + b = c — для повторення.
function dodanok(r: Vypadok): TrenZavdannia {
  const [a, b] = chastyny(r, 10);
  const c = a + b;
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `□ + ${b} = ${c}`,
    vidpovid: a,
    pidkazka: `Доданок — частина. Від суми ${c} відніми відомий доданок ${b}.`,
    rozviazok: `${c} − ${b} = ${a}. Перевірка: ${a} + ${b} = ${c}`,
  };
}

// Яке число у віконці — як воно називається.
function shchoUViknci(r: Vypadok): TrenZavdannia {
  const [c, b] = chastyny(r, 10);
  const a = c + b;
  const [vyraz, vidp, tsile] = r.vybir([
    [`□ − ${b} = ${c}`, 'зменшуване', true],
    [`${a} − □ = ${c}`, 'від’ємник', false],
    [`${c} + □ = ${a}`, 'доданок', false],
  ] as [string, string, boolean][]);
  return {
    pytannia: `Як називається число, що сховалось у віконці: ${vyraz}?`,
    vidpovid: vidp,
    varianty: r.peremishaty(['доданок', 'зменшуване', 'від’ємник']),
    pidkazka: 'Пригадай: доданок + доданок = сума, зменшуване − від’ємник = різниця.',
    rozviazok: `У віконці — ${vidp}, це ${tsile ? 'ціле' : 'частина'}.`,
  };
}

// Якою дією знайти число у віконці.
function yakaDiia(r: Vypadok): TrenZavdannia {
  let [c, b] = chastyny(r, 10);
  while (c === b) [c, b] = chastyny(r, 10);
  const a = c + b;
  if (r.shans()) {
    // □ − b = c → c + b
    const pravylna = `${c} + ${b}`;
    const khybna = `${Math.max(b, c)} − ${Math.min(b, c)}`;
    return {
      pytannia: `Як знайти число у віконці: □ − ${b} = ${c}?`,
      vidpovid: pravylna,
      varianty: r.peremishaty([pravylna, khybna]),
      pidkazka: 'У віконці — зменшуване. Зменшуване — ціле.',
      rozviazok: `До різниці додаємо від’ємник: ${c} + ${b} = ${a}`,
    };
  }
  // a − □ = c → a − c
  const pravylna = `${a} − ${c}`;
  return {
    pytannia: `Як знайти число у віконці: ${a} − □ = ${c}?`,
    vidpovid: pravylna,
    varianty: r.peremishaty([pravylna, `${a} + ${c}`]),
    pidkazka: 'У віконці — від’ємник. Від’ємник — частина.',
    rozviazok: `Від зменшуваного віднімаємо різницю: ${a} − ${c} = ${b}`,
  };
}

// Двоцифрові числа без переходу через десяток: □ − 7 = 22, 67 − □ = 40.
function dvotsyfrovi(r: Vypadok): TrenZavdannia {
  let c = 0;
  let b = 0;
  do {
    c = r.chyslo(11, 89);
    b = r.shans() ? (c % 10 <= 8 ? r.chyslo(1, 9 - (c % 10)) : 0) : 10 * r.chyslo(1, Math.max(1, Math.floor((99 - c) / 10)));
  } while (b < 1 || c + b > 99 || (c % 10) + (b % 10) > 9);
  const a = c + b;
  if (r.shans()) {
    return {
      pytannia: 'Яке число сховалось у віконці?',
      vyraz: `□ − ${b} = ${c}`,
      vidpovid: a,
      pidkazka: `Зменшуване — ціле. До різниці ${c} додай від’ємник ${b}.`,
      rozviazok: `${c} + ${b} = ${a}. Перевірка: ${a} − ${b} = ${c}`,
    };
  }
  // Від'ємник — одноцифровий або круглі десятки, тож a − c рахується без переходу.
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `${a} − □ = ${b}`,
    vidpovid: c,
    pidkazka: `Від’ємник — частина. Від зменшуваного ${a} відніми різницю ${b}.`,
    rozviazok: `${a} − ${b} = ${c}. Перевірка: ${a} − ${c} = ${b}`,
  };
}

/** «і залишилося 5», але «і залишилася 1» — за родом слова. */
const zalyshylos = (c: number, odyn: string) => (c === 1 ? odyn : 'залишилося');

// «Скільки було?» — невідоме зменшуване.
const BULO = [
  {
    bulo: 'У вазі лежали яблука',
    dia: (b: number) => `Діти з’їли ${skilky(b, 'яблуко', 'яблука', 'яблук')}`,
    pyt: 'Скільки яблук було у вазі?',
    odyn: 'залишилося',
  },
  {
    bulo: 'На тарілці були пиріжки',
    dia: (b: number) => `Гості з’їли ${skilky(b, 'пиріжок', 'пиріжки', 'пиріжків')}`,
    pyt: 'Скільки пиріжків було на тарілці?',
    odyn: 'залишився',
  },
  {
    bulo: 'На торті горіли свічки',
    dia: (b: number) => `${skilky(b, 'свічка', 'свічки', 'свічок')} ${mnozh(b, 'згоріла', 'згоріли', 'згоріло')}`,
    pyt: 'Скільки свічок горіло спочатку?',
    odyn: 'залишилася',
  },
  {
    bulo: 'На галявині гралися зайчики',
    dia: (b: number) => `${skilky(b, 'зайчик', 'зайчики', 'зайчиків')} ${mnozh(b, 'втік', 'втекли', 'втекло')} у ліс`,
    pyt: 'Скільки зайчиків гралося спочатку?',
    odyn: 'залишився',
  },
  {
    bulo: 'У Лесі були повітряні кульки',
    dia: (b: number) => `${skilky(b, 'кулька', 'кульки', 'кульок')} ${mnozh(b, 'луснула', 'луснули', 'луснуло')}`,
    pyt: 'Скільки кульок було в Лесі?',
    odyn: 'залишилася',
  },
];

function zadachaBulo(r: Vypadok): TrenZavdannia {
  const k = r.vybir(BULO);
  const [c, b] = chastyny(r, 10);
  const a = c + b;
  const dia = k.dia(b);
  return {
    pytannia: `${k.bulo}. ${dia.charAt(0).toUpperCase() + dia.slice(1)}, і ${zalyshylos(c, k.odyn)} ${c}. ${k.pyt}`,
    vidpovid: a,
    pidkazka: 'Скільки було — це ціле: те, що забрали, і те, що залишилося, разом.',
    rozviazok: `Невідоме зменшуване: ${c} + ${b} = ${a}. Перевірка: ${a} − ${b} = ${c}`,
  };
}

// «Скільки забрали?» — невідомий від'ємник.
const ZABRALY = [
  { de: 'На гілці', bulo: ['сидів', 'сиділи', 'сиділо'], slovo: ['горобець', 'горобці', 'горобців'], dia: 'Кілька горобців полетіло', pyt: 'Скільки горобців полетіло?', odyn: 'залишився' },
  { de: 'У коробці', bulo: ['лежала', 'лежали', 'лежало'], slovo: ['цукерка', 'цукерки', 'цукерок'], dia: 'Кілька цукерок з’їли', pyt: 'Скільки цукерок з’їли?', odyn: 'залишилася' },
  { de: 'У ставку', bulo: ['плавала', 'плавали', 'плавало'], slovo: ['качка', 'качки', 'качок'], dia: 'Кілька качок вийшло на берег', pyt: 'Скільки качок вийшло на берег?', odyn: 'залишилася' },
  { de: 'На полиці', bulo: ['стояла', 'стояли', 'стояло'], slovo: ['книжка', 'книжки', 'книжок'], dia: 'Кілька книжок діти взяли почитати', pyt: 'Скільки книжок узяли діти?', odyn: 'залишилася' },
] as const;

function zadachaZabraly(r: Vypadok): TrenZavdannia {
  const k = r.vybir(ZABRALY);
  const [c, b] = chastyny(r, 10);
  const a = c + b;
  const [o, dv, p5] = k.slovo;
  return {
    pytannia: `${k.de} ${mnozh(a, ...k.bulo)} ${skilky(a, o, dv, p5)}. ${k.dia}, і ${zalyshylos(c, k.odyn)} ${c}. ${k.pyt}`,
    vidpovid: b,
    pidkazka: `Було ${a} — це ціле. Залишилося ${c} — одна частина. Шукаємо другу частину.`,
    rozviazok: `Невідомий від’ємник: ${a} − ${c} = ${b}. Перевірка: ${a} − ${b} = ${c}`,
  };
}

export default {
  rivni: ['зменшуване і від’ємник до 10', 'що у віконці і яка дія', 'задачі і двоцифрові числа'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => zmenshuvane(x, 10), (x: Vypadok) => vidiemnyk(x, 10)])(r);
    if (riven === 2)
      return r.vybir([shchoUViknci, yakaDiia, (x: Vypadok) => zmenshuvane(x, 10), (x: Vypadok) => vidiemnyk(x, 10), dodanok])(r);
    return r.vybir([zadachaBulo, zadachaZabraly, zadachaBulo, zadachaZabraly, dvotsyfrovi])(r);
  },
} satisfies Henerator;
