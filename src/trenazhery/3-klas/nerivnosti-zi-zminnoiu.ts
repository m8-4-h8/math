// Нерівності зі змінною (3 клас): розв'язок нерівності, спосіб добору, спосіб зведення до рівняння
// (межа — розв'язок рівняння, сусіднє число показує, з якого боку розв'язки), кількість розв'язків, задачі.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['a', 'b', 'c', 'k', 'm', 'n', 'p', 'x', 'y'];

interface Nerivnist {
  z: string;
  tekst: string; // «16 − p > 8»
  tex: string; // «16 - p > 8»
  zapys: (x: number) => string; // «16 − 7»
  f: (x: number) => number;
  znak: '<' | '>';
  b: number;
  m: number; // межа: розв'язок рівняння
  menshi: boolean; // розв'язки — числа, менші за межу
  nyz: number; // найменше допустиме значення змінної
  verkh: number; // найбільше допустиме (Infinity — без обмеження)
}

/** Нерівність одного з видів; `skinchenna` — тільки зі скінченною кількістю розв'язків. */
function nerivnist(r: Vypadok, skinchenna = false): Nerivnist {
  for (;;) {
    const z = r.vybir(BUKVY);
    const znak = r.vybir(['<', '>'] as const);
    const vyd = r.vybir(['plus', 'minusZliva', 'minusZprava', 'mnozh'] as const);
    let n: number, m: number, b: number, zapys: (x: number) => string, f: (x: number) => number, shablon: string;
    let nyz = 0;
    let verkh = Infinity;
    if (vyd === 'plus') {
      n = r.chyslo(3, 60);
      m = r.chyslo(3, 39);
      b = m + n;
      const zliva = r.shans();
      shablon = zliva ? `${z} + ${n}` : `${n} + ${z}`;
      zapys = (x) => (zliva ? `${x} + ${n}` : `${n} + ${x}`);
      f = (x) => x + n;
    } else if (vyd === 'minusZliva') {
      n = r.chyslo(3, 40);
      m = n + r.chyslo(3, 45);
      b = m - n;
      shablon = `${z} − ${n}`;
      zapys = (x) => `${x} − ${n}`;
      f = (x) => x - n;
      nyz = n;
    } else if (vyd === 'minusZprava') {
      n = r.chyslo(15, 99);
      m = r.chyslo(3, n - 5);
      b = n - m;
      shablon = `${n} − ${z}`;
      zapys = (x) => `${n} − ${x}`;
      f = (x) => n - x;
      verkh = n;
    } else {
      n = r.chyslo(2, 9);
      m = r.chyslo(3, 9);
      b = m * n;
      const zliva = r.shans();
      shablon = zliva ? `${z} · ${n}` : `${n} · ${z}`;
      zapys = (x) => (zliva ? `${x} · ${n}` : `${n} · ${x}`);
      f = (x) => x * n;
    }
    const zrostaie = vyd !== 'minusZprava';
    const menshi = (znak === '<') === zrostaie;
    if (skinchenna && !menshi && verkh === Infinity) continue;
    if (b < 2 || b > 99) continue;
    const tekst = `${shablon} ${znak} ${b}`;
    return { z, tekst, tex: tekst.replace(/−/g, '-').replace(/·/g, '\\cdot'), zapys, f, znak, b, m, menshi, nyz, verkh };
  }
}

const istynno = (q: Nerivnist, x: number) => (q.znak === '<' ? q.f(x) < q.b : q.f(x) > q.b);
const dopustyme = (q: Nerivnist, x: number) => x >= q.nyz && x <= q.verkh;
const pidstav = (q: Nerivnist, x: number) => `${q.zapys(x)} = ${q.f(x)}, ${q.f(x)} ${q.znak} ${q.b} — ${istynno(q, x) ? 'істинно' : 'хибно'}`;
const bik = (q: Nerivnist) => (q.menshi ? `менші за ${q.m}` : `більші за ${q.m}`);
const susid = (q: Nerivnist) => (q.m - 1 >= q.nyz ? q.m - 1 : q.m + 1);
const mezhaTekst = (q: Nerivnist) =>
  `Межа: ${q.z} = ${q.m}, бо ${q.zapys(q.m)} = ${q.b}; але ${q.b} ${q.znak} ${q.b} — хибно. Сусід: ${pidstav(q, susid(q))}. Розв'язки — числа, ${bik(q)}.`;

