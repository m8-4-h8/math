// Масштаб (Істер § 18): відстань на місцевості і на карті (зокрема дробові сантиметри), знайти масштаб
// (переводимо в сантиметри), пропорція на одній карті, дві карти різного масштабу, масштаб збільшення k : 1.
import { ch, des, tch, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** Знаменники масштабів карт. */
const N = [25_000, 50_000, 100_000, 200_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000];

const m = (n: number) => `$1 : ${tch(n)}$`;
/** n сантиметрів у кілометрах (n кратне 1000): тисячні кілометра. */
const km = (tysiachni: number) => des(tysiachni, 3);

/** Довжина на карті в десятих сантиметра: частіше цілі й половинки. */
function naKartiDes(r: Vypadok) {
  return r.shans(0.6) ? r.chyslo(2, 15) * 10 : r.vybir([15, 25, 35, 45, 55, 65, 75, 85, 95, 12, 18, 24, 36, 42]);
}

/** Масштаб для пояснення: «1 см — 2,5 км». */
const odynSm = (n: number) => (n >= 100_000 ? `${km(n / 100)} км` : `${ch(n / 100)} м`);

function naMistsevosti(r: Vypadok): TrenZavdannia {
  const n = r.vybir(N);
  const a10 = naKartiDes(r);
  const t = (a10 * n) / 1000; // тисячні кілометра: a10/10 см · n см / 100 000
  return {
    pytannia: `Масштаб карти ${m(n)}. Відстань між селами на карті ${des(a10, 1)} см. Скільки це кілометрів на місцевості?`,
    vidpovid: km(t),
    odynytsi: 'км',
    pidkazka: `1 см на карті — ${ch(n)} см, тобто ${odynSm(n)}.`,
    rozviazok: `1 см — ${km(n / 100)} км; ${des(a10, 1)} · ${km(n / 100)} = ${km(t)} (км).`,
  };
}

function naKarti(r: Vypadok): TrenZavdannia {
  const n = r.vybir(N.filter((x) => x >= 100_000));
  const a10 = naKartiDes(r);
  const t = (a10 * n) / 1000;
  return {
    pytannia: `Масштаб карти ${m(n)}. Відстань між містами ${km(t)} км. Скільки сантиметрів буде між ними на карті?`,
    vidpovid: des(a10, 1),
    odynytsi: 'см',
    pidkazka: `1 см на карті — ${km(n / 100)} км. Скільки разів ${km(n / 100)} уміщується в ${km(t)}?`,
    rozviazok: `1 см — ${km(n / 100)} км; ${km(t)} : ${km(n / 100)} = ${des(a10, 1)} (см). На карті відстань менша ✓`,
  };
}

function znaityMasshtab(r: Vypadok): TrenZavdannia {
  const plan = r.shans(0.35);
  const n = plan ? r.vybir([100, 200, 250, 400, 500, 1000, 2000]) : r.vybir(N);
  const a10 = plan ? r.chyslo(2, 20) * 10 : naKartiDes(r);
  const sm10 = a10 * n; // справжня довжина в десятих см
  const spravzhnia = plan ? `${des(sm10, 3)} м` : `${km(sm10 / 1000)} км`;
  const vSm = des(sm10, 1);
  const tilkyChyslo = (v: string) => {
    const t = v.replace(/\s/g, '');
    return t === String(n) || t === `1:${n}`;
  };
  return {
    pytannia: `${plan ? 'На плані' : 'На карті'} ${des(a10, 1)} см відповідають ${spravzhnia} на місцевості. Який масштаб ${plan ? 'плану' : 'карти'}?`,
    vyraz: '1 : □',
    vidpovid: `1 : ${ch(n)}`,
    perevirka: tilkyChyslo,
    pidkazka: 'Переведи справжню довжину в сантиметри і поділи на довжину на карті.',
    rozviazok: `${spravzhnia} = ${vSm} см; ${vSm} : ${des(a10, 1)} = ${ch(n)}, тож масштаб 1 : ${ch(n)}.`,
  };
}

function proportsiia(r: Vypadok): TrenZavdannia {
  for (;;) {
    const u10 = r.vybir([5, 10, 15, 20, 25, 30, 40, 50, 75, 100]); // кілометрів в 1 см, у десятих
    const [a, c] = r.rizni(2, 2, 12);
    const d10 = u10 * a;
    if (d10 % 10 !== 0 && r.shans(0.5)) continue;
    return {
      pytannia: `На карті ${a} см відповідають ${des(d10, 1)} км. Скільки кілометрів відповідають ${c} см на цій карті?`,
      vidpovid: des(u10 * c, 1),
      odynytsi: 'км',
      pidkazka: `Пряма пропорційність: ${a} : ${c} = ${des(d10, 1)} : x.`,
      rozviazok: `${a} : ${c} = ${des(d10, 1)} : x; x = ${des(d10, 1)} · ${c} : ${a} = ${des(u10 * c, 1)} (км).`,
    };
  }
}

function dviKarty(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [i, j] = r.rizni(2, 0, N.length - 1);
    const [n1, n2] = [N[i], N[j]];
    const a1 = r.chyslo(2, 16);
    const sm = a1 * n1;
    if ((sm * 10) % n2 !== 0) continue;
    const a2x10 = (sm * 10) / n2; // на другій карті, у десятих см
    if (a2x10 < 5 || a2x10 > 400) continue;
    if (r.shans()) {
      return {
        pytannia: `Відстань між селами на карті з масштабом ${m(n1)} дорівнює ${a1} см. Скільки сантиметрів буде між ними на карті з масштабом ${m(n2)}?`,
        vidpovid: des(a2x10, 1),
        odynytsi: 'см',
        pidkazka: `Спершу справжня відстань: ${a1} · ${ch(n1)} см.`,
        rozviazok: `Насправді: ${a1} · ${ch(n1)} = ${ch(sm)} (см); на другій карті: ${ch(sm)} : ${ch(n2)} = ${des(a2x10, 1)} (см).`,
      };
    }
    const tilkyChyslo = (v: string) => {
      const t = v.replace(/\s/g, '');
      return t === String(n2) || t === `1:${n2}`;
    };
    return {
      pytannia: `Відстань між селами на одній карті ${a1} см, а на іншій — ${des(a2x10, 1)} см. Масштаб першої карти ${m(n1)}. Який масштаб другої?`,
      vyraz: '1 : □',
      vidpovid: `1 : ${ch(n2)}`,
      perevirka: tilkyChyslo,
      pidkazka: `Спершу справжня відстань: ${a1} · ${ch(n1)} см.`,
      rozviazok: `Насправді: ${a1} · ${ch(n1)} = ${ch(sm)} (см); ${ch(sm)} : ${des(a2x10, 1)} = ${ch(n2)}, масштаб 1 : ${ch(n2)}.`,
    };
  }
}

