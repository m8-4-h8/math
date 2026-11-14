// Теорема Фалеса: рівні відрізки на другій стороні кута, кілька рівних частин разом, підступи (відрізки різних
// сторін, непаралельні прямі), середина сторони трикутника, лінії зошита, поділ відрізка на n рівних частин.
import { type Henerator, type Vypadok, type TrenZavdannia, skilky } from '../dopomoha.ts';
import { fales } from '../fales.ts';

const TN = ['Так', 'Ні'];
const ПІДРЯДКОВІ = '₀₁₂₃₄₅₆₇₈₉';
const ind = (n: number) => String(n).split('').map((c) => ПІДРЯДКОВІ[Number(c)]).join('');
const A = (i: number) => (i === 0 ? 'O' : `A${ind(i)}`);
const B = (i: number) => (i === 0 ? 'O' : `B${ind(i)}`);
const vA = (i: number) => `${A(i)}${A(i + 1)}`;
const vB = (i: number) => `${B(i)}${B(i + 1)}`;
const TRYKUTNYKY: [string, string, string][] = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['R', 'S', 'T'],
];

/** Умова до малюнка: на першій стороні n рівних відрізків (від O або від A₁), через їхні кінці — паралельні прямі. */
function umova(n: number, vidO: boolean) {
  const p = vidO ? 0 : 1;
  const rivni = Array.from({ length: n }, (_, k) => vA(p + k)).join(' = ');
  const [pershyi, ostannii] = [Math.max(1, p), p + n];
  const spysok = (T: (i: number) => string) =>
    ostannii - pershyi < 4
      ? Array.from({ length: ostannii - pershyi + 1 }, (_, k) => T(pershyi + k)).join(', ')
      : `${T(pershyi)}, ${T(pershyi + 1)}, …, ${T(ostannii)}`;
  return (
    `На одній стороні кута з вершиною O відкладено рівні відрізки ${rivni}. Через точки ${spysok(A)} ` +
    `проведено паралельні прямі, що перетинають другу сторону в точках ${spysok(B)}.`
  );
}

/** Відомий один відрізок другої сторони — знайти інший: він такий самий. */
function rivni(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 5);
  const vidO = r.shans();
  const p = vidO ? 0 : 1;
  const [j, k] = r.rizni(2, 0, n - 1);
  const b = r.chyslo(2, 12);
  const pidpysyB: (string | undefined)[] = [];
  pidpysyB[j] = `${b} см`;
  pidpysyB[k] = '?';
  return {
    pytannia: `${umova(n, vidO)} ${vB(p + j)} = ${b} см. Знайди ${vB(p + k)}.`,
    malunok: fales({ n, vidO, pidpysyB }),
    vidpovid: b,
    odynytsi: 'см',
    pidkazka: 'Прямі паралельні, а відрізки на першій стороні рівні. Що каже теорема Фалеса про другу сторону?',
    rozviazok: `За теоремою Фалеса відрізки другої сторони рівні між собою: ${vB(p + k)} = ${vB(p + j)} = ${b} см.`,
  };
}

/** Від вершини O: OBₖ складається з k рівних частин (знайти суму або одну частину). */
function suma(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 5);
  const t = r.chyslo(2, 9);
  const malunok = fales({ n, vidO: true });
  if (r.shans()) {
    const k = r.chyslo(2, n);
    const i = r.chyslo(0, n - 1);
    return {
      pytannia: `${umova(n, true)} ${vB(i)} = ${t} см. Знайди O${B(k)}.`,
      malunok,
      vidpovid: k * t,
      odynytsi: 'см',
      pidkazka: `Скільки рівних відрізків уміщається в O${B(k)}?`,
      rozviazok: `За теоремою Фалеса O${B(1)}, ${vB(1)}, … рівні між собою. O${B(k)} складається з ${k} таких відрізків: ${k} · ${t} = ${k * t} см.`,
    };
  }
  const i = r.chyslo(0, n - 1);
  return {
    pytannia: `${umova(n, true)} O${B(n)} = ${n * t} см. Знайди ${vB(i)}.`,
    malunok,
    vidpovid: t,
    odynytsi: 'см',
    pidkazka: `O${B(n)} складається з ${n} рівних відрізків.`,
    rozviazok: `За теоремою Фалеса O${B(n)} поділено на ${n} рівних відрізків: ${n * t} : ${n} = ${t} см.`,
  };
}

