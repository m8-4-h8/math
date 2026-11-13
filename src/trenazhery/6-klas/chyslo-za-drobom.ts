// Знаходження числа за значенням його дробу (Істер § 13): ділимо значення на дріб — натуральні, дробові,
// мішані й десяткові значення; дріб більший за 1; задачі «залишилось» і «за два дні»; множити чи ділити.
import {
  ch,
  nsd,
  osoba,
  rid,
  skilky,
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

const dorivniuie = (m: number, n: number) => (m === 1 && n !== 1 ? 'дорівнює' : 'дорівнюють');

/** Дріб для формули; знаменник 1 — просто ціле. */
const td = (p: number, q: number) => (q === 1 ? String(p) : tdrib(p, q));

/** Дріб m/n, частіше з чисельником більшим за 1. */
function chastka(r: Vypadok, vid: number, do_: number) {
  for (;;) {
    const n = r.chyslo(vid, do_);
    const m = neskorotnyiChyselnyk(r, n);
    if (m > 1 || r.shans(0.3)) return [m, n];
  }
}

function naturalne(r: Vypadok): TrenZavdannia {
  const [m, n] = chastka(r, 2, 12);
  const k = r.chyslo(2, 15);
  const [b, x] = [m * k, n * k];
  return {
    pytannia: r.shans(0.6) ? `$${tdrib(m, n)}$ числа ${dorivniuie(m, n)} ${b}. Знайди це число.` : `Знайди число, $${tdrib(m, n)}$ якого ${dorivniuie(m, n)} ${b}.`,
    vidpovid: x,
    pidkazka: `Шукаємо ціле за частиною — ділимо: ${b} : $${tdrib(m, n)}$.`,
    rozviazok: `$${b} : ${tdrib(m, n)} = ${b} \\cdot ${td(n, m)} = ${x}$`,
  };
}

function bilsheOdnoho(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 6);
  const a = neskorotnyiChyselnyk(r, n);
  const m = n + a; // 1 a/n = m/n
  const k = r.chyslo(2, 9);
  const [b, x] = [m * k, n * k];
  return {
    pytannia: `$1${tdrib(a, n)}$ числа дорівнюють ${b}. Знайди це число.`,
    vidpovid: x,
    pidkazka: `$1${tdrib(a, n)} = ${tdrib(m, n)}$ — більше за 1, тож шукане число менше за ${b}.`,
    rozviazok: `$${b} : 1${tdrib(a, n)} = ${b} : ${tdrib(m, n)} = ${b} \\cdot ${tdrib(n, m)} = ${x}$`,
  };
}

function drobove(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [m, n] = chastka(r, 2, 9);
    const q = r.chyslo(2, 9);
    const p = r.chyslo(1, 3 * q);
    if (nsd(p, q) !== 1) continue;
    const [vp, vq] = skorotyty(p * m, q * n); // значення дробу
    if (vq === 1 || (vp === p && vq === q)) continue;
    const mishane = vp > vq && r.shans(0.6);
    const zapys = mishane ? tvidpovidDrib(vp, vq) : `${tdrib(vp, vq)}`;
    return {
      pytannia: `$${tdrib(m, n)}$ числа ${dorivniuie(m, n)} $${zapys}$. Знайди це число.`,
      vidpovid: vidpovidDrib(p, q),
      pokaz: `$${tvidpovidDrib(p, q)}$`,
      perevirka: rivnyiDrib(p, q),
      pidkazka: `Поділи $${zapys}$ на $${tdrib(m, n)}$: помнож на $${td(n, m)}$.`,
      rozviazok: `$${mishane ? `${zapys} = ${tdrib(vp, vq)}$; $` : ''}${tdrib(vp, vq)} : ${tdrib(m, n)} = ${tdrib(vp, vq)} \\cdot ${td(n, m)} = ${tdrib(vp * n, vq * m)}${
        vp * n !== p || vq * m !== q || p > q ? ` = ${tvidpovidDrib(p, q)}` : ''
      }$`,
    };
  }
}

function desiatkove(r: Vypadok): TrenZavdannia {
  const [d, znakiv] = r.vybir([
    [2, 1], [3, 1], [4, 1], [6, 1], [7, 1], [8, 1], [9, 1], [25, 2], [75, 2], [15, 2], [35, 2],
  ] as const);
  const x = r.chyslo(2, 30);
  const v = x * d;
  if (v % 10 ** znakiv === 0 && r.shans(0.7)) return desiatkove(r);
  return {
    pytannia: `$${tdes(d, znakiv)}$ числа дорівнюють $${tdes(v, znakiv)}$. Знайди це число.`,
    vidpovid: x,
    pidkazka: `Поділи $${tdes(v, znakiv)}$ на $${tdes(d, znakiv)}$. Перенеси кому в обох числах на ${znakiv === 1 ? 'один знак' : 'два знаки'} праворуч.`,
    rozviazok: `$${tdes(v, znakiv)} : ${tdes(d, znakiv)} = ${ch(v)} : ${d} = ${x}$`,
  };
}

const ZALYSHOK: { tekst: (r: Vypadok, d: string, b: number) => string; odynytsi: string; min: number; max: number }[] = [
  {
    tekst: (r, d, b) => {
      const o = osoba(r);
      return `${o.imia} ${rid(o, 'прочитав', 'прочитала')} ${d} книжки, і ${rid(o, 'йому', 'їй')} залишилося прочитати ${skilky(b, 'сторінку', 'сторінки', 'сторінок')}. Скільки сторінок у книжці?`;
    },
    odynytsi: 'с.',
    min: 60,
    max: 400,
  },
  { tekst: (_, d, b) => `Туристи пройшли ${d} маршруту, і їм залишилося пройти ${b} км. Яка довжина маршруту?`, odynytsi: 'км', min: 12, max: 120 },
  { tekst: (_, d, b) => `Фермер засіяв ${d} поля, і йому залишилося засіяти ${b} га. Яка площа поля?`, odynytsi: 'га', min: 20, max: 300 },
  { tekst: (_, d, b) => `Бригада відремонтувала ${d} дороги, і їй залишилося відремонтувати ${b} км. Яка довжина дороги?`, odynytsi: 'км', min: 10, max: 90 },
];

