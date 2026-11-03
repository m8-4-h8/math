// Види кутів: гострий (< 90°), прямий (90°), тупий (від 90° до 180°), розгорнутий (180°).
// За малюнком, за градусною мірою, і що буде, коли кут поділити чи скласти.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { kut } from '../malunky.ts';

const VYDY = ['гострий', 'прямий', 'тупий', 'розгорнутий'];
const vyd = (g: number) => (g < 90 ? 'гострий' : g === 90 ? 'прямий' : g < 180 ? 'тупий' : 'розгорнутий');
const chomu = (g: number) =>
  g < 90 ? `${g}° < 90° — гострий.` : g === 90 ? '90° — прямий.' : g < 180 ? `${g}° більше за 90°, але менше за 180° — тупий.` : '180° — розгорнутий.';

function zaMalunkom(r: Vypadok): TrenZavdannia {
  // Без «майже прямих» кутів: на око 85° і 95° не розрізнити.
  const g = r.vybir([r.chyslo(20, 70), 90, r.chyslo(110, 160), 180]);
  return {
    pytannia: 'Якого виду цей кут?',
    malunok: kut(g),
    vidpovid: vyd(g),
    varianty: VYDY,
    pidkazka: 'Порівняй з кутом аркуша паперу — прямим кутом.',
    rozviazok: g === 90 ? 'Позначка-квадратик показує прямий кут.' : `Цей кут ${g}°: ${chomu(g)}`,
  };
}

function zaGradusamy(r: Vypadok): TrenZavdannia {
  const g = r.vybir([r.chyslo(1, 89), 90, r.chyslo(91, 179), 180, r.vybir([89, 91, 179])]);
  return {
    pytannia: `Кут дорівнює ${g}°. Якого він виду?`,
    vidpovid: vyd(g),
    varianty: VYDY,
    pidkazka: 'Гострий — менше 90°, прямий — рівно 90°, тупий — між 90° і 180°, розгорнутий — 180°.',
    rozviazok: chomu(g),
  };
}

function podilyty(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  if (typ === 0) {
    return {
      pytannia: 'Прямий кут поділили навпіл. Якого виду кожен із двох кутів?',
      vidpovid: 'гострий',
      varianty: ['гострий', 'прямий', 'тупий'],
      pidkazka: '90° : 2 — скільки?',
      rozviazok: '90° : 2 = 45° — гострий.',
    };
  }
  if (typ === 1) {
    return {
      pytannia: 'Розгорнутий кут поділили навпіл. Якого виду кожен кут?',
      vidpovid: 'прямий',
      varianty: ['гострий', 'прямий', 'тупий'],
      pidkazka: '180° : 2 — скільки?',
      rozviazok: '180° : 2 = 90° — прямий.',
    };
  }
  if (typ === 2) {
    const a = r.chyslo(10, 80);
    return {
      pytannia: `Від розгорнутого кута відрізали кут ${a}°. Скільки градусів у куті, що лишився?`,
      vidpovid: 180 - a,
      odynytsi: '°',
      pidkazka: 'У розгорнутому куті 180°.',
      rozviazok: `180° − ${a}° = ${180 - a}° — це тупий кут.`,
    };
  }
  const a = r.chyslo(10, 80);
  return {
    pytannia: `Прямий кут поділили на два. Один з них ${a}°. Скільки градусів у другому?`,
    vidpovid: 90 - a,
    odynytsi: '°',
    pidkazka: 'У прямому куті 90°.',
    rozviazok: `90° − ${a}° = ${90 - a}°`,
  };
}

function skilkyGradusiv(r: Vypadok): TrenZavdannia {
  const v = r.vybir([
    { p: 'Скільки градусів у прямому куті?', g: 90 },
    { p: 'Скільки градусів у розгорнутому куті?', g: 180 },
    { p: 'Скільки градусів у двох прямих кутах разом?', g: 180 },
    { p: 'Скільки градусів у половині прямого кута?', g: 45 },
    { p: 'Скільки градусів у третині розгорнутого кута?', g: 60 },
    { p: 'Скільки градусів у чверті розгорнутого кута?', g: 45 },
  ]);
  return { pytannia: v.p, vidpovid: v.g, odynytsi: '°', pidkazka: 'Прямий — 90°, розгорнутий — 180°.', rozviazok: `${v.g}°` };
}

export default {
  rivni: ['вид кута за малюнком', 'вид кута за градусами', 'ділимо і складаємо кути'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? zaMalunkom(r) : skilkyGradusiv(r);
    if (riven === 2) return r.shans(0.7) ? zaGradusamy(r) : zaMalunkom(r);
    return r.vybir([podilyty, podilyty, zaGradusamy, skilkyGradusiv])(r);
  },
} satisfies Henerator;
