# math
Math learning materials organized by grade and topic: theory, problems and solutions.

## Сайт

Адрес: https://m8-4-h8.github.io/math/

Сайт собирается на [Astro Starlight](https://starlight.astro.build/) и публикуется автоматически
при каждом push в ветку `main` (см. `.github/workflows/pages.yml`).

## Как добавлять материалы

Все страницы лежат в `src/content/docs/`:

```
src/content/docs/
  index.md                 главная страница
  5-klass/                 один класс = одна папка
    naturalnye-chisla.md   одна тема = один файл
```

- **Новая тема:** создай `.md` файл в папке класса, в начале файла укажи заголовок:
  ```
  ---
  title: Название темы
  ---
  ```
  В меню и в поиск она попадёт сама.
- **Новый класс:** создай папку (например `6-klass`) и добавь строку в `sidebar` в `astro.config.mjs`.
- **Формулы:** `$a^2 + b^2 = c^2$` в тексте, `$$ ... $$` отдельным блоком.

Локальный запуск (нужен Node.js 22.23.4+ или 24): `npm install`, затем `npm run dev`.