function zalyshok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const z = r.vybir(ZALYSHOK);
    const n = r.chyslo(3, 12);
    const m = neskorotnyiChyselnyk(r, n);
    const x = n * r.chyslo(1, 40);
    if (x < z.min || x > z.max) continue;
    const zal = n - m;
    const b = (x / n) * zal;
    const [zp, zq] = skorotyty(zal, n);
    return {
      pytannia: z.tekst(r, `$${tdrib(m, n)}$`, b),
      vidpovid: x,
      odynytsi: z.odynytsi,
      pidkazka: `${b} — це не $${tdrib(m, n)}$, а решта: $1 - ${tdrib(m, n)}$.`,
      rozviazok: `Залишилось $1 - ${tdrib(m, n)} = ${tdrib(zp, zq)}$; $\\;${b} : ${tdrib(zp, zq)} = ${x}$ (${z.odynytsi})`,
    };
  }
}

function dvaDni(r: Vypadok): TrenZavdannia {
  for (;;) {
    const n = r.vybir([4, 5, 6, 8, 9, 10, 12]);
    const [m1, m2] = [r.chyslo(1, n - 2), r.chyslo(1, n - 2)];
    if (m1 + m2 >= n) continue;
    const x = n * r.chyslo(2, 15);
    if (x < 12 || x > 150) continue;
    const [a1, b1] = skorotyty(m1, n);
    const [a2, b2] = skorotyty(m2, n);
    const [sp, sq] = skorotyty(m1 + m2, n);
    const b = (x / n) * (m1 + m2);
    return {
      pytannia: `Першого дня туристи пройшли $${tdrib(a1, b1)}$ маршруту, а другого — $${tdrib(a2, b2)}$ маршруту. За два дні вони пройшли ${b} км. Яка довжина маршруту?`,
      vidpovid: x,
      odynytsi: 'км',
      pidkazka: 'Спершу знайди, яку частину маршруту пройшли за два дні.',
      rozviazok: `$${tdrib(a1, b1)} + ${tdrib(a2, b2)} = ${tdrib(sp, sq)}$ маршруту; $\\;${b} : ${tdrib(sp, sq)} = ${x}$ (км)`,
    };
  }
}

/** Пари задач: відома частина (ділимо) і відоме ціле (множимо). */
const YAKA_DIIA: { tsile: (a: number, d: string) => string; chastyna: (a: number, d: string) => string; min: number; max: number }[] = [
  {
    chastyna: (a, d) => `У саду ${skilky(a, 'яблуня', 'яблуні', 'яблунь')} — це ${d} усіх дерев. Скільки дерев у саду?`,
    tsile: (a, d) => `У саду ${skilky(a, 'дерево', 'дерева', 'дерев')}, ${d} з них — яблуні. Скільки яблунь у саду?`,
    min: 12,
    max: 200,
  },
  {
    chastyna: (a, d) => `Мама витратила ${a} грн — це ${d} її грошей. Скільки гривень було в мами?`,
    tsile: (a, d) => `У мами було ${a} грн. Вона витратила ${d} грошей. Скільки гривень вона витратила?`,
    min: 50,
    max: 1000,
  },
  {
    chastyna: (a, d) => `У класі ${skilky(a, 'дівчинка', 'дівчинки', 'дівчаток')} — це ${d} усіх учнів. Скільки учнів у класі?`,
    tsile: (a, d) => `У класі ${skilky(a, 'учень', 'учні', 'учнів')}, ${d} з них — дівчатка. Скільки дівчаток у класі?`,
    min: 15,
    max: 35,
  },
];

function yakaDiia(r: Vypadok): TrenZavdannia {
  const z = r.vybir(YAKA_DIIA);
  let [n, m, tsile] = [0, 0, 0];
  do {
    n = r.chyslo(3, 9);
    m = neskorotnyiChyselnyk(r, n);
    tsile = n * r.chyslo(2, 40);
  } while (tsile < z.min || tsile > z.max);
  const dilennia = r.shans();
  const a = dilennia ? (tsile / n) * m : tsile;
  const tekst = (dilennia ? z.chastyna : z.tsile)(a, `$${tdrib(m, n)}$`);
  const dil = `${a} : ${m}/${n}`;
  const mn = `${a} · ${m}/${n}`;
  return {
    pytannia: `${tekst} Яку дію треба виконати?`,
    vidpovid: dilennia ? dil : mn,
    varianty: [mn, dil],
    pidkazka: dilennia ? 'Відома частина, шукаємо ціле.' : 'Відоме ціле, шукаємо його частину.',
    rozviazok: dilennia
      ? `Шукаємо ціле за частиною — ділимо: $${a} : ${tdrib(m, n)} = ${(a / m) * n}$`
      : `Шукаємо частину від цілого — множимо: $${a} \\cdot ${tdrib(m, n)} = ${(a / n) * m}$`,
  };
}

export default {
  rivni: ['значення — натуральне число', 'значення — дріб або десятковий дріб', 'задачі: «залишилось», «за два дні»'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? naturalne(r) : bilsheOdnoho(r);
    if (riven === 2) return r.vybir([drobove, drobove, desiatkove])(r);
    return r.vybir([zalyshok, zalyshok, dvaDni, yakaDiia])(r);
  },
} satisfies Henerator;
