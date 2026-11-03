// Автоперевірка генераторів тренажерів: `npm test`.
//
// Кожен генератор із `src/trenazhery/<N>-klas/*.ts` запускаємо сотні разів на кожному рівні й перевіряємо:
// • у завдання є умова, відповідь, немає «NaN», «undefined» тощо, усі формули $...$ розбирає KaTeX;
// • правильна відповідь приймається, а сусіднє число — ні; серед варіантів рівно один правильний
//   (кнопку порівнюємо з відповіддю точно, як у тренажері);
// • завдань достатньо різних, щоб гра з 10 прикладів не повторювалась;
// • там, де це можливо, відповідь перераховується НЕЗАЛЕЖНО від генератора: приклад «… =» обчислюємо,
//   у рівність з □ чи x підставляємо відповідь, у порівняння «a □ b» — знак;
// • кожна рівність у розв'язку й підказці правильна («38 + 10 = 48»), а остання дає відповідь.
//
//   npm test                                  — перевірити все
//   npm test -- 5-klas/dodavannia-drobiv      — лише ці генератори, з прикладами завдань
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import katex from 'katex';
import { pravylno } from '../src/scripts/perevirka.ts';
import { stvorytyVypadok } from '../src/trenazhery/dopomoha.ts';
import type { Henerator, Riven, TrenZavdannia } from '../src/trenazhery/dopomoha.ts';

const KORIN = fileURLToPath(new URL('..', import.meta.url));
const PAPKA = KORIN + 'src/trenazhery/';
const SPROB = 400;

// ——— Раціональні числа на BigInt: щоб 0,1 + 0,2 було рівно 0,3 ———
type Q = [bigint, bigint];
const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
function q(n: bigint, d: bigint = 1n): Q {
  if (d === 0n) throw new Error('ділення на нуль');
  if (d < 0n) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1n;
  return [n / g, d / g];
}
const dod = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const vid = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mn = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const dil = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
const rivni = (a: Q, b: Q) => a[0] === b[0] && a[1] === b[1];
const porivniaty = (a: Q, b: Q) => {
  const r = vid(a, b)[0];
  return r > 0n ? 1 : r < 0n ? -1 : 0;
};
function stepin(a: Q, b: Q): Q {
  if (b[1] !== 1n || b[0] < 0n || b[0] > 40n) throw new Error('степінь');
  let r = q(1n);
  for (let i = 0n; i < b[0]; i++) r = mn(r, a);
  return r;
}
function chysloQ(s: string): Q {
  const [c, d = ''] = s.split('.');
  return q(BigInt(c + d), 10n ** BigInt(d.length));
}

// ——— Розбір арифметичного виразу (запис як на сайті: ·, :, −, дроби \frac, десяткова кома) ———
function normalizuvaty(tekst: string): string | null {
  let t = tekst
    .replace(/\$/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\dfrac/g, '\\frac')
    .replace(/(\d)\{,\}(\d)/g, '$1.$2')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/(\d)(?:\\ |\\,| | | )(?=\d{3}(?!\d))/g, '$1')
    .replace(/\\cdot|\\times|[·×⋅]/g, '*')
    .replace(/\\div|[:÷]/g, '/')
    .replace(/[−–]/g, '-')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\\[,;! ]|\\quad/g, ' ')
    .replace(/[[\]]/g, (c) => (c === '[' ? '(' : ')'))
    .replace(/\s+/g, ' ')
    .trim();
  if (/\\[a-z]/i.test(t)) return null; // інші команди TeX — не беремося
  return t;
}

