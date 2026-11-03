// Задачі рівнянням: позначаємо невідоме x, складаємо рівняння за умовою, розв'язуємо, перевіряємо.
import { mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function zadumaly(r: Vypadok, dviDii: boolean): TrenZavdannia {
  const x = r.chyslo(3, 30);
  if (!dviDii) {
    const a = r.chyslo(2, 40);
    return r.vybir<TrenZavdannia>([
      {
        pytannia: `Задумали число, відняли від нього ${a} і отримали ${x}. Яке число задумали?`,
        vidpovid: x + a,
        pidkazka: `Рівняння: x − ${a} = ${x}.`,
        rozviazok: `x − ${a} = ${x}; x = ${x} + ${a} = ${x + a}.`,
      },
      {
        pytannia: `Задумали число, додали до нього ${a} і отримали ${x + a}. Яке число задумали?`,
        vidpovid: x,
        pidkazka: `Рівняння: x + ${a} = ${x + a}.`,
        rozviazok: `x + ${a} = ${x + a}; x = ${x + a} − ${a} = ${x}.`,
      },
      {
        pytannia: `Задумали число і помножили його на ${a % 9 + 2}. Вийшло ${x * (a % 9 + 2)}. Яке число задумали?`,
        vidpovid: x,
        pidkazka: `Рівняння: x · ${a % 9 + 2} = ${x * (a % 9 + 2)}.`,
        rozviazok: `x = ${x * (a % 9 + 2)} : ${a % 9 + 2} = ${x}.`,
      },
    ]);
  }
  const k = r.chyslo(2, 9);
  const b = r.chyslo(1, 30);
  return r.shans()
    ? {
        pytannia: `Задумали число, помножили на ${k} і додали ${b}. Вийшло ${k * x + b}. Яке число задумали?`,
        vidpovid: x,
        pidkazka: `Рівняння: ${k} · x + ${b} = ${k * x + b}.`,
        rozviazok: `${k} · x = ${k * x + b} − ${b} = ${k * x}; x = ${k * x} : ${k} = ${x}.`,
      }
    : {
        pytannia: `Задумали число, відняли ${b} і результат помножили на ${k}. Вийшло ${k * x}. Яке число задумали?`,
        vidpovid: x + b,
        pidkazka: `Рівняння: (x − ${b}) · ${k} = ${k * x}.`,
        rozviazok: `x − ${b} = ${k * x} : ${k} = ${x}; x = ${x} + ${b} = ${x + b}.`,
      };
}

// «У другому в 4 рази більше, разом 45» — x + 4x = 5x.
function uRaziv(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(3, 25);
  const k = r.chyslo(2, 6);
  const s = r.vybir([
    { de: 'кошиках', shcho: ['яблуко', 'яблука', 'яблук'], persh: 'першому кошику', druh: 'другому' },
    { de: 'ящиках', shcho: ['кілограм', 'кілограми', 'кілограмів'], persh: 'першому ящику', druh: 'другому' },
    { de: 'класах', shcho: ['книжка', 'книжки', 'книжок'], persh: 'першому класі', druh: 'другому' },
  ]);
  const razom = x * (k + 1);
  return {
    pytannia: `У двох ${s.de} разом ${razom} ${mnozh(razom, s.shcho[0], s.shcho[1], s.shcho[2])}. У ${s.druh} в ${k} рази більше, ніж у ${s.persh}. Скільки в ${s.persh}?`,
    vidpovid: x,
    pidkazka: `Нехай у першому x, тоді в другому ${k}x. Разом x + ${k}x = ${k + 1}x.`,
    rozviazok: `x + ${k}x = ${razom}; ${k + 1}x = ${razom}; x = ${razom} : ${k + 1} = ${x}.`,
  };
}

function naBilshe(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 1);
  if (typ === 0) {
    const syn = r.chyslo(5, 15);
    const riznytsia = r.chyslo(20, 35);
    const razom = 2 * syn + riznytsia;
    return {
      pytannia: `Мама на ${riznytsia} ${mnozh(riznytsia, 'рік', 'роки', 'років')} старша за сина. Разом їм ${razom} ${mnozh(razom, 'рік', 'роки', 'років')}. Скільки років синові?`,
      vidpovid: syn,
      pidkazka: `Нехай синові x, тоді мамі x + ${riznytsia}. Разом: x + x + ${riznytsia} = ${razom}.`,
      rozviazok: `2x + ${riznytsia} = ${razom}; 2x = ${razom - riznytsia}; x = ${syn}.`,
    };
  }
  const shyryna = r.chyslo(2, 15);
  const d = r.chyslo(1, 8);
  const P = 2 * (2 * shyryna + d);
  return {
    pytannia: `Периметр прямокутника ${P} см. Довжина на ${d} см більша за ширину. Яка ширина прямокутника?`,
    vidpovid: shyryna,
    odynytsi: 'см',
    pidkazka: `Нехай ширина x, довжина x + ${d}. Половина периметра: x + x + ${d} = ${P / 2}.`,
    rozviazok: `${P} : 2 = ${P / 2}; 2x + ${d} = ${P / 2}; 2x = ${P / 2 - d}; x = ${shyryna}.`,
  };
}

export default {
  rivni: ['задумане число: одна дія', 'задумане число: дві дії', 'частини, «на … більше», периметр'],
  zavdannia(r, riven) {
    if (riven === 1) return zadumaly(r, false);
    if (riven === 2) return r.shans(0.7) ? zadumaly(r, true) : uRaziv(r);
    return r.vybir([uRaziv, naBilshe, naBilshe, (rr: Vypadok) => zadumaly(rr, true)])(r);
  },
} satisfies Henerator;
