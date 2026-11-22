// Невідомий множник, ділене і дільник (2 клас, Скворцова с. 121): число у віконці в рівності на множення чи
// ділення. Добуток і ділене — ціле, їх шукаємо множенням; множник, дільник і частка — частини, їх шукаємо діленням.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Два множники з таблиці множення: перший від 2 до maxA, другий від 2 до 9. */
function para(r: Vypadok, maxA: number) {
  return [r.chyslo(2, maxA), r.chyslo(2, 9)];
}

// Невідомий множник: □ · b = c або b · □ = c.
function mnozhnyk(r: Vypadok, maxA: number): TrenZavdannia {
  const [a, b] = para(r, maxA);
  const c = a * b;
  const zliva = r.shans();
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: zliva ? `□ · ${b} = ${c}` : `${b} · □ = ${c}`,
    vidpovid: a,
    pidkazka: `Множник — частина. Добуток ${c} поділи на відомий множник ${b}.`,
    rozviazok: `${c} : ${b} = ${a}. Перевірка: ${zliva ? `${a} · ${b}` : `${b} · ${a}`} = ${c}`,
  };
}

// Невідоме ділене: □ : b = q.
function dilene(r: Vypadok, maxA: number): TrenZavdannia {
  const [q, b] = r.shans() ? para(r, maxA) : para(r, maxA).reverse();
  const d = q * b;
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `□ : ${b} = ${q}`,
    vidpovid: d,
    pidkazka: `Ділене — ціле. Частку ${q} помнож на дільник ${b}.`,
    rozviazok: `${q} · ${b} = ${d}. Перевірка: ${d} : ${b} = ${q}`,
  };
}

// Невідомий дільник: d : □ = q.
function dilnyk(r: Vypadok, maxA: number): TrenZavdannia {
  const [q, b] = r.shans() ? para(r, maxA) : para(r, maxA).reverse();
  const d = q * b;
  return {
    pytannia: 'Яке число сховалось у віконці?',
    vyraz: `${d} : □ = ${q}`,
    vidpovid: b,
    pidkazka: `Дільник — частина. Ділене ${d} поділи на частку ${q}.`,
    rozviazok: `${d} : ${q} = ${b}. Перевірка: ${d} : ${b} = ${q}`,
  };
}

// З рівності на множення — рівність на ділення.
function triika(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r, 5);
  const c = a * b;
  const naA = r.shans();
  return {
    pytannia: `Відомо, що ${a} · ${b} = ${c}. Яке число у віконці?`,
    vyraz: naA ? `${c} : ${a} = □` : `${c} : ${b} = □`,
    vidpovid: naA ? b : a,
    pidkazka: 'Добуток поділили на один множник — вийде інший множник.',
    rozviazok: naA ? `${c} : ${a} = ${b}, бо ${a} · ${b} = ${c}` : `${c} : ${b} = ${a}, бо ${a} · ${b} = ${c}`,
  };
}

// Якою дією знайти невідоме.
function yakaDiia(r: Vypadok): TrenZavdannia {
  const [q, b] = para(r, 5);
  const d = q * b;
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    // □ : b = q → q · b
    return {
      pytannia: `Як знайти число у віконці: □ : ${b} = ${q}?`,
      vidpovid: `${q} · ${b}`,
      varianty: r.peremishaty([`${q} · ${b}`, `${q} : ${b}`, `${q} + ${b}`]),
      pidkazka: 'У віконці — ділене. Ділене — ціле: його шукаємо множенням.',
      rozviazok: `Ділене = частка · дільник: ${q} · ${b} = ${d}`,
    };
  }
  if (vyd === 1) {
    // d : □ = q → d : q
    return {
      pytannia: `Як знайти число у віконці: ${d} : □ = ${q}?`,
      vidpovid: `${d} : ${q}`,
      varianty: r.peremishaty([`${d} : ${q}`, `${d} · ${q}`, `${d} − ${q}`]),
      pidkazka: 'У віконці — дільник. Дільник — частина: його шукаємо діленням.',
      rozviazok: `Дільник = ділене : частка: ${d} : ${q} = ${b}`,
    };
  }
  // □ · b = d → d : b
  return {
    pytannia: `Як знайти число у віконці: □ · ${b} = ${d}?`,
    vidpovid: `${d} : ${b}`,
    varianty: r.peremishaty([`${d} : ${b}`, `${d} · ${b}`, `${d} − ${b}`]),
    pidkazka: 'У віконці — множник. Множник — частина: його шукаємо діленням.',
    rozviazok: `Множник = добуток : інший множник: ${d} : ${b} = ${q}`,
  };
}

