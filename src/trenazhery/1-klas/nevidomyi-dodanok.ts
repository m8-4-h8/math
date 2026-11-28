// Невідомий доданок (1 клас, Скворцова с. 47, 68–69): назви чисел при додаванні й відніманні; число у віконці
// □ + 3 = 7 — сума ціле, доданки частини, тому від суми віднімаємо відомий доданок; задачі «разом», «прилетіло ще»,
// «скільки було спочатку».
import { mnozh, skilky, osoba, dviOsoby, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Два доданки, обидва від 1, сума до max. */
function dodanky(r: Vypadok, max: number) {
  const a = r.chyslo(1, max - 1);
  const b = r.chyslo(1, max - a);
  return [a, b];
}

function rozviazok(a: number, b: number, nevidomyiPershyi: boolean) {
  const c = a + b;
  const [x, vidomyi] = nevidomyiPershyi ? [a, b] : [b, a];
  return `Від суми ${c} віднімаємо відомий доданок ${vidomyi}: ${c} − ${vidomyi} = ${x}. Перевірка: ${a} + ${b} = ${c}`;
}

// □ + b = c або a + □ = c.
function dodanok(r: Vypadok, max: number): TrenZavdannia {
  const [a, b] = dodanky(r, max);
  const c = a + b;
  const pershyi = r.shans();
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: pershyi ? `□ + ${b} = ${c}` : `${a} + □ = ${c}`,
    vidpovid: pershyi ? a : b,
    pidkazka: `Сума — ${c}, відомий доданок — ${pershyi ? b : a}. Від суми відніми відомий доданок.`,
    rozviazok: rozviazok(a, b, pershyi),
  };
}

// Сума зліва: c = a + □.
function sumaZliva(r: Vypadok): TrenZavdannia {
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const pershyi = r.shans();
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: pershyi ? `${c} = □ + ${b}` : `${c} = ${a} + □`,
    vidpovid: pershyi ? a : b,
    pidkazka: 'Сума тут стоїть зліва від «=». Знайди суму і від неї відніми відомий доданок.',
    rozviazok: rozviazok(a, b, pershyi),
  };
}

// З рівності на додавання — рівність на віднімання.
function triika(r: Vypadok): TrenZavdannia {
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const bezA = r.shans();
  return {
    pytannia: `Відомо, що ${a} + ${b} = ${c}. Яке число у віконці?`,
    vyraz: bezA ? `${c} − ${a} = □` : `${c} − ${b} = □`,
    vidpovid: bezA ? b : a,
    pidkazka: 'Від суми забрали один доданок. Що залишилось?',
    rozviazok: bezA ? `${c} − ${a} = ${b}, бо ${a} + ${b} = ${c}` : `${c} − ${b} = ${a}, бо ${a} + ${b} = ${c}`,
  };
}

const NAZVY_DOD = ['доданок', 'сума', 'різниця'];
const NAZVY_VID = ['зменшуване', 'від’ємник', 'різниця'];

// Як називається число в рівності. Усі три числа різні, щоб відповідь була одна.
function nazva(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    let [a, b] = dodanky(r, 10);
    while (a === b) [a, b] = dodanky(r, 10);
    const c = a + b;
    const [chyslo, vidp] = r.vybir([
      [a, 'доданок'],
      [b, 'доданок'],
      [c, 'сума'],
    ] as [number, string][]);
    return {
      pytannia: `Як називається число ${chyslo} у рівності ${a} + ${b} = ${c}?`,
      vidpovid: vidp,
      varianty: r.peremishaty(NAZVY_DOD),
      pidkazka: 'Пригадай: доданок + доданок = сума.',
      rozviazok: `${a} + ${b} = ${c}: ${a} і ${b} — доданки, ${c} — сума.`,
    };
  }
  let [c, b] = dodanky(r, 10);
  while (c === b) [c, b] = dodanky(r, 10);
  const a = c + b;
  const [chyslo, vidp] = r.vybir([
    [a, 'зменшуване'],
    [b, 'від’ємник'],
    [c, 'різниця'],
  ] as [number, string][]);
  return {
    pytannia: `Як називається число ${chyslo} у рівності ${a} − ${b} = ${c}?`,
    vidpovid: vidp,
    varianty: r.peremishaty(NAZVY_VID),
    pidkazka: 'Пригадай: зменшуване − від’ємник = різниця.',
    rozviazok: `${a} − ${b} = ${c}: ${a} — зменшуване, ${b} — від’ємник, ${c} — різниця.`,
  };
}

