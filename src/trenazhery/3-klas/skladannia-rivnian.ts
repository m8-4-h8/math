// Складаємо рівняння (3 клас): за назвами чисел, за текстом про задумане число, за простою задачею.
// Дитина складає рівняння сама й вписує корінь; у завданнях «яке рівняння підходить» обирає букву.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// ——— Рівень 1: за назвами чисел ———
function zaNazvamy(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 5);
  const kinets = ' Склади рівняння і знайди невідоме число.';
  if (typ === 0) {
    const x = r.chyslo(4, 50);
    const a = r.chyslo(5, 95 - x);
    const pershyi = r.shans();
    return {
      pytannia: (pershyi ? `Перший доданок невідомий, другий доданок ${a}` : `Перший доданок ${a}, другий доданок невідомий`) + `, сума ${x + a}.` + kinets,
      vidpovid: x,
      pidkazka: `Постав числа на місця: ${pershyi ? `x + ${a}` : `${a} + x`} = ${x + a}. Доданок — частина.`,
      rozviazok: `${pershyi ? `x + ${a}` : `${a} + x`} = ${x + a}; x = ${x + a} − ${a} = ${x}.`,
    };
  }
  if (typ === 1) {
    const d = r.chyslo(3, 50);
    const a = r.chyslo(5, 95 - d);
    return {
      pytannia: `Зменшуване невідоме, від'ємник ${a}, різниця ${d}.` + kinets,
      vidpovid: d + a,
      pidkazka: `Постав числа на місця: x − ${a} = ${d}. Зменшуване — ціле.`,
      rozviazok: `x − ${a} = ${d}; x = ${d} + ${a} = ${d + a}.`,
    };
  }
  if (typ === 2) {
    const x = r.chyslo(4, 50);
    const d = r.krim(3, 95 - x, [x]);
    return {
      pytannia: `Зменшуване ${x + d}, від'ємник невідомий, різниця ${d}.` + kinets,
      vidpovid: x,
      pidkazka: `Постав числа на місця: ${x + d} − x = ${d}. Від'ємник — частина.`,
      rozviazok: `${x + d} − x = ${d}; x = ${x + d} − ${d} = ${x}.`,
    };
  }
  const a = r.chyslo(2, 9);
  if (typ === 3) {
    const x = r.chyslo(2, 9);
    const pershyi = r.shans();
    return {
      pytannia: (pershyi ? `Перший множник невідомий, другий множник ${a}` : `Перший множник ${a}, другий множник невідомий`) + `, добуток ${x * a}.` + kinets,
      vidpovid: x,
      pidkazka: `Постав числа на місця: ${pershyi ? `x · ${a}` : `${a} · x`} = ${x * a}. Множник — частина.`,
      rozviazok: `${pershyi ? `x · ${a}` : `${a} · x`} = ${x * a}; x = ${x * a} : ${a} = ${x}.`,
    };
  }
  if (typ === 4) {
    const ch = r.chyslo(2, 9);
    return {
      pytannia: `Ділене невідоме, дільник ${a}, частка ${ch}.` + kinets,
      vidpovid: ch * a,
      pidkazka: `Постав числа на місця: x : ${a} = ${ch}. Ділене — ціле.`,
      rozviazok: `x : ${a} = ${ch}; x = ${ch} · ${a} = ${ch * a}.`,
    };
  }
  const x = r.chyslo(2, 9);
  const ch = r.krim(2, 9, [x]);
  return {
    pytannia: `Ділене ${x * ch}, дільник невідомий, частка ${ch}.` + kinets,
    vidpovid: x,
    pidkazka: `Постав числа на місця: ${x * ch} : x = ${ch}. Дільник — частина.`,
    rozviazok: `${x * ch} : x = ${ch}; x = ${x * ch} : ${ch} = ${x}.`,
  };
}

// ——— Рівень 2: текст про число ———
interface Tekst {
  tekst: string; // «Невідоме число зменшили на 16 й одержали 9»
  rivniannia: string; // «x − 16 = 9»
  korin: number;
  dia: string; // «9 + 16»
  khybni: string[]; // схожі, але неправильні рівняння
  slovo: string; // пояснення словничком
}

const raziv = (k: number) => mnozh(k, 'раз', 'рази', 'разів');

