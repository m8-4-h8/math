// Перевірка відповіді дитини: спільна для тренажерів (і таких самих правил, як у <Zavdannia>).
//
// Порівнюємо без урахування пробілів, великих літер і розділових знаків. Якщо у правильній відповіді
// є числа, достатньо ввести ті самі числа: «36 км» і «36» — обидві правильні. Числа порівнюємо як
// числа: «3,50», «3.5» і «3,5» однакові, «007» — це 7.

// «9 (ост. 2)» → ['9', 'ост', '2']; «3 200 005» → ['3200005'].
// Кома буває і десятковою («3,5» → ['3.5']), і роздільником («0,1,2» → ['0', '1', '2']) — пробуємо обидва.
function slova(tekst: string, desiatkova: boolean) {
  const t = tekst
    .toLowerCase()
    .replace(/’|ʼ/g, "'")
    .replace(/(\d)\s+(?=\d{3}(?!\d))/g, '$1')
    .replace(/(мм|см|дм|км|м)\s*[23²³]/g, '$1'); // «см2» і «см²» — це одиниця, а не число 2
  // Мінус перед числом (не між числами, як у «10-15») — частина числа: «−2» і «2» різні відповіді.
  const chyslo = desiatkova
    ? /(?:(?<![\d\p{L}])[-−–])?\d+(?:[.,]\d+)?|[\p{L}']+/gu
    : /(?:(?<![\d\p{L}])[-−–])?\d+(?:\.\d+)?|[\p{L}']+/gu;
  return (t.match(chyslo) || []).map((s) => {
    const z = s.replace(',', '.').replace(/^[−–]/, '-');
    return /^-?\d/.test(z) ? kanonichne(z) : z;
  });
}

// «-03.50» → «-3.5», «-0» → «0».
function kanonichne(z: string) {
  let [cile, drob = ''] = z.replace(/^-/, '').split('.');
  cile = cile.replace(/^0+(?=\d)/, '');
  drob = drob.replace(/0+$/, '');
  const ch = drob ? `${cile}.${drob}` : cile;
  return z.startsWith('-') && /[1-9]/.test(ch) ? '-' + ch : ch;
}

const chysla = (s: string[]) => s.filter((x) => /^-?\d/.test(x)).join(' ');

export function pravylno(vvid: string, vidpovidi: string[]) {
  // Відповідь без букв і цифр (знаки «>», «<», «=») порівнюємо як є.
  if (vidpovidi.some((pr) => pr.trim() === vvid.trim())) return true;
  return [true, false].some((desiatkova) => {
    const v = slova(vvid, desiatkova);
    if (!v.length) return false;
    return vidpovidi.some((pr) => {
      const p = slova(pr, desiatkova);
      if (v.join(' ') === p.join(' ')) return true;
      // У відповіді є числа — одиниці виміру й слова на кшталт «ост.» можна не писати.
      return chysla(p) !== '' && chysla(v) === chysla(p);
    });
  });
}
