// Число за значенням його відсотків (Істер § 2): ділимо значення на відсотки, записані дробом;
// задачі; більше за 100 %; ціна до знижки; розпізнати, множити чи ділити.
import { ch, des, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const dr = (p: number) => des(p, 2);

/** Ціле a таке, щоб p % від a було цілим. */
function tsileDlia(r: Vypadok, p: number, min: number, max: number) {
  const krok = 100 / nsd(p, 100);
  const vid = Math.ceil(min / krok);
  return krok * r.chyslo(vid, Math.max(vid, Math.floor(max / krok)));
}

function priamo(r: Vypadok): TrenZavdannia {
  const p = r.vybir([2, 4, 5, 8, 12, 15, 20, 24, 25, 30, 35, 40, 45, 60, 75, 80]);
  const a = tsileDlia(r, p, 20, 900);
  const x = (a * p) / 100;
  return {
    pytannia: r.shans() ? `${p}% числа дорівнюють ${ch(x)}. Знайди це число.` : `Знайди число, ${p}% якого дорівнюють ${ch(x)}.`,
    vidpovid: a,
    pidkazka: `${p}% = ${dr(p)}. Поділи ${ch(x)} на ${dr(p)}.`,
    rozviazok: `${ch(x)} : ${dr(p)} = ${ch(a)}. Перевірка: ${ch(a)} · ${dr(p)} = ${ch(x)}`,
  };
}

function cherezOdyn(r: Vypadok): TrenZavdannia {
  const p = r.vybir([3, 6, 7, 9, 12, 14, 16, 18, 35, 45, 65]);
  const odyn = r.chyslo(2, 15);
  const x = odyn * p;
  const a = odyn * 100;
  return {
    pytannia: `${p}% числа дорівнюють ${ch(x)}. Знайди спершу 1%, а потім усе число.`,
    vidpovid: a,
    pidkazka: `1% — це ${ch(x)} : ${p}.`,
    rozviazok: `${ch(x)} : ${p} = ${odyn} — це 1%; ${odyn} · 100 = ${ch(a)}`,
  };
}

const ZADACHI: { tekst: (p: number, x: number) => string; min: number; max: number; odynytsi: string; vidsotky: number[] }[] = [
  { tekst: (p, x) => `Марко прочитав ${skilky(x, 'сторінку', 'сторінки', 'сторінок')}, і це ${p}% книжки. Скільки сторінок у книжці?`, min: 80, max: 400, odynytsi: 'с.', vidsotky: [10, 15, 20, 25, 30, 40, 60, 75, 80] },
  { tekst: (p, x) => `Туристи пройшли ${x} км, і це ${p}% маршруту. Яка довжина маршруту?`, min: 20, max: 120, odynytsi: 'км', vidsotky: [20, 25, 30, 40, 45, 60, 75, 80] },
  { tekst: (p, x) => `Оля набрала ${x} балів, і це ${p}% найбільшої можливої кількості. Скільки балів можна було набрати?`, min: 20, max: 200, odynytsi: 'балів', vidsotky: [60, 65, 70, 75, 80, 85, 90, 95] },
  { tekst: (p, x) => `З ділянки зібрали ${x} кг картоплі — ${p}% усього врожаю. Скільки кілограмів картоплі буде всього?`, min: 100, max: 900, odynytsi: 'кг', vidsotky: [20, 25, 30, 40, 50, 60, 75] },
  { tekst: (p, x) => `За тиждень зібрали ${x} грн на подарунок — це ${p}% потрібної суми. Скільки гривень треба зібрати?`, min: 400, max: 3000, odynytsi: 'грн', vidsotky: [20, 25, 40, 50, 60, 80] },
];

function zadacha(r: Vypadok): TrenZavdannia {
  const z = r.vybir(ZADACHI);
  const p = r.vybir(z.vidsotky);
  const a = tsileDlia(r, p, z.min, z.max);
  const x = (a * p) / 100;
  return {
    pytannia: z.tekst(p, x),
    vidpovid: a,
    odynytsi: z.odynytsi,
    pidkazka: `${ch(x)} — це частина (${p}%), шукаємо все (100%). Поділи на ${dr(p)}.`,
    rozviazok: `${ch(x)} : ${dr(p)} = ${ch(a)}. Перевірка: ${ch(a)} · ${dr(p)} = ${ch(x)}`,
  };
}

function bilshe100(r: Vypadok): TrenZavdannia {
  const p = r.vybir([110, 120, 125, 150, 160, 175, 200, 250]);
  const a = tsileDlia(r, p, 10, 600);
  const x = (a * p) / 100;
  return {
    pytannia: `Знайди число, якщо ${p}% його дорівнюють ${ch(x)}.`,
    vidpovid: a,
    pidkazka: `${p}% = ${dr(p)}. Число вийде меншим за ${ch(x)}.`,
    rozviazok: `${ch(x)} : ${dr(p)} = ${ch(a)}. Перевірка: ${ch(a)} · ${dr(p)} = ${ch(x)}`,
  };
}

function doZnyzhky(r: Vypadok): TrenZavdannia {
  const p = r.vybir([10, 15, 20, 25, 30, 40, 50]);
  const zalyshok = 100 - p;
  const stara = tsileDlia(r, zalyshok, 200, 3000);
  const nova = (stara * zalyshok) / 100;
  const [rich, koshtuie, koshtuvav] = r.vybir([
    ['куртка', 'коштує', 'вона коштувала'],
    ['настільна гра', 'коштує', 'вона коштувала'],
    ['рюкзак', 'коштує', 'він коштував'],
    ['навушники', 'коштують', 'вони коштували'],
    ["футбольний м'яч", 'коштує', 'він коштував'],
  ]);
  return {
    pytannia: `Після знижки ${p}% ${rich} ${koshtuie} ${ch(nova)} грн. Скільки ${koshtuvav} до знижки?`,
    vidpovid: stara,
    odynytsi: 'грн',
    pidkazka: `Нова ціна — це 100% − ${p}% = ${zalyshok}% старої. Поділи на ${dr(zalyshok)}.`,
    rozviazok: `${ch(nova)} : ${dr(zalyshok)} = ${ch(stara)} (грн). Перевірка: ${ch(stara)} · ${dr(zalyshok)} = ${ch(nova)}`,
  };
}

function yakaDia(r: Vypadok): TrenZavdannia {
  const p = r.vybir([10, 20, 25, 30, 40, 60, 75]);
  const vidChysla = r.shans();
  const a = tsileDlia(r, p, 20, 400);
  const x = (a * p) / 100;
  const mnoz = `множимо на ${dr(p)}`;
  const dil = `ділимо на ${dr(p)}`;
  const umova = vidChysla
    ? r.vybir([
        `У саду ${a} дерев, ${p}% з них — груші. Скільки груш у саду? Яку дію треба зробити з числом ${a}?`,
        `Шлях завдовжки ${a} км, туристи пройшли ${p}% шляху. Скільки кілометрів вони пройшли? Яку дію треба зробити з числом ${a}?`,
      ])
    : r.vybir([
        `У саду ${x} груш, це ${p}% усіх дерев. Скільки дерев у саду? Яку дію треба зробити з числом ${x}?`,
        `Туристи пройшли ${x} км, це ${p}% шляху. Яка довжина шляху? Яку дію треба зробити з числом ${x}?`,
      ]);
  return {
    pytannia: umova,
    vidpovid: vidChysla ? mnoz : dil,
    varianty: [mnoz, dil],
    pidkazka: 'Дане число — це все (100%) чи лише частина?',
    rozviazok: vidChysla
      ? `${a} — усе (100%), шукаємо частину: ${a} · ${dr(p)} = ${ch(x)}`
      : `${x} — частина (${p}%), шукаємо все: ${x} : ${dr(p)} = ${ch(a)}`,
  };
}

export default {
  rivni: ['число за відсотком', 'задачі, більше за 100 %', 'множити чи ділити, ціна до знижки'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([priamo, priamo, cherezOdyn])(r);
    if (riven === 2) return r.vybir([zadacha, zadacha, bilshe100])(r);
    return r.vybir([yakaDia, doZnyzhky, doZnyzhky, zadacha])(r);
  },
} satisfies Henerator;
