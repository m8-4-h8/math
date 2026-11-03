// Види трикутників за кутами (гострокутний, прямокутний, тупокутний) і за сторонами (різносторонній,
// рівнобедрений, рівносторонній); сума кутів 180°; периметри рівнобедреного і рівностороннього.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ZA_KUTAMY = ['гострокутний', 'прямокутний', 'тупокутний'];
const ZA_STORONAMY = ['різносторонній', 'рівнобедрений', 'рівносторонній'];

function kuty(r: Vypadok) {
  const typ = r.chyslo(0, 2);
  const naibilshyi = typ === 0 ? r.chyslo(61, 89) : typ === 1 ? 90 : r.chyslo(91, 150);
  const reshta = 180 - naibilshyi;
  // Два інші кути — не менші за 5° і менші за найбільший.
  const a = r.chyslo(Math.max(5, reshta - (naibilshyi - 1)), Math.min(naibilshyi - 1, reshta - 5));
  const b = reshta - a;
  return { kuty: r.peremishaty([naibilshyi, a, b]), vyd: ZA_KUTAMY[typ], naibilshyi };
}

function zaKutamy(r: Vypadok): TrenZavdannia {
  const k = kuty(r);
  return {
    pytannia: `Кути трикутника ${k.kuty.map((x) => `${x}°`).join(', ')}. Який це трикутник за кутами?`,
    vidpovid: k.vyd,
    varianty: ZA_KUTAMY,
    pidkazka: 'Дивись на найбільший кут: менший за 90°, рівно 90° чи більший?',
    rozviazok: `Найбільший кут ${k.naibilshyi}° — ${k.naibilshyi < 90 ? 'гострий, тож трикутник гострокутний' : k.naibilshyi === 90 ? 'прямий, тож трикутник прямокутний' : 'тупий, тож трикутник тупокутний'}.`,
  };
}

function zaStoronamy(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const a = r.chyslo(3, 15);
  let s: number[];
  if (typ === 2) s = [a, a, a];
  else if (typ === 1) {
    const b = r.krim(Math.max(2, Math.ceil(a / 2)), 2 * a - 1, [a]);
    s = r.peremishaty([a, a, b]);
  } else {
    const b = r.krim(Math.max(2, Math.floor(a / 2) + 1), a + 5, [a]);
    const c = r.krim(Math.abs(a - b) + 1, a + b - 1, [a, b]);
    s = r.peremishaty([a, b, c]);
  }
  return {
    pytannia: `Сторони трикутника ${s.join(' см, ')} см. Який це трикутник за сторонами (найточніша назва)?`,
    vidpovid: ZA_STORONAMY[typ],
    varianty: ZA_STORONAMY,
    pidkazka: 'Скільки сторін однакові: жодної пари, дві чи всі три?',
    rozviazok: typ === 2 ? 'Усі три сторони рівні — рівносторонній.' : typ === 1 ? 'Дві сторони рівні — рівнобедрений.' : 'Усі сторони різні — різносторонній.',
  };
}

function tretiiKut(r: Vypadok): TrenZavdannia {
  const k = kuty(r).kuty;
  return {
    pytannia: `Два кути трикутника ${k[0]}° і ${k[1]}°. Знайди третій кут.`,
    vidpovid: k[2],
    odynytsi: '°',
    pidkazka: 'Сума кутів трикутника — 180°.',
    rozviazok: `180° − (${k[0]}° + ${k[1]}°) = 180° − ${k[0] + k[1]}° = ${k[2]}°`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const a = r.chyslo(3, 25);
  if (typ === 0) {
    return {
      pytannia: `Периметр рівностороннього трикутника ${3 * a} см. Знайди його сторону.`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Усі три сторони рівні.',
      rozviazok: `${3 * a} : 3 = ${a} (см)`,
    };
  }
  const osnova = r.krim(2, 2 * a - 1, [a]);
  if (typ === 1) {
    return {
      pytannia: `У рівнобедреного трикутника бічна сторона ${a} см, основа ${osnova} см. Знайди периметр.`,
      vidpovid: 2 * a + osnova,
      odynytsi: 'см',
      pidkazka: 'Бічних сторін дві, і вони рівні.',
      rozviazok: `${a} · 2 + ${osnova} = ${2 * a + osnova} (см)`,
    };
  }
  return {
    pytannia: `Периметр рівнобедреного трикутника ${2 * a + osnova} см, основа ${osnova} см. Знайди бічну сторону.`,
    vidpovid: a,
    odynytsi: 'см',
    pidkazka: 'Відніми основу — лишаться дві рівні бічні сторони.',
    rozviazok: `(${2 * a + osnova} − ${osnova}) : 2 = ${2 * a} : 2 = ${a} (см)`,
  };
}

export default {
  rivni: ['вид за кутами і за сторонами', 'третій кут трикутника', 'периметр рівнобедреного і рівностороннього'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? zaKutamy(r) : zaStoronamy(r);
    if (riven === 2) return r.vybir([tretiiKut, tretiiKut, zaKutamy, zaStoronamy])(r);
    return r.vybir([perymetr, perymetr, tretiiKut])(r);
  },
} satisfies Henerator;
