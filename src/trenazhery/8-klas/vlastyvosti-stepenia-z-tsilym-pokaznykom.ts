// Властивості степеня з цілим показником: множення, ділення, степінь степеня, (ab)ⁿ — з від'ємними показниками;
// підступи (знаки при діленні, мінус на мінус, додавання — не множення), вирази з кількома діями, дві змінні,
// мікроскоп і «у скільки разів» для малих величин.
import { type Henerator, type Vypadok, type TrenZavdannia, ch, des, rivnyiDrib, tch, tvidpovidDrib, vidpovidDrib } from '../dopomoha.ts';

/** Степінь у TeX; показник 1 не пишемо: st(3, 1) → «3», st(3, -2) → «3^{-2}». */
const st = (osnova: string | number, n: number) => (n === 1 ? `${osnova}` : `${osnova}^{${n}}`);
/** Від'ємне число в дужках — для запису дій з показниками: «2 - (-3)». */
const d = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** Те саме для звичайного тексту, з типографським мінусом: «(−3)». */
const dt = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);
/** Ланцюжок рівностей без повторів: lanc('a', 'b', 'b') → «a = b». */
const lanc = (...kroky: string[]) => kroky.filter(Boolean).filter((k, i, v) => k !== v[i - 1]).join(' = ');
/** Ціле число з проміжку, крім нуля й заборонених. */
const pokaz = (r: Vypadok, vid: number, do_: number, krim: number[] = []) => r.krim(vid, do_, [0, ...krim]);
const LITERY = ['b', 'c', 'm', 'p'];
/** k · 10ᵉ у TeX без зайвого: k10(4, 0) → «4», k10(1, -3) → «10^{-3}», k10(4, 1) → «4 · 10». */
const k10 = (k: number, e: number) => (e === 0 ? `${k}` : k === 1 ? st(10, e) : `${k} \\cdot ${st(10, e)}`);

/** Значення aᵏ для відповіді: ціле або дріб 1/a⁻ᵏ. */
function znachennia(a: number, k: number) {
  if (k >= 0) return { vidpovid: a ** k, tex: String(a ** k) };
  const zn = a ** -k;
  return { vidpovid: vidpovidDrib(1, zn), perevirka: rivnyiDrib(1, zn), pokaz: `$${tvidpovidDrib(1, zn)}$`, tex: `\\frac{1}{${zn}}` };
}
const mezhaZnachennia = (a: number, k: number) => a ** Math.abs(k) <= 1000;

type Dija = 'mnozhennia' | 'dilennia' | 'stepin';
const PIDKAZKA: Record<Dija, string> = {
  mnozhennia: 'При множенні степенів з однаковою основою показники додаємо.',
  dilennia: 'При діленні степенів з однаковою основою показники віднімаємо. Стеж за знаком.',
  stepin: 'Степінь степеня — показники множимо.',
};

