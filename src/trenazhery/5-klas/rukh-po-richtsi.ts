// Рух за течією і проти течії: v за = v власна + v течії, v проти = v власна − v течії, пліт пливе зі
// швидкістю течії; власна швидкість і течія — півсума й піврізниця.
import { type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const SUDNA = [
  { n: 'човен', r: 'човна' },
  { n: 'катер', r: 'катера' },
  { n: 'теплохід', r: 'теплохода' },
];

function shvydkosti(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(8, 40);
  const tech = r.chyslo(1, 5);
  const s = r.vybir(SUDNA).r;
  return r.shans()
    ? {
        pytannia: `Власна швидкість ${s} ${v} км/год, швидкість течії ${tech} км/год. Яка швидкість ${s} за течією?`,
        vidpovid: v + tech,
        odynytsi: 'км/год',
        pidkazka: 'За течією річка допомагає — додаємо.',
        rozviazok: `${v} + ${tech} = ${v + tech} (км/год)`,
      }
    : {
        pytannia: `Власна швидкість ${s} ${v} км/год, швидкість течії ${tech} км/год. Яка швидкість ${s} проти течії?`,
        vidpovid: v - tech,
        odynytsi: 'км/год',
        pidkazka: 'Проти течії річка заважає — віднімаємо.',
        rozviazok: `${v} − ${tech} = ${v - tech} (км/год)`,
      };
}

function vidstan(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(8, 30);
  const tech = r.chyslo(1, 4);
  const t = r.chyslo(2, 5);
  const s = r.vybir(SUDNA).r;
  const typ = r.chyslo(0, 2);
  if (typ === 2) {
    return {
      pytannia: `Швидкість течії ${tech} км/год. Скільки кілометрів пропливе пліт за ${t} год?`,
      vidpovid: tech * t,
      odynytsi: 'км',
      pidkazka: 'Пліт не має власної швидкості — його несе течія.',
      rozviazok: `${tech} · ${t} = ${tech * t} (км)`,
    };
  }
  const za = typ === 0;
  const vv = za ? v + tech : v - tech;
  return {
    pytannia: `Власна швидкість ${s} ${v} км/год, течія — ${tech} км/год. Яку відстань він пройде ${za ? 'за течією' : 'проти течії'} за ${t} год?`,
    vidpovid: vv * t,
    odynytsi: 'км',
    pidkazka: `Спершу швидкість ${za ? 'за течією' : 'проти течії'}.`,
    rozviazok: `1) ${v} ${za ? '+' : '−'} ${tech} = ${vv} (км/год); 2) ${vv} · ${t} = ${vv * t} (км).`,
  };
}

function oberneni(r: Vypadok): TrenZavdannia {
  const v = r.chyslo(8, 30);
  const tech = r.chyslo(1, 5);
  const s = r.vybir(SUDNA);
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: `Швидкість ${s.r} за течією ${v + tech} км/год, швидкість течії ${tech} км/год. Яка його швидкість проти течії?`,
      vidpovid: v - tech,
      odynytsi: 'км/год',
      pidkazka: 'Спершу знайди власну швидкість.',
      rozviazok: `1) ${v + tech} − ${tech} = ${v} (км/год) — власна; 2) ${v} − ${tech} = ${v - tech} (км/год).`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `За течією ${s.n} пливе зі швидкістю ${v + tech} км/год, а проти течії — ${v - tech} км/год. Знайди власну швидкість ${s.r}.`,
      vidpovid: v,
      odynytsi: 'км/год',
      pidkazka: 'Власна швидкість — посередині між ними: (за + проти) : 2.',
      rozviazok: `(${v + tech} + ${v - tech}) : 2 = ${2 * v} : 2 = ${v} (км/год)`,
    };
  }
  return {
    pytannia: `За течією ${s.n} пливе зі швидкістю ${v + tech} км/год, а проти течії — ${v - tech} км/год. Знайди швидкість течії.`,
    vidpovid: tech,
    odynytsi: 'км/год',
    pidkazka: 'Різниця швидкостей — це дві швидкості течії.',
    rozviazok: `(${v + tech} − ${v - tech}) : 2 = ${2 * tech} : 2 = ${tech} (км/год)`,
  };
}

export default {
  rivni: ['швидкість за течією і проти', 'відстань і пліт', 'власна швидкість і швидкість течії'],
  zavdannia(r, riven) {
    if (riven === 1) return shvydkosti(r);
    if (riven === 2) return r.shans(0.7) ? vidstan(r) : shvydkosti(r);
    return r.vybir([oberneni, oberneni, vidstan])(r);
  },
} satisfies Henerator;
