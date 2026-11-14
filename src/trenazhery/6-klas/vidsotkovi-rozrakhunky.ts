// Відсоткові розрахунки (Істер § 22): три типи задач на відсотки — відсотки від числа, число за його відсотками,
// відсоткове відношення; збільшення і зменшення на p % (множимо на (100 ± p) %), ціна до знижки; дві зміни
// поспіль (другий відсоток — від нового числа), вклад, розчин, сушіння.
import { ch, des, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** a і p такі, щоб p % від a було цілим. */
function para(r: Vypadok, vidsotky: number[], min = 20, max = 900) {
  const p = r.vybir(vidsotky);
  const krok = 100 / nsd(p, 100);
  const a = krok * r.chyslo(Math.ceil(min / krok), Math.floor(max / krok));
  return { p, a, x: (a * p) / 100 };
}

/** Вклад — кругла сума (кратна 100 грн) під p % річних. */
function groshi(r: Vypadok) {
  const p = r.vybir([5, 6, 8, 9, 10, 12, 15]);
  const a = 100 * r.chyslo(10, 200);
  return { p, a, x: (a * p) / 100 };
}

/** p % як десятковий дріб: 9 → «0,09», 120 → «1,2». */
const drib = (p: number) => des(p, 2);

// ——— Три типи задач ———

const VID_CHYSLA: ((a: number, p: number) => string)[] = [
  (a, p) => `Знайди ${p}% від ${ch(a)}.`,
  (a, p) => `Вкладник поклав до банку ${ch(a)} грн під ${p}% річних. Який прибуток він отримає через рік?`,
  (a, p) => `У книжці ${skilky(a, 'сторінка', 'сторінки', 'сторінок')}. Ілля прочитав ${p}% книжки. Скільки сторінок він прочитав?`,
  (a, p) => `Бігова доріжка в парку має довжину ${ch(a)} м. Марко пробіг ${p}% доріжки. Скільки метрів він пробіг?`,
];

function vidChysla(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, VID_CHYSLA.length - 1);
  const { p, a, x } = typ === 1 ? groshi(r) : typ === 2 ? para(r, [10, 15, 20, 25, 30, 40, 60, 75], 60, 400) : para(r, [5, 12, 15, 24, 35, 45, 65, 72, 85], 20, 900);
  return {
    pytannia: VID_CHYSLA[typ](a, p),
    vidpovid: x,
    odynytsi: typ === 1 ? 'грн' : typ === 3 ? 'м' : undefined,
    pidkazka: `${p}% = ${drib(p)}. Помнож ${ch(a)} на ${drib(p)}.`,
    rozviazok: `${ch(a)} · ${drib(p)} = ${ch(x)}. Пропорцією: ${ch(a)} — 100%, x — ${p}%; x = ${ch(a)} · ${p} : 100 = ${ch(x)}.`,
  };
}

const ZA_VIDSOTKOM: ((x: number, p: number) => string)[] = [
  (x, p) => `${p}% числа дорівнюють ${ch(x)}. Знайди це число.`,
  (x, p) => `Оля прочитала ${skilky(x, 'сторінку', 'сторінки', 'сторінок')}, що становить ${p}% книжки. Скільки сторінок у книжці?`,
  (x, p) => `Першого дня туристи пройшли ${ch(x)} км, що становить ${p}% маршруту. Яка довжина маршруту в кілометрах?`,
  (x, p) => `Знижка на куртку — ${p}%, це ${ch(x)} грн. Скільки коштувала куртка без знижки?`,
];

function zaVidsotkom(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, ZA_VIDSOTKOM.length - 1);
  const { p, a, x } =
    typ === 1 ? para(r, [10, 15, 20, 25, 30, 40, 60, 75], 60, 400) : typ === 2 ? para(r, [20, 25, 30, 40, 50, 60], 20, 120) : para(r, [5, 15, 20, 25, 30, 40, 60, 75, 80], 40, 2000);
  return {
    pytannia: ZA_VIDSOTKOM[typ](x, p),
    vidpovid: a,
    odynytsi: typ === 2 ? 'км' : typ === 3 ? 'грн' : undefined,
    pidkazka: `${ch(x)} — це ${p}%, а не все число. Знайди 1%: ${ch(x)} : ${p}.`,
    rozviazok: `${ch(x)} : ${p} · 100 = ${ch(a)}. Перевірка: ${p}% від ${ch(a)} — це ${ch(x)} ✓`,
  };
}

const SKILKY: ((x: number, a: number) => string)[] = [
  (x, a) => `Скільки відсотків становить ${ch(x)} від ${ch(a)}?`,
  (x, a) => `Відстань між містами ${ch(a)} км. Велосипедист проїхав ${ch(x)} км. Скільки відсотків відстані він проїхав?`,
  (x, a) => `Із ${skilky(a, 'посадженої насінини', 'посаджених насінин', 'посаджених насінин')} зійшло ${x}. Скільки відсотків насінин зійшло?`,
];

