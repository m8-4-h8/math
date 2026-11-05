// Основні задачі на побудову: яку побудову описано, середина відрізка і половина кута, радіус дуг для серединного
// перпендикуляра (більший за половину), скільки точок дають дві дуги, які відрізки рівні за побудовою, периметри
// фігур з радіусів, поділ відрізка на 2, 4, 8 частин, кути з бісектрис і перпендикуляра, копії кута.
import type { Henerator, Vypadok, TrenZavdannia } from '../dopomoha.ts';
import { pobudova } from '../pobudovy.ts';

const POBUDOVY = ['серединний перпендикуляр', 'бісектриса кута', 'кут, рівний даному', 'перпендикуляр з точки до прямої'];
const OPYSY: string[][] = [
  [
    'З кінців відрізка AB провели дуги одним радіусом, більшим за половину AB. Через дві точки їх перетину провели пряму.',
    'Розхил циркуля більший за половину відрізка. Дуга з центром A, дуга з центром B, пряма через точки перетину дуг.',
  ],
  [
    'Дуга з центром у вершині O перетнула сторони кута в точках A і B. Однакові дуги з центрами A і B перетнулися в точці C. Провели промінь OC.',
    'З вершини кута — дуга до обох сторін. З двох отриманих точок — однакові дуги всередині кута. Промінь з вершини через точку перетину.',
  ],
  [
    'Однакові дуги провели з вершини A даного кута (точки B і C) і з початку O променя (точка D). З центром D провели дугу радіусом BC. Провели промінь з O через точку перетину.',
    'На даному куті й на новому промені — дуги одного радіуса. Циркулем перенесли відстань між точками на сторонах даного кута. Провели промінь.',
  ],
  [
    'З точки P, що не лежить на прямій a, провели дугу, яка перетнула пряму в точках A і B. Тим самим радіусом з центрами A і B провели дуги по інший бік прямої. Пряму провели через P і точку перетину.',
    'Дуга з точки поза прямою дала на прямій дві точки. З них — дві однакові дуги по інший бік прямої. Пряма через дану точку й точку перетину дуг.',
  ],
];
const MALUNKY = ['serednia', 'bisektrysa', 'kut', 'perpZ'] as const;

function shchoBuduiemo(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  const zMalunkom = r.shans(0.4);
  return {
    pytannia: zMalunkom ? 'Що побудовано на малюнку?' : `${r.vybir(OPYSY[typ])} Що побудували?`,
    malunok: zMalunkom ? pobudova({ vyd: MALUNKY[typ], bezVysnovku: true }) : undefined,
    vidpovid: POBUDOVY[typ],
    varianty: POBUDOVY,
    pidkazka: 'Подивись, що даного: відрізок, кут чи пряма з точкою. І що отримали: пряму чи промінь.',
    rozviazok: [
      'Дуги з обох кінців відрізка одним радіусом дають точки, однаково віддалені від A і B, — пряма через них є серединним перпендикуляром.',
      'Дуга з вершини, потім однакові дуги з точок на сторонах: промінь з вершини ділить кут навпіл — це бісектриса.',
      'Однакові дуги на даному куті й на промені та перенесена циркулем відстань дають рівні трикутники — побудовано кут, рівний даному.',
      'Дуга з точки P дає на прямій точки A і B, далі будуємо серединний перпендикуляр до AB — він проходить через P і перпендикулярний до прямої.',
    ][typ],
  };
}

function polovynaVidrizka(r: Vypadok): TrenZavdannia {
  const m = r.chyslo(2, 19);
  const L = 2 * m;
  if (r.shans()) {
    return {
      pytannia: `До відрізка AB = ${L} см побудували серединний перпендикуляр. Він перетнув AB у точці M. Знайди AM.`,
      malunok: r.shans() ? pobudova({ vyd: 'serednia' }) : undefined,
      vidpovid: m,
      odynytsi: 'см',
      pidkazka: 'Серединний перпендикуляр ділить відрізок навпіл.',
      rozviazok: `M — середина AB, тож AM дорівнює ${L} : 2 = ${m} см.`,
    };
  }
  return {
    pytannia: `Серединний перпендикуляр до відрізка AB перетнув його в точці M, AM = ${m} см. Знайди довжину AB.`,
    vidpovid: L,
    odynytsi: 'см',
    pidkazka: 'M — середина AB, тож AB — це дві половини.',
    rozviazok: `AB = AM + MB, де MB = AM. Отже, AB дорівнює ${m} + ${m} = ${L} см.`,
  };
}

