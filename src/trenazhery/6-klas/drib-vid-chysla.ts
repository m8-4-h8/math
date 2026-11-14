// Знаходження дробу від числа (Істер § 10): множимо число на дріб — від натурального числа, від дробу, від мішаного
// числа, дріб більший за 1; задачі у дві дії («2/3 дівчат» — від кількості дівчат).
import { ch, nsd, skilky, tdrib, tvidpovidDrib, vidpovidDrib, rivnyiDrib, neskorotnyiChyselnyk, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

function vidNaturalnoho(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(3, 12);
  const m = neskorotnyiChyselnyk(r, n);
  const a = n * r.chyslo(2, 15);
  const x = (a / n) * m;
  return {
    pytannia: `Знайди $${tdrib(m, n)}$ від ${ch(a)}.`,
    vidpovid: x,
    pidkazka: `Помнож ${ch(a)} на $${tdrib(m, n)}$: поділи на ${n} і помнож на ${m}.`,
    rozviazok: `$${a} \\cdot ${tdrib(m, n)} = \\frac{${a} \\cdot ${m}}{${n}} = ${x}$`,
  };
}

function vidDrobu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [n, d] = r.rizni(2, 2, 10);
    const [m, c] = [neskorotnyiChyselnyk(r, n), neskorotnyiChyselnyk(r, d)];
    const [chys, znam] = [m * c, n * d];
    if (nsd(chys, znam) === 1 && r.shans(0.6)) continue; // частіше — зі скороченням
    return {
      pytannia: `Знайди $${tdrib(m, n)}$ від $${tdrib(c, d)}$. Відповідь скороти.`,
      vidpovid: vidpovidDrib(chys, znam),
      pokaz: `$${tvidpovidDrib(chys, znam)}$`,
      perevirka: rivnyiDrib(chys, znam),
      pidkazka: `Помнож $${tdrib(c, d)}$ на $${tdrib(m, n)}$.`,
      rozviazok: `$${tdrib(c, d)} \\cdot ${tdrib(m, n)} = ${tdrib(chys, znam)}${nsd(chys, znam) > 1 ? ` = ${tvidpovidDrib(chys, znam)}` : ''}$`,
    };
  }
}

function vidMishanoho(r: Vypadok): TrenZavdannia {
  for (;;) {
    const d = r.chyslo(2, 6);
    const c = neskorotnyiChyselnyk(r, d);
    const t = r.chyslo(1, 5);
    const n = r.chyslo(2, 9);
    const m = neskorotnyiChyselnyk(r, n);
    const vsoho = t * d + c;
    const [chys, znam] = [vsoho * m, d * n];
    if (nsd(chys, znam) === 1) continue; // нехай буде що скоротити
    return {
      pytannia: `Знайди $${tdrib(m, n)}$ від $${t}${tdrib(c, d)}$.`,
      vidpovid: vidpovidDrib(chys, znam),
      pokaz: `$${tvidpovidDrib(chys, znam)}$`,
      perevirka: rivnyiDrib(chys, znam),
      pidkazka: `Спершу запиши $${t}${tdrib(c, d)}$ неправильним дробом: $${tdrib(vsoho, d)}$.`,
      rozviazok: `$${tdrib(vsoho, d)} \\cdot ${tdrib(m, n)} = ${tdrib(chys, znam)} = ${tvidpovidDrib(chys, znam)}$`,
    };
  }
}

function bilsheOdnoho(r: Vypadok): TrenZavdannia {
  const n = r.chyslo(2, 6);
  const t = 1;
  const m = neskorotnyiChyselnyk(r, n);
  const a = n * r.chyslo(2, 12);
  const vsoho = t * n + m;
  const x = (a / n) * vsoho;
  return {
    pytannia: `Знайди $${t}${tdrib(m, n)}$ від ${a}.`,
    vidpovid: x,
    pidkazka: `$${t}${tdrib(m, n)} = ${tdrib(vsoho, n)}$ — більше за 1, тож відповідь буде більшою за ${a}.`,
    rozviazok: `$${a} \\cdot ${tdrib(vsoho, n)} = \\frac{${a} \\cdot ${vsoho}}{${n}} = ${x}$`,
  };
}

