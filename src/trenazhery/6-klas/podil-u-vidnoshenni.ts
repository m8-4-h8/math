// Поділ числа в даному відношенні (Істер § 19): на дві частини, на три частини (зокрема периметр і кути
// трикутника); відома одна з частин; відома різниця частин.
import { mnozh, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const chastyn = (n: number) => `${n} ${mnozh(n, 'частина', 'частини', 'частин')}`;

const DVI: { umova: (s: number, p: number, q: number) => string; bilsha: string; mensha: string; od?: string; max: number }[] = [
  { umova: (s, p, q) => `Мотузку завдовжки ${s} м розрізали на дві частини у відношенні ${p} : ${q}.`, bilsha: 'Яка довжина більшої частини?', mensha: 'Яка довжина меншої частини?', od: 'м', max: 8 },
  {
    umova: (s, p, q) => `${skilky(s, 'цукерку', 'цукерки', 'цукерок')} поділили між Олею і Тарасом у відношенні ${p} : ${q}.`,
    bilsha: 'Скільки цукерок отримав той, кому дісталося більше?',
    mensha: 'Скільки цукерок отримав той, кому дісталося менше?',
    max: 6,
  },
  { umova: (s, p, q) => `Для фарби змішали білу і синю у відношенні ${p} : ${q}, усього ${s} л.`, bilsha: 'Скільки літрів тієї фарби, якої більше?', mensha: 'Скільки літрів тієї фарби, якої менше?', od: 'л', max: 5 },
  { umova: (s, p, q) => `Сплав масою ${s} кг складається з міді й цинку у відношенні ${p} : ${q}.`, bilsha: 'Скільки кілограмів того металу, якого більше?', mensha: 'Скільки кілограмів того металу, якого менше?', od: 'кг', max: 20 },
  { umova: (s, p, q) => `Число ${s} поділили на дві частини у відношенні ${p} : ${q}.`, bilsha: 'Знайди більшу частину.', mensha: 'Знайди меншу частину.', max: 15 },
];

function dvi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9);
    if (nsd(p, q) !== 1) continue;
    const z = r.vybir(DVI);
    const odna = r.chyslo(2, z.max);
    const s = (p + q) * odna;
    const bilsha = r.shans();
    const chlen = bilsha ? Math.max(p, q) : Math.min(p, q);
    return {
      pytannia: `${z.umova(s, p, q)} ${bilsha ? z.bilsha : z.mensha}`,
      vidpovid: chlen * odna,
      odynytsi: z.od,
      pidkazka: `Усього ${p} + ${q} = ${chastyn(p + q)}. Скільки припадає на одну?`,
      rozviazok: `${p} + ${q} = ${p + q} (частин); ${s} : ${p + q} = ${odna} — одна частина; ${odna} · ${chlen} = ${chlen * odna}.`,
    };
  }
}

const NAZVY = ['найменшу', 'середню', 'найбільшу'];

function try_(r: Vypadok): TrenZavdannia {
  for (;;) {
    const chleny = r.rizni(3, 1, 9).sort((x, y) => x - y);
    if (nsd(nsd(chleny[0], chleny[1]), chleny[2]) !== 1) continue;
    const suma = chleny[0] + chleny[1] + chleny[2];
    const typ = r.chyslo(0, 2);
    const i = r.chyslo(0, 2);
    const vidnoshennia = r.peremishaty(chleny).join(' : ');
    let umova: string;
    let odna: number;
    let od: string | undefined;
    if (typ === 0) {
      odna = r.chyslo(2, 12);
      umova = `Поділи число ${suma * odna} у відношенні ${vidnoshennia}. Знайди ${NAZVY[i]} частину.`;
    } else if (typ === 1) {
      odna = r.chyslo(1, 6);
      od = 'см';
      umova = `Периметр трикутника ${suma * odna} см, а його сторони відносяться як ${vidnoshennia}. Знайди ${NAZVY[i]} сторону.`;
      if (chleny[2] >= chleny[0] + chleny[1]) continue; // такого трикутника не буває
    } else {
      if (180 % suma !== 0) continue;
      odna = 180 / suma;
      od = '°';
      umova = `Кути трикутника відносяться як ${vidnoshennia}. Знайди ${i === 0 ? 'найменший' : i === 1 ? 'середній' : 'найбільший'} кут.`;
    }
    const s = suma * odna;
    return {
      pytannia: umova,
      vidpovid: chleny[i] * odna,
      odynytsi: od,
      pidkazka: typ === 2 ? `Сума кутів трикутника — 180°. Усього ${chastyn(suma)}.` : `Усього ${chleny.join(' + ')} = ${chastyn(suma)}.`,
      rozviazok: `${chleny.join(' + ')} = ${suma} (частин); ${s} : ${suma} = ${odna} — одна частина; ${odna} · ${chleny[i]} = ${chleny[i] * odna}.`,
    };
  }
}

