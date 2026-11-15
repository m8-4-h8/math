// Прості рівняння (3 клас): невідомий доданок, зменшуване, від'ємник, множник, ділене, дільник.
// Невідоме — ціле (додаємо / множимо) чи частина (віднімаємо / ділимо); перевірка підстановкою.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

type Vyd = 'dodanok' | 'zmenshuvane' | 'vidiemnyk' | 'mnozhnyk' | 'dilene' | 'dilnyk';

const NAZVY: Record<Vyd, string> = {
  dodanok: 'доданок',
  zmenshuvane: 'зменшуване',
  vidiemnyk: "від'ємник",
  mnozhnyk: 'множник',
  dilene: 'ділене',
  dilnyk: 'дільник',
};

interface Rivniannia {
  vyd: Vyd;
  zapys: string; // «x + 7 = 12»
  korin: number;
  dia: string; // «12 − 7»
  perevirka: string; // «5 + 7 = 12»
  pidkazka: string;
  pastka?: number; // що вийде, якщо зробити «дію, яку бачу»: x − 8 = 6 → 8 − 6
}

function dodavannia(r: Vypadok, vyd: 'dodanok' | 'zmenshuvane' | 'vidiemnyk'): Rivniannia {
  if (vyd === 'dodanok') {
    const x = r.chyslo(4, 60);
    const a = r.chyslo(5, 95 - x);
    const zliva = r.shans();
    return {
      vyd,
      zapys: zliva ? `x + ${a} = ${x + a}` : `${a} + x = ${x + a}`,
      korin: x,
      dia: `${x + a} − ${a}`,
      perevirka: zliva ? `${x} + ${a} = ${x + a}` : `${a} + ${x} = ${x + a}`,
      pidkazka: 'Невідомий доданок — це частина. Від суми відніми відомий доданок.',
      pastka: x + a + a,
    };
  }
  if (vyd === 'zmenshuvane') {
    const riznytsia = r.chyslo(3, 60);
    const a = r.chyslo(5, 95 - riznytsia);
    return {
      vyd,
      zapys: `x − ${a} = ${riznytsia}`,
      korin: riznytsia + a,
      dia: `${riznytsia} + ${a}`,
      perevirka: `${riznytsia + a} − ${a} = ${riznytsia}`,
      pidkazka: "Невідоме зменшуване — це ціле. До різниці додай від'ємник.",
      pastka: Math.abs(a - riznytsia),
    };
  }
  const x = r.chyslo(4, 60);
  const riznytsia = r.krim(3, 95 - x, [x]);
  return {
    vyd,
    zapys: `${x + riznytsia} − x = ${riznytsia}`,
    korin: x,
    dia: `${x + riznytsia} − ${riznytsia}`,
    perevirka: `${x + riznytsia} − ${x} = ${riznytsia}`,
    pidkazka: "Невідомий від'ємник — це частина. Від зменшуваного відніми різницю.",
    pastka: x + 2 * riznytsia,
  };
}

function mnozhennia(r: Vypadok, vyd: 'mnozhnyk' | 'dilene' | 'dilnyk'): Rivniannia {
  const a = r.chyslo(2, 9);
  if (vyd === 'mnozhnyk') {
    const x = r.chyslo(2, 9);
    const zliva = r.shans();
    return {
      vyd,
      zapys: zliva ? `x · ${a} = ${x * a}` : `${a} · x = ${x * a}`,
      korin: x,
      dia: `${x * a} : ${a}`,
      perevirka: zliva ? `${x} · ${a} = ${x * a}` : `${a} · ${x} = ${x * a}`,
      pidkazka: 'Невідомий множник — це частина. Добуток поділи на відомий множник.',
    };
  }
  if (vyd === 'dilene') {
    const chastka = r.chyslo(2, 9);
    return {
      vyd,
      zapys: `x : ${a} = ${chastka}`,
      korin: chastka * a,
      dia: `${chastka} · ${a}`,
      perevirka: `${chastka * a} : ${a} = ${chastka}`,
      pidkazka: 'Невідоме ділене — це ціле. Частку помнож на дільник.',
    };
  }
  const x = r.chyslo(2, 9);
  const chastka = r.krim(2, 9, [x]);
  return {
    vyd,
    zapys: `${x * chastka} : x = ${chastka}`,
    korin: x,
    dia: `${x * chastka} : ${chastka}`,
    perevirka: `${x * chastka} : ${x} = ${chastka}`,
    pidkazka: 'Невідомий дільник — це частина. Ділене поділи на частку.',
  };
}

const TSILE: Vyd[] = ['zmenshuvane', 'dilene'];

