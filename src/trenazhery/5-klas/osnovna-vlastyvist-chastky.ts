// Основна властивість частки (Скворцова, 5 клас, с. 90–92): a : b = (a · c) : (b · c) = (a : k) : (b : k).
// Ділення круглих чисел (відкидаємо однакову кількість нулів), ділення на 5 і 25 через 10 і 100, невідоме в
// рівності двох часток, «чи зміниться частка», остача при відкиданні нулів, задачі.
import { ch, mnozh, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const nuli = (k: number) => 10 ** k;

/** 85 000 : 17 000 = 85 : 17 = 5 — дільник із нулями, ділене з тією самою або більшою кількістю нулів. */
function kruhli(r: Vypadok, riznaKilkist: boolean): TrenZavdannia {
  const d = r.krim(2, 19, [10]);
  const q = r.krim(2, 19, [10]);
  const k = r.chyslo(1, 4); // скільки нулів у дільнику
  const dodatkovi = riznaKilkist ? r.chyslo(1, 2) : 0; // ділене має ще стільки нулів
  const a = d * q * nuli(k + dodatkovi);
  const b = d * nuli(k);
  const v = a / b;
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `${ch(a)} : ${ch(b)} =`,
    vidpovid: v,
    pidkazka: `Відкинь у діленому й дільнику однаково — по ${k} ${k === 1 ? 'нулю' : 'нулі'}.`,
    rozviazok: `${ch(a)} : ${ch(b)} = ${ch(a / nuli(k))} : ${d} = ${ch(v)}`,
  };
}

/** 72 000 : 9000 = 72 : □ */
function vikontse(r: Vypadok): TrenZavdannia {
  const d = r.krim(2, 9, [5]);
  const q = r.chyslo(2, 12);
  const k = r.chyslo(2, 4);
  const a = d * q * nuli(k);
  const b = d * nuli(k);
  const malenke = r.chyslo(1, k - 1); // скільки нулів залишаємо
  const a2 = a / nuli(k - malenke);
  const b2 = b / nuli(k - malenke);
  return r.shans()
    ? {
        pytannia: 'Яке число у віконці?',
        vyraz: `${ch(a)} : ${ch(b)} = ${ch(a2)} : □`,
        vidpovid: b2,
        pidkazka: `Ділене поділили на ${ch(nuli(k - malenke))}. Так само поділи дільник.`,
        rozviazok: `${ch(b)} : ${ch(nuli(k - malenke))} = ${ch(b2)}; перевірка: ${ch(a)} : ${ch(b)} = ${q} і ${ch(a2)} : ${ch(b2)} = ${q}`,
      }
    : {
        pytannia: 'Яке число у віконці?',
        vyraz: `${ch(a)} : ${ch(b)} = □ : ${ch(b2)}`,
        vidpovid: a2,
        pidkazka: `Дільник поділили на ${ch(nuli(k - malenke))}. Так само поділи ділене.`,
        rozviazok: `${ch(a)} : ${ch(nuli(k - malenke))} = ${ch(a2)}; перевірка: ${ch(a2)} : ${ch(b2)} = ${q}`,
      };
}

/** 135 : 5 = 270 : 10; 700 : 25 = 2800 : 100; 3000 : 125 = 24 000 : 1000. */
function na5i25(r: Vypadok): TrenZavdannia {
  const [d, m] = r.vybir([[5, 2], [5, 2], [25, 4], [25, 4], [50, 2], [125, 8]] as [number, number][]);
  const q = d === 5 ? r.chyslo(13, 99) : d === 125 ? r.chyslo(3, 40) : r.chyslo(11, 60);
  const a = d * q;
  return {
    pytannia: 'Обчисли зручно.',
    vyraz: `${ch(a)} : ${d} =`,
    vidpovid: q,
    pidkazka: `Помнож ділене й дільник на ${m}: дільник стане ${d * m}.`,
    rozviazok: `${ch(a)} : ${d} = ${ch(a * m)} : ${d * m} = ${ch(q)}`,
  };
}

