// Множення і ділення на 10, 100, 1000: дописуємо або відкидаємо нулі; нуль усередині лишається.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const NA = [10, 100, 1000];
const nuliv = (k: number) => String(k).length - 1;
const slovo = (n: number) => (n === 1 ? 'один нуль' : n === 2 ? 'два нулі' : 'три нулі');

function mnozhennia(r: Vypadok): TrenZavdannia {
  const k = r.vybir(NA);
  const a = r.shans(0.3) ? r.chyslo(1, 9) * 10 + r.chyslo(0, 9) : r.chyslo(2, k === 1000 ? 99 : 999);
  return {
    vyraz: `${ch(a)} · ${ch(k)} =`,
    vidpovid: a * k,
    pidkazka: `У ${ch(k)} — ${slovo(nuliv(k))}. Допиши їх справа.`,
    rozviazok: `${ch(a)} · ${ch(k)} = ${ch(a * k)}`,
  };
}

function dilennia(r: Vypadok): TrenZavdannia {
  const k = r.vybir(NA);
  // Часто — «пастка»: нуль усередині (405 · 10 = 4050) або в кінці частки (60 · 100 = 6000).
  const chastka = r.vybir([r.chyslo(2, 999), r.chyslo(1, 9) * 100 + r.chyslo(1, 9), r.chyslo(1, 9) * 10]);
  return {
    vyraz: `${ch(chastka * k)} : ${ch(k)} =`,
    vidpovid: chastka,
    pidkazka: `У ${ch(k)} — ${slovo(nuliv(k))}. Відкинь стільки нулів у кінці числа.`,
    rozviazok: `${ch(chastka * k)} : ${ch(k)} = ${ch(chastka)}`,
  };
}

function vikontse(r: Vypadok): TrenZavdannia {
  const k = r.vybir(NA);
  const a = r.chyslo(2, 99);
  return r.vybir<TrenZavdannia>([
    { pytannia: 'На яке число помножили?', vyraz: `${a} · □ = ${ch(a * k)}`, vidpovid: k, pidkazka: 'Скільки нулів дописали?', rozviazok: `${a} · ${ch(k)} = ${ch(a * k)}` },
    { pytannia: 'Яке число поділили?', vyraz: `□ : ${ch(k)} = ${a}`, vidpovid: a * k, pidkazka: `Невідоме ділене: ${a} · ${ch(k)}.`, rozviazok: `${a} · ${ch(k)} = ${ch(a * k)}` },
    { pytannia: 'На яке число поділили?', vyraz: `${ch(a * k)} : □ = ${a}`, vidpovid: k, pidkazka: 'Скільки нулів відкинули?', rozviazok: `${ch(a * k)} : ${ch(k)} = ${a}` },
  ]);
}

function kruhli(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const [ka, kb] = [r.vybir([10, 100]), r.vybir([1, 10])];
  return r.shans()
    ? {
        vyraz: `${ch(a * ka)} · ${ch(b * kb)} =`,
        vidpovid: a * ka * b * kb,
        pidkazka: `Помнож ${a} · ${b}, а потім допиши всі нулі обох множників.`,
        rozviazok: `${a} · ${b} = ${a * b}, допишемо ${nuliv(ka) + nuliv(kb)}: ${ch(a * ka * b * kb)}`,
      }
    : {
        vyraz: `${ch(a * b * ka)} : ${b} =`,
        vidpovid: a * ka,
        pidkazka: `${a * b} : ${b} = ${a}, і допиши нулі.`,
        rozviazok: `${a * b} : ${b} = ${a}, тож ${ch(a * b * ka)} : ${b} = ${ch(a * ka)}`,
      };
}

export default {
  rivni: ['множення на 10, 100, 1000', 'ділення і нулі всередині', 'віконця й круглі числа'],
  zavdannia(r, riven) {
    if (riven === 1) return mnozhennia(r);
    if (riven === 2) return r.shans(0.65) ? dilennia(r) : mnozhennia(r);
    return r.vybir([vikontse, kruhli, kruhli, dilennia])(r);
  },
} satisfies Henerator;