// Текстові задачі, де невідоме — множник, ділене або дільник.
function zadacha(r: Vypadok): TrenZavdannia {
  const [q, b] = para(r, 9);
  const d = q * b;
  const o = osoba(r);
  const vyd = r.chyslo(0, 4);
  if (vyd === 0) {
    return {
      pytannia: `${o.imia} ${rid(o, 'розклав', 'розклала')} яблука порівну в ${b} ${mnozh(b, 'кошик', 'кошики', 'кошиків')}, по ${q} ${mnozh(q, 'яблуку', 'яблука', 'яблук')} у кожен. Скільки яблук було?`,
      vidpovid: d,
      pidkazka: 'Невідоме — ціле (усі яблука). Ціле шукаємо множенням.',
      rozviazok: `□ : ${b} = ${q}, □ = ${q} · ${b} = ${d}`,
    };
  }
  if (vyd === 1) {
    return {
      pytannia: `${d} ${mnozh(d, 'цукерку', 'цукерки', 'цукерок')} роздали дітям, кожному по ${q}. Скільки дітей отримали цукерки?`,
      vidpovid: b,
      pidkazka: `Скільки разів по ${q} вміщується в ${d}? Поділи ${d} на ${q}.`,
      rozviazok: `${d} : ${q} = ${b} (д.). Перевірка: ${q} · ${b} = ${d}`,
    };
  }
  if (vyd === 2) {
    return {
      pytannia: `Яке число треба помножити на ${b}, щоб отримати ${d}?`,
      vidpovid: q,
      pidkazka: `□ · ${b} = ${d}. Множник — частина: поділи ${d} на ${b}.`,
      rozviazok: `${d} : ${b} = ${q}, бо ${q} · ${b} = ${d}`,
    };
  }
  if (vyd === 3) {
    return {
      pytannia: `На яке число треба поділити ${d}, щоб отримати ${q}?`,
      vidpovid: b,
      pidkazka: `${d} : □ = ${q}. Дільник — частина: поділи ${d} на ${q}.`,
      rozviazok: `${d} : ${q} = ${b}, бо ${d} : ${b} = ${q}`,
    };
  }
  return {
    pytannia: `Яке число поділили на ${b} і отримали ${q}?`,
    vidpovid: d,
    pidkazka: `□ : ${b} = ${q}. Ділене — ціле: помнож ${q} на ${b}.`,
    rozviazok: `${q} · ${b} = ${d}, бо ${d} : ${b} = ${q}`,
  };
}

export default {
  rivni: ['невідомий множник', 'невідоме ділене і дільник', 'таблиця до 9 і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => mnozhnyk(x, 5), (x: Vypadok) => mnozhnyk(x, 5), triika])(r);
    if (riven === 2) return r.vybir([(x: Vypadok) => dilene(x, 5), (x: Vypadok) => dilnyk(x, 5), yakaDiia])(r);
    return r.vybir([(x: Vypadok) => mnozhnyk(x, 9), (x: Vypadok) => dilene(x, 9), (x: Vypadok) => dilnyk(x, 9), zadacha, zadacha])(r);
  },
} satisfies Henerator;