function vidomaChastyna(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9);
    if (nsd(p, q) !== 1) continue;
    const odna = r.chyslo(2, 12);
    const typ = r.chyslo(0, 2);
    const [a, b] = [p * odna, q * odna];
    if (typ === 0) {
      return {
        pytannia: `Вода і сироп змішані у відношенні ${p} : ${q}. Води взяли ${a} мл. Скільки мілілітрів сиропу треба взяти?`,
        vidpovid: b,
        odynytsi: 'мл',
        pidkazka: `${a} мл — це ${chastyn(p)}, а не все.`,
        rozviazok: `${a} : ${p} = ${odna} (мл) — одна частина; ${odna} · ${q} = ${b} (мл).`,
      };
    }
    if (typ === 1) {
      return {
        pytannia: `Яблука поділили між братом і сестрою у відношенні ${p} : ${q}. Сестра отримала ${skilky(b, 'яблуко', 'яблука', 'яблук')}. Скільки всього було яблук?`,
        vidpovid: a + b,
        pidkazka: `${b} — це ${chastyn(q)}. Знайди одну частину.`,
        rozviazok: `${b} : ${q} = ${odna} — одна частина; усього ${p} + ${q} = ${p + q} частин; ${odna} · ${p + q} = ${a + b}.`,
      };
    }
    const c = r.chyslo(1, 6);
    if (c === p || c === q) continue;
    return {
      pytannia: `Мама, тато і син поділили горіхи у відношенні ${p} : ${q} : ${c}. Син отримав ${skilky(c * odna, 'горіх', 'горіхи', 'горіхів')}. Скільки горіхів отримав тато?`,
      vidpovid: b,
      pidkazka: `Син — ${chastyn(c)}. Знайди одну частину.`,
      rozviazok: `${c * odna} : ${c} = ${odna} — одна частина; тато: ${odna} · ${q} = ${b}.`,
    };
  }
}

function riznytsia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [p, q] = r.rizni(2, 1, 9).sort((x, y) => x - y);
    if (nsd(p, q) !== 1) continue;
    const odna = r.chyslo(2, 9);
    const d = (q - p) * odna;
    const [i1, i2] = r.vybir([['Аліса', 'Антон'], ['Оля', 'Марко'], ['Ірина', 'Денис']]);
    const shcho = r.vybir([
      ['грибів', 'зібрали гриби', 'зібрав', 'зібрала'],
      ['марок', 'мають марки', 'має', 'має'],
      ['задач', 'розв\'язали задачі', 'розв\'язав', 'розв\'язала'],
    ]);
    const pyt = r.chyslo(0, 2);
    const vidp = [p * odna, q * odna, (p + q) * odna][pyt];
    const pytannia = [`Скільки ${shcho[0]} ${i1 === 'Аліса' || i1 === 'Оля' || i1 === 'Ірина' ? shcho[3] : shcho[2]} ${i1}?`, `Скільки ${shcho[0]} ${shcho[2]} ${i2}?`, `Скільки ${shcho[0]} у них разом?`][pyt];
    return {
      pytannia: `${i1} і ${i2} ${shcho[1]} у відношенні ${p} : ${q}. ${i2} ${shcho[2]} на ${d} ${shcho[0]} більше. ${pytannia}`,
      vidpovid: vidp,
      pidkazka: `${i2} має на ${q} − ${p} = ${chastyn(q - p)} більше. Це ${d}.`,
      rozviazok: `${q} − ${p} = ${q - p} (частини) — це ${d}; ${d} : ${q - p} = ${odna} — одна частина; ${[`${odna} · ${p}`, `${odna} · ${q}`, `${odna} · ${p + q}`][pyt]} = ${vidp}.`,
    };
  }
}

export default {
  rivni: ['на дві частини', 'на три частини, трикутники', 'відома одна частина або різниця'],
  zavdannia(r, riven) {
    if (riven === 1) return dvi(r);
    if (riven === 2) return r.vybir([try_, try_, dvi])(r);
    return r.vybir([vidomaChastyna, vidomaChastyna, riznytsia, riznytsia, try_])(r);
  },
} satisfies Henerator;