const DRIBNI = ['деталь годинника', 'жук', 'мурашка', 'гвинтик', 'насінина', 'сніжинка'];

function zbilshennia(r: Vypadok): TrenZavdannia {
  const k = r.vybir([2, 4, 5, 8, 10, 20]);
  const shcho = r.vybir(DRIBNI);
  const sprav = r.chyslo(1, 30); // у десятих см (мм)
  const malunok = sprav * k;
  if (r.shans()) {
    return {
      pytannia: `На малюнку в масштабі ${k} : 1 ${shcho} має довжину ${des(malunok, 1)} см. Яка справжня довжина (у см)?`,
      vidpovid: des(sprav, 1),
      odynytsi: 'см',
      pidkazka: `Масштаб ${k} : 1 — малюнок у ${k} разів більший. Поділи на ${k}.`,
      rozviazok: `${des(malunok, 1)} : ${k} = ${des(sprav, 1)} (см)`,
    };
  }
  return {
    pytannia: `${zVelykoi(shcho)} має довжину ${des(sprav, 1)} см. Якою буде довжина на малюнку в масштабі ${k} : 1?`,
    vidpovid: des(malunok, 1),
    odynytsi: 'см',
    pidkazka: `Масштаб ${k} : 1 — малюнок у ${k} разів більший. Помнож на ${k}.`,
    rozviazok: `${des(sprav, 1)} · ${k} = ${des(malunok, 1)} (см)`,
  };
}

export default {
  rivni: ['з карти на місцевість і назад', 'знайди масштаб; пропорція', 'дві карти, масштаб збільшення'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([naMistsevosti, naMistsevosti, naKarti])(r);
    if (riven === 2) return r.vybir([znaityMasshtab, znaityMasshtab, proportsiia, naKarti])(r);
    return r.vybir([dviKarty, dviKarty, zbilshennia, proportsiia])(r);
  },
} satisfies Henerator;
