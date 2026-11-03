// Середнє арифметичне: сума : кількість (нуль теж рахується); середнє десяткових дробів; середня швидкість
// (весь шлях : весь час, а не середнє швидкостей); невідоме число за середнім.
import { des, mnozh, tdes, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

/** n цілих чисел із проміжку з цілим середнім: останнє число підбираємо так, щоб сума ділилася на n. */
function chyslaZSerednim(r: Vypadok, n: number, vid: number, do_: number) {
  for (;;) {
    const z = Array.from({ length: n - 1 }, () => r.chyslo(vid, do_));
    const s = z.reduce((a, b) => a + b, 0);
    const kandydaty = Array.from({ length: do_ - vid + 1 }, (_, i) => vid + i).filter((x) => (s + x) % n === 0);
    if (kandydaty.length) {
      const chysla = r.peremishaty([...z, r.vybir(kandydaty)]);
      if (new Set(chysla).size > 1) return chysla;
    }
  }
}

const suma = (z: number[]) => z.reduce((a, b) => a + b, 0);

function prosti(r: Vypadok, n: number, vid: number, do_: number): TrenZavdannia {
  const z = chyslaZSerednim(r, n, vid, do_);
  const s = suma(z);
  return {
    pytannia: `Знайди середнє арифметичне чисел ${z.map((x) => `$${x}$`).join(', ')}.`,
    vidpovid: s / n,
    pidkazka: `Додай усі числа і поділи на їхню кількість — їх ${n}.`,
    rozviazok: `(${z.join(' + ')}) : ${n} = ${s} : ${n} = ${s / n}`,
  };
}

const SYTUATSII = [
  { pro: (z: string) => `Оцінки Марка за тиждень: ${z}. Яка його середня оцінка?`, vid: 6, do_: 12, n: [4, 5] },
  {
    pro: (z: string, n: number) => `Оля читала книжку ${n} ${mnozh(n, 'день', 'дні', 'днів')}: щодня — ${z} сторінок. Скільки сторінок у середньому вона прочитувала за день?`,
    vid: 8,
    do_: 30,
    n: [3, 4, 5],
  },
  { pro: (z: string) => `Зріст друзів: ${z} см. Який їхній середній зріст?`, vid: 130, do_: 155, n: [3, 4], od: 'см' },
  { pro: (z: string) => `Денна температура кілька днів поспіль: ${z} °C. Яка середня температура?`, vid: 8, do_: 24, n: [3, 4, 5], od: '°' },
];

function zZhyttia(r: Vypadok): TrenZavdannia {
  const s = r.vybir(SYTUATSII);
  const n = r.vybir(s.n);
  const z = chyslaZSerednim(r, n, s.vid, s.do_);
  return {
    pytannia: s.pro(z.join(', '), n),
    vidpovid: suma(z) / n,
    odynytsi: s.od,
    pidkazka: 'Сума : кількість. Середнє має вийти між найменшим і найбільшим.',
    rozviazok: `(${z.join(' + ')}) : ${n} = ${suma(z)} : ${n} = ${suma(z) / n}`,
  };
}

function zNulem(r: Vypadok): TrenZavdannia {
  const n = r.vybir([3, 4]);
  for (;;) {
    const z = r.peremishaty([0, ...Array.from({ length: n - 1 }, () => r.chyslo(2, 9))]);
    const s = suma(z);
    if (s % n !== 0) continue;
    return {
      pytannia: `Бали за ${n} задачі: ${z.join(', ')}. Який середній бал?`,
      vidpovid: s / n,
      pidkazka: 'Нуль — теж результат: він рахується в кількості.',
      rozviazok: `(${z.join(' + ')}) : ${n} = ${s} : ${n} = ${s / n} — ділимо на ${n}, бо нуль теж рахується.`,
    };
  }
}

function desiatkovi(r: Vypadok): TrenZavdannia {
  // Числа в десятих; середнє — теж у десятих.
  const n = r.vybir([2, 3, 4, 5]);
  let z = chyslaZSerednim(r, n, 5, 60);
  while (z.filter((x) => x % 10 !== 0).length < 2) z = chyslaZSerednim(r, n, 5, 60);
  const s = suma(z);
  return {
    pytannia: `Знайди середнє арифметичне чисел ${z.map((x) => `$${tdes(x, 1)}$`).join('; ')}.`,
    vidpovid: des(s / n, 1),
    pidkazka: `Сума : ${n}.`,
    rozviazok: `$(${z.map((x) => tdes(x, 1)).join(' + ')}) : ${n} = ${tdes(s, 1)} : ${n} = ${tdes(s / n, 1)}$`,
  };
}

function shvydkist(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [t1, t2] = [r.chyslo(1, 3), r.chyslo(1, 3)];
    const v1 = r.chyslo(4, 9) * 10;
    const v2 = r.krim(4, 9, [v1 / 10]) * 10;
    const s = v1 * t1 + v2 * t2;
    if (s % (t1 + t2) !== 0 || t1 === t2) continue;
    const vSer = s / (t1 + t2);
    return {
      pytannia: `Автомобіль їхав ${t1} год зі швидкістю ${v1} км/год, а потім ${t2} год — зі швидкістю ${v2} км/год. Яка його середня швидкість?`,
      vidpovid: vSer,
      odynytsi: 'км/год',
      pidkazka: 'Середня швидкість — весь шлях : весь час.',
      rozviazok: `Весь шлях: ${v1} · ${t1} + ${v2} · ${t2} = ${s} (км); весь час: ${t1} + ${t2} = ${t1 + t2} (год); ${s} : ${t1 + t2} = ${vSer} (км/год).`,
    };
  }
}

function nevidome(r: Vypadok): TrenZavdannia {
  const n = r.vybir([3, 4]);
  const ser = r.chyslo(10, 60);
  const vidomi = Array.from({ length: n - 1 }, () => r.chyslo(ser - 9, ser + 9));
  const x = ser * n - suma(vidomi);
  if (x <= 0) return nevidome(r);
  return {
    pytannia: `Середнє арифметичне ${n === 3 ? 'трьох' : 'чотирьох'} чисел — ${ser}. Відомі числа: ${vidomi.join(', ')}. Знайди ${n === 3 ? 'третє' : 'четверте'}.`,
    vidpovid: x,
    pidkazka: `Сума всіх чисел = середнє · ${n}.`,
    rozviazok: `Сума: ${ser} · ${n} = ${ser * n}; ${ser * n} − ${vidomi.join(' − ')} = ${x}.`,
  };
}

export default {
  rivni: ['середнє кількох чисел', 'з життя, нуль і дроби', 'середня швидкість і невідоме число'],
  zavdannia(r, riven) {
    if (riven === 1) return r.shans(0.6) ? prosti(r, r.vybir([2, 3, 4]), 2, 20) : zZhyttia(r);
    if (riven === 2) return r.vybir([zZhyttia, zNulem, desiatkovi, (rr: Vypadok) => prosti(rr, 5, 10, 50)])(r);
    return r.vybir([shvydkist, shvydkist, nevidome, nevidome, desiatkovi])(r);
  },
} satisfies Henerator;