// Якою дією знайти доданок.
function yakaDiia(r: Vypadok): TrenZavdannia {
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const pershyi = r.shans();
  const vidomyi = pershyi ? b : a;
  const pravylna = `${c} − ${vidomyi}`;
  return {
    pytannia: `Як знайти число у віконці: ${pershyi ? `□ + ${b}` : `${a} + □`} = ${c}?`,
    vidpovid: pravylna,
    varianty: r.peremishaty([pravylna, `${c} + ${vidomyi}`]),
    pidkazka: 'Сума — ціле, доданок — частина. Частину шукаємо відніманням.',
    rozviazok: `Від суми віднімаємо відомий доданок: ${c} − ${vidomyi} = ${c - vidomyi}`,
  };
}

// Двоцифрові числа без переходу через десяток: □ + 5 = 27, 20 + □ = 54.
function dvotsyfrovi(r: Vypadok): TrenZavdannia {
  let x = 0;
  let b = 0;
  do {
    x = r.chyslo(11, 89);
    b = r.shans() ? (x % 10 <= 8 ? r.chyslo(1, 9 - (x % 10)) : 0) : 10 * r.chyslo(1, Math.max(1, Math.floor((99 - x) / 10)));
  } while (b < 1 || x + b > 99 || (x % 10) + (b % 10) > 9);
  const c = x + b;
  const pershyi = r.shans();
  const [a, bb] = pershyi ? [x, b] : [b, x];
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: pershyi ? `□ + ${bb} = ${c}` : `${a} + □ = ${c}`,
    vidpovid: x,
    pidkazka: `Від суми ${c} відніми відомий доданок ${b}.`,
    rozviazok: rozviazok(a, bb, pershyi),
  };
}

// Задача «разом»: двоє разом мають c, один — a. Скільки в другого?
const RAZOM = [
  { dieslovo: ['зібрав', 'зібрала', 'зібрали'], slovo: ['гриб', 'гриби', 'грибів'] },
  { dieslovo: ['зірвав', 'зірвала', 'зірвали'], slovo: ['яблуко', 'яблука', 'яблук'] },
  { dieslovo: ['намалював', 'намалювала', 'намалювали'], slovo: ['малюнок', 'малюнки', 'малюнків'] },
  { dieslovo: ['зліпив', 'зліпила', 'зліпили'], slovo: ['сніжку', 'сніжки', 'сніжок'] },
] as const;

function zadachaRazom(r: Vypadok): TrenZavdannia {
  const [p, d] = dviOsoby(r);
  const k = r.vybir(RAZOM);
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const [o, dv, p5] = k.slovo;
  return {
    pytannia: `${p.imia} і ${d.imia} разом ${k.dieslovo[2]} ${skilky(c, o, dv, p5)}. ${p.imia} ${rid(p, k.dieslovo[0], k.dieslovo[1])} ${skilky(a, o, dv, p5)}. Скільки ${p5} ${rid(d, k.dieslovo[0], k.dieslovo[1])} ${d.imia}?`,
    vidpovid: b,
    pidkazka: `Усього ${c} — це сума. Те, що ${rid(p, k.dieslovo[0], k.dieslovo[1])} ${p.imia}, — відомий доданок.`,
    rozviazok: `${c} — сума, ${a} — відомий доданок: ${c} − ${a} = ${b}. Перевірка: ${a} + ${b} = ${c}`,
  };
}

