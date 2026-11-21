// Дроби (4 клас): що показують чисельник і знаменник, запис дробу цифрами й словами, дріб і число 1,
// порівняння дробів з однаковими знаменниками (і з чисельником 1), дріб як частина величини.
import { dviOsoby, mnozh, rid, rivnyiDrib, tdrib, ZRAZKY, zrazok, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { smuzhka } from '../malunky.ts';

const CHYSELNYK = ['', 'одна', 'дві', 'три', 'чотири', "п'ять", 'шість', 'сім', 'вісім', "дев'ять", 'десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', "п'ятнадцять", 'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"];
const DESIATKY = ['', '', 'двадцять', 'тридцять', 'сорок', "п'ятдесят", 'шістдесят', 'сімдесят', 'вісімдесят', "дев'яносто"];
/** Знаменник словами: [одна частина, кілька частин] — «восьма», «восьмих». */
const ZNAMENNYK: Record<number, [string, string]> = {
  2: ['друга', 'других'],
  3: ['третя', 'третіх'],
  4: ['четверта', 'четвертих'],
  5: ["п'ята", "п'ятих"],
  6: ['шоста', 'шостих'],
  7: ['сьома', 'сьомих'],
  8: ['восьма', 'восьмих'],
  9: ["дев'ята", "дев'ятих"],
  10: ['десята', 'десятих'],
  11: ['одинадцята', 'одинадцятих'],
  12: ['дванадцята', 'дванадцятих'],
  15: ["п'ятнадцята", "п'ятнадцятих"],
  20: ['двадцята', 'двадцятих'],
  100: ['сота', 'сотих'],
};

/** Чисельник словами (1–99, крім 21, 31, … — там «одна» з множиною звучить незвично для дитини). */
function chyselnykSlovamy(n: number) {
  if (n < 20) return CHYSELNYK[n];
  return n % 10 === 0 ? DESIATKY[n / 10] : `${DESIATKY[Math.floor(n / 10)]} ${CHYSELNYK[n % 10]}`;
}
const slovamy = (n: number, d: number) => (n === 1 ? `одна ${ZNAMENNYK[d][0]}` : `${chyselnykSlovamy(n)} ${ZNAMENNYK[d][1]}`);

/** Знаменник і чисельник для запису словами. */
function dribDlia(r: Vypadok) {
  if (r.shans(0.2)) {
    let n = r.chyslo(2, 99);
    while (n % 10 === 1 && n !== 11) n = r.chyslo(2, 99);
    return { n, d: 100 };
  }
  const d = r.vybir([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20]);
  return { n: r.chyslo(1, d - 1), d };
}

const zapysDrobu = (vidpovid: string, n: number, d: number) => `Запиши дріб через риску, наприклад ${zrazok(ZRAZKY.drib, vidpovid, rivnyiDrib(n, d))}.`;

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 10);
  const n = r.chyslo(1, d - 1);
  const ne = r.shans(0.3);
  const a = ne ? d - n : n;
  const v = `${a}/${d}`;
  return {
    pytannia: `Яку частину смужки ${ne ? 'НЕ ' : ''}зафарбовано? ${zapysDrobu(v, a, d)}`,
    malunok: smuzhka(n, d),
    vidpovid: v,
    perevirka: rivnyiDrib(a, d),
    pidkazka: ne
      ? 'Знаменник — скільки всього частин. Чисельник — скільки білих.'
      : 'Знаменник — на скільки рівних частин поділили смужку. Чисельник — скільки зафарбовано.',
    rozviazok: `Усього ${d} ${mnozh(d, 'частина', 'частини', 'частин')}, ${ne ? 'білих' : 'зафарбовано'} ${a} — це $${tdrib(a, d)}$.`,
  };
}

function tsyframy(r: Vypadok): TrenZavdannia {
  const { n, d } = dribDlia(r);
  const v = `${n}/${d}`;
  return {
    pytannia: `Запиши цифрами дріб «${slovamy(n, d)}». Риску пиши так: ${zrazok(ZRAZKY.drib, v)}.`,
    vidpovid: v,
    pidkazka: `«${n === 1 ? ZNAMENNYK[d][0] : ZNAMENNYK[d][1]}» — на скільки частин поділили. Це число пишемо під рискою.`,
    rozviazok: `$${tdrib(n, d)}$: знаменник ${d}, чисельник ${n}.`,
  };
}

