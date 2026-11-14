// Приклади графіків залежностей (Істер § 47): читаємо графік температури від часу (значення за часом, час за значенням,
// найвища й найнижча, зміна) і графік руху s = v · t (відстань, час, швидкість, зупинка).
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { hrafik } from '../malunky.ts';

type Tochky = [number, number][];

/** Температура кожні `krok` годин протягом доби: випадкове блукання, є і мороз, і відлига. */
function temperatury(r: Vypadok): { tochky: Tochky; krok: number } {
  for (;;) {
    const krok = r.vybir([2, 3, 4]);
    const tochky: Tochky = [];
    let T = r.chyslo(-6, 2);
    for (let t = 0; t <= 24; t += krok) {
      tochky.push([t, T]);
      T = Math.max(-7, Math.min(7, T + r.chyslo(-3, 3)));
    }
    const ys = tochky.map((p) => p[1]);
    if (Math.min(...ys) < 0 && Math.max(...ys) > 0) return { tochky, krok };
  }
}

const malunokT = (tochky: Tochky, krok: number) => hrafik({ tochky, krokX: krok, krokY: 1, osX: 't, год', osY: 'T, °C' });

/** Скільки разів графік набуває значення y (у вузлах і між ними). */
function skilkyRaziv(tochky: Tochky, y: number) {
  let n = tochky.filter((p) => p[1] === y).length;
  for (let i = 1; i < tochky.length; i++) if ((tochky[i - 1][1] - y) * (tochky[i][1] - y) < 0) n++;
  return n;
}

function znachennia(r: Vypadok): TrenZavdannia {
  const { tochky, krok } = temperatury(r);
  const [t, T] = r.vybir(tochky);
  return {
    pytannia: `За графіком: яка температура була о ${t} год?`,
    malunok: malunokT(tochky, krok),
    vidpovid: ch(T),
    odynytsi: '°C',
    pidkazka: `Від ${t} на осі t — вертикально до графіка, потім горизонтально до осі T.`,
    rozviazok: `Точка графіка (${t}; ${ch(T)}): о ${t} год було ${ch(T)} °C.`,
  };
}

function chasZaZnachenniam(r: Vypadok): TrenZavdannia {
  for (;;) {
    const { tochky, krok } = temperatury(r);
    const typ = r.chyslo(0, 2);
    const ys = tochky.map((p) => p[1]);
    if (typ === 0 || typ === 1) {
      const shukane = typ === 0 ? Math.max(...ys) : Math.min(...ys);
      if (ys.filter((y) => y === shukane).length !== 1) continue;
      const [t] = tochky.find((p) => p[1] === shukane)!;
      return {
        pytannia: `За графіком: о котрій годині температура була ${typ === 0 ? 'найвищою' : 'найнижчою'}?`,
        malunok: malunokT(tochky, krok),
        vidpovid: t,
        odynytsi: 'год',
        pidkazka: `Знайди ${typ === 0 ? 'найвищу' : 'найнижчу'} точку графіка і подивись на її абсцису.`,
        rozviazok: `${typ === 0 ? 'Найвища' : 'Найнижча'} точка — (${t}; ${ch(shukane)}): о ${t} год.`,
      };
    }
    const kandydaty = tochky.filter(([, y]) => skilkyRaziv(tochky, y) === 1);
    if (!kandydaty.length) continue;
    const [t, T] = r.vybir(kandydaty);
    return {
      pytannia: `За графіком: о котрій годині температура була ${ch(T)} °C?`,
      malunok: malunokT(tochky, krok),
      vidpovid: t,
      odynytsi: 'год',
      pidkazka: `Від ${ch(T)} на осі T — горизонтально до графіка, потім униз (чи вгору) до осі t.`,
      rozviazok: `Точка графіка (${t}; ${ch(T)}): о ${t} год.`,
    };
  }
}

function zmina(r: Vypadok): TrenZavdannia {
  for (;;) {
    const { tochky, krok } = temperatury(r);
    const [i, j] = r.rizni(2, 0, tochky.length - 1).sort((a, b) => a - b);
    const [[t1, T1], [t2, T2]] = [tochky[i], tochky[j]];
    if (T1 === T2) continue;
    const d = T2 - T1;
    return {
      pytannia: `За графіком: на скільки градусів ${d > 0 ? 'потеплішало' : 'похолоднішало'} з ${t1} год до ${t2} год?`,
      malunok: malunokT(tochky, krok),
      vidpovid: Math.abs(d),
      odynytsi: '°',
      pidkazka: `Прочитай температуру о ${t1} і о ${t2} год і знайди різницю.`,
      rozviazok: `T(${t1}) = ${ch(T1)}, T(${t2}) = ${ch(T2)}; ${d > 0 ? `${ch(T2)} − ${T1 < 0 ? `(${ch(T1)})` : T1}` : `${ch(T1)} − ${T2 < 0 ? `(${ch(T2)})` : T2}`} = ${Math.abs(d)}`,
    };
  }
}

