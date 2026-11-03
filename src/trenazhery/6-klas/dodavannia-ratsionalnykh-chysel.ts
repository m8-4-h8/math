// Додавання і віднімання раціональних чисел: однакові знаки — додаємо модулі, знак спільний; різні —
// від більшого модуля віднімаємо менший, знак від числа з більшим модулем; віднімання — додавання
// протилежного; десяткові дроби; вирази з модулями.
import { ch, des, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const tz = (n: number) => (n < 0 ? `-${-n}` : `${n}`);
const vDuzhkakh = (n: number) => (n < 0 ? `(${tz(n)})` : `${n}`);

function dodaty(r: Vypadok, max: number): TrenZavdannia {
  const [a, b] = [r.krim(-max, max, [0]), r.krim(-max, max, [0])];
  if (a > 0 && b > 0) return dodaty(r, max);
  const s = a + b;
  const odnakovi = a < 0 === b < 0;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tz(a)} + ${vDuzhkakh(b)} =$`,
    vidpovid: ch(s),
    pidkazka: odnakovi
      ? 'Знаки однакові: додай модулі й залиш спільний знак.'
      : 'Знаки різні: від більшого модуля відніми менший, знак — від числа з більшим модулем.',
    rozviazok: odnakovi
      ? `${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(s)}, знак «−»: ${ch(s)}`
      : `${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(s)}, знак від ${ch(Math.abs(a) > Math.abs(b) ? a : b)}: ${ch(s)}`,
  };
}

function vidniaty(r: Vypadok, max: number): TrenZavdannia {
  const [a, b] = [r.chyslo(-max, max), r.krim(-max, max, [0])];
  const s = a - b;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tz(a)} - ${vDuzhkakh(b)} =$`,
    vidpovid: ch(s),
    pidkazka: `Відняти ${ch(b)} — те саме, що додати ${ch(-b)}.`,
    rozviazok: `${ch(a)} − ${b < 0 ? `(${ch(b)})` : b} = ${ch(a)} + ${-b < 0 ? `(${ch(-b)})` : -b} = ${ch(s)}`,
  };
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.krim(-99, 99, [0]), r.krim(-99, 99, [0])];
  const plius = r.shans();
  const s = plius ? a + b : a - b;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tdes(a, 1)} ${plius ? '+' : '-'} ${b < 0 ? `(${tdes(b, 1)})` : tdes(b, 1)} =$`,
    vidpovid: des(s, 1),
    pidkazka: plius ? 'Порівняй знаки доданків.' : 'Заміни віднімання додаванням протилежного числа.',
    rozviazok: `${des(a, 1)} ${plius ? '+' : '−'} ${b < 0 ? `(${des(b, 1)})` : des(b, 1)} = ${des(s, 1)}`,
  };
}

function tryDodanky(r: Vypadok): TrenZavdannia {
  const [a, b, c] = [r.krim(-20, 20, [0]), r.krim(-20, 20, [0]), r.krim(-20, 20, [0])];
  const [z1, z2] = [r.shans(), r.shans()];
  const ab = z1 ? a + b : a - b;
  const s = z2 ? ab + c : ab - c;
  return {
    pytannia: 'Обчисли.',
    vyraz: `$${tz(a)} ${z1 ? '+' : '-'} ${vDuzhkakh(b)} ${z2 ? '+' : '-'} ${vDuzhkakh(c)} =$`,
    vidpovid: ch(s),
    pidkazka: 'Рахуй зліва направо, кожне віднімання заміни додаванням протилежного.',
    rozviazok: `${ch(a)} ${z1 ? '+' : '−'} ${b < 0 ? `(${ch(b)})` : b} = ${ch(ab)}; ${ch(ab)} ${z2 ? '+' : '−'} ${c < 0 ? `(${ch(c)})` : c} = ${ch(s)}`,
  };
}

function moduli(r: Vypadok): TrenZavdannia {
  const [a, b] = [r.krim(-20, 20, [0]), r.krim(-20, 20, [0])];
  const s = Math.abs(a) - Math.abs(b);
  return {
    pytannia: 'Обчисли.',
    vyraz: `$|${tz(a)}| - |${tz(b)}| =$`,
    vidpovid: ch(s),
    pidkazka: `Спершу модулі: |${ch(a)}| = ${Math.abs(a)}, |${ch(b)}| = ${Math.abs(b)}.`,
    rozviazok: `${Math.abs(a)} − ${Math.abs(b)} = ${ch(s)}`,
  };
}

export default {
  rivni: ['додаємо числа з різними знаками', 'віднімаємо', 'десяткові дроби, три доданки, модулі'],
  zavdannia(r, riven) {
    if (riven === 1) return dodaty(r, 15);
    if (riven === 2) return r.shans(0.7) ? vidniaty(r, 20) : dodaty(r, 50);
    return r.vybir([desiatkovi, tryDodanky, tryDodanky, moduli])(r);
  },
} satisfies Henerator;