function obchyslyty(vyraz: string): Q | null {
  const t = normalizuvaty(vyraz);
  if (t === null || !/^[\d+\-*/^(). ]+$/.test(t)) return null;
  const tokeny = t.match(/\d+(?:\.\d+)?|[+\-*/^()]/g) || [];
  let i = 0;
  const pidhliad = () => tokeny[i];
  const vziaty = () => tokeny[i++];
  const vyrazP = (): Q => {
    let a = dodanok();
    while (pidhliad() === '+' || pidhliad() === '-') a = vziaty() === '+' ? dod(a, dodanok()) : vid(a, dodanok());
    return a;
  };
  const dodanok = (): Q => {
    let a = mnozhnyk();
    while (pidhliad() === '*' || pidhliad() === '/' || pidhliad() === '(') {
      const op = pidhliad() === '(' ? '*' : vziaty();
      a = op === '*' ? mn(a, mnozhnyk()) : dil(a, mnozhnyk());
    }
    return a;
  };
  const mnozhnyk = (): Q => {
    if (pidhliad() === '-') {
      vziaty();
      return mn(q(-1n), mnozhnyk());
    }
    const a = atom();
    if (pidhliad() === '^') {
      vziaty();
      return stepin(a, mnozhnyk());
    }
    return a;
  };
  const atom = (): Q => {
    const tk = vziaty();
    if (tk === '(') {
      const a = vyrazP();
      if (vziaty() !== ')') throw new Error('дужка');
      return a;
    }
    if (tk && /^\d/.test(tk)) return chysloQ(tk);
    throw new Error('токен ' + tk);
  };
  try {
    const r = vyrazP();
    return i === tokeny.length ? r : null;
  } catch {
    return null;
  }
}

/** Відповідь дитини як число: «3/4», «1 3/4», «−5», «3,5», «12 345». */
function vidpovidQ(s: string): Q | null {
  const t = s.replace(/ | /g, ' ').replace(/[−–]/g, '-').trim();
  let m = t.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (m) {
    const r = dod(q(BigInt(m[2])), q(BigInt(m[3]), BigInt(m[4])));
    return m[1] ? mn(q(-1n), r) : r;
  }
  m = t.match(/^(-?\d+)\/(\d+)$/);
  if (m) return q(BigInt(m[1]), BigInt(m[2]));
  const bezProbiliv = t.replace(/(\d) (?=\d{3}(?!\d))/g, '$1');
  if (/^-?\d+(?:[.,]\d+)?$/.test(bezProbiliv)) {
    const z = bezProbiliv.replace(',', '.');
    return z.startsWith('-') ? mn(q(-1n), chysloQ(z.slice(1))) : chysloQ(z);
  }
  return null;
}

// Рівності в розв'язку й підказці («1) 60 − 22 = 38; 2) 38 + 10 = 48») теж перераховуємо: кожна
// частина між «=» має давати те саме число. Так ловимо помилки й у текстових задачах.
function rivnostiVTeksti(tekst: string): { perevireno: number; pomylky: string[] } {
  const t = tekst
    .replace(/\$/g, ' ')
    .replace(/(\d)°/g, '$1') // градуси: «15° + 28° = 43°»
    .replace(/(\d+)\\(?:d|t)?frac\{(\d+)\}\{(\d+)\}/g, '($1 + $2/$3)') // мішане число 3\frac{4}{5}
    .replace(/\\(?:d|t)?frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\\cdot|\\times/g, '·')
    .replace(/\{,\}/g, ',')
    .replace(/(\d)(?:\\ |\u00a0|\u202f)(?=\d{3}(?!\d))/g, '$1')
    .replace(/(^\s*|;\s+|(?<!ост)\.\s+)\d\)\s/g, '$1') // нумерація кроків «1) … ; 2) …», але не «(ост. 1)» і не «(20 − 0)»
    .replace(/(\d|\))\s+:\s+(?=[\d(])/g, '$1 / ') // « : » з пробілами — ділення; «4: 5» і «3:30» — ні
    .replace(/(\d),(\d)/g, '$1.$2');
  const pomylky: string[] = [];
  let perevireno = 0;
  for (const [syryi] of t.matchAll(/[\d(][\d\s.+\-−·×/()=^]*[\d)]/g)) {
    if (!syryi.includes('=') || !/[+\-−·×/^]/.test(syryi)) continue;
    const pochatok = t.indexOf(syryi);
    const pered = t.slice(Math.max(0, pochatok - 2), pochatok);
    const pislia = t.slice(pochatok + syryi.length, pochatok + syryi.length + 2);
    // Шматок, вирваний із довшого запису (перед ним «?», знак дії, буква-змінна), не перевіряємо.
    if (/[?□+\-−·×/=^a-z]\s*$/i.test(pered) || /^\s*[?□+\-−·×/^=a-z]/i.test(pislia)) continue;
    const chastyny = syryi.split('=').map((x) => x.trim());
    if (chastyny.some((x) => !x)) continue;
    // «57 : 6 = 9 (ост. 3)»: перевіряємо 57 = 6 · 9 + 3 і 3 < 6.
    const ost = t.slice(pochatok + syryi.length).match(/^\s*\(ост\.?\s*(\d+)\)/);
    if (ost) {
      const m = chastyny.length === 2 && chastyny[0].match(/^(\d+)\s*\/\s*(\d+)$/);
      if (!m || !/^\d+$/.test(chastyny[1])) continue;
      perevireno++;
      const [a, d, chastka, o] = [Number(m[1]), Number(m[2]), Number(chastyny[1]), Number(ost[1])];
      if (a !== d * chastka + o || o >= d) pomylky.push(`хибне ділення з остачею «${syryi.trim()} (ост. ${o})» у тексті «${tekst}»`);
      continue;
    }
    const znachennia = chastyny.map((x) => obchyslyty(x));
    if (znachennia.some((x) => !x)) continue;
    perevireno++;
    if (!znachennia.every((x) => rivni(x!, znachennia[0]!))) pomylky.push(`хибна рівність «${syryi.trim()}» у тексті «${tekst}»`);
  }
  return { perevireno, pomylky };
}

