// Складена задача (2 клас, Скворцова с. 49–62): дві дії на додавання й віднімання. Міркуємо від запитання:
// чого бракує — шукаємо першою дією. Запис по діях і виразом з дужками; проста чи складена — вирішує запитання.
import { dviOsoby, mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const sht = (n: number, odyn: string, dva: string, piat: string) => `${n} ${mnozh(n, odyn, dva, piat)}`;
/** Число, що не закінчується на 1 (крім 11): тоді дієслово й іменник стоять у множині — «сиділо 14 горобців». */
const bez1 = (r: Vypadok, vid: number, do_: number) => {
  for (;;) {
    const n = r.chyslo(vid, do_);
    if (n % 10 !== 1 || n === 11) return n;
  }
};

interface Siuzhet {
  umova: string; // умова без запитання
  zapytannia: string; // запитання складеної задачі
  proste: string; // запитання, з яким задача стає простою (одна дія)
  prosteRozviazok: string;
  spershu: string; // що знаходимо першою дією
  khybni: [string, string]; // неправильні відповіді на «що спершу?»
  dia1: string;
  dia2: string;
  vyraz: string;
  khybniVyrazy: [string, string];
  vidpovid: number;
  odynytsi?: string;
  pidkazka: string;
}

// Було N, двічі поменшало: N − (a + b).
function dvichiPomenshalo(r: Vypadok, mezha: number): Siuzhet {
  const N = mezha === 20 ? bez1(r, 9, 20) : bez1(r, 30, 99);
  const a = mezha === 20 ? r.chyslo(2, N - 5) : r.chyslo(5, Math.min(40, N - 12));
  const b = mezha === 20 ? r.chyslo(2, N - a - 2) : r.chyslo(4, Math.min(40, N - a - 3));
  const s = r.vybir([
    {
      umova: `На гілці сиділо ${sht(N, 'горобець', 'горобці', 'горобців')}. Спершу полетіло ${a}, а потім ще ${b}.`,
      zapytannia: 'Скільки горобців залишилося на гілці?',
      proste: 'Скільки горобців полетіло?',
      spershu: 'скільки полетіло',
      shcho: 'полетіло',
    },
    {
      umova: `У кошику було ${sht(N, 'яблуко', 'яблука', 'яблук')}. На сніданок з'їли ${a}, а на обід — ще ${b}.`,
      zapytannia: 'Скільки яблук залишилося в кошику?',
      proste: "Скільки яблук з'їли?",
      spershu: "скільки з'їли",
      shcho: "з'їли",
    },
    {
      umova: `На стоянці стояло ${sht(N, 'машина', 'машини', 'машин')}. Вранці поїхало ${a}, а вдень — ще ${b}.`,
      zapytannia: 'Скільки машин залишилося на стоянці?',
      proste: 'Скільки машин поїхало?',
      spershu: 'скільки поїхало',
      shcho: 'поїхало',
    },
    {
      umova: `На полиці стояло ${sht(N, 'книжка', 'книжки', 'книжок')}. У понеділок діти взяли ${a}, а у вівторок — ще ${b}.`,
      zapytannia: 'Скільки книжок залишилося на полиці?',
      proste: 'Скільки книжок узяли діти?',
      spershu: 'скільки взяли',
      shcho: 'взяли',
    },
  ]);
  return {
    umova: s.umova,
    zapytannia: s.zapytannia,
    proste: s.proste,
    prosteRozviazok: `${a} + ${b} = ${a + b}`,
    spershu: s.spershu,
    khybni: ['скільки було', 'скільки залишилося'],
    dia1: `${a} + ${b} = ${a + b} — ${s.shcho}`,
    dia2: `${N} − ${a + b} = ${N - a - b} — залишилося`,
    vyraz: `${N} − (${a} + ${b})`,
    khybniVyrazy: [`${N} − ${a} + ${b}`, `${a} + ${b}`],
    vidpovid: N - a - b,
    pidkazka: `Щоб знайти, скільки залишилося, треба знати, скільки всього ${s.shcho}: ${a} + ${b}.`,
  };
}

// Було a і b, потім поменшало на c: (a + b) − c.
function dviChastynyMinus(r: Vypadok, mezha: number): Siuzhet {
  const a = mezha === 20 ? r.chyslo(3, 12) : bez1(r, 12, 50);
  const b = mezha === 20 ? r.chyslo(2, 20 - a) : bez1(r, 12, Math.min(45, 98 - a));
  const c = mezha === 20 ? r.chyslo(2, a + b - 2) : r.chyslo(5, a + b - 5);
  const o = osoba(r);
  const s = r.vybir([
    {
      umova: `У вазі лежало ${sht(a, 'яблуко', 'яблука', 'яблук')} і ${sht(b, 'груша', 'груші', 'груш')}. Діти взяли ${sht(c, 'фрукт', 'фрукти', 'фруктів')}.`,
      zapytannia: 'Скільки фруктів залишилось у вазі?',
      proste: 'Скільки фруктів лежало у вазі спочатку?',
      zabraly: 'скільки взяли діти',
      od: undefined,
    },
    {
      umova: `${o.imia} ${rid(o, 'мав', 'мала')} ${a} грн у гаманці і ${b} грн у кишені. ${rid(o, 'Він купив', 'Вона купила')} альбом за ${c} грн.`,
      zapytannia: `Скільки гривень залишилося?`,
      proste: `Скільки гривень було спочатку?`,
      zabraly: 'скільки коштує альбом',
      od: 'грн',
    },
    {
      umova: `У майстра було ${a} кг цвяхів у пакеті і ${b} кг у коробці. Він витратив ${c} кг.`,
      zapytannia: 'Скільки кілограмів цвяхів залишилося?',
      proste: 'Скільки кілограмів цвяхів було спочатку?',
      zabraly: 'скільки витратив майстер',
      od: 'кг',
    },
    {
      umova: `На подвір'ї гуляло ${sht(a, 'курка', 'курки', 'курок')} і ${sht(b, 'качка', 'качки', 'качок')}. Потім ${sht(c, 'птах', 'птахи', 'птахів')} пішло в сарай.`,
      zapytannia: "Скільки птахів залишилося на подвір'ї?",
      proste: "Скільки птахів гуляло на подвір'ї спочатку?",
      zabraly: 'скільки пішло в сарай',
      od: undefined,
    },
  ]);
  return {
    umova: s.umova,
    zapytannia: s.zapytannia,
    proste: s.proste,
    prosteRozviazok: `${a} + ${b} = ${a + b}`,
    spershu: 'скільки було разом',
    khybni: ['скільки залишилося', s.zabraly],
    dia1: `${a} + ${b} = ${a + b} — було`,
    dia2: `${a + b} − ${c} = ${a + b - c} — залишилося`,
    vyraz: `(${a} + ${b}) − ${c}`,
    khybniVyrazy: [`${a} + ${b} + ${c}`, `${a} + ${b}`],
    vidpovid: a + b - c,
    odynytsi: s.od,
    pidkazka: `Щоб знайти, скільки залишилося, треба знати, скільки було разом: ${a} + ${b}.`,
  };
}

// У першого x, у другого на d більше (менше); скільки разом: x + (x ± d).
function naBilsheRazom(r: Vypadok, mezha: number): Siuzhet {
  const bilshe = r.shans();
  const x = mezha === 20 ? bez1(r, 5, 9) : bez1(r, 20, 45);
  const d = bilshe ? r.chyslo(2, mezha === 20 ? Math.min(6, 20 - 2 * x) : 9) : r.chyslo(2, mezha === 20 ? x - 2 : 9);
  const y = bilshe ? x + d : x - d;
  const [p, q] = dviOsoby(r);
  const slovo = bilshe ? 'більше' : 'менше';
  const znak = bilshe ? '+' : '−';
  const s = r.vybir([
    {
      umova: `${p.imia} має ${sht(x, 'наліпку', 'наліпки', 'наліпок')}, а ${q.imia} — на ${d} ${slovo}.`,
      zapytannia: 'Скільки наліпок у дітей разом?',
      proste: `Скільки наліпок має ${q.imia}?`,
      spershu: `скільки має ${q.imia}`,
      druhe: `має ${q.imia}`,
    },
    {
      umova: `У першому кошику ${sht(x, 'гриб', 'гриби', 'грибів')}, а в другому — на ${d} ${slovo}.`,
      zapytannia: 'Скільки грибів у двох кошиках разом?',
      proste: 'Скільки грибів у другому кошику?',
      spershu: 'скільки в другому кошику',
      druhe: 'у другому кошику',
    },
    {
      umova: `На першій полиці ${sht(x, 'книжка', 'книжки', 'книжок')}, а на другій — на ${d} ${slovo}.`,
      zapytannia: 'Скільки книжок на двох полицях разом?',
      proste: 'Скільки книжок на другій полиці?',
      spershu: 'скільки на другій полиці',
      druhe: 'на другій полиці',
    },
  ]);
  return {
    umova: s.umova,
    zapytannia: s.zapytannia,
    proste: s.proste,
    prosteRozviazok: `${x} ${znak} ${d} = ${y}`,
    spershu: s.spershu,
    khybni: ['скільки разом', `на скільки ${slovo}`],
    dia1: `${x} ${znak} ${d} = ${y} — ${s.druhe}`,
    dia2: `${x} + ${y} = ${x + y} — разом`,
    vyraz: `${x} + (${x} ${znak} ${d})`,
    khybniVyrazy: [`${x} ${znak} ${d}`, `${x} + ${d} ${znak} ${d}`],
    vidpovid: x + y,
    pidkazka: `Число ${d} — це різниця, а не кількість. Спершу знайди, скільки ${s.druhe}: ${x} ${znak} ${d}.`,
  };
}

// Було N, поменшало на a, побільшало на b: (N − a) + b.
function vyishlyZaishly(r: Vypadok, mezha: number): Siuzhet {
  const N = mezha === 20 ? bez1(r, 8, 16) : bez1(r, 30, 80);
  const a = mezha === 20 ? r.chyslo(2, N - 3) : r.chyslo(5, N - 10);
  const b = mezha === 20 ? r.krim(2, 20 - (N - a), [a]) : r.krim(5, Math.min(40, 99 - (N - a)), [a]);
  const s = r.vybir([
    {
      umova: `В автобусі їхало ${sht(N, 'пасажир', 'пасажири', 'пасажирів')}. На зупинці ${a} вийшло, а ${b} зайшло.`,
      zapytannia: 'Скільки пасажирів стало в автобусі?',
      proste: 'Скільки пасажирів залишилося, коли частина вийшла?',
      spershu: 'скільки лишилося після зупинки',
    },
    {
      umova: `На ставку плавало ${sht(N, 'качка', 'качки', 'качок')}. Потім ${a} полетіло, а ${b} прилетіло.`,
      zapytannia: 'Скільки качок стало на ставку?',
      proste: 'Скільки качок залишилося, коли частина полетіла?',
      spershu: 'скільки лишилося, коли полетіли',
    },
    {
      umova: `У магазині було ${sht(N, 'кавун', 'кавуни', 'кавунів')}. Продали ${a}, а потім привезли ще ${b}.`,
      zapytannia: 'Скільки кавунів стало в магазині?',
      proste: 'Скільки кавунів залишилося після продажу?',
      spershu: 'скільки лишилося після продажу',
    },
  ]);
  return {
    umova: s.umova,
    zapytannia: s.zapytannia,
    proste: s.proste,
    prosteRozviazok: `${N} − ${a} = ${N - a}`,
    spershu: s.spershu,
    khybni: ['скільки було спочатку', `скільки буде ${a} і ${b} разом`],
    dia1: `${N} − ${a} = ${N - a} — лишилося`,
    dia2: `${N - a} + ${b} = ${N - a + b} — стало`,
    vyraz: `(${N} − ${a}) + ${b}`,
    khybniVyrazy: [`${N} − (${a} + ${b})`, `${N} + ${a} + ${b}`],
    vidpovid: N - a + b,
    pidkazka: `Спершу знайди, скільки лишилося: ${N} − ${a}. Потім додай тих, що прибули.`,
  };
}

// У першого a і b, у другого c; на скільки більше в першого: (a + b) − c.
function naSkilkyBilshe(r: Vypadok, mezha: number): Siuzhet {
  const a = mezha === 20 ? r.chyslo(5, 9) : r.chyslo(15, 40);
  const b = mezha === 20 ? r.chyslo(2, 20 - a - 1) : r.chyslo(12, 40);
  const c = r.chyslo(Math.max(a, b), a + b - 2);
  const [p, q] = dviOsoby(r);
  return {
    umova: `${p.imia} має ${a} ${mnozh(a, 'червону кульку', 'червоні кульки', 'червоних кульок')} і ${b} ${mnozh(b, 'синю', 'сині', 'синіх')}. ${q.imia} має ${sht(c, 'кульку', 'кульки', 'кульок')}.`,
    zapytannia: `На скільки більше кульок має ${p.imia}?`,
    proste: `Скільки всього кульок має ${p.imia}?`,
    prosteRozviazok: `${a} + ${b} = ${a + b}`,
    spershu: `скільки кульок має ${p.imia}`,
    khybni: [`скільки кульок має ${q.imia}`, 'скільки кульок у дітей разом'],
    dia1: `${a} + ${b} = ${a + b} — має ${p.imia}`,
    dia2: `${a + b} − ${c} = ${a + b - c} — на стільки більше`,
    vyraz: `(${a} + ${b}) − ${c}`,
    khybniVyrazy: [`${a} + ${b} + ${c}`, `${c} − ${b}`],
    vidpovid: a + b - c,
    pidkazka: `Щоб порівняти, треба знати, скільки всього кульок має ${p.imia}: ${a} + ${b}.`,
  };
}

const rozviazok = (s: Siuzhet) => `1) ${s.dia1}; 2) ${s.dia2}. Виразом: ${s.vyraz} = ${s.vidpovid}.`;

function zadacha(s: Siuzhet): TrenZavdannia {
  return {
    pytannia: `${s.umova} ${s.zapytannia}`,
    vidpovid: s.vidpovid,
    odynytsi: s.odynytsi,
    pidkazka: s.pidkazka,
    rozviazok: rozviazok(s),
  };
}

function shchoSpershu(r: Vypadok, s: Siuzhet): TrenZavdannia {
  return {
    pytannia: `${s.umova} ${s.zapytannia} Що треба знайти першою дією?`,
    vidpovid: s.spershu,
    varianty: r.peremishaty([s.spershu, ...s.khybni]),
    pidkazka: 'Які два числа треба знати, щоб відповісти на запитання? Якого з них немає в умові?',
    rozviazok: `Першою дією шукаємо, ${s.spershu}: ${s.dia1}. Потім: ${s.dia2}.`,
  };
}

function prostaChySkladena(r: Vypadok, s: Siuzhet): TrenZavdannia {
  const prosta = r.shans();
  return {
    pytannia: `«${s.umova} ${prosta ? s.proste : s.zapytannia}» Яка це задача?`,
    vidpovid: prosta ? 'проста' : 'складена',
    varianty: ['проста', 'складена'],
    pidkazka: 'Чи можна відповісти на запитання однією дією?',
    rozviazok: prosta ? `Проста — одна дія: ${s.prosteRozviazok}.` : `Складена — дві дії: 1) ${s.dia1}; 2) ${s.dia2}.`,
  };
}

function yakyiVyraz(r: Vypadok, s: Siuzhet): TrenZavdannia {
  const bukvy = ['А', 'Б', 'В'];
  const varianty = r.peremishaty([s.vyraz, ...s.khybniVyrazy]);
  const bukva = bukvy[varianty.indexOf(s.vyraz)];
  return {
    pytannia: `${s.umova} ${s.zapytannia} Який вираз підходить? ${varianty.map((v, i) => `${bukvy[i]}) ${v}`).join('; ')}.`,
    vidpovid: bukva,
    varianty: bukvy,
    pidkazka: 'Дужки показують першу дію — те, чого бракує для відповіді.',
    rozviazok: `${bukva}. ${s.vyraz} = ${s.vidpovid}. По діях: 1) ${s.dia1}; 2) ${s.dia2}.`,
  };
}

export default {
  rivni: ['до 20: що спершу, задачі на дві дії', 'до 20: «на більше», «на менше», вибір виразу', 'до 100, проста чи складена'],
  zavdannia(r, riven) {
    if (riven === 1) {
      const s = r.vybir([dvichiPomenshalo, dviChastynyMinus, vyishlyZaishly])(r, 20);
      return r.shans(0.3) ? shchoSpershu(r, s) : zadacha(s);
    }
    if (riven === 2) {
      const s = r.vybir([naBilsheRazom, naBilsheRazom, naSkilkyBilshe, dvichiPomenshalo, dviChastynyMinus])(r, 20);
      const typ = r.chyslo(0, 9);
      if (typ < 3) return yakyiVyraz(r, s);
      if (typ < 5) return shchoSpershu(r, s);
      return zadacha(s);
    }
    const s = r.vybir([dvichiPomenshalo, dviChastynyMinus, naBilsheRazom, vyishlyZaishly, naSkilkyBilshe])(r, r.shans(0.75) ? 100 : 20);
    const typ = r.chyslo(0, 9);
    if (typ < 3) return prostaChySkladena(r, s);
    if (typ < 5) return yakyiVyraz(r, s);
    return zadacha(s);
  },
} satisfies Henerator;
