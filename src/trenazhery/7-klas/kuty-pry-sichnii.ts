// Кути при січній: назвати пару (відповідні, внутрішні різносторонні, внутрішні односторонні), знайти номер
// кута в парі, порахувати кут біля однієї точки перетину. Нумерація та сама, що в темі (див. heometriia.ts).
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { sichna, vydPary, velychyna, vnutrishnii } from '../heometriia.ts';
import type { VydPary } from '../heometriia.ts';

const TRY: VydPary[] = ['відповідні', 'внутрішні різносторонні', 'внутрішні односторонні'];
const PIAT: VydPary[] = [...TRY, 'вертикальні', 'суміжні'];
const TN = ['Так', 'Ні'];

/** Усі впорядковані пари кутів (i, j), що мають одну з назв. */
function pary(vydy: VydPary[]) {
  const p: [number, number][] = [];
  for (let i = 1; i <= 8; i++)
    for (let j = 1; j <= 8; j++) {
      const v = vydPary(i, j);
      if (v && vydy.includes(v)) p.push([i, j]);
    }
  return p;
}
const PARY3 = pary(TRY);
const PARY5 = pary(PIAT);

const kutSichnoi = (r: Vypadok) => r.krim(40, 140, [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]);

function chomu(i: number, j: number): string {
  const v = vydPary(i, j)!;
  if (v === 'вертикальні') return `Кути ${i} і ${j} — біля однієї точки, навпроти один одного: це вертикальні кути.`;
  if (v === 'суміжні') return `Кути ${i} і ${j} — біля однієї точки, поруч, разом утворюють розгорнутий кут: це суміжні кути.`;
  if (v === 'відповідні') return `Кути ${i} і ${j} стоять на однакових місцях — кожен біля своєї прямої. Це відповідні кути.`;
  const rizni = v.endsWith('різносторонні');
  return `Обидва кути між прямими — внутрішні; вони ${rizni ? 'по різні боки' : 'по один бік'} від січної — ${rizni ? 'різносторонні' : 'односторонні'}.`;
}

const PIDKAZKA_NAZVA = 'Між прямими кути чи поза ними? По різні боки від січної чи по один?';

function nazvaZafarbovanykh(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(PARY3);
  return {
    pytannia: 'Як називаються зафарбовані кути?',
    malunok: sichna({ kut: kutSichnoi(r), vydilyty: [i, j], strilky: true }),
    vidpovid: vydPary(i, j)!,
    varianty: TRY,
    pidkazka: PIDKAZKA_NAZVA,
    rozviazok: chomu(i, j),
  };
}

function nazvaZaNomeramy(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(PARY3);
  return {
    pytannia: `Як називаються кути ${i} і ${j}?`,
    malunok: sichna({ kut: kutSichnoi(r), strilky: true }),
    vidpovid: vydPary(i, j)!,
    varianty: TRY,
    pidkazka: PIDKAZKA_NAZVA,
    rozviazok: chomu(i, j),
  };
}

function nomerKuta(r: Vypadok): TrenZavdannia {
  const [k, m] = r.vybir(PARY3);
  const v = vydPary(k, m)!;
  const shcho =
    v === 'відповідні'
      ? `відповідного до кута ${k}`
      : `який з кутом ${k} утворює пару внутрішніх ${v.endsWith('різносторонні') ? 'різносторонніх' : 'односторонніх'} кутів`;
  return {
    pytannia: `Впиши номер кута, ${shcho}.`,
    malunok: sichna({ kut: kutSichnoi(r), vydilyty: [k], strilky: true }),
    vidpovid: m,
    pidkazka:
      v === 'відповідні'
        ? `Де стоїть кут ${k} біля своєї прямої? Знайди таке саме місце біля другої прямої.`
        : `Шукай між прямими, ${v.endsWith('різносторонні') ? 'по другий бік' : 'по той самий бік'} від січної.`,
    rozviazok: chomu(k, m),
  };
}

function nazvaPiatVariantiv(r: Vypadok): TrenZavdannia {
  // Назви пар не залежать від того, паралельні прямі чи ні.
  const [i, j] = r.vybir(PARY5);
  const nakhyl = r.vybir([0, 0, 12, -12]);
  return {
    pytannia: `${nakhyl ? 'Прямі a і b не паралельні. ' : ''}Як називаються зафарбовані кути?`,
    malunok: sichna({ kut: kutSichnoi(r), nakhyl, vydilyty: [i, j], strilky: nakhyl === 0 }),
    vidpovid: vydPary(i, j)!,
    varianty: PIAT,
    pidkazka: 'Кути біля однієї точки чи біля різних? Якщо біля різних — між прямими чи поза ними, по який бік від січної?',
    rozviazok: chomu(i, j),
  };
}