type Nezalezhna = 'tak' | 'nemozhlyvo' | string; // string — опис помилки

// «Округли 3,96 до десятих» / «Округли 7462 до сотень» — округлюємо самі (половину — вгору).
const ODYNYTSI_OKRUHLENNIA: Record<string, Q> = {
  цілих: q(1n), десятих: q(1n, 10n), сотих: q(1n, 100n), тисячних: q(1n, 1000n),
  десятків: q(10n), сотень: q(100n), тисяч: q(1000n), 'десятків тисяч': q(10000n), мільйонів: q(1000000n), гривень: q(1n),
};
function okruhlennia(z: TrenZavdannia, vidpovidi: string[]): Nezalezhna | null {
  const m = (z.pytannia || '').match(/(?:Округли|—)\s+([\d\u00a0\u202f ]+(?:,\d+)?)[^.]*?\. Округли[^.]*?до (десятків тисяч|[а-яії]+)\.|Округли ([\d\u00a0\u202f ]+(?:,\d+)?) до (десятків тисяч|[а-яії]+)\./);
  if (!m) return null;
  const chyslo = vidpovidQ((m[1] ?? m[3]).trim());
  const odynytsia = ODYNYTSI_OKRUHLENNIA[m[2] ?? m[4]];
  const vidpovid = vidpovidQ(vidpovidi[0]);
  if (!chyslo || !odynytsia || !vidpovid) return 'nemozhlyvo';
  const chastka = dil(chyslo, odynytsia);
  let tsila = chastka[0] / chastka[1];
  if (porivniaty(vid(chastka, q(tsila)), q(1n, 2n)) >= 0) tsila += 1n;
  const pravylno = mn(q(tsila), odynytsia);
  return rivni(pravylno, vidpovid) ? 'tak' : `насправді ${pravylno[0]}/${pravylno[1]}`;
}