/** Кілька допустимих чисел біля межи. */
function bilia(r: Vypadok, q: Nerivnist, kilkist: number, rozkyd: number) {
  const vid = Math.max(q.nyz, q.m - rozkyd);
  const do_ = Math.min(q.verkh, q.m + rozkyd);
  return do_ - vid + 1 < kilkist ? null : r.rizni(kilkist, vid, do_);
}

// ——— Рівень 1: добір ———

function chyRozviazok(r: Vypadok): TrenZavdannia {
  const q = nerivnist(r);
  const x = r.shans(0.25) ? q.m : (bilia(r, q, 1, 6) ?? [q.m])[0];
  const tak = istynno(q, x);
  return {
    pytannia: `Чи є число ${x} розв'язком нерівності $${q.tex}$?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: `Підстав ${x} замість ${q.z} і перевір, чи правильна нерівність.`,
    rozviazok: `${pidstav(q, x)}. ${tak ? `Число ${x} — розв'язок.` : `Число ${x} — не розв'язок.`}`,
  };
}

function yakyiRozviazok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = nerivnist(r);
    const chysla = bilia(r, q, 3, 5);
    if (!chysla) continue;
    const tak = chysla.filter((x) => istynno(q, x));
    if (tak.length !== 1) continue;
    const varianty = [...chysla].sort((a, b) => b - a);
    return {
      pytannia: `Яке з чисел — розв'язок нерівності $${q.tex}$?`,
      vidpovid: tak[0],
      varianty,
      pidkazka: `Підстав кожне число замість ${q.z}.`,
      rozviazok: varianty.map((x) => pidstav(q, x)).join('; ') + '.',
    };
  }
}

function skilkyZRiadu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = nerivnist(r);
    const chysla = bilia(r, q, 5, 12);
    if (!chysla) continue;
    const tak = chysla.filter((x) => istynno(q, x));
    if (tak.length === 0 || tak.length === 5) continue;
    const riad = [...chysla].sort((a, b) => b - a);
    return {
      pytannia: `Скільки з чисел ${riad.join(', ')} є розв'язками нерівності $${q.tex}$?`,
      vidpovid: tak.length,
      pidkazka: `Знайди межу: ${q.tekst.replace(/ [<>] /, ' = ')}. Розв'язки лежать з одного боку від неї.`,
      rozviazok: `Межа ${q.m}, розв'язки — числа, ${bik(q)}: ${tak.sort((a, b) => b - a).join(', ')}. Усього ${tak.length}.`,
    };
  }
}

// ——— Рівень 2: межа і сусід ———

function naiRozviazok(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = nerivnist(r);
    const v = q.menshi ? q.m - 1 : q.m + 1;
    if (!dopustyme(q, v)) continue;
    return {
      pytannia: `Знайди ${q.menshi ? 'найбільший' : 'найменший'} розв'язок нерівності $${q.tex}$.`,
      vidpovid: v,
      pidkazka: `Заміни знак на «=» і розв'яжи рівняння — це межа. Чи підходить сама межа?`,
      rozviazok: `${mezhaTekst(q)} ${q.menshi ? 'Найбільший' : 'Найменший'} — ${v}: ${pidstav(q, v)}.`,
    };
  }
}

function zIakohoBoku(r: Vypadok): TrenZavdannia {
  const q = nerivnist(r);
  const vidpovid = bik(q);
  return {
    pytannia: `Межа нерівності $${q.tex}$ — число ${q.m}: ${q.zapys(q.m)} = ${q.b}. Які числа — розв'язки?`,
    vidpovid,
    varianty: [`менші за ${q.m}`, `більші за ${q.m}`, `тільки ${q.m}`],
    pidkazka: `Підстав сусіднє число ${susid(q)} і подивись, чи вийде істинна нерівність.`,
    rozviazok: `Сама межа не підходить: ${q.b} ${q.znak} ${q.b} — хибно. Сусід: ${pidstav(q, susid(q))}. Отже, розв'язки — числа, ${vidpovid}.`,
  };
}

// ——— Рівень 3: кількість розв'язків і задачі ———

