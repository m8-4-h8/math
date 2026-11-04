// Властивості паралельних прямих: знайти кут у парі (різносторонні й відповідні рівні, односторонні разом 180°),
// у два кроки — через вертикальний чи суміжний кут; пастка «прямі не паралельні»; задачі на відношення,
// різницю, суму кутів і перпендикуляр до однієї з паралельних.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { sichna, vydPary, velychyna } from '../heometriia.ts';
import type { VydPary } from '../heometriia.ts';

const TN = ['Так', 'Ні'];
const TRY: VydPary[] = ['відповідні', 'внутрішні різносторонні', 'внутрішні односторонні'];

function pary(umova: (v: VydPary | null) => boolean) {
  const p: [number, number][] = [];
  for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) if ((i <= 4) !== (j <= 4) && umova(vydPary(i, j))) p.push([i, j]);
  return p;
}
const NAZVANI = pary((v) => v !== null && TRY.includes(v));
const BEZ_NAZVY = pary((v) => v === null || !TRY.includes(v));
const RIVNI_PARY = NAZVANI.filter(([a, b]) => vydPary(a, b) !== 'внутрішні односторонні');
const ODNOSTORONNI = NAZVANI.filter(([a, b]) => vydPary(a, b) === 'внутрішні односторонні');

const kutVid = (r: Vypadok) => r.krim(35, 145, [86, 87, 88, 89, 90, 91, 92, 93, 94]);
/** Кут січної (кут 2), за якого кут i має величину alfa. */
const kutDlia = (i: number, alfa: number) => (velychyna(i, alfa) === alfa ? alfa : 180 - alfa);

/** Пояснення для пари з назвою: «рівні: 70°» або «разом 180°: 180° − 70° = 110°». */
function krokPary(i: number, j: number, alfa: number) {
  const vyd = vydPary(i, j)!;
  return vyd === 'внутрішні односторонні'
    ? `Кути ${i} і ${j} — внутрішні односторонні, разом 180°. Тож кут ${j} дорівнює 180° − ${alfa}° = ${180 - alfa}°`
    : `Кути ${i} і ${j} — ${vyd}. При паралельних прямих вони рівні, тож кут ${j} теж ${alfa}°.`;
}

function parnyiZaMalunkom(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(NAZVANI);
  const alfa = kutVid(r);
  const kut = kutDlia(i, alfa);
  return {
    pytannia: `a ∥ b. Знайди кут ${j}.`,
    malunok: sichna({ kut, vydilyty: [i, j], pidpysy: { [i]: `${alfa}°`, [j]: '?' }, strilky: true }),
    vidpovid: velychyna(j, kut),
    odynytsi: '°',
    pidkazka: `Як називаються кути ${i} і ${j}? Вони рівні чи разом 180°?`,
    rozviazok: krokPary(i, j, alfa),
  };
}

function parnyiTekstom(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(NAZVANI);
  const alfa = kutVid(r);
  const kut = kutDlia(i, alfa);
  return {
    pytannia: `a ∥ b, ∠${i} = ${alfa}°. Знайди ∠${j}.`,
    malunok: sichna({ kut, strilky: true }),
    vidpovid: velychyna(j, kut),
    odynytsi: '°',
    pidkazka: `Знайди кути ${i} і ${j} на малюнку. Як називається ця пара?`,
    rozviazok: krokPary(i, j, alfa),
  };
}

function dvaKroky(r: Vypadok): TrenZavdannia {
  // Пара без назви: спершу кут біля тієї самої точки (вертикальний чи суміжний), потім — відповідний.
  const [i, j] = r.vybir(BEZ_NAZVY);
  const alfa = kutVid(r);
  const kut = kutDlia(i, alfa);
  const c = j <= 4 ? j + 4 : j - 4; // біля тієї самої прямої, що й i, відповідний до j
  const vc = velychyna(c, kut);
  const krok =
    vydPary(i, c) === 'вертикальні'
      ? `Кути ${i} і ${c} вертикальні, тож кут ${c} теж ${alfa}°.`
      : `Кути ${i} і ${c} суміжні, тож кут ${c} дорівнює 180° − ${alfa}° = ${vc}°.`;
  return {
    pytannia: `a ∥ b. Знайди кут ${j}.`,
    malunok: sichna({ kut, vydilyty: [i, j], pidpysy: { [i]: `${alfa}°`, [j]: '?' }, strilky: true }),
    vidpovid: vc,
    odynytsi: '°',
    pidkazka: `Кути ${i} і ${j} не утворюють пару з назвою. Знайди спершу кут ${c}: він біля тієї самої точки, що й кут ${i}.`,
    rozviazok: `${krok} Кути ${c} і ${j} відповідні, тож кут ${j} теж ${vc}°.`,
  };
}

