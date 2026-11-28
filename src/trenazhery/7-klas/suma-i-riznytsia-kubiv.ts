// Сума і різниця кубів: a³ ± b³ = (a ± b)(a² ∓ ab + b²). Впізнати куб числа й одночлена, неповний квадрат
// (середній член ab, а не 2ab), знаки «той самий — протилежний — завжди плюс»; скорочене множення,
// значення виразу, рівняння, у якому куби знищуються.
import { ch, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { tex, tz, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'c'];

/** k·x для формули: 1 → «x», 3 → «3x». */
const kx = (k: number, x: string, st = 1) => `${k === 1 ? '' : k}${x}${st === 1 ? '' : `^${st}`}`;
const znak = (plus: boolean) => (plus ? '+' : '-');
const nazva = (plus: boolean) => (plus ? 'сума кубів' : 'різниця кубів');

/** Формула для (kx ± n): ліва частина, перша дужка і неповний квадрат — для TeX. */
function formula(k: number, n: number, plus: boolean, x: string) {
  const kuby = `${kx(k ** 3, x, 3)} ${znak(plus)} ${n ** 3}`;
  const persha = `${kx(k, x)} ${znak(plus)} ${n}`;
  const nepovnyi = `${kx(k * k, x, 2)} ${znak(!plus)} ${kx(k * n, x)} + ${n * n}`;
  return { kuby, persha, nepovnyi, povna: `${kuby} = (${persha})(${nepovnyi})` };
}

// Куб числа і одночлена: 64 = □³, 27x³ = (□x)³.
function kub(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const n = r.chyslo(2, 10);
    return {
      pytannia: 'Яке число треба піднести до куба, щоб вийшло це число?',
      vyraz: `$\\square^3 = ${n ** 3}$`,
      nevidome: '$\\square$',
      vidpovid: n,
      pidkazka: 'Куб — це число, помножене на себе тричі. Перебирай по черзі 2, 3, 4, …',
      rozviazok: `$${n}^3 = ${n} \\cdot ${n} \\cdot ${n} = ${n ** 3}$`,
    };
  }
  const x = r.vybir(BUKVY);
  const k = r.chyslo(2, 6);
  return {
    pytannia: 'Подай одночлен як куб. Яке число у віконці?',
    vyraz: `$${k ** 3}${x}^3 = (\\square ${x})^3$`,
    nevidome: '$\\square$',
    vidpovid: k,
    pidkazka: `${k ** 3} — куб якого числа?`,
    rozviazok: `$${k}^3 = ${k ** 3}$, тому $${k ** 3}${x}^3 = (${k}${x})^3$.`,
  };
}

// x³ ± n³ = (x ± n)(x² ∓ nx + n²) з віконцем: друге число, середній коефіцієнт або останній член.
function vikontse(r: Vypadok, zKoef: boolean): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = zKoef ? r.chyslo(2, 5) : 1;
  const n = zKoef ? r.chyslo(1, 5) : r.chyslo(2, 10);
  const plus = r.shans();
  const f = formula(k, n, plus, x);
  const mistse = r.vybir(zKoef ? ['k', 'serednii', 'serednii'] : ['druhe', 'serednii', 'serednii', 'ostannii']);
  const sq = '\\square';
  const persha = mistse === 'druhe' ? `${x} ${znak(plus)} ${sq}` : mistse === 'k' ? `${sq} ${x} ${znak(plus)} ${n}` : f.persha;
  const nepovnyi =
    mistse === 'serednii'
      ? `${kx(k * k, x, 2)} ${znak(!plus)} ${sq} ${x} + ${n * n}`
      : mistse === 'ostannii'
        ? `${x}^2 ${znak(!plus)} ${kx(n, x)} + ${sq}`
        : f.nepovnyi;
  const vidpovid = mistse === 'druhe' ? n : mistse === 'k' ? k : mistse === 'serednii' ? k * n : n * n;
  const pidkazka =
    mistse === 'serednii'
      ? k === 1
        ? 'Середній член неповного квадрата — добуток першого виразу на друге число, без подвоєння.'
        : `Середній член неповного квадрата — просто добуток ${k}${x} на ${n}, без подвоєння.`
      : mistse === 'ostannii'
        ? 'Останній член неповного квадрата — квадрат другого числа.'
        : mistse === 'k'
          ? `${k ** 3}${x}³ — куб якого одночлена?`
          : `${n ** 3} — куб якого числа?`;
  return {
    pytannia: 'Яке число треба вписати у віконце, щоб рівність була тотожністю?',
    vyraz: `$${f.kuby} = (${persha})(${nepovnyi})$`,
    nevidome: '$\\square$',
    vidpovid,
    pidkazka,
    rozviazok: `Це ${nazva(plus)}: $${k === 1 ? x : `${k ** 3}${x}^3 = (${k}${x})`}^3$, $${n ** 3} = ${n}^3$. Отже, $${f.povna}$.`,
  };
}

