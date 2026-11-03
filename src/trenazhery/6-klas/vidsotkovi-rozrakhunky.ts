// Відсоткові розрахунки: відсоток від числа; скільки відсотків одне число становить від іншого
// (a : b · 100); нова ціна після підвищення чи знижки (100 % ± p %); на скільки відсотків змінилося;
// число за його відсотком.
import { ch, des, nsd, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** a і p такі, щоб p % від a було цілим. */
function para(r: Vypadok, vidsotky: number[], min = 20, max = 900) {
  const p = r.vybir(vidsotky);
  const krok = 100 / nsd(p, 100);
  const a = krok * r.chyslo(Math.ceil(min / krok), Math.floor(max / krok));
  return { p, a, x: (a * p) / 100 };
}

function vidChysla(r: Vypadok): TrenZavdannia {
  const { p, a, x } = para(r, [5, 12, 15, 24, 35, 45, 65, 72, 85]);
  return {
    pytannia: `Знайди ${p}% від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `Спершу 1%: ${ch(a)} : 100.`,
    rozviazok: `${ch(a)} : 100 · ${p} = ${ch(x)}`,
  };
}

const SKILKY = [
  (x: number, a: number) => `Скільки відсотків становить ${x} від ${a}?`,
  (x: number, a: number) => `У контрольній ${skilky(a, 'завдання', 'завдання', 'завдань')}, Тереза правильно виконала ${x}. Скільки це відсотків?`,
  (x: number, a: number) => `У класі ${skilky(a, 'учень', 'учні', 'учнів')}, з них ${x} займаються плаванням. Скільки це відсотків від класу?`,
];

function skilkyVidsotkiv(r: Vypadok): TrenZavdannia {
  const a = r.vybir([20, 25, 40, 50]);
  const p = r.vybir([5, 10, 15, 20, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90].filter((v) => (a * v) % 100 === 0));
  const x = (a * p) / 100;
  return {
    pytannia: r.vybir(SKILKY)(x, a),
    vidpovid: p,
    odynytsi: '%',
    pidkazka: `Поділи частину на ціле і помнож на 100: ${x} : ${a} · 100.`,
    rozviazok: `${x} : ${a} · 100 = ${p} (%)`,
  };
}

function novaTsina(r: Vypadok): TrenZavdannia {
  const { p, a } = para(r, [5, 10, 15, 20, 25, 30, 35, 40], 100, 2000);
  const vgoru = r.shans();
  const nova = vgoru ? (a * (100 + p)) / 100 : (a * (100 - p)) / 100;
  const k = des(vgoru ? 100 + p : 100 - p, 2);
  return {
    pytannia: vgoru
      ? `Ціна ${ch(a)} грн зросла на ${p}%. Якою стала ціна?`
      : `Іграшка коштувала ${ch(a)} грн, на неї діє знижка ${p}%. Скільки треба заплатити?`,
    vidpovid: nova,
    odynytsi: 'грн',
    pidkazka: vgoru ? `Нова ціна — це 100% + ${p}% = ${100 + p}% старої.` : `Залишається 100% − ${p}% = ${100 - p}% ціни.`,
    rozviazok: `${ch(a)} · ${k} = ${ch(nova)} (грн)`,
  };
}

function naSkilky(r: Vypadok): TrenZavdannia {
  const { p, a } = para(r, [5, 10, 15, 20, 25, 30, 40, 50], 100, 2000);
  const vgoru = r.shans(0.6);
  const zmina = (a * p) / 100;
  const b = vgoru ? a + zmina : a - zmina;
  return {
    pytannia: vgoru
      ? `Ціна зросла з ${ch(a)} грн до ${ch(b)} грн. На скільки відсотків?`
      : `Ціна знизилася з ${ch(a)} грн до ${ch(b)} грн. На скільки відсотків?`,
    vidpovid: p,
    odynytsi: '%',
    pidkazka: 'Знайди зміну в гривнях і поділи її на СТАРУ ціну.',
    rozviazok: `Зміна: ${vgoru ? `${ch(b)} − ${ch(a)}` : `${ch(a)} − ${ch(b)}`} = ${ch(zmina)} (грн); ${ch(zmina)} : ${ch(a)} · 100 = ${p} (%)`,
  };
}

function zaVidsotkom(r: Vypadok): TrenZavdannia {
  const { p, a, x } = para(r, [5, 15, 20, 25, 30, 40, 60, 75, 80]);
  return {
    pytannia: `${p}% числа дорівнюють ${ch(x)}. Знайди це число.`,
    vidpovid: a,
    pidkazka: `1% — це ${ch(x)} : ${p}.`,
    rozviazok: `${ch(x)} : ${p} · 100 = ${ch(a)}`,
  };
}

export default {
  rivni: ['відсоток від числа і скільки відсотків', 'нова ціна після зміни', 'на скільки відсотків і число за відсотком'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans() ? vidChysla(r) : skilkyVidsotkiv(r);
    if (riven === 2) return r.vybir([novaTsina, novaTsina, skilkyVidsotkiv])(r);
    return r.vybir([naSkilky, naSkilky, zaVidsotkom, novaTsina])(r);
  },
} satisfies Henerator;
