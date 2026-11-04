// Медіана, бісектриса, висота: розпізнати відрізок за позначками, знайти половину сторони чи кута (і навпаки),
// де лежить висота (всередині, поза трикутником, збігається зі стороною), периметри частин і кути з висотою.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { vidrizokTrykutnyka } from '../trykutnyky.ts';
import type { Forma, VydVidrizka } from '../trykutnyky.ts';

const VYDY: VydVidrizka[] = ['медіана', 'бісектриса', 'висота'];
const LITERY = [
  ['A', 'B', 'C', 'D'],
  ['K', 'M', 'N', 'P'],
  ['M', 'N', 'K', 'E'],
  ['D', 'E', 'F', 'K'],
  ['P', 'Q', 'R', 'S'],
];

/** Вершини трикутника: з якої проводимо відрізок (v) і кінці протилежної сторони (a, b). */
function vershyny(r: Vypadok) {
  const l = r.vybir(LITERY);
  const z = r.chyslo(0, 2);
  return { l, z, v: l[z], a: l[(z + 1) % 3], b: l[(z + 2) % 3], o: l[3], t: l.slice(0, 3).join('') };
}

const POZNACHKA: Record<VydVidrizka, string> = {
  медіана: 'однакові рисочки — основа ділить сторону навпіл, це медіана',
  бісектриса: 'однакові дуги — відрізок ділить кут навпіл, це бісектриса',
  висота: 'квадратик — відрізок перпендикулярний до прямої сторони, це висота',
};

function shchoProvedeno(r: Vypadok): TrenZavdannia {
  const vyd = r.vybir(VYDY);
  let forma: Forma = r.vybir(['hostrokutnyi', 'hostrokutnyi2', 'tupokutnyi', 'priamokutnyi'] as Forma[]);
  const { l, z } = vershyny(r);
  // У прямокутному трикутнику висота з гострого кута — це катет; щоб не плутати, беремо інший трикутник.
  if (forma === 'priamokutnyi' && vyd === 'висота' && z !== 1) forma = 'hostrokutnyi';
  return {
    pytannia: 'Який відрізок проведено в трикутнику?',
    malunok: vidrizokTrykutnyka({ forma, vyd, z, litery: l.slice(0, 3), osnova: l[3] }),
    vidpovid: vyd,
    varianty: VYDY,
    pidkazka: 'Подивись на позначки: рисочки на стороні, дуги в куті чи квадратик?',
    rozviazok: `На малюнку ${POZNACHKA[vyd]}.`,
  };
}

function polovyna(r: Vypadok): TrenZavdannia {
  const { v, a, b, o, t } = vershyny(r);
  if (r.shans()) {
    const k = r.chyslo(3, 24);
    return {
      pytannia: `${v}${o} — медіана трикутника ${t}, ${a}${b} = ${2 * k} см. Знайди ${a}${o}.`,
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: `Медіана йде до середини сторони ${a}${b}.`,
      rozviazok: `${o} — середина ${a}${b}, тож ${a}${o} дорівнює ${2 * k} : 2 = ${k} см.`,
    };
  }
  const h = r.chyslo(12, 75);
  return {
    pytannia: `${v}${o} — бісектриса трикутника ${t}, ∠${a}${v}${b} = ${2 * h}°. Знайди ∠${a}${v}${o}.`,
    vidpovid: h,
    odynytsi: '°',
    pidkazka: `Бісектриса ділить кут ${v} навпіл.`,
    rozviazok: `Кут ${a}${v}${o} дорівнює ${2 * h}° : 2 = ${h}°.`,
  };
}

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const { l, z, v, a, b, o } = vershyny(r);
  const forma: Forma = r.vybir(['hostrokutnyi', 'hostrokutnyi2'] as Forma[]);
  if (r.shans()) {
    const k = r.chyslo(3, 19);
    const [p0, p1] = r.shans() ? [`${k} см`, '?'] : ['?', `${k} см`];
    return {
      pytannia: `${v}${o} — медіана. Знайди невідомий відрізок.`,
      malunok: vidrizokTrykutnyka({ forma, vyd: 'медіана', z, litery: l.slice(0, 3), osnova: o, pidpysyChastyn: [p0, p1] }),
      vidpovid: k,
      odynytsi: 'см',
      pidkazka: 'Медіана ділить сторону на дві рівні частини.',
      rozviazok: `${a}${o} = ${o}${b}, бо ${o} — середина сторони ${a}${b}. Отже, невідомий відрізок теж ${k} см.`,
    };
  }
  const h = r.chyslo(15, 50);
  const [p0, p1] = r.shans() ? [`${h}°`, '?'] : ['?', `${h}°`];
  return {
    pytannia: `${v}${o} — бісектриса. Знайди невідомий кут.`,
    malunok: vidrizokTrykutnyka({ forma, vyd: 'бісектриса', z, litery: l.slice(0, 3), osnova: o, pidpysyPolovyn: [p0, p1] }),
    vidpovid: h,
    odynytsi: '°',
    pidkazka: `Бісектриса ділить кут ${v} на два рівні кути.`,
    rozviazok: `∠${a}${v}${o} = ∠${o}${v}${b}, тож невідомий кут теж ${h}°.`,
  };
}