// Скорочене множення (kx ± n)(k²x² ∓ knx + n²): вільний член, коефіцієнт при x³ або при x² (він 0).
function dobutok(r: Vypadok, zPidstupom: boolean): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const k = zPidstupom ? r.chyslo(1, 4) : 1;
  const n = r.chyslo(1, 6);
  const plus = r.shans();
  const f = formula(k, n, plus, x);
  const shcho = zPidstupom ? r.vybir(['vilnyi', 'kub', 'kvadrat', 'kvadrat']) : 'vilnyi';
  const vidpovid = shcho === 'vilnyi' ? (plus ? n ** 3 : -(n ** 3)) : shcho === 'kub' ? k ** 3 : 0;
  const pytannia =
    shcho === 'vilnyi'
      ? 'Яке число (вільний член) вийде у відповіді?'
      : shcho === 'kub'
        ? `Який коефіцієнт при $${x}^3$ вийде у відповіді?`
        : `Який коефіцієнт при $${x}^2$ вийде у відповіді?`;
  return {
    pytannia: `Перемнож $(${f.persha})(${f.nepovnyi})$. ${pytannia}`,
    vidpovid: ch(vidpovid),
    pidkazka: `Другий множник — неповний квадрат ${plus ? 'різниці' : 'суми'}, тож добуток — ${nazva(plus)}.`,
    rozviazok: `$(${f.persha})(${f.nepovnyi}) = ${f.kuby}$. ${shcho === 'kvadrat' ? `Члени з $${x}^2$ і з $${x}$ знищуються, тому коефіцієнт при $${x}^2$ дорівнює 0.` : `Відповідь: ${ch(vidpovid)}.`}`,
  };
}

// Яка з трьох рівностей — тотожність: правильна, з 2ab, з неправильним знаком або куб суми.
function yakaRivnist(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const n = r.chyslo(2, 6);
  const plus = r.shans();
  const f = formula(1, n, plus, x);
  const khybni = r.peremishaty([
    `(${f.persha})(${x}^2 ${znak(!plus)} ${2 * n}${x} + ${n * n})`,
    `(${f.persha})(${x}^2 ${znak(plus)} ${n}${x} + ${n * n})`,
    `(${f.persha})^3`,
  ]).slice(0, 2);
  const pravylna = `(${f.persha})(${f.nepovnyi})`;
  const usi = r.peremishaty([pravylna, ...khybni]);
  const LITERY = ['А', 'Б', 'В'];
  return {
    pytannia: `Яка з рівностей — тотожність? ${usi.map((v, i) => `${LITERY[i]}) $${f.kuby} = ${v}$`).join('; ')}.`,
    vidpovid: LITERY[usi.indexOf(pravylna)],
    varianty: LITERY,
    pidkazka: `Це ${nazva(plus)}. У неповному квадраті середній член — без подвоєння, а знак у нього протилежний до знака в першій дужці.`,
    rozviazok: `Правильно: $${f.povna}$. Куб ${plus ? 'суми' : 'різниці'} — це інший вираз, а $${2 * n}${x}$ було б у повному квадраті.`,
  };
}

// Знак у віконці: «той самий — протилежний — завжди плюс».
function znakUVikontsi(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const n = r.chyslo(2, 9);
  const plus = r.shans();
  const f = formula(1, n, plus, x);
  const mistse = r.vybir(['persha', 'serednii', 'serednii', 'ostannii']);
  const sq = '\\square';
  const persha = mistse === 'persha' ? `${x} ${sq} ${n}` : f.persha;
  const nepovnyi =
    mistse === 'serednii' ? `${x}^2 ${sq} ${n}${x} + ${n * n}` : mistse === 'ostannii' ? `${x}^2 ${znak(!plus)} ${n}${x} ${sq} ${n * n}` : f.nepovnyi;
  const pravylnyi = mistse === 'persha' ? plus : mistse === 'serednii' ? !plus : true;
  const poyasnennia =
    mistse === 'persha'
      ? 'у першій дужці той самий знак, що між кубами'
      : mistse === 'serednii'
        ? 'середній член має знак, протилежний до першої дужки'
        : 'останній член неповного квадрата — завжди з плюсом';
  return {
    pytannia: 'Який знак має стояти у віконці?',
    vyraz: `$${f.kuby} = (${persha})(${nepovnyi})$`,
    vidpovid: pravylnyi ? 'плюс' : 'мінус',
    varianty: ['плюс', 'мінус'],
    pidkazka: 'Той самий — протилежний — завжди плюс.',
    rozviazok: `$${f.povna}$: ${poyasnennia}.`,
  };
}

// x⁶ ± n³ = (x² ± n)(x⁴ ∓ nx² + n²).
function stepin(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const n = r.chyslo(1, 5);
  const plus = r.shans();
  const sq = '\\square';
  return {
    pytannia: 'Яке число треба вписати у віконце, щоб рівність була тотожністю?',
    vyraz: `$${x}^6 ${znak(plus)} ${n ** 3} = (${x}^2 ${znak(plus)} ${n})(${x}^4 ${znak(!plus)} ${sq} ${x}^2 + ${n * n})$`,
    nevidome: '$\\square$',
    vidpovid: n,
    pidkazka: `$${x}^6 = (${x}^2)^3$, а ${n ** 3} — куб якого числа?`,
    rozviazok: `$${x}^6 = (${x}^2)^3$ і $${n ** 3} = ${n}^3$, тому $(${x}^2 ${znak(plus)} ${n})(${x}^4 ${znak(!plus)} ${kx(n, x, 2)} + ${n * n})$.`,
  };
}

