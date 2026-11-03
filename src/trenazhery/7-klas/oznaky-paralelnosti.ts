// Ознаки паралельності: за двома кутами вирішити, чи паралельні прямі; пастки (односторонні рівні, кути біля
// однієї прямої, пара без назви — у два кроки); знайти x, при якому прямі паралельні.
// Малюнків тут навмисно немає: на малюнку паралельність видно «на око», а треба вирішувати за числами.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { vydPary, velychyna } from '../heometriia.ts';
import type { VydPary } from '../heometriia.ts';

const TN = ['Так', 'Ні'];
const TRY: VydPary[] = ['відповідні', 'внутрішні різносторонні', 'внутрішні односторонні'];

/** Впорядковані пари кутів з різних прямих (i — біля a, j — біля b, або навпаки). */
function pary(umova: (v: VydPary | null) => boolean) {
  const p: [number, number][] = [];
  for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) if ((i <= 4) !== (j <= 4) && umova(vydPary(i, j))) p.push([i, j]);
  return p;
}
const NAZVANI = pary((v) => v !== null && TRY.includes(v));
const BEZ_NAZVY = pary((v) => v === null || !TRY.includes(v));
const ODNA_PRIAMA: [number, number][] = [];
for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) if (i !== j && (i <= 4) === (j <= 4)) ODNA_PRIAMA.push([i, j]);

const kutVid = (r: Vypadok) => r.krim(35, 145, [86, 87, 88, 89, 90, 91, 92, 93, 94]);
/** Кут січної (кут 2), за якого кут i має величину alfa. */
const kutDlia = (i: number, alfa: number) => (velychyna(i, alfa) === alfa ? alfa : 180 - alfa);
/** На скільки градусів «зіпсувати» кут, щоб прямі не були паралельні. */
const vidkhylennia = (r: Vypadok) => r.vybir([-12, -8, -6, -4, -3, -2, 2, 3, 4, 6, 8, 12]);

const OZNAKA: Record<string, string> = {
  відповідні: 'Для відповідних кутів ознака — вони рівні.',
  'внутрішні різносторонні': 'Для внутрішніх різносторонніх кутів ознака — вони рівні.',
  'внутрішні односторонні': 'Для внутрішніх односторонніх кутів ознака — разом 180°.',
};

function takChyNi(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(NAZVANI);
  const vyd = vydPary(i, j)!;
  const alfa = kutVid(r);
  const paralelni = r.shans();
  const kut = kutDlia(i, alfa);
  const beta = velychyna(j, kut) + (paralelni ? 0 : vidkhylennia(r));
  const odno = vyd === 'внутрішні односторонні';
  return {
    pytannia: `∠${i} = ${alfa}°, ∠${j} = ${beta}°. Чи паралельні прямі a і b?`,
    vidpovid: paralelni ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: `Кути ${i} і ${j} — ${vyd}. ${OZNAKA[vyd]}`,
    rozviazok: odno
      ? `Кути ${i} і ${j} — внутрішні односторонні, разом ${alfa}° + ${beta}° = ${alfa + beta}°. ${paralelni ? 'Ознака виконується, отже, a ∥ b.' : 'Це не 180°, тож прямі не паралельні.'}`
      : `Кути ${i} і ${j} — ${vyd}, ${paralelni ? 'і вони рівні. Отже, a ∥ b.' : `але ${alfa}° ≠ ${beta}°. Прямі не паралельні.`}`,
  };
}