function skilkyVidsotkiv(r: Vypadok): TrenZavdannia {
  const { p, a, x } = para(r, [5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90], 20, 120);
  return {
    pytannia: r.vybir(SKILKY)(x, a),
    vidpovid: p,
    odynytsi: '%',
    pidkazka: `Поділи частину на ціле і помнож на 100: ${ch(x)} : ${ch(a)} · 100.`,
    rozviazok: `${ch(x)} : ${ch(a)} · 100 = ${p} (%)`,
  };
}

// ——— Збільшити чи зменшити на p % ———

function novaTsina(r: Vypadok): TrenZavdannia {
  const { p, a } = para(r, [5, 10, 15, 20, 25, 30, 35, 40], 100, 2000);
  const vgoru = r.shans();
  const k = vgoru ? 100 + p : 100 - p;
  const nova = (a * k) / 100;
  return {
    pytannia: vgoru
      ? r.vybir([`Ціна ${ch(a)} грн зросла на ${p}%. Якою стала ціна?`, `Квиток на концерт коштував ${ch(a)} грн, а тепер на ${p}% дорожчий. Скільки він коштує тепер?`])
      : r.vybir([`Іграшка коштувала ${ch(a)} грн, на неї діє знижка ${p}%. Скільки треба заплатити?`, `Ціну ${ch(a)} грн знизили на ${p}%. Якою стала ціна?`]),
    vidpovid: nova,
    odynytsi: 'грн',
    pidkazka: vgoru ? `Нова ціна — це 100% + ${p}% = ${k}% старої.` : `Залишається 100% − ${p}% = ${k}% ціни.`,
    rozviazok: `${ch(a)} · ${drib(k)} = ${ch(nova)} (грн)`,
  };
}

/** Число, збільшене чи зменшене на p %, — без грошей. */
function zminaChysla(r: Vypadok): TrenZavdannia {
  const { p, a } = para(r, [10, 20, 25, 30, 40, 50, 60, 75], 20, 600);
  const vgoru = r.shans();
  const k = vgoru ? 100 + p : 100 - p;
  const nove = (a * k) / 100;
  return {
    pytannia: `${vgoru ? 'Збільш' : 'Зменш'} число ${ch(a)} на ${p}%.`,
    vidpovid: nove,
    pidkazka: `${vgoru ? 'Збільшене' : 'Зменшене'} число — це ${k}% від ${ch(a)}.`,
    rozviazok: `${ch(a)} · ${drib(k)} = ${ch(nove)}`,
  };
}

/** Ціна до знижки чи до подорожчання: нова ціна — (100 ± p) % старої. */
function staraTsina(r: Vypadok): TrenZavdannia {
  const { p, a } = para(r, [10, 20, 25, 30, 40, 50], 100, 2000);
  const vgoru = r.shans(0.35);
  const k = vgoru ? 100 + p : 100 - p;
  const nova = (a * k) / 100;
  return {
    pytannia: vgoru
      ? `Після подорожчання на ${p}% рюкзак коштує ${ch(nova)} грн. Скільки він коштував до подорожчання?`
      : `Після знижки ${p}% куртка коштує ${ch(nova)} грн. Скільки вона коштувала до знижки?`,
    vidpovid: a,
    odynytsi: 'грн',
    pidkazka: `${ch(nova)} грн — це не ${p}%, а ${vgoru ? `100 + ${p}` : `100 − ${p}`} = ${k}% старої ціни.`,
    rozviazok: `${ch(nova)} : ${drib(k)} = ${ch(a)} (грн). Перевірка: ${ch(a)} · ${drib(k)} = ${ch(nova)} ✓`,
  };
}

// ——— Дві зміни поспіль і задачі з життя ———

function poslidovni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = 100 * r.chyslo(2, 30);
    const [p, q] = [r.vybir([10, 20, 25, 30, 50]), r.vybir([10, 20, 25, 30, 40, 50])];
    const vgoruSpershu = r.shans();
    const k1 = vgoruSpershu ? 100 + p : 100 - p;
    const k2 = vgoruSpershu ? 100 - q : 100 + q;
    const b = (a * k1) / 100;
    const c = (b * k2) / 100;
    if (!Number.isInteger(b) || !Number.isInteger(c)) continue;
    const dii = vgoruSpershu ? [`підвищили на ${p}%`, `знизили на ${q}%`] : [`знизили на ${p}%`, `підвищили на ${q}%`];
    return {
      pytannia: `Товар коштував ${ch(a)} грн. Спершу ціну ${dii[0]}, а потім нову ціну ${dii[1]}. Скільки коштує товар тепер?`,
      vidpovid: c,
      odynytsi: 'грн',
      pidkazka: `Друга зміна — від нової ціни: спершу знайди ${k1}% від ${ch(a)}.`,
      rozviazok: `${ch(a)} · ${drib(k1)} = ${ch(b)} (грн); ${ch(b)} · ${drib(k2)} = ${ch(c)} (грн)`,
    };
  }
}