/** Підступ: на малюнку є довжина відрізка першої сторони, але шукаємо відрізок другої. */
function rizniStorony(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 5);
  const p = 1;
  const a = r.chyslo(2, 10);
  const b = r.krim(2, 12, [a]);
  const [j, k] = r.rizni(2, 0, n - 1);
  const ja = r.chyslo(0, n - 1);
  const pidpysyA: (string | undefined)[] = [];
  pidpysyA[ja] = `${a} см`;
  const pidpysyB: (string | undefined)[] = [];
  pidpysyB[j] = `${b} см`;
  pidpysyB[k] = '?';
  return {
    pytannia: `${umova(n, false)} ${vA(p + ja)} = ${a} см, ${vB(p + j)} = ${b} см. Знайди ${vB(p + k)}.`,
    malunok: fales({ n, pidpysyA, pidpysyB }),
    vidpovid: b,
    odynytsi: 'см',
    pidkazka: 'Порівнюй відрізки лише однієї сторони кута.',
    rozviazok: `Рівні між собою відрізки другої сторони: ${vB(p + k)} = ${vB(p + j)} = ${b} см. Довжина ${vA(p + ja)} тут ні до чого — відрізки різних сторін не обов'язково рівні.`,
  };
}

function tverdzhennia(r: Vypadok): TrenZavdannia {
  const vypadky: [string, boolean, string][] = [
    ['Паралельні прямі відтинають на одній стороні кута рівні відрізки. Тоді й на другій стороні відрізки рівні.', true, 'Це і є теорема Фалеса.'],
    ["Прямі перетинають сторони кута й відтинають на одній стороні рівні відрізки. Тоді й на другій стороні відрізки обов'язково рівні.", false, 'Прямі мають бути паралельними. Прямі «віялом» дають різні відрізки.'],
    ['Паралельні прямі відтинають на сторонах кута рівні відрізки, тож A₁A₂ = B₁B₂.', false, 'Рівні між собою відрізки однієї сторони. Відрізки різних сторін можуть бути різними.'],
    ['Паралельні прямі відтинають на одній стороні кута відрізки 2 см і 3 см. Тоді на другій стороні відрізки рівні.', false, 'Теорема вимагає рівних відрізків на першій стороні.'],
    ['Пряма, що проходить через середину сторони трикутника паралельно другій стороні, ділить третю сторону навпіл.', true, 'Це наслідок з теореми Фалеса.'],
    ['Будь-яка пряма, що проходить через середину сторони трикутника, ділить іншу сторону навпіл.', false, 'Пряма має бути паралельною третій стороні.'],
    ['Щоб поділити відрізок на 5 рівних частин, на допоміжному промені відкладають 5 рівних відрізків.', true, 'Скільки частин потрібно, стільки рівних відрізків і відкладають.'],
    ['Лінії зошита ділять навскісний відрізок на рівні частини.', true, 'Лінії паралельні й розташовані на однаковій відстані одна від одної, тож працює теорема Фалеса.'],
    ['Теорема Фалеса справджується лише для гострого кута.', false, 'Кут може бути будь-яким. Важливо лише, щоб прямі були паралельні, а відрізки на першій стороні — рівні.'],
    ['Кінці відрізка лежать на 1-й і 4-й лініях зошита. Лінії ділять його на 4 рівні частини.', false, 'Між 1-ю і 4-ю лініями лише 3 проміжки, тож частин 3.'],
  ];
  const [tekst, tak, poiasn] = r.vybir(vypadky);
  return {
    pytannia: `Чи правильне твердження? ${tekst}`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Теорема Фалеса має дві умови: прямі паралельні, відрізки на одній стороні рівні.',
    rozviazok: `${tak ? 'Так' : 'Ні'}. ${poiasn}`,
  };
}