function skilkyRozviazkiv(r: Vypadok): TrenZavdannia {
  for (;;) {
    const q = nerivnist(r, true);
    const vsi = q.menshi
      ? Array.from({ length: q.m - q.nyz }, (_, i) => q.nyz + i)
      : Array.from({ length: q.verkh - q.m }, (_, i) => q.m + 1 + i);
    if (vsi.length < 2 || vsi.length > 20) continue;
    const spysok = vsi.length <= 6 ? vsi.join(', ') : `${vsi[0]}, ${vsi[1]}, …, ${vsi[vsi.length - 1]}`;
    return {
      pytannia: `Скільки розв'язків має нерівність $${q.tex}$?`,
      vidpovid: vsi.length,
      pidkazka: `Знайди межу й перевір сусіда.${q.nyz === 0 && q.menshi ? ' Не забудь про число 0.' : ''}`,
      rozviazok: `${mezhaTekst(q)} Це ${spysok} — усього ${vsi.length}.`,
    };
  }
}

function zadacha(r: Vypadok): TrenZavdannia {
  const vyd = r.chyslo(0, 2);
  if (vyd === 0) {
    for (;;) {
      const [odna, dvi, bahato, nazva] = r.vybir([
        ['олівець', 'олівці', 'олівців', 'Олівець'],
        ['зошит', 'зошити', 'зошитів', 'Зошит'],
        ['лінійку', 'лінійки', 'лінійок', 'Лінійка'],
        ['наліпку', 'наліпки', 'наліпок', 'Наліпка'],
      ] as const);
      const p = r.chyslo(3, 9);
      const S = r.chyslo(20, 90);
      const n = Math.floor((S - 1) / p);
      if (n < 2 || n > 12) continue;
      return {
        pytannia: `${nazva} коштує ${p} грн. Яку найбільшу кількість ${bahato} можна купити, щоб заплатити менше ніж ${S} грн?`,
        vidpovid: n,
        pidkazka: `Нерівність: ${p} · x < ${S}. Спробуй кілька чисел і перевір множенням.`,
        rozviazok: `${p} · ${n} = ${p * n}, ${p * n} < ${S} — ${n} ${mnozh(n, odna, dvi, bahato)} можна. А ${p} · ${n + 1} = ${p * (n + 1)} — уже не менше за ${S}.`,
      };
    }
  }
  if (vyd === 1) {
    const T = r.chyslo(12, 40);
    const R = r.chyslo(3, T - 4);
    const v = T - R - 1;
    return {
      pytannia: `На полиці ${T} ${mnozh(T, 'книжка', 'книжки', 'книжок')}. Яку найбільшу кількість книжок можна забрати, щоб на полиці залишилося більше ніж ${R}?`,
      vidpovid: v,
      pidkazka: `Нерівність: ${T} − x > ${R}. Межа — розв'язок рівняння ${T} − x = ${R}.`,
      rozviazok: `Межа: ${T} − ${R} = ${T - R}, але тоді залишиться рівно ${R}. ${T} − ${v} = ${R + 1}, ${R + 1} > ${R} ✓ Отже, ${v}.`,
    };
  }
  const [komu, zaimennyk] = r.vybir([['Братикові', 'йому'], ['Сестричці', 'їй'], ['Двоюрідному братові', 'йому']] as const);
  const a = r.chyslo(6, 11);
  const b = r.chyslo(a + 2, 18);
  const v = b - a + 1;
  return {
    pytannia: `${komu} зараз ${a} ${mnozh(a, 'рік', 'роки', 'років')}. Через скільки років щонайменше ${zaimennyk} буде більше ніж ${b} ${mnozh(b, 'рік', 'роки', 'років')}?`,
    vidpovid: v,
    pidkazka: `Нерівність: ${a} + x > ${b}. Межа — розв'язок рівняння ${a} + x = ${b}.`,
    rozviazok: `Межа: ${b} − ${a} = ${b - a}, але тоді буде рівно ${b}. ${a} + ${v} = ${b + 1}, ${b + 1} > ${b} ✓ Отже, через ${v} ${mnozh(v, 'рік', 'роки', 'років')}.`,
  };
}

export default {
  rivni: ['добір серед чисел', 'межа і сусід', 'скільки розв\'язків, задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([chyRozviazok, yakyiRozviazok, yakyiRozviazok, skilkyZRiadu])(r);
    if (riven === 2) return r.vybir([naiRozviazok, naiRozviazok, zIakohoBoku])(r);
    return r.vybir([skilkyRozviazkiv, zadacha, zadacha, naiRozviazok])(r);
  },
} satisfies Henerator;