function tekstProChyslo(r: Vypadok): Tekst {
  const typ = r.chyslo(0, 5);
  if (typ === 0) {
    const x = r.chyslo(4, 50);
    const a = r.chyslo(5, 95 - x);
    return {
      tekst: `Невідоме число збільшили на ${a} і одержали ${x + a}`,
      rivniannia: `x + ${a} = ${x + a}`,
      korin: x,
      dia: `${x + a} − ${a}`,
      khybni: [`x · ${a} = ${x + a}`, `x − ${a} = ${x + a}`],
      slovo: '«Збільшили на» — додали.',
    };
  }
  if (typ === 1) {
    const d = r.chyslo(3, 50);
    const a = r.chyslo(5, 95 - d);
    return {
      tekst: `Невідоме число зменшили на ${a} і одержали ${d}`,
      rivniannia: `x − ${a} = ${d}`,
      korin: d + a,
      dia: `${d} + ${a}`,
      khybni: [`${a} − x = ${d}`, `x : ${a} = ${d}`],
      slovo: '«Зменшили на» — відняли. Зменшували невідоме число, тому воно стоїть першим.',
    };
  }
  if (typ === 2) {
    const x = r.chyslo(4, 50);
    const d = r.krim(3, 95 - x, [x]);
    return {
      tekst: `Від числа ${x + d} відняли невідоме число й одержали ${d}`,
      rivniannia: `${x + d} − x = ${d}`,
      korin: x,
      dia: `${x + d} − ${d}`,
      khybni: [`x − ${x + d} = ${d}`, `${x + d} + x = ${d}`],
      slovo: `Віднімали від ${x + d}, тому першим стоїть ${x + d}.`,
    };
  }
  const k = r.chyslo(2, 9);
  if (typ === 3) {
    const x = r.chyslo(2, 9);
    return {
      tekst: `Невідоме число збільшили у ${k} ${raziv(k)} ${k < 5 ? 'й' : 'і'} одержали ${x * k}`,
      rivniannia: `x · ${k} = ${x * k}`,
      korin: x,
      dia: `${x * k} : ${k}`,
      khybni: [`x + ${k} = ${x * k}`, `x : ${k} = ${x * k}`],
      slovo: '«Збільшили у кілька разів» — помножили.',
    };
  }
  if (typ === 4) {
    const ch = r.chyslo(2, 9);
    return {
      tekst: `Невідоме число зменшили у ${k} ${raziv(k)} ${k < 5 ? 'й' : 'і'} одержали ${ch}`,
      rivniannia: `x : ${k} = ${ch}`,
      korin: ch * k,
      dia: `${ch} · ${k}`,
      khybni: [`x − ${k} = ${ch}`, `${k} : x = ${ch}`],
      slovo: '«Зменшили у кілька разів» — поділили.',
    };
  }
  const x = r.chyslo(2, 9);
  const ch = r.krim(2, 9, [x]);
  return {
    tekst: `Число ${x * ch} розділили на невідоме число й одержали ${ch}`,
    rivniannia: `${x * ch} : x = ${ch}`,
    korin: x,
    dia: `${x * ch} : ${ch}`,
    khybni: [`x : ${x * ch} = ${ch}`, `${x * ch} − x = ${ch}`],
    slovo: `Ділили число ${x * ch}, тому воно стоїть першим.`,
  };
}

function zadumaly(r: Vypadok): TrenZavdannia {
  const t = tekstProChyslo(r);
  return {
    pytannia: `${t.tekst}. Склади рівняння і знайди невідоме число.`,
    vidpovid: t.korin,
    pidkazka: `${t.slovo} Почни запис з того числа, з яким щось робили.`,
    rozviazok: `${t.rivniannia}; x = ${t.dia} = ${t.korin}.`,
  };
}

function yakeRivniannia(r: Vypadok): TrenZavdannia {
  const t = tekstProChyslo(r);
  const bukvy = ['А', 'Б', 'В'];
  const varianty = r.peremishaty([t.rivniannia, ...t.khybni]);
  const pravylna = bukvy[varianty.indexOf(t.rivniannia)];
  return {
    pytannia: `«${t.tekst}». Яке рівняння підходить? ${varianty.map((v, i) => `${bukvy[i]}) ${v}`).join('; ')}.`,
    vidpovid: pravylna,
    varianty: bukvy,
    pidkazka: t.slovo,
    rozviazok: `${pravylna}) ${t.rivniannia}. ${t.slovo}`,
  };
}

