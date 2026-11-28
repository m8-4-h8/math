// Тотожні вирази. Тотожність (7 клас, Істер, алгебра § 5): чи тотожно рівні два вирази (довести перетворенням або
// спростувати одним значенням змінної), спрощення виразів тотожними перетвореннями, «що вписати, щоб рівність стала
// тотожністю», рівність, правильна лише при деяких x, і чим тотожність відрізняється від рівняння.
import { ch, des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { suma, tex, tvd, tz, znachennia, type Mnohochlen } from '../alhebra.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'p'];
const rivni = (p: Mnohochlen, q: Mnohochlen) => {
  const n = Math.max(p.length, q.length);
  for (let i = 0; i < n; i++) if ((p[i] ?? 0) !== (q[i] ?? 0)) return false;
  return true;
};
/** Значення змінної, при якому многочлени різні: шукаємо серед 0, 1, −1, 2, −2, … */
function kontrpryklad(p: Mnohochlen, q: Mnohochlen): number {
  for (const v of [0, 1, -1, 2, -2, 3, -3, 4]) if (znachennia(p, v) !== znachennia(q, v)) return v;
  throw new Error('kontrpryklad: многочлени рівні');
}
/** «x + 3», «x - 3» для формули. */
const xPlus = (x: string, a: number) => (a < 0 ? `${x} - ${-a}` : `${x} + ${a}`);
/** k(x + a) першим членом: «3(x - 2)», «-2(x + 5)». */
const duzhka = (k: number, x: string, a: number) => `${k === -1 ? '-' : tz(k)}(${xPlus(x, a)})`;
/** Той самий доданок не першим: « + 3(x - 2)», « - 2(x + 5)». */
const duzhkaDali = (k: number, x: string, a: number) => (k < 0 ? ` - ${k === -1 ? '' : -k}(${xPlus(x, a)})` : ` + ${k === 1 ? '' : k}(${xPlus(x, a)})`);

// Пари виразів: [запис А, многочлен А, запис Б, многочлен Б, чому так (для тотожних)].
type Para = [string, Mnohochlen, string, Mnohochlen, string];

function para(r: Vypadok, x: string): Para {
  const k = r.krim(-6, 6, [0, 1, -1]);
  const a = r.krim(-9, 9, [0]);
  const vyd = r.chyslo(0, 5);
  const tak = r.shans();
  if (vyd === 0) {
    return tak
      ? [duzhka(k, x, a), [k * a, k], tex([k * a, k], x), [k * a, k], 'розподільна властивість: множимо на кожен доданок у дужках']
      : [duzhka(k, x, a), [k * a, k], tex([a, k], x), [a, k], ''];
  }
  if (vyd === 1) {
    return tak
      ? [`-(${xPlus(x, -a)})`, [a, -1], tex([a, -1], x), [a, -1], 'мінус перед дужками змінює знак кожного доданка']
      : [`-(${xPlus(x, -a)})`, [a, -1], tex([-a, -1], x), [-a, -1], ''];
  }
  if (vyd === 2) {
    let [p, q] = [r.chyslo(2, 7), r.chyslo(2, 7)];
    if (p + q === p * q) q += 1;
    return tak
      ? [`${p}${x} + ${q}${x}`, [0, p + q], `${p + q}${x}`, [0, p + q], 'подібні доданки: додаємо коефіцієнти']
      : [`${p}${x} + ${q}${x}`, [0, p + q], `${p * q}${x}`, [0, p * q], ''];
  }
  if (vyd === 3) {
    return tak ? [`${x} + ${x}`, [0, 2], `2${x}`, [0, 2], 'x + x — це два рази по x'] : [`${x} + ${x}`, [0, 2], `${x}^2`, [0, 0, 1], ''];
  }
  if (vyd === 4) {
    const c = Math.abs(a);
    return tak
      ? [`${c} - ${x}`, [c, -1], `-${x} + ${c}`, [c, -1], 'переставна властивість додавання: доданки поміняли місцями разом зі знаками']
      : [`${c} - ${x}`, [c, -1], `${x} - ${c}`, [-c, 1], ''];
  }
  return tak ? [`${x} \\cdot ${x}`, [0, 0, 1], `${x}^2`, [0, 0, 1], 'добуток двох однакових множників — квадрат'] : [`${x} \\cdot ${x}`, [0, 0, 1], `2${x}`, [0, 2], ''];
}

function chyTotozhni(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [zA, pA, zB, pB, chomu] = para(r, x);
  const tak = rivni(pA, pB);
  if (tak) {
    return {
      pytannia: `Чи тотожно рівні вирази $${zA}$ і $${zB}$?`,
      vidpovid: 'так',
      varianty: ['так', 'ні'],
      pidkazka: 'Перетвори перший вираз (розкрий дужки, зведи подібні) і порівняй з другим.',
      rozviazok: `Так: $${zA} = ${tex(pA, x)}$ — ${chomu}.`,
    };
  }
  const v = kontrpryklad(pA, pB);
  return {
    pytannia: `Чи тотожно рівні вирази $${zA}$ і $${zB}$?`,
    vidpovid: 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Підстав якесь число, наприклад ${x} = ${v === 0 ? 3 : v}, в обидва вирази.`,
    rozviazok: `Ні: при ${x} = ${ch(v)} перший вираз дорівнює ${ch(znachennia(pA, v))}, а другий — ${ch(znachennia(pB, v))}. Одного такого значення досить.`,
  };
}

// Спрости k1(x + a) ± k2(x + b): коефіцієнт при x або вільний член.
function sproshchennia(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [k1, k2] = [r.krim(-6, 6, [0, 1, -1]), r.krim(-6, 6, [0])];
  const [a, b] = [r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
  const rez = suma([k1 * a, k1], [k2 * b, k2]);
  if (rez[1] === 0 || rez[0] === 0) return sproshchennia(r);
  const zaX = r.shans();
  const zapys = `${duzhka(k1, x, a)}${duzhkaDali(k2, x, b)}`;
  const druhyi = tex([k2 * b, k2], x);
  return {
    pytannia: `Спрости вираз $${zapys}$. ${zaX ? `Який коефіцієнт при $${x}$?` : 'Який вільний член (число без букви)?'}`,
    vidpovid: ch(zaX ? rez[1] : rez[0]),
    pidkazka: 'Розкрий обидві дужки (мінус перед дужками змінює знаки), потім зведи подібні доданки.',
    rozviazok: `$${zapys} = ${tex([k1 * a, k1], x)} ${druhyi.startsWith('-') ? `- ${druhyi.slice(1)}` : `+ ${druhyi}`} = ${tex(rez, x)}$`,
  };
}

// −2,5x · 4: коефіцієнт добутку.
function dobutok(r: Vypadok): TrenZavdannia {
  const [x, y] = r.rizni(2, 0, BUKVY.length - 1).map((i) => BUKVY[i]);
  const a10 = r.krim(-35, 35, [0, -30, -20, -10, 10, 20, 30]);
  const b = r.krim(-8, 8, [0, 1, -1]);
  const druha = r.shans();
  const k10 = a10 * b;
  return {
    pytannia: `Спрости вираз $${tdes(a10, 1)}${x} \\cdot ${b < 0 ? `(${tz(b)}${druha ? y : ''})` : `${b}${druha ? y : ''}`}$. Який коефіцієнт вийде?`,
    vidpovid: des(k10, 1),
    pidkazka: 'Переставна і сполучна властивості: множимо числа окремо, букви — окремо.',
    rozviazok: `${a10 < 0 ? `(${des(a10, 1)})` : des(a10, 1)} · ${tvd(b)} = ${des(k10, 1)}; вираз дорівнює ${des(k10, 1)}${x}${druha ? y : ''}.`,
  };
}

// Що вписати у віконце, щоб рівність була тотожністю.
function vikontse(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [k1, k2] = [r.krim(-6, 6, [0, 1, -1]), r.krim(-6, 6, [0])];
  const [a, b] = [r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
  const rez = suma([k1 * a, k1], [k2 * b, k2]);
  if (rez[1] === 0 || rez[0] === 0) return vikontse(r);
  const zapys = `${duzhka(k1, x, a)}${duzhkaDali(k2, x, b)}`;
  const shukaiemoX = r.shans(0.4);
  const prava = shukaiemoX ? `\\square ${x}${rez[0] < 0 ? ` - ${-rez[0]}` : ` + ${rez[0]}`}` : `${tex([0, rez[1]], x)} + \\square`;
  return {
    pytannia: 'Яке число треба вписати у віконце, щоб рівність була тотожністю?',
    vyraz: `$${zapys} = ${prava}$`,
    nevidome: '$\\square$',
    vidpovid: ch(shukaiemoX ? rez[1] : rez[0]),
    pidkazka: 'Спрости ліву частину: розкрий дужки і зведи подібні. Потім порівняй з правою.',
    rozviazok: `Ліва частина дорівнює $${tex(rez, x)}$, тому у віконці ${ch(shukaiemoX ? rez[1] : rez[0])}.`,
  };
}

// x² = sx − p правильна лише при двох значеннях x.
function lyshePryDeiakykh(r: Vypadok): TrenZavdannia {
  const [r1, r2] = r.rizni(2, -4, 5);
  const s = r1 + r2;
  const p = r1 * r2;
  const r3 = r.krim(-4, 5, [r1, r2]);
  const prava = tex([-p, s], 'x');
  const vals = r.peremishaty([r1, r2, r3]);
  return {
    pytannia: `Підстав по черзі $x = ${tz(vals[0])}$, $x = ${tz(vals[1])}$, $x = ${tz(vals[2])}$ у рівність $x^2 = ${prava}$. При якому з цих значень рівність неправильна?`,
    vidpovid: ch(r3),
    varianty: vals.map(ch),
    pidkazka: 'Обчисли ліву і праву частини для кожного значення окремо.',
    rozviazok: `При x = ${ch(r1)} обидві частини дорівнюють ${r1 * r1}, при x = ${ch(r2)} — ${r2 * r2}. А при x = ${ch(r3)} ліва частина ${r3 * r3}, права ${ch(s * r3 - p)}. Рівність правильна лише при деяких x — це не тотожність.`,
  };
}

// Тотожність чи рівняння: скільки коренів.
function skilkyKoreniv(r: Vypadok): TrenZavdannia {
  const x = 'x';
  const k = r.krim(-6, 6, [0, 1, -1]);
  const a = r.krim(-9, 9, [0]);
  const vyd = r.chyslo(0, 2);
  const liva = duzhka(k, x, a);
  if (vyd === 0) {
    return {
      pytannia: `Скільки коренів має рівняння $${liva} = ${tex([k * a, k], x)}$?`,
      vidpovid: 'безліч',
      varianty: ['жодного', 'один', 'безліч'],
      pidkazka: 'Розкрий дужки в лівій частині і порівняй з правою.',
      rozviazok: `Ліва частина дорівнює ${tex([k * a, k], x).replace(/-/g, '−')} — це тотожність: рівність правильна при будь-якому x, коренів безліч.`,
    };
  }
  if (vyd === 1) {
    const b = r.krim(-20, 20, [k * a, 0]);
    return {
      pytannia: `Скільки коренів має рівняння $${liva} = ${tex([b, k], x)}$?`,
      vidpovid: 'жодного',
      varianty: ['жодного', 'один', 'безліч'],
      pidkazka: 'Розкрий дужки і перенеси члени з x в одну частину.',
      rozviazok: `${tex([k * a, k], x).replace(/-/g, '−')} = ${tex([b, k], x).replace(/-/g, '−')}: члени з x скорочуються, а ${ch(k * a)} ≠ ${ch(b)}: рівність неправильна при будь-якому x. Коренів немає.`,
    };
  }
  const m = r.krim(-6, 6, [0, k]);
  const b = r.krim(-20, 20, [0]);
  return {
    pytannia: `Скільки коренів має рівняння $${liva} = ${tex([b, m], x)}$?`,
    vidpovid: 'один',
    varianty: ['жодного', 'один', 'безліч'],
    pidkazka: 'Розкрий дужки і порівняй коефіцієнти при x у двох частинах.',
    rozviazok: `Коефіцієнти при x різні (${ch(k)} і ${ch(m)}), тому після перенесення лишається ${ch(k - m)}x = ${ch(b - k * a)} — один корінь.`,
  };
}

// Обидві частини зводяться до одного вигляду: знайди вільний член.
function obydviChastyny(r: Vypadok): TrenZavdannia {
  const x = r.vybir(BUKVY);
  const [k1, k2] = [r.chyslo(2, 6), r.chyslo(2, 6)];
  const [a, b] = [r.krim(-9, 9, [0]), r.krim(-9, 9, [0])];
  const liva = suma([k1 * a, k1], [k2 * b, k2]);
  const m = k1 + k2;
  const c = r.krim(-9, 9, [0]);
  const e = liva[0] - m * c;
  if (e === 0 || liva[0] === 0) return obydviChastyny(r);
  const zapysL = `${duzhka(k1, x, a)}${duzhkaDali(k2, x, b)}`;
  const zapysP = `${duzhka(m, x, c)}${e < 0 ? ` - ${-e}` : ` + ${e}`}`;
  return {
    pytannia: `Доведи тотожність $${zapysL} = ${zapysP}$: спрости обидві частини. Який вільний член вийде в кожній?`,
    vidpovid: ch(liva[0]),
    pidkazka: 'Розкрий дужки в кожній частині окремо і зведи подібні.',
    rozviazok: `Ліва: $${tex(liva, x)}$. Права: $${tex([m * c, m], x)} ${e < 0 ? '-' : '+'} ${Math.abs(e)} = ${tex(liva, x)}$. Однаковий вигляд — рівність є тотожністю.`,
  };
}

export default {
  rivni: ['тотожні чи ні', 'спрости і впиши', 'доведи і спростуй'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chyTotozhni, chyTotozhni, chyTotozhni, dobutok])(r);
    if (riven === 2) return r.vybir([sproshchennia, sproshchennia, vikontse, vikontse, dobutok])(r);
    return r.vybir([lyshePryDeiakykh, skilkyKoreniv, skilkyKoreniv, obydviChastyny, vikontse])(r);
  },
} satisfies Henerator;