function chytaty(r: Vypadok): TrenZavdannia {
  // Хибний варіант — переставлені чисельник і знаменник, тож обидва числа беремо з 2–12.
  const d = r.chyslo(5, 12);
  const n = r.chyslo(2, d - 1);
  const pravylno = slovamy(n, d);
  return {
    pytannia: `Як читається дріб $${tdrib(n, d)}$?`,
    vidpovid: pravylno,
    varianty: r.peremishaty([pravylno, slovamy(d, n)]),
    pidkazka: 'Спершу читаємо чисельник (над рискою), потім знаменник (під рискою).',
    rozviazok: `Над рискою ${n}, під рискою ${d}: «${pravylno}».`,
  };
}

function shchoPokazuie(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(5, 15);
  const n = r.chyslo(2, d - 1);
  const znamennyk = r.shans();
  return {
    pytannia: `У дробі $${tdrib(n, d)}$ що показує число ${znamennyk ? d : n}?`,
    vidpovid: znamennyk ? 'на скільки частин поділили ціле' : 'скільки частин узяли',
    varianty: ['на скільки частин поділили ціле', 'скільки частин узяли'],
    pidkazka: 'Під рискою — знаменник, над рискою — чисельник.',
    rozviazok: znamennyk
      ? `${d} — знаменник (під рискою): ціле поділили на ${d} рівних частин.`
      : `${n} — чисельник (над рискою): узяли ${n} таких частин.`,
  };
}

function zadachaChastyny(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { shcho: 'Піцу розрізали на', chastyn: [4, 6, 8, 10, 12], diia: "з'їли", shmatky: ['шматок', 'шматки', 'шматків'], tsile: 'піци' },
    { shcho: 'Шоколадку поділили на', chastyn: [6, 8, 10, 12, 15], diia: "з'їли", shmatky: ['часточку', 'часточки', 'часточок'], tsile: 'шоколадки' },
    { shcho: 'Стрічку розрізали на', chastyn: [5, 7, 9, 10], diia: 'використали', shmatky: ['шматок', 'шматки', 'шматків'], tsile: 'стрічки' },
    { shcho: 'Грядку поділили на', chastyn: [5, 6, 8, 9], diia: 'засадили', shmatky: ['ділянку', 'ділянки', 'ділянок'], tsile: 'грядки' },
  ]);
  const d = r.vybir(s.chastyn);
  const n = r.chyslo(1, d - 1);
  const v = `${n}/${d}`;
  return {
    pytannia: `${s.shcho} ${d} ${mnozh(d, 'рівну частину', 'рівні частини', 'рівних частин')} і ${s.diia} ${n} ${mnozh(n, s.shmatky[0], s.shmatky[1], s.shmatky[2])}. Яку частину ${s.tsile} ${s.diia}? ${zapysDrobu(v, n, d)}`,
    vidpovid: v,
    perevirka: rivnyiDrib(n, d),
    pidkazka: 'Знаменник — на скільки частин поділили, чисельник — скільки взяли.',
    rozviazok: `Поділили на ${d}, ${s.diia} ${n} — це $${tdrib(n, d)}$ ${s.tsile}.`,
  };
}

function odnakoviZnamennyky(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(4, 20);
  const [a, b] = r.rizni(2, 1, d - 1);
  return {
    pytannia: 'Порівняй дроби.',
    vyraz: `$${tdrib(a, d)}$ □ $${tdrib(b, d)}$`,
    vidpovid: a > b ? '>' : '<',
    varianty: ['>', '<', '='],
    pidkazka: 'Знаменники однакові — частини однакові. Де їх узяли більше?',
    rozviazok: `Знаменники однакові, ${Math.max(a, b)} > ${Math.min(a, b)}, тому $${tdrib(Math.max(a, b), d)} > ${tdrib(Math.min(a, b), d)}$.`,
  };
}

function zOdynytseiu(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 30);
  const a = r.shans(0.35) ? d : r.chyslo(1, d - 1);
  const zliva = r.shans();
  const znak = a === d ? '=' : zliva ? '<' : '>';
  return {
    pytannia: 'Порівняй дріб з одиницею.',
    vyraz: zliva ? `$${tdrib(a, d)}$ □ $1$` : `$1$ □ $${tdrib(a, d)}$`,
    vidpovid: znak,
    varianty: ['>', '<', '='],
    pidkazka: 'Чисельник дорівнює знаменнику — узяли всі частини. Менший — узяли не всі.',
    rozviazok:
      a === d
        ? `Чисельник дорівнює знаменнику — узяли всі частини: $${tdrib(a, d)} = 1$.`
        : `Чисельник ${a} менший від знаменника ${d} — узяли не всі частини: $${tdrib(a, d)} < 1$.`,
  };
}

