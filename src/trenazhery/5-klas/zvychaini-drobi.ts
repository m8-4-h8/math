// Звичайні дроби: дріб за малюнком, чисельник і знаменник, порівняння, рівні дроби, яка частина цілого.
import { mnozh, nsd, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { smuzhka } from '../malunky.ts';

function zaMalunkom(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(3, 10);
  const n = r.chyslo(1, d - 1);
  return r.shans(0.7)
    ? {
        pytannia: 'Яку частину смужки зафарбовано? Запиши дріб через риску, наприклад 2/5.',
        malunok: smuzhka(n, d),
        vidpovid: `${n}/${d}`,
        perevirka: rivnyiDrib(n, d),
        pidkazka: 'Знаменник — на скільки рівних частин поділили. Чисельник — скільки взяли.',
        rozviazok: `Усього ${d} ${mnozh(d, 'частина', 'частини', 'частин')}, зафарбовано ${n} — це $${tdrib(n, d)}$.`,
      }
    : {
        pytannia: 'Яку частину смужки НЕ зафарбовано? Запиши дріб через риску.',
        malunok: smuzhka(n, d),
        vidpovid: `${d - n}/${d}`,
        perevirka: rivnyiDrib(d - n, d),
        pidkazka: 'Порахуй білі клітинки.',
        rozviazok: `Усього ${d} ${mnozh(d, 'частина', 'частини', 'частин')}, білих ${d - n} — це $${tdrib(d - n, d)}$.`,
      };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const s = r.vybir([
    { shcho: 'Піцу розрізали на', chastyn: [4, 6, 8, 12], diia: "з'їли" },
    { shcho: 'Шоколадку поділили на', chastyn: [6, 8, 10, 12, 15, 16], diia: "з'їли" },
    { shcho: 'Стрічку розрізали на', chastyn: [5, 7, 9, 10], diia: 'використали' },
  ]);
  const d = r.vybir(s.chastyn);
  const n = r.chyslo(1, d - 1);
  return {
    pytannia: `${s.shcho} ${d} ${mnozh(d, 'рівну частину', 'рівні частини', 'рівних частин')} і ${s.diia} ${n}. Яку частину ${s.diia}? Запиши дріб через риску.`,
    vidpovid: `${n}/${d}`,
    perevirka: rivnyiDrib(n, d),
    pidkazka: 'Знаменник — на скільки частин поділили, чисельник — скільки взяли.',
    rozviazok: nsd(n, d) > 1 ? `$${tdrib(n, d)} = ${tvidpovidDrib(n, d)}$` : `$${tdrib(n, d)}$`,
  };
}

function porivniaty(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    // Однакові знаменники: більший той, у кого більший чисельник.
    const d = r.chyslo(5, 15);
    const [a, b] = r.rizni(2, 1, d - 1);
    return {
      pytannia: 'Порівняй дроби.',
      vyraz: `$${tdrib(a, d)}$ □ $${tdrib(b, d)}$`,
      vidpovid: a > b ? '>' : '<',
      varianty: ['>', '<', '='],
      pidkazka: 'Знаменники однакові — частини однакові. Де їх більше?',
      rozviazok: `Частини однакові, ${Math.max(a, b)} частин більше, ніж ${Math.min(a, b)}.`,
    };
  }
  // Однакові чисельники: більший той, у кого менший знаменник (більші шматки).
  const n = r.chyslo(1, 4);
  const [a, b] = r.rizni(2, n + 1, 12);
  return {
    pytannia: 'Порівняй дроби.',
    vyraz: `$${tdrib(n, a)}$ □ $${tdrib(n, b)}$`,
    vidpovid: a < b ? '>' : '<',
    varianty: ['>', '<', '='],
    pidkazka: 'Чисельники однакові. Що більше: шматок, коли ділимо на менше частин, чи на більше?',
    rozviazok: `Ділимо на ${Math.min(a, b)} частин — шматки більші, ніж коли на ${Math.max(a, b)}. Тож $${tdrib(n, Math.min(a, b))} > ${tdrib(n, Math.max(a, b))}$.`,
  };
}

function rivni(r: Vypadok): TrenZavdannia {
  let d = r.chyslo(2, 9);
  let n = r.chyslo(1, d - 1);
  const g = nsd(n, d);
  n /= g;
  d /= g;
  const k = r.chyslo(2, 6);
  if (r.shans()) {
    return {
      pytannia: 'Яке число у віконці?',
      vyraz: `$${tdrib(n, d)} = \\frac{\\square}{${d * k}}$`,
      vidpovid: n * k,
      pidkazka: `Знаменник збільшили в ${k} рази. Чисельник — так само.`,
      rozviazok: `$${tdrib(n, d)} = \\frac{${n} \\cdot ${k}}{${d} \\cdot ${k}} = ${tdrib(n * k, d * k)}$`,
    };
  }
  return {
    pytannia: 'Яке число у віконці?',
    vyraz: `$${tdrib(n * k, d * k)} = \\frac{\\square}{${d}}$`,
    vidpovid: n,
    pidkazka: `Знаменник зменшили в ${k} рази. Чисельник — так само.`,
    rozviazok: `$${tdrib(n * k, d * k)} = \\frac{${n * k} : ${k}}{${d * k} : ${k}} = ${tdrib(n, d)}$`,
  };
}

// «Яку частину години становлять 20 хв?» — дріб від величини, скорочуємо.
function chastynaVelychyny(r: Vypadok): TrenZavdannia {
  const v = r.vybir([
    { tsile: 60, nazva: 'години', odna: '1 год', odyn: 'хв' },
    { tsile: 100, nazva: 'метра', odna: '1 м', odyn: 'см' },
    { tsile: 1000, nazva: 'кілограма', odna: '1 кг', odyn: 'г' },
    { tsile: 24, nazva: 'доби', odna: '1 доба', odyn: 'год' },
    { tsile: 12, nazva: 'року', odna: '1 рік', odyn: 'міс.' },
  ]);
  const dilnyky = Array.from({ length: v.tsile - 1 }, (_, i) => i + 1).filter((x) => v.tsile % x === 0 && x > 1 && x <= 12);
  const d = r.vybir(dilnyky);
  const n = r.chyslo(1, d - 1);
  const chastyna = (v.tsile / d) * n;
  const [a, b] = [n / nsd(n, d), d / nsd(n, d)];
  return {
    pytannia: `Яку частину ${v.nazva} становлять ${chastyna} ${v.odyn}? Запиши нескоротним дробом.`,
    vidpovid: vidpovidDrib(a, b)[0],
    perevirka: rivnyiDrib(a, b),
    pidkazka: `${v.odna} = ${v.tsile} ${v.odyn}. Дріб: ${chastyna}/${v.tsile}, а тоді скороти.`,
    rozviazok: `$\\frac{${chastyna}}{${v.tsile}} = ${tdrib(a, b)}$`,
  };
}

export default {
  rivni: ['дріб за малюнком і в задачі', 'порівняння і рівні дроби', 'частина величини'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? zaMalunkom(r) : zadacha(r);
    if (riven === 2) return r.vybir([porivniaty, porivniaty, rivni, zaMalunkom])(r);
    return r.vybir([chastynaVelychyny, chastynaVelychyny, rivni, porivniaty])(r);
  },
} satisfies Henerator;