const DVI_DII: { tekst: (a: number, d1: string, d2: string) => string }[] = [
  { tekst: (a, d1, d2) => `У класі ${skilky(a, 'учень', 'учні', 'учнів')}, ${d1} з них — дівчата, а ${d2} дівчат займаються танцями. Скільки дівчат займаються танцями?` },
  { tekst: (a, d1, d2) => `У бібліотеці ${skilky(a, 'книжка', 'книжки', 'книжок')}, ${d1} з них — казки, а ${d2} казок — українські. Скільки українських казок?` },
  { tekst: (a, d1, d2) => `Площа саду ${a} м². ${d1} саду займають яблуні, а ${d2} цієї ділянки — молоді яблуні. Яку площу займають молоді яблуні?` },
];

function dviDii(r: Vypadok): TrenZavdannia {
  for (;;) {
    const n1 = r.chyslo(3, 9);
    const m1 = neskorotnyiChyselnyk(r, n1);
    const n2 = r.chyslo(2, 6);
    const m2 = neskorotnyiChyselnyk(r, n2);
    const a = n1 * n2 * r.chyslo(1, 6);
    if (a < 12 || a > 600) continue;
    const pershe = (a / n1) * m1;
    if (pershe % n2) continue;
    const druhe = (pershe / n2) * m2;
    const z = r.vybir(DVI_DII);
    return {
      pytannia: z.tekst(a, `$${tdrib(m1, n1)}$`, `$${tdrib(m2, n2)}$`),
      vidpovid: druhe,
      pidkazka: `Спершу знайди $${tdrib(m1, n1)}$ від ${a}, а потім $${tdrib(m2, n2)}$ від результату.`,
      rozviazok: `$${a} \\cdot ${tdrib(m1, n1)} = ${pershe}$; $\\;${pershe} \\cdot ${tdrib(m2, n2)} = ${druhe}$`,
    };
  }
}

const ZADACHI: { tekst: (a: number, d: string) => string; odynytsi: string; maks: number }[] = [
  { tekst: (a, d) => `Дорога має довжину ${a} км. Заасфальтували ${d} дороги. Скільки кілометрів заасфальтували?`, odynytsi: 'км', maks: 40 },
  { tekst: (a, d) => `У бідоні ${a} л молока. Відлили ${d} молока. Скільки літрів відлили?`, odynytsi: 'л', maks: 20 },
  { tekst: (a, d) => `Кавун важить ${a} кг. З'їли ${d} кавуна. Скільки кілограмів з'їли?`, odynytsi: 'кг', maks: 12 },
];

function zadacha(r: Vypadok): TrenZavdannia {
  const z = r.vybir(ZADACHI);
  const n = r.vybir([4, 5, 8, 10]);
  const m = neskorotnyiChyselnyk(r, n);
  const a = r.chyslo(3, z.maks);
  const [chys, znam] = [a * m, n];
  return {
    pytannia: z.tekst(a, `$${tdrib(m, n)}$`),
    vidpovid: vidpovidDrib(chys, znam),
    pokaz: `$${tvidpovidDrib(chys, znam)}$`,
    perevirka: rivnyiDrib(chys, znam),
    odynytsi: z.odynytsi,
    pidkazka: `Помнож ${a} на $${tdrib(m, n)}$.`,
    rozviazok: `$${a} \\cdot ${tdrib(m, n)} = ${tdrib(chys, znam)}${nsd(chys, znam) > 1 || chys > znam ? ` = ${tvidpovidDrib(chys, znam)}` : ''}$ (${z.odynytsi})`,
  };
}

export default {
  rivni: ['дріб від натурального числа', 'дріб від дробу і від мішаного числа', 'задачі, дріб більший за 1'],
  zavdannia(r, riven) {
    if (riven === 1) return vidNaturalnoho(r);
    if (riven === 2) return r.vybir([vidDrobu, vidDrobu, vidMishanoho])(r);
    return r.vybir([dviDii, dviDii, zadacha, bilsheOdnoho])(r);
  },
} satisfies Henerator;