function odynychni(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 2, 12);
  return {
    pytannia: 'Порівняй дроби.',
    vyraz: `$${tdrib(1, a)}$ □ $${tdrib(1, b)}$`,
    vidpovid: a < b ? '>' : '<',
    varianty: ['>', '<', '='],
    pidkazka: 'Узяли по одній частині. Де частина більша: коли ціле ділять на менше частин чи на більше?',
    rozviazok: `На ${Math.min(a, b)} ${mnozh(Math.min(a, b), 'частину', 'частини', 'частин')} ціле ділять більшими шматками, ніж на ${Math.max(a, b)}, тому $${tdrib(1, Math.min(a, b))} > ${tdrib(1, Math.max(a, b))}$.`,
  };
}

function najbilshyi(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(5, 16);
  const chysla = r.rizni(3, 1, d - 1);
  const bilshyi = r.shans();
  const shukane = bilshyi ? Math.max(...chysla) : Math.min(...chysla);
  return {
    pytannia: `Який дріб ${bilshyi ? 'найбільший' : 'найменший'}?`,
    vidpovid: `${shukane}/${d}`,
    varianty: chysla.map((a) => `${a}/${d}`),
    pidkazka: 'Знаменники однакові. Порівняй чисельники.',
    rozviazok: `Знаменники однакові, тож ${bilshyi ? 'найбільший' : 'найменший'} дріб той, де чисельник ${bilshyi ? 'найбільший' : 'найменший'}: $${tdrib(shukane, d)}$.`,
  };
}

const VELYCHYNY = [
  { tsile: 100, nazva: 'метра', velyka: '1 м', mala: ['см', 'см', 'см'] },
  { tsile: 10, nazva: 'метра', velyka: '1 м', mala: ['дм', 'дм', 'дм'] },
  { tsile: 10, nazva: 'дециметра', velyka: '1 дм', mala: ['см', 'см', 'см'] },
  { tsile: 1000, nazva: 'кілометра', velyka: '1 км', mala: ['м', 'м', 'м'] },
  { tsile: 100, nazva: 'центнера', velyka: '1 ц', mala: ['кг', 'кг', 'кг'] },
  { tsile: 1000, nazva: 'кілограма', velyka: '1 кг', mala: ['г', 'г', 'г'] },
  { tsile: 60, nazva: 'години', velyka: '1 год', mala: ['хв', 'хв', 'хв'] },
  { tsile: 60, nazva: 'хвилини', velyka: '1 хв', mala: ['с', 'с', 'с'] },
  { tsile: 24, nazva: 'доби', velyka: '1 доба', mala: ['година', 'години', 'годин'] },
  { tsile: 12, nazva: 'року', velyka: '1 рік', mala: ['місяць', 'місяці', 'місяців'] },
  { tsile: 7, nazva: 'тижня', velyka: '1 тиждень', mala: ['доба', 'доби', 'діб'] },
] as const;

function chastynaVelychyny(r: Vypadok): TrenZavdannia {
  const v = r.vybir(VELYCHYNY);
  const k = r.chyslo(1, v.tsile - 1);
  const odyn = mnozh(k, ...v.mala);
  const diieslovo = k % 10 === 1 && k % 100 !== 11 ? 'становить' : 'становлять';
  const vid = `${k}/${v.tsile}`;
  return {
    pytannia: `Яку частину ${v.nazva} ${diieslovo} ${k} ${odyn}? ${zapysDrobu(vid, k, v.tsile)}`,
    vidpovid: vid,
    perevirka: rivnyiDrib(k, v.tsile),
    pidkazka: `${v.velyka} = ${v.tsile} ${mnozh(v.tsile, ...v.mala)}. Скільки таких частин узяли?`,
    rozviazok: `${v.velyka} = ${v.tsile} ${mnozh(v.tsile, ...v.mala)}, тому ${k} ${odyn} — це $${tdrib(k, v.tsile)}$ ${v.nazva}.`,
  };
}