function rivniannia(r: Vypadok, vyd: Vyd): Rivniannia {
  return vyd === 'dodanok' || vyd === 'zmenshuvane' || vyd === 'vidiemnyk' ? dodavannia(r, vyd) : mnozhennia(r, vyd);
}

function rozviazaty(e: Rivniannia): TrenZavdannia {
  return {
    pytannia: "Розв'яжи рівняння.",
    vyraz: e.zapys,
    vidpovid: e.korin,
    pidkazka: e.pidkazka,
    rozviazok: `Невідомий компонент — ${NAZVY[e.vyd]}, це ${TSILE.includes(e.vyd) ? 'ціле' : 'частина'}. x = ${e.dia} = ${e.korin}. Перевірка: ${e.perevirka} ✓`,
  };
}

// «Чи є число … коренем рівняння?» — пастка: число, яке виходить, якщо зробити не ту дію.
function chyKorin(r: Vypadok): TrenZavdannia {
  const e = rivniannia(r, r.vybir<Vyd>(['dodanok', 'zmenshuvane', 'vidiemnyk', 'mnozhnyk', 'dilene', 'dilnyk']));
  const tak = r.shans(0.4);
  const pastka = e.pastka && e.pastka !== e.korin && e.pastka <= 100 ? [e.pastka, e.pastka] : [];
  const khybne = r.vybir([...pastka, e.korin + 1, e.korin - 1].filter((k) => k > 0));
  const k = tak ? e.korin : khybne;
  return {
    pytannia: `Чи є число ${k} коренем рівняння ${e.zapys}? Підстав і перевір.`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: `Підстав ${k} замість x і порахуй ліву частину. Чи вийшло число праворуч від «=»?`,
    rozviazok: tak
      ? `Так: ${e.perevirka} — рівність правильна.`
      : `Ні: з числом ${k} рівність неправильна. Корінь — ${e.korin}, бо ${e.perevirka}.`,
  };
}

// «Хто невідомий?» і «ціле чи частина?» — перший крок пам'ятки.
function khtoNevidomyi(r: Vypadok): TrenZavdannia {
  const vyd = r.vybir<Vyd>(['dodanok', 'zmenshuvane', 'vidiemnyk', 'mnozhnyk', 'dilene', 'dilnyk']);
  const e = rivniannia(r, vyd);
  if (r.shans()) {
    const tsile = TSILE.includes(vyd);
    return {
      pytannia: `У рівнянні ${e.zapys} невідоме число — ціле чи частина?`,
      vidpovid: tsile ? 'ціле' : 'частина',
      varianty: ['ціле', 'частина'],
      pidkazka: 'Ціле — це сума, зменшуване, добуток або ділене: найбільше число в дії.',
      rozviazok: `Невідомий компонент — ${NAZVY[vyd]}, це ${tsile ? 'ціле, тому шукаємо його ' + (vyd === 'zmenshuvane' ? 'додаванням' : 'множенням') : 'частина, тому шукаємо її ' + (vyd === 'dodanok' || vyd === 'vidiemnyk' ? 'відніманням' : 'діленням')}.`,
    };
  }
  const hrupa: Vyd[] = vyd === 'dodanok' || vyd === 'zmenshuvane' || vyd === 'vidiemnyk' ? ['dodanok', 'zmenshuvane', 'vidiemnyk'] : ['mnozhnyk', 'dilene', 'dilnyk'];
  return {
    pytannia: `Який компонент невідомий у рівнянні ${e.zapys}?`,
    vidpovid: NAZVY[vyd],
    varianty: hrupa.map((v) => NAZVY[v]),
    pidkazka: 'Прочитай рівняння з назвами чисел: що з чим зробили і що вийшло.',
    rozviazok: `Невідомий компонент — ${NAZVY[vyd]}. Корінь: x = ${e.dia} = ${e.korin}.`,
  };
}

export default {
  rivni: ['додавання і віднімання', 'множення і ділення', 'усі види, перевірка кореня'],
  zavdannia(r, riven) {
    if (riven === 1) return rozviazaty(dodavannia(r, r.vybir(['dodanok', 'zmenshuvane', 'vidiemnyk'] as const)));
    if (riven === 2) return rozviazaty(mnozhennia(r, r.vybir(['mnozhnyk', 'dilene', 'dilnyk'] as const)));
    const typ = r.chyslo(0, 9);
    if (typ < 2) return chyKorin(r);
    if (typ < 4) return khtoNevidomyi(r);
    // Найчастіші помилки — зменшуване й від'ємник, ділене й дільник: їх даємо частіше.
    return rozviazaty(rivniannia(r, r.vybir<Vyd>(['zmenshuvane', 'vidiemnyk', 'vidiemnyk', 'dilene', 'dilnyk', 'dilnyk', 'dodanok', 'mnozhnyk'])));
  },
} satisfies Henerator;