/** Ціну знизили на p %. На скільки відсотків підвищити, щоб повернути? */
function povernuty(r: Vypadok): TrenZavdannia {
  const [p, vidp] = r.vybir([[20, 25], [20, 25], [50, 100], [60, 150], [75, 300]] as const);
  const a = 100 * r.chyslo(2, 30);
  const b = (a * (100 - p)) / 100;
  return {
    pytannia: `Товар коштував ${ch(a)} грн, його ціну знизили на ${p}%. На скільки відсотків треба підвищити нову ціну, щоб повернути початкову?`,
    vidpovid: vidp,
    odynytsi: '%',
    pidkazka: `Нова ціна — ${ch(b)} грн. Підвищити треба на ${ch(a - b)} грн, а відсоток рахуємо від НОВОЇ ціни.`,
    rozviazok: `${ch(a)} · ${drib(100 - p)} = ${ch(b)} (грн); ${ch(a - b)} : ${ch(b)} · 100 = ${vidp} (%)`,
  };
}

function vklad(r: Vypadok): TrenZavdannia {
  const { p, a, x } = groshi(r);
  return {
    pytannia: `Вкладник поклав до банку ${ch(a)} грн під ${p}% річних. Скільки грошей буде на його рахунку через рік?`,
    vidpovid: a + x,
    odynytsi: 'грн',
    pidkazka: `Через рік на рахунку — вклад і прибуток, тобто ${100 + p}% вкладу.`,
    rozviazok: `${ch(a)} · ${drib(p)} = ${ch(x)} (грн) — прибуток; ${ch(a)} + ${ch(x)} = ${ch(a + x)} (грн)`,
  };
}

function rozchyn(r: Vypadok): TrenZavdannia {
  const { p, a, x } = para(r, [2, 4, 5, 6, 8, 10, 12, 15, 20, 25], 100, 800);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `У ${ch(a)} г розчину ${p}% становить сіль. Скільки грамів солі в розчині?`,
      vidpovid: x,
      odynytsi: 'г',
      pidkazka: `Солі — ${p}% від ${ch(a)} г.`,
      rozviazok: `${ch(a)} · ${drib(p)} = ${ch(x)} (г)`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `У ${ch(a)} г розчину ${p}% становить сіль. Скільки грамів води в розчині?`,
      vidpovid: a - x,
      odynytsi: 'г',
      pidkazka: `Вода — це решта: 100% − ${p}% = ${100 - p}% розчину.`,
      rozviazok: `${ch(a)} · ${drib(100 - p)} = ${ch(a - x)} (г)`,
    };
  }
  return {
    pytannia: `Скільки грамів розчину можна приготувати з ${ch(x)} г солі, якщо сіль має становити ${p}% розчину?`,
    vidpovid: a,
    odynytsi: 'г',
    pidkazka: `${ch(x)} г — це ${p}% розчину. Знайди число за його відсотками.`,
    rozviazok: `${ch(x)} : ${drib(p)} = ${ch(a)} (г)`,
  };
}

function sushinnia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [shcho, sukhi, svizhi, vtrata] = r.vybir([
      ['Гриби', 'сушених грибів', 'свіжих', [80, 85, 88, 90]],
      ['Яблука', 'сушених яблук', 'свіжих', [80, 84, 85, 88]],
      ['Сливи', 'чорносливу', 'свіжих слив', [65, 70, 75]],
      ['Трава', 'сіна', 'свіжої трави', [75, 80]],
    ] as const);
    const p = r.vybir(vtrata);
    const zal = 100 - p;
    const kg = r.chyslo(4, 60);
    const sukh100 = kg * zal; // маса сушеного в сотих кілограма
    if (sukh100 % 10 !== 0) continue;
    return {
      pytannia: `${shcho} під час сушіння ${shcho === 'Трава' ? 'втрачає' : 'втрачають'} ${p}% своєї маси. Скільки кілограмів ${sukhi} вийде з ${kg} кг ${svizhi}?`,
      vidpovid: des(sukh100 / 10, 1),
      odynytsi: 'кг',
      pidkazka: `Втрачається ${p}%, тож залишається 100 − ${p} = ${zal}% маси.`,
      rozviazok: `${kg} · ${drib(zal)} = ${des(sukh100 / 10, 1)} (кг)`,
    };
  }
}

export default {
  rivni: ['три типи задач на відсотки', 'збільшити чи зменшити на кілька відсотків', 'дві зміни поспіль, вклад, розчин'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vidChysla, zaVidsotkom, skilkyVidsotkiv])(r);
    if (riven === 2) return r.vybir([novaTsina, novaTsina, zminaChysla, staraTsina])(r);
    return r.vybir([poslidovni, poslidovni, povernuty, vklad, rozchyn, sushinnia, staraTsina])(r);
  },
} satisfies Henerator;
