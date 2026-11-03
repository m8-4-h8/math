// Одиниці площі: сусідні відрізняються в 100 разів (бо 10 · 10), гектар; дві сходинки — двічі по 100.
import { ch, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const SUSIDNI = [
  { v: 'см²', m: 'мм²', k: 100 },
  { v: 'дм²', m: 'см²', k: 100 },
  { v: 'м²', m: 'дм²', k: 100 },
  { v: 'га', m: 'м²', k: 10000 },
  { v: 'км²', m: 'га', k: 100 },
];
const DALEKI = [
  { v: 'м²', m: 'см²', k: 10000, kroky: 'м² → дм² → см²' },
  { v: 'дм²', m: 'мм²', k: 10000, kroky: 'дм² → см² → мм²' },
  { v: 'км²', m: 'м²', k: 1000000, kroky: 'км² → га → м²' },
];

function vMenshi(r: Vypadok, pary: { v: string; m: string; k: number; kroky?: string }[]): TrenZavdannia {
  const p = r.vybir(pary);
  const a = r.chyslo(2, p.k >= 1000000 ? 9 : 60);
  return {
    pytannia: 'Переведи в менші одиниці.',
    vyraz: `${a} ${p.v} = □ ${p.m}`,
    vidpovid: a * p.k,
    odynytsi: p.m,
    pidkazka: p.kroky ? `Дві сходинки: ${p.kroky}, щоразу · 100.` : `1 ${p.v} = ${ch(p.k)} ${p.m}. У менші — множимо.`,
    rozviazok: `${a} · ${ch(p.k)} = ${ch(a * p.k)} (${p.m})`,
  };
}

function vBilshi(r: Vypadok, pary: { v: string; m: string; k: number; kroky?: string }[]): TrenZavdannia {
  const p = r.vybir(pary);
  const a = r.chyslo(2, p.k >= 1000000 ? 9 : 60);
  return {
    pytannia: 'Переведи у більші одиниці.',
    vyraz: `${ch(a * p.k)} ${p.m} = □ ${p.v}`,
    vidpovid: a,
    odynytsi: p.v,
    pidkazka: p.kroky ? `Дві сходинки вгору: двічі ділимо на 100.` : `1 ${p.v} = ${ch(p.k)} ${p.m}. У більші — ділимо.`,
    rozviazok: `${ch(a * p.k)} : ${ch(p.k)} = ${a} (${p.v})`,
  };
}

function chomu100(r: Vypadok): TrenZavdannia {
  const p = r.vybir([
    { v: 'дм', m: 'см', vp: 'дм²', mp: 'см²' },
    { v: 'см', m: 'мм', vp: 'см²', mp: 'мм²' },
    { v: 'м', m: 'дм', vp: 'м²', mp: 'дм²' },
  ]);
  return r.shans()
    ? {
        pytannia: `1 ${p.v} = 10 ${p.m}. Скільки ${p.mp} в 1 ${p.vp}?`,
        vidpovid: 100,
        odynytsi: p.mp,
        pidkazka: `Квадрат 1 ${p.v} × 1 ${p.v} — це 10 рядів по 10 маленьких квадратиків.`,
        rozviazok: `10 · 10 = 100 (${p.mp})`,
      }
    : {
        pytannia: `У скільки разів 1 ${p.vp} більший за 1 ${p.mp}?`,
        vidpovid: 100,
        varianty: [10, 100, 1000],
        pidkazka: 'Сусідні одиниці площі — це 10 · 10.',
        rozviazok: `10 · 10 = 100 — у 100 разів.`,
      };
}

function ploshcha(r: Vypadok): TrenZavdannia {
  const a = r.chyslo(2, 9) * 10;
  const b = r.chyslo(2, 9) * 10;
  return {
    pytannia: `Город має форму прямокутника ${a} м на ${b} м. Яка його площа в арах, якщо 1 ар = 100 м²?`,
    vidpovid: (a * b) / 100,
    odynytsi: 'а',
    pidkazka: `Спершу площа в м²: ${a} · ${b}.`,
    rozviazok: `${a} · ${b} = ${ch(a * b)} (м²); ${ch(a * b)} : 100 = ${(a * b) / 100} (а)`,
  };
}

export default {
  rivni: ['сусідні одиниці', 'у більші одиниці, гектар', 'дві сходинки і площа ділянки'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.8) ? vMenshi(r, SUSIDNI.slice(0, 3)) : chomu100(r);
    if (riven === 2) return r.shans() ? vBilshi(r, SUSIDNI) : vMenshi(r, SUSIDNI);
    return r.vybir([() => vMenshi(r, DALEKI), () => vBilshi(r, DALEKI), () => ploshcha(r), () => chomu100(r)])();
  },
} satisfies Henerator;
