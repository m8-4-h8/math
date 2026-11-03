// Прямокутний паралелепіпед і куб: V = a · b · c, V = a³; невідоме ребро; одиниці об'єму (1 дм³ = 1000 см³);
// грані, ребра, вершини; площа поверхні куба.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function obiem(r: Vypadok, max: number): TrenZavdannia {
  if (r.shans(0.3)) {
    const a = r.chyslo(2, Math.min(max, 12));
    const od = r.vybir(['см', 'дм', 'м']);
    return {
      pytannia: `Знайди об'єм куба з ребром ${a} ${od}.`,
      vidpovid: a ** 3,
      odynytsi: `${od}³`,
      pidkazka: 'Об’єм куба — ребро · ребро · ребро.',
      rozviazok: `${a} · ${a} · ${a} = ${ch(a ** 3)} (${od}³)`,
    };
  }
  const [a, b, c] = [r.chyslo(2, max), r.chyslo(2, max), r.chyslo(2, max)];
  return {
    pytannia: `Знайди об'єм прямокутного паралелепіпеда з ребрами ${a} см, ${b} см і ${c} см.`,
    vidpovid: a * b * c,
    odynytsi: 'см³',
    pidkazka: 'Об’єм = довжина · ширина · висота.',
    rozviazok: `${a} · ${b} · ${c} = ${ch(a * b * c)} (см³)`,
  };
}

function rebro(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.chyslo(2, 12), r.chyslo(2, 12), r.chyslo(2, 15)];
  const shcho = r.vybir(['коробки', 'бруска', 'ящика']);
  return {
    pytannia: `Об'єм ${shcho} ${ch(a * b * c)} см³, довжина ${a} см, ширина ${b} см. Яка його висота?`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: 'Спершу площа дна: довжина · ширина. Потім об’єм поділи на неї.',
    rozviazok: `${a} · ${b} = ${a * b} (см²); ${ch(a * b * c)} : ${a * b} = ${c} (см)`,
  };
}

function odynytsi(r: Vypadok): TrenZavdannia {
  const v = r.vybir([
    { velyka: 'дм³', mala: 'см³', k: 1000 },
    { velyka: 'м³', mala: 'дм³', k: 1000 },
    { velyka: 'л', mala: 'см³', k: 1000 },
    { velyka: 'дм³', mala: 'л', k: 1 },
  ]);
  const n = r.chyslo(2, 25);
  if (v.k === 1) {
    return {
      pytannia: `Скільки літрів в ${n} дм³?`,
      vidpovid: n,
      odynytsi: 'л',
      pidkazka: '1 л — це 1 дм³.',
      rozviazok: `${n} дм³ = ${n} л`,
    };
  }
  return r.shans()
    ? {
        pytannia: 'Переведи в менші одиниці.',
        vyraz: `${n} ${v.velyka} = □ ${v.mala}`,
        vidpovid: n * v.k,
        odynytsi: v.mala,
        pidkazka: `1 ${v.velyka} = ${ch(v.k)} ${v.mala} (10 · 10 · 10).`,
        rozviazok: `${n} · ${ch(v.k)} = ${ch(n * v.k)} (${v.mala})`,
      }
    : {
        pytannia: 'Переведи у більші одиниці.',
        vyraz: `${ch(n * v.k)} ${v.mala} = □ ${v.velyka}`,
        vidpovid: n,
        odynytsi: v.velyka,
        pidkazka: `1 ${v.velyka} = ${ch(v.k)} ${v.mala}.`,
        rozviazok: `${ch(n * v.k)} : ${ch(v.k)} = ${n} (${v.velyka})`,
      };
}

const BUDOVA = [
  { p: 'Скільки ребер у прямокутного паралелепіпеда?', v: 12, ch: 'По 4 ребра зверху, знизу і збоку: 4 · 3 = 12.' },
  { p: 'Скільки граней у прямокутного паралелепіпеда?', v: 6, ch: 'Верх, низ і 4 бічні: 6.' },
  { p: 'Скільки вершин у куба?', v: 8, ch: '4 зверху і 4 знизу: 8.' },
  { p: 'Скільки ребер у куба?', v: 12, ch: 'Куб — теж паралелепіпед: 12 ребер.' },
];

function budova(r: Vypadok): TrenZavdannia {
  const b = r.vybir(BUDOVA);
  return { pytannia: b.p, vidpovid: b.v, pidkazka: 'Уяви коробку і порахуй.', rozviazok: b.ch };
}

function poverkhnia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 10);
  if (r.shans()) {
    return {
      pytannia: `Ребро куба ${a} см. Знайди площу його поверхні (усіх граней разом).`,
      vidpovid: 6 * a * a,
      odynytsi: 'см²',
      pidkazka: 'У куба 6 однакових граней-квадратів.',
      rozviazok: `${a} · ${a} = ${a * a} (см²) — одна грань; ${a * a} · 6 = ${6 * a * a} (см²)`,
    };
  }
  return {
    pytannia: `Сума довжин усіх ребер куба ${12 * a} см. Знайди його об'єм.`,
    vidpovid: a ** 3,
    odynytsi: 'см³',
    pidkazka: 'У куба 12 рівних ребер.',
    rozviazok: `${12 * a} : 12 = ${a} (см) — ребро; ${a} · ${a} · ${a} = ${ch(a ** 3)} (см³)`,
  };
}

export default {
  rivni: ['об’єм паралелепіпеда і куба', 'невідоме ребро, одиниці об’єму', 'поверхня, ребра, вершини'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? obiem(r, 9) : budova(r);
    if (riven === 2) return r.vybir([rebro, odynytsi, (rr: Vypadok) => obiem(rr, 20)])(r);
    return r.vybir([poverkhnia, poverkhnia, rebro, odynytsi])(r);
  },
} satisfies Henerator;
