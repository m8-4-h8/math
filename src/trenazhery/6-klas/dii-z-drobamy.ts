// Усі дії зі звичайними і десятковими дробами (Істер § 14): переходимо до одного запису — десяткового, якщо
// всі дроби в дії записуються скінченними десятковими, інакше звичайного; вирази в дві дії; «на» і «у … разів»;
// рівняння з невідомим доданком, зменшуваним, від'ємником; задачі.
import {
  des,
  nsk,
  skorotyty,
  tdes,
  tdrib,
  tvidpovidDrib,
  vidpovidDrib,
  rivnyiDrib,
  neskorotnyiChyselnyk,
  type Henerator,
  type Vypadok,
  type TrenZavdannia,
} from '../dopomoha.ts';

type Q = [number, number]; // p/q, нескоротний, q > 0
type Dija = '+' | '-' | '·' | ':';

/** Число в завданні: значення і як воно записане (d — десятковий, z — звичайний дріб, m — мішане, c — ціле). */
interface Ch {
  v: Q;
  zapys: string;
  vyd: 'd' | 'z' | 'm' | 'c';
}

const TZNAK: Record<Dija, string> = { '+': '+', '-': '-', '·': '\\cdot', ':': ':' };

/** Скінченний десятковий запис (до 3 знаків): [ціле, знаків] або undefined. */
function desOf([p, q]: Q): [number, number] | undefined {
  for (let k = 0; k <= 3; k++) if ((p * 10 ** k) % q === 0) return [(p * 10 ** k) / q, k];
  return undefined;
}

const tq = ([p, q]: Q) => (q === 1 ? String(p) : tdrib(p, q));
const td = (x: Q) => {
  const [c, k] = desOf(x)!;
  return tdes(c, k);
};

function obchyslyty([a, b]: Q, dija: Dija, [c, d]: Q): Q {
  if (dija === '+') return skorotyty(a * d + c * b, b * d);
  if (dija === '-') return skorotyty(a * d - c * b, b * d);
  if (dija === '·') return skorotyty(a * c, b * d);
  return skorotyty(a * d, b * c);
}

/** Одна дія з поясненням: обираємо десятковий чи звичайний запис і пишемо ланцюжок рівностей. */
function krok(a: Ch, dija: Dija, b: Ch): { rez: Ch; tex: string; desiatkovyi: boolean } {
  const rez = obchyslyty(a.v, dija, b.v);
  const z = TZNAK[dija];
  const chastyny = [`${a.zapys} ${z} ${b.zapys}`];
  const desiatkovyi = (a.vyd === 'd' || b.vyd === 'd') && !!desOf(a.v) && !!desOf(b.v) && !!desOf(rez);
  if (desiatkovyi) {
    const [pa, pb] = [td(a.v), td(b.v)];
    if (pa !== a.zapys || pb !== b.zapys) chastyny.push(`${pa} ${z} ${pb}`);
    chastyny.push(td(rez));
    return { rez: { v: rez, zapys: td(rez), vyd: rez[1] === 1 ? 'c' : 'd' }, tex: chastyny.join(' = '), desiatkovyi };
  }
  const [fa, fb] = [tq(a.v), tq(b.v)];
  if (fa !== a.zapys || fb !== b.zapys) chastyny.push(`${fa} ${z} ${fb}`);
  let syryi: Q;
  const [[p1, q1], [p2, q2]] = [a.v, b.v];
  if (dija === '+' || dija === '-') {
    const n = nsk(q1, q2);
    const [x, y] = [(p1 * n) / q1, (p2 * n) / q2];
    if (q1 !== q2) chastyny.push(`${tdrib(x, n)} ${z} ${tdrib(y, n)}`);
    syryi = [dija === '+' ? x + y : x - y, n];
  } else if (dija === '·') {
    syryi = [p1 * p2, q1 * q2];
  } else {
    chastyny.push(`${fa} \\cdot ${tq([q2, p2])}`);
    syryi = [p1 * q2, q1 * p2];
  }
  if (syryi[1] !== 1 && (syryi[0] !== rez[0] || syryi[1] !== rez[1] || rez[1] === 1)) chastyny.push(tdrib(syryi[0], syryi[1]));
  const kinets = tvidpovidDrib(rez[0], rez[1]);
  if (chastyny.at(-1) !== kinets) chastyny.push(kinets);
  return { rez: { v: rez, zapys: tq(rez), vyd: rez[1] === 1 ? 'c' : 'z' }, tex: chastyny.join(' = '), desiatkovyi };
}

