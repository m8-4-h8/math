// Задачі за допомогою лінійних рівнянь (Істер, алгебра 7, § 3): рівняння як математична модель задачі.
// Вирази через x, «на … більше» і «у … разів», два види товару (x і n − x), відсотки, периметр,
// рух (таблиця v, t, s), «стало порівну», вік, «чи можна» (корінь має бути натуральним).
import { des, mnozh, tdes, zVelykoi, type Henerator, type Vypadok, type TrenZavdannia } from '../dopomoha.ts';

const BUKVY = ['А', 'Б', 'В'];
const URAZIV: Record<number, string> = { 2: 'удвічі', 3: 'утричі', 4: 'у 4 рази', 5: 'у 5 разів', 6: 'у 6 разів' };
/** Після слова на голосний — «в»: «буде втричі», але «вантажівок утричі». */
const vRaziv = (k: number) => 'в' + URAZIV[k].slice(1);

/** Вибір з трьох записів буквою: записи відрізняються лише знаками, тож порівнювати їх як відповіді не можна. */
function vybirBukvoiu(r: Vypadok, umova: string, pravylnyi: string, khybni: [string, string], pidkazka: string, poiasnennia: string): TrenZavdannia {
  const varianty = r.peremishaty([pravylnyi, ...khybni]);
  const bukva = BUKVY[varianty.indexOf(pravylnyi)];
  return {
    pytannia: `${umova} ${varianty.map((v, i) => `${BUKVY[i]}) $${v}$`).join('; ')}.`,
    vidpovid: bukva,
    varianty: BUKVY,
    pidkazka,
    rozviazok: `${bukva}. ${poiasnennia}`,
  };
}

function vyrazCherezX(r: Vypadok): TrenZavdannia {
  const typ = r.chyslo(0, 4);
  if (typ === 0) {
    const d = r.chyslo(3, 40);
    return vybirBukvoiu(r, `Одне число на ${d} більше за інше. Менше число позначили через $x$. Яким виразом записати більше?`, `x + ${d}`, [`x - ${d}`, `${d}x`], 'На кілька більше — додаємо.', `Більше число — це менше і ще ${d}.`);
  }
  if (typ === 1) {
    const k = r.chyslo(2, 6);
    return vybirBukvoiu(
      r,
      `На першій клумбі $x$ кущів троянд, а на другій — ${URAZIV[k]} більше. Скільки кущів на другій клумбі?`,
      `${k}x`,
      [`x + ${k}`, `x : ${k}`],
      'У кілька разів більше — множимо.',
      `«${URAZIV[k]} більше» — множимо на ${k}.`,
    );
  }
  if (typ === 2) {
    const n = r.chyslo(12, 60);
    return vybirBukvoiu(r, `Сума довжин двох відрізків дорівнює ${n} см. Довжина одного з них $x$ см. Яка довжина другого?`, `${n} - x`, [`x - ${n}`, `${n} + x`], 'Від суми віднімаємо відомий доданок.', `Другий відрізок — решта від ${n} см.`);
  }
  if (typ === 3) {
    const p = r.vybir([5, 8, 12, 15, 20, 25, 30, 60]);
    return vybirBukvoiu(r, `Перше число дорівнює $x$, а друге становить ${p} % від першого. Яким виразом записати друге число?`, `${tdes(p, 2)}x`, [`${p}x`, `x + ${tdes(p, 2)}`], `${p} % — це ${des(p, 2)}.`, `${p} % від числа — це число, помножене на ${des(p, 2)}.`);
  }
  const t = r.chyslo(2, 6);
  return vybirBukvoiu(r, `Відстань $x$ км велосипедистка долає за ${t} год. Яким виразом записати її швидкість (у км/год)?`, `x : ${t}`, [`${t}x`, `x - ${t}`], 'Швидкість — це відстань, поділена на час.', `$v = s : t$, тож швидкість дорівнює $x : ${t}$.`);
}

