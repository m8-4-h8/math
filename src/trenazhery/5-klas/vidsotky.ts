// Відсотки: p % = p/100 (запис десятковим дробом і навпаки, 50 % — половина, 25 % — чверть, 10 % — десята);
// відсоток від числа (a : 100 · p); число за його відсотком (частина : p · 100); знижка й підвищення ціни.
import { ch, des, nsd, skilky, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function zapys(r: Vypadok): TrenZavdannia {
  const p = r.krim(1, 99, [10, 20, 30, 40, 50, 60, 70, 80, 90]);
  if (r.shans()) {
    return {
      pytannia: `Запиши ${p}% десятковим дробом.`,
      vidpovid: des(p, 2),
      pidkazka: '1% — це одна сота: 0,01.',
      rozviazok: `${p}% — це ${p} сотих: ${des(p, 2)}.`,
    };
  }
  return {
    pytannia: `Запиши десятковий дріб ${des(p, 2)} у відсотках.`,
    vyraz: `${des(p, 2)} = □ %`,
    vidpovid: p,
    pidkazka: 'Скільки тут сотих? Стільки й відсотків.',
    rozviazok: `${des(p, 2)} — це ${p} сотих, тобто ${p}%.`,
  };
}

const CHASTYNY = [
  { p: 50, d: 2, nazva: 'половина' },
  { p: 25, d: 4, nazva: 'чверть' },
  { p: 10, d: 10, nazva: 'десята частина' },
];

function chastyna(r: Vypadok): TrenZavdannia {
  const c = r.vybir(CHASTYNY);
  const a = c.d * r.chyslo(2, 30);
  return {
    pytannia: `Знайди ${c.p}% від ${a}.`,
    vidpovid: a / c.d,
    pidkazka: `${c.p}% — це ${c.nazva}.`,
    rozviazok: `${c.p}% — ${c.nazva}: ${a} : ${c.d} = ${a / c.d}.`,
  };
}

/** a і p такі, щоб p % від a було цілим. */
function paraVid(r: Vypadok) {
  const p = r.vybir([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80]);
  const krok = 100 / nsd(p, 100);
  const a = krok * r.chyslo(Math.ceil(20 / krok), Math.floor(900 / krok));
  return { p, a, x: (a * p) / 100 };
}

const SYTUATSII_VID = [
  (a: number, p: number) => `У школі ${skilky(a, 'учень', 'учні', 'учнів')}, ${p}% з них займаються спортом. Скільки учнів займаються спортом?`,
  (a: number, p: number) => `У саду ${skilky(a, 'дерево', 'дерева', 'дерев')}, ${p}% з них — яблуні. Скільки яблунь у саду?`,
  (a: number, p: number) => `У книжці ${skilky(a, 'сторінка', 'сторінки', 'сторінок')}. Тарас прочитав ${p}% книжки. Скільки сторінок він прочитав?`,
];

function vidChysla(r: Vypadok, zZhyttia: boolean): TrenZavdannia {
  const { p, a, x } = paraVid(r);
  return {
    pytannia: zZhyttia ? r.vybir(SYTUATSII_VID)(a, p) : `Знайди ${p}% від ${a}.`,
    vidpovid: x,
    pidkazka: `Спершу 1%: ${a} : 100. Потім помнож на ${p}.`,
    rozviazok: `${a} : 100 · ${p} = ${x}`,
  };
}

const SYTUATSII_ZA = [
  (x: number, p: number) => `${p}% числа дорівнюють ${x}. Знайди це число.`,
  (x: number, p: number) => `Оля прочитала ${skilky(x, 'сторінку', 'сторінки', 'сторінок')}, це ${p}% книжки. Скільки сторінок у книжці?`,
  (x: number, p: number) => `У школі ${skilky(x, 'відмінник', 'відмінники', 'відмінників')}, це ${p}% усіх учнів. Скільки учнів у школі?`,
];

function zaVidsotkom(r: Vypadok): TrenZavdannia {
  const { p, a, x } = paraVid(r);
  return {
    pytannia: r.vybir(SYTUATSII_ZA)(x, p),
    vidpovid: a,
    pidkazka: `Спершу 1%: ${x} : ${p}. Потім помнож на 100.`,
    rozviazok: `${x} : ${p} · 100 = ${a}. Перевірка: ${a} : 100 · ${p} = ${x} ✓`,
  };
}

const RECHI = [
  { shcho: 'куртка', koshtuvav: 'коштувала', min: 600, max: 3000 },
  { shcho: 'рюкзак', koshtuvav: 'коштував', min: 400, max: 1500 },
  { shcho: 'велосипед', koshtuvav: 'коштував', min: 3000, max: 9000 },
  { shcho: 'книжка', koshtuvav: 'коштувала', min: 100, max: 500 },
];

function tsina(r: Vypadok): TrenZavdannia {
  const rich = r.vybir(RECHI);
  const p = r.vybir([5, 10, 15, 20, 25, 30, 40, 50]);
  const a = r.chyslo(rich.min / 100, rich.max / 100) * 100;
  const zmina = (a * p) / 100;
  const znyzhka = r.shans(0.7);
  const nova = znyzhka ? a - zmina : a + zmina;
  return {
    pytannia: `${zVelykoi(rich.shcho)} ${rich.koshtuvav} ${ch(a)} грн. Ціну ${znyzhka ? 'знизили' : 'підвищили'} на ${p}%. Скільки ${rich.shcho} коштує тепер?`,
    vidpovid: nova,
    odynytsi: 'грн',
    pidkazka: `Спершу знайди ${p}% від ціни, тобто ${znyzhka ? 'знижку' : 'на скільки подорожчало'}.`,
    rozviazok: `1) ${a} : 100 · ${p} = ${zmina} (грн); 2) ${a} ${znyzhka ? '−' : '+'} ${zmina} = ${nova} (грн).`,
  };
}

export default {
  rivni: ['що таке відсоток', 'відсоток від числа', 'число за відсотком і знижки'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([zapys, zapys, chastyna])(r);
    if (riven === 2) return r.vybir([(rr: Vypadok) => vidChysla(rr, false), (rr: Vypadok) => vidChysla(rr, true), chastyna])(r);
    return r.vybir([zaVidsotkom, zaVidsotkom, tsina, tsina, (rr: Vypadok) => vidChysla(rr, true)])(r);
  },
} satisfies Henerator;