/** Одна дія зі степенями числа: або показник у віконці, або значення. */
function odnaDija(r: Vypadok, dija: Dija): TrenZavdannia {
  for (;;) {
    const vikno = r.shans();
    const a = vikno ? r.chyslo(2, 15) : r.vybir([2, 2, 3, 3, 4, 5, 10]);
    let m: number;
    let n: number;
    let k: number;
    let zapys: string;
    let krok: string;
    if (dija === 'stepin') {
      m = pokaz(r, -4, 4, [1]);
      n = pokaz(r, -4, 4, [1]);
      k = m * n;
      zapys = `\\left(${a}^{${m}}\\right)^{${n}}`;
      krok = `${a}^{${d(m)} \\cdot ${d(n)}}`;
    } else {
      m = pokaz(r, -9, 9);
      n = pokaz(r, -9, 9);
      k = dija === 'mnozhennia' ? m + n : m - n;
      zapys = `${st(a, m)} ${dija === 'mnozhennia' ? '\\cdot' : ':'} ${st(a, n)}`;
      krok = `${a}^{${m} ${dija === 'mnozhennia' ? '+' : '-'} ${d(n)}}`;
    }
    // Тема — від'ємні показники: хоча б один від'ємний.
    if (m > 0 && n > 0) continue;
    if (vikno) {
      return {
        pytannia: 'Яке число треба поставити у віконце?',
        vyraz: `$${zapys} = ${a}^{\\square}$`,
        vidpovid: ch(k),
        pidkazka: PIDKAZKA[dija],
        rozviazok: `$${lanc(zapys, krok, st(a, k))}$, тож у віконці ${ch(k)}.`,
      };
    }
    if (!mezhaZnachennia(a, k)) continue;
    const z = znachennia(a, k);
    return {
      pytannia: k < 0 ? 'Обчисли. Відповідь запиши дробом через риску.' : 'Обчисли.',
      vyraz: `$${zapys} =$`,
      vidpovid: z.vidpovid,
      perevirka: z.perevirka,
      pokaz: z.pokaz,
      pidkazka: `${PIDKAZKA[dija]} Потім обчисли степінь.`,
      rozviazok: `$${lanc(zapys, krok, st(a, k), k < 0 ? `\\frac{1}{${st(a, -k)}}` : '', z.tex)}$.`,
    };
  }
}
const mnozhennia = (r: Vypadok) => odnaDija(r, 'mnozhennia');
const dilennia = (r: Vypadok) => odnaDija(r, 'dilennia');
const stepinStepenia = (r: Vypadok) => odnaDija(r, 'stepin');

/** Знаки: ділення на степінь з від'ємним показником, добуток двох «від'ємних» степенів, пропущений множник. */
function znaky(r: Vypadok): TrenZavdannia {
  const b = r.vybir(LITERY);
  const typ = r.chyslo(1, 4);
  if (typ === 1) {
    const m = pokaz(r, -9, 9);
    const n = r.chyslo(-9, -1);
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${st(b, m)} : ${b}^{${n}} = ${b}^{\\square}$`,
      vidpovid: ch(m - n),
      pidkazka: `Показники віднімаємо: ${ch(m)} − (${ch(n)}). Відняти від'ємне число — це додати протилежне.`,
      rozviazok: `$${st(b, m)} : ${b}^{${n}} = ${b}^{${m} - (${n})} = ${st(b, m - n)}$. Поділити на $${b}^{${n}}$ — те саме, що помножити на $${st(b, -n)}$.`,
    };
  }
  if (typ === 2) {
    const [m, n] = [r.chyslo(-9, -1), r.chyslo(-9, -1)];
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${b}^{${m}} \\cdot ${b}^{${n}} = ${b}^{\\square}$`,
      vidpovid: ch(m + n),
      pidkazka: 'При множенні показники додаємо, а не множимо.',
      rozviazok: `$${b}^{${m}} \\cdot ${b}^{${n}} = ${b}^{${m} + (${n})} = ${b}^{${m + n}}$. Обидва показники від'ємні, тож і сума від'ємна.`,
    };
  }
  // Пропущений множник або дільник: bᵐ · b□ = bᵏ, bᵐ : b□ = bᵏ.
  for (;;) {
    const m = pokaz(r, -9, 9);
    const k = pokaz(r, -9, 9);
    const vidp = typ === 3 ? k - m : m - k;
    if (vidp === 0 || (m > 0 && k > 0)) continue;
    const znak = typ === 3 ? '\\cdot' : ':';
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${st(b, m)} ${znak} ${b}^{\\square} = ${st(b, k)}$`,
      vidpovid: ch(vidp),
      pidkazka: typ === 3 ? `${ch(m)} + □ = ${ch(k)}. Яке число треба додати?` : `${ch(m)} − □ = ${ch(k)}. Яке число треба відняти?`,
      rozviazok:
        typ === 3
          ? `${ch(m)} + ${dt(vidp)} = ${ch(k)}, тож $${st(b, m)} \\cdot ${st(b, vidp)} = ${st(b, k)}$.`
          : `${ch(m)} − ${dt(vidp)} = ${ch(k)}, тож $${st(b, m)} : ${st(b, vidp)} = ${st(b, k)}$.`,
    };
  }
}