function dvoieIdiat(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { tsile: 'Торт розрізали на', shmatky: ['шматочок', 'шматочки', 'шматочків'], chastyn: [8, 10, 12, 16], shcho: 'торта' },
    { tsile: 'Піцу розрізали на', shmatky: ['шматок', 'шматки', 'шматків'], chastyn: [6, 8, 10, 12], shcho: 'піци' },
    { tsile: 'Шоколадку поділили на', shmatky: ['часточку', 'часточки', 'часточок'], chastyn: [8, 10, 12, 15, 16, 18], shcho: 'шоколадки' },
  ]);
  const d = r.vybir(s.chastyn);
  const [o1, o2] = dviOsoby(r);
  const a = r.chyslo(1, d - 2);
  const b = r.chyslo(1, d - 1 - a);
  const vyd = r.vybir(['razom', 'zalyshok', 'khto'] as const);
  const sh = (x: number) => `${x} ${mnozh(x, s.shmatky[0], s.shmatky[1], s.shmatky[2])}`;
  const umova = `${s.tsile} ${d} ${mnozh(d, 'рівну частину', 'рівні частини', 'рівних частин')}. ${o1.imia} ${rid(o1, "з'їв", "з'їла")} ${sh(a)}, а ${o2.imia} — ${b}.`;
  if (vyd === 'khto') {
    if (a === b) return dvoieIdiat(r);
    const bilshe = a > b ? o1 : o2;
    return {
      pytannia: `${umova} Хто з'їв більшу частину ${s.shcho}?`,
      vidpovid: bilshe.imia,
      varianty: [o1.imia, o2.imia],
      pidkazka: `Запиши обидві частини дробами зі знаменником ${d} і порівняй чисельники.`,
      rozviazok: `${o1.imia} — $${tdrib(a, d)}$, ${o2.imia} — $${tdrib(b, d)}$. Знаменники однакові, більший чисельник у дробі ${bilshe.imia === o1.imia ? `$${tdrib(a, d)}$` : `$${tdrib(b, d)}$`}.`,
    };
  }
  const x = vyd === 'razom' ? a + b : d - a - b;
  const vid = `${x}/${d}`;
  return {
    pytannia: `${umova} Яку частину ${s.shcho} ${vyd === 'razom' ? "вони з'їли разом" : "ще не з'їли"}? ${zapysDrobu(vid, x, d)}`,
    vidpovid: vid,
    perevirka: rivnyiDrib(x, d),
    pidkazka: vyd === 'razom' ? "Скільки частин з'їли обоє разом? Знаменник не змінюється." : `Скільки частин з'їли разом? Скільки залишилось з ${d}?`,
    rozviazok:
      vyd === 'razom'
        ? `Разом ${a} + ${b} = ${x} — це $${tdrib(x, d)}$ ${s.shcho}.`
        : `З'їли ${a} + ${b} = ${a + b}, залишилось ${d} − ${a + b} = ${x} — це $${tdrib(x, d)}$ ${s.shcho}.`,
  };
}

function khtoBilshe(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { diia: ['прочитав', 'прочитала'], shcho: 'книжки', tsile: 'такої самої книжки' },
    { diia: ['пофарбував', 'пофарбувала'], shcho: 'паркану', tsile: 'такого самого паркану' },
    { diia: ['пройшов', 'пройшла'], shcho: 'дороги до школи', tsile: 'тієї самої дороги' },
  ]);
  const d = r.chyslo(5, 15);
  const [a, b] = r.rizni(2, 1, d - 1);
  const [o1, o2] = dviOsoby(r);
  const bilshe = a > b ? o1 : o2;
  return {
    pytannia: `${o1.imia} ${rid(o1, s.diia[0], s.diia[1])} $${tdrib(a, d)}$ ${s.shcho}, а ${o2.imia} — $${tdrib(b, d)}$ ${s.tsile}. Хто ${s.diia[0]} більше?`,
    vidpovid: bilshe.imia,
    varianty: [o1.imia, o2.imia],
    pidkazka: 'Знаменники однакові. Порівняй чисельники.',
    rozviazok: `Знаменники однакові, ${Math.max(a, b)} > ${Math.min(a, b)}: більше — ${bilshe.imia}.`,
  };
}

export default {
  rivni: ['що показує дріб', 'порівняння і число 1', 'величини й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zaMalunkom, zaMalunkom, tsyframy, chytaty, shchoPokazuie, zadachaChastyny])(r);
    if (riven === 2) return r.vybir([odnakoviZnamennyky, odnakoviZnamennyky, zOdynytseiu, odynychni, najbilshyi])(r);
    return r.vybir([chastynaVelychyny, chastynaVelychyny, dvoieIdiat, dvoieIdiat, khtoBilshe, odynychni])(r);
  },
} satisfies Henerator;