/** Відповідь: десятковим записом першим, якщо рахували десятковими. */
function vidpovid([p, q]: Q, desiatkovyi: boolean): Pick<TrenZavdannia, 'vidpovid' | 'pokaz' | 'perevirka'> {
  const d = desOf([p, q]);
  const dz = d ? des(d[0], d[1]) : undefined;
  const zv = vidpovidDrib(p, q);
  if (desiatkovyi && dz) return { vidpovid: [...new Set([dz, ...zv])], perevirka: rivnyiDrib(p, q) };
  return { vidpovid: [...new Set([...zv, ...(dz ? [dz] : [])])], pokaz: `$${tvidpovidDrib(p, q)}$`, perevirka: rivnyiDrib(p, q) };
}

// ——— Випадкові числа ———

function desiatkovyi(r: Vypadok): Ch {
  if (r.shans(0.7)) {
    let c = r.chyslo(1, 45);
    while (c % 10 === 0) c = r.chyslo(1, 45);
    return { v: skorotyty(c, 10), zapys: tdes(c, 1), vyd: 'd' };
  }
  const c = r.vybir([25, 75, 125, 175, 225, 275, 35, 45, 65, 15]);
  return { v: skorotyty(c, 100), zapys: tdes(c, 2), vyd: 'd' };
}

/** Звичайний дріб або мішане число; dobryi — знаменник лише з 2 і 5 (переводиться в десятковий). */
function zvychainyi(r: Vypadok, dobryi: boolean, mishane = r.shans(0.35)): Ch {
  const q = r.vybir(dobryi ? [2, 4, 5, 8, 20] : [3, 6, 7, 9, 12, 15]);
  const p = neskorotnyiChyselnyk(r, q);
  if (!mishane) return { v: [p, q], zapys: tdrib(p, q), vyd: 'z' };
  const t = r.chyslo(1, 4);
  return { v: [t * q + p, q], zapys: `${t}${tdrib(p, q)}`, vyd: 'm' };
}

const tsile = (n: number): Ch => ({ v: [n, 1], zapys: String(n), vyd: 'c' });

function bud(r: Vypadok): Ch {
  return r.vybir([desiatkovyi, desiatkovyi, (v: Vypadok) => zvychainyi(v, true), (v: Vypadok) => zvychainyi(v, false)])(r);
}

const harnyi = ([p, q]: Q, maxQ = 60, maxP = 400) => p > 0 && q <= maxQ && p <= maxP;
const bilshe = (a: Q, b: Q) => a[0] * b[1] > b[0] * a[1];

// ——— Завдання ———

