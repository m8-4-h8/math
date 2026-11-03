// НСД і НСК: перебором дільників/кратних і через розклад; взаємно прості; задачі про букети й маяки.
import { nsd, nsk, rozklad, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function para(r: Vypadok, max: number, spilnyi: boolean) {
  for (;;) {
    const a = r.chyslo(4, max);
    const b = r.krim(4, max, [a]);
    if (!spilnyi || nsd(a, b) > 1) return [Math.min(a, b), Math.max(a, b)] as const;
  }
}

// «12 = 2 · 2 · 3» або «11 — просте».
const zapysRozkladu = (n: number) => (rozklad(n).length > 1 ? `${n} = ${rozklad(n).join(' · ')}` : `${n} — просте`);

function znaity(r: Vypadok, max: number, shcho: 'НСД' | 'НСК'): TrenZavdannia {
  const [a, b] = para(r, max, shcho === 'НСД' ? r.shans(0.85) : r.shans(0.6));
  const ra = zapysRozkladu(a);
  const rb = zapysRozkladu(b);
  if (shcho === 'НСД') {
    const g = nsd(a, b);
    return {
      pytannia: `Знайди $\\text{НСД}(${a}; ${b})$.`,
      vidpovid: g,
      pidkazka: `Найбільше число, на яке діляться і ${a}, і ${b}. Розклади обидва на прості множники.`,
      rozviazok: `${ra}, ${rb}. ${g === 1 ? 'Спільних простих множників немає — НСД = 1, числа взаємно прості.' : `Спільні множники дають ${g}: ${a} : ${g} = ${a / g}, ${b} : ${g} = ${b / g}.`}`,
    };
  }
  const k = nsk(a, b);
  return {
    pytannia: `Знайди $\\text{НСК}(${a}; ${b})$.`,
    vidpovid: k,
    pidkazka: `Перебирай кратні більшого числа ${b}: ${b}, ${2 * b}, ${3 * b}… Яке перше ділиться на ${a}?`,
    rozviazok: `${ra}, ${rb}. НСК = ${k}: ${k} : ${a} = ${k / a}, ${k} : ${b} = ${k / b}.`,
  };
}

function vzaiemnoProsti(r: Vypadok): TrenZavdannia {
  const [a, b] = para(r, 40, false);
  const tak = nsd(a, b) === 1;
  return {
    pytannia: `Чи взаємно прості числа ${a} і ${b}?`,
    vidpovid: tak ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Взаємно прості — коли НСД дорівнює 1.',
    rozviazok: tak ? `НСД(${a}; ${b}) = 1 — так.` : `Обидва діляться на ${nsd(a, b)} — ні.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const g = r.chyslo(3, 12);
    let x = r.chyslo(2, 7);
    let y = r.krim(2, 7, [x]);
    while (nsd(x, y) !== 1) y = r.krim(2, 7, [x]);
    if (x > y) [x, y] = [y, x];
    const [a, b] = [g * x, g * y];
    return {
      pytannia: `Є ${a} червоних і ${b} жовтих тюльпанів. Яку найбільшу кількість однакових букетів можна скласти з усіх квітів?`,
      vidpovid: g,
      pidkazka: 'Кількість букетів має ділити і число червоних, і число жовтих. Найбільша — це НСД.',
      rozviazok: `НСД(${a}; ${b}) = ${g}: у кожному букеті ${x} червоних і ${y} жовтих.`,
    };
  }
  const [a, b] = para(r, 30, true);
  const k = nsk(a, b);
  return {
    pytannia: `Один маяк спалахує кожні ${a} с, другий — кожні ${b} с. Щойно вони спалахнули разом. Через скільки секунд це станеться знову?`,
    vidpovid: k,
    odynytsi: 'с',
    pidkazka: 'Шукаємо найменше число, кратне і першому, і другому — НСК.',
    rozviazok: `НСК(${a}; ${b}) = ${k}: ${k} : ${a} = ${k / a}, ${k} : ${b} = ${k / b}.`,
  };
}

export default {
  rivni: ['НСД невеликих чисел', 'НСК і взаємно прості', 'більші числа і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return znaity(r, 36, 'НСД');
    if (riven === 2) return r.vybir([() => znaity(r, 24, 'НСК'), () => znaity(r, 24, 'НСК'), () => vzaiemnoProsti(r), () => znaity(r, 48, 'НСД')])();
    return r.vybir([() => zadacha(r), () => zadacha(r), () => znaity(r, 90, 'НСД'), () => znaity(r, 40, 'НСК')])();
  },
} satisfies Henerator;