// «Було a, прийшли ще кілька, стало c» — скільки прийшло (другий доданок).
const DODALY = [
  { de: 'На гілці', bulo: ['сиділа', 'сиділи', 'сиділо'], slovo: ['пташка', 'пташки', 'пташок'], dia: 'Прилетіло ще кілька', pyt: 'Скільки пташок прилетіло?' },
  { de: 'На столі', bulo: ['лежав', 'лежали', 'лежало'], slovo: ['олівець', 'олівці', 'олівців'], dia: 'Поклали ще кілька', pyt: 'Скільки олівців поклали?' },
  { de: 'У ставку', bulo: ['плавала', 'плавали', 'плавало'], slovo: ['качка', 'качки', 'качок'], dia: 'Припливло ще кілька', pyt: 'Скільки качок припливло?' },
  { de: 'На лавці', bulo: ['сидів', 'сиділи', 'сиділо'], slovo: ['хлопчик', 'хлопчики', 'хлопчиків'], dia: 'Прийшло ще кілька', pyt: 'Скільки хлопчиків прийшло?' },
] as const;

function zadachaDodaly(r: Vypadok): TrenZavdannia {
  const k = r.vybir(DODALY);
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const [o, dv, p5] = k.slovo;
  return {
    pytannia: `${k.de} ${mnozh(a, ...k.bulo)} ${skilky(a, o, dv, p5)}. ${k.dia}, і стало ${c}. ${k.pyt}`,
    vidpovid: b,
    pidkazka: `Стало ${c} — це сума. Було ${a} — відомий доданок.`,
    rozviazok: `${c} − ${a} = ${b}. Перевірка: ${a} + ${b} = ${c}`,
  };
}

// «Були …, додали b, стало c» — скільки було спочатку (перший доданок).
const SPOCHATKU = [
  { bulo: 'На полиці стояли книжки', dia: 'Поставили ще', slovo: ['книжку', 'книжки', 'книжок'], pyt: 'Скільки книжок було на полиці спочатку?' },
  { bulo: 'У кошику лежали яблука', dia: 'Поклали ще', slovo: ['яблуко', 'яблука', 'яблук'], pyt: 'Скільки яблук було в кошику спочатку?' },
  { bulo: 'В акваріумі плавали рибки', dia: 'Туди пустили ще', slovo: ['рибку', 'рибки', 'рибок'], pyt: 'Скільки рибок було в акваріумі спочатку?' },
] as const;

function zadachaSpochatku(r: Vypadok): TrenZavdannia {
  if (r.shans(0.3)) {
    // Те саме з дитиною: «Оля мала кілька наліпок…»
    const o = osoba(r);
    const [a, b] = dodanky(r, 10);
    const c = a + b;
    return {
      pytannia: `${o.imia} ${rid(o, 'мав', 'мала')} кілька наліпок. Мама подарувала ще ${skilky(b, 'наліпку', 'наліпки', 'наліпок')}, і стало ${c}. Скільки наліпок ${rid(o, 'мав', 'мала')} ${o.imia} спочатку?`,
      vidpovid: a,
      pidkazka: `Стало ${c} — це сума. Подарувала ${b} — відомий доданок.`,
      rozviazok: `${c} − ${b} = ${a}. Перевірка: ${a} + ${b} = ${c}`,
    };
  }
  const k = r.vybir(SPOCHATKU);
  const [a, b] = dodanky(r, 10);
  const c = a + b;
  const [o, dv, p5] = k.slovo;
  return {
    pytannia: `${k.bulo}. ${k.dia} ${skilky(b, o, dv, p5)}, і стало ${c}. ${k.pyt}`,
    vidpovid: a,
    pidkazka: `Стало ${c} — це сума. Те, що додали, — відомий доданок.`,
    rozviazok: `${c} − ${b} = ${a}. Перевірка: ${a} + ${b} = ${c}`,
  };
}

export default {
  rivni: ['віконце в межах 10', 'назви чисел і сума зліва', 'задачі і двоцифрові числа'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => dodanok(x, 10), (x: Vypadok) => dodanok(x, 10), triika])(r);
    if (riven === 2) return r.vybir([nazva, nazva, sumaZliva, yakaDiia, (x: Vypadok) => dodanok(x, 10)])(r);
    return r.vybir([zadachaRazom, zadachaDodaly, zadachaSpochatku, dvotsyfrovi, sumaZliva])(r);
  },
} satisfies Henerator;
