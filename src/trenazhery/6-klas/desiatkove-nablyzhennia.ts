// Десяткове наближення звичайного дробу (Істер § 8): ділимо на один знак далі й округлюємо до десятих, сотих,
// тисячних; мішані числа; задачі з грошима й довжинами (до копійки, до сантиметра).
import { ch, des, desZNuliamy, nsd, tdrib, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const ROZRIADY = ['одиниць', 'десятих', 'сотих', 'тисячних', 'десятитисячних'];

/** a/b, округлене до k знаків після коми (половину — вгору), як ціле число k-х часток. */
function okruhlyty(a: number, b: number, k: number) {
  const m = a * 10 ** k;
  const n = Math.floor(m / b);
  return 2 * (m % b) >= b ? n + 1 : n;
}

/** Перші k + 1 знаків частки a : b з «…»: «0,7142…». */
function chastka(a: number, b: number, k: number) {
  const n = Math.floor((a * 10 ** (k + 1)) / b);
  const tochno = (a * 10 ** (k + 1)) % b === 0;
  return desZNuliamy(n, k + 1) + (tochno ? '' : '…');
}

function nablyzhennia(r: Vypadok, k: number, mishane: boolean): TrenZavdannia {
  for (;;) {
    const b = r.vybir([3, 6, 7, 9, 11, 12, 13, 14, 15, 18, 21, 24]);
    const a0 = r.chyslo(1, b - 1);
    if (nsd(a0, b) !== 1) continue;
    const t = mishane ? r.chyslo(1, 9) : 0;
    const a = t * b + a0;
    const n = okruhlyty(a, b, k);
    const nastupna = Math.floor((a * 10 ** (k + 1)) / b) % 10;
    const zapys = mishane ? `${t}${tdrib(a0, b)}` : tdrib(a, b);
    return {
      pytannia: `Знайди десяткове наближення ${mishane ? 'числа' : 'дробу'} $${zapys}$ до ${ROZRIADY[k]}.`,
      vidpovid: [...new Set([desZNuliamy(n, k), des(n, k)])],
      pidkazka: `Поділи ${a} на ${b} до ${ROZRIADY[k + 1]} (на один знак далі) і округли.`,
      rozviazok: `${a} : ${b} — це ${chastka(a, b, k)}; праворуч від ${ROZRIADY[k]} стоїть ${nastupna}, ${nastupna >= 5 ? 'округлюємо вгору' : 'розряд не змінюємо'}: ≈ ${desZNuliamy(n, k)}`,
    };
  }
}

function hroshi(r: Vypadok): TrenZavdannia {
  for (;;) {
    const liudy = r.vybir([3, 6, 7, 9, 11, 12]);
    const suma = r.chyslo(10, 200) * 10;
    if (suma % liudy === 0) continue;
    const n = okruhlyty(suma, liudy, 2);
    const [shcho, kto] = r.vybir([
      ['подарунок', 'друзів'],
      ['піцу', 'однокласників'],
      ['квитки в музей', 'учнів'],
    ]);
    return {
      pytannia: `${liudy} ${kto} порівну заплатили за ${shcho} ${ch(suma)} грн. Скільки гривень заплатив кожен? Округли до сотих (до копійки).`,
      vidpovid: [...new Set([desZNuliamy(n, 2), des(n, 2)])],
      odynytsi: 'грн',
      pidkazka: `${ch(suma)} : ${liudy} — поділи до тисячних.`,
      rozviazok: `${ch(suma)} : ${liudy} — це ${chastka(suma, liudy, 2)} ≈ ${desZNuliamy(n, 2)} (грн)`,
    };
  }
}

function dovzhyna(r: Vypadok): TrenZavdannia {
  for (;;) {
    const chastyn = r.vybir([3, 6, 7, 9]);
    const dovzh = r.chyslo(2, 9);
    if (dovzh % chastyn === 0) continue;
    const n = okruhlyty(dovzh, chastyn, 2);
    return {
      pytannia: `Дошку завдовжки ${dovzh} м розпиляли на ${chastyn} однакових частин. Яка довжина однієї частини? Округли до сотих метра (до сантиметра).`,
      vidpovid: [...new Set([desZNuliamy(n, 2), des(n, 2)])],
      odynytsi: 'м',
      pidkazka: `${dovzh} : ${chastyn} — поділи до тисячних.`,
      rozviazok: `${dovzh} : ${chastyn} — це ${chastka(dovzh, chastyn, 2)} ≈ ${desZNuliamy(n, 2)} (м)`,
    };
  }
}

export default {
  rivni: ['до десятих і сотих', 'до тисячних, мішані числа', 'задачі: гроші й довжини'],
  zavdannia(r, riven) {
    if (riven === 1) return nablyzhennia(r, r.vybir([1, 2, 2]), false);
    if (riven === 2) return r.shans(0.6) ? nablyzhennia(r, 3, false) : nablyzhennia(r, r.vybir([1, 2]), true);
    return r.vybir([hroshi, dovzhyna, (v: Vypadok) => nablyzhennia(v, v.vybir([2, 3]), v.shans())])(r);
  },
} satisfies Henerator;
