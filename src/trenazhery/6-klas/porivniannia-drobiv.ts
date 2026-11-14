// Порівняння дробів (Істер § 4): однакові знаменники, однакові чисельники, різні знаменники через спільний
// знаменник, порівняння з половиною, мішані числа, задачі «хто більше», порядок зростання.
import { dviOsoby, neskorotnyiChyselnyk, nsk, rid, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ZNAKY = ['>', '<', '='];
const znak = (x: number, y: number) => (x > y ? '>' : x < y ? '<' : '=');

function odnakoviZnam(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(5, 20);
  const [a, c] = r.rizni(2, 1, b + 3);
  return {
    pytannia: 'Порівняй дроби.',
    vyraz: `$${tdrib(a, b)}$ □ $${tdrib(c, b)}$`,
    vidpovid: znak(a, c),
    varianty: ZNAKY,
    pidkazka: 'Знаменники однакові — порівняй чисельники.',
    rozviazok: `Знаменники однакові, ${a} ${znak(a, c)} ${c}, тож $${tdrib(a, b)} ${znak(a, c)} ${tdrib(c, b)}$.`,
  };
}

function odnakoviChys(r: Vypadok): TrenZavdannia {
  const [b, d] = r.rizni(2, 3, 15);
  const a = r.chyslo(1, Math.min(b, d) - 1);
  const z = znak(d, b); // більший той, у кого менший знаменник
  return {
    pytannia: 'Порівняй дроби.',
    vyraz: `$${tdrib(a, b)}$ □ $${tdrib(a, d)}$`,
    vidpovid: z,
    varianty: ZNAKY,
    pidkazka: 'Чисельники однакові. У якого дробу шматочки більші?',
    rozviazok: `Чисельники однакові, а знаменник ${b} ${b < d ? 'менший' : 'більший'} за ${d} — шматочки ${b < d ? 'більші' : 'менші'}: $${tdrib(a, b)} ${z} ${tdrib(a, d)}$.`,
  };
}

function rizni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 15);
    const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
    if (Math.abs(a / b - c / d) > 0.2) continue; // близькі дроби — на око не видно
    const s = nsk(b, d);
    if (s > 90) continue;
    const [x, y] = [(a * s) / b, (c * s) / d];
    return {
      pytannia: 'Порівняй дроби.',
      vyraz: `$${tdrib(a, b)}$ □ $${tdrib(c, d)}$`,
      vidpovid: znak(x, y),
      varianty: ZNAKY,
      pidkazka: `Зведи до спільного знаменника ${s}.`,
      rozviazok: `$${tdrib(a, b)} = ${tdrib(x, s)}$, $${tdrib(c, d)} = ${tdrib(y, s)}$; ${x} ${znak(x, y)} ${y}, тож $${tdrib(a, b)} ${znak(x, y)} ${tdrib(c, d)}$.`,
    };
  }
}

function zPolovynoiu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 7, 19);
    const a = neskorotnyiChyselnyk(r, b);
    const c = neskorotnyiChyselnyk(r, d);
    if (!(2 * a < b && 2 * c > d)) continue;
    if (nsk(b, d) <= 60) continue; // великий спільний знаменник — тут зручніше через половину
    const naopaky = r.shans();
    const [l, p] = naopaky ? [[c, d], [a, b]] : [[a, b], [c, d]];
    const z = naopaky ? '>' : '<';
    return {
      pytannia: 'Порівняй дроби. Підказка: порівняй кожен з половиною.',
      vyraz: `$${tdrib(l[0], l[1])}$ □ $${tdrib(p[0], p[1])}$`,
      vidpovid: z,
      varianty: ZNAKY,
      pidkazka: `Половина від ${b} — це ${b / 2}, а від ${d} — ${d / 2}.`.replace(/\./g, ','),
      rozviazok: `$${tdrib(a, b)} < \\frac{1}{2}$, бо ${a} менше за половину від ${b}; $${tdrib(c, d)} > \\frac{1}{2}$, бо ${c} більше за половину від ${d}. Тож $${tdrib(l[0], l[1])} ${z} ${tdrib(p[0], p[1])}$.`,
    };
  }
}