// «Чи ділиться 8712 на 9?», «Чи є 6 дільником числа 42?», «Чи є 25 кратним числа 4?», «Яке число 51?» (просте чи складене).
function podilnist(z: TrenZavdannia, vidpovidi: string[]): Nezalezhna | null {
  const p = (z.pytannia || '').replace(/[\u00a0\u202f ](?=\d{3}(?!\d))/g, '');
  const tak = (umova: boolean) => ((umova ? 'Так' : 'Ні') === vidpovidi[0] ? 'tak' : `насправді ${umova ? 'Так' : 'Ні'}`);
  let m = p.match(/^Чи ділиться (\d+) на (\d+)\?$/);
  if (m) return tak(Number(m[1]) % Number(m[2]) === 0);
  m = p.match(/^Чи є (\d+) дільником числа (\d+)\?$/);
  if (m) return tak(Number(m[2]) % Number(m[1]) === 0);
  m = p.match(/^Чи є (\d+) кратним числа (\d+)\?$/);
  if (m) return tak(Number(m[1]) % Number(m[2]) === 0);
  m = p.match(/\\text\{(НСД|НСК)\}\((\d+); (\d+)\)/);
  if (m) {
    const [a, b] = [Number(m[2]), Number(m[3])];
    let g = 1;
    for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) g = d;
    const prav = String(m[1] === 'НСД' ? g : (a * b) / g);
    return prav === vidpovidi[0] ? 'tak' : `насправді ${prav}`;
  }
  m = p.match(/^Яке число (\d+)\?$/);
  if (m && z.varianty?.includes('просте')) {
    const n = Number(m[1]);
    let dilnykiv = 0;
    for (let d = 1; d <= n; d++) if (n % d === 0) dilnykiv++;
    const prav = dilnykiv === 2 ? 'просте' : dilnykiv > 2 ? 'складене' : 'ні те, ні те';
    return prav === vidpovidi[0] ? 'tak' : `насправді ${prav}`;
  }
  return null;
}

function nezalezhnaPerevirka(z: TrenZavdannia, vidpovidi: string[]): Nezalezhna {
  const okr = okruhlennia(z, vidpovidi) ?? podilnist(z, vidpovidi);
  if (okr) return okr;
  if (!z.vyraz) return 'nemozhlyvo';
  const v = z.vyraz.replace(/\$/g, '').replace(/\\square/g, '□').trim(); // віконце у формулі — \square
  const pravylna = vidpovidi[0];
  // Порівняння «a □ b», відповідь — знак.
  if (z.varianty && ['>', '<', '='].includes(pravylna) && (v.match(/□/g) || []).length === 1 && !v.includes('=')) {
    const [l, p] = v.split('□');
    const a = obchyslyty(l);
    const b = obchyslyty(p);
    if (!a || !b) return 'nemozhlyvo';
    const znak = ['<', '=', '>'][porivniaty(a, b) + 1];
    return znak === pravylna ? 'tak' : `насправді ${znak}`;
  }
  // «вираз =» — обчислюємо.
  if (/=\s*$/.test(v) && !/□|\?|…|\.\.\./.test(v)) {
    const a = obchyslyty(v.replace(/=\s*$/, ''));
    const b = vidpovidQ(pravylna);
    if (!a || !b) return 'nemozhlyvo';
    return rivni(a, b) ? 'tak' : `насправді ${a[0]}/${a[1]}`;
  }
  // Рівність з одним невідомим (□, x, y, a, n) — підставляємо відповідь.
  const chastyny = v.split('=');
  const b = vidpovidQ(pravylna);
  if (chastyny.length === 2 && b) {
    const nevidomi = v.match(/□|(?<![a-z\\])[xyan](?![a-z])/g) || [];
    if (!nevidomi.length || new Set(nevidomi).size !== 1) return 'nemozhlyvo';
    const znach = `(${b[0]}/${b[1]})`;
    const pidstavyty = (s: string) => s.replace(/□|(?<![a-z\\])[xyan](?![a-z])/g, znach).replace(/(\d|\))\(/g, '$1*(');
    const l = obchyslyty(pidstavyty(chastyny[0]));
    const p = obchyslyty(pidstavyty(chastyny[1]));
    if (!l || !p) return 'nemozhlyvo';
    return rivni(l, p) ? 'tak' : `після підстановки ${l[0]}/${l[1]} ≠ ${p[0]}/${p[1]}`;
  }
  return 'nemozhlyvo';
}

