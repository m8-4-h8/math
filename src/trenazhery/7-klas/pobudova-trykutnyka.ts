// Побудова трикутника: третій кут за стороною і двома кутами, яка ознака рівності стоїть за способом побудови, яким
// радіусом провести дугу, чи можна побудувати (нерівність трикутника, сума двох кутів), скільки точок на заданих
// відстанях від двох точок (метод ГМТ, два кола), межі третьої сторони, рівнобедрений і рівносторонній трикутник.
import { skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { pobudova } from '../pobudovy.ts';

const OZNAKY = ['за першою ознакою', 'за другою ознакою', 'за третьою ознакою'];

/** Три різні сторони, з яких трикутник існує. */
function tryStorony(r: Vypadok): [number, number, number] {
  for (;;) {
    const [a, b, c] = r.rizni(3, 2, 12);
    if (a + b > c && a + c > b && b + c > a) return [a, b, c];
  }
}

function tretiiKut(r: Vypadok): TrenZavdannia {
  const c = r.chyslo(3, 12);
  const al = r.chyslo(20, 110);
  const be = r.chyslo(20, 160 - al);
  const g = 180 - al - be;
  return {
    pytannia: `Трикутник ABC будують за стороною AB = ${c} см і прилеглими кутами A = ${al}° і B = ${be}°. Яким вийде кут C?`,
    malunok: r.shans(0.4) && al + be <= 130 ? pobudova({ vyd: 'storonaDvaKuty', alfa: al, beta: be, storony: [0, 0, c], pidpysy: ['', '', `${c} см`], krok: 2 }) : undefined,
    vidpovid: g,
    odynytsi: '°',
    pidkazka: 'Сума кутів трикутника — 180°.',
    rozviazok: `Кут C дорівнює 180° − ${al}° − ${be}° = ${g}°.`,
  };
}

function yakaOznaka(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  let dani: string;
  if (typ === 0) dani = `двома сторонами ${r.chyslo(3, 9)} см і ${r.chyslo(3, 9)} см і кутом ${r.chyslo(3, 15) * 10}° між ними`;
  else if (typ === 1) {
    const al = r.chyslo(3, 9) * 10;
    dani = `стороною ${r.chyslo(3, 12)} см і прилеглими до неї кутами ${al}° і ${r.chyslo(3, 16 - al / 10) * 10}°`;
  } else dani = `трьома сторонами ${tryStorony(r).map((x) => `${x} см`).join(', ')}`;
  return {
    pytannia: `Увесь клас будував трикутник за ${dani}. У всіх вийшли рівні трикутники. За якою ознакою рівності?`,
    vidpovid: OZNAKY[typ],
    varianty: OZNAKY,
    pidkazka: 'Перша ознака — дві сторони і кут між ними, друга — сторона і два прилеглі кути, третя — три сторони.',
    rozviazok: ['Дві сторони і кут між ними — перша ознака рівності.', 'Сторона і два прилеглі до неї кути — друга ознака рівності.', 'Три сторони — третя ознака рівності.'][typ],
  };
}

function radiusDuhy(r: Vypadok): TrenZavdannia {
  const [a, b, c] = tryStorony(r);
  const zA = r.shans();
  return {
    pytannia: `Трикутник ABC будують за трьома сторонами: AB = ${c} см, BC = ${a} см, AC = ${b} см. Відрізок AB уже відклали. Яким радіусом треба провести дугу з центром ${zA ? 'A' : 'B'}?`,
    vidpovid: zA ? b : a,
    odynytsi: 'см',
    pidkazka: `Дуга з центром ${zA ? 'A' : 'B'} — це всі точки C на потрібній відстані від ${zA ? 'A' : 'B'}. Яка сторона з'єднує ${zA ? 'A' : 'B'} і C?`,
    rozviazok: zA ? `Вершина C має бути на відстані AC від точки A, тож радіус — AC = ${b} см.` : `Вершина C має бути на відстані BC від точки B, тож радіус — BC = ${a} см.`,
  };
}

function chyMozhnaStorony(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2); // 0 — можна, 1 — сума дорівнює, 2 — сума менша
  const [a, b] = [r.chyslo(2, 10), r.chyslo(2, 10)];
  const c = typ === 0 ? r.chyslo(Math.max(a, b), a + b - 1) : typ === 1 ? a + b : a + b + r.chyslo(1, 5);
  const storony = r.peremishaty([a, b, c]);
  const naib = Math.max(...storony);
  const [m1, m2] = storony.filter((_, i) => i !== storony.indexOf(naib));
  const s = m1 + m2;
  return {
    pytannia: `Чи можна побудувати трикутник зі сторонами ${storony.map((x) => `${x} см`).join(', ')}?`,
    vidpovid: typ === 0 ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Додай дві менші сторони і порівняй з найбільшою.',
    rozviazok:
      typ === 0 ? `${m1} + ${m2} = ${s} — більше за ${naib}. Дуги перетнуться: трикутник можна побудувати.`
      : typ === 1 ? `${m1} + ${m2} = ${s} — рівно найбільша сторона. Дуги лише торкнуться на відрізку: трикутника немає.`
      : `${m1} + ${m2} = ${s} — менше за ${naib}. Дуги не дістануть одна до одної: трикутника немає.`,
  };
}

