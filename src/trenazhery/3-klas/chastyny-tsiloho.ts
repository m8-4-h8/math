// Частини цілого: половина, третина, чверть…; частина від числа і число за його частиною.
import { mnozh, osoba, rid, tdrib, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

// [називний, знахідний]: «третина числа дорівнює…», «знайди третину від…».
const NAZVY: Record<number, [string, string]> = {
  2: ['половина', 'половину'],
  3: ['третина', 'третину'],
  4: ['чверть', 'чверть'],
  5: ["п'ята частина", "п'яту частину"],
  6: ['шоста частина', 'шосту частину'],
  8: ['восьма частина', 'восьму частину'],
  10: ['десята частина', 'десяту частину'],
};
const ZNAMENNYKY = [2, 3, 4, 5, 6, 8, 10];

function chastynaVidChysla(r: Vypadok, znamennyky: number[]): TrenZavdannia {
  const k = r.vybir(znamennyky);
  const chastyna = r.chyslo(2, 10);
  const tsile = k * chastyna;
  return r.shans()
    ? {
        pytannia: `Знайди ${NAZVY[k][1]} від числа ${tsile}.`,
        vidpovid: chastyna,
        pidkazka: `Ділимо ціле на ${k} рівних частин: ${tsile} : ${k}.`,
        rozviazok: `${tsile} : ${k} = ${chastyna}`,
      }
    : {
        pytannia: `Знайди $${tdrib(1, k)}$ від ${tsile}.`,
        vidpovid: chastyna,
        pidkazka: `Знаменник ${k} — ділимо на ${k}.`,
        rozviazok: `${tsile} : ${k} = ${chastyna}`,
      };
}

function chysloZaChastynoiu(r: Vypadok, znamennyky: number[]): TrenZavdannia {
  const k = r.vybir(znamennyky);
  const chastyna = r.chyslo(2, 12);
  return {
    pytannia: `${zVelykoi(NAZVY[k][0])} числа дорівнює ${chastyna}. Яке це число?`,
    vidpovid: k * chastyna,
    pidkazka: `Усе число — це ${k} таких частин: ${chastyna} · ${k}.`,
    rozviazok: `${chastyna} · ${k} = ${k * chastyna}`,
  };
}

function shchoBilshe(r: Vypadok): TrenZavdannia {
  const [a, b] = r.rizni(2, 0, ZNAMENNYKY.length - 1).map((i) => ZNAMENNYKY[i]);
  const pravylna = a < b ? NAZVY[a][0] : NAZVY[b][0];
  return {
    pytannia: `Що більше: ${NAZVY[a][0]} торта чи ${NAZVY[b][0]} такого самого торта?`,
    vidpovid: pravylna,
    varianty: [NAZVY[a][0], NAZVY[b][0]],
    pidkazka: 'Чим на більше частин ріжемо торт, тим менший кожен шматок.',
    rozviazok: `Коли торт ріжуть на ${Math.min(a, b)} ${mnozh(Math.min(a, b), 'частину', 'частини', 'частин')}, шматки більші, ніж коли на ${Math.max(a, b)}. Більша — ${pravylna}.`,
  };
}

function zadacha(r: Vypadok): TrenZavdannia {
  const k = r.vybir([2, 3, 4, 5]);
  const chastyna = r.chyslo(2, 9);
  const tsile = k * chastyna;
  const o = osoba(r);
  return r.vybir<() => TrenZavdannia>([
    () => {
      // Клас — від 18 до 36 учнів.
      const uchniv = k * r.chyslo(Math.ceil(18 / k), Math.floor(36 / k));
      return {
        pytannia: `У класі ${uchniv} ${mnozh(uchniv, 'учень', 'учні', 'учнів')}. ${zVelykoi(NAZVY[k][0])} з них ходить на гурток шахів. Скільки учнів ходить на шахи?`,
        vidpovid: uchniv / k,
        pidkazka: `Частину від числа знаходимо діленням: ${uchniv} : ${k}.`,
        rozviazok: `${uchniv} : ${k} = ${uchniv / k}`,
      };
    },
    () => ({
      pytannia: `${o.imia} ${rid(o, "з'їв", "з'їла")} ${chastyna} ${mnozh(chastyna, 'полуницю', 'полуниці', 'полуниць')}, і це ${NAZVY[k][0]} всіх полуниць у мисці. Скільки полуниць було в мисці?`,
      vidpovid: tsile,
      pidkazka: `Усі полуниці — ${k} таких частин.`,
      rozviazok: `${chastyna} · ${k} = ${tsile}`,
    }),
  ])();
}

export default {
  rivni: ['половина, третина, чверть', 'будь-яка частина від числа', 'число за частиною і задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return chastynaVidChysla(r, [2, 3, 4]);
    if (riven === 2) return r.shans(0.8) ? chastynaVidChysla(r, ZNAMENNYKY) : shchoBilshe(r);
    return r.vybir([() => chysloZaChastynoiu(r, ZNAMENNYKY), () => zadacha(r), () => chastynaVidChysla(r, ZNAMENNYKY), () => shchoBilshe(r)])();
  },
} satisfies Henerator;
