// Яку частину одне число становить від іншого (Скворцова, 5 клас, с. 167–168): частина : ціле = дріб,
// однакові одиниці (хвилини від години, сантиметри від метра), частина, що залишилась, дріб як частка (m : n),
// порівняння дробу з 1 і три задачі на дроби впереміш (дріб від числа, число за дробом, яку частину).
import {
  mnozh, nsd, osoba, rid, rivnyiDrib, tdrib, tvidpovidDrib, vidpovidDrib, ZRAZKY, zrazok,
  type Henerator, type Vypadok, type TrenZavdannia,
} from '../dopomoha.ts';

/** Завдання з відповіддю-дробом b/a: приймаємо будь-який рівний дріб. */
function drib(b: number, a: number, pytannia: string, pidkazka: string, poiasnennia: string): TrenZavdannia {
  const vidpovid = vidpovidDrib(b, a)[0];
  const perevirka = rivnyiDrib(b, a);
  return {
    pytannia: `${pytannia} Запиши дріб через риску, наприклад ${zrazok(ZRAZKY.drib, vidpovid, perevirka)}.`,
    vidpovid,
    perevirka,
    pidkazka,
    rozviazok: `${poiasnennia} $${tdrib(b, a)}${nsd(b, a) > 1 ? ` = ${tvidpovidDrib(b, a)}` : ''}$`,
  };
}

/** Ціле a і частина b < a, щоб дріб гарно скорочувався не завжди. */
function para(r: Vypadok): [number, number] {
  const d = r.chyslo(3, 12);
  const n = r.chyslo(1, d - 1);
  const k = r.vybir([1, 1, 2, 3, 4, 5, 6]);
  return [d * k, n * k];
}

function chysla(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r);
  return drib(b, a, `Яку частину число ${b} становить від числа ${a}?`, `Ціле — число після «від», ${a}. Поділи ${b} на ${a}.`, `${b} : ${a} =`);
}

function zadacha(r: Vypadok): TrenZavdannia {
  let [a, b] = para(r);
  while (b < 2) [a, b] = para(r);
  const o = osoba(r);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return drib(
      b, a,
      `Велопробіг має ${a} км. ${o.imia} вже ${rid(o, 'проїхав', 'проїхала')} ${b} км. Яку частину шляху ${rid(o, 'він', 'вона')} ${rid(o, 'проїхав', 'проїхала')}?`,
      `Ціле — увесь шлях, ${a} км.`,
      `${b} км із ${a} км:`,
    );
  }
  if (typ === 1) {
    return drib(
      b, a,
      `У книжці ${a} ${mnozh(a, 'сторінка', 'сторінки', 'сторінок')}. ${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${b}. Яку частину книжки ${rid(o, 'він', 'вона')} ${rid(o, 'прочитав', 'прочитала')}?`,
      `Ціле — уся книжка, ${a} ${mnozh(a, 'сторінка', 'сторінки', 'сторінок')}.`,
      `${b} із ${a}:`,
    );
  }
  return drib(
    b, a,
    `На змагання прийшли ${a} ${mnozh(a, 'учасник', 'учасники', 'учасників')}, ${b} з них — новенькі. Яку частину всіх учасників становлять новенькі?`,
    `Ціле — усі учасники, ${a}.`,
    `${b} із ${a}:`,
  );
}

function zIedynytseiu(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(2, 15);
  const typ = r.chyslo(0, 9);
  const n = typ < 6 ? r.chyslo(1, d - 1) : typ < 8 ? d : r.chyslo(d + 1, 2 * d + 3);
  const znak = n < d ? '<' : n === d ? '=' : '>';
  return {
    pytannia: 'Порівняй дріб з одиницею.',
    vyraz: `$${tdrib(n, d)}$ □ $1$`,
    vidpovid: znak,
    varianty: ['<', '=', '>'],
    pidkazka: 'Порівняй чисельник зі знаменником.',
    rozviazok:
      znak === '<'
        ? `Чисельник ${n} менший за знаменник ${d}: узяли не всі частини, тож дріб менший за 1.`
        : znak === '='
          ? `Чисельник дорівнює знаменнику: узяли всі ${d} частин, це ціле, 1.`
          : `Чисельник ${n} більший за знаменник ${d}: частин більше, ніж в одному цілому, тож дріб більший за 1.`,
  };
}