function navpaky(r: Vypadok): TrenZavdannia {
  const { v, a, b, o, t } = vershyny(r);
  if (r.shans()) {
    const k = r.chyslo(3, 24);
    return {
      pytannia: `${v}${o} — медіана трикутника ${t}, ${a}${o} = ${k} см. Знайди ${a}${b}.`,
      vidpovid: 2 * k,
      odynytsi: 'см',
      pidkazka: `${o} — середина ${a}${b}. Яка частина сторони — ${a}${o}?`,
      rozviazok: `${a}${o} — половина сторони ${a}${b}, тож ${a}${b} дорівнює 2 · ${k} = ${2 * k} см.`,
    };
  }
  const h = r.chyslo(12, 75);
  return {
    pytannia: `${v}${o} — бісектриса трикутника ${t}, ∠${o}${v}${b} = ${h}°. Знайди ∠${a}${v}${b}.`,
    vidpovid: 2 * h,
    odynytsi: '°',
    pidkazka: `Кут ${o}${v}${b} — половина кута ${v}.`,
    rozviazok: `Бісектриса ділить кут навпіл, тож кут ${a}${v}${b} дорівнює 2 · ${h}° = ${2 * h}°.`,
  };
}

const MISTSE = ['всередині трикутника', 'поза трикутником', 'збігається зі стороною'];