function odnaDija(r: Vypadok): TrenZavdannia {
  for (;;) {
    const dija = r.vybir<Dija>(['+', '-', '·', ':']);
    let a = zvychainyi(r, r.shans(0.55));
    let b = desiatkovyi(r);
    if (r.shans()) [a, b] = [b, a];
    if (dija === '-' && !bilshe(a.v, b.v)) [a, b] = [b, a];
    if (dija === '-' && !bilshe(a.v, b.v)) continue;
    const k = krok(a, dija, b);
    if (!harnyi(k.rez.v, 60, 200)) continue;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${a.zapys} ${TZNAK[dija]} ${b.zapys} =$`,
      ...vidpovid(k.rez.v, k.desiatkovyi),
      pidkazka: k.desiatkovyi
        ? 'Звичайний дріб тут можна записати десятковим — рахуй десятковими.'
        : 'Десятковий дріб запиши звичайним: звичайний дріб тут десятковим точно не запишеш.',
      rozviazok: `$${k.tex}$`,
    };
  }
}

function dviDii(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [x, y, zz] = [bud(r), bud(r), r.shans(0.25) ? tsile(r.chyslo(2, 6)) : bud(r)];
    if (![x, y, zz].some((c) => c.vyd === 'd') || ![x, y, zz].some((c) => c.vyd !== 'd')) continue;
    const dodavannia = r.vybir<Dija>(['+', '-']);
    const mnozhennia = r.vybir<Dija>(['·', ':']);
    const shablon = r.chyslo(0, 2);
    let k1, k2, vyraz;
    if (shablon === 0) {
      // (x ± y) · z
      k1 = krok(x, dodavannia, y);
      k2 = krok(k1.rez, mnozhennia, zz);
      vyraz = `\\left(${x.zapys} ${TZNAK[dodavannia]} ${y.zapys}\\right) ${TZNAK[mnozhennia]} ${zz.zapys}`;
    } else if (shablon === 1) {
      // x ± y · z
      k1 = krok(y, mnozhennia, zz);
      k2 = krok(x, dodavannia, k1.rez);
      vyraz = `${x.zapys} ${TZNAK[dodavannia]} ${y.zapys} ${TZNAK[mnozhennia]} ${zz.zapys}`;
    } else {
      // x · y ± z
      k1 = krok(x, mnozhennia, y);
      k2 = krok(k1.rez, dodavannia, zz);
      vyraz = `${x.zapys} ${TZNAK[mnozhennia]} ${y.zapys} ${TZNAK[dodavannia]} ${zz.zapys}`;
    }
    if (!harnyi(k1.rez.v, 40, 200) || !harnyi(k2.rez.v, 60, 300)) continue;
    return {
      pytannia: 'Обчисли.',
      vyraz: `$${vyraz} =$`,
      ...vidpovid(k2.rez.v, k2.desiatkovyi),
      pidkazka: shablon === 0 ? 'Спершу дужки. У кожній дії обери один запис: десятковий або звичайний.' : 'Спершу множення чи ділення, потім додавання чи віднімання.',
      rozviazok: `1) $${k1.tex}$; 2) $${k2.tex}$`,
    };
  }
}

function naChyU(r: Vypadok): TrenZavdannia {
  for (;;) {
    const x = r.vybir([desiatkovyi, (v: Vypadok) => zvychainyi(v, v.shans(), true), (v: Vypadok) => zvychainyi(v, v.shans(), false)])(r);
    const typ = r.chyslo(0, 3);
    if (typ <= 1) {
      const y = x.vyd === 'd' ? zvychainyi(r, r.shans(0.6)) : r.shans(0.6) ? desiatkovyi(r) : zvychainyi(r, r.shans());
      const dija: Dija = typ === 0 ? '+' : '-';
      if (dija === '-' && !bilshe(x.v, y.v)) continue;
      const k = krok(x, dija, y);
      if (!harnyi(k.rez.v)) continue;
      return {
        pytannia: `${typ === 0 ? 'Збільш' : 'Зменш'} число $${x.zapys}$ на $${y.zapys}$.`,
        ...vidpovid(k.rez.v, k.desiatkovyi),
        pidkazka: typ === 0 ? '«Збільш на» — додай.' : '«Зменш на» — відніми.',
        rozviazok: `${typ === 0 ? 'Збільшити на — додати' : 'Зменшити на — відняти'}: $${k.tex}$`,
      };
    }
    const n = r.chyslo(2, 6);
    const dija: Dija = typ === 2 ? '·' : ':';
    const k = krok(x, dija, tsile(n));
    if (!harnyi(k.rez.v)) continue;
    const razy = n < 5 ? 'рази' : 'разів';
    return {
      pytannia: `${typ === 2 ? 'Збільш' : 'Зменш'} число $${x.zapys}$ у ${n} ${razy}.`,
      ...vidpovid(k.rez.v, k.desiatkovyi || (x.vyd === 'd' && !!desOf(k.rez.v))),
      pidkazka: typ === 2 ? `«Збільш у ${n} ${razy}» — помнож на ${n}.` : `«Зменш у ${n} ${razy}» — поділи на ${n}.`,
      rozviazok: `${typ === 2 ? `Збільшити у ${n} ${razy} — помножити` : `Зменшити у ${n} ${razy} — поділити`}: $${k.tex}$`,
    };
  }
}

function rivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [a, b] = [bud(r), bud(r)];
    if (a.vyd === 'd' && b.vyd === 'd') continue;
    if (a.vyd !== 'd' && b.vyd !== 'd') continue;
    const typ = r.chyslo(0, 2);
    // 0: x + a = b → x = b − a;  1: x − a = b → x = b + a;  2: a − x = b → x = a − b
    let k;
    if (typ === 0) {
      if (!bilshe(b.v, a.v)) continue;
      k = krok(b, '-', a);
    } else if (typ === 1) {
      k = krok(b, '+', a);
    } else {
      if (!bilshe(a.v, b.v)) continue;
      k = krok(a, '-', b);
    }
    if (!harnyi(k.rez.v)) continue;
    const vyraz = [`x + ${a.zapys} = ${b.zapys}`, `x - ${a.zapys} = ${b.zapys}`, `${a.zapys} - x = ${b.zapys}`][typ];
    const yak = ['Невідомий доданок: від суми відніми відомий доданок', 'Невідоме зменшуване: до різниці додай від\'ємник', 'Невідомий від\'ємник: від зменшуваного відніми різницю'][typ];
    return {
      pytannia: 'Розв\'яжи рівняння.',
      vyraz: `$${vyraz}$`,
      ...vidpovid(k.rez.v, k.desiatkovyi),
      pidkazka: `${yak}.`,
      rozviazok: `${yak}: $${k.tex}$`,
    };
  }
}

const ZADACHI: { tekst: (a: string, b: string) => string; druhyi: string; krok1: string; odynytsi: string; bilshe: boolean }[] = [
  { tekst: (a, b) => `Кавун важить $${a}$ кг, а диня — на $${b}$ кг менше. Скільки кілограмів важать кавун і диня разом?`, druhyi: 'Диня', krok1: 'масу дині', odynytsi: 'кг', bilshe: false },
  { tekst: (a, b) => `Перша стрічка має довжину $${a}$ м, а друга — на $${b}$ м довша. Яка довжина обох стрічок разом?`, druhyi: 'Друга стрічка', krok1: 'довжину другої стрічки', odynytsi: 'м', bilshe: true },
  { tekst: (a, b) => `Першого дня туристи пройшли $${a}$ км, а другого — на $${b}$ км менше. Скільки кілометрів вони пройшли за два дні?`, druhyi: 'Другого дня', krok1: 'скільки пройшли другого дня', odynytsi: 'км', bilshe: false },
];

function zadacha(r: Vypadok): TrenZavdannia {
  for (;;) {
    const z = r.vybir(ZADACHI);
    const a: Ch = (() => {
      const c = r.chyslo(z.odynytsi === 'км' ? 80 : 30, z.odynytsi === 'км' ? 180 : 120);
      return { v: skorotyty(c * 5, 100), zapys: tdes(c * 5, 2), vyd: 'd' as const };
    })();
    if (a.v[1] === 1 && r.shans(0.7)) continue;
    const b = zvychainyi(r, r.shans(0.7));
    if (!z.bilshe && !bilshe(a.v, b.v)) continue;
    const k1 = krok(a, z.bilshe ? '+' : '-', b);
    const k2 = krok(a, '+', k1.rez);
    if (!harnyi(k2.rez.v)) continue;
    return {
      pytannia: z.tekst(a.zapys, b.zapys),
      ...vidpovid(k2.rez.v, k2.desiatkovyi),
      odynytsi: z.odynytsi,
      pidkazka: `Спершу знайди ${z.krok1}, потім додай обидва числа.`,
      rozviazok: `${z.druhyi}: $${k1.tex}$ (${z.odynytsi}); разом: $${k2.tex}$ (${z.odynytsi})`,
    };
  }
}

export default {
  rivni: ['одна дія: звичайний і десятковий дріб', 'вирази у дві дії', '«на» і «у разів», рівняння, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return odnaDija(r);
    if (riven === 2) return dviDii(r);
    return r.vybir([naChyU, naChyU, rivniannia, rivniannia, zadacha])(r);
  },
} satisfies Henerator;
