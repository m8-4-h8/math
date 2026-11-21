// Швидкість, час, шлях (4 клас): s = v · t, v = s : t, t = s : v; що означає швидкість; хвилини при км/год;
// шлях той самий — швидкість більша в кілька разів, час менший у стільки ж разів; складені задачі.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Tilo {
  nazva: string;
  zhin: boolean;
  v: [number, number];
  krok?: number;
  od: 'км' | 'м';
  chas: 'год' | 'хв' | 'с';
  t: [number, number];
}

const TILA: Tilo[] = [
  { nazva: 'Пішохід', zhin: false, v: [3, 6], od: 'км', chas: 'год', t: [2, 6] },
  { nazva: 'Велосипедистка', zhin: true, v: [10, 20], od: 'км', chas: 'год', t: [2, 5] },
  { nazva: 'Автомобіль', zhin: false, v: [50, 110], krok: 5, od: 'км', chas: 'год', t: [2, 6] },
  { nazva: 'Потяг', zhin: false, v: [60, 120], krok: 5, od: 'км', chas: 'год', t: [2, 8] },
  { nazva: 'Літак', zhin: false, v: [500, 900], krok: 50, od: 'км', chas: 'год', t: [2, 5] },
  { nazva: 'Лижниця', zhin: true, v: [8, 16], od: 'км', chas: 'год', t: [2, 4] },
  { nazva: 'Катер', zhin: false, v: [20, 45], od: 'км', chas: 'год', t: [2, 6] },
  { nazva: 'Бджола', zhin: true, v: [4, 8], od: 'м', chas: 'с', t: [5, 30] },
  { nazva: 'Черепаха', zhin: true, v: [3, 6], od: 'м', chas: 'хв', t: [5, 20] },
  { nazva: 'Ліфт', zhin: false, v: [2, 6], od: 'м', chas: 'с', t: [5, 25] },
  { nazva: 'Равлик', zhin: false, v: [3, 7], od: 'м', chas: 'год', t: [2, 8] },
];
const KM = TILA.filter((t) => t.od === 'км');

const CHASU: Record<Tilo['chas'], [string, string, string]> = {
  год: ['годин', 'щогодини', 'годину'],
  хв: ['хвилин', 'щохвилини', 'хвилину'],
  с: ['секунд', 'щосекунди', 'секунду'],
};

const shvydkist = (r: Vypadok, tl: Tilo) => {
  const k = tl.krok ?? 1;
  return k * r.chyslo(Math.ceil(tl.v[0] / k), Math.floor(tl.v[1] / k));
};
const vin = (tl: Tilo) => (tl.zhin ? 'вона' : 'він');
const podolav = (tl: Tilo) => (tl.zhin ? 'подолала' : 'подолав');
const rukhavsia = (tl: Tilo) => (tl.zhin ? 'рухалася' : 'рухався');
const odV = (tl: Tilo) => `${tl.od}/${tl.chas}`;
const raz = (n: number) => `${n} ${n < 5 ? 'рази' : 'разів'}`;

