// Ускладнені рівняння (3 клас): замість одного з чисел — числовий вираз. Обчислюємо вираз,
// зводимо до простого рівняння, перевіряємо в початковому записі. Властивості рівностей.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

interface Vyraz {
  zapys: string; // «8 · 3»
  suma: boolean; // вираз із + чи −: на місці компонента беремо в дужки
}

// Числовий вираз зі значенням k (в межах таблиці множення і сотні).
function vyraz(r: Vypadok, k: number): Vyraz {
  const sposoby: Vyraz[] = [];
  for (let a = 2; a <= 9; a++) if (k % a === 0 && k / a >= 2 && k / a <= 9) sposoby.push({ zapys: `${a} · ${k / a}`, suma: false });
  if (k >= 2 && k <= 9) {
    const d = r.chyslo(2, 9);
    sposoby.push({ zapys: `${k * d} : ${d}`, suma: false });
  }
  if (k >= 12) {
    const a = r.chyslo(5, k - 5);
    sposoby.push({ zapys: `${a} + ${k - a}`, suma: true });
  }
  if (k <= 80) {
    const b = r.chyslo(6, Math.min(30, 98 - k));
    sposoby.push({ zapys: `${k + b} − ${b}`, suma: true });
  }
  return r.vybir(sposoby);
}

interface Proste {
  zapys: (k: string) => string; // рівняння, де відоме число k замінене рядком
  k: number; // відоме число, яке замінимо виразом
  proste: string; // просте рівняння після обчислення
  korin: number;
  dia: string; // «32 − 24»
  nazva: string; // «Невідомий від'ємник — частина»
  mnozhennia?: boolean; // дія множення чи ділення: вираз на місці компонента завжди беремо в дужки
}

// Просте рівняння; pravoruch — замінюємо праву частину, інакше відомий компонент зліва.
function proste(r: Vypadok, pravoruch: boolean): Proste {
  const typ = r.chyslo(0, 5);
  if (typ === 0) {
    const x = r.chyslo(4, 50);
    const a = r.chyslo(6, 90 - x);
    return pravoruch
      ? { zapys: (k) => `x + ${a} = ${k}`, k: x + a, proste: `x + ${a} = ${x + a}`, korin: x, dia: `${x + a} − ${a}`, nazva: 'Невідомий доданок — частина' }
      : { zapys: (k) => `x + ${k} = ${x + a}`, k: a, proste: `x + ${a} = ${x + a}`, korin: x, dia: `${x + a} − ${a}`, nazva: 'Невідомий доданок — частина' };
  }
  if (typ === 1) {
    const d = r.chyslo(6, 50);
    const a = r.chyslo(6, 90 - d);
    return pravoruch
      ? { zapys: (k) => `x − ${a} = ${k}`, k: d, proste: `x − ${a} = ${d}`, korin: d + a, dia: `${d} + ${a}`, nazva: 'Невідоме зменшуване — ціле' }
      : { zapys: (k) => `x − ${k} = ${d}`, k: a, proste: `x − ${a} = ${d}`, korin: d + a, dia: `${d} + ${a}`, nazva: 'Невідоме зменшуване — ціле' };
  }
  if (typ === 2) {
    const x = r.chyslo(4, 40);
    const d = r.krim(6, 90 - x, [x]);
    return pravoruch
      ? { zapys: (k) => `${x + d} − x = ${k}`, k: d, proste: `${x + d} − x = ${d}`, korin: x, dia: `${x + d} − ${d}`, nazva: "Невідомий від'ємник — частина" }
      : { zapys: (k) => `${k} − x = ${d}`, k: x + d, proste: `${x + d} − x = ${d}`, korin: x, dia: `${x + d} − ${d}`, nazva: "Невідомий від'ємник — частина" };
  }
  const a = r.chyslo(2, 9);
  if (typ === 3) {
    const x = r.chyslo(2, 9);
    return pravoruch
      ? { zapys: (k) => `x · ${a} = ${k}`, k: x * a, proste: `x · ${a} = ${x * a}`, korin: x, dia: `${x * a} : ${a}`, nazva: 'Невідомий множник — частина', mnozhennia: true }
      : { zapys: (k) => `x · ${k} = ${x * a}`, k: a, proste: `x · ${a} = ${x * a}`, korin: x, dia: `${x * a} : ${a}`, nazva: 'Невідомий множник — частина', mnozhennia: true };
  }
  if (typ === 4) {
    const ch = r.chyslo(2, 9);
    return pravoruch
      ? { zapys: (k) => `x : ${a} = ${k}`, k: ch, proste: `x : ${a} = ${ch}`, korin: ch * a, dia: `${ch} · ${a}`, nazva: 'Невідоме ділене — ціле', mnozhennia: true }
      : { zapys: (k) => `x : ${k} = ${ch}`, k: a, proste: `x : ${a} = ${ch}`, korin: ch * a, dia: `${ch} · ${a}`, nazva: 'Невідоме ділене — ціле', mnozhennia: true };
  }
  const x = r.chyslo(2, 9);
  const ch = r.krim(2, 9, [x]);
  return pravoruch
    ? { zapys: (k) => `${x * ch} : x = ${k}`, k: ch, proste: `${x * ch} : x = ${ch}`, korin: x, dia: `${x * ch} : ${ch}`, nazva: 'Невідомий дільник — частина', mnozhennia: true }
    : { zapys: (k) => `${k} : x = ${ch}`, k: x * ch, proste: `${x * ch} : x = ${ch}`, korin: x, dia: `${x * ch} : ${ch}`, nazva: 'Невідомий дільник — частина', mnozhennia: true };
}