function chyMozhnaKuty(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  const al = r.chyslo(30, 120);
  const be = typ === 0 ? r.chyslo(10, 179 - al) : typ === 1 ? 180 - al : r.chyslo(181 - al, Math.min(170, 220 - al));
  const s = al + be;
  return {
    pytannia: `Чи можна побудувати трикутник за стороною ${r.chyslo(3, 12)} см і прилеглими до неї кутами ${al}° і ${be}°?`,
    vidpovid: s < 180 ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: 'Додай кути і порівняй зі 180°.',
    rozviazok:
      s < 180 ? `${al}° + ${be}° = ${s}° — менше за 180°: сторони кутів перетнуться, третій кут дорівнює 180° − ${s}° = ${180 - s}°.`
      : s === 180 ? `${al}° + ${be}° = ${s}°: сторони кутів паралельні й не перетнуться. Трикутника немає.`
      : `${al}° + ${be}° = ${s}° — більше за 180°: сторони кутів розходяться. Трикутника немає.`,
  };
}

function skilkyTochok(r: Vypadok, istoriia = false): TrenZavdannia {
  const typ = r.chyslo(0, 4); // 0 — далеко, 1 — дотик, 2 — дві точки, 3 — дотик зсередини, 4 — одне в іншому
  const m = r.chyslo(2, 9);
  let n = r.chyslo(2, 9);
  if (typ >= 3 && m === n) n = m + r.chyslo(1, 4);
  const [R, rr] = [Math.max(m, n), Math.min(m, n)];
  const d =
    typ === 0 ? R + rr + r.chyslo(1, 5)
    : typ === 1 ? R + rr
    : typ === 2 ? r.chyslo(R - rr + 1, R + rr - 1)
    : typ === 3 ? R - rr
    : r.chyslo(1, Math.max(1, R - rr - 1));
  if (typ === 4 && d >= R - rr) return skilkyTochok(r, istoriia);
  const k = [0, 1, 2, 1, 0][typ];
  const s = `${m} + ${n} = ${m + n}`;
  const z = `${R} − ${rr} = ${R - rr}`;
  const poiasn = [
    `${s} — менше за ${d}: кола не перетинаються.`,
    `${s} — рівно ${d}: кола дотикаються зовні, точка одна — на відрізку між центрами.`,
    `${z}, ${s}, і ${d} лежить між ними: кола перетинаються у двох точках.`,
    `${z} — рівно ${d}: кола дотикаються зсередини, точка одна.`,
    `${z} — більше за ${d}: менше коло лежить усередині більшого, спільних точок немає.`,
  ][typ];
  return {
    pytannia: istoriia
      ? `У записці сказано: «Скарб — за ${skilky(m, 'крок', 'кроки', 'кроків')} від дуба і за ${skilky(n, 'крок', 'кроки', 'кроків')} від каменя». Від дуба до каменя — ${skilky(d, 'крок', 'кроки', 'кроків')}. Скільки є місць, де може бути скарб?`
      : `AB = ${d} см. Скільки є точок, які лежать на відстані ${m} см від A і ${n} см від B?`,
    vidpovid: k,
    pidkazka: istoriia ? 'Місця на відстані від дуба лежать на колі, від каменя — на іншому колі. Порівняй відстань між центрами із сумою і різницею радіусів.' : 'Шукані точки лежать на двох колах з центрами A і B. Порівняй AB із сумою і різницею радіусів.',
    rozviazok: `Шукані точки — спільні точки кіл з радіусами ${m} і ${n}, відстань між центрами ${d}. ${poiasn} Відповідь: ${k}.`,
  };
}

