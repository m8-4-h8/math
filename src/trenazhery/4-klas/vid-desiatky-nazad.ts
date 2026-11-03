// Цифра частки «від десятки назад»: пробуємо дільник · 10, зайве = дільник · 10 − ділене,
// відкидаємо стільки дільників, щоб покрити зайве (розподільна властивість: a · (10 − c) = a · 10 − a · c).
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// Ділене менше за дільник · 10, частка — одна цифра від 5 до 9 (саме тоді «назад від 10» швидше).
function pryklad(r: Vypadok, zOstacheiu: boolean) {
  const d = r.chyslo(12, 89);
  const q = r.chyslo(5, 9);
  const ost = zOstacheiu ? r.chyslo(1, d - 1) : 0;
  const dilene = d * q + ost;
  const zaive = d * 10 - dilene;
  const vidkynuty = 10 - q; // = ceil(zaive / d)
  return { d, q, ost, dilene, zaive, vidkynuty };
}

// «33 · 4 = 132 — замало, 33 · 5 = 165 — вистачає.» Якщо зайве менше за дільник — один дільник уже покриває.
function pokryty(p: ReturnType<typeof pryklad>) {
  if (p.vidkynuty === 1) return `${p.zaive} менше за ${p.d}, тож вистачає одного дільника.`;
  const k = p.vidkynuty;
  return `${p.d} · ${k - 1} = ${p.d * (k - 1)} — замало, ${p.d} · ${k} = ${p.d * k} — вистачає.`;
}

function zaive(r: Vypadok): TrenZavdannia {
  const p = pryklad(r, false);
  return {
    pytannia: `Ділимо ${p.dilene} : ${p.d}. Пробуємо 10: ${p.d} · 10 = ${p.d * 10}. Скільки зайвого?`,
    vyraz: `${p.d * 10} − ${p.dilene} =`,
    vidpovid: p.zaive,
    pidkazka: 'Зайве — це на скільки дільник · 10 більший за ділене.',
    rozviazok: `${p.d * 10} − ${p.dilene} = ${p.zaive} — це ${p.vidkynuty} по ${p.d}, бо ${p.d} · ${p.vidkynuty} = ${p.zaive}.`,
  };
}

function skilkyVidkynuty(r: Vypadok): TrenZavdannia {
  const p = pryklad(r, false);
  return {
    pytannia: `${p.dilene} : ${p.d}. Зайве: ${p.d * 10} − ${p.dilene} = ${p.zaive}. Скільки дільників відкинути?`,
    vyraz: `${p.d} · □ = ${p.zaive}`,
    vidpovid: p.vidkynuty,
    pidkazka: `Скільки разів ${p.d} вміщається в ${p.zaive}?`,
    rozviazok: `${p.d} · ${p.vidkynuty} = ${p.zaive}, відкидаємо ${p.vidkynuty}: цифра частки 10 − ${p.vidkynuty} = ${p.q}.`,
  };
}

function tsyfraChastky(r: Vypadok): TrenZavdannia {
  const p = pryklad(r, false);
  return {
    pytannia: 'Знайди частку «від десятки назад».',
    vyraz: `${p.dilene} : ${p.d} =`,
    vidpovid: p.q,
    pidkazka: `${p.d} · 10 = ${p.d * 10}. На скільки це більше за ${p.dilene}? Скільки це дільників?`,
    rozviazok: `${p.d} · 10 = ${p.d * 10}; ${p.d * 10} − ${p.dilene} = ${p.zaive} = ${p.d} · ${p.vidkynuty}; 10 − ${p.vidkynuty} = ${p.q}. Перевірка: ${p.d} · ${p.q} = ${p.dilene}.`,
  };
}

// Зайве не ділиться націло: відкидаємо з запасом, а «перекрите» стає остачею.
function zOstacheiu(r: Vypadok): TrenZavdannia {
  const p = pryklad(r, true);
  return {
    pytannia: 'Поділи з остачею «від десятки назад». Запиши частку й остачу.',
    vyraz: `${p.dilene} : ${p.d} =`,
    vidpovid: `${p.q} (ост. ${p.ost})`,
    pidkazka: `Зайве ${p.d * 10} − ${p.dilene} = ${p.zaive}. Відкинь стільки по ${p.d}, щоб покрити все зайве.`,
    rozviazok: `${p.d * 10} − ${p.dilene} = ${p.zaive}; ${pokryty(p)} Цифра 10 − ${p.vidkynuty} = ${p.q}; ${p.dilene} − ${p.d * p.q} = ${p.ost} — остача.`,
  };
}

function zapasom(r: Vypadok): TrenZavdannia {
  const p = pryklad(r, true);
  return {
    pytannia: `${p.dilene} : ${p.d}. Зайве ${p.zaive} не ділиться на ${p.d} націло. Скільки дільників відкинути з запасом?`,
    vidpovid: p.vidkynuty,
    pidkazka: `Потрібно найменше число дільників, яке покриває ${p.zaive}: ${p.d} · □ ≥ ${p.zaive}.`,
    rozviazok: `${pokryty(p)} Відкидаємо ${p.vidkynuty}.`,
  };
}

export default {
  rivni: ['зайве і скільки відкинути', 'цифра частки', 'з остачею: відкидаємо з запасом'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? zaive(r) : skilkyVidkynuty(r);
    if (riven === 2) return r.shans(0.7) ? tsyfraChastky(r) : skilkyVidkynuty(r);
    return r.vybir([zOstacheiu, zOstacheiu, zapasom, tsyfraChastky])(r);
  },
} satisfies Henerator;