/** (bᵖ)^q з від'ємними показниками: мінус на мінус дає плюс. */
function stepinZnaky(r: Vypadok): TrenZavdannia {
  const b = r.vybir(LITERY);
  const p = r.shans(0.6) ? r.chyslo(-5, -1) : r.chyslo(2, 5);
  const q = p > 0 ? r.chyslo(-5, -2) : pokaz(r, -5, 5, [1]);
  return {
    pytannia: 'Яке число треба поставити у віконце?',
    vyraz: `$\\left(${b}^{${p}}\\right)^{${q}} = ${b}^{\\square}$`,
    vidpovid: ch(p * q),
    pidkazka: 'Показники множимо. Який знак має добуток?',
    rozviazok: `$\\left(${b}^{${p}}\\right)^{${q}} = ${b}^{${d(p)} \\cdot ${d(q)}} = ${b}^{${p * q}}$: ${
      p < 0 && q < 0 ? 'мінус на мінус дає плюс' : 'один показник від\'ємний, тож добуток від\'ємний'
    }.`,
  };
}

/** aⁿ + aⁿ + … — це додавання, а не множення: показники не додаємо. */
function suma(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 4);
  const n = r.chyslo(1, 4);
  const k = 1 - n;
  const zapys = Array(a).fill(`${a}^{${-n}}`).join(' + ');
  const kroky = `${a} \\cdot ${a}^{${-n}} = ${a}^{1 + (${-n})} = ${st(a, k)}`;
  const pidkazka = `Тут додавання, а не множення степенів: ${a} однакові доданки — це множення на ${a}, тобто на $${a}^1$.`;
  if (r.shans()) {
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${zapys} = ${a}^{\\square}$`,
      vidpovid: ch(k),
      pidkazka,
      rozviazok: `$${zapys} = ${kroky}$, тож у віконці ${ch(k)}. Додати показники тут не можна — це не множення.`,
    };
  }
  const z = znachennia(a, k);
  return {
    pytannia: k < 0 ? 'Обчисли. Відповідь запиши числом або дробом через риску.' : 'Обчисли.',
    vyraz: `$${zapys} =$`,
    vidpovid: z.vidpovid,
    perevirka: z.perevirka,
    pokaz: z.pokaz,
    pidkazka,
    rozviazok: `$${lanc(`${zapys} = ${kroky}`, k < 0 ? `\\frac{1}{${st(a, -k)}}` : '', z.tex)}$.`,
  };
}

/** aⁿ · bⁿ = (ab)ⁿ: однакові показники, добуток основ — 10 або 100. */
function odnakoviPokaznyky(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir([[2, 5], [2, 5], [4, 25], [5, 20], [2, 50]]);
  const dob = a * b;
  const n = dob === 10 ? r.chyslo(1, 5) : r.chyslo(1, 2);
  const [x, y] = r.shans() ? [a, b] : [b, a];
  const nuliv = dob === 10 ? n : 2 * n;
  return {
    pytannia: 'Обчисли. Відповідь запиши десятковим дробом.',
    vyraz: `$${x}^{${-n}} \\cdot ${y}^{${-n}} =$`,
    vidpovid: des(1, nuliv),
    pidkazka: 'Основи різні, зате показники однакові: $a^n \\cdot b^n = (ab)^n$.',
    rozviazok: `$${x}^{${-n}} \\cdot ${y}^{${-n}} = (${x} \\cdot ${y})^{${-n}} = ${dob}^{${-n}} = \\frac{1}{${tch(dob ** n)}}$, це ${des(1, nuliv)}.`,
  };
}

/** Кілька дій: (aᵖ)^q · aᵐ : aⁿ, відповідь — число або дріб. */
function kombinovanyi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.vybir([2, 2, 3, 3, 5, 10]);
    const p = pokaz(r, -4, 4, [1]);
    const q = pokaz(r, -3, 3, [1]);
    const m = pokaz(r, -9, 9);
    const n = pokaz(r, -9, 9);
    const k1 = p * q;
    const k2 = k1 + m;
    const k = k2 - n;
    if ([p, q, m, n].filter((v) => v < 0).length < 2 || k < -3 || k > 4 || !mezhaZnachennia(a, k)) continue;
    const zapys = `\\left(${a}^{${p}}\\right)^{${q}} \\cdot ${st(a, m)} : ${st(a, n)}`;
    const z = znachennia(a, k);
    return {
      pytannia: k < 0 ? 'Обчисли. Відповідь запиши дробом через риску.' : 'Обчисли.',
      vyraz: `$${zapys} =$`,
      vidpovid: z.vidpovid,
      perevirka: z.perevirka,
      pokaz: z.pokaz,
      pidkazka: 'Спершу степінь степеня (показники множимо), потім множення й ділення зліва направо.',
      rozviazok: `$\\left(${a}^{${p}}\\right)^{${q}} = ${st(a, k1)}$; $${st(a, k1)} \\cdot ${st(a, m)} = ${a}^{${k1} + ${d(m)}} = ${st(a, k2)}$; $${lanc(
        `${st(a, k2)} : ${st(a, n)}`,
        `${a}^{${k2} - ${d(n)}}`,
        st(a, k),
        k < 0 ? `\\frac{1}{${st(a, -k)}}` : '',
        z.tex,
      )}$.`,
    };
  }
}

/** Дві змінні: (bᵖcˢ)^q, bᵐcˢ · bⁿcᵗ, дріб — знайди показник однієї з них. */
function dviZminni(r: Vypadok): TrenZavdannia {
  const [b, c] = r.vybir([['b', 'c'], ['m', 'p'], ['c', 'p']]);
  const typ = r.chyslo(1, 3);
  for (;;) {
    let zapys: string;
    let pb: number;
    let pc: number;
    let poiasnennia: string;
    if (typ === 1) {
      const [p, s] = [pokaz(r, -5, 5), pokaz(r, -5, 5)];
      const q = pokaz(r, -3, 3, [1]);
      if ((p > 0 && s > 0 && q > 0) || p === s) continue;
      zapys = `\\left(${st(b, p)}${st(c, s)}\\right)^{${q}}`;
      [pb, pc] = [p * q, s * q];
      poiasnennia = `Кожен множник підносимо до степеня ${ch(q)}: показники множимо, ${ch(p)} · ${dt(q)} = ${ch(pb)}, ${ch(s)} · ${dt(q)} = ${ch(pc)}.`;
    } else {
      const [m, s, n, t] = [pokaz(r, -7, 7), pokaz(r, -7, 7), pokaz(r, -7, 7), pokaz(r, -7, 7)];
      [pb, pc] = typ === 2 ? [m + n, s + t] : [m - n, s - t];
      if ([m, s, n, t].filter((v) => v < 0).length < 2 || pb === 0 || pc === 0) continue;
      zapys = typ === 2 ? `${st(b, m)}${st(c, s)} \\cdot ${st(b, n)}${st(c, t)}` : `\\frac{${st(b, m)}${st(c, s)}}{${st(b, n)}${st(c, t)}}`;
      poiasnennia =
        typ === 2
          ? `Показники при ${b} додаємо: ${ch(m)} + ${dt(n)} = ${ch(pb)}; при ${c}: ${ch(s)} + ${dt(t)} = ${ch(pc)}.`
          : `Показники при ${b} віднімаємо: ${ch(m)} − ${dt(n)} = ${ch(pb)}; при ${c}: ${ch(s)} − ${dt(t)} = ${ch(pc)}.`;
    }
    if (pb === 0 || pc === 0) continue;
    const pytatyB = r.shans();
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: pytatyB ? `$${zapys} = ${b}^{\\square} ${st(c, pc)}$` : `$${zapys} = ${st(b, pb)} ${c}^{\\square}$`,
      vidpovid: ch(pytatyB ? pb : pc),
      pidkazka: typ === 1 ? '$(xy)^n = x^n y^n$, а $(x^p)^n = x^{pn}$.' : `Працюй окремо з ${b} і окремо з ${c}.`,
      rozviazok: `${poiasnennia} Отже, $${zapys} = ${st(b, pb)}${st(c, pc)}$.`,
    };
  }
}

/** Мікроскоп і «у скільки разів» для малих величин. */
function nauka(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const obiekty: [string, number, number, number[]][] = [
      // назва, показник довжини в метрах, найбільший множник, збільшення мікроскопа (показники 10)
      ['бактерії', -6, 5, [3, 4]],
      ['клітини шкіри', -5, 5, [2, 3]],
      ['вірусу', -7, 3, [4, 5]],
      ['пилинки', -5, 9, [2]],
    ];
    const [nazva, p, maxK, zbilshennia] = r.vybir(obiekty);
    const k = r.chyslo(1, maxK);
    const q = r.vybir(zbilshennia);
    const e = q + p + 3; // показник 10 у міліметрах
    const vidp = k * 10 ** e;
    const dovzhyna = k === 1 ? `10^{${p}}` : `${k} \\cdot 10^{${p}}`;
    return {
      pytannia: `Довжина ${nazva} — $${dovzhyna}$ м. ${q >= 4 ? 'Електронний мікроскоп' : 'Мікроскоп'} збільшує в $10^{${q}}$ разів. Яку довжину має зображення?`,
      vidpovid: vidp,
      odynytsi: 'мм',
      pidkazka: 'Помнож довжину на збільшення (показники 10 додаються), а потім переведи метри в міліметри: 1 м = 1000 мм.',
      rozviazok: `$${dovzhyna} \\cdot 10^{${q}} = ${k10(k, p + q)}$ м. У міліметрах — у 1000 разів більше: $${lanc(`${k10(k, p + q)} \\cdot 10^{3}`, k10(k, e), tch(vidp))}$ мм.`,
    };
  }
  const rechi: [string, number][] = [
    ['товщина волосини', -4],
    ['товщина аркуша паперу', -4],
    ['розмір пилинки', -5],
    ['довжина бактерії', -6],
    ['розмір вірусу', -7],
    ['довжина мурашки', -3],
    ['товщина монети', -3],
  ];
  for (;;) {
    const [[n1, p1], [n2, p2]] = [r.vybir(rechi), r.vybir(rechi)];
    if (p1 <= p2) continue;
    const raziv = 10 ** (p1 - p2);
    const N1 = n1[0].toUpperCase() + n1.slice(1);
    return {
      pytannia: `${N1} — приблизно $10^{${p1}}$ м, а ${n2} — приблизно $10^{${p2}}$ м. У скільки разів перше більше за друге?`,
      vidpovid: raziv,
      pidkazka: 'Щоб дізнатися, у скільки разів одне число більше за інше, поділи їх. Показники при діленні віднімаємо.',
      rozviazok: `$10^{${p1}} : 10^{${p2}} = 10^{${p1} - ${d(p2)}} = 10^{${p1 - p2}} = ${tch(raziv)}$.`,
    };
  }
}

export default {
  rivni: ['одна дія', 'з підступом', 'вирази й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([mnozhennia, dilennia, stepinStepenia])(r);
    if (riven === 2) return r.vybir([znaky, znaky, stepinZnaky, suma, odnakoviPokaznyky])(r);
    return r.vybir([kombinovanyi, dviZminni, nauka])(r);
  },
} satisfies Henerator;