function tretiaStorona(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 15);
  let b = r.chyslo(2, 15);
  if (a === b) b = a + r.chyslo(1, 5);
  const [v, m] = [Math.max(a, b), Math.min(a, b)];
  const typ = r.chyslo(0, 2);
  const mezhi = `Третя сторона більша за ${v} − ${m} = ${v - m} і менша за ${v} + ${m} = ${v + m} см.`;
  return {
    pytannia:
      typ === 0 ? `Будують трикутник зі сторонами ${a} см і ${b} см. Яку найбільшу цілу довжину (у см) може мати третя сторона?`
      : typ === 1 ? `Будують трикутник зі сторонами ${a} см і ${b} см. Яку найменшу цілу довжину (у см) може мати третя сторона?`
      : `Будують трикутник зі сторонами ${a} см і ${b} см. Скільки є цілих значень третьої сторони (у см)?`,
    vidpovid: typ === 0 ? v + m - 1 : typ === 1 ? v - m + 1 : 2 * m - 1,
    pidkazka: 'Третя сторона менша за суму двох інших і більша за їх різницю.',
    rozviazok:
      typ === 0 ? `${mezhi} Найбільше ціле — ${v + m - 1}.`
      : typ === 1 ? `${mezhi} Найменше ціле — ${v - m + 1}.`
      : `${mezhi} Цілі значення від ${v - m + 1} до ${v + m - 1}: їх ${v + m - 1} − ${v - m} = ${2 * m - 1}.`,
  };
}

function rivnobedrenyi(r: Vypadok): TrenZavdannia {
  const c = r.chyslo(3, 16);
  if (r.shans()) {
    const min = Math.floor(c / 2) + 1;
    return {
      pytannia: `Рівнобедрений трикутник з основою AB = ${c} см будують так: з центрами A і B проводять дуги одним радіусом. Який найменший цілий радіус (у см) підійде?`,
      vidpovid: min,
      pidkazka: 'Дуги однакового радіуса перетнуться, лише якщо радіус більший за половину AB.',
      rozviazok: `Половина основи: ${c} : 2 = ${String(c / 2).replace('.', ',')} см. Радіус має бути більшим, тож найменше ціле — ${min} см.`,
    };
  }
  const b = r.chyslo(Math.floor(c / 2) + 1, c + 6);
  return {
    pytannia: `Рівнобедрений трикутник з основою AB = ${c} см побудували дугами радіусом ${b} см з центрами A і B. Знайди периметр трикутника.`,
    vidpovid: 2 * b + c,
    odynytsi: 'см',
    pidkazka: 'Бічні сторони AC і BC — радіуси дуг.',
    rozviazok: `AC = BC = ${b} см. Периметр: ${b} + ${b} + ${c} = ${2 * b + c} см.`,
  };
}

function rivnostoronnii(r: Vypadok): TrenZavdannia {
  const c = r.chyslo(3, 15);
  const typ = r.chyslo(0, 3);
  const umova = `Відрізок AB = ${c} см. З центрами A і B провели дуги радіусом AB і точку їх перетину C з'єднали з A і B.`;
  if (typ === 0) {
    return {
      pytannia: `${umova} Знайди периметр трикутника ABC.`,
      vidpovid: 3 * c,
      odynytsi: 'см',
      pidkazka: 'Яку довжину має кожна сторона?',
      rozviazok: `AC = BC = AB = ${c} см — трикутник рівносторонній. Периметр: ${c} · 3 = ${3 * c} см.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${umova} Знайди кут CAB.`,
      vidpovid: 60,
      odynytsi: '°',
      pidkazka: 'У рівносторонньому трикутнику всі кути рівні.',
      rozviazok: 'Усі сторони рівні, тож трикутник рівносторонній і всі його кути рівні: кут CAB дорівнює 180° : 3 = 60°.',
    };
  }
  if (typ === 2) {
    return {
      pytannia: `${umova} Потім побудували бісектрису кута CAB. Який кут вона утворює зі стороною AB?`,
      vidpovid: 30,
      odynytsi: '°',
      pidkazka: 'Спершу знайди кут CAB рівностороннього трикутника.',
      rozviazok: 'Кут CAB дорівнює 180° : 3 = 60°, бісектриса ділить його навпіл: 60° : 2 = 30°.',
    };
  }
  return {
    pytannia: `${umova} Промінь AD — продовження відрізка BA за точку A. Знайди кут CAD.`,
    vidpovid: 120,
    odynytsi: '°',
    pidkazka: 'Кути CAB і CAD суміжні.',
    rozviazok: 'Кут CAB дорівнює 180° : 3 = 60°, кут CAD суміжний з ним: 180° − 60° = 120°.',
  };
}

export default {
  rivni: ['кут, ознака, радіус дуги', 'чи можна побудувати і скільки точок', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([tretiiKut, yakaOznaka, yakaOznaka, radiusDuhy])(r);
    if (riven === 2) return r.vybir([chyMozhnaStorony, chyMozhnaKuty, (v: Vypadok) => skilkyTochok(v), radiusDuhy])(r);
    return r.vybir([tretiaStorona, rivnobedrenyi, rivnostoronnii, (v: Vypadok) => skilkyTochok(v, true), (v: Vypadok) => skilkyTochok(v)])(r);
  },
} satisfies Henerator;