function deVysota(r: Vypadok): TrenZavdannia {
  const { l } = vershyny(r);
  const [p, q, s] = l;
  const typ = r.chyslo(0, 2); // 0 — гострокутний, 1 — тупий кут q, 2 — прямий кут q
  const z = r.vybir([p, q, s]);
  const umova = typ === 0 ? 'Усі кути трикутника гострі.' : typ === 1 ? `Кут ${q} — тупий.` : `Кут ${q} — прямий.`;
  const vidp = typ === 0 || z === q ? MISTSE[0] : typ === 1 ? MISTSE[1] : MISTSE[2];
  const inshi = [p, q, s].filter((x) => x !== z);
  const rozviazok =
    typ === 0
      ? 'У гострокутному трикутнику всі висоти лежать усередині.'
      : z === q
        ? `Висота з вершини ${typ === 1 ? 'тупого' : 'прямого'} кута падає на протилежну сторону ${inshi.join('')} — усередині трикутника.`
        : typ === 1
          ? `Перпендикуляр з вершини ${z} гострого кута падає на продовження сторони — висота лежить поза трикутником.`
          : `Сторони при прямому куті перпендикулярні, тож висота з вершини ${z} — це сторона ${z}${q}.`;
  return {
    pytannia: `Трикутник ${p}${q}${s}. ${umova} Де лежить висота, проведена з вершини ${z}?`,
    vidpovid: vidp,
    varianty: MISTSE,
    pidkazka: 'Висота — перпендикуляр до прямої, що містить протилежну сторону. Уяви, куди він упаде.',
    rozviazok,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const { v, a, b, o, t } = vershyny(r);
  const k = r.chyslo(3, 10);
  const s = r.chyslo(Math.max(4, k - 3), 16);
  const m = r.chyslo(Math.abs(s - k) + 1, s + k - 1);
  return {
    pytannia: `${v}${o} — медіана трикутника ${t}; ${v}${a} = ${s} см, ${a}${b} = ${2 * k} см, ${v}${o} = ${m} см. Знайди периметр трикутника ${v}${a}${o}.`,
    vidpovid: s + k + m,
    odynytsi: 'см',
    pidkazka: `Спершу знайди ${a}${o}: ${o} — середина ${a}${b}.`,
    rozviazok: `${a}${o} дорівнює ${2 * k} : 2 = ${k} см. Периметр ${v}${a}${o} дорівнює ${s} + ${k} + ${m} = ${s + k + m} см.`,
  };
}

function riznytsiaPerymetriv(r: Vypadok): TrenZavdannia {
  // P(VAO) − P(VBO) = VA − VB: спільна медіана і рівні половинки скорочуються.
  const { v, a, b, o, t } = vershyny(r);
  const vb = r.chyslo(5, 15);
  const d = r.chyslo(1, 6);
  return {
    pytannia: `${v}${o} — медіана трикутника ${t}. Периметр трикутника ${v}${a}${o} на ${d} см більший за периметр трикутника ${v}${b}${o}, ${v}${b} = ${vb} см. Знайди ${v}${a}.`,
    vidpovid: vb + d,
    odynytsi: 'см',
    pidkazka: `У двох трикутниках спільна сторона ${v}${o}, а ${a}${o} = ${o}${b}. Чим тоді відрізняються периметри?`,
    rozviazok: `Сторона ${v}${o} спільна, ${a}${o} = ${o}${b}, тож різниця периметрів — це ${v}${a} − ${v}${b}. Отже, ${v}${a} дорівнює ${vb} + ${d} = ${vb + d} см.`,
  };
}

function kutZVysotoiu(r: Vypadok): TrenZavdannia {
  const { v, a, o } = vershyny(r);
  const g = r.chyslo(25, 80);
  return {
    pytannia: `${v}${o} — висота гострокутного трикутника, ∠${a} = ${g}°. Знайди ∠${a}${v}${o}.`,
    vidpovid: 90 - g,
    odynytsi: '°',
    pidkazka: `У трикутнику ${v}${a}${o} кут при ${o} прямий, а сума кутів — 180°.`,
    rozviazok: `У трикутнику ${v}${a}${o} кут ${o} прямий, тож кут ${a}${v}${o} дорівнює 180° − 90° − ${g}° = ${90 - g}°.`,
  };
}

function bisektrysaISuma(r: Vypadok): TrenZavdannia {
  const { v, a, b, o, t } = vershyny(r);
  const kv = 2 * r.chyslo(15, 50);
  const ka = r.chyslo(20, 180 - kv - 20);
  const kb = 180 - kv - ka;
  return {
    pytannia: `У трикутнику ${t} ∠${a} = ${ka}°, ∠${b} = ${kb}°, ${v}${o} — бісектриса. Знайди ∠${a}${v}${o}.`,
    vidpovid: kv / 2,
    odynytsi: '°',
    pidkazka: `Спершу знайди кут ${v}: сума кутів трикутника 180°.`,
    rozviazok: `Кут ${v} дорівнює 180° − ${ka}° − ${kb}° = ${kv}°. Бісектриса ділить його навпіл, тож шуканий кут ${kv}° : 2 = ${kv / 2}°.`,
  };
}

export default {
  rivni: ['назви відрізок', 'навпаки й висота', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([shchoProvedeno, shchoProvedeno, polovyna, zaMalunkom])(r);
    if (riven === 2) return r.vybir([navpaky, deVysota, deVysota, zaMalunkom])(r);
    return r.vybir([perymetr, riznytsiaPerymetriv, kutZVysotoiu, bisektrysaISuma])(r);
  },
} satisfies Henerator;