function sumaIBilshe(r: Vypadok): TrenZavdannia {
  const x = r.chyslo(8, 70);
  const d = r.chyslo(3, 30);
  const s = 2 * x + d;
  const pro = r.shans();
  const [umova, mensha, bilsha, od, pytMenshe, pytBilshe] = r.vybir([
    [`У двох цистернах разом ${s} т пального, причому в першій на ${d} т менше, ніж у другій.`, 'у першій цистерні', 'у другій цистерні', 'т', 'Скільки тонн пального в першій цистерні?', 'Скільки тонн пального в другій цистерні?'],
    [`За два дні продали ${s} кг бананів, причому другого дня на ${d} кг більше, ніж першого.`, 'першого дня', 'другого дня', 'кг', 'Скільки кілограмів бананів продали першого дня?', 'Скільки кілограмів бананів продали другого дня?'],
    [`У двох класах разом ${s} ${mnozh(s, 'учень', 'учні', 'учнів')}, причому в 7-Б на ${d} менше, ніж у 7-А.`, 'у 7-Б', 'у 7-А', '', 'Скільки учнів у 7-Б?', 'Скільки учнів у 7-А?'],
  ] as [string, string, string, string, string, string][]);
  return {
    pytannia: `${umova} ${pro ? pytMenshe : pytBilshe}`,
    vidpovid: pro ? x : x + d,
    odynytsi: od || undefined,
    pidkazka: `Нехай ${mensha} $x$, тоді ${bilsha} $x + ${d}$. Разом: $x + (x + ${d}) = ${s}$.`,
    rozviazok: `$2x + ${d} = ${s}$; $2x = ${s - d}$; $x = ${x}$. ${pro ? '' : `Тоді ${bilsha}: ${x} + ${d} = ${x + d}. `}Перевірка: ${x} + ${x + d} = ${s}`,
  };
}

function uRazy(r: Vypadok): TrenZavdannia {
  const k = r.chyslo(2, 6);
  const x = r.chyslo(5, 40);
  if (r.shans()) {
    const s = (k + 1) * x;
    const pro = r.shans();
    return {
      pytannia: `В автопарку вантажівок ${URAZIV[k]} більше, ніж легковиків, а разом — ${s} ${mnozh(s, 'машина', 'машини', 'машин')}. Скільки в автопарку ${pro ? 'легковиків' : 'вантажівок'}?`,
      vidpovid: pro ? x : k * x,
      pidkazka: `Нехай легковиків $x$, тоді вантажівок $${k}x$. Разом: $x + ${k}x = ${s}$.`,
      rozviazok: `$${k + 1}x = ${s}$; $x = ${x}$. ${pro ? '' : `Вантажівок: ${k} · ${x} = ${k * x}. `}Перевірка: ${x} + ${k * x} = ${s}`,
    };
  }
  const D = (k - 1) * x;
  return {
    pytannia: `Одне з двох додатних чисел ${URAZIV[k]} більше за інше, а їх різниця дорівнює ${D}. Знайди більше число.`,
    vidpovid: k * x,
    pidkazka: `Нехай менше число $x$, тоді більше $${k}x$. Різниця: $${k}x - x = ${D}$.`,
    rozviazok: `${k === 2 ? '' : `$${k - 1}x = ${D}$; `}$x = ${x}$. Більше число: ${k} · ${x} = ${k * x}. Перевірка: ${k * x} − ${x} = ${D}`,
  };
}

// Два види товару: x штук одного, n − x іншого.
function dvaVydy(r: Vypadok, lysheRivniannia = false): TrenZavdannia {
  const [shcho, vyd1, vyd2, pershykh] = r.vybir([
    ['зошитів', 'у клітинку', 'в лінійку', 'зошитів у клітинку'],
    ['квитків', 'дитячих', 'дорослих', 'дитячих квитків'],
    ['тістечок', 'з кремом', 'з ягодами', 'тістечок з кремом'],
    ['ручок', 'синіх', 'чорних', 'синіх ручок'],
  ] as [string, string, string, string][]);
  const n = r.chyslo(10, 30);
  const x = r.chyslo(2, n - 2);
  const p1 = r.chyslo(3, 18) * 5;
  const p2 = r.krim(3, 18, [p1 / 5]) * 5;
  const total = p1 * x + p2 * (n - x);
  const umova = `Купили ${n} ${shcho}: ${vyd1} по ${p1} грн і ${vyd2} по ${p2} грн. Усього заплатили ${total} грн.`;
  const rivn = `${p1}x + ${p2}(${n} - x) = ${total}`;
  if (lysheRivniannia) {
    return vybirBukvoiu(
      r,
      `${umova} Кількість ${pershykh} позначили через $x$. Яке рівняння відповідає задачі?`,
      rivn,
      [`${p1}x + ${p2}x = ${total}`, `${p1}x + ${p2}(x - ${n}) = ${total}`],
      `Якщо ${pershykh} $x$, то решта — $${n} - x$.`,
      `${zVelykoi(pershykh)} — $x$ штук на $${p1}x$ грн, решта — $${n} - x$ штук на $${p2}(${n} - x)$ грн.`,
    );
  }
  return {
    pytannia: `${umova} Скільки купили ${pershykh}?`,
    vidpovid: x,
    pidkazka: `Нехай ${pershykh} $x$, тоді решта — $${n} - x$. Вартість: $${rivn}$.`,
    rozviazok: `$${rivn}$; $${p1 - p2}x = ${total - p2 * n}$; $x = ${x}$. Перевірка: ${p1} · ${x} + ${p2} · ${n - x} = ${total}`,
  };
}