function polovynaKuta(r: Vypadok): TrenZavdannia {
  const pol = r.chyslo(12, 75);
  const kut = 2 * pol;
  const alfa = Math.max(kut, 40);
  if (r.shans(0.65)) {
    return {
      pytannia: `Побудували бісектрису OC кута AOB, що дорівнює ${kut}°. Знайди кут AOC.`,
      malunok: r.shans() ? pobudova({ vyd: 'bisektrysa', alfa, pidpysKuta: `${kut}°`, krok: 2 }) : undefined,
      vidpovid: pol,
      odynytsi: '°',
      pidkazka: 'Бісектриса ділить кут навпіл.',
      rozviazok: `Кут AOC дорівнює ${kut}° : 2 = ${pol}°.`,
    };
  }
  return {
    pytannia: `OC — бісектриса кута AOB, побудована циркулем і лінійкою. Кут AOC = ${pol}°. Знайди кут AOB.`,
    vidpovid: kut,
    odynytsi: '°',
    pidkazka: 'Кут AOB складається з двох рівних половин.',
    rozviazok: `Кут AOB дорівнює ${pol}° + ${pol}° = ${kut}°.`,
  };
}

function radius(r: Vypadok): TrenZavdannia {
  const pol = r.chyslo(2, 10);
  const L = 2 * pol;
  const dobryi = pol + r.chyslo(1, 3);
  const malyi = pol - r.chyslo(1, pol - 1);
  const varianty = [malyi, pol, dobryi].map((x) => `${x} см`);
  return {
    pytannia: `Відрізок AB = ${L} см. Яким радіусом треба провести дуги з центрами A і B, щоб побудувати серединний перпендикуляр?`,
    vidpovid: `${dobryi} см`,
    varianty,
    pidkazka: 'Порівняй кожен радіус із половиною відрізка.',
    rozviazok: `Половина відрізка: ${L} : 2 = ${pol} см. Радіус має бути більшим: ${dobryi} см. При ${pol} см дуги лише торкнуться, при ${malyi} см — не перетнуться.`,
  };
}

function skilkyTochok(r: Vypadok): TrenZavdannia {
  const L = r.chyslo(4, 20);
  const typ = r.chyslo(0, 2); // 0 — менший за половину, 1 — рівно половина, 2 — більший
  const rad = typ === 1 && L % 2 === 0 ? L / 2 : typ === 0 ? r.chyslo(1, Math.ceil(L / 2) - 1) : r.chyslo(Math.floor(L / 2) + 1, L + 3);
  const k = 2 * rad > L ? 2 : 2 * rad === L ? 1 : 0;
  const s = `${rad} + ${rad} = ${2 * rad}`;
  return {
    pytannia: `AB = ${L} см. З центрами A і B провели кола однакового радіуса ${rad} см. Скільки спільних точок мають кола?`,
    vidpovid: k,
    pidkazka: 'Порівняй суму радіусів з AB — так само, як для двох кіл.',
    rozviazok:
      k === 2 ? `${s} см — більше за ${L} см: кола перетинаються у двох точках. Через них можна провести серединний перпендикуляр.`
      : k === 1 ? `${s} см — рівно AB: кола дотикаються в одній точці, середині AB. Пряму через одну точку не проведеш.`
      : `${s} см — менше за ${L} см: кола не перетинаються.`,
  };
}

function rivniVidrizky(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 3);
  const dani: [string, string, string[]][] = [
    ['Будуючи бісектрису кута O, провели дугу з центром O (точки A і B), а потім однакові дуги з центрами A і B (точка C). Які відрізки рівні як радіуси першої дуги?', 'OA і OB', ['OA і OB', 'AC і BC', 'OA і AC']],
    ['Будуючи бісектрису кута O, провели дугу з центром O (точки A і B), а потім однакові дуги з центрами A і B (точка C). Які відрізки рівні як радіуси других дуг?', 'AC і BC', ['OA і OB', 'AC і BC', 'OC і AB']],
    ['Будуючи кут, рівний куту A, провели однакові дуги з центрами A і O (точки B, C і D), а потім з центром D дугу радіусом BC (точка E). Який відрізок дорівнює BC?', 'DE', ['OD', 'DE', 'OE']],
    ['Будуючи серединний перпендикуляр до AB, провели дуги одного радіуса з центрами A і B (точки C і D). Який відрізок дорівнює AC?', 'BC', ['BC', 'CD', 'AB']],
  ];
  const [pytannia, vidpovid, varianty] = dani[typ];
  return {
    pytannia,
    malunok: r.shans(0.5) ? pobudova({ vyd: (['bisektrysa', 'bisektrysa', 'kut', 'serednia'] as const)[typ] }) : undefined,
    vidpovid,
    varianty: r.peremishaty(varianty),
    pidkazka: 'Радіуси однієї дуги (або однакових дуг) рівні. Знайди, з якого центру проведено кожну дугу.',
    rozviazok: [
      'A і B лежать на одній дузі з центром O, тож OA = OB.',
      'Дуги з центрами A і B однакові, а C лежить на обох, тож AC = BC.',
      'Дуга з центром D має радіус BC, а E лежить на ній, тож DE = BC.',
      'Дуги з центрами A і B мають один радіус, C лежить на обох, тож BC = AC.',
    ][typ],
  };
}