function chyMozhna(r: Vypadok): TrenZavdannia {
  // Пастка: властивості працюють лише для паралельних прямих; і односторонні не рівні.
  const [i, j] = r.vybir(NAZVANI);
  const vyd = vydPary(i, j)!;
  const alfa = kutVid(r);
  const paralelni = r.shans(0.6);
  const pravylno = velychyna(j, kutDlia(i, alfa));
  const zaiavleno = !paralelni || r.shans() ? pravylno : 180 - pravylno;
  const tak = paralelni && zaiavleno === pravylno;
  const odno = vyd === 'внутрішні односторонні';
  let rozviazok: string;
  if (!paralelni) rozviazok = 'Ні. Властивості кутів при січній працюють лише для паралельних прямих, а тут a і b не паралельні.';
  else if (tak)
    rozviazok = odno
      ? `Так. Кути ${i} і ${j} внутрішні односторонні, і ${alfa}° + ${zaiavleno}° = 180°.`
      : `Так. Кути ${i} і ${j} — ${vyd}, при паралельних прямих вони рівні.`;
  else rozviazok = `Ні. ${krokPary(i, j, alfa)}`;
  return {
    pytannia: `Прямі a і b ${paralelni ? '' : 'не '}паралельні, ∠${i} = ${alfa}°. Чи можна стверджувати, що ∠${j} = ${zaiavleno}°?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: paralelni ? `Кути ${i} і ${j} — ${vyd}. Вони рівні чи разом 180°?` : 'Чи паралельні прямі? Коли працюють властивості?',
    rozviazok,
  };
}

const VIDNOSHENNIA = [[1, 2], [1, 3], [1, 5], [2, 3], [4, 5], [2, 7], [5, 7], [7, 8], [3, 7], [7, 11], [1, 8], [4, 11], [1, 4], [3, 2]] as const;

function vidnoshennia(r: Vypadok): TrenZavdannia {
  const [m, n] = r.vybir(VIDNOSHENNIA);
  const x = 180 / (m + n);
  const bilshyi = r.shans();
  const vidp = bilshyi ? Math.max(m, n) * x : Math.min(m, n) * x;
  return {
    pytannia: `a ∥ b. Внутрішні односторонні кути відносяться як ${m} : ${n}. Знайди ${bilshyi ? 'більший' : 'менший'} з них.`,
    vidpovid: vidp,
    odynytsi: '°',
    pidkazka: `Односторонні разом 180°: ${m === 1 ? '' : m}x + ${n}x = 180.`,
    rozviazok: `Разом 180°, тож $${m === 1 ? '' : m}x + ${n}x = 180$, $x = ${x}$. Кути ${m} · ${x}° = ${m * x}° і ${n} · ${x}° = ${n * x}°. ${bilshyi ? 'Більший' : 'Менший'} — ${vidp}°.`,
  };
}

function riznytsia(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(20, 85);
  const d = 180 - 2 * x;
  const bilshyi = r.shans();
  return {
    pytannia: `a ∥ b. Один із внутрішніх односторонніх кутів на ${d}° більший за інший. Знайди ${bilshyi ? 'більший' : 'менший'} кут.`,
    vidpovid: bilshyi ? x + d : x,
    odynytsi: '°',
    pidkazka: `Односторонні разом 180°: x + x + ${d} = 180.`,
    rozviazok: `Разом 180°, тож $x + x + ${d} = 180$, $x = ${x}$. Кути ${x}° і ${x}° + ${d}° = ${x + d}°. Разом ${x}° + ${x + d}° = 180° ✓`,
  };
}

function sumaRivnykh(r: Vypadok): TrenZavdannia {
  // Сума двох рівних кутів (різносторонніх чи відповідних) — кожен половина; далі ще один кут біля точки перетину.
  const [i, j] = r.vybir(RIVNI_PARY);
  const vyd = vydPary(i, j)!;
  const h = kutVid(r);
  const s = 2 * h;
  const kut = kutDlia(i, h);
  const dali = r.shans(0.6);
  const m = dali ? r.krim(1, 8, [i, j]) : i;
  const baza = (m <= 4) === (i <= 4) ? i : j;
  const vm = velychyna(m, kut);
  const vert = vydPary(baza, m) === 'вертикальні';
  return {
    pytannia: `a ∥ b. ∠${i} + ∠${j} = ${s}°. Знайди ∠${m}.`,
    malunok: sichna({ kut, strilky: true }),
    vidpovid: vm,
    odynytsi: '°',
    pidkazka: `Кути ${i} і ${j} — ${vyd}. Які вони при паралельних прямих?`,
    rozviazok:
      `Кути ${i} і ${j} — ${vyd}, вони рівні, кожен ${s}° : 2 = ${h}°.` +
      (!dali
        ? ''
        : vert
          ? ` Кути ${baza} і ${m} вертикальні, тож кут ${m} теж ${h}°.`
          : ` Кути ${baza} і ${m} суміжні, тож кут ${m} дорівнює 180° − ${h}° = ${vm}°`),
  };
}

function perpendykuliar(r: Vypadok): TrenZavdannia {
  const [p1, p2] = r.shans() ? ['a', 'b'] : ['b', 'a'];
  const k = r.chyslo(p2 === 'a' ? 1 : 5, p2 === 'a' ? 4 : 8);
  const vsi = r.shans();
  return {
    pytannia: vsi
      ? `a ∥ b, січна c перпендикулярна до прямої ${p1}. Під яким кутом c перетинає пряму ${p2}?`
      : `a ∥ b, січна c перпендикулярна до прямої ${p1}. Знайди кут ${k} біля прямої ${p2}.`,
    vidpovid: 90,
    odynytsi: '°',
    pidkazka: 'Відповідні кути при паралельних прямих рівні.',
    rozviazok: `Біля прямої ${p1} кут 90°. Відповідний до нього кут біля прямої ${p2} теж 90°, а з ним і всі інші: c ⊥ ${p2}.`,
  };
}

export default {
  rivni: ['кут у парі', 'у два кроки', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([parnyiZaMalunkom, parnyiZaMalunkom, parnyiTekstom])(r);
    if (riven === 2) return r.vybir([dvaKroky, dvaKroky, chyMozhna, parnyiTekstom])(r);
    return r.vybir([vidnoshennia, riznytsia, sumaRivnykh, sumaRivnykh, perpendykuliar])(r);
  },
} satisfies Henerator;