function mishani(r: Vypadok): TrenZavdannia {
  const [b, d] = r.rizni(2, 2, 12);
  const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
  const t1 = r.chyslo(1, 9);
  const t2 = r.shans(0.6) ? t1 : r.krim(1, 9, [t1]);
  const s = nsk(b, d);
  const [x, y] = [(a * s) / b, (c * s) / d];
  const z = t1 !== t2 ? znak(t1, t2) : znak(x, y);
  return {
    pytannia: 'Порівняй мішані числа.',
    vyraz: `$${t1}${tdrib(a, b)}$ □ $${t2}${tdrib(c, d)}$`,
    vidpovid: z,
    varianty: ZNAKY,
    pidkazka: t1 !== t2 ? 'Спершу порівняй цілі частини.' : `Цілі частини однакові — порівняй дробові через знаменник ${s}.`,
    rozviazok:
      t1 !== t2
        ? `Цілі частини ${t1} ${z} ${t2}, тож $${t1}${tdrib(a, b)} ${z} ${t2}${tdrib(c, d)}$.`
        : `Цілі однакові; $${tdrib(a, b)} = ${tdrib(x, s)}$, $${tdrib(c, d)} = ${tdrib(y, s)}$, тож $${t1}${tdrib(a, b)} ${z} ${t2}${tdrib(c, d)}$.`,
  };
}

const DII: [string, string, string, string, string][] = [
  ['прочитав', 'прочитала', 'книжки', 'такої самої книжки', 'прочитав більше'],
  ['пофарбував', 'пофарбувала', 'паркану', 'такого самого паркану', 'пофарбував більше'],
  ['пройшов', 'пройшла', 'маршруту', 'того самого маршруту', 'пройшов більше'],
];

function khto(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 3, 12);
    const [a, c] = [neskorotnyiChyselnyk(r, b), neskorotnyiChyselnyk(r, d)];
    if (a * d === c * b || Math.abs(a / b - c / d) > 0.25) continue;
    const [o1, o2] = dviOsoby(r);
    const [cholov, zhin, shcho, shchoTe, pytannia] = r.vybir(DII);
    const s = nsk(b, d);
    const [x, y] = [(a * s) / b, (c * s) / d];
    const kraschyi = x > y ? o1.imia : o2.imia;
    return {
      pytannia: `${o1.imia} ${rid(o1, cholov, zhin)} $${tdrib(a, b)}$ ${shcho}, а ${o2.imia} — $${tdrib(c, d)}$ ${shchoTe}. Хто ${pytannia}?`,
      vidpovid: kraschyi,
      varianty: [o1.imia, o2.imia, 'однаково'],
      pidkazka: `Зведи $${tdrib(a, b)}$ і $${tdrib(c, d)}$ до знаменника ${s}.`,
      rozviazok: `$${tdrib(a, b)} = ${tdrib(x, s)}$, $${tdrib(c, d)} = ${tdrib(y, s)}$; ${x} ${znak(x, y)} ${y} — більше ${kraschyi}.`,
    };
  }
}

function poriadok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const zn = r.rizni(3, 2, 10);
    const droby = zn.map((b) => [neskorotnyiChyselnyk(r, b), b] as [number, number]);
    const znach = droby.map(([a, b]) => a / b);
    if (new Set(znach).size < 3) continue;
    const s = nsk(nsk(zn[0], zn[1]), zn[2]);
    if (s > 60) continue;
    const zapys = (p: number[]) => p.map((i) => `${droby[i][0]}/${droby[i][1]}`).join(', ');
    const pravylnyi = [0, 1, 2].sort((i, j) => znach[i] - znach[j]);
    const inshi = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ].filter((p) => p.join() !== pravylnyi.join());
    const varianty = r.peremishaty([zapys(pravylnyi), ...r.peremishaty(inshi).slice(0, 2).map(zapys)]);
    return {
      pytannia: `Розташуй дроби ${droby.map(([a, b]) => `$${tdrib(a, b)}$`).join(', ')} у порядку зростання.`,
      vidpovid: zapys(pravylnyi),
      varianty,
      pidkazka: `Зведи всі три дроби до знаменника ${s}.`,
      rozviazok: droby.map(([a, b]) => `$${tdrib(a, b)} = ${tdrib((a * s) / b, s)}$`).join(', ') + '.',
    };
  }
}

export default {
  rivni: ['однакові знаменники або чисельники', 'різні знаменники', 'через половину, мішані числа, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([odnakoviZnam, odnakoviChys])(r);
    if (riven === 2) return r.vybir([rizni, rizni, odnakoviChys])(r);
    return r.vybir([zPolovynoiu, mishani, khto, poriadok, rizni])(r);
  },
} satisfies Henerator;
