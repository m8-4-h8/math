// Кут, прямий кут, прямокутник і квадрат (2 клас): вершина і назва кута, порівняння кута з прямим за моделлю,
// протилежні сторони прямокутника, чи є прямокутник квадратом, периметр прямокутника і квадрата як сума сторін.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';
import { kutyBezHradusiv } from '../kutyBezHradusiv.ts';
import { chotyrykutnyk } from '../chotyrykutnyky.ts';

const BUKVY = ['A', 'B', 'C', 'D', 'E', 'K', 'M', 'N', 'O', 'P', 'S', 'T'];
const VYDY = ['менший від прямого', 'прямий', 'більший за прямий'];

/** Три різні букви для назви кута. */
function trybukvy(r: Vypadok) {
  return r.peremishaty(BUKVY).slice(0, 3);
}

/** Величина кута: менший від прямого, прямий або більший за прямий (кратна 5°, явно відмінна від 90°). */
function velychyna(r: Vypadok) {
  const vyd = r.chyslo(0, 2);
  return vyd === 1 ? 90 : vyd === 0 ? 5 * r.chyslo(6, 13) : 5 * r.chyslo(23, 30);
}

// Вершина кута — середня буква назви.
function vershyna(r: Vypadok): TrenZavdannia {
  const [a, v, c] = trybukvy(r);
  const g = velychyna(r);
  return {
    pytannia: `Яка буква позначає вершину кута ${a}${v}${c}?`,
    malunok: kutyBezHradusiv({ kuty: [g], nazvy: [`${a}${v}${c}`], bez_nazv: true, povoroty: [r.vybir([0, 0, 20, 340])] }),
    vidpovid: v,
    varianty: r.peremishaty([a, v, c]),
    pidkazka: 'Вершина — точка, з якої виходять обидві сторони кута.',
    rozviazok: `У назві кута вершину пишуть посередині: ${a}${v}${c} — вершина ${v}.`,
  };
}

// Як можна назвати кут: вершина посередині.
function nazva(r: Vypadok): TrenZavdannia {
  const [a, v, c] = trybukvy(r);
  const g = velychyna(r);
  const varianty = r.peremishaty([`${a}${v}${c}`, `${v}${a}${c}`, `${a}${c}${v}`]);
  return {
    pytannia: 'Як можна назвати цей кут?',
    malunok: kutyBezHradusiv({ kuty: [g], nazvy: [`${a}${v}${c}`], bez_nazv: true, opys: `Кут, позначений буквами ${[a, v, c].sort().join(', ')}` }),
    vidpovid: `${a}${v}${c}`,
    varianty,
    pidkazka: 'Знайди на малюнку вершину. Її буква має стояти посередині назви.',
    rozviazok: `Вершина — ${v}, тому кут називаємо ${a}${v}${c} (або ${c}${v}${a}).`,
  };
}

// Порівняти кут з прямим за моделлю прямого кута.
function vyd(r: Vypadok, povernuty: boolean): TrenZavdannia {
  const g = velychyna(r);
  const pov = povernuty ? 15 * r.chyslo(1, 23) : 0;
  const shcho =
    g === 90
      ? 'друга лягла точно на край моделі — кут прямий'
      : g < 90
        ? 'друга пройшла всередині моделі — кут менший від прямого'
        : 'друга вийшла за модель — кут більший за прямий';
  return {
    pytannia: 'До вершини кута приклали модель прямого кута (пунктир). Який це кут?',
    malunok: kutyBezHradusiv({ kuty: [g], povoroty: [pov], model: true, bez_nazv: true }),
    vidpovid: VYDY[g === 90 ? 1 : g < 90 ? 0 : 2],
    varianty: VYDY,
    pidkazka: 'Одна сторона кута лежить на краю моделі. Подивись, куди пішла друга сторона.',
    rozviazok: `Одна сторона кута збігається з краєм моделі, а ${shcho}.${povernuty ? ' Поворот кута нічого не змінює.' : ''}`,
  };
}

/** Прямокутник MPKB-подібний: букви, коротша сторона a (ліва), довша b (верхня). */
function priamokutnyk(r: Vypadok, maks: number) {
  const bukvy = trybukvy(r);
  const chetverta = r.vybir(BUKVY.filter((x) => !bukvy.includes(x)));
  const l = [...bukvy, chetverta] as [string, string, string, string];
  const a = r.chyslo(2, Math.floor(maks / 2) - 1);
  const b = r.krim(a + 1, maks, []);
  return { l, a, b };
}