function chyNazvaVirna(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(PARY3);
  const pravylna = vydPary(i, j)!;
  const nazva = r.shans() ? pravylna : r.vybir(TRY.filter((v) => v !== pravylna));
  const tak = nazva === pravylna;
  return {
    pytannia: `Прямі a і b не паралельні. Чи є кути ${i} і ${j} ${nazva === 'відповідні' ? 'відповідними' : nazva.replace('внутрішні', 'внутрішніми').replace('сторонні', 'сторонніми')}?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: 'Назва пари залежить лише від того, де стоять кути, а не від паралельності прямих.',
    rozviazok: tak
      ? `Так. ${chomu(i, j)} Те, що прямі не паралельні, на назву не впливає.`
      : `Ні. ${chomu(i, j)}`,
  };
}

function kutBilyaTochky(r: Vypadok): TrenZavdannia {
  // Відомий кут і шуканий — біля однієї точки перетину; якщо прямі не паралельні, на малюнку є ще й «зайвий» кут біля іншої прямої.
  const nakhyl = r.vybir([0, 10, 14, -10]);
  const kut = r.krim(45, 135, [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]);
  const k = r.chyslo(1, 8);
  const m = r.krim(k <= 4 ? 1 : 5, k <= 4 ? 4 : 8, [k]);
  const pidpysy: Record<number, string> = { [k]: `${velychyna(k, kut, nakhyl)}°`, [m]: '?' };
  if (nakhyl) {
    const z = r.chyslo(k <= 4 ? 5 : 1, k <= 4 ? 8 : 4);
    pidpysy[z] = `${velychyna(z, kut, nakhyl)}°`;
  }
  const vk = velychyna(k, kut, nakhyl);
  const vert = vydPary(k, m) === 'вертикальні';
  return {
    pytannia: `${nakhyl ? 'Прямі a і b не паралельні. ' : ''}Знайди кут ${m} на малюнку.`,
    malunok: sichna({ kut, nakhyl, pidpysy, strilky: nakhyl === 0 }),
    vidpovid: velychyna(m, kut, nakhyl),
    odynytsi: '°',
    pidkazka: `Кут ${m} — біля прямої ${m <= 4 ? 'a' : 'b'}. Який відомий кут стоїть біля тієї самої точки?`,
    rozviazok: vert
      ? `Кути ${k} і ${m} вертикальні, тож кут ${m} теж ${vk}°.`
      : `Кути ${k} і ${m} суміжні, тож кут ${m} дорівнює 180° − ${vk}° = ${180 - vk}°`,
  };
}

const LICHBA: [string, number, string][] = [
  ['відповідних', 4, '1 і 5, 2 і 6, 3 і 7, 4 і 8'],
  ['внутрішніх різносторонніх', 2, '3 і 6, 4 і 5'],
  ['внутрішніх односторонніх', 2, '3 і 5, 4 і 6'],
  ['вертикальних', 4, 'по дві біля кожної точки: 1 і 4, 2 і 3, 5 і 8, 6 і 7'],
  ['суміжних', 8, 'по чотири біля кожної точки'],
];

function skilkyPar(r: Vypadok): TrenZavdannia {
  const [vyd, n, yaki] = r.vybir(LICHBA);
  return {
    pytannia: `Скільки всього пар ${vyd} кутів утворюється при перетині двох прямих січною?`,
    malunok: sichna({ kut: kutSichnoi(r), strilky: true }),
    vidpovid: n,
    pidkazka: 'Випиши пари за номерами на малюнку.',
    rozviazok: `${n} ${n === 2 || n === 4 ? 'пари' : 'пар'}: ${yaki}.`,
  };
}

const vertykalnyi = (k: number) => [4, 3, 2, 1][(k - 1) % 4] + (k <= 4 ? 0 : 4);
const vidpovidnyi = (k: number) => (k <= 4 ? k + 4 : k - 4);
const naProtyBik = (k: number, odnostoronnii: boolean) => {
  for (let m = 1; m <= 8; m++)
    if (vydPary(k, m) === (odnostoronnii ? 'внутрішні односторонні' : 'внутрішні різносторонні')) return m;
  return 0;
};

function dvaKroky(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(1, 8);
  const typ = r.chyslo(0, vnutrishnii(k) ? 1 : 3); // для зовнішнього кута вертикальний — внутрішній, тож є ще два типи
  const v = vertykalnyi(k);
  let pytannia: string;
  let vidpovid: number;
  let rozviazok: string;
  if (typ === 0) {
    vidpovid = vidpovidnyi(v);
    pytannia = `Впиши номер кута, відповідного до кута, вертикального з кутом ${k}.`;
    rozviazok = `Вертикальний з кутом ${k} — кут ${v}. Відповідний до кута ${v} — кут ${vidpovid}.`;
  } else if (typ === 1) {
    const w = vidpovidnyi(k);
    vidpovid = vertykalnyi(w);
    pytannia = `Впиши номер кута, вертикального з кутом, відповідним до кута ${k}.`;
    rozviazok = `Відповідний до кута ${k} — кут ${w}. Вертикальний з кутом ${w} — кут ${vidpovid}.`;
  } else {
    const odno = typ === 3;
    vidpovid = naProtyBik(v, odno);
    const nazva = odno ? 'внутрішніх односторонніх' : 'внутрішніх різносторонніх';
    pytannia = `Впиши номер кута, що утворює пару ${nazva} кутів з кутом, вертикальним до кута ${k}.`;
    rozviazok = `Вертикальний з кутом ${k} — кут ${v}, він внутрішній. З ним пару ${nazva} утворює кут ${vidpovid}.`;
  }
  return {
    pytannia,
    malunok: sichna({ kut: kutSichnoi(r), vydilyty: [k], strilky: true }),
    vidpovid,
    pidkazka: 'Іди по кроках: спершу знайди перший кут, потім від нього — другий.',
    rozviazok,
  };
}

export default {
  rivni: ['назви пару', 'знайди номер', 'кути й лічба'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([nazvaZafarbovanykh, nazvaZafarbovanykh, nazvaZaNomeramy])(r);
    if (riven === 2) return r.vybir([nomerKuta, nomerKuta, nazvaPiatVariantiv, chyNazvaVirna])(r);
    return r.vybir([kutBilyaTochky, kutBilyaTochky, dvaKroky, skilkyPar])(r);
  },
} satisfies Henerator;