function vidsotky(r: Vypadok): TrenZavdannia {
  const p = r.vybir([5, 8, 10, 12, 15, 20, 25]);
  if (r.shans()) {
    const x = r.chyslo(8, 90) * 100;
    const total = x + (x * p) / 100;
    const [shcho, dodatok, tsiny, zapytannia] = r.vybir([
      ['пральну машину та її підключення', 'Підключення коштує', 'ціни машини', 'Скільки гривень коштує пральна машина?'],
      ['ноутбук і сумку до нього', 'Сумка коштує', 'ціни ноутбука', 'Скільки гривень коштує ноутбук?'],
      ['телефон і чохол до нього', 'Чохол коштує', 'ціни телефона', 'Скільки гривень коштує телефон?'],
    ] as [string, string, string, string][]);
    return {
      pytannia: `За ${shcho} заплатили ${total} грн. ${dodatok} ${p} % від ${tsiny}. ${zapytannia}`,
      vidpovid: x,
      odynytsi: 'грн',
      pidkazka: `Нехай шукана ціна $x$ грн, тоді ${p} % від неї — $${tdes(p, 2)}x$. Разом: $x + ${tdes(p, 2)}x = ${total}$.`,
      rozviazok: `$${tdes(100 + p, 2)}x = ${total}$; $x = ${x}$. Перевірка: ${p} % від ${x} — це ${(x * p) / 100}; ${x} + ${(x * p) / 100} = ${total}`,
    };
  }
  const x = r.chyslo(2, 12) * 20;
  const druha = x + (x * p) / 100;
  return {
    pytannia: `За другу годину майстриня зробила на ${p} % більше вареників, ніж за першу, а за дві години — ${x + druha}. Скільки вареників вона зробила за першу годину?`,
    vidpovid: x,
    pidkazka: `Нехай за першу годину $x$, тоді за другу $x + ${tdes(p, 2)}x = ${tdes(100 + p, 2)}x$. Разом: $x + ${tdes(100 + p, 2)}x = ${x + druha}$.`,
    rozviazok: `$${tdes(200 + p, 2)}x = ${x + druha}$; $x = ${x}$. Перевірка: за другу годину ${druha}; ${x} + ${druha} = ${x + druha}`,
  };
}

function trykutnyk(r: Vypadok): TrenZavdannia {
  if (r.shans()) {
    const x = r.chyslo(4, 30);
    const d = r.chyslo(1, 9);
    const P = 3 * x + 2 * d;
    return {
      pytannia: `Периметр рівнобедреного трикутника дорівнює ${P} см, а бічна сторона на ${d} см довша за основу. Знайди основу.`,
      vidpovid: x,
      odynytsi: 'см',
      pidkazka: `Основа $x$ см, кожна бічна сторона $x + ${d}$. Периметр: $x + 2(x + ${d}) = ${P}$.`,
      rozviazok: `$3x + ${2 * d} = ${P}$; $3x = ${3 * x}$; $x = ${x}$. Перевірка: ${x} + ${x + d} + ${x + d} = ${P}`,
    };
  }
  // Перша сторона на a менша від другої і вдвічі менша від третьої.
  const a = r.chyslo(2, 12);
  const x = r.chyslo(a + 1, a + 25); // тоді 2x < x + (x + a) — трикутник існує
  const P = 4 * x + a;
  const pro = r.chyslo(0, 2);
  const storony = [x, x + a, 2 * x];
  return {
    pytannia: `Одна сторона трикутника на ${a} см менша від другої і вдвічі менша від третьої. Периметр трикутника — ${P} см. Знайди ${['найменшу', 'середню за довжиною', 'найбільшу'][pro]} сторону.`,
    vidpovid: storony[pro],
    odynytsi: 'см',
    pidkazka: `Нехай найменша сторона $x$ см, тоді друга $x + ${a}$, третя $2x$. Периметр: $x + (x + ${a}) + 2x = ${P}$.`,
    rozviazok: `$4x + ${a} = ${P}$; $4x = ${4 * x}$; $x = ${x}$. Сторони: ${x}, ${x + a} і ${2 * x} см. Перевірка: ${x} + ${x + a} + ${2 * x} = ${P}`,
  };
}