/** 56 : 8 = 28 : k; a : 4 = 72 : 8. */
function bukva(r: Vypadok): TrenZavdannia {
  const q = r.chyslo(2, 9);
  const b = r.chyslo(2, 9);
  const m = r.krim(2, 6, [b]);
  const [a1, b1, a2, b2] = [q * b * m, b * m, q * b, b]; // a1 : b1 = a2 : b2
  const bukva = r.vybir(['k', 'a', 'p']);
  const typ = r.chyslo(0, 3);
  // Ліва частина — велика або мала; невідоме — у правій частині (ділене чи дільник).
  const [l1, l2, p1, p2] = typ < 2 ? [a1, b1, a2, b2] : [a2, b2, a1, b1];
  const shukaiemoDilene = typ % 2 === 1;
  const vidpovid = shukaiemoDilene ? p1 : p2;
  const pravaZapys = shukaiemoDilene ? `${bukva} : ${p2}` : `${p1} : ${bukva}`;
  const raz = `${m} ${mnozh(m, 'раз', 'рази', 'разів')}`;
  const zmina = typ < 2 ? 'зменшили' : 'збільшили';
  return {
    pytannia: `Знайди $${bukva}$, щоб рівність була правильною.`,
    vyraz: `$${l1} : ${l2} = ${pravaZapys}$`,
    vidpovid,
    pidkazka: shukaiemoDilene
      ? `Дільник ${l2} ${zmina} в ${raz}. Так само зміни ділене.`
      : `Ділене ${l1} ${zmina} в ${raz}. Так само зміни дільник.`,
    rozviazok: `${l1} : ${l2} = ${q}, тож $${bukva} = ${vidpovid}$. Перевірка: ${p1} : ${p2} = ${q}`,
  };
}

/** Чи зміниться частка, якщо… — додати/відняти змінює, помножити/поділити — ні. */
function chyZminytsia(r: Vypadok): TrenZavdannia {
  const dia = r.vybir(['додати', 'відняти', 'помножити на', 'поділити на'] as const);
  // Для ділення дільник беремо 4, 6, 8, 9 — щоб після ділення на 2 чи 3 він не став одиницею.
  const b = dia === 'поділити на' ? r.vybir([4, 6, 8, 9]) : r.chyslo(2, 9);
  const q = r.chyslo(2, 9);
  const a = b * q;
  const c = r.chyslo(2, 5);
  const dilnyk = b % 2 === 0 ? 2 : 3;
  const ch_ = dia === 'поділити на' ? dilnyk : c;
  const [a2, b2] =
    dia === 'додати' ? [a + c, b + c] : dia === 'відняти' ? [a - c, b - c] : dia === 'помножити на' ? [a * c, b * c] : [a / dilnyk, b / dilnyk];
  if (b2 <= 0) return chyZminytsia(r);
  const zminytsia = a2 / b2 !== q;
  const slova = dia === 'додати' ? `до діленого й до дільника додати ${ch_}` : dia === 'відняти' ? `від діленого й від дільника відняти ${ch_}` : `ділене й дільник ${dia} ${ch_}`;
  return {
    pytannia: `Чи зміниться частка $${a} : ${b}$, якщо ${slova}?`,
    vidpovid: zminytsia ? 'Так' : 'Ні',
    varianty: ['Так', 'Ні'],
    pidkazka: 'Частка не змінюється лише тоді, коли обидва числа множать або ділять на одне число.',
    rozviazok: zminytsia
      ? `Так: ${a} : ${b} = ${q}, а ${a2} : ${b2} ${Number.isInteger(a2 / b2) ? `= ${a2 / b2}` : `— не ${q}, бо ${b2} · ${q} = ${b2 * q}`}.`
      : `Ні: ${a} : ${b} = ${q} і ${a2} : ${b2} = ${q}.`,
  };
}