function priamo(r: Vypadok): TrenZavdannia {
  const tl = r.vybir(TILA);
  const v = shvydkist(r, tl);
  const t = r.chyslo(tl.t[0], tl.t[1]);
  const s = v * t;
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `${tl.nazva} рухається зі швидкістю ${ch(v)} ${odV(tl)}. Який шлях ${vin(tl)} подолає за ${t} ${tl.chas}?`,
      vidpovid: s,
      odynytsi: tl.od,
      pidkazka: 'Шлях = швидкість · час.',
      rozviazok: `${ch(v)} · ${t} = ${ch(s)} (${tl.od})`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${tl.nazva} ${podolav(tl)} ${ch(s)} ${tl.od} за ${t} ${tl.chas}. З якою швидкістю ${vin(tl)} ${rukhavsia(tl)}?`,
      vidpovid: v,
      odynytsi: odV(tl),
      pidkazka: 'Швидкість = шлях : час.',
      rozviazok: `${ch(s)} : ${t} = ${ch(v)} (${odV(tl)}). Перевірка: ${ch(v)} · ${t} = ${ch(s)}`,
    };
  }
  return {
    pytannia: `${tl.nazva} рухається зі швидкістю ${ch(v)} ${odV(tl)}. За скільки ${CHASU[tl.chas][0]} ${vin(tl)} подолає ${ch(s)} ${tl.od}?`,
    vidpovid: t,
    odynytsi: tl.chas,
    pidkazka: `Час = шлях : швидкість. Скільки разів ${ch(v)} вміщується в ${ch(s)}?`,
    rozviazok: `${ch(s)} : ${ch(v)} = ${t} (${tl.chas}). Перевірка: ${ch(v)} · ${t} = ${ch(s)}`,
  };
}

// Швидкість у км/год, а час — у хвилинах: спершу яка частина години.
function khvylyny(r: Vypadok): TrenZavdannia {
  for (;;) {
    const tl = r.vybir(KM.filter((t) => t.nazva !== 'Літак'));
    const v = shvydkist(r, tl);
    const m = r.vybir([30, 20, 15, 10]);
    const chastyn = 60 / m;
    if (v % chastyn) continue;
    const s = v / chastyn;
    const chastyna = { 2: 'половина', 3: 'третина', 4: 'четверта частина', 6: 'шоста частина' }[chastyn];
    return {
      pytannia: `${tl.nazva} рухається зі швидкістю ${v} км/год. Скільки кілометрів ${vin(tl)} подолає за ${m} хв?`,
      vidpovid: s,
      odynytsi: 'км',
      pidkazka: `${v} км — це за цілу годину. ${m} хв — яка частина години?`,
      rozviazok: `${m} хв — ${chastyna} години (60 : ${m} = ${chastyn}), тож і шлях у ${raz(chastyn)} менший: ${v} : ${chastyn} = ${s} (км).`,
    };
  }
}

// Швидкість у км/хв переводимо в км/год.
function zaKhvylynu(r: Vypadok): TrenZavdannia {
  const [nazva, vid, do_] = r.vybir([
    ['Літак', 10, 15],
    ['Швидкісний потяг', 2, 5],
    ['Гелікоптер', 3, 5],
  ] as const);
  const a = r.chyslo(vid, do_);
  return {
    pytannia: `${nazva} щохвилини долає ${a} км. Яка його швидкість у кілометрах за годину?`,
    vidpovid: a * 60,
    odynytsi: 'км/год',
    pidkazka: 'В одній годині 60 хвилин. Скільки кілометрів за 60 хв?',
    rozviazok: `${a} · 60 = ${ch(a * 60)} (км/год)`,
  };
}

function shchoOznachaie(r: Vypadok): TrenZavdannia {
  const tl = r.vybir(TILA);
  const v = shvydkist(r, tl);
  const [, shcho, odnu] = CHASU[tl.chas];
  const pravylno = `${shcho} долає ${ch(v)} ${tl.od}`;
  return {
    pytannia: `${tl.nazva} рухається зі швидкістю ${ch(v)} ${odV(tl)}. Що це означає?`,
    vidpovid: pravylno,
    varianty: r.peremishaty([pravylno, `долає 1 ${tl.od} за ${ch(v)} ${tl.chas}`, `за весь шлях долає ${ch(v)} ${tl.od}`]),
    pidkazka: 'Швидкість — це шлях за одиницю часу.',
    rozviazok: `Швидкість — шлях за одну ${odnu}: ${shcho} ${ch(v)} ${tl.od}.`,
  };
}

// Шлях той самий: швидкість більша в n разів — час менший у n разів.
function zalezhnist(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 3);
  const t2 = r.chyslo(1, 3);
  const t1 = t2 * n;
  const [povilnyi, shvydkyi, v] = r.shans()
    ? ['Вантажівка проїхала', 'легковик', 5 * r.chyslo(4, 8)]
    : ['Пішохід пройшов', 'велосипедист', r.chyslo(3, 6)];
  const s = v * t1;
  return {
    pytannia: `${povilnyi} ${s} км за ${t1} год. За скільки годин цей самий шлях подолає ${shvydkyi}, швидкість якого в ${raz(n)} більша?`,
    vidpovid: t2,
    odynytsi: 'год',
    pidkazka: 'Шлях той самий. Швидкість більша в кілька разів — що станеться з часом?',
    rozviazok: `Швидкість у ${raz(n)} більша, тож часу треба в ${raz(n)} менше: ${t1} : ${n} = ${t2} (год). Перевірка: ${s} : ${t1} = ${v} (км/год), ${v} · ${n} = ${v * n} (км/год), ${v * n} · ${t2} = ${s}`,
  };
}

function dviDilianky(r: Vypadok): TrenZavdannia {
  const v1 = r.chyslo(3, 6);
  const t1 = r.chyslo(2, 4);
  const v2 = 5 * r.chyslo(10, 18);
  const t2 = r.chyslo(2, 5);
  const [s1, s2] = [v1 * t1, v2 * t2];
  return {
    pytannia: `Туристи ${t1} год ішли пішки зі швидкістю ${v1} км/год, а потім ${t2} год їхали автобусом зі швидкістю ${v2} км/год. Який шлях вони подолали?`,
    vidpovid: s1 + s2,
    odynytsi: 'км',
    pidkazka: 'Знайди шлях пішки й шлях автобусом окремо, а потім додай.',
    rozviazok: `${v1} · ${t1} = ${s1} (км), ${v2} · ${t2} = ${s2} (км), ${s1} + ${s2} = ${s1 + s2} (км)`,
  };
}

function porivniannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const v1 = 5 * r.chyslo(14, 22);
    const v2 = 5 * r.chyslo(10, 17);
    const t1 = r.chyslo(2, 6);
    const t2 = r.chyslo(2, 8);
    const [s1, s2] = [v1 * t1, v2 * t2];
    if (v1 <= v2 || s2 <= s1) continue;
    return {
      pytannia: `Легковик їхав ${t1} год зі швидкістю ${v1} км/год, а вантажівка — ${t2} год зі швидкістю ${v2} км/год. На скільки кілометрів більший шлях подолала вантажівка?`,
      vidpovid: s2 - s1,
      odynytsi: 'км',
      pidkazka: 'Знайди шлях кожної машини, а потім порівняй.',
      rozviazok: `Легковик: ${v1} · ${t1} = ${s1} (км). Вантажівка: ${v2} · ${t2} = ${s2} (км). ${s2} − ${s1} = ${s2 - s1} (км)`,
    };
  }
}

function bilshe(r: Vypadok): TrenZavdannia {
  const v1 = r.chyslo(15, 45);
  const t1 = r.chyslo(2, 5);
  const d = 5 * r.chyslo(2, 8);
  const t2 = r.krim(2, 6, [t1]);
  const v2 = v1 + d;
  return {
    pytannia: `Трактор долає ${v1 * t1} км за ${t1} год, а автомобіль щогодини проїжджає на ${d} км більше. Скільки кілометрів автомобіль подолає за ${t2} год?`,
    vidpovid: v2 * t2,
    odynytsi: 'км',
    pidkazka: `Спершу швидкість трактора: ${v1 * t1} : ${t1}.`,
    rozviazok: `${v1 * t1} : ${t1} = ${v1} (км/год), ${v1} + ${d} = ${v2} (км/год), ${v2} · ${t2} = ${v2 * t2} (км)`,
  };
}

function chastynaShliakhu(r: Vypadok): TrenZavdannia {
  const [n, nazva] = r.vybir([
    [2, 'половину'],
    [3, 'третину'],
    [4, 'четверту частину'],
  ] as const);
  const v = r.chyslo(10, 20);
  const t = r.chyslo(2, 4);
  const S = v * t * n;
  return {
    pytannia: `Відстань між містами ${S} км. Велосипедист проїхав ${nazva} цієї відстані за ${t} год. З якою швидкістю він рухався?`,
    vidpovid: v,
    odynytsi: 'км/год',
    pidkazka: `Спершу знайди ${nazva} відстані: ${S} : ${n}.`,
    rozviazok: `${S} : ${n} = ${v * t} (км) — проїхав; ${v * t} : ${t} = ${v} (км/год)`,
  };
}

export default {
  rivni: ['знайди шлях, швидкість чи час', 'з підступом', 'складені задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return priamo(r);
    if (riven === 2) return r.vybir([khvylyny, khvylyny, zaKhvylynu, shchoOznachaie, zalezhnist])(r);
    return r.vybir([dviDilianky, porivniannia, bilshe, chastynaShliakhu])(r);
  },
} satisfies Henerator;