// Назустріч, різний час у дорозі: t1·x + t2·(x + d) = S.
function rukhNazustrich(r: Vypadok): TrenZavdannia {
  const t2 = r.chyslo(2, 4);
  const t1 = t2 + r.vybir([0.5, 1]);
  const x = r.chyslo(8, 16) * 5;
  const d = r.chyslo(1, 6) * 5;
  const S = t1 * x + t2 * (x + d);
  const pro = r.shans();
  const ranishe = t1 - t2 === 1 ? '1 год' : '30 хв';
  return {
    pytannia: `З міста A до міста B, відстань між якими ${des(S * 10, 1)} км, виїхала вантажівка. Через ${ranishe} назустріч їй з міста B виїхав легковик, швидкість якого на ${d} км/год більша. Вони зустрілися через ${t2} год після виїзду легковика. Знайди швидкість ${pro ? 'вантажівки' : 'легковика'} (у км/год).`,
    vidpovid: pro ? x : x + d,
    pidkazka: `Вантажівка була в дорозі ${des(t1 * 10, 1)} год. Нехай її швидкість $x$: $${tdes(t1 * 10, 1)}x + ${t2}(x + ${d}) = ${tdes(S * 10, 1)}$.`,
    rozviazok: `$${tdes((t1 + t2) * 10, 1)}x + ${t2 * d} = ${tdes(S * 10, 1)}$; $${tdes((t1 + t2) * 10, 1)}x = ${tdes((S - t2 * d) * 10, 1)}$; $x = ${x}$. ${pro ? '' : `Легковик: ${x} + ${d} = ${x + d}. `}Перевірка: ${des(t1 * 10, 1)} · ${x} + ${t2} · ${x + d} = ${des(S * 10, 1)}`,
  };
}

// Однакова відстань за різний час: t1(x + d) = t2·x.
function odnakovaVidstan(r: Vypadok): TrenZavdannia {
  for (;;) {
    const [shvydkyi, povilnyi, shvydkoho, povilnoho, vid, do_, maks] = r.vybir([
      ['Мотоцикліст', 'велосипедистка', 'мотоцикліста', 'велосипедистки', 10, 24, 80],
      ['Автобус', 'вантажівка', 'автобуса', 'вантажівки', 40, 70, 100],
      ['Катер', 'човен', 'катера', 'човна', 6, 20, 45],
    ] as [string, string, string, string, number, number, number][]);
    const t1 = r.chyslo(2, 4);
    const t2 = r.chyslo(t1 + 1, 6);
    const x = r.chyslo(Math.ceil(vid / t1), Math.floor(do_ / t1)) * t1; // тоді d ціле
    const d = (x * (t2 - t1)) / t1;
    if (x + d > maks) continue;
    return {
      pytannia: `${shvydkyi} за ${t1} год долає таку саму відстань, що й ${povilnyi} за ${t2} год. Швидкість ${shvydkoho} на ${d} км/год більша. Знайди швидкість ${povilnoho} (у км/год).`,
      vidpovid: x,
      pidkazka: `Нехай швидкість ${povilnoho} $x$, тоді ${shvydkoho} — $x + ${d}$. Відстані рівні: $${t1}(x + ${d}) = ${t2}x$.`,
      rozviazok: `$${t1}x + ${t1 * d} = ${t2}x$; ${t2 - t1 === 1 ? '' : `$${t2 - t1}x = ${t1 * d}$; `}$x = ${x}$. Перевірка: ${t1} · ${x + d} = ${t1 * (x + d)} і ${t2} · ${x} = ${t2 * x}`,
    };
  }
}