function odnostoronniRivni(r: Vypadok): TrenZavdannia {
  // Пастка: односторонні кути рівні — це ще не ознака (крім випадку 90° і 90°).
  const [i, j] = r.vybir(NAZVANI.filter(([a, b]) => vydPary(a, b) === 'внутрішні односторонні'));
  const alfa = r.shans(0.2) ? 90 : kutVid(r);
  const tak = alfa === 90;
  return {
    pytannia: `∠${i} = ${alfa}°, ∠${j} = ${alfa}°. Чи паралельні прямі a і b?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: `Кути ${i} і ${j} — внутрішні односторонні. Вони мають бути рівні чи разом давати 180°?`,
    rozviazok: `Кути ${i} і ${j} — внутрішні односторонні, разом ${alfa}° + ${alfa}° = ${2 * alfa}°. ${tak ? 'Ознака виконується: a ∥ b (обидві прямі перпендикулярні до січної).' : 'Це не 180°, тож прямі не паралельні.'}`,
  };
}

const NI_ODNA = 'ні, обидва біля однієї прямої';
function odnaPriama(r: Vypadok): TrenZavdannia {
  // Пастка: рівні вертикальні чи суміжні кути біля однієї точки нічого не кажуть про другу пряму.
  const [i, j] = r.vybir(ODNA_PRIAMA);
  const vyd = vydPary(i, j)!;
  const alfa = kutVid(r);
  const beta = vyd === 'вертикальні' ? alfa : 180 - alfa;
  const [ts, insha] = i <= 4 ? ['a', 'b'] : ['b', 'a'];
  return {
    pytannia: `∠${i} = ${alfa}°, ∠${j} = ${beta}°. Чи можна звідси зробити висновок, що a ∥ b?`,
    vidpovid: NI_ODNA,
    varianty: ['так, a ∥ b', NI_ODNA],
    pidkazka: `Де лежать кути ${i} і ${j} — біля однієї прямої чи біля різних?`,
    rozviazok: `Ні. Кути ${i} і ${j} — ${vyd} біля прямої ${ts}, вони такі завжди. Про пряму ${insha} вони нічого не кажуть.`,
  };
}

function uDvaKroky(r: Vypadok): TrenZavdannia {
  // Пара без назви (чи зовнішня): переходимо до відповідного кута через вертикальний або суміжний.
  const [i, j] = r.vybir(BEZ_NAZVY);
  const alfa = kutVid(r);
  const paralelni = r.shans();
  const kut = kutDlia(i, alfa);
  const beta = velychyna(j, kut) + (paralelni ? 0 : vidkhylennia(r));
  const c = j <= 4 ? j + 4 : j - 4; // кут біля тієї самої прямої, що й i, відповідний до j
  const vc = velychyna(c, kut);
  const krok =
    vydPary(i, c) === 'вертикальні'
      ? `Кути ${i} і ${c} вертикальні, тож кут ${c} теж ${alfa}°.`
      : `Кути ${i} і ${c} суміжні, тож кут ${c} дорівнює 180° − ${alfa}° = ${vc}°.`;
  return {
    pytannia: `∠${i} = ${alfa}°, ∠${j} = ${beta}°. Чи паралельні прямі a і b?`,
    vidpovid: paralelni ? 'Так' : 'Ні',
    varianty: TN,
    pidkazka: `Кути ${i} і ${j} не утворюють пару з назвою. Знайди спершу кут ${c} — він відповідний до кута ${j}.`,
    rozviazok: `${krok} Кути ${c} і ${j} відповідні: ${paralelni ? `обидва по ${beta}°, отже, a ∥ b.` : `${vc}° ≠ ${beta}°, тож прямі не паралельні.`}`,
  };
}

/** «3x + 10», «x − 5», «4x» — для формули в $...$. */
function vyraz(p: number, q: number) {
  const px = p === 1 ? 'x' : `${p}x`;
  return q === 0 ? px : `${px} ${q > 0 ? '+' : '-'} ${Math.abs(q)}`;
}
/** Перевірка в розв'язку: «3 · 20 + 10 = 70». */
function pidstanovka(p: number, x: number, q: number, v: number) {
  const px = p === 1 ? `${x}` : `${p} · ${x}`;
  return q === 0 ? `${px} = ${v}` : `${px} ${q > 0 ? '+' : '−'} ${Math.abs(q)} = ${v}`;
}

function znaydyXRivni(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(NAZVANI.filter(([a, b]) => vydPary(a, b) !== 'внутрішні односторонні'));
  const vyd = vydPary(i, j)!;
  const x = r.chyslo(4, 30);
  const [p, s] = r.rizni(2, 1, 6);
  const v = r.chyslo(Math.max(30, 6 * x - 60), Math.min(150, x + 120));
  const [q, t] = [v - p * x, v - s * x];
  return {
    pytannia: `$\\angle ${i} = (${vyraz(p, q)})^\\circ$, $\\angle ${j} = (${vyraz(s, t)})^\\circ$. При якому $x$ прямі $a$ і $b$ паралельні?`,
    vidpovid: x,
    pidkazka: `Кути ${i} і ${j} — ${vyd}. Вони мають бути рівні — склади рівняння.`,
    rozviazok: `Кути ${i} і ${j} — ${vyd}, вони мають бути рівні: $${vyraz(p, q)} = ${vyraz(s, t)}$, звідси $x = ${x}$. Перевірка. ${pidstanovka(p, x, q, v)} і ${pidstanovka(s, x, t, v)}, кути рівні ✓`,
  };
}

function znaydyXOdnostoronni(r: Vypadok): TrenZavdannia {
  const [i, j] = r.vybir(NAZVANI.filter(([a, b]) => vydPary(a, b) === 'внутрішні односторонні'));
  const x = r.chyslo(4, 30);
  const [p, s] = [r.chyslo(1, 5), r.chyslo(1, 5)];
  const v1 = r.chyslo(Math.max(35, p * x - 40), Math.min(145, p * x + 60));
  const v2 = 180 - v1;
  const [q, t] = [v1 - p * x, v2 - s * x];
  return {
    pytannia: `$\\angle ${i} = (${vyraz(p, q)})^\\circ$, $\\angle ${j} = (${vyraz(s, t)})^\\circ$. При якому $x$ прямі $a$ і $b$ паралельні?`,
    vidpovid: x,
    pidkazka: `Кути ${i} і ${j} — внутрішні односторонні. Разом вони мають дати 180°.`,
    rozviazok: `Кути ${i} і ${j} внутрішні односторонні, тож $(${vyraz(p, q)}) + (${vyraz(s, t)}) = 180$, звідси $x = ${x}$. Перевірка. ${pidstanovka(p, x, q, v1)}, ${pidstanovka(s, x, t, v2)}, разом ${v1}° + ${v2}° = 180° ✓`,
  };
}

export default {
  rivni: ['так чи ні', 'з підступом', 'знайди x'],
  zavdannia(r, riven) {
    if (riven === 1) return takChyNi(r);
    if (riven === 2) return r.vybir([odnostoronniRivni, odnaPriama, uDvaKroky, uDvaKroky, takChyNi])(r);
    return r.vybir([znaydyXRivni, znaydyXOdnostoronni])(r);
  },
} satisfies Henerator;
