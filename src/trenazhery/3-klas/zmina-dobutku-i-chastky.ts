// Як змінюється добуток і частка (3 клас): один множник у кілька разів більший (менший) — добуток так само;
// ділене в кілька разів більше — частка так само; дільник у кілька разів більший — частка в стільки ж разів менша.
import { mnozh, nsd, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const raz = (k: number) => `${k} ${mnozh(k, 'раз', 'рази', 'разів')}`;

function dobutok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const a = r.chyslo(2, 9);
    const k = r.chyslo(2, 4);
    const b = r.chyslo(2, 5);
    const B = b * k;
    if (a * B > 100 || B > 10) continue;
    // Відоме — менший добуток, шукаємо більший, або навпаки.
    const bilshyi = r.shans(0.6);
    const [m1, m2] = bilshyi ? [b, B] : [B, b];
    const pershyi = r.shans();
    const zapys = (m: number) => (pershyi ? `${m} · ${a}` : `${a} · ${m}`);
    const tex = (m: number) => (pershyi ? `${m} \\cdot ${a}` : `${a} \\cdot ${m}`);
    return {
      pytannia: `Відомо: $${tex(m1)} = ${a * m1}$. Знайди значення виразу, не множачи заново.`,
      vyraz: `${zapys(m2)} =`,
      vidpovid: a * m2,
      pidkazka: `Множник ${m1} став ${m2}: ${bilshyi ? 'збільшився' : 'зменшився'} в ${raz(k)}.`,
      rozviazok: bilshyi
        ? `Множник збільшився в ${raz(k)}, тож і добуток: ${a * m1} · ${k} = ${a * m2}.`
        : `Множник зменшився в ${raz(k)}, тож і добуток: ${a * m1} : ${k} = ${a * m2}.`,
    };
  }
}

function dilene(r: Vypadok): TrenZavdannia {
  for (;;) {
    const d = r.chyslo(2, 9);
    const k = r.chyslo(2, 4);
    const q = r.chyslo(1, 5);
    const Q = q * k;
    if (d * Q > 100 || Q > 10) continue;
    const bilshe = r.shans(0.6);
    const [q1, q2] = bilshe ? [q, Q] : [Q, q];
    return {
      pytannia: `Відомо: $${d * q1} : ${d} = ${q1}$. Знайди значення виразу, не ділячи заново.`,
      vyraz: `${d * q2} : ${d} =`,
      vidpovid: q2,
      pidkazka: `Ділене ${d * q1} стало ${d * q2}: ${bilshe ? 'збільшилось' : 'зменшилось'} у ${raz(k)}. А дільник той самий.`,
      rozviazok: bilshe
        ? `Ділене збільшилось у ${raz(k)}, тож і частка: ${q1} · ${k} = ${q2}.`
        : `Ділене зменшилось у ${raz(k)}, тож і частка: ${q1} : ${k} = ${q2}.`,
    };
  }
}

function dilnyk(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = r.chyslo(1, 5);
    const k = r.chyslo(2, 4);
    const d = r.chyslo(1, 5);
    const D = d * k;
    const dilene = q * D;
    if (dilene > 100 || dilene < 8 || D > 10 || q * k > 10) continue;
    // Дільник d → D (більший): частка q · k → q (менша). Або навпаки.
    const bilshyi = r.shans(0.6);
    const [d1, d2] = bilshyi ? [d, D] : [D, d];
    const [q1, q2] = bilshyi ? [q * k, q] : [q, q * k];
    if (d1 === 1 || d2 === 1) continue;
    return {
      pytannia: `Відомо: $${dilene} : ${d1} = ${q1}$. Знайди значення виразу, не ділячи заново.`,
      vyraz: `${dilene} : ${d2} =`,
      vidpovid: q2,
      pidkazka: `Дільник ${d1} став ${d2}. Ділимо на ${bilshyi ? 'більше' : 'менше'} частин — кожна частина ${bilshyi ? 'менша' : 'більша'}.`,
      rozviazok: bilshyi
        ? `Дільник збільшився в ${raz(k)}, тож частка зменшилась у ${raz(k)}: ${q1} : ${k} = ${q2}.`
        : `Дільник зменшився в ${raz(k)}, тож частка збільшилась у ${raz(k)}: ${q1} · ${k} = ${q2}.`,
    };
  }
}

