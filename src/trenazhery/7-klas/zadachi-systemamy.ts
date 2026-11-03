// Задачі системами рівнянь: позначаємо дві невідомі, складаємо два рівняння з умови, розв’язуємо
// додаванням чи підстановкою; сума й різниця, покупки, голови й ноги, течія, «удвічі більше».
import { mnozh, skilky, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function sumaRiznytsia(r: Vypadok): TrenZavdannia {
  const y = r.chyslo(5, 60);
  const d = r.chyslo(2, 30);
  const x = y + d;
  const bilshe = r.shans();
  return {
    pytannia: `Сума двох чисел — ${x + y}, одне з них на ${d} більше за інше. Знайди ${bilshe ? 'більше' : 'менше'} число.`,
    vidpovid: bilshe ? x : y,
    pidkazka: `x + y = ${x + y}, x − y = ${d}. Додай або відніми рівняння.`,
    rozviazok: bilshe ? `2x = ${x + y} + ${d} = ${2 * x}; x = ${x}` : `2y = ${x + y} − ${d} = ${2 * y}; y = ${y}`,
  };
}

const POKUPKY = [
  { a: ['кг яблук', 'кг груш'], tsiny: [[25, 45], [35, 70]], pyt: ['Скільки гривень коштує 1 кг яблук?', 'Скільки гривень коштує 1 кг груш?'] },
  { a: ['зошити', 'ручки'], tsiny: [[15, 30], [10, 25]], pyt: ['Скільки гривень коштує зошит?', 'Скільки гривень коштує ручка?'], formy: [['зошит', 'зошити', 'зошитів'], ['ручку', 'ручки', 'ручок']] },
];

function pokupky(r: Vypadok): TrenZavdannia {
  const p = r.vybir(POKUPKY);
  const [x, y] = [r.chyslo(p.tsiny[0][0], p.tsiny[0][1]), r.chyslo(p.tsiny[1][0], p.tsiny[1][1])];
  const [a1, b1, a2, b2] = [r.chyslo(1, 5), r.chyslo(1, 5), r.chyslo(1, 5), r.chyslo(1, 5)];
  if (a1 * b2 === a2 * b1) return pokupky(r);
  const n = (k: number, i: number) => (p.formy ? `${k} ${mnozh(k, ...(p.formy[i] as [string, string, string]))}` : `${k} ${p.a[i]}`);
  const pershyi = r.shans();
  return {
    pytannia: `За ${n(a1, 0)} і ${n(b1, 1)} заплатили ${a1 * x + b1 * y} грн, а за ${n(a2, 0)} і ${n(b2, 1)} — ${a2 * x + b2 * y} грн. ${p.pyt[pershyi ? 0 : 1]}`,
    vidpovid: pershyi ? x : y,
    odynytsi: 'грн',
    pidkazka: `Нехай x — ціна першого товару, y — другого: ${a1}x + ${b1}y = ${a1 * x + b1 * y}, ${a2}x + ${b2}y = ${a2 * x + b2 * y}.`,
    rozviazok: `${a1}x + ${b1}y = ${a1 * x + b1 * y}, ${a2}x + ${b2}y = ${a2 * x + b2 * y}; розв’язок: x = ${x}, y = ${y}. Перевірка: ${a1} · ${x} + ${b1} · ${y} = ${a1 * x + b1 * y} ✓`,
  };
}

function holovy(r: Vypadok): TrenZavdannia {
  const [x, y] = [r.chyslo(3, 30), r.chyslo(3, 30)];
  const kroliky = r.shans();
  return {
    pytannia: `У клітці фазани й кролики: разом ${skilky(x + y, 'голова', 'голови', 'голів')} і ${skilky(2 * x + 4 * y, 'нога', 'ноги', 'ніг')}. Скільки ${kroliky ? 'кроликів' : 'фазанів'}?`,
    vidpovid: kroliky ? y : x,
    pidkazka: `x фазанів, y кроликів: x + y = ${x + y}, 2x + 4y = ${2 * x + 4 * y}.`,
    rozviazok: `Помножимо перше на 2: 2x + 2y = ${2 * (x + y)}. Віднімемо: 2y = ${2 * x + 4 * y} − ${2 * (x + y)} = ${2 * y}; y = ${y} (кролики), x = ${x + y} − ${y} = ${x} (фазани).`,
  };
}

function techiia(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(8, 30);
  const u = r.chyslo(1, 5);
  const shcho = r.vybir([
    ['Човен', 'човна'],
    ['Катер', 'катера'],
  ]);
  const vlasna = r.shans();
  return {
    pytannia: `${shcho[0]} пливе за течією зі швидкістю ${v + u} км/год, а проти течії — ${v - u} км/год. ${vlasna ? `Яка власна швидкість ${shcho[1]}?` : 'Яка швидкість течії?'}`,
    vidpovid: vlasna ? v : u,
    odynytsi: 'км/год',
    pidkazka: `v — власна швидкість, u — течії: v + u = ${v + u}, v − u = ${v - u}.`,
    rozviazok: vlasna ? `2v = ${v + u} + ${v - u} = ${2 * v}; v = ${v}` : `2u = ${v + u} − ${v - u} = ${2 * u}; u = ${u}`,
  };
}

function udvichi(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 4);
  const y = r.chyslo(3, 12);
  const x = k * y;
  const divchat = r.shans();
  const raziv = k === 2 ? 'удвічі' : k === 3 ? 'утричі' : 'учетверо';
  return {
    pytannia: `У гуртку ${x + y} дітей, хлопців ${raziv} більше, ніж дівчат. Скільки в гуртку ${divchat ? 'дівчат' : 'хлопців'}?`,
    vidpovid: divchat ? y : x,
    pidkazka: `Хлопців x, дівчат y: x + y = ${x + y}, x = ${k}y.`,
    rozviazok: `${k}y + y = ${x + y}; ${k + 1}y = ${x + y}; y = ${y} (дівчата), x = ${k} · ${y} = ${x} (хлопці).`,
  };
}

export default {
  rivni: ['сума і різниця', 'покупки і течія', 'голови й ноги, «у кілька разів»'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? sumaRiznytsia(r) : techiia(r);
    if (riven === 2) return r.vybir([pokupky, pokupky, techiia, sumaRiznytsia])(r);
    return r.vybir([holovy, holovy, udvichi, pokupky])(r);
  },
} satisfies Henerator;
