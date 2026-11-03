// Зведення дробів до спільного знаменника: додатковий множник; найменший спільний знаменник — НСК
// знаменників; порівняння дробів з різними знаменниками (і з однаковими чисельниками).
import { nsd, nsk, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function neskorotnyi(r: Vypadok, b: number) {
  for (;;) {
    const a = r.chyslo(1, b - 1);
    if (nsd(a, b) === 1) return a;
  }
}

function dodatkovyi(r: Vypadok): TrenZavdannia {
  const b = r.chyslo(2, 12);
  const a = neskorotnyi(r, b);
  const k = r.chyslo(2, 8);
  return {
    pytannia: `Зведи дріб $${tdrib(a, b)}$ до знаменника ${b * k}. Який вийде чисельник?`,
    vyraz: `$${tdrib(a, b)} = \\frac{\\square}{${b * k}}$`,
    vidpovid: a * k,
    pidkazka: `Додатковий множник: ${b * k} : ${b}.`,
    rozviazok: `${b * k} : ${b} = ${k} — додатковий множник; ${a} · ${k} = ${a * k}.`,
  };
}

function naimenshyi(r: Vypadok): TrenZavdannia {
  const [b, d] = r.rizni(2, 2, 15);
  const [a, c] = [neskorotnyi(r, b), neskorotnyi(r, d)];
  const s = nsk(b, d);
  return {
    pytannia: `Який найменший спільний знаменник у дробів $${tdrib(a, b)}$ і $${tdrib(c, d)}$?`,
    vidpovid: s,
    pidkazka: `Шукай найменше число, яке ділиться і на ${b}, і на ${d}.`,
    rozviazok: `НСК(${b}; ${d}) = ${s}.${s === b * d ? ` Спільних дільників немає, тож ${b} · ${d} = ${s}.` : ''}`,
  };
}

function porivniaty(r: Vypadok, odnakoviChyselnyky: boolean): TrenZavdannia {
  for (;;) {
    const [b, d] = r.rizni(2, 2, 15);
    let [a, c] = [neskorotnyi(r, b), neskorotnyi(r, d)];
    if (odnakoviChyselnyky) c = a;
    if (c >= d) continue;
    if (!odnakoviChyselnyky && Math.abs(a / b - c / d) > 0.2) continue; // близькі дроби — на око не видно
    const s = nsk(b, d);
    const [x, y] = [(a * s) / b, (c * s) / d];
    const znak = x > y ? '>' : x < y ? '<' : '=';
    if (znak === '=' && r.shans(0.8)) continue;
    return {
      pytannia: 'Порівняй дроби.',
      vyraz: `$${tdrib(a, b)}$ □ $${tdrib(c, d)}$`,
      vidpovid: znak,
      varianty: ['>', '<', '='],
      pidkazka: odnakoviChyselnyky ? 'Чисельники однакові. У якого дробу частинки більші?' : `Зведи до спільного знаменника ${s}.`,
      rozviazok: odnakoviChyselnyky
        ? `Чисельники однакові, тож більший той, у кого менший знаменник: $${tdrib(a, b)} ${znak} ${tdrib(c, d)}$.`
        : `$${tdrib(a, b)} = ${tdrib(x, s)}$, $${tdrib(c, d)} = ${tdrib(y, s)}$; ${x} ${znak} ${y}, тож $${tdrib(a, b)} ${znak} ${tdrib(c, d)}$.`,
    };
  }
}

export default {
  rivni: ['додатковий множник', 'найменший спільний знаменник', 'порівнюємо дроби'],
  zavdannia(r, riven) {
    if (riven === 1) return dodatkovyi(r);
    if (riven === 2) return r.shans(0.6) ? naimenshyi(r) : dodatkovyi(r);
    return r.shans(0.75) ? porivniaty(r, false) : porivniaty(r, true);
  },
} satisfies Henerator;