const VELYCHYNY = [
  { tsile: 60, nazva: 'години', odna: '1 год', odyn: 'хв' },
  { tsile: 100, nazva: 'метра', odna: '1 м', odyn: 'см' },
  { tsile: 1000, nazva: 'кілограма', odna: '1 кг', odyn: 'г' },
  { tsile: 24, nazva: 'доби', odna: '1 доба', odyn: 'год' },
  { tsile: 12, nazva: 'року', odna: '1 рік', odyn: 'міс.' },
  { tsile: 10, nazva: 'дециметра', odna: '1 дм', odyn: 'см' },
];

function odynytsi(r: Vypadok): TrenZavdannia {
  const v = r.vybir(VELYCHYNY);
  const dilnyky = Array.from({ length: Math.min(v.tsile, 25) }, (_, i) => i + 1).filter((x) => v.tsile % x === 0 && x > 1);
  const d = r.vybir(dilnyky);
  const n = r.chyslo(1, d - 1);
  const chastyna = (v.tsile / d) * n;
  return drib(chastyna, v.tsile, `Яку частину ${v.nazva} становлять ${chastyna} ${v.odyn}?`,
    `Спершу однакові одиниці: ${v.odna} = ${v.tsile} ${v.odyn}.`, `${v.odna} = ${v.tsile} ${v.odyn};`);
}

function zalyshok(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r);
  const o = osoba(r);
  const s = r.vybir([
    {
      umova: `Стрічка має довжину ${a} см. ${o.imia} ${rid(o, 'відрізав', 'відрізала')} від неї ${b} см.`,
      pytannia: 'Яка частина стрічки залишилась?',
    },
    {
      umova: `У домашньому завданні ${a} ${mnozh(a, 'задача', 'задачі', 'задач')}. ${o.imia} ${rid(o, 'розв’язав', 'розв’язала')} ${b}.`,
      pytannia: 'Яка частина задач ще не розв’язана?',
    },
    {
      umova: `Шлях має ${a} км. ${o.imia} ${rid(o, 'проїхав', 'проїхала')} ${b} км.`,
      pytannia: 'Яку частину шляху ще треба проїхати?',
    },
  ]);
  return drib(a - b, a, `${s.umova} ${s.pytannia}`,
    `Спершу знайди, скільки залишилось: ${a} − ${b}.`, `Залишилось ${a} − ${b} = ${a - b}; частина:`);
}

const PREDMETY = [
  { odna: 'шоколадку', dvi: 'шоколадки', piat: 'шоколадок', rodovyi: 'шоколадки' },
  { odna: 'піцу', dvi: 'піци', piat: 'піц', rodovyi: 'піци' },
  { odna: 'пиріг', dvi: 'пироги', piat: 'пирогів', rodovyi: 'пирога' },
];

function chastka(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 10);
  const m = r.chyslo(1, n - 1);
  const p = r.vybir(PREDMETY);
  return drib(
    m, n,
    `${m} ${mnozh(m, p.odna, p.dvi, p.piat)} порівну поділили між ${n} дітьми. Яку частину ${p.rodovyi} отримала кожна дитина?`,
    `${m} : ${n} — це дріб з чисельником ${m} і знаменником ${n}.`,
    `${m} : ${n} =`,
  );
}

function trySposoby(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 9);
  const n = r.chyslo(1, d - 1);
  const odna = r.chyslo(2, 12);
  const tsile = odna * d;
  const chastyna = odna * n;
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Знайди $${tdrib(n, d)}$ від ${tsile}.`,
      vidpovid: chastyna,
      pidkazka: 'Відомі ціле і дріб, шукаємо частину: поділи на знаменник, помнож на чисельник.',
      rozviazok: `${tsile} : ${d} · ${n} = ${chastyna}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `$${tdrib(n, d)}$ числа ${n === 1 ? 'дорівнює' : 'дорівнюють'} ${chastyna}. Знайди число.`,
      vidpovid: tsile,
      pidkazka: 'Відомі частина і дріб, шукаємо ціле: поділи на чисельник, помнож на знаменник.',
      rozviazok: `${chastyna} : ${n} · ${d} = ${tsile}`,
    };
  }
  return drib(chastyna, tsile, `Яку частину число ${chastyna} становить від числа ${tsile}?`,
    'Відомі частина і ціле, шукаємо дріб: частина : ціле.', `${chastyna} : ${tsile} =`);
}

export default {
  rivni: ['частина : ціле, порівняння з 1', 'з підступом: одиниці, що залишилось', 'три задачі на дроби впереміш'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chysla, zadacha, zadacha, zIedynytseiu])(r);
    if (riven === 2) return r.vybir([odynytsi, odynytsi, zalyshok, chastka])(r);
    return r.vybir([trySposoby, trySposoby, trySposoby, odynytsi, zalyshok])(r);
  },
} satisfies Henerator;
