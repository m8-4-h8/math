// Котра година: годинник зі стрілками (малюнок), хвилини в годині, скільки часу минуло.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';

/** Годинник SVG, як у компоненті Hodynnyk. */
export function hodynnyk(hodyny: number, khvylyny: number) {
  const R = 70;
  const c = R + 8;
  const kut = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const t = (deg: number, r: number) => [c + r * Math.cos(kut(deg)), c + r * Math.sin(kut(deg))].map((x) => x.toFixed(1));
  const pozn = Array.from({ length: 60 }, (_, i) => {
    const v = i % 5 === 0;
    const [x1, y1] = t(i * 6, R - (v ? 8 : 3));
    const [x2, y2] = t(i * 6, R - 1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ill-ink)" stroke-width="${v ? 2.5 : 1}"/>`;
  }).join('');
  const chysla = Array.from({ length: 12 }, (_, i) => {
    const [x, y] = t((i + 1) * 30, R - 19);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="var(--ill-ink)">${i + 1}</text>`;
  }).join('');
  const [hx, hy] = t(((hodyny % 12) + khvylyny / 60) * 30, R * 0.45);
  const [mx, my] = t(khvylyny * 6, R * 0.68);
  return (
    `<svg viewBox="0 0 ${2 * c} ${2 * c}" width="${2 * c}" height="${2 * c}" role="img" aria-label="Годинник">` +
    `<circle cx="${c}" cy="${c}" r="${R}" fill="var(--ill-paper)" stroke="var(--ill-ink)" stroke-width="3"/>${pozn}${chysla}` +
    `<line x1="${c}" y1="${c}" x2="${mx}" y2="${my}" stroke="var(--ill-2)" stroke-width="4" stroke-linecap="round"/>` +
    `<line x1="${c}" y1="${c}" x2="${hx}" y2="${hy}" stroke="var(--ill-1)" stroke-width="6" stroke-linecap="round"/>` +
    `<circle cx="${c}" cy="${c}" r="4" fill="var(--ill-ink)"/></svg>`
  );
}

const zapys = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

/** Приймає «3:30», «3.30», «3 30», «15:30», «3» (рівно). Години на циферблаті рахуємо по колу з 12. */
function perevirkaChasu(h: number, m: number) {
  return (vvid: string) => {
    const t = vvid.trim().match(/^(\d{1,2})(?:\s*[:.,\s]\s*(\d{1,2}))?$/);
    if (!t) return false;
    const hh = Number(t[1]);
    const mm = t[2] === undefined ? 0 : Number(t[2]);
    return hh <= 24 && hh % 12 === h % 12 && mm === m;
  };
}

function kotraHodyna(r: Vypadok, krok: number): TrenZavdannia {
  const h = r.chyslo(1, 12);
  const m = krok * r.chyslo(0, 60 / krok - 1);
  const pidkazka =
    m === 0
      ? 'Довга стрілка на 12 — рівно. Куди показує коротка?'
      : `Довга стрілка: рахуй по 5 хвилин від 12. Коротка вже пройшла ${h}, але ще не дійшла до ${h === 12 ? 1 : h + 1}.`;
  return {
    malunok: hodynnyk(h, m),
    pytannia: 'Котра година? Запиши так: 3:15.',
    vidpovid: zapys(h, m),
    perevirka: perevirkaChasu(h, m),
    pidkazka,
    rozviazok: `Коротка стрілка — ${h} год, довга — ${m} хв: ${zapys(h, m)}.`,
  };
}

function cherez(r: Vypadok): TrenZavdannia {
  const h = r.chyslo(1, 11);
  const m = 5 * r.chyslo(0, 7);
  const dodaty = 5 * r.chyslo(2, 12 - m / 5 - 0);
  const m2 = m + dodaty;
  const [h2, mm2] = m2 >= 60 ? [h + 1, m2 - 60] : [h, m2];
  return {
    malunok: hodynnyk(h, m),
    pytannia: `Котра година буде через ${dodaty} хв?`,
    vidpovid: zapys(h2, mm2),
    perevirka: perevirkaChasu(h2, mm2),
    pidkazka: `Зараз ${zapys(h, m)}. Додай ${dodaty} хв до хвилин.`,
    rozviazok: `${zapys(h, m)} + ${dodaty} хв = ${zapys(h2, mm2)}`,
  };
}

function minulo(r: Vypadok): TrenZavdannia {
  const h = r.chyslo(1, 11);
  const m1 = 5 * r.chyslo(0, 8);
  const m2 = 5 * r.chyslo(m1 / 5 + 1, 11);
  return {
    pytannia: `Урок малювання почався о ${zapys(h, m1)} і закінчився о ${zapys(h, m2)}. Скільки хвилин він тривав?`,
    vidpovid: m2 - m1,
    odynytsi: 'хв',
    pidkazka: 'Година та сама — віднімай хвилини.',
    rozviazok: `${m2} − ${m1} = ${m2 - m1} (хв)`,
  };
}

function odynytsi(r: Vypadok): TrenZavdannia {
  return r.vybir<TrenZavdannia>([
    { pytannia: 'Скільки хвилин в 1 годині?', vidpovid: 60, odynytsi: 'хв', pidkazka: 'Повне коло довгої стрілки.', rozviazok: '1 год = 60 хв' },
    { pytannia: 'Скільки хвилин у пів години?', vidpovid: 30, odynytsi: 'хв', pidkazka: 'Половина від 60.', rozviazok: '60 : 2 = 30 (хв)' },
    { pytannia: 'Скільки хвилин у чверті години?', vidpovid: 15, odynytsi: 'хв', pidkazka: 'Чверть кола — від 12 до 3.', rozviazok: '60 : 4 = 15 (хв)' },
    { pytannia: 'Скільки годин у добі?', vidpovid: 24, odynytsi: 'год', pidkazka: 'Коротка стрілка обходить коло двічі.', rozviazok: '12 + 12 = 24 (год)' },
  ]);
}

export default {
  rivni: ['рівно і пів на', 'кожні 5 хвилин', 'через скільки хвилин і скільки минуло'],
  zavdannia(r, riven) {
    if (riven === 1) return kotraHodyna(r, 30);
    if (riven === 2) return r.shans(0.85) ? kotraHodyna(r, r.vybir([15, 5])) : odynytsi(r);
    return r.vybir([cherez, cherez, minulo, () => kotraHodyna(r, 5)])(r);
  },
} satisfies Henerator;