function staloPorivnu(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.chyslo(2, 4);
    const a = r.chyslo(3, 30);
    if (r.shans()) {
      // Переставили a з першої на другу: kx − a = x + a.
      if ((2 * a) % (k - 1)) continue;
      const x = (2 * a) / (k - 1);
      if (x < 4 || k * x - a < 1) continue;
      return {
        pytannia: `На першій ділянці кущів аґрусу ${vRaziv(k)} більше, ніж на другій. Коли з першої ділянки на другу пересадили ${a} ${mnozh(a, 'кущ', 'кущі', 'кущів')}, на ділянках стало порівну. Скільки кущів росло на другій ділянці спочатку?`,
        vidpovid: x,
        pidkazka: `Нехай на другій $x$, на першій $${k}x$. З першої забрали ${a}, на другу додали ${a}: $${k}x - ${a} = x + ${a}$.`,
        rozviazok: `$${k}x - x = ${a} + ${a}$; ${k === 2 ? '' : `$${k - 1}x = ${2 * a}$; `}$x = ${x}$. Перевірка: ${k * x} − ${a} = ${k * x - a} і ${x} + ${a} = ${x + a}`,
      };
    }
    // Один прочитав у k разів більше; другий дочитав ще a — стало порівну: kx = x + a.
    if (a % (k - 1)) continue;
    const x = a / (k - 1);
    if (x < 3) continue;
    return {
      pytannia: `За літо Сергій прочитав ${URAZIV[k]} більше оповідань, ніж Костя. У вересні Костя прочитав ще ${a}, і тоді виявилося, що хлопці прочитали порівну. Скільки оповідань прочитав Костя за літо?`,
      vidpovid: x,
      pidkazka: `Нехай Костя прочитав за літо $x$, тоді Сергій $${k}x$. Після вересня: $x + ${a} = ${k}x$.`,
      rozviazok: `$${k}x - x = ${a}$; ${k === 2 ? '' : `$${k - 1}x = ${a}$; `}$x = ${x}$. Перевірка: ${x} + ${a} = ${x + a} і ${k} · ${x} = ${k * x}`,
    };
  }
}

function vik(r: Vypadok): TrenZavdannia {
  for (;;) {
    const k = r.chyslo(2, 4);
    const syn = r.chyslo(4, 14);
    const batko = r.chyslo(28, 48);
    // batko + x = k(syn + x)
    if ((batko - k * syn) % (k - 1)) continue;
    const x = (batko - k * syn) / (k - 1);
    if (x < 1 || x > 20 || batko - syn < 20) continue;
    return {
      pytannia: `Батькові зараз ${batko} ${mnozh(batko, 'рік', 'роки', 'років')}, а синові — ${syn}. Через скільки років батько буде ${vRaziv(k)} старший за сина?`,
      vidpovid: x,
      pidkazka: `Нехай через $x$ років. Тоді батькові буде $${batko} + x$, синові $${syn} + x$: $${batko} + x = ${k}(${syn} + x)$.`,
      rozviazok: `$${batko} + x = ${k * syn} + ${k}x$; ${k === 2 ? '' : `$${k - 1}x = ${batko - k * syn}$; `}$x = ${x}$. Перевірка: ${batko} + ${x} = ${batko + x} і ${k} · ${syn + x} = ${k * (syn + x)}`,
    };
  }
}

// «Чи можна розкласти?» — корінь має бути натуральним числом.
function chyMozhna(r: Vypadok): TrenZavdannia {
  const d = r.chyslo(2, 9);
  const tak = r.shans();
  const x = r.chyslo(d + 3, 30);
  const N = 4 * x - d + (tak ? 0 : r.chyslo(1, 3));
  const [shcho, de] = r.vybir([
    ['банок консервів', 'у три ящики'],
    ['цукерок', 'у три пакети'],
    ['зошитів', 'у три стоси'],
  ] as [string, string][]);
  return {
    pytannia: `Чи можна ${N} ${shcho} розкласти ${de} так, щоб у другому було вдвічі більше, ніж у першому, а в третьому — на ${d} менше, ніж у першому?`,
    vidpovid: tak ? 'так' : 'ні',
    varianty: ['так', 'ні'],
    pidkazka: `Нехай у першому $x$: $x + 2x + (x - ${d}) = ${N}$. Чи буде корінь натуральним числом?`,
    rozviazok: tak
      ? `Так: $4x - ${d} = ${N}$; $4x = ${N + d}$; $x = ${x}$. Перевірка: ${x} + ${2 * x} + ${x - d} = ${N}`
      : `Ні: $4x - ${d} = ${N}$; $4x = ${N + d}$, а ${N + d} не ділиться на 4 — кількість не буде цілим числом.`,
  };
}

export default {
  rivni: ['вирази через x, «на більше», «у кілька разів»', 'два види товару, відсотки, периметр', 'рух, «стало порівну», вік, «чи можна»'],
  zavdannia(r, riven) {
    if (riven === 1) return r.vybir([vyrazCherezX, vyrazCherezX, sumaIBilshe, sumaIBilshe, uRazy, uRazy])(r);
    if (riven === 2) return r.vybir([(rr: Vypadok) => dvaVydy(rr), (rr: Vypadok) => dvaVydy(rr), (rr: Vypadok) => dvaVydy(rr, true), vidsotky, vidsotky, trykutnyk])(r);
    return r.vybir([rukhNazustrich, odnakovaVidstan, staloPorivnu, staloPorivnu, vik, chyMozhna])(r);
  },
} satisfies Henerator;
