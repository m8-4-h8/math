// Розв'язування задач за допомогою рівнянь (Істер § 42): позначаємо меншу величину через x, інші виражаємо через неї,
// складаємо рівняння за умовою; два числа із сумою й різницею, три величини («удвічі», «на … більше»), периметр,
// перекладання (після змін стало порівну), вік, задумане число (корінь може бути від'ємним).
import { ch, skilky, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const URAZIV: Record<number, string> = { 2: 'удвічі', 3: 'утричі', 4: 'учетверо', 5: 'уп’ятеро' };
const vd = (n: number) => (n < 0 ? `(${ch(n)})` : `${n}`);

/** Предмети: [місце (у/на … першому), що, форми слова]. */
const MISTSIA: { de: string; odn: string; uDruhyi: string; zPershoho: string; pershyi: string; druhyi: string; tretii: string; shcho: [string, string, string] }[] = [
  { de: 'у трьох кошиках', odn: 'кошику', uDruhyi: 'у другий', zPershoho: 'з першого', pershyi: 'у першому', druhyi: 'у другому', tretii: 'у третьому', shcho: ['яблуко', 'яблука', 'яблук'] },
  { de: 'у трьох ящиках', odn: 'ящику', uDruhyi: 'у другий', zPershoho: 'з першого', pershyi: 'у першому', druhyi: 'у другому', tretii: 'у третьому', shcho: ['банка', 'банки', 'банок'] },
  { de: 'на трьох полицях', odn: 'полиці', uDruhyi: 'на другу', zPershoho: 'з першої', pershyi: 'на першій', druhyi: 'на другій', tretii: 'на третій', shcho: ['книжка', 'книжки', 'книжок'] },
  { de: 'у трьох коробках', odn: 'коробці', uDruhyi: 'у другу', zPershoho: 'з першої', pershyi: 'у першій', druhyi: 'у другій', tretii: 'у третій', shcho: ['олівець', 'олівці', 'олівців'] },
];

function dvaChysla(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(5, 60);
  const d = r.chyslo(2, 25);
  const s = 2 * x + d;
  const menshe = r.shans();
  return {
    pytannia: `Сума двох чисел дорівнює ${s}, одне з них на ${d} більше за інше. Знайди ${menshe ? 'менше' : 'більше'} число.`,
    vidpovid: menshe ? x : x + d,
    pidkazka: `Нехай менше число x, тоді більше x + ${d}. Рівняння: x + (x + ${d}) = ${s}.`,
    rozviazok: `2x + ${d} = ${s}; 2x = ${s - d}; x = ${x}. ${menshe ? '' : `Більше: ${x} + ${d} = ${x + d}. `}Перевірка: ${x} + ${x + d} = ${s}`,
  };
}

function zadumane(r: Vypadok, obydvaBoky: boolean): TrenZavdannia {
  for (;;) {
    const x = r.krim(-12, 15, [0]);
    const a = r.chyslo(2, 7);
    const b = r.krim(-20, 20, [0]);
    if (!obydvaBoky) {
      const p = a * x + b;
      return {
        pytannia: `Задумане число помножили на ${a} і ${b > 0 ? `додали ${b}` : `відняли ${-b}`}. Вийшло ${ch(p)}. Яке число задумали?`,
        vidpovid: ch(x),
        pidkazka: `Нехай задумане число x: ${a}x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${ch(p)}.`,
        rozviazok: `${a}x = ${ch(p)} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${ch(a * x)}; x = ${ch(a * x)} : ${a} = ${ch(x)}`,
      };
    }
    const c = r.krim(2, 6, [a]);
    const d = (a - c) * x + b; // a·x + b = c·x + d
    if (d === 0 || Math.abs(d) > 40) continue;
    const dia = (k: number, m: number) => `помножити на ${k} і ${m > 0 ? `додати ${m}` : `відняти ${-m}`}`;
    return {
      pytannia: `Якщо задумане число ${dia(a, b)}, вийде те саме, що й коли його ${dia(c, d)}. Яке число задумали?`,
      vidpovid: ch(x),
      pidkazka: `Нехай задумане число x: ${a}x ${b > 0 ? '+' : '−'} ${Math.abs(b)} = ${c === 1 ? '' : c}x ${d > 0 ? '+' : '−'} ${Math.abs(d)}.`,
      rozviazok: `${a}x − ${c === 1 ? '' : c}x = ${ch(d)} − ${vd(b)}; ${a - c === 1 ? '' : a - c}x = ${ch(d - b)}; x = ${ch(x)}. Перевірка: ${a} · ${vd(x)} + ${vd(b)} = ${ch(a * x + b)} і ${c} · ${vd(x)} + ${vd(d)} = ${ch(c * x + d)}`,
    };
  }
}

function tryVelychyny(r: Vypadok): TrenZavdannia {
  for (;;) {
    const m = r.vybir(MISTSIA);
    const x = r.chyslo(6, 30);
    const k = r.chyslo(2, 4);
    const d = r.krim(-5, 9, [0, 1, -1]);
    if (x + d < 2) continue;
    const s = k * x + x + (x + d);
    const pytaiemo = r.chyslo(0, 2);
    const vidpovidi = [k * x, x, x + d];
    const nazvy = [m.pershyi, m.druhyi, m.tretii];
    return {
      pytannia: `${zVelykoi(m.de)} разом ${skilky(s, ...m.shcho)}. ${zVelykoi(m.pershyi)} ${URAZIV[k]} більше, ніж ${m.druhyi}, а ${m.tretii} — на ${Math.abs(d)} ${d > 0 ? 'більше' : 'менше'}, ніж ${m.druhyi}. Скільки ${m.shcho[2]} ${nazvy[pytaiemo]}?`,
      vidpovid: vidpovidi[pytaiemo],
      pidkazka: `Нехай ${m.druhyi} x. Тоді ${m.pershyi} ${k}x, ${m.tretii} x ${d > 0 ? '+' : '−'} ${Math.abs(d)}. Разом: ${k}x + x + (x ${d > 0 ? '+' : '−'} ${Math.abs(d)}) = ${s}.`,
      rozviazok: `${k + 2}x ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${s}; ${k + 2}x = ${s - d}; x = ${x}. Отже: ${k * x}, ${x}, ${x + d}. Перевірка: ${k * x} + ${x} + ${x + d} = ${s}`,
    };
  }
}


function perymetr(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(3, 25);
  if (r.shans()) {
    const k = r.chyslo(2, 5);
    const p = 2 * (x + k * x);
    return {
      pytannia: `Довжина прямокутника ${URAZIV[k]} більша за ширину, а периметр — ${p} см. Знайди ширину.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: `Нехай ширина x см, тоді довжина ${k}x см. Периметр: 2 · (x + ${k}x) = ${p}.`,
      rozviazok: `${2 * (k + 1)}x = ${p}; x = ${x}. Перевірка: 2 · (${x} + ${k * x}) = ${p}`,
    };
  }
  const d = r.chyslo(2, 15);
  const p = 2 * (2 * x + d);
  return {
    pytannia: `Довжина прямокутника на ${d} см більша за ширину, а периметр — ${p} см. Знайди довжину.`,
    vidpovid: x + d,
    odynytsi: 'см',
    pidkazka: `Нехай ширина x см, тоді довжина x + ${d}. Периметр: 2 · (x + x + ${d}) = ${p}.`,
    rozviazok: `2x + ${d} = ${p / 2}; 2x = ${2 * x}; x = ${x} — ширина; довжина ${x} + ${d} = ${x + d}. Перевірка: 2 · (${x} + ${x + d}) = ${p}`,
  };
}

function perekladannia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const m = r.vybir(MISTSIA.slice(0, 3));
    const k = r.chyslo(2, 4);
    const a = r.chyslo(3, 30); // забрали з першого
    const b = r.chyslo(2, 20); // доклали в другий
    if ((a + b) % (k - 1)) continue;
    const x = (a + b) / (k - 1);
    if (k * x - a < 1 || x > 60) continue;
    return {
      pytannia: `${zVelykoi(m.pershyi)} ${m.odn} ${URAZIV[k]} більше ${m.shcho[2]}, ніж ${m.druhyi}. Коли ${m.zPershoho} забрали ${a}, а ${m.uDruhyi} доклали ${b}, стало порівну. Скільки ${m.shcho[2]} було ${m.druhyi} спочатку?`,
      vidpovid: x,
      pidkazka: `Нехай ${m.druhyi} x, ${m.pershyi} ${k}x. Після змін: ${k}x − ${a} = x + ${b}.`,
      rozviazok: `${k}x − x = ${b} + ${a}; ${k - 1 === 1 ? '' : `${k - 1}x = ${a + b}; `}x = ${x}. Перевірка: ${k * x} − ${a} = ${k * x - a} і ${x} + ${b} = ${x + b}`,
    };
  }
}

function vik(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [k1, k2] = r.vybir([
      [3, 2],
      [4, 3],
      [5, 3],
      [4, 2],
    ] as [number, number][]);
    // k1·x + n = k2(x + n) → x = n(k2 − 1)/(k1 − k2)
    const n = r.chyslo(3, 24);
    if ((n * (k2 - 1)) % (k1 - k2)) continue;
    const x = (n * (k2 - 1)) / (k1 - k2);
    if ((k1 - 1) * x < 20 || k1 * x > 60) continue; // батьки старші щонайменше на 20 років
    const [hto, kogo, komu, cholovik] = r.vybir([
      ['Мама', 'сина', 'синові', false],
      ['Тато', 'доньку', 'доньці', true],
    ] as [string, string, string, boolean][]);
    const k = k1 - k2;
    return {
      pytannia: `${hto} ${URAZIV[k1]} ${cholovik ? 'старший' : 'старша'} за ${kogo}, а через ${n} років буде ${URAZIV[k2]} ${cholovik ? 'старшим' : 'старшою'}. Скільки років ${komu} зараз?`,
      vidpovid: x,
      pidkazka: `Нехай ${komu} зараз x років, тоді ${hto === 'Мама' ? 'мамі' : 'татові'} ${k1}x. Через ${n} років: ${k1}x + ${n} = ${k2}(x + ${n}).`,
      rozviazok: `${k1}x + ${n} = ${k2}x + ${k2 * n}; ${k === 1 ? '' : `${k}x = ${k2 * n - n}; `}x = ${x}. Перевірка: зараз ${x} і ${k1 * x}; через ${n} років ${x + n} і ${k1 * x + n} — у ${k2} рази більше`,
    };
  }
}

export default {
  rivni: ['два числа, задумане число', 'три величини, периметр', 'перекладання, вік, рівняння з x з обох боків'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([dvaChysla, dvaChysla, (rr: Vypadok) => zadumane(rr, false)])(r);
    if (riven === 2) return r.vybir([tryVelychyny, tryVelychyny, perymetr])(r);
    return r.vybir([perekladannia, vik, (rr: Vypadok) => zadumane(rr, true), tryVelychyny])(r);
  },
} satisfies Henerator;