// Протилежні сторони прямокутника рівні.
function protylezhni(r: Vypadok): TrenZavdannia {
  const { l, a, b } = priamokutnyk(r, 12);
  const storona = (i: number) => `${l[i]}${l[(i + 1) % 4]}`;
  const shukana = r.vybir([2, 3]); // права (як ліва) або нижня (як верхня)
  const vidpovid = shukana === 2 ? a : b;
  const protylezhna = shukana === 2 ? 0 : 1;
  const storony = [`${a} см`, `${b} см`, '', ''];
  storony[shukana] = '?';
  return {
    pytannia: `${l.join('')} — прямокутник. Яка довжина сторони ${storona(shukana)}?`,
    malunok: chotyrykutnyk({ forma: 'priamokutnyk', bukvy: l, storony, priami: [0, 1, 2, 3], W: 260, H: 170 }),
    vidpovid,
    odynytsi: 'см',
    pidkazka: `Знайди сторону, протилежну до ${storona(shukana)}.`,
    rozviazok: `Протилежні сторони прямокутника рівні: ${storona(shukana)} = ${storona(protylezhna)} = ${vidpovid} см.`,
  };
}

// Чи є прямокутник квадратом.
function chyKvadrat(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 15);
  const b = r.shans(0.45) ? a : r.krim(2, 15, [a]);
  const tak = a === b;
  return {
    pytannia: `У прямокутника дві сусідні сторони мають довжини ${a} см і ${b} см. Чи є цей прямокутник квадратом?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Квадрат — прямокутник, у якого всі сторони рівні. Протилежні сторони прямокутника рівні, тож досить порівняти сусідні.',
    rozviazok: tak
      ? `Сусідні сторони рівні (${a} см), протилежні теж — усі чотири сторони по ${a} см. Це квадрат.`
      : `Сусідні сторони різні (${a} см і ${b} см) — не всі сторони рівні. Це прямокутник, але не квадрат.`,
  };
}

const TVERDZHENNIA: [string, boolean, string][] = [
  ['Кожен квадрат — прямокутник.', true, 'У квадрата всі кути прямі, тож він — прямокутник (з рівними сторонами).'],
  ['Кожен прямокутник — квадрат.', false, 'У прямокутника сусідні сторони можуть бути різними, наприклад 2 см і 5 см. Такий прямокутник — не квадрат.'],
  ['У прямокутника всі кути прямі.', true, 'Прямокутник — чотирикутник, у якого всі кути прямі.'],
  ['У прямокутника всі сторони завжди рівні.', false, 'Рівні лише протилежні сторони. Усі сторони рівні тільки у квадрата.'],
  ['Протилежні сторони прямокутника рівні.', true, 'Так, протилежні сторони прямокутника рівні.'],
  ['У квадрата всі сторони рівні.', true, 'Квадрат — прямокутник, у якого всі сторони рівні.'],
  ['У квадрата є кут, менший від прямого.', false, 'У квадрата, як і в кожного прямокутника, усі чотири кути прямі.'],
  ['У прямокутника може бути кут, більший за прямий.', false, 'У прямокутника всі кути прямі — ні менших, ні більших.'],
  ['Кут утворюють два промені зі спільним початком.', true, 'Так: промені — сторони кута, їхній спільний початок — вершина.'],
  ['У назві кута вершину пишуть першою.', false, 'Вершину пишуть посередині: кут ABC має вершину B.'],
  ['Якщо кут повернути, прямий кут перестане бути прямим.', false, 'Поворот не змінює кут: прямий кут лишається прямим, як його не поверни.'],
];

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const [t, pravda, chomu] = r.vybir(TVERDZHENNIA);
  return {
    pytannia: `Правильне чи неправильне твердження? «${t}»`,
    vidpovid: pravda ? 'Правильне' : 'Неправильне',
    varianty: ['Правильне', 'Неправильне'],
    pidkazka: 'Пригадай: прямокутник — усі кути прямі; квадрат — прямокутник з рівними сторонами.',
    rozviazok: chomu,
  };
}

// Квадрати серед прямокутників (як у підручнику, с. 77).
function kvadratyIPriamokutnyky(r: Vypadok): TrenZavdannia {
  const o = osoba(r);
  const vsoho = r.chyslo(7, 20);
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    const k = r.chyslo(1, vsoho - 1);
    return {
      pytannia: `${o.imia} ${rid(o, 'накреслив', 'накреслила')} ${vsoho} ${mnozh(vsoho, 'прямокутник', 'прямокутники', 'прямокутників')}, ${k} з них — квадрати. Скільки прямокутників не є квадратами?`,
      vidpovid: vsoho - k,
      pidkazka: 'Квадрати теж прямокутники, тож вони входять у загальну кількість.',
      rozviazok: `${vsoho} − ${k} = ${vsoho - k}`,
    };
  }
  if (vyd === 1) {
    // Квадратів більше, ніж інших прямокутників.
    const ne = r.chyslo(2, Math.floor((vsoho - 1) / 2));
    const k = vsoho - ne;
    return {
      pytannia: `${o.imia} ${rid(o, 'накреслив', 'накреслила')} ${vsoho} ${mnozh(vsoho, 'прямокутник', 'прямокутники', 'прямокутників')}, ${k} з них — квадрати. На скільки більше квадратів, ніж прямокутників, що не є квадратами?`,
      vidpovid: k - ne,
      pidkazka: `Спершу дізнайся, скільки прямокутників не є квадратами: ${vsoho} − ${k}.`,
      rozviazok: `1) ${vsoho} − ${k} = ${ne} — не квадрати; 2) ${k} − ${ne} = ${k - ne}`,
    };
  }
  const k = r.chyslo(2, 9);
  const ne = r.chyslo(2, 9);
  return {
    pytannia: `${o.imia} ${rid(o, 'вирізав', 'вирізала')} ${k} ${mnozh(k, 'квадрат', 'квадрати', 'квадратів')} і ще ${ne} ${mnozh(ne, 'прямокутник', 'прямокутники', 'прямокутників')}, що не є квадратами. Скільки всього прямокутників ${rid(o, 'він вирізав', 'вона вирізала')}?`,
    vidpovid: k + ne,
    pidkazka: 'Квадрат — теж прямокутник. Не забудь його порахувати.',
    rozviazok: `${k} + ${ne} = ${k + ne} — квадрати теж прямокутники.`,
  };
}

// Периметр прямокутника: сума всіх чотирьох сторін.
function perymetrPriamokutnyka(r: Vypadok): TrenZavdannia {
  const { l, a, b } = priamokutnyk(r, 30);
  if (2 * (a + b) > 100) return perymetrPriamokutnyka(r);
  return {
    pytannia: `Знайди периметр прямокутника ${l.join('')}.`,
    malunok: chotyrykutnyk({ forma: 'priamokutnyk', bukvy: l, storony: [`${a} см`, `${b} см`], priami: [0, 1, 2, 3], W: 260, H: 170 }),
    vidpovid: 2 * (a + b),
    odynytsi: 'см',
    pidkazka: `Протилежні сторони рівні: дві сторони по ${a} см і дві по ${b} см. Додай усі чотири.`,
    rozviazok: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} (см)`,
  };
}