function zVyrazom(r: Vypadok, pravoruch: boolean): TrenZavdannia {
  const e = proste(r, pravoruch);
  const v = vyraz(r, e.k);
  // Справа від «=» дужки не потрібні. На місці компонента суму чи різницю беремо в дужки,
  // а біля множення і ділення — будь-який вираз: «x : (30 : 6)», а не «x : 30 : 6».
  const zapys = e.zapys(pravoruch || !(v.suma || e.mnozhennia) ? v.zapys : `(${v.zapys})`);
  return {
    pytannia: "Розв'яжи рівняння.",
    vyraz: zapys,
    vidpovid: e.korin,
    pidkazka: `Спершу обчисли вираз ${v.zapys}. Яке просте рівняння вийшло?`,
    rozviazok: `${v.zapys} = ${e.k}, тому ${e.proste}. ${e.nazva}: x = ${e.dia} = ${e.korin}.`,
  };
}

// Властивості рівностей: зліва і справа однакова дія з однаковим числом.
function vlastyvist(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  const pidkazka = 'Порівняй ліву і праву частини: що в них однакове? Тоді й інші числа однакові.';
  if (typ === 0) {
    const [x, a] = [r.chyslo(11, 60), r.chyslo(12, 39)];
    return { pytannia: "Розв'яжи рівняння без обчислень.", vyraz: `x + ${a} = ${x} + ${a}`, vidpovid: x, pidkazka, rozviazok: `Суми рівні, другі доданки однакові (${a}), тому й перші однакові: x = ${x}.` };
  }
  if (typ === 1) {
    const a = r.chyslo(40, 95);
    const x = r.chyslo(11, a - 5);
    return { pytannia: "Розв'яжи рівняння без обчислень.", vyraz: `${a} − x = ${a} − ${x}`, vidpovid: x, pidkazka, rozviazok: `Різниці рівні, зменшувані однакові (${a}), тому й від'ємники однакові: x = ${x}.` };
  }
  if (typ === 2) {
    const [a, x] = [r.chyslo(3, 9), r.chyslo(11, 40)];
    return { pytannia: "Розв'яжи рівняння без обчислень.", vyraz: `${a} · x = ${a} · ${x}`, vidpovid: x, pidkazka, rozviazok: `Добутки рівні, перші множники однакові (${a}), тому й другі однакові: x = ${x}.` };
  }
  const a = r.chyslo(2, 9);
  const x = a * r.chyslo(3, 9);
  return { pytannia: "Розв'яжи рівняння без обчислень.", vyraz: `x : ${a} = ${x} : ${a}`, vidpovid: x, pidkazka, rozviazok: `Частки рівні, дільники однакові (${a}), тому й ділені однакові: x = ${x}.` };
}

// Задача, де відоме число сховане у виразі: (a + b) + x = s.
function zadacha(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(12, 30);
  const b = r.chyslo(11, 28);
  const x = r.chyslo(15, 98 - a - b);
  const s = a + b + x;
  const siuzhet = r.vybir([
    { razom: `На двох полицях разом ${s} ${mnozh(s, 'книжка', 'книжки', 'книжок')}`, persha: `На першій полиці ${a} ${mnozh(a, 'казка', 'казки', 'казок')} і ${b} ${mnozh(b, 'енциклопедія', 'енциклопедії', 'енциклопедій')}`, pyt: 'Скільки книжок на другій полиці?' },
    { razom: `У двох зграях разом ${s} ${mnozh(s, 'ластівка', 'ластівки', 'ластівок')}`, persha: `У першій зграї ${a} ${mnozh(a, 'доросла ластівка', 'дорослі ластівки', 'дорослих ластівок')} і ${b} ${mnozh(b, "ластів'я", "ластів'ята", "ластів'ят")}`, pyt: 'Скільки ластівок у другій зграї?' },
    { razom: `У двох кошиках разом ${s} ${mnozh(s, 'фрукт', 'фрукти', 'фруктів')}`, persha: `У першому кошику ${a} ${mnozh(a, 'яблуко', 'яблука', 'яблук')} і ${b} ${mnozh(b, 'груша', 'груші', 'груш')}`, pyt: 'Скільки фруктів у другому кошику?' },
  ]);
  return {
    pytannia: `${siuzhet.razom}. ${siuzhet.persha}. ${siuzhet.pyt} Розв'яжи рівнянням.`,
    vidpovid: x,
    pidkazka: `Перша частина — це вираз ${a} + ${b}. Рівняння: (${a} + ${b}) + x = ${s}.`,
    rozviazok: `(${a} + ${b}) + x = ${s}; ${a} + ${b} = ${a + b}, тому ${a + b} + x = ${s}; x = ${s} − ${a + b} = ${x}.`,
  };
}

export default {
  rivni: ['вираз у правій частині', 'вираз на місці компонента', 'властивості рівностей і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return zVyrazom(r, true);
    if (riven === 2) return zVyrazom(r, false);
    const typ = r.chyslo(0, 9);
    if (typ < 3) return vlastyvist(r);
    if (typ < 5) return zadacha(r);
    return zVyrazom(r, r.shans());
  },
} satisfies Henerator;
