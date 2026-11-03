// Задачі на рух: s = v · t і обернені; рух назустріч (швидкість зближення v₁ + v₂), у протилежні боки
// (швидкість віддалення), навздогін (v₁ − v₂).
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const KHTO = [
  { khto: 'Пішохід', v: [3, 6], diia: ['пройшов', 'ішов'] },
  { khto: 'Велосипедист', v: [10, 20], diia: ['проїхав', 'їхав'] },
  { khto: 'Автомобіль', v: [50, 90], diia: ['проїхав', 'їхав'] },
  { khto: 'Поїзд', v: [60, 120], diia: ['проїхав', 'їхав'] },
];

function sVt(r: Vypadok): TrenZavdannia {
  const k = r.vybir(KHTO);
  const v = r.chyslo(k.v[0], k.v[1]);
  const t = r.chyslo(2, 6);
  const s = v * t;
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `${k.khto} ${k.diia[1]} ${t} год зі швидкістю ${v} км/год. Яку відстань він ${k.diia[0]}?`,
      vidpovid: s,
      odynytsi: 'км',
      pidkazka: 'Відстань = швидкість · час.',
      rozviazok: `${v} · ${t} = ${s} (км)`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${k.khto} ${k.diia[0]} ${s} км за ${t} год. З якою швидкістю він ${k.diia[1]}?`,
      vidpovid: v,
      odynytsi: 'км/год',
      pidkazka: 'Швидкість = відстань : час.',
      rozviazok: `${s} : ${t} = ${v} (км/год)`,
    };
  }
  return {
    pytannia: `${k.khto} ${k.diia[1]} зі швидкістю ${v} км/год. За скільки годин він подолає ${s} км?`,
    vidpovid: t,
    odynytsi: 'год',
    pidkazka: 'Час = відстань : швидкість.',
    rozviazok: `${s} : ${v} = ${t} (год)`,
  };
}

function nazustrich(r: Vypadok): TrenZavdannia {
  const k = r.vybir(KHTO.slice(0, 3));
  const v1 = r.chyslo(k.v[0], k.v[1]);
  const v2 = r.chyslo(k.v[0], k.v[1]);
  const t = r.chyslo(2, 5);
  const s = (v1 + v2) * t;
  const mn = k.khto === 'Пішохід' ? 'Два пішоходи вийшли' : k.khto === 'Велосипедист' ? 'Два велосипедисти виїхали' : 'Два автомобілі виїхали';
  if (r.shans()) {
    return {
      pytannia: `${mn} одночасно назустріч один одному з двох пунктів, між якими ${s} км. Швидкість одного ${v1} км/год, другого — ${v2} км/год. Через скільки годин вони зустрінуться?`,
      vidpovid: t,
      odynytsi: 'год',
      pidkazka: 'Щогодини відстань між ними скорочується на v₁ + v₂.',
      rozviazok: `1) ${v1} + ${v2} = ${v1 + v2} (км/год) — швидкість зближення; 2) ${s} : ${v1 + v2} = ${t} (год).`,
    };
  }
  return {
    pytannia: `${mn} одночасно назустріч один одному і зустрілися через ${t} год. Швидкість одного ${v1} км/год, другого — ${v2} км/год. Яка відстань була між ними на початку?`,
    vidpovid: s,
    odynytsi: 'км',
    pidkazka: 'Знайди швидкість зближення і помнож на час.',
    rozviazok: `1) ${v1} + ${v2} = ${v1 + v2} (км/год); 2) ${v1 + v2} · ${t} = ${s} (км).`,
  };
}

function protylezhni(r: Vypadok): TrenZavdannia {
  const v1 = r.chyslo(3, 6);
  const v2 = r.chyslo(3, 6);
  const t = r.chyslo(2, 5);
  const pochatok = r.shans() ? 0 : r.chyslo(1, 9);
  const s = (v1 + v2) * t + pochatok;
  return {
    pytannia: `Два пішоходи вийшли ${pochatok ? `з двох пунктів, між якими ${pochatok} км,` : 'з одного місця'} в протилежні боки зі швидкостями ${v1} км/год і ${v2} км/год. Яка відстань буде між ними через ${t} год?`,
    vidpovid: s,
    odynytsi: 'км',
    pidkazka: 'Щогодини відстань між ними збільшується на v₁ + v₂.',
    rozviazok: pochatok
      ? `1) ${v1} + ${v2} = ${v1 + v2} (км/год); 2) ${v1 + v2} · ${t} = ${(v1 + v2) * t} (км); 3) ${(v1 + v2) * t} + ${pochatok} = ${s} (км).`
      : `1) ${v1} + ${v2} = ${v1 + v2} (км/год); 2) ${v1 + v2} · ${t} = ${s} (км).`,
  };
}

function navzdohin(r: Vypadok): TrenZavdannia {
  const v2 = r.chyslo(3, 6);
  const v1 = v2 + r.chyslo(4, 12);
  const t = r.chyslo(2, 5);
  const s = (v1 - v2) * t;
  return {
    pytannia: `Між велосипедистом і пішоходом ${s} км. Велосипедист (${v1} км/год) наздоганяє пішохода (${v2} км/год). Через скільки годин наздожене?`,
    vidpovid: t,
    odynytsi: 'год',
    pidkazka: 'Щогодини велосипедист скорочує відстань на v₁ − v₂.',
    rozviazok: `1) ${v1} − ${v2} = ${v1 - v2} (км/год) — швидкість зближення; 2) ${s} : ${v1 - v2} = ${t} (год).`,
  };
}

export default {
  rivni: ['відстань, швидкість, час', 'назустріч і в протилежні боки', 'навздогін і змішані'],
  zavdannia(r, riven) {
    if (riven === 1) return sVt(r);
    if (riven === 2) return r.vybir([nazustrich, nazustrich, protylezhni, sVt])(r);
    return r.vybir([navzdohin, navzdohin, nazustrich, protylezhni])(r);
  },
} satisfies Henerator;
