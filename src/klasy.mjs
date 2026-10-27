// Список класів для меню і головної сторінки.
// Клас = папка `src/content/docs/<N>-klas`. Нову папку підхоплюємо автоматично,
// тож у конфігурацію нічого дописувати не треба.
import { readdirSync } from 'node:fs';

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
