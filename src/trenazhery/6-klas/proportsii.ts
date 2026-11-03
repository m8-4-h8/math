// Пропорції: a : b = c : d правильна, коли добуток крайніх дорівнює добутку середніх; невідомий крайній
// член — добуток середніх : відомий крайній, невідомий середній — навпаки; задачі через пропорцію.
import { des, mnozh, nsd, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function chotyry(r: Vypadok) {
  for (;;) {
    const [a, b] = r.rizni(2, 2, 9);
    const k = r.chyslo(2, 5);
    if (nsd(a, b) === 1 || r.shans(0.3)) return { a, b, c: a * k, d: b * k };
  }
}

function chyPravylna(r: Vypadok): TrenZavdannia {
  let { a, b, c, d } = chotyry(r);
  const tak = r.shans();
  if (!tak) d += r.vybir([-2, -1, 1, 2]);
  if (d <= 0 || a * d === b * c) return chyPravylna(r);
  return {
    pytannia: 'Чи правильна пропорція?',
    vyraz: `$${a} : ${b} = ${c} : ${d}$`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Порівняй добуток крайніх і добуток середніх.',
    rozviazok: `Крайні: ${a} · ${d} = ${a * d}; середні: ${b} · ${c} = ${b * c}. ${tak ? 'Рівні — пропорція правильна.' : 'Не рівні — пропорція неправильна.'}`,
  };
}

function nevidomyi(r: Vypadok): TrenZavdannia {
  const { a, b, c, d } = chotyry(r);
  const mistse = r.chyslo(0, 3);
  const chleny = [a, b, c, d];
  const x = chleny[mistse];
  const zapys = chleny.map((v, i) => (i === mistse ? 'x' : String(v)));
  const krainii = mistse === 0 || mistse === 3;
  const [p, q] = krainii ? [b, c] : [a, d];
  const vidomyi = krainii ? chleny[3 - mistse] : chleny[3 - mistse];
  return {
    pytannia: 'Знайди x.',
    vyraz: `$${zapys[0]} : ${zapys[1]} = ${zapys[2]} : ${zapys[3]}$`,
    vidpovid: x,
    pidkazka: krainii ? `x — крайній член. Помнож середні: ${b} · ${c}.` : `x — середній член. Помнож крайні: ${a} · ${d}.`,
    rozviazok: `x = ${p} · ${q} : ${vidomyi} = ${p * q} : ${vidomyi} = ${x}`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  // 1,2 : x = 3 : 5 → x = 1,2 · 5 : 3 = 2
  const [c, d] = r.rizni(2, 2, 9);
  const x10 = c * r.chyslo(1, 6); // x у десятих, кратне c, щоб a вийшло «гарним»
  const a10 = (x10 * c) / d;
  if (!Number.isInteger(a10) || a10 % 10 === 0) return desiatkovi(r);
  return {
    pytannia: 'Знайди x.',
    vyraz: `$${tdes(a10, 1)} : x = ${c} : ${d}$`,
    vidpovid: des(x10, 1),
    pidkazka: `x — середній член. Помнож крайні: ${des(a10, 1)} · ${d}.`,
    rozviazok: `x = ${des(a10, 1)} · ${d} : ${c} = ${des(a10 * d, 1)} : ${c} = ${des(x10, 1)}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { umova: (a: number, b: number, c: number) => `${a} кг яблук коштують ${b} грн. Скільки коштують ${c} кг таких яблук?`, u: [25, 60], od: 'грн' },
    {
      umova: (a: number, b: number, c: number) =>
        `На ${a} ${mnozh(a, '', 'однакові сорочки', 'однакових сорочок')} пішло ${b} м тканини. Скільки метрів піде на ${c} ${mnozh(c, '', 'такі сорочки', 'таких сорочок')}?`,
      u: [2, 3],
      od: 'м',
    },
    { umova: (a: number, b: number, c: number) => `Автомобіль на ${a}0 км витрачає ${b} л бензину. Скільки літрів він витратить на ${c}0 км?`, u: [1, 2], od: 'л' },
  ]);
  const u = r.chyslo(s.u[0], s.u[1]);
  const [a, c] = r.rizni(2, 2, 9);
  return {
    pytannia: s.umova(a, u * a, c),
    vidpovid: u * c,
    odynytsi: s.od,
    pidkazka: `Склади пропорцію: ${a} : ${c} = ${u * a} : x.`,
    rozviazok: `${a} : ${c} = ${u * a} : x; x = ${c} · ${u * a} : ${a} = ${u * c}`,
  };
}

export default {
  rivni: ['чи правильна пропорція', 'невідомий член', 'десяткові дроби і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? chyPravylna(r) : nevidomyi(r);
    if (riven === 2) return r.shans(0.8) ? nevidomyi(r) : chyPravylna(r);
    return r.vybir([desiatkovi, zadacha, zadacha, nevidomyi])(r);
  },
} satisfies Henerator;
