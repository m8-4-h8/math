// Кругові діаграми: увесь круг — 360° і 100 %, тож 1 % — це 3,6°; відсотки → градуси і назад;
// сектор за кількістю (частина : ціле); кількість за сектором.
import { des, nsd, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function vGradusy(r: Vypadok): TrenZavdannia {
  const p = r.shans(0.6) ? r.chyslo(1, 99) : r.vybir([10, 20, 25, 50, 75]);
  const g = (p * 36) / 10;
  return {
    pytannia: `Скільки градусів займає сектор ${p}% на круговій діаграмі?`,
    vidpovid: des(g * 10, 1),
    odynytsi: '°',
    pidkazka: p === 50 ? 'Половина круга.' : p === 25 ? 'Чверть круга.' : '1% — це 360° : 100 = 3,6°.',
    rozviazok: `${p} · 3,6 = ${des(g * 10, 1)}°`,
  };
}

function vVidsotky(r: Vypadok): TrenZavdannia {
  const p = r.vybir([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90]);
  const g = (p * 36) / 10;
  return {
    pytannia: `Сектор займає ${des(g * 10, 1)}°. Скільки це відсотків круга?`,
    vidpovid: p,
    odynytsi: '%',
    pidkazka: 'Поділи градуси на 3,6 (стільки градусів в 1%).',
    rozviazok: `${des(g * 10, 1)} : 3,6 = ${p} (%)`,
  };
}

const ZAHALOM = [
  { razom: 'учнів', zapyt: (x: number, sector: string) => `З них ${x} ходять на ${sector}.`, sektory: ['шахи', 'футбол', 'танці', 'малювання'], ciloho: 'учнів', pro: 'Скільки учнів ходять на' },
];

function sektorZaKilkistiu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const vsoho = r.vybir([20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180]);
    const x = r.chyslo(1, vsoho - 1);
    const g = (360 * x) / vsoho;
    if (!Number.isInteger(g)) continue;
    const s = r.vybir(ZAHALOM[0].sektory);
    return {
      pytannia: `У гуртках ${vsoho} учнів, з них ${x} ходять на ${s}. Скільки градусів займе сектор «${s}» на круговій діаграмі?`,
      vidpovid: g,
      odynytsi: '°',
      pidkazka: `Яку частину всіх учнів становлять ${x}? Таку ж частину від 360°.`,
      rozviazok: `${x} : ${vsoho} · 360 = ${g}°`,
    };
  }
}

function kilkistZaSektorom(r: Vypadok): TrenZavdannia {
  for (;;) {
    const vsoho = r.vybir([40, 60, 80, 120, 180, 200, 240, 300, 360]);
    const g = r.vybir([30, 36, 45, 60, 72, 90, 120, 135, 144, 180]);
    const x = (vsoho * g) / 360;
    if (!Number.isInteger(x) || nsd(g, 360) < 9) continue;
    const s = r.vybir(ZAHALOM[0].sektory);
    return {
      pytannia: `На круговій діаграмі опитування ${vsoho} учнів сектор «${s}» займає ${g}°. Скільки учнів обрали ${s}?`,
      vidpovid: x,
      pidkazka: `Яку частину круга займає ${g}°? Таку ж частину від ${vsoho}.`,
      rozviazok: `${vsoho} · ${g} : 360 = ${x}`,
    };
  }
}

export default {
  rivni: ['відсотки в градуси', 'градуси у відсотки і сектор за кількістю', 'кількість за сектором'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? vGradusy(r) : vVidsotky(r);
    if (riven === 2) return r.vybir([vVidsotky, sektorZaKilkistiu, vGradusy])(r);
    return r.vybir([kilkistZaSektorom, kilkistZaSektorom, sektorZaKilkistiu, vVidsotky])(r);
  },
} satisfies Henerator;
