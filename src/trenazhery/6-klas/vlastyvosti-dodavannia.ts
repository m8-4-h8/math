// Властивості додавання (Істер § 33): переставна і сполучна властивості, a + (−a) = 0, a + 0 = a; зручне
// обчислення суми — протилежні доданки, окремо додатні й окремо від'ємні, пари десяткових до цілого,
// дроби з однаковими знаменниками.
import { ch, des, neskorotnyiChyselnyk, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const zapys = (spysok: number[]) => spysok.map((v, i) => (i === 0 ? ch(v) : v < 0 ? `+ (${ch(v)})` : `+ ${v}`)).join(' ');

function protylezhni(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(11, 99);
  const b = r.krim(-40, 40, [0, a, -a]);
  const dodanky = r.peremishaty([a, -a, b]);
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `$${dodanky.map((v, i) => (i === 0 ? tz(v) : v < 0 ? `+ (${tz(v)})` : `+ ${v}`)).join(' ')} =$`,
    vidpovid: ch(b),
    pidkazka: `Знайди протилежні доданки: ${a} і ${ch(-a)}.`,
    rozviazok: `${a} + (${ch(-a)}) = 0, залишається ${ch(b)}.`,
  };
}

function hrupuvaty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.chyslo(4, 5);
    const dodanky = Array.from({ length: k }, () => r.krim(-30, 30, [0]));
    const dod = dodanky.filter((v) => v > 0);
    const vid = dodanky.filter((v) => v < 0);
    if (dod.length < 2 || vid.length < 2) continue;
    const [sd, sv] = [dod.reduce((x, y) => x + y, 0), vid.reduce((x, y) => x + y, 0)];
    const s = sd + sv;
    return {
      pytannia: 'Обчисли, згрупувавши окремо додатні й окремо від’ємні доданки.',
      vyraz: `$${dodanky.map((v, i) => (i === 0 ? tz(v) : v < 0 ? `+ (${tz(v)})` : `+ ${v}`)).join(' ')} =$`,
      vidpovid: ch(s),
      pidkazka: 'Склади всі додатні, потім усі від’ємні, а наприкінці додай два результати.',
      rozviazok: `${zapys(dod)} = ${sd}; ${zapys(vid)} = ${ch(sv)}; ${sd} + (${ch(sv)}) = ${ch(s)}`,
    };
  }
}

/** Десяткові доданки, що попарно дають ціле. */
function desiatkovi(r: Vypadok): TrenZavdannia {
  for (;;) {
    // пара від'ємних a + b = −ціле, і одне додатне c
    const tsile = r.chyslo(2, 9);
    const a = r.chyslo(1, tsile * 10 - 1);
    if (a % 10 === 0) continue;
    const b = tsile * 10 - a;
    const c = r.chyslo(1, 99);
    if (c % 10 === 0) continue;
    const s = c - tsile * 10;
    const poriadok = r.shans() ? [-a, c, -b] : [c, -a, -b];
    const t = (n: number) => (n < 0 ? `(-${des(-n, 1).replace(',', '{,}')})` : des(n, 1).replace(',', '{,}'));
    const pershyi = (n: number) => (n < 0 ? `-${des(-n, 1).replace(',', '{,}')}` : des(n, 1).replace(',', '{,}'));
    const x = (n: number) => (n < 0 ? `−${des(-n, 1)}` : des(n, 1));
    return {
      pytannia: 'Обчисли зручно.',
      vyraz: `$${poriadok.map((v, i) => (i === 0 ? pershyi(v) : `+ ${t(v)}`)).join(' ')} =$`,
      vidpovid: x(s),
      pidkazka: `Знайди два доданки, які разом дають ціле число: ${x(-a)} і ${x(-b)}.`,
      rozviazok: `${x(-a)} + (${x(-b)}) = ${ch(-tsile)}; ${ch(-tsile)} + ${des(c, 1)} = ${x(s)}`,
    };
  }
}

function droby(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [q1, q2] = r.rizni(2, 3, 12);
    const p1a = neskorotnyiChyselnyk(r, q1);
    const p1b = q1 - p1a; // −p1a/q1 + (−p1b/q1) = −1; теж нескоротний
    const p2 = neskorotnyiChyselnyk(r, q2);
    if (p1a === p1b && r.shans(0.7)) continue;
    const chleny = [`-${tdrib(p1a, q1)}`, tdrib(p2, q2), `\\left(-${tdrib(p1b, q1)}\\right)`, `\\left(-${tdrib(p2, q2)}\\right)`];
    return {
      pytannia: 'Обчисли зручно.',
      vyraz: `$${chleny.join(' + ')} =$`,
      vidpovid: '−1',
      pidkazka: `Знайди протилежні доданки, а дроби зі знаменником ${q1} додай окремо.`,
      rozviazok: `${p2}/${q2} + (−${p2}/${q2}) = 0; −${p1a}/${q1} + (−${p1b}/${q1}) = −${q1}/${q1} = −1.`,
    };
  }
}

/** Сума ряду 1 + (−2) + 3 + (−4) + … — парами. */
function riad(r: Vypadok): TrenZavdannia {
  const n = 2 * r.chyslo(3, 25);
  const pochatokVid = r.shans(); // −1 + 2 + (−3) + 4 + … дає +1 у кожній парі
  return {
    pytannia: `Обчисли суму, згрупувавши доданки парами: ${pochatokVid ? `$-1 + 2 + (-3) + 4 + \\ldots + (-${n - 1}) + ${n}$` : `$1 + (-2) + 3 + (-4) + \\ldots + ${n - 1} + (-${n})$`}.`,
    vidpovid: ch(pochatokVid ? n / 2 : -n / 2),
    pidkazka: `Кожна пара дає ${pochatokVid ? '1' : '−1'}. Скільки пар у числах від 1 до ${n}?`,
    rozviazok: `${pochatokVid ? '−1 + 2 = 1' : '1 + (−2) = −1'}; пар — ${n} : 2 = ${n / 2}; разом ${ch(pochatokVid ? n / 2 : -n / 2)}.`,
  };
}

export default {
  rivni: ['протилежні доданки', 'окремо додатні, окремо від’ємні', 'десяткові й дроби, суми парами'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? protylezhni(r) : hrupuvaty(r);
    if (riven === 2) return r.vybir([hrupuvaty, hrupuvaty, protylezhni])(r);
    return r.vybir([desiatkovi, desiatkovi, droby, riad])(r);
  },
} satisfies Henerator;
