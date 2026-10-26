# math
Матеріали з математики, впорядковані за класами й темами: теорія, задачі та розв'язання.

## Сайт

Адреса: https://m8-4-h8.github.io/math/

Сайт збирається на [Astro Starlight](https://starlight.astro.build/) і публікується автоматично
після кожного push у гілку `main` (див. `.github/workflows/pages.yml`).

## Як додавати матеріали

Усі сторінки лежать у `src/content/docs/`:

```
src/content/docs/
  index.md                 головна сторінка
  4-klas/                  один клас = одна папка
    dilennia-kutom.mdx     одна тема = один файл (.md або .mdx з ілюстраціями)
  5-klas/
    naturalni-chysla.md
```

- **Нова тема:** створи `.md` файл у папці класу, на початку файлу вкажи заголовок:
  ```
  ---
  title: Назва теми
  ---
  ```
  До меню й пошуку вона потрапить сама.
- **Новий клас:** створи папку (наприклад `6-klas`) і додай рядок у `sidebar` в `astro.config.mjs`.
- **Формули:** `$a^2 + b^2 = c^2$` у тексті, `$$ ... $$` окремим блоком.
- **Ілюстрації:** у файлі `.mdx` можна вставляти готові малюнки з `src/components/`:
  ```
  import Drib from '../../../components/Drib.astro';

  <Drib n={3} d={4} />
  ```
  | Компонент | Що малює | Приклад |
  | --- | --- | --- |
  | `MnozhenniaStovpchykom` | множення в стовпчик з поясненням | `<MnozhenniaStovpchykom a={47} b={23} />` |
  | `DilenniaKutom` | ділення кутом з поясненням | `<DilenniaKutom dividend={1234} divisor={6} />` |
  | `Tsukerky` | ділення цукерок порівну між дітьми | `<Tsukerky tsukerky={13} liudy={4} />` |
  | `Hrupy` | множення як однакові групи | `<Hrupy hrupy={4} po={3} />` |
  | `Drib` | дріб кругом або смужкою | `<Drib n={3} d={4} vyhliad="smuzhka" />` |
  | `Ryad` | кілька малюнків поруч з підписом | `<Ryad pidpys="..."> ... </Ryad>` |
  | `DrabynaDii` | додавання → множення → степінь | `<DrabynaDii osnova={3} raz={4} />` |
  | `Stepin` | як росте степінь (кружечки) | `<Stepin osnova={2} pokaznyk={5} />` |

  Числа можна підставляти будь-які: малюнок і покрокове пояснення рахуються автоматично.

Локальний запуск (потрібен Node.js 22.23.4+ або 24): `npm install`, потім `npm run dev`.