/** 850 : 200 = 4 (ост. 50) → 85 : 20 = 4 (ост. 5): частка та сама, остача менша. */
function ostacha(r: Vypadok): TrenZavdannia {
  for (;;) {
    const b = r.chyslo(2, 9) * 10;
    const q = r.chyslo(2, 9);
    const o = r.chyslo(1, b / 10 - 1) * 10;
    const a = b * q + o;
    if (a >= 1000) continue;
    const typ = r.shans();
    return typ
      ? {
          pytannia: `Обчисли $${a / 10} : ${b / 10}$ з остачею. Яка остача?`,
          vidpovid: o / 10,
          pidkazka: `Скористайся тим, що ${a} : ${b} = ${q} (ост. ${o}). Але остача теж зменшиться в 10 разів.`,
          rozviazok: `${a / 10} : ${b / 10} = ${q} (ост. ${o / 10}), бо ${b / 10} · ${q} + ${o / 10} = ${a / 10}.`,
        }
      : {
          pytannia: `${a / 10} : ${b / 10} = ${q} (ост. ${o / 10}). Яка остача при діленні $${a} : ${b}$?`,
          vidpovid: o,
          pidkazka: 'Ділене й дільник збільшили в 10 разів. Частка та сама, а остача?',
          rozviazok: `${a} : ${b} = ${q} (ост. ${o}), бо ${b} · ${q} + ${o} = ${a}.`,
        };
  }
}

/** Купюри, переліт, рейси — ділення круглих чисел у задачах. */
function zadacha(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 2);
  if (typ === 0) {
    const kupiura = r.vybir([200, 500, 1000]);
    const n = r.chyslo(12, 90);
    const suma = kupiura * n;
    return {
      pytannia: `Скільки купюр по ${kupiura} грн у сумі ${ch(suma)} грн?`,
      vidpovid: n,
      pidkazka: 'Відкинь однакову кількість нулів у сумі й у купюрі.',
      rozviazok: `${ch(suma)} : ${kupiura} = ${ch(suma / 100)} : ${kupiura / 100} = ${n}`,
    };
  }
  if (typ === 1) {
    const v = r.vybir([600, 700, 800, 900]);
    const t = r.chyslo(2, 12);
    const s = v * t;
    return {
      pytannia: `Літак пролетів ${ch(s)} км зі швидкістю ${v} км/год. Скільки годин тривав політ?`,
      vidpovid: t,
      odynytsi: 'год',
      pidkazka: 'Час = відстань : швидкість. Відкинь по два нулі.',
      rozviazok: `${ch(s)} : ${v} = ${ch(s / 100)} : ${v / 100} = ${t} (год)`,
    };
  }
  const vantazh = r.vybir([10, 20, 30]);
  const reisiv = r.chyslo(6, 40);
  const usoho = vantazh * reisiv;
  return {
    pytannia: `Вантажівка за рейс перевозить ${vantazh} т зерна. Скільки рейсів треба, щоб перевезти ${ch(usoho)} т?`,
    vidpovid: reisiv,
    pidkazka: 'Відкинь однакову кількість нулів у діленому й дільнику.',
    rozviazok: `${ch(usoho)} : ${vantazh} = ${ch(usoho / 10)} : ${vantazh / 10} = ${reisiv}`,
  };
}

export default {
  rivni: ['круглі числа: відкидаємо нулі', 'ділення на 5 і 25, невідоме в рівності', 'остача, «чи зміниться», задачі'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([(x: Vypadok) => kruhli(x, false), (x: Vypadok) => kruhli(x, false), vikontse])(r);
    if (riven === 2) return r.vybir([na5i25, na5i25, bukva, (x: Vypadok) => kruhli(x, true)])(r);
    return r.vybir([ostacha, chyZminytsia, zadacha, zadacha, bukva])(r);
  },
} satisfies Henerator;
