// Ламана і многокутник: довжина ламаної, периметр, ланки й вершини, невідома сторона.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const NAZVY_KUTNYKIV: Record<number, string> = { 3: 'трикутника', 4: 'чотирикутника', 5: "п'ятикутника", 6: 'шестикутника', 7: 'семикутника', 8: 'восьмикутника' };

function dovzhynaLamanoi(r: Vypadok, lanok: number): TrenZavdannia {
  const lanky = Array.from({ length: lanok }, () => r.chyslo(2, 9));
  const suma = lanky.reduce((a, b) => a + b, 0);
  return {
    pytannia: `Ламана складається з ${lanok} ланок: ${lanky.join(' см, ')} см. Яка довжина ламаної?`,
    vidpovid: suma,
    odynytsi: 'см',
    pidkazka: 'Довжина ламаної — сума довжин усіх ланок.',
    rozviazok: `${lanky.join(' + ')} = ${suma} (см)`,
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    let a: number, b: number, c: number;
    do {
      [a, b, c] = [r.chyslo(3, 12), r.chyslo(3, 12), r.chyslo(3, 12)];
    } while (a + b <= c || a + c <= b || b + c <= a);
    return {
      pytannia: `Сторони трикутника — ${a} см, ${b} см і ${c} см. Знайди його периметр.`,
      vidpovid: a + b + c,
      odynytsi: 'см',
      pidkazka: 'Периметр — сума довжин усіх сторін.',
      rozviazok: `${a} + ${b} + ${c} = ${a + b + c} (см)`,
    };
  }
  if (typ === 1) {
    const a = r.chyslo(4, 12);
    const b = r.krim(2, 9, [a]);
    return {
      pytannia: `Довжина прямокутника ${a} см, ширина ${b} см. Знайди його периметр.`,
      vidpovid: 2 * (a + b),
      odynytsi: 'см',
      pidkazka: `У прямокутника дві сторони по ${a} см і дві по ${b} см.`,
      rozviazok: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} (см)`,
    };
  }
  const a = r.chyslo(2, 12);
  return {
    pytannia: `Сторона квадрата ${a} см. Знайди його периметр.`,
    vidpovid: 4 * a,
    odynytsi: 'см',
    pidkazka: 'У квадрата 4 однакові сторони.',
    rozviazok: `${a} · 4 = ${4 * a} (см)`,
  };
}

function vershyny(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 8);
  return r.vybir<() => TrenZavdannia>([
    () => ({
      pytannia: `Скільки сторін у ${NAZVY_KUTNYKIV[n]}?`,
      vidpovid: n,
      pidkazka: 'Скільки кутів (вершин) — стільки й сторін.',
      rozviazok: `У многокутника сторін стільки, скільки вершин: ${n}.`,
    }),
    () => ({
      pytannia: `Незамкнена ламана має ${n} ${mnozh(n, 'вершину', 'вершини', 'вершин')}. Скільки в неї ланок?`,
      vidpovid: n - 1,
      pidkazka: 'Намалюй: у незамкненої ламаної ланок на одну менше, ніж вершин.',
      rozviazok: `${n} − 1 = ${n - 1}`,
    }),
    () => ({
      pytannia: `Замкнена ламана має ${n} ${mnozh(n, 'ланку', 'ланки', 'ланок')}. Скільки в неї вершин?`,
      vidpovid: n,
      pidkazka: 'Замкнена ламана — це многокутник: ланок стільки, скільки вершин.',
      rozviazok: `${n} ланок — ${n} вершин.`,
    }),
  ])();
}

function nevidomaStorona(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const a = r.chyslo(2, 12);
    return {
      pytannia: `Периметр квадрата ${4 * a} см. Яка довжина його сторони?`,
      vidpovid: a,
      odynytsi: 'см',
      pidkazka: 'Периметр квадрата — 4 однакові сторони. Ділимо на 4.',
      rozviazok: `${4 * a} : 4 = ${a} (см)`,
    };
  }
  let a: number, b: number, c: number;
  do {
    [a, b, c] = [r.chyslo(3, 12), r.chyslo(3, 12), r.chyslo(3, 12)];
  } while (a + b <= c || a + c <= b || b + c <= a);
  const p = a + b + c;
  return {
    pytannia: `Периметр трикутника ${p} см. Дві його сторони — ${a} см і ${b} см. Яка третя сторона?`,
    vidpovid: c,
    odynytsi: 'см',
    pidkazka: 'Від периметра відніми дві відомі сторони.',
    rozviazok: `${p} − ${a} − ${b} = ${c} (см)`,
  };
}

export default {
  rivni: ['довжина ламаної', 'периметр, вершини й ланки', 'невідома сторона'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? dovzhynaLamanoi(r, r.chyslo(2, 4)) : vershyny(r);
    if (riven === 2) return r.vybir([perymetr, perymetr, vershyny, (x: Vypadok) => dovzhynaLamanoi(x, r.chyslo(3, 5))])(r);
    return r.vybir([nevidomaStorona, nevidomaStorona, perymetr])(r);
  },
} satisfies Henerator;
