// Зручний рахунок: множимо, розбиваючи число на круглі частини (47 · 6 = 40 · 6 + 7 · 6);
// ділимо з мітками «дільник · 5» і «дільник · 10», щоб одразу знати, де шукати цифру частки.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function rozbyty(r: Vypadok, tsyfr: 2 | 3): TrenZavdannia {
  const a = tsyfr === 2 ? r.chyslo(12, 98) : r.chyslo(102, 998);
  const b = r.chyslo(3, 9);
  const kruhle = tsyfr === 2 ? a - (a % 10) : a - (a % 100);
  const reshta = a - kruhle;
  if (reshta === 0 || kruhle === 0) return rozbyty(r, tsyfr);
  if (r.shans(0.35)) {
    return {
      pytannia: 'Розбий на круглу частину і решту. Яке число у віконці?',
      vyraz: `${a} · ${b} = ${kruhle} · ${b} + □ · ${b}`,
      vidpovid: reshta,
      pidkazka: `${a} = ${kruhle} + ?`,
      rozviazok: `${a} = ${kruhle} + ${reshta}, тож ${a} · ${b} = ${kruhle} · ${b} + ${reshta} · ${b}`,
    };
  }
  return {
    pytannia: 'Порахуй у голові: розбий число на круглу частину і решту.',
    vyraz: `${a} · ${b} =`,
    vidpovid: a * b,
    pidkazka: `${a} = ${kruhle} + ${reshta}. Помнож кожну частину на ${b} і додай.`,
    rozviazok: `${kruhle} · ${b} + ${reshta} · ${b} = ${ch(kruhle * b)} + ${reshta * b} = ${ch(a * b)}`,
  };
}

// «Від 1 до 4 чи від 5 до 9?» — порівнюємо ділене з мітками.
function mitky(r: Vypadok, dvotsyfrovyi: boolean): TrenZavdannia {
  const d = dvotsyfrovyi ? r.chyslo(12, 49) : r.chyslo(3, 9);
  const q = r.chyslo(1, 9);
  const dilene = d * q + r.chyslo(0, d - 1);
  const vidpovid = q <= 4 ? 'від 1 до 4' : 'від 5 до 9';
  return {
    pytannia: `Ділимо ${dilene} : ${d}. У яких межах цифра частки?`,
    vidpovid,
    varianty: ['від 1 до 4', 'від 5 до 9'],
    pidkazka: `Мітки: ${d} · 5 = ${d * 5} і ${d} · 10 = ${d * 10}. Куди потрапляє ${dilene}?`,
    rozviazok:
      q <= 4
        ? `${d} · 5 = ${d * 5}, а ${dilene} < ${d * 5} — цифра від 1 до 4 (насправді ${q}).`
        : `${d} · 5 = ${d * 5} ≤ ${dilene} < ${d * 10} = ${d} · 10 — цифра від 5 до 9 (насправді ${q}).`,
  };
}

function tsyfraZMitkamy(r: Vypadok, dvotsyfrovyi: boolean): TrenZavdannia {
  const d = dvotsyfrovyi ? r.chyslo(12, 49) : r.chyslo(3, 9);
  const q = r.chyslo(2, 9);
  const dilene = d * q;
  return {
    pytannia: 'Знайди частку: спершу порахуй мітки дільник · 5 і дільник · 10.',
    vyraz: `${dilene} : ${d} =`,
    vidpovid: q,
    pidkazka: `${d} · 5 = ${d * 5}, ${d} · 10 = ${d * 10}. ${dilene} ${dilene < d * 5 ? 'менше' : 'не менше'} за ${d * 5}.`,
    rozviazok: `${dilene} ${dilene < d * 5 ? `< ${d * 5}` : `≥ ${d * 5}`} — цифра ${q <= 4 ? 'від 1 до 4' : 'від 5 до 9'}. Пробуємо: ${d} · ${q} = ${dilene}.`,
  };
}

export default {
  rivni: ['розбиваємо на круглі частини', 'множення в голові і мітки ділення', 'двоцифровий дільник і трицифрові числа'],
  zavdannia(r, riven) {
    if (riven === 1) return rozbyty(r, 2);
    if (riven === 2) return r.vybir([() => rozbyty(r, 2), () => rozbyty(r, 3), () => mitky(r, false), () => tsyfraZMitkamy(r, false)])();
    return r.vybir([() => rozbyty(r, 3), () => mitky(r, true), () => tsyfraZMitkamy(r, true), () => tsyfraZMitkamy(r, true)])();
  },
} satisfies Henerator;
