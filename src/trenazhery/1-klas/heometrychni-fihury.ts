// Геометричні фігури: лічба фігур у ряду, вершини й сторони, яка фігура.
import { mnozh, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const vershyn = (n: number) => `${n} ${mnozh(n, 'вершина', 'вершини', 'вершин')}`;

const FIHURY = [
  { znak: '🔺', nazva: 'трикутників', odna: 'трикутник', vershyn: 3 },
  { znak: '🟦', nazva: 'квадратів', odna: 'квадрат', vershyn: 4 },
  { znak: '🟡', nazva: 'кругів', odna: 'круг', vershyn: 0 },
];
const VERSHYNY = [
  { odna: 'трикутник', rod: 'трикутника', vershyn: 3 },
  { odna: 'квадрат', rod: 'квадрата', vershyn: 4 },
  { odna: 'прямокутник', rod: 'прямокутника', vershyn: 4 },
  { odna: "п'ятикутник", rod: "п'ятикутника", vershyn: 5 },
  { odna: 'круг', rod: 'круга', vershyn: 0 },
];

function lichba(r: Vypadok, dovzhyna: number): TrenZavdannia {
  const riad = Array.from({ length: dovzhyna }, () => r.vybir(FIHURY));
  const shukaiemo = r.vybir(riad);
  const n = riad.filter((f) => f === shukaiemo).length;
  return {
    pytannia: `Скільки тут ${shukaiemo.nazva}?`,
    vyraz: riad.map((f) => f.znak).join(' '),
    vidpovid: n,
    pidkazka: `Торкайся лише фігур ${shukaiemo.znak} і рахуй.`,
    rozviazok: `${shukaiemo.znak} — ${n}.`,
  };
}

function vershyny(r: Vypadok): TrenZavdannia {
  const f = r.vybir(VERSHYNY);
  const shcho = r.vybir(['вершин', 'сторін', 'кутів']);
  return {
    pytannia: `Скільки ${shcho} у ${f.rod}?`,
    vidpovid: f.vershyn,
    pidkazka: f.vershyn ? 'Скільки вершин — стільки й сторін і кутів.' : 'Чи є в нього кути?',
    rozviazok: f.vershyn ? `У ${f.rod} ${vershyn(f.vershyn)}, стільки ж сторін і кутів.` : 'Круг не має ні вершин, ні сторін, ні кутів.',
  };
}

function yakaFihura(r: Vypadok): TrenZavdannia {
  const varianty = r.peremishaty(['трикутник', r.vybir(['квадрат', 'прямокутник']), "п'ятикутник", 'круг']);
  const pravylna = r.vybir(varianty);
  const n = VERSHYNY.find((f) => f.odna === pravylna)!.vershyn;
  return {
    pytannia: n ? `У якої фігури ${vershyn(n)}?` : 'У якої фігури немає жодної вершини?',
    vidpovid: pravylna,
    varianty,
    pidkazka: 'Уяви фігуру і порахуй її кути.',
    rozviazok: n ? `${zVelykoi(pravylna)} має ${vershyn(n)}.` : 'Круг — без вершин і кутів.',
  };
}

function razom(r: Vypadok): TrenZavdannia {
  const a = r.vybir(VERSHYNY.filter((f) => f.vershyn));
  const b = r.vybir(VERSHYNY.filter((f) => f.vershyn && f.vershyn + a.vershyn <= 10));
  const odnakovi = a === b;
  return {
    pytannia: odnakovi
      ? `Скільки вершин разом у двох ${a.odna}ів?`
      : `Скільки вершин разом у ${a.rod} і ${b.rod}?`,
    vidpovid: a.vershyn + b.vershyn,
    pidkazka: 'Порахуй вершини кожної фігури й додай.',
    rozviazok: `${a.vershyn} + ${b.vershyn} = ${a.vershyn + b.vershyn}`,
  };
}

export default {
  rivni: ['лічба фігур', 'вершини, сторони і яка це фігура', 'вершини кількох фігур разом'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.7) ? lichba(r, r.chyslo(4, 6)) : vershyny(r);
    if (riven === 2) return r.vybir([() => lichba(r, r.chyslo(6, 9)), () => vershyny(r), () => yakaFihura(r)])();
    return r.vybir([() => razom(r), () => yakaFihura(r), () => lichba(r, r.chyslo(8, 10))])();
  },
} satisfies Henerator;
