// Множення і ділення (2 клас): однакові доданки, множення на 2–5, ділення через множення, задачі.
import { mnozh, osoba, rid, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const razy = (n: number) => `${n} ${mnozh(n, 'раз', 'рази', 'разів')}`;

function dodankyVMnozhennia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const n = r.chyslo(2, 5);
  const suma = Array.from({ length: n }, () => a).join(' + ');
  if (r.shans()) {
    return {
      pytannia: 'Заміни додавання множенням. Яке число у віконці?',
      vyraz: `${suma} = ${a} · □`,
      vidpovid: n,
      pidkazka: `Скільки разів узяли по ${a}?`,
      rozviazok: `По ${a} взяли ${razy(n)}: ${a} · ${n} = ${a * n}.`,
    };
  }
  const varianty = r.peremishaty([`${a} · ${n}`, `${a} · ${a}`, `${a * n} · ${n}`].filter((v, i, s) => s.indexOf(v) === i));
  if (varianty.length < 3) varianty.push(`${a} + ${n}`);
  return {
    pytannia: `Яким множенням можна замінити суму ${suma}?`,
    vidpovid: `${a} · ${n}`,
    varianty,
    pidkazka: 'Яке число повторюється і скільки разів?',
    rozviazok: `${a} повторюється ${razy(n)}: ${a} · ${n} = ${a * n}.`,
  };
}

function mnozhennia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 5);
  const b = r.chyslo(1, 9);
  const [x, y] = r.shans() ? [a, b] : [b, a];
  return {
    vyraz: `${x} · ${y} =`,
    vidpovid: a * b,
    pidkazka: `По ${x} взяти ${razy(y)}: ${Array.from({ length: Math.min(y, 6) }, () => x).join(' + ')}${y > 6 ? ' + …' : ''}`,
    rozviazok: `${x} · ${y} = ${a * b}`,
  };
}

function dilennia(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 5);
  const b = r.chyslo(1, 9);
  return {
    vyraz: `${a * b} : ${a} =`,
    vidpovid: b,
    pidkazka: `Яке число треба взяти ${razy(a)}, щоб вийшло ${a * b}? Або: ? · ${a} = ${a * b}.`,
    rozviazok: `${a * b} : ${a} = ${b}, бо ${b} · ${a} = ${a * b}.`,
  };
}

function zviazok(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 5);
  const b = r.chyslo(2, 9);
  const [x, y] = r.shans() ? [a, b] : [b, a];
  return {
    pytannia: `Відомо, що ${x} · ${y} = ${x * y}. Чому дорівнює ${x * y} : ${y}?`,
    vidpovid: x,
    pidkazka: 'Множення і ділення пов’язані: ділимо добуток на один множник — отримуємо інший.',
    rozviazok: `${x * y} : ${y} = ${x}`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 5);
  const b = r.chyslo(2, 9);
  const o = osoba(r);
  return r.vybir<() => TrenZavdannia>([
    () => ({
      pytannia: `На ${a} тарілках лежить по ${b} ${mnozh(b, 'пиріжок', 'пиріжки', 'пиріжків')}. Скільки всього пиріжків?`,
      vidpovid: a * b,
      pidkazka: `По ${b} взяли ${razy(a)}.`,
      rozviazok: `${b} · ${a} = ${a * b}`,
    }),
    () => ({
      pytannia: `${o.imia} ${rid(o, 'поділив', 'поділила')} ${a * b} ${mnozh(a * b, 'цукерку', 'цукерки', 'цукерок')} порівну між ${a} дітьми. Скільки цукерок отримала кожна дитина?`,
      vidpovid: b,
      pidkazka: 'Порівну — ділимо.',
      rozviazok: `${a * b} : ${a} = ${b}`,
    }),
    () => ({
      pytannia: `${a * b} ${mnozh(a * b, 'яблуко', 'яблука', 'яблук')} розклали в пакети по ${b}. Скільки вийшло пакетів?`,
      vidpovid: a,
      pidkazka: `Скільки разів по ${b} вміщається в ${a * b}?`,
      rozviazok: `${a * b} : ${b} = ${a}`,
    }),
  ])();
}

export default {
  rivni: ['однакові доданки → множення', 'множення й ділення на 2, 3, 4, 5', 'зв’язок дій і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? dodankyVMnozhennia(r) : mnozhennia(r);
    if (riven === 2) return r.vybir([mnozhennia, dilennia, dilennia])(r);
    return r.vybir([zviazok, zadacha, zadacha, dilennia])(r);
  },
} satisfies Henerator;