// ——— Рівень 3: прості задачі ———
function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 6);
  const o = osoba(r);
  if (typ === 0) {
    const a = r.chyslo(6, 30);
    const b = r.chyslo(8, 60);
    return {
      pytannia: `${o.imia} ${rid(o, 'збирав', 'збирала')} наліпки. Коли ${rid(o, 'він подарував', 'вона подарувала')} другові ${a} ${mnozh(a, 'наліпку', 'наліпки', 'наліпок')}, залишилось ${b}. Скільки наліпок було спочатку? Розв'яжи рівнянням.`,
      vidpovid: a + b,
      pidkazka: `Розкажи по порядку: було x, ${rid(o, 'подарував', 'подарувала')} ${a}, залишилось ${b}.`,
      rozviazok: `x − ${a} = ${b}; x = ${b} + ${a} = ${a + b}.`,
    };
  }
  if (typ === 1) {
    const x = r.chyslo(12, 60);
    const a = r.chyslo(6, 95 - x);
    return {
      pytannia: `На полиці стояли книжки. Коли поставили ще ${a}, їх стало ${x + a}. Скільки книжок стояло спочатку? Розв'яжи рівнянням.`,
      vidpovid: x,
      pidkazka: `Розкажи по порядку: було x, поставили ${a}, стало ${x + a}.`,
      rozviazok: `x + ${a} = ${x + a}; x = ${x + a} − ${a} = ${x}.`,
    };
  }
  if (typ === 2) {
    const s = r.chyslo(12, 40);
    const x = r.chyslo(3, s - 5);
    return {
      pytannia: `${o.imia} ${rid(o, 'спіймав', 'спіймала')} ${s} ${mnozh(s, 'рибину', 'рибини', 'рибин')}. Кілька рибин ${rid(o, 'він відпустив', 'вона відпустила')}, і залишилось ${s - x}. Скільки рибин ${rid(o, 'відпустив', 'відпустила')} ${o.imia}? Розв'яжи рівнянням.`,
      vidpovid: x,
      pidkazka: `Розкажи по порядку: було ${s}, ${rid(o, 'відпустив', 'відпустила')} x, залишилось ${s - x}.`,
      rozviazok: `${s} − x = ${s - x}; x = ${s} − ${s - x} = ${x}.`,
    };
  }
  if (typ === 3) {
    const a = r.chyslo(12, 50);
    const x = r.chyslo(10, 95 - a);
    return {
      pytannia: `У двох кошиках разом ${a + x} ${mnozh(a + x, 'яблуко', 'яблука', 'яблук')}. У першому кошику — ${a}. Скільки яблук у другому кошику? Розв'яжи рівнянням.`,
      vidpovid: x,
      pidkazka: `Разом — це сума: ${a} + x = ${a + x}.`,
      rozviazok: `${a} + x = ${a + x}; x = ${a + x} − ${a} = ${x}.`,
    };
  }
  const k = r.chyslo(2, 9);
  const x = r.chyslo(2, 9);
  if (typ === 4) {
    return {
      pytannia: `Цукерки розділили порівну між ${k} дітьми. Кожному дісталося по ${x} ${mnozh(x, 'цукерці', 'цукерки', 'цукерок')}. Скільки всього було цукерок? Розв'яжи рівнянням.`,
      vidpovid: x * k,
      pidkazka: `Розкажи по порядку: x цукерок поділили на ${k}, вийшло по ${x}.`,
      rozviazok: `x : ${k} = ${x}; x = ${x} · ${k} = ${x * k}.`,
    };
  }
  if (typ === 5) {
    return {
      pytannia: `За ${k} ${mnozh(k, 'однаковий зошит', 'однакові зошити', 'однакових зошитів')} заплатили ${x * k} грн. Скільки коштує один зошит? Розв'яжи рівнянням.`,
      vidpovid: x,
      odynytsi: 'грн',
      pidkazka: `Ціна одного зошита — x. За ${k} ${mnozh(k, 'зошит', 'зошити', 'зошитів')}: x · ${k} = ${x * k}.`,
      rozviazok: `x · ${k} = ${x * k}; x = ${x * k} : ${k} = ${x} (грн).`,
    };
  }
  return {
    pytannia: `${x * k} ${mnozh(x * k, 'олівець', 'олівці', 'олівців')} розклали в коробки, по ${k} ${mnozh(k, 'олівець', 'олівці', 'олівців')} у кожну. Скільки вийшло коробок? Розв'яжи рівнянням.`,
    vidpovid: x,
    pidkazka: `Коробок — x. Усі олівці поділили по ${k}: ${x * k} : x = ${k} або ${k} · x = ${x * k}.`,
    rozviazok: `${k} · x = ${x * k}; x = ${x * k} : ${k} = ${x}.`,
  };
}

export default {
  rivni: ['за назвами чисел', 'за текстом про число', 'за задачею'],
  zavdannia(r, riven) {
    if (riven === 1) return zaNazvamy(r);
    if (riven === 2) return r.shans(0.65) ? zadumaly(r) : yakeRivniannia(r);
    return r.vybir([zadacha, zadacha, zadacha, zadumaly, yakeRivniannia])(r);
  },
} satisfies Henerator;