// ——— Перевірка одного завдання ———
const POHANI = /NaN|undefined|Infinity|null|\[object|function/;

function formuly(tekst: string) {
  const pomylky: string[] = [];
  if ((tekst.match(/\$/g) || []).length % 2) pomylky.push(`непарна кількість $: ${tekst}`);
  for (const [, f] of tekst.matchAll(/\$([^$]+)\$/g)) {
    try {
      katex.renderToString(f, { throwOnError: true });
    } catch (e) {
      pomylky.push(`KaTeX не розбирає «${f}»: ${(e as Error).message.split('\n')[0]}`);
    }
  }
  return pomylky;
}

function perevirytyZavdannia(z: TrenZavdannia): { pomylky: string[]; nezalezhna: Nezalezhna } {
  const pomylky: string[] = [];
  if (!z || typeof z !== 'object') return { pomylky: ['генератор повернув не об’єкт'], nezalezhna: 'nemozhlyvo' };
  if (!z.pytannia && !z.vyraz) pomylky.push('немає ні pytannia, ні vyraz');
  if (z.malunok !== undefined && !/^<svg[\s>]/.test(z.malunok)) pomylky.push('malunok має бути <svg …>');
  const vidpovidi = (Array.isArray(z.vidpovid) ? z.vidpovid : [z.vidpovid]).map(String);
  if (!vidpovidi.length || vidpovidi.some((v) => !v.trim())) pomylky.push('порожня відповідь');
  const teksty = [z.malunok, z.pytannia, z.vyraz, z.rozviazok, z.pidkazka, z.pokaz, z.odynytsi, ...vidpovidi, ...(z.varianty || []).map(String)];
  for (const t of teksty) {
    if (t === undefined) continue;
    if (typeof t !== 'string') pomylky.push(`не рядок: ${String(t)}`);
    else {
      if (POHANI.test(t)) pomylky.push(`підозрілий текст: «${t}»`);
      pomylky.push(...formuly(t));
    }
  }
  const pryimaie = (vvid: string) => pravylno(vvid, vidpovidi) || !!z.perevirka?.(vvid);
  if (vidpovidi[0] && !pryimaie(vidpovidi[0])) pomylky.push(`власна відповідь «${vidpovidi[0]}» не приймається`);
  const chyslo = vidpovidQ(vidpovidi[0] || '');
  if (chyslo && chyslo[1] === 1n) {
    const susid = String(chyslo[0] + 1n).replace('-', '−');
    if (pryimaie(susid)) pomylky.push(`приймається і неправильна відповідь «${susid}» (правильна «${vidpovidi[0]}»)`);
  }
  if (z.varianty) {
    const v = z.varianty.map(String);
    if (v.length < 2) pomylky.push('менше двох варіантів');
    if (new Set(v).size !== v.length) pomylky.push(`однакові варіанти: ${v.join(' | ')}`);
    const pravylni = v.filter((x) => vidpovidi.includes(x));
    if (pravylni.length !== 1) pomylky.push(`правильних варіантів ${pravylni.length}, а має бути 1: ${v.join(' | ')} → «${vidpovidi[0]}»`);
  }
  let nezalezhna = pomylky.length ? 'nemozhlyvo' : nezalezhnaPerevirka(z, vidpovidi);
  if (nezalezhna !== 'tak' && nezalezhna !== 'nemozhlyvo')
    pomylky.push(`незалежна перевірка: ${nezalezhna} (відповідь «${vidpovidi[0]}»)`);
  for (const t of [z.rozviazok, z.pidkazka]) {
    if (!t) continue;
    const r = rivnostiVTeksti(t);
    pomylky.push(...r.pomylky);
    // Розв'язок з правильними кроками, що закінчуються відповіддю, — теж незалежна перевірка.
    if (t === z.rozviazok && nezalezhna === 'nemozhlyvo' && r.perevireno && !r.pomylky.length) {
      const ostannie = [...t.replace(/\$/g, '').matchAll(/=\s*(-?[\d\u00a0]+(?:[.,]\d+)?)/g)].at(-1)?.[1];
      const b = vidpovidQ(vidpovidi[0]);
      const a = ostannie ? vidpovidQ(ostannie.replace(/\u00a0/g, '')) : null;
      if (a && b && rivni(a, b)) nezalezhna = 'tak';
    }
  }
  return { pomylky, nezalezhna };
}

// ——— Запуск ———
const filtr = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const ids = readdirSync(PAPKA, { withFileTypes: true })
  .filter((f) => f.isDirectory() && /^\d+-klas$/.test(f.name))
  .flatMap((f) => readdirSync(PAPKA + f.name).filter((n) => n.endsWith('.ts')).map((n) => `${f.name}/${n.replace(/\.ts$/, '')}`))
  .filter((id) => !filtr.length || filtr.some((f) => id.startsWith(f)))
  .sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));