const RUKH = [
  { hto: 'Пішохід', v: [3, 4, 5, 6] },
  { hto: 'Велосипедист', v: [10, 12, 14, 15, 16, 18] },
  { hto: 'Автомобіль', v: [40, 50, 60, 70, 80, 90] },
];

function rukh(r: Vypadok): TrenZavdannia {
  const R = r.vybir(RUKH);
  const v = r.vybir(R.v);
  const n = r.chyslo(4, 6);
  const tochky: Tochky = Array.from({ length: n + 1 }, (_, t) => [t, v * t]);
  const krokY = v % 2 === 0 ? v / 2 : v; // кожна година — ціле число клітинок
  const malunok = hrafik({ tochky, krokX: 1, krokY, osX: 't, год', osY: 's, км' });
  const t = r.chyslo(1, n);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `${R.hto} рухається зі сталою швидкістю. За графіком: яку відстань він подолав за ${t} год?`,
      malunok,
      vidpovid: v * t,
      odynytsi: 'км',
      pidkazka: `Від ${t} на осі t — угору до графіка, потім до осі s.`,
      rozviazok: `Точка графіка (${t}; ${v * t}): ${v * t} км.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${R.hto} рухається зі сталою швидкістю. За графіком: за скільки годин він подолав ${v * t} км?`,
      malunok,
      vidpovid: t,
      odynytsi: 'год',
      pidkazka: `Від ${v * t} на осі s — горизонтально до графіка, потім униз до осі t.`,
      rozviazok: `Точка графіка (${t}; ${v * t}): за ${t} год.`,
    };
  }
  return {
    pytannia: `${R.hto} рухається зі сталою швидкістю. За графіком знайди його швидкість.`,
    malunok,
    vidpovid: v,
    odynytsi: 'км/год',
    pidkazka: 'Яку відстань подолано за 1 год?',
    rozviazok: `За 1 год — ${v} км, тож швидкість ${v} км/год.`,
  };
}

/** Рух із зупинкою: їхав, стояв, знову їхав. */
function zupynka(r: Vypadok): TrenZavdannia {
  const v1 = r.vybir([10, 15, 20]);
  const v2 = r.vybir([10, 15, 20]);
  const [a, b, c] = [r.chyslo(1, 3), r.chyslo(1, 2), r.chyslo(1, 3)]; // години руху, стоянки, руху
  const tochky: Tochky = [[0, 0]];
  for (let t = 1; t <= a; t++) tochky.push([t, v1 * t]);
  const s1 = v1 * a;
  for (let t = 1; t <= b; t++) tochky.push([a + t, s1]);
  for (let t = 1; t <= c; t++) tochky.push([a + b + t, s1 + v2 * t]);
  const malunok = hrafik({ tochky, krokX: 1, krokY: 5, osX: 't, год', osY: 's, км' });
  const typ = r.chyslo(0, 2);
  const kinets = s1 + v2 * c;
  if (typ === 0) {
    return {
      pytannia: 'Велосипедист їхав, потім зупинився на відпочинок, а далі поїхав знову. За графіком: скільки годин тривала зупинка?',
      malunok,
      vidpovid: b,
      odynytsi: 'год',
      pidkazka: 'Під час зупинки відстань не змінюється — графік іде горизонтально.',
      rozviazok: `Горизонтальна ділянка — від ${a} до ${a + b} год: ${a + b} − ${a} = ${b}`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Велосипедист їхав, потім зупинився на відпочинок, а далі поїхав знову. За графіком: яку відстань він подолав до зупинки?',
      malunok,
      vidpovid: s1,
      odynytsi: 'км',
      pidkazka: 'Знайди, на якій висоті графік стає горизонтальним.',
      rozviazok: `Горизонтальна ділянка — на рівні ${s1} км.`,
    };
  }
  return {
    pytannia: `Велосипедист їхав, потім зупинився на відпочинок, а далі поїхав знову. За графіком: з якою швидкістю він їхав після зупинки?`,
    malunok,
    vidpovid: v2,
    odynytsi: 'км/год',
    pidkazka: 'Яку відстань він подолав за 1 год після зупинки?',
    rozviazok: `Після зупинки за ${c} год — від ${s1} до ${kinets} км: (${kinets} − ${s1}) : ${c} = ${v2}`,
  };
}

export default {
  rivni: ['прочитай значення за графіком', 'коли, найвища, на скільки змінилося', 'графіки руху'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? znachennia(r) : rukh(r);
    if (riven === 2) return r.vybir([chasZaZnachenniam, chasZaZnachenniam, zmina, znachennia])(r);
    return r.vybir([rukh, zupynka, zupynka, zmina])(r);
  },
} satisfies Henerator;