function yakZminytsia(r: Vypadok, lyshDobutok = false): TrenZavdannia {
  const k = r.chyslo(2, 5);
  const bilshe = r.shans();
  const shcho = lyshDobutok ? 'mnozhnyk' : r.vybir(['mnozhnyk', 'dilene', 'dilnyk'] as const);
  const dieslovo = bilshe ? 'збільшити' : 'зменшити';
  const pytannia = {
    mnozhnyk: `Як зміниться добуток, якщо один множник ${dieslovo} в ${raz(k)}, а другий не змінювати?`,
    dilene: `Як зміниться частка, якщо ділене ${dieslovo} в ${raz(k)}, а дільник не змінювати?`,
    dilnyk: `Як зміниться частка, якщо дільник ${dieslovo} в ${raz(k)}, а ділене не змінювати?`,
  }[shcho];
  // Для дільника — навпаки: більший дільник дає меншу частку.
  const rezultatBilshe = shcho === 'dilnyk' ? !bilshe : bilshe;
  const zb = `збільшиться в ${raz(k)}`;
  const zm = `зменшиться в ${raz(k)}`;
  const na = bilshe ? `збільшиться на ${k}` : `зменшиться на ${k}`;
  return {
    pytannia,
    vidpovid: rezultatBilshe ? zb : zm,
    varianty: [zb, zm, na],
    pidkazka:
      shcho === 'dilnyk'
        ? 'Дільник — це на скільки частин ділимо. Що більше частин, то менша кожна.'
        : 'У скільки разів змінили одне число, у стільки ж разів зміниться і результат.',
    rozviazok: {
      mnozhnyk: `Множник у ${raz(k)} ${bilshe ? 'більший' : 'менший'} — добуток теж у ${raz(k)} ${bilshe ? 'більший' : 'менший'}.`,
      dilene: `Ділене у ${raz(k)} ${bilshe ? 'більше' : 'менше'} — частка теж у ${raz(k)} ${bilshe ? 'більша' : 'менша'}.`,
      dilnyk: `Дільник у ${raz(k)} ${bilshe ? 'більший' : 'менший'} — частка у ${raz(k)} ${bilshe ? 'менша' : 'більша'}.`,
    }[shcho],
  };
}