let usihoPomylok = 0;
let usihoZavdan = 0;
let usihoNezalezhno = 0;
for (const id of ids) {
  const pomylky: string[] = [];
  if (!existsSync(`${KORIN}src/content/docs/${id}.mdx`) && !existsSync(`${KORIN}src/content/docs/${id}.md`))
    pomylky.push(`немає сторінки теми src/content/docs/${id}.mdx`);
  const h: Henerator = (await import(pathToFileURL(`${PAPKA}${id}.ts`).href)).default;
  if (!h || typeof h.zavdannia !== 'function') pomylky.push('немає export default { rivni, zavdannia }');
  else if (!Array.isArray(h.rivni) || h.rivni.length !== 3) pomylky.push('rivni має бути з трьох описів');
  let nezalezhno = 0;
  let zavdan = 0;
  if (h && typeof h.zavdannia === 'function') {
    for (const riven of [1, 2, 3] as Riven[]) {
      const rizni = new Set<string>();
      const pryklady: TrenZavdannia[] = [];
      for (let i = 0; i < SPROB; i++) {
        let z: TrenZavdannia;
        try {
          z = h.zavdannia(stvorytyVypadok(riven * 100003 + i), riven);
        } catch (e) {
          pomylky.push(`рівень ${riven}: виняток ${(e as Error).stack?.split('\n').slice(0, 2).join(' ')}`);
          continue;
        }
        zavdan++;
        const r = perevirytyZavdannia(z);
        if (r.nezalezhna === 'tak') nezalezhno++;
        for (const p of r.pomylky) pomylky.push(`рівень ${riven}: ${p}\n      ${z?.pytannia ?? ''} ${z?.vyraz ?? ''}`);
        rizni.add(`${z?.pytannia}|${z?.vyraz}|${z?.malunok ?? ''}`);
        if (pryklady.length < 5) pryklady.push(z);
      }
      if (rizni.size < 20) pomylky.push(`рівень ${riven}: лише ${rizni.size} різних завдань на ${SPROB} спроб`);
      if (filtr.length) {
        console.log(`\n  ${id} · рівень ${riven} (${h.rivni[riven - 1]}) · різних: ${rizni.size}`);
        for (const z of pryklady) {
          const v = Array.isArray(z.vidpovid) ? z.vidpovid.join(' | ') : z.vidpovid;
          console.log(`    • ${[z.pytannia, z.vyraz].filter(Boolean).join(' ')}  →  ${v}${z.odynytsi ? ' ' + z.odynytsi : ''}`);
          if (z.varianty) console.log(`      варіанти: ${z.varianty.join(' | ')}`);
          if (z.rozviazok) console.log(`      розв'язок: ${z.rozviazok}`);
        }
      }
    }
  }
  usihoZavdan += zavdan;
  usihoNezalezhno += nezalezhno;
  const unikalni = [...new Set(pomylky)];
  usihoPomylok += unikalni.length;
  const vidsotok = zavdan ? Math.round((100 * nezalezhno) / zavdan) : 0;
  console.log(`${unikalni.length ? '✗' : '✓'} ${id}  (незалежно перераховано ${vidsotok}%)`);
  for (const p of unikalni.slice(0, 8)) console.log('    ' + p);
  if (unikalni.length > 8) console.log(`    … і ще ${unikalni.length - 8}`);
}
console.log(
  `\n${ids.length} генераторів, ${usihoZavdan} завдань, незалежно перераховано ${usihoNezalezhno}. ` +
    (usihoPomylok ? `Помилок: ${usihoPomylok}` : 'Помилок немає.'),
);
process.exit(usihoPomylok ? 1 : 0);