function perymetr(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const rad = r.chyslo(3, 15);
    return {
      pytannia: `Будуючи серединний перпендикуляр до AB, провели дуги радіусом ${rad} см з центрами A і B. Вони перетнулися в точках C і D. Знайди периметр чотирикутника ACBD.`,
      malunok: r.shans() ? pobudova({ vyd: 'serednia', dovedennia: true }) : undefined,
      vidpovid: 4 * rad,
      odynytsi: 'см',
      pidkazka: 'Усі чотири сторони — радіуси однакових дуг.',
      rozviazok: `AC = BC = AD = BD = ${rad} см. Периметр: ${rad} · 4 = ${4 * rad} см.`,
    };
  }
  const a = r.chyslo(2, 9);
  const b = r.chyslo(a + 1, a + 8);
  return {
    pytannia: `Будуючи бісектрису кута O, провели дугу радіусом ${a} см з центром O (точки A і B на сторонах), а потім дуги радіусом ${b} см з центрами A і B (точка C). Знайди периметр чотирикутника OACB.`,
    vidpovid: 2 * (a + b),
    odynytsi: 'см',
    pidkazka: 'OA = OB — радіуси першої дуги, AC = BC — радіуси других дуг.',
    rozviazok: `OA = OB = ${a} см, AC = BC = ${b} см. Периметр: ${a} + ${b} + ${b} + ${a} = ${2 * (a + b)} см.`,
  };
}

function podil(r: Vypadok): TrenZavdannia {
  const n = r.vybir([2, 4, 8]);
  const chastyna = r.chyslo(1, n === 8 ? 6 : 12);
  const L = n * chastyna;
  const raziv = n - 1;
  const etapy = n === 2 ? '1' : n === 4 ? '1 + 2' : '1 + 2 + 4';
  if (r.shans()) {
    return {
      pytannia: `Відрізок ${L} см треба поділити побудовою на ${n} рівні частини, щоразу ділячи навпіл. Скільки разів доведеться будувати серединний перпендикуляр?`.replace('8 рівні', '8 рівних'),
      vidpovid: raziv,
      pidkazka: 'Спершу навпіл увесь відрізок, потім кожну з отриманих частин.',
      rozviazok: n === 2 ? 'Достатньо одного серединного перпендикуляра: він дає середину відрізка.' : `Кожен поділ навпіл подвоює кількість частин. Побудов: ${etapy} = ${raziv}.`,
    };
  }
  return {
    pytannia: `Відрізок ${L} см поділили побудовою на ${n} рівні частини, щоразу ділячи навпіл. Знайди довжину однієї частини.`.replace('8 рівні', '8 рівних'),
    vidpovid: chastyna,
    odynytsi: 'см',
    pidkazka: `Частин ${n}, і всі однакові.`,
    rozviazok: `${L} : ${n} = ${chastyna} см.`,
  };
}

