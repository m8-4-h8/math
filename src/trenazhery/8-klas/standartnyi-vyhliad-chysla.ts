// Стандартний вигляд числа a · 10ⁿ (1 ≤ a < 10): порядок великого й малого числа, множник a; підступи (множник
// поза [1; 10), звичайний запис, порівняння, чи це стандартний вигляд); добуток і частка, числа з природи.
// Числа зберігаємо точно: k · 10ᵉ, де k — ціле без нулів у кінці.
import { type Henerator, type Vypadok, type TrenZavdannia, ch, des, tch } from '../dopomoha.ts';

const TN = ['Так', 'Ні'];
const dovzh = (k: number) => String(k).length;
/** Порядок числа k · 10ᵉ. */
const poriadok = (k: number, e: number) => e + dovzh(k) - 1;
/** Множник a для значущих цифр k: TeX «4{,}5» і текст «4,5». */
const aTex = (k: number) => (dovzh(k) === 1 ? `${k}` : `${String(k)[0]}{,}${String(k).slice(1)}`);
const aTxt = (k: number) => des(k, dovzh(k) - 1);
/** Звичайний запис k · 10ᵉ: TeX і текст. */
const zvTex = (k: number, e: number) => (e >= 0 ? tch(k * 10 ** e) : des(k, -e).replace(',', '{,}'));
const zvTxt = (k: number, e: number) => (e >= 0 ? ch(k * 10 ** e) : des(k, -e));
/** Ціле k без нулів у кінці → [k, скільки нулів забрали]. */
function bezNuliv(k: number): [number, number] {
  let z = 0;
  while (k % 10 === 0) {
    k /= 10;
    z++;
  }
  return [k, z];
}
/** Значущі цифри: одна, дві чи три, остання — не нуль. */
function znachushchi(r: Vypadok): number {
  const skilky = r.vybir([1, 2, 2, 3]);
  for (;;) {
    const k = r.chyslo(10 ** (skilky - 1), 10 ** skilky - 1);
    if (k % 10 !== 0 || skilky === 1) return k;
  }
}
const kudy = (n: number) => (n > 0 ? `на ${n} ${n === 1 ? 'місце' : n < 5 ? 'місця' : 'місць'} ліворуч` : `на ${-n} ${-n === 1 ? 'місце' : -n < 5 ? 'місця' : 'місць'} праворуч`);

/** Порядок великого (n > 0) або малого (n < 0) числа, або множник a. */
function zapysaty(r: Vypadok, shcho: 'velyke' | 'male' | 'mnozhnyk'): TrenZavdannia {
  const k = znachushchi(r);
  const male = shcho === 'male' || (shcho === 'mnozhnyk' && r.shans());
  const n = male ? r.chyslo(-6, -1) : r.chyslo(Math.max(1, dovzh(k) - 1), 8);
  const e = n - (dovzh(k) - 1);
  const chyslo = zvTex(k, e);
  const pershaCyfra = String(k)[0];
  const rozviazok = `Кома стає після першої ненульової цифри ${pershaCyfra} — пересувається ${kudy(n)}. Тож $${chyslo} = ${aTex(k)} \\cdot 10^{${n}}$.`;
  if (shcho === 'mnozhnyk') {
    return {
      pytannia: 'Яке число треба поставити у віконце?',
      vyraz: `$${chyslo} = \\square \\cdot 10^{${n}}$`,
      vidpovid: aTxt(k),
      pidkazka: 'Множник — від 1 до 10: кома стоїть одразу після першої ненульової цифри.',
      rozviazok,
    };
  }
  return {
    pytannia: 'Яке число треба поставити у віконце?',
    vyraz: `$${chyslo} = ${aTex(k)} \\cdot 10^{\\square}$`,
    vidpovid: ch(n),
    pidkazka: male ? 'Число менше за 1 — порядок від\'ємний. На скільки місць праворуч стрибає кома?' : 'На скільки місць ліворуч стрибає кома, щоб стати після першої цифри?',
    rozviazok,
  };
}
const velyke = (r: Vypadok) => zapysaty(r, 'velyke');
const male = (r: Vypadok) => zapysaty(r, 'male');
const mnozhnyk = (r: Vypadok) => zapysaty(r, 'mnozhnyk');

