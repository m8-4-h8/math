// Додавання і віднімання в стовпчик: перенос у наступний розряд, позичання, нулі в зменшуваному.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tsyfry = (n: number) => String(n).split('').reverse().map(Number);

function dodavannia(r: Vypadok, vid: number, do_: number): TrenZavdannia {
  let a: number;
  let b: number;
  do {
    a = r.chyslo(vid, do_);
    b = r.chyslo(vid, do_);
  } while (!tsyfry(a).some((x, i) => x + (tsyfry(b)[i] ?? 0) >= 10)); // хоча б один перенос
  const perenosiv = (() => {
    let p = 0;
    let n = 0;
    const [ta, tb] = [tsyfry(a), tsyfry(b)];
    for (let i = 0; i < Math.max(ta.length, tb.length); i++) {
      p = (ta[i] ?? 0) + (tb[i] ?? 0) + p >= 10 ? 1 : 0;
      n += p;
    }
    return n;
  })();
  return {
    vyraz: `${ch(a)} + ${ch(b)} =`,
    vidpovid: a + b,
    pidkazka: 'Розряд під розрядом, справа наліво. Вийшло 10 або більше — пиши одиниці, а 1 переноси в наступний розряд.',
    rozviazok: `${ch(a)} + ${ch(b)} = ${ch(a + b)} (переносів: ${perenosiv}). Перевірка: ${ch(a + b)} − ${ch(b)} = ${ch(a)} ✓`,
  };
}

function vidnimannia(r: Vypadok, vid: number, do_: number, nuli: boolean): TrenZavdannia {
  let a: number;
  let b: number;
  do {
    a = r.chyslo(vid, do_);
    if (nuli) {
      // Зменшуване з нулями: 7000, 5003, 40 600…
      const s = String(a).split('');
      for (let i = 1; i < s.length - (r.shans() ? 0 : 1); i++) s[i] = '0';
      a = Number(s.join(''));
    }
    b = r.chyslo(Math.floor(vid / 10), a - 1);
  } while (!tsyfry(a).some((x, i) => x < (tsyfry(b)[i] ?? 0)) || a - b < 10);
  return {
    vyraz: `${ch(a)} − ${ch(b)} =`,
    vidpovid: a - b,
    pidkazka: nuli
      ? 'У нулів позичити нічого — позичай у першої ненульової цифри ліворуч, а нулі стають дев’ятками.'
      : 'Цифра зменшуваного менша — позич 1 у сусіднього розряду ліворуч (там поставте крапку).',
    rozviazok: `${ch(a)} − ${ch(b)} = ${ch(a - b)}. Перевірка: ${ch(a - b)} + ${ch(b)} = ${ch(a)} ✓`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(1000, 8999);
  const b = r.chyslo(100, 9999 - a);
  return r.shans()
    ? { pytannia: 'Знайди невідомий доданок.', vyraz: `${ch(a)} + □ = ${ch(a + b)}`, vidpovid: b, pidkazka: 'Від суми відніми відомий доданок.', rozviazok: `${ch(a + b)} − ${ch(a)} = ${ch(b)}` }
    : { pytannia: 'Знайди невідоме зменшуване.', vyraz: `□ − ${ch(b)} = ${ch(a)}`, vidpovid: a + b, pidkazka: 'До різниці додай від’ємник.', rozviazok: `${ch(a)} + ${ch(b)} = ${ch(a + b)}` };
}

export default {
  rivni: ['трицифрові з переносом', 'чотирицифрові, позичання', 'нулі в зменшуваному, п’ятицифрові, віконця'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? dodavannia(r, 100, 899) : vidnimannia(r, 200, 999, false);
    if (riven === 2) return r.shans() ? dodavannia(r, 1000, 8999) : vidnimannia(r, 2000, 9999, false);
    return r.vybir([
      () => vidnimannia(r, 2000, 9999, true),
      () => vidnimannia(r, 20000, 99999, r.shans()),
      () => dodavannia(r, 10000, 89999),
      () => vikontse(r),
    ])();
  },
} satisfies Henerator;