function perymetrKvadrata(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 25);
  const l = [...trybukvy(r), r.vybir(['F', 'H', 'L', 'R'])] as [string, string, string, string];
  return {
    pytannia: `${l.join('')} — квадрат. Знайди його периметр.`,
    malunok: chotyrykutnyk({ forma: 'kvadrat', bukvy: l, storony: [`${a} см`], rysky: [1, 1, 1, 1], priami: [0, 1, 2, 3], W: 200, H: 180 }),
    vidpovid: 4 * a,
    odynytsi: 'см',
    pidkazka: `У квадрата всі чотири сторони по ${a} см.`,
    rozviazok: `${a} + ${a} + ${a} + ${a} = ${4 * a} (см)`,
  };
}

// Текстові задачі на периметр.
function zadachaPerymetr(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    const a = 5 * r.chyslo(2, 6);
    const b = 5 * r.chyslo(2, 10 - a / 5);
    if (a === b) return zadachaPerymetr(r);
    return {
      pytannia: `Город має форму прямокутника зі сторонами ${a} м і ${b} м. Скільки метрів сітки потрібно, щоб обгородити город?`,
      vidpovid: 2 * (a + b),
      odynytsi: 'м',
      pidkazka: 'Огорожа йде навколо всього городу — по всіх чотирьох сторонах.',
      rozviazok: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} (м)`,
    };
  }
  if (vyd === 1) {
    const a = r.chyslo(10, 25);
    return {
      pytannia: `Рамка для фото має форму квадрата зі стороною ${a} см. Яка довжина всієї рамки?`,
      vidpovid: 4 * a,
      odynytsi: 'см',
      pidkazka: 'У квадрата чотири однакові сторони.',
      rozviazok: `${a} + ${a} + ${a} + ${a} = ${4 * a} (см)`,
    };
  }
  // Відомий периметр і одна пара сторін: скільки разом дві інші.
  const a = r.chyslo(3, 20);
  const b = r.krim(3, 25, [a]);
  const P = 2 * (a + b);
  return {
    pytannia: `Периметр прямокутника ${P} см. Дві його протилежні сторони — по ${a} см. Скільки сантиметрів разом дві інші сторони?`,
    vidpovid: 2 * b,
    odynytsi: 'см',
    pidkazka: `Від периметра відніми дві відомі сторони: ${P} − (${a} + ${a}).`,
    rozviazok: `${P} − (${a} + ${a}) = ${P} − ${2 * a} = ${2 * b} (см)`,
  };
}

export default {
  rivni: ['кут і його вершина', 'прямокутник і квадрат', 'периметр і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vershyna, nazva, (x: Vypadok) => vyd(x, false)])(r);
    if (riven === 2) return r.vybir([protylezhni, chyKvadrat, tverdzhennia, (x: Vypadok) => vyd(x, true)])(r);
    return r.vybir([perymetrPriamokutnyka, perymetrKvadrata, zadachaPerymetr, kvadratyIPriamokutnyky])(r);
  },
} satisfies Henerator;