// (a ± n)(a² ∓ na + n²) − a(a² + q) = ±n³ − qa: спростити й знайти значення.
function sproshchennia(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const n = r.chyslo(1, 5);
  const plus = r.shans();
  const q = r.krim(-9, 9, [0]);
  const v = r.krim(-5, 5, [0]);
  const f = formula(1, n, plus, x);
  const vilnyi = plus ? n ** 3 : -(n ** 3);
  const sproshcheno: Mnohochlen = [vilnyi, -q];
  const vidpovid = vilnyi - q * v;
  return {
    pytannia: `Спрости вираз і знайди його значення при $${x} = ${tz(v)}$.`,
    vyraz: `$(${f.persha})(${f.nepovnyi}) - ${x}(${x}^2 ${q < 0 ? '-' : '+'} ${Math.abs(q)})$`,
    vidpovid: ch(vidpovid),
    pidkazka: `Перший добуток — ${nazva(plus)}: $${f.kuby}$.`,
    rozviazok: `$${f.kuby} - ${x}^3 ${q < 0 ? '+' : '-'} ${kx(Math.abs(q), x)} = ${tex(sproshcheno, x)}$. При $${x} = ${tz(v)}$ маємо ${ch(vilnyi)} ${-q * v < 0 ? '−' : '+'} ${Math.abs(q * v)} = ${ch(vidpovid)}.`,
  };
}

// (x ± n)(x² ∓ nx + n²) = x³ + mx: куби знищуються, лишається лінійне рівняння.
function rivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const n = r.chyslo(1, 5);
    const plus = r.shans();
    const dilnyky = [];
    for (let d = 1; d <= 40; d++) if (n ** 3 % d === 0) dilnyky.push(d, -d);
    const m = r.vybir(dilnyky);
    const vilnyi = plus ? n ** 3 : -(n ** 3);
    const korin = vilnyi / m;
    if (Math.abs(korin) > 20) continue;
    const f = formula(1, n, plus, 'x');
    const prava = `x^3 ${m < 0 ? '-' : '+'} ${kx(Math.abs(m), 'x')}`;
    return {
      pytannia: 'Розв’яжи рівняння.',
      vyraz: `$(${f.persha})(${f.nepovnyi}) = ${prava}$`,
      vidpovid: ch(korin),
      pidkazka: `Ліва частина — ${nazva(plus)}: $${f.kuby}$. Куби з обох боків знищаться.`,
      rozviazok: `$${f.kuby} = ${prava}$, звідси ${m === 1 ? '' : `$${kx(m, 'x').replace(/^-1x$/, '-x')} = ${tz(vilnyi)}$, `}$x = ${tz(korin)}$.`,
    };
  }
}

// Значення (x ± cy)(x² ∓ cxy + c²y²) = x³ ± (cy)³ при заданих x і y.
function znachennia(r: Vypadok): TrenZavdannia {
  const c = r.vybir([2, 3]);
  const plus = r.shans();
  const xv = r.krim(-4, 4, [0]);
  const yv10 = c === 2 ? r.vybir([-10, 10, -5, 5, 20, -20]) : r.vybir([-10, 10]); // y · 10
  const cy = (c * yv10) / 10;
  const vidpovid = xv ** 3 + (plus ? 1 : -1) * cy ** 3;
  const persha = `x ${znak(plus)} ${c}y`;
  const nepovnyi = `x^2 ${znak(!plus)} ${c}xy + ${c * c}y^2`;
  return {
    pytannia: `Знайди значення виразу при $x = ${tz(xv)}$, $y = ${tdes(yv10, 1)}$.`,
    vyraz: `$(${persha})(${nepovnyi})$`,
    vidpovid: ch(vidpovid),
    pidkazka: `Це ${plus ? 'сума' : 'різниця'} кубів: $x^3 ${znak(plus)} (${c}y)^3$. Знайди спершу $${c}y$.`,
    rozviazok: `$x^3 ${znak(plus)} (${c}y)^3$, де $${c}y = ${tz(cy)}$, тому ${ch(xv ** 3)} ${(plus ? 1 : -1) * cy ** 3 < 0 ? '−' : '+'} ${Math.abs(cy ** 3)} = ${ch(vidpovid)}.`,
  };
}

export default {
  rivni: ['впізнай куби й заповни формулу', 'неповний квадрат і знаки', 'спрощуй, обчислюй, розв’язуй'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kub, (v: Vypadok) => vikontse(v, false), (v: Vypadok) => vikontse(v, false), (v: Vypadok) => dobutok(v, false)])(r);
    if (riven === 2) return r.vybir([yakaRivnist, znakUVikontsi, (v: Vypadok) => vikontse(v, true), (v: Vypadok) => dobutok(v, true)])(r);
    return r.vybir([sproshchennia, rivniannia, rivniannia, znachennia, stepin])(r);
  },
} satisfies Henerator;