/** Множник поза [1; 10): 25 · 10³ = 2,5 · 10□, 0,3 · 10⁻² = 3 · 10□. */
function nestandartnyi(r: Vypadok): TrenZavdannia {
  const k = znachushchi(r);
  const s = r.vybir([1, 1, 2, -1, -1, -2]); // c = a · 10ˢ
  const c = { tex: zvTex(k, s - dovzh(k) + 1), txt: zvTxt(k, s - dovzh(k) + 1) };
  const m = r.krim(-6, 6, [0]);
  const n = s + m;
  return {
    pytannia: 'Запиши в стандартному вигляді. Яке число треба поставити у віконце?',
    vyraz: `$${c.tex} \\cdot 10^{${m}} = ${aTex(k)} \\cdot 10^{\\square}$`,
    vidpovid: ch(n),
    pidkazka: `${c.txt} — не від 1 до 10. Запиши спершу ${c.txt} як ${aTxt(k)} · 10 у якомусь степені.`,
    rozviazok: `$${c.tex} = ${aTex(k)} \\cdot 10^{${s}}$, тож $${c.tex} \\cdot 10^{${m}} = ${aTex(k)} \\cdot 10^{${s} + ${m < 0 ? `(${m})` : m}} = ${aTex(k)} \\cdot 10^{${n}}$.`,
  };
}

/** Зі стандартного вигляду — у звичайний запис. */
function zvorotnyi(r: Vypadok): TrenZavdannia {
  const k = znachushchi(r);
  const n = r.shans() ? r.chyslo(Math.max(1, dovzh(k) - 1), 6) : r.chyslo(-5, -1);
  const e = n - (dovzh(k) - 1);
  return {
    pytannia: n > 0 ? 'Запиши звичайним числом.' : 'Запиши десятковим дробом.',
    vyraz: `$${aTex(k)} \\cdot 10^{${n}} =$`,
    vidpovid: e >= 0 ? k * 10 ** e : des(k, -e),
    pidkazka: n > 0 ? `Множення на $10^{${n}}$ пересуває кому на ${n} ${n < 5 ? 'місця' : 'місць'} праворуч.` : `Множення на $10^{${n}}$ — це ділення на $10^{${-n}}$: кома пересувається ліворуч.`,
    rozviazok: `$${aTex(k)} \\cdot 10^{${n}} = ${zvTex(k, e)}$: кома пересунулася ${n > 0 ? `на ${n} праворуч` : `на ${-n} ліворуч`}.`,
  };
}

/** Порівняння: спершу порядки, потім множники. */
function porivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [k1, k2] = [znachushchi(r), znachushchi(r)];
    const n1 = r.chyslo(-6, 8);
    const typ = r.chyslo(1, 4);
    // 1–2: пастка — більший множник, але менший порядок; 3: однакові порядки; 4: рівні числа, одне — не стандартне.
    if (typ === 4) {
      const s = r.vybir([1, -1]);
      const c = zvTex(k1, s - dovzh(k1) + 1);
      return {
        pytannia: 'Порівняй.',
        vyraz: `$${aTex(k1)} \\cdot 10^{${n1}} \\square ${c} \\cdot 10^{${n1 - s}}$`,
        vidpovid: '=',
        varianty: ['>', '<', '='],
        pidkazka: 'Друге число записане не в стандартному вигляді. Спершу виправ його.',
        rozviazok: `$${c} = ${aTex(k1)} \\cdot 10^{${s}}$, тож друге число — $${aTex(k1)} \\cdot 10^{${n1}}$. Числа рівні.`,
      };
    }
    const a1 = k1 / 10 ** (dovzh(k1) - 1);
    const a2 = k2 / 10 ** (dovzh(k2) - 1);
    let n2: number;
    if (typ === 3) {
      if (a1 === a2) continue;
      n2 = n1;
    } else {
      if (a1 <= a2) continue; // перший множник більший…
      n2 = n1 + r.chyslo(1, 2); // …а порядок менший
    }
    const pershyi = r.shans();
    const [L, P] = pershyi ? [[k1, n1], [k2, n2]] : [[k2, n2], [k1, n1]];
    const vL = L[0] * 10 ** (L[1] - dovzh(L[0]) + 1);
    const vP = P[0] * 10 ** (P[1] - dovzh(P[0]) + 1);
    const znak = vL > vP ? '>' : '<';
    return {
      pytannia: 'Порівняй.',
      vyraz: `$${aTex(L[0])} \\cdot 10^{${L[1]}} \\square ${aTex(P[0])} \\cdot 10^{${P[1]}}$`,
      vidpovid: znak,
      varianty: ['>', '<', '='],
      pidkazka: 'Спершу порівняй порядки, а якщо вони однакові — множники.',
      rozviazok:
        L[1] === P[1]
          ? `Порядки однакові, тож порівнюємо множники: ${aTxt(L[0])} ${znak} ${aTxt(P[0])}.`
          : `Порядок ${ch(Math.max(L[1], P[1]))} більший за ${ch(Math.min(L[1], P[1]))}, тож більше ${L[1] > P[1] ? 'перше' : 'друге'} число — хоч би який був множник.`,
    };
  }
}

