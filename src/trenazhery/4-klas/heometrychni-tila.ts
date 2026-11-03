// Геометричні тіла: грані, ребра, вершини куба, паралелепіпеда й піраміди; яке це тіло; сума ребер.
import { mnozh, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const TILA = [
  { rod: 'куба', hrani: 6, rebra: 12, vershyny: 8 },
  { rod: 'прямокутного паралелепіпеда', hrani: 6, rebra: 12, vershyny: 8 },
];
const OSNOVY: Record<number, string> = { 3: 'трикутник', 4: 'чотирикутник', 5: "п'ятикутник", 6: 'шестикутник', 8: 'восьмикутник' };
const SHCHO = { hrani: 'граней', rebra: 'ребер', vershyny: 'вершин' } as const;

function kubIParalelepiped(r: Vypadok): TrenZavdannia {
  const t = r.vybir(TILA);
  const shcho = r.vybir(['hrani', 'rebra', 'vershyny'] as const);
  return {
    pytannia: `Скільки ${SHCHO[shcho]} у ${t.rod}?`,
    vidpovid: t[shcho],
    pidkazka:
      shcho === 'rebra' ? 'Рахуй поверхами: 4 ребра зверху, 4 знизу і 4 бічні.' : shcho === 'vershyny' ? 'Кути коробки: 4 зверху і 4 знизу.' : 'Верх, низ і 4 бічні стінки.',
    rozviazok: `У ${t.rod} 6 граней, 12 ребер і 8 вершин.`,
  };
}

function piramida(r: Vypadok): TrenZavdannia {
  const n = r.vybir([3, 4, 5, 6, 8]);
  const shcho = r.vybir(['hrani', 'rebra', 'vershyny'] as const);
  const znach = { hrani: n + 1, rebra: 2 * n, vershyny: n + 1 }[shcho];
  const poyasnennia = {
    hrani: `основа і ${n} бічних трикутників: ${n} + 1 = ${n + 1}`,
    rebra: `${n} ребер в основі і ${n} бічних: ${n} + ${n} = ${2 * n}`,
    vershyny: `${n} вершин основи і верхівка: ${n} + 1 = ${n + 1}`,
  }[shcho];
  return {
    pytannia: `В основі піраміди — ${OSNOVY[n]}. Скільки в неї ${SHCHO[shcho]}?`,
    vidpovid: znach,
    pidkazka: 'Уяви піраміду: основа внизу, а від кожної вершини основи ребро йде до верхівки.',
    rozviazok: zVelykoi(poyasnennia) + '.',
  };
}

const ROZPIZNATY: { opys: string; tilo: string }[] = [
  { opys: 'Не має ні вершин, ні ребер, з усіх боків кругле.', tilo: 'куля' },
  { opys: 'Має дві однакові круглі основи, як консервна банка.', tilo: 'циліндр' },
  { opys: 'Має круглу основу й одну вершину, як ріжок морозива.', tilo: 'конус' },
  { opys: 'Усі 6 граней — однакові квадрати.', tilo: 'куб' },
  { opys: 'Має 6 граней-прямокутників, як коробка з-під взуття.', tilo: 'прямокутний паралелепіпед' },
  { opys: 'Бічні грані — трикутники, що сходяться в одній вершині.', tilo: 'піраміда' },
];

function yakeTilo(r: Vypadok): TrenZavdannia {
  const t = r.vybir(ROZPIZNATY);
  const inshi = r.peremishaty(ROZPIZNATY.filter((x) => x !== t)).slice(0, 2);
  return {
    pytannia: `Яке це тіло? ${t.opys}`,
    vidpovid: t.tilo,
    varianty: r.peremishaty([t.tilo, ...inshi.map((x) => x.tilo)]),
    pidkazka: 'Подумай, на який предмет удома схоже.',
    rozviazok: `${zVelykoi(t.tilo)}: ${t.opys.charAt(0).toLowerCase() + t.opys.slice(1)}`,
  };
}

function sumaReber(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const a = r.chyslo(2, 15);
    return {
      pytannia: `Ребро куба ${a} см. Яка сума довжин усіх його ребер?`,
      vidpovid: 12 * a,
      odynytsi: 'см',
      pidkazka: 'У куба 12 однакових ребер.',
      rozviazok: `${a} · 12 = ${12 * a} (см)`,
    };
  }
  const [a, b, c] = r.rizni(3, 2, 12);
  return {
    pytannia: `Виміри прямокутного паралелепіпеда — ${a} см, ${b} см і ${c} см. Яка сума довжин усіх його ребер?`,
    vidpovid: 4 * (a + b + c),
    odynytsi: 'см',
    pidkazka: 'Ребер кожної довжини — по 4.',
    rozviazok: `(${a} + ${b} + ${c}) · 4 = ${4 * (a + b + c)} (см)`,
  };
}

function skilkyKubykiv(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.chyslo(2, 5), r.chyslo(2, 4), r.chyslo(1, 3)];
  return {
    pytannia: `Із кубиків склали паралелепіпед: ${a} в довжину, ${b} в ширину і ${c} ${mnozh(c, 'шар', 'шари', 'шарів')} у висоту. Скільки кубиків використали?`,
    vidpovid: a * b * c,
    pidkazka: `В одному шарі ${a} · ${b} кубиків.`,
    rozviazok: `${a} · ${b} · ${c} = ${a * b * c}`,
  };
}

export default {
  rivni: ['куб і паралелепіпед', 'піраміди і яке це тіло', 'сума ребер і кубики'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([kubIParalelepiped, yakeTilo, skilkyKubykiv])(r);
    if (riven === 2) return r.vybir([piramida, piramida, yakeTilo, kubIParalelepiped])(r);
    return r.vybir([sumaReber, sumaReber, skilkyKubykiv, piramida])(r);
  },
} satisfies Henerator;
