// Розподільна властивість множення (Істер § 38): множник перед дужками множимо на кожен доданок з його знаком;
// винесення спільного множника за дужки; зручні обчислення: −98 · 25 = (−100 + 2) · 25, a·m + b·m = (a + b)·m.
import { ch, des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['x', 'y', 'a', 'b', 'm', 'n'];
const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
/** Коефіцієнт перед буквою: 1 → «x», −1 → «-x», 3 → «3x». */
const koef = (k: number, b: string) => (k === 1 ? b : k === -1 ? `-${b}` : `${tz(k)}${b}`);
/** Доданок зі знаком для продовження виразу: « + 5», « - 5», « + 3x». */
const dali = (k: number, b = '') => (k < 0 ? ` - ${b ? koef(-k, b) : -k}` : ` + ${b ? koef(k, b) : k}`);
const tekst = (s: string) => s.replace(/-/g, '−');
const vd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

/** k(a·x + c): яке число на місці квадратика. */
function kvadratyk(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const k = r.krim(-9, 9, [0, 1, -1]);
  const a = r.krim(-6, 6, [0]);
  const c = r.krim(-9, 9, [0]);
  const [p1, p2] = [k * a, k * c];
  const zliva = `${tz(k)}(${koef(a, b)}${dali(c)})`;
  const rezultat = tekst(`${koef(p1, b)}${dali(p2)}`);
  if (r.shans()) {
    return {
      pytannia: 'Розкрий дужки. Яке число має стояти замість квадратика?',
      vyraz: `$${zliva} = ${koef(p1, b)} ${p2 < 0 ? '-' : '+'} \\square$`,
      vidpovid: Math.abs(p2),
      pidkazka: `Помнож ${ch(k)} на ${ch(c)} і подивись на знак.`,
      rozviazok: `${ch(k)} · ${vd(c)} = ${ch(p2)}, тож ${rezultat}.`,
    };
  }
  return {
    pytannia: `Розкрий дужки. Який коефіцієнт при ${b}?`,
    vyraz: `$${zliva} = \\square ${b}${dali(p2)}$`,
    vidpovid: ch(p1),
    pidkazka: `Помнож ${ch(k)} на ${ch(a)}.`,
    rozviazok: `${ch(k)} · ${vd(a)} = ${ch(p1)}, тож ${rezultat}.`,
  };
}

/** Вибери правильно розкриті дужки (типові помилки — серед варіантів). */
function vybir(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.vybir(BUKVY);
    const k = r.krim(-9, 9, [0, 1, -1]);
    const a = r.krim(-5, 5, [0]);
    const c = r.krim(-9, 9, [0, 1, -1]);
    const zapys = (x: number, y: number) => `${koef(x, b)}${dali(y)}`;
    const pravylno = zapys(k * a, k * c);
    const lyshePershyi = zapys(k * a, c);
    const znak = zapys(k * a, -k * c);
    const varianty = new Set([pravylno, lyshePershyi, znak]);
    if (varianty.size < 3) continue;
    return {
      pytannia: `Розкрий дужки: $${tz(k)}(${zapys(a, c)})$`,
      vidpovid: tekst(pravylno),
      varianty: r.peremishaty([...varianty].map(tekst)),
      pidkazka: `Помнож ${ch(k)} на КОЖЕН доданок, враховуючи знаки.`,
      rozviazok: `${ch(k)} · ${a === 1 ? b : a === -1 ? `(−${b})` : a < 0 ? `(${ch(a)}${b})` : `${a}${b}`} = ${tekst(koef(k * a, b))}; ${ch(k)} · ${vd(c)} = ${ch(k * c)}. Разом: ${tekst(pravylno)}.`,
    };
  }
}

/** Винеси спільний множник: k·a·x + k·c = k(a·x + c). */
function vynesty(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUKVY);
  const k = r.chyslo(2, 9);
  const a = r.krim(1, 5, []);
  const c = r.krim(-9, 9, [0]);
  const vyraz = `${koef(k * a, b)}${dali(k * c)}`;
  return {
    pytannia: 'Винеси спільний множник за дужки. Яке число замість квадратика?',
    vyraz: `$${vyraz} = ${k}(${koef(a, b)} ${c < 0 ? '-' : '+'} \\square)$`,
    vidpovid: Math.abs(c),
    pidkazka: `Поділи ${Math.abs(k * c)} на ${k}.`,
    rozviazok: `${Math.abs(k * c)} : ${k} = ${Math.abs(c)}, тож ${tekst(`${vyraz} = ${k}(${koef(a, b)}${dali(c)})`)}. Перевір, розкривши дужки.`,
  };
}

/** −98 · 25 = (−100 + 2) · 25. */
function blyzkoDoKruhloho(r: Vypadok): TrenZavdannia {
  const kruhle = r.vybir([100, 100, 1000, 50]);
  const d = r.krim(-3, 3, [0]);
  const n = -(kruhle + d); // −98, −102, −997…
  const m = r.krim(3, 25, [10, 20]);
  const p = n * m;
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `$${tz(n)} \\cdot ${m} =$`,
    vidpovid: ch(p),
    pidkazka: `${ch(n)} = ${ch(-kruhle)} ${d < 0 ? '+' : '−'} ${Math.abs(d)}. Помнож кожен доданок на ${m}.`,
    rozviazok: `(${ch(-kruhle)} ${d < 0 ? '+' : '−'} ${Math.abs(d)}) · ${m} = ${ch(-kruhle * m)} ${d < 0 ? '+' : '−'} ${Math.abs(d * m)} = ${ch(p)}`,
  };
}

/** a·m + b·m = (a + b)·m, де a + b — кругле число; m — десятковий дріб. */
function spilnyi(r: Vypadok): TrenZavdannia {
  const kruhle = r.vybir([-100, -10, 10, 100]);
  const a = Math.abs(kruhle) === 10 ? r.krim(-19, 19, [0, kruhle, 10, -10]) : r.krim(-99, 99, [0, kruhle, 50, -50, 100, -100]);
  const b = kruhle - a;
  const m = r.krim(101, 999, [200, 300, 400, 500, 600, 700, 800, 900]); // соті
  const p = kruhle * m; // у сотих
  const druhyi = b < 0 ? `- ${-b}` : `+ ${b}`;
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `$${tz(a)} \\cdot ${tdes(m, 2)} ${druhyi} \\cdot ${tdes(m, 2)} =$`,
    vidpovid: des(p, 2),
    pidkazka: `Винеси ${des(m, 2)} за дужки: (${ch(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}) · ${des(m, 2)}.`,
    rozviazok: `(${ch(a)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}) · ${des(m, 2)} = ${ch(kruhle)} · ${des(m, 2)} = ${des(p, 2)}`,
  };
}

export default {
  rivni: ['розкрий дужки з числом перед ними', 'винеси спільний множник; вибери правильну відповідь', 'обчисли зручно'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? kvadratyk(r) : vybir(r);
    if (riven === 2) return r.vybir([vynesty, vynesty, vybir, kvadratyk])(r);
    return r.vybir([blyzkoDoKruhloho, spilnyi, spilnyi, vybir])(r);
  },
} satisfies Henerator;
