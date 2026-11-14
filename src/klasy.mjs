// Список класів для меню і головної сторінки.
// Клас = папка `src/content/docs/<N>-klas`. Нову папку підхоплюємо автоматично,
// тож у конфігурацію нічого дописувати не треба.
import { readdirSync, readFileSync } from 'node:fs';

// Кольори й значки класів ідуть по колу, тому вистачить на будь-яку кількість класів.
export const ZNACHKY = ['🐣', '🦊', '🐼', '🦁', '🐬', '🦉', '🚀', '🧠', '🏆', '🎓', '🌟'];

export function znachokKlasu(nomer) {
  return ZNACHKY[(nomer - 1) % ZNACHKY.length];
}

export function papkyKlasiv(kornevaPapka = './src/content/docs') {
  return readdirSync(kornevaPapka, { withFileTypes: true })
    .filter((f) => f.isDirectory() && /^\d+-klas$/.test(f.name))
    .map((f) => ({ papka: f.name, nomer: parseInt(f.name, 10) }))
    .sort((a, b) => a.nomer - b.nomer);
}

// Пункти меню одного класу. Якщо в темах класу є поле `rozdil` (наприклад, `rozdil: 1. Звичайні дроби`),
// теми групуються за розділами, як у підручнику; розділи йдуть у порядку їхніх тем (`sidebar.order`),
// теми без розділу (наприклад, шпаргалка) — окремими пунктами. Без розділів — звичайний список тем.
export function meniuKlasu(papka, kornevaPapka = './src/content/docs') {
  const temy = readdirSync(`${kornevaPapka}/${papka}`)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const shapka = readFileSync(`${kornevaPapka}/${papka}/${f}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const pole = (nazva) =>
        shapka.match(new RegExp(`^\\s*${nazva}:\\s*(.+?)\\s*$`, 'm'))?.[1].replace(/^(['"])(.*)\1$/, '$2');
      return {
        slug: `${papka}/${f.replace(/\.mdx?$/, '')}`,
        rozdil: pole('rozdil'),
        poriadok: Number(pole('order') ?? Infinity),
        nazva: pole('title') ?? '',
      };
    });
  if (!temy.some((t) => t.rozdil)) return [{ autogenerate: { directory: papka } }];
  temy.sort((a, b) => a.poriadok - b.poriadok || a.nazva.localeCompare(b.nazva, 'uk'));
  const punkty = [];
  const rozdily = new Map();
  for (const t of temy) {
    if (!t.rozdil) {
      punkty.push(t.slug);
      continue;
    }
    if (!rozdily.has(t.rozdil)) {
      const hrupa = { label: t.rozdil, collapsed: true, items: [] };
      rozdily.set(t.rozdil, hrupa);
      punkty.push(hrupa);
    }
    rozdily.get(t.rozdil).items.push(t.slug);
  }
  return punkty;
}