function bisektrysy(r: Vypadok): TrenZavdannia {
  const x = 4 * r.chyslo(8, 40);
  const typ = r.chyslo(0, 2);
  const umova = `OC — бісектриса кута AOB = ${x}°, а OD — бісектриса кута AOC.`;
  if (typ === 0) {
    return {
      pytannia: `${umova} Знайди кут AOD.`,
      vidpovid: x / 4,
      odynytsi: '°',
      pidkazka: 'Двічі поділи навпіл.',
      rozviazok: `Кут AOC дорівнює ${x}° : 2 = ${x / 2}°, кут AOD дорівнює ${x / 2}° : 2 = ${x / 4}°.`,
    };
  }
  if (typ === 1) {
    return {
      pytannia: `${umova} Знайди кут DOB.`,
      vidpovid: (3 * x) / 4,
      odynytsi: '°',
      pidkazka: 'Кут DOB складається з кутів DOC і COB.',
      rozviazok: `Кут COB дорівнює ${x}° : 2 = ${x / 2}°, кут DOC дорівнює ${x / 2}° : 2 = ${x / 4}°. Кут DOB дорівнює ${x / 4}° + ${x / 2}° = ${(3 * x) / 4}°.`,
    };
  }
  return {
    pytannia: `Кут AOB = ${x}°, OC — його бісектриса, промінь OE — продовження променя OA за точку O. Знайди кут COE.`,
    vidpovid: 180 - x / 2,
    odynytsi: '°',
    pidkazka: 'Кут AOE розгорнутий — 180°.',
    rozviazok: `Кут AOC дорівнює ${x}° : 2 = ${x / 2}°. Кути AOC і COE суміжні, тож кут COE дорівнює 180° − ${x / 2}° = ${180 - x / 2}°.`,
  };
}

function perpendykuliar(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    return {
      pytannia: 'Через точку M на прямій AB побудували перпендикуляр MC, а потім бісектрису MK кута CMB. Знайди кут AMK.',
      vidpovid: 135,
      odynytsi: '°',
      pidkazka: 'Кут AMC прямий, а кут CMK — половина прямого.',
      rozviazok: 'Кут CMK дорівнює 90° : 2 = 45°. Кут AMK дорівнює 90° + 45° = 135°.',
    };
  }
  const a = r.chyslo(1, 8) * 10;
  if (typ === 1) {
    return {
      pytannia: `Через точку M на прямій AB побудували перпендикуляр MC. Промінь MK лежить між MC і MB, кут CMK = ${a}°. Знайди кут KMB.`,
      vidpovid: 90 - a,
      odynytsi: '°',
      pidkazka: 'Кут CMB прямий.',
      rozviazok: `Кут KMB дорівнює 90° − ${a}° = ${90 - a}°.`,
    };
  }
  const b = 2 * r.chyslo(5, 44);
  return {
    pytannia: `Через точку M на прямій AB побудували перпендикуляр MC. Промінь MK лежить між MC і MB, кут KMB = ${b}°. Побудували бісектрису MN кута CMK. Знайди кут CMN.`,
    vidpovid: (90 - b) / 2,
    odynytsi: '°',
    pidkazka: 'Спершу знайди кут CMK, потім поділи його навпіл.',
    rozviazok: `Кут CMK дорівнює 90° − ${b}° = ${90 - b}°, кут CMN дорівнює ${90 - b}° : 2 = ${(90 - b) / 2}°.`,
  };
}

function kopiiKuta(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(15, 85);
  if (r.shans()) {
    return {
      pytannia: `Від променя OB по інший бік від OA побудували кут BOC, рівний куту AOB = ${x}°. Знайди кут AOC.`,
      malunok: r.shans() ? pobudova({ vyd: 'kut', alfa: Math.min(Math.max(x, 35), 75), pidpysKuta: `${x}°` }) : undefined,
      vidpovid: 2 * x,
      odynytsi: '°',
      pidkazka: 'Кут AOC складається з двох однакових кутів.',
      rozviazok: `Кут AOC дорівнює ${x}° + ${x}° = ${2 * x}°.`,
    };
  }
  const n = r.chyslo(3, 5);
  const y = r.chyslo(10, Math.floor(179 / n));
  return {
    pytannia: `Від одного променя по черзі відклали ${n} ${n === 5 ? 'кутів, рівних' : 'кути, рівні'} даному куту ${y}°, кожен — поруч із попереднім. Який кут утворили крайні промені?`,
    vidpovid: n * y,
    odynytsi: '°',
    pidkazka: 'Кути йдуть поруч, тож їхні величини додаються.',
    rozviazok: `${y}° · ${n} = ${n * y}°.`,
  };
}

export default {
  rivni: ['яка побудова, середина й половина кута', 'радіус дуг і рівні відрізки', 'задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([shchoBuduiemo, shchoBuduiemo, polovynaVidrizka, polovynaKuta])(r);
    if (riven === 2) return r.vybir([radius, skilkyTochok, rivniVidrizky, perymetr])(r);
    return r.vybir([podil, bisektrysy, bisektrysy, perpendykuliar, kopiiKuta])(r);
  },
} satisfies Henerator;