/** Наслідок: M — середина сторони, MN ∥ іншій стороні → N — середина третьої. Є зайве число (довжина третьої сторони). */
function seredyna(r: Vypadok): TrenZavdannia {
  const [X, Y, Z] = r.vybir(TRYKUTNYKY);
  const k = r.chyslo(3, 15);
  const c = r.krim(5, 30, [2 * k, k]);
  const pochatok = `У трикутнику ${X}${Y}${Z} точка M — середина ${X}${Y}, ${X}${Z} = ${c} см. Через M провели пряму, паралельну ${X}${Z}, вона перетнула ${Y}${Z} у точці N.`;
  const pidkazka = `M — середина ${X}${Y}, MN ∥ ${X}${Z}. Що каже наслідок з теореми Фалеса про точку N?`;
  if (r.shans()) {
    const shukane = r.shans() ? `${Y}N` : `N${Z}`;
    return {
      pytannia: `${pochatok} ${Y}${Z} = ${2 * k} см. Знайди ${shukane}.`,
      vidpovid: k,
      odynytsi: 'см',
      pidkazka,
      rozviazok: `За наслідком з теореми Фалеса N — середина ${Y}${Z}: ${2 * k} : 2 = ${k} см. Довжина ${X}${Z} тут не потрібна.`,
    };
  }
  return {
    pytannia: `${pochatok} ${Y}N = ${k} см. Знайди ${Y}${Z}.`,
    vidpovid: 2 * k,
    odynytsi: 'см',
    pidkazka,
    rozviazok: `За наслідком з теореми Фалеса N — середина ${Y}${Z}, тож ${Y}${Z} = 2 · ${k} = ${2 * k} см.`,
  };
}

/** Лінії зошита: між p-ю і q-ю лініями q − p проміжків (підступ — порахувати лінії). */
function zoshyt(r: Vypadok): TrenZavdannia {
  const p = r.chyslo(1, 3);
  const q = p + r.chyslo(2, 7);
  const t = r.chyslo(9, 20);
  const d = q - p;
  const umova = `Кінці навскісного відрізка AB лежать на ${p}-й і ${q}-й лініях зошита.`;
  if (r.shans()) {
    return {
      pytannia: `${umova} AB = ${d * t} мм. Лінії ділять AB на рівні частини. Знайди довжину однієї частини.`,
      vidpovid: t,
      odynytsi: 'мм',
      pidkazka: `Порахуй проміжки між ${p}-ю і ${q}-ю лініями, а не самі лінії.`,
      rozviazok: `Проміжків між лініями ${q} − ${p} = ${d}, тож частин ${d}: ${d * t} : ${d} = ${t} мм.`,
    };
  }
  return {
    pytannia: `${umova} Сусідні лінії відтинають на AB частини по ${t} мм. Знайди AB.`,
    vidpovid: d * t,
    odynytsi: 'мм',
    pidkazka: `Порахуй проміжки між ${p}-ю і ${q}-ю лініями, а не самі лінії.`,
    rozviazok: `Проміжків між лініями ${q} − ${p} = ${d}, тож AB = ${d} · ${t} = ${d * t} мм.`,
  };
}