function porivniaty(r: Vypadok): TrenZavdannia {
  if (r.shans(0.6)) {
    // Те саме ділене, різні дільники: більший дільник — менша частка.
    for (;;) {
      const [d1, d2] = r.rizni(2, 2, 9);
      const spilne = (d1 * d2) / nsd(d1, d2);
      const k = r.chyslo(1, Math.floor(90 / spilne) || 1);
      const D = spilne * k;
      if (D > 90 || D / d1 > 10 || D / d2 > 10) continue;
      return {
        pytannia: 'Порівняй, не обчислюючи.',
        vyraz: `$${D} : ${d1}$ □ $${D} : ${d2}$`,
        vidpovid: d1 < d2 ? '>' : '<',
        varianty: ['>', '<', '='],
        pidkazka: 'Ділене те саме. Де ділимо на більше частин?',
        rozviazok: `Ділене однакове, а дільник ${Math.max(d1, d2)} більший за ${Math.min(d1, d2)}, тож частка $${D} : ${Math.max(d1, d2)}$ менша. Перевірка: ${D} : ${d1} = ${D / d1}, ${D} : ${d2} = ${D / d2}.`,
      };
    }
  }
  const a = r.chyslo(2, 9);
  const [b1, b2] = r.rizni(2, 1, 10);
  return {
    pytannia: 'Порівняй, не обчислюючи.',
    vyraz: `$${a} \\cdot ${b1}$ □ $${a} \\cdot ${b2}$`,
    vidpovid: b1 > b2 ? '>' : '<',
    varianty: ['>', '<', '='],
    pidkazka: 'Один множник однаковий. Порівняй інші множники.',
    rozviazok: `Множник ${a} однаковий, а ${Math.max(b1, b2)} > ${Math.min(b1, b2)}, тож більший добуток $${a} \\cdot ${Math.max(b1, b2)}$. Перевірка: ${a} · ${b1} = ${a * b1}, ${a} · ${b2} = ${a * b2}.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.vybir(['robota', 'tsina', 'tsukerky', 'yashchyky'] as const);
  for (;;) {
    const k = r.chyslo(2, 4);
    if (vyd === 'robota') {
      const za1 = r.chyslo(2, 9);
      const t = r.chyslo(1, 3);
      if (za1 * t * k > 100 || t === 1) continue;
      return {
        pytannia: `За ${t} год майстер виготовляє ${za1 * t} ${mnozh(za1 * t, 'деталь', 'деталі', 'деталей')}. Скільки деталей він виготовить за ${t * k} год, якщо працюватиме так само?`,
        vidpovid: za1 * t * k,
        pidkazka: `Час ${t} год → ${t * k} год: у скільки разів більше?`,
        rozviazok: `Часу в ${raz(k)} більше, тож і деталей: ${za1 * t} · ${k} = ${za1 * t * k}.`,
      };
    }
    if (vyd === 'tsina') {
      const tsina = r.chyslo(2, 9);
      const n = r.chyslo(2, 4);
      if (tsina * n * k > 100) continue;
      const rich = r.vybir([
        ['зошити', 'зошитів', 'таких зошитів'],
        ['ручки', 'ручок', 'таких ручок'],
        ['блокноти', 'блокнотів', 'таких блокнотів'],
      ]);
      return {
        pytannia: `${n} однакові ${rich[0]} коштують ${tsina * n} грн. Скільки коштують ${n * k} ${rich[2]}?`,
        vidpovid: tsina * n * k,
        odynytsi: 'грн',
        pidkazka: `${rich[1].charAt(0).toUpperCase() + rich[1].slice(1)} стало в ${raz(k)} більше. Що буде з вартістю?`,
        rozviazok: `${n} → ${n * k}: у ${raz(k)} більше, тож і вартість: ${tsina * n} · ${k} = ${tsina * n * k} (грн).`,
      };
    }
    if (vyd === 'tsukerky') {
      // Ті самі цукерки ділять між більшою кількістю дітей — кожному менше.
      const q = r.chyslo(1, 5);
      const d = r.chyslo(2, 4);
      const D = d * k;
      const vsi = q * D;
      if (vsi > 60 || D > 10) continue;
      return {
        pytannia: `${vsi} ${mnozh(vsi, 'цукерку', 'цукерки', 'цукерок')} розділили порівну між ${d} дітьми, кожному дісталось по ${q * k}. Скільки цукерок дістанеться кожному, якщо ті самі цукерки розділити між ${D} дітьми?`,
        vidpovid: q,
        pidkazka: `Дітей стало в ${raz(k)} більше. Кожному дістанеться більше чи менше?`,
        rozviazok: `Дільник ${d} → ${D}: у ${raz(k)} більший, тож частка в ${raz(k)} менша: ${q * k} : ${k} = ${q}.`,
      };
    }
    // Ті самі яблука розкладають у менше ящиків — у кожному більше.
    const q = r.chyslo(2, 5);
    const d = r.chyslo(1, 3);
    const D = d * k;
    const vsi = q * D;
    if (vsi > 100 || D > 9 || d === 1) continue;
    return {
      pytannia: `${vsi} кг яблук розклали порівну в ${D} ${mnozh(D, 'ящик', 'ящики', 'ящиків')}, по ${q} кг у кожен. Скільки кілограмів буде в кожному ящику, якщо ці яблука розкласти порівну в ${d} ${mnozh(d, 'ящик', 'ящики', 'ящиків')}?`,
      vidpovid: q * k,
      odynytsi: 'кг',
      pidkazka: `Ящиків стало в ${raz(k)} менше. У кожному буде більше чи менше?`,
      rozviazok: `Дільник ${D} → ${d}: у ${raz(k)} менший, тож частка в ${raz(k)} більша: ${q} · ${k} = ${q * k} (кг).`,
    };
  }
}

export default {
  rivni: ['добуток', 'частка і дільник-пастка', 'порівняння й задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([dobutok, dobutok, dobutok, (x: Vypadok) => yakZminytsia(x, true)])(r);
    if (riven === 2) return r.vybir([dilene, dilnyk, dilnyk, (x: Vypadok) => yakZminytsia(x), porivniaty])(r);
    return r.vybir([zadacha, zadacha, zadacha, porivniaty, dilnyk, dobutok])(r);
  },
} satisfies Henerator;