/** Чи записано число в стандартному вигляді? */
function chyStandartnyi(r: Vypadok): TrenZavdannia {
  const k = znachushchi(r);
  const m = r.krim(-7, 9, [0]);
  const tak = r.shans(0.4);
  const s = tak ? 0 : r.vybir([1, 2, -1]);
  const c = zvTex(k, s - dovzh(k) + 1);
  return {
    pytannia: `Чи записано число $${c} \\cdot 10^{${m}}$ у стандартному вигляді?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Множник перед степенем десяти має бути не меншим за 1 і меншим за 10.',
    rozviazok: tak
      ? `Так: $1 \\le ${c} < 10$.`
      : `Ні: ${s > 0 ? `$${c} \\ge 10$` : `$${c} < 1$`}. Стандартний вигляд — $${aTex(k)} \\cdot 10^{${s + m}}$.`,
  };
}

/** Останній крок дії: «c · 10ˢ = a · 10ᴺ» або, якщо c уже від 1 до 10, — що це вже стандартний вигляд. */
function pidsumok(c: string, s: number, k: number, N: number) {
  if (c === aTxt(k) && s === N) return `Множник ${c} уже від 1 до 10, тож це й є стандартний вигляд: $${aTex(k)} \\cdot 10^{${N}}$.`;
  return `$${c.replace(',', '{,}')} \\cdot 10^{${s}} = ${aTex(k)} \\cdot 10^{${N}}$, бо ${c} — не від 1 до 10.`;
}

/** Множник a = k · 10ᵉ з простих: цілі 1–9 або 1,5; 2,5; 1,2. */
const MNOZHNYKY: [number, number][] = [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [15, -1], [25, -1], [12, -1]];
const aZ = ([k, e]: [number, number]) => (e === 0 ? `${k}` : aTex(k));

/** Добуток (a · 10ᵐ)(b · 10ⁿ): множник результату показано, шукаємо порядок. */
function dobutok(r: Vypadok): TrenZavdannia {
  const [p, q] = [r.vybir(MNOZHNYKY), r.vybir(MNOZHNYKY)];
  const [m, n] = [r.krim(-8, 9, [0]), r.krim(-8, 9, [0])];
  if (m > 0 && n > 0 && r.shans(0.7)) return dobutok(r);
  const [k, z] = bezNuliv(p[0] * q[0]);
  const e = p[1] + q[1] + z + m + n;
  const N = poriadok(k, e);
  const dobutokMnozh = des(p[0] * q[0], -(p[1] + q[1]));
  return {
    pytannia: 'Запиши добуток у стандартному вигляді. Яке число треба поставити у віконце?',
    vyraz: `$(${aZ(p)} \\cdot 10^{${m}}) \\cdot (${aZ(q)} \\cdot 10^{${n}}) = ${aTex(k)} \\cdot 10^{\\square}$`,
    vidpovid: ch(N),
    pidkazka: 'Перемнож окремо множники й окремо степені десяти. Якщо множник вийде 10 або більше — виправ.',
    rozviazok: `Множники: ${des(p[0], -p[1])} · ${des(q[0], -q[1])} = ${dobutokMnozh}; степені: $10^{${m}} \\cdot 10^{${n}} = 10^{${m + n}}$. ${pidsumok(dobutokMnozh, m + n, k, N)}`,
  };
}

/** Частка (a · 10ᵐ) : (b · 10ⁿ). */
function chastka(r: Vypadok): TrenZavdannia {
  const [a, b] = r.vybir([[8, 2], [6, 3], [9, 3], [8, 4], [6, 2], [9, 2], [4, 8], [2, 8], [3, 6], [2, 5], [1, 2], [1, 4], [3, 5], [7, 2]]);
  const [m, n] = [r.krim(-7, 9, [0]), r.krim(-7, 9, [0])];
  const [k, z] = bezNuliv((a * 1000) / b);
  const e = z - 3 + m - n;
  const N = poriadok(k, e);
  const chastkaMn = des((a * 1000) / b, 3).replace(/,?0+$/, '');
  return {
    pytannia: 'Запиши частку в стандартному вигляді. Яке число треба поставити у віконце?',
    vyraz: `$(${a} \\cdot 10^{${m}}) : (${b} \\cdot 10^{${n}}) = ${aTex(k)} \\cdot 10^{\\square}$`,
    vidpovid: ch(N),
    pidkazka: `Поділи окремо множники (${a} : ${b}) і окремо степені десяти (показники віднімаємо).`,
    rozviazok: `${a} : ${b} = ${chastkaMn}; $10^{${m}} : 10^{${n}} = 10^{${m} - ${n < 0 ? `(${n})` : n}} = 10^{${m - n}}$. ${pidsumok(chastkaMn, m - n, k, N)}`,
  };
}

/** Великі й малі числа з природи. */
function pryroda(r: Vypadok): TrenZavdannia {
  if (r.shans(0.3)) {
    const t = r.vybir([20, 40, 60, 200, 400, 500]);
    const [k, z] = bezNuliv(3 * t);
    const N = poriadok(k, z + 5);
    return {
      pytannia: `Світло долає приблизно $3 \\cdot 10^5$ км за секунду. Скільки кілометрів воно пролетить за ${t} с? Запиши в стандартному вигляді: $${aTex(k)} \\cdot 10^{\\square}$ км. Яке число у віконці?`,
      vidpovid: ch(N),
      pidkazka: `Запиши ${t} як степінь десяти з множником і перемнож.`,
      rozviazok: `$3 \\cdot 10^5 \\cdot ${t} = ${3 * t} \\cdot 10^5 = ${aTex(k)} \\cdot 10^{${N}}$ км.`,
    };
  }
  const fakty: [string, number, number, string][] = [
    // текст, значущі цифри k, показник e (значення k · 10ᵉ), одиниці
    ['Відстань від Землі до Сонця — приблизно', 15, 7, 'км'],
    ['Відстань від Землі до Місяця — приблизно', 384, 3, 'км'],
    ['Швидкість світла — приблизно', 3, 5, 'км/с'],
    ['На Землі живе приблизно', 8, 9, 'людей'],
    ['Площа України — приблизно', 604, 3, 'км²'],
    ['В організмі дорослої людини приблизно', 3, 13, 'клітин'],
    ['Діаметр червоної кров\'яної клітини — приблизно', 7, -6, 'м'],
    ['Товщина людської волосини — приблизно', 7, -5, 'м'],
    ['Розмір вірусу грипу — приблизно', 1, -7, 'м'],
    ['Маса комара — приблизно', 25, -7, 'кг'],
    ['Товщина аркуша паперу — приблизно', 1, -4, 'м'],
  ];
  const [tekst, k, e, od] = r.vybir(fakty);
  const N = poriadok(k, e);
  return {
    pytannia: `${tekst} $${zvTex(k, e)}$ ${od}. Запиши це число в стандартному вигляді: $${aTex(k)} \\cdot 10^{\\square}$. Яке число у віконці?`,
    vidpovid: ch(N),
    pidkazka: N > 0 ? 'Порахуй, на скільки місць ліворуч стрибне кома.' : 'Число менше за 1 — порядок від\'ємний. Порахуй стрибки коми праворуч.',
    rozviazok: `Кома стає після першої ненульової цифри — пересувається ${kudy(N)}: $${zvTex(k, e)} = ${aTex(k)} \\cdot 10^{${N}}$.`,
  };
}

export default {
  rivni: ['запиши в стандартному вигляді', 'з підступом', 'дії й числа з природи'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([velyke, male, mnozhnyk])(r);
    if (riven === 2) return r.vybir([nestandartnyi, zvorotnyi, porivniannia, chyStandartnyi])(r);
    return r.vybir([dobutok, chastka, pryroda])(r);
  },
} satisfies Henerator;