/** Поділ відрізка на n рівних частин: скільки відрізків відкласти, скільки прямих провести. */
function podil(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 12);
  const typ = r.chyslo(1, 3);
  const chastyn = skilky(n, 'рівну частину', 'рівні частини', 'рівних частин');
  if (typ === 1) {
    return {
      pytannia: `Відрізок ділять на ${chastyn} за теоремою Фалеса. На допоміжному промені відклали ${skilky(n, 'рівний відрізок', 'рівні відрізки', 'рівних відрізків')} і з'єднали останню точку з кінцем відрізка. Скільки ще прямих, паралельних цій, треба провести?`,
      vidpovid: n - 1,
      pidkazka: 'Одну пряму вже провели — через останню точку поділу.',
      rozviazok: `Через решту точок поділу: ${n} − 1 = ${n - 1}. Разом з першою прямою це ${skilky(n, 'частина', 'частини', 'частин')}.`,
    };
  }
  if (typ === 2) {
    return {
      pytannia: `Відрізок ділять за теоремою Фалеса: з'єднали останню точку на допоміжному промені з кінцем відрізка і провели ще ${n - 1} паралельних цій прямих. На скільки рівних частин поділено відрізок?`,
      vidpovid: n,
      pidkazka: 'Разом з першою прямою скільки всього прямих перетинають відрізок?',
      rozviazok: `Усього прямих ${n - 1} + 1 = ${n}, і кожна відтинає одну частину: частин ${n}.`,
    };
  }
  const t = r.chyslo(2, 9);
  return {
    pytannia: `Відрізок завдовжки ${n * t} см поділили на ${chastyn} за теоремою Фалеса. Знайди довжину однієї частини.`,
    vidpovid: t,
    odynytsi: 'см',
    pidkazka: 'Частини рівні.',
    rozviazok: `${n * t} : ${n} = ${t} см.`,
  };
}

/** Трикутник: XM = MK = KY, прямі через M і K паралельні YZ ділять XZ на три рівні частини. */
function trykutnyk(r: Vypadok): TrenZavdannia {
  const [X, Y, Z] = r.vybir(TRYKUTNYKY);
  const t = r.chyslo(2, 12);
  const vypadky: [string, number][] = [
    [`${X}P`, 1],
    ['PQ', 1],
    [`Q${Z}`, 1],
    [`${X}Q`, 2],
    [`P${Z}`, 2],
  ];
  const [shukane, k] = r.vybir(vypadky);
  return {
    pytannia: `На стороні ${X}${Y} трикутника ${X}${Y}${Z} позначили точки M і K так, що ${X}M = MK = K${Y}. Через M і K провели прямі, паралельні ${Y}${Z}, вони перетнули ${X}${Z} у точках P і Q. ${X}${Z} = ${3 * t} см. Знайди ${shukane}.`,
    vidpovid: k * t,
    odynytsi: 'см',
    pidkazka: `Прямі MP, KQ і ${Y}${Z} паралельні й відтинають на ${X}${Y} рівні відрізки.`,
    rozviazok: `За теоремою Фалеса ${X}P = PQ = Q${Z} = ${3 * t} : 3 = ${t} см.${k === 2 ? ` ${shukane} — це дві частини: 2 · ${t} = ${2 * t} см.` : ''}`,
  };
}

/** Відомий відрізок з кількох частин другої сторони — знайти інший такий. */
function cherez(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(4, 6);
  const t = r.chyslo(2, 9);
  for (;;) {
    const [p, q] = r.rizni(2, 1, n + 1).sort((x, y) => x - y);
    const [s1, s2] = r.rizni(2, 1, n + 1).sort((x, y) => x - y);
    if (q - p < 2 || (s1 === p && s2 === q)) continue;
    const d = s2 - s1;
    return {
      pytannia: `${umova(n, false)} ${B(p)}${B(q)} = ${(q - p) * t} см. Знайди ${B(s1)}${B(s2)}.`,
      vidpovid: d * t,
      odynytsi: 'см',
      pidkazka: `Знайди спершу один відрізок: ${B(p)}${B(q)} складається з ${q - p} рівних частин.`,
      rozviazok: `${B(p)}${B(q)} складається з ${q - p} рівних частин: ${(q - p) * t} : ${q - p} = ${t} см. ${B(s1)}${B(s2)} — це ${skilky(d, 'частина', 'частини', 'частин')}: ${d} · ${t} = ${d * t} см.`,
    };
  }
}

export default {
  rivni: ['рівні відрізки', 'з підступом', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([rivni, suma, suma])(r);
    if (riven === 2) return r.vybir([rizniStorony, tverdzhennia, seredyna, rivni])(r);
    return r.vybir([zoshyt, podil, trykutnyk, cherez])(r);
  },
} satisfies Henerator;
