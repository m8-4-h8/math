// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import rehypePoshukFormul from './src/poshuk-formul.mjs';
import { meniuKlasu, papkyKlasiv, znachokKlasu } from './src/klasy.mjs';

export default defineConfig({
  site: 'https://m8-4-h8.github.io',
  base: '/math',
  // Теми, які переїхали в інший клас: старі адреси ведуть на нові.
  redirects: {
    '/5-klas/rozriady-i-klasy': '/math/4-klas/rozriady-i-klasy/',
    '/5-klas/ploshcha-i-perymetr': '/math/4-klas/ploshcha-i-perymetr/',
    '/5-klas/odynytsi-ploshchi': '/math/4-klas/odynytsi-ploshchi/',
    '/5-klas/dilennia-z-ostacheiu': '/math/4-klas/dilennia-z-ostacheiu/',
    // 6 клас за параграфами Істера: об'єднані теми розділено.
    '/6-klas/priama-i-obernena-proportsiinist': '/math/6-klas/priama-proportsiinist/',
    '/6-klas/perpendykuliarni-i-paralelni-priami': '/math/6-klas/perpendykuliarni-priami/',
    '/6-klas/dovzhyna-kola-i-ploshcha-kruha': '/math/6-klas/dovzhyna-kola/',
  },
  markdown: {
    // Формули: $...$ у рядку та $$...$$ окремим блоком. rehypePoshukFormul — щоб формули в пошуку
    // не дублювались тричі (див. src/poshuk-formul.mjs).
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex, rehypePoshukFormul] }),
  },
  integrations: [
    starlight({
      title: 'Математика',
      logo: { src: './src/assets/sova.svg' },
      defaultLocale: 'root',
      locales: { root: { label: 'Українська', lang: 'uk' } },
      // Свої варіанти деяких частин Starlight — простіше для дітей на телефоні.
      components: {
        MobileMenuToggle: './src/components/starlight/MobileMenuToggle.astro',
        MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
      },
      customCss: [
        '@fontsource-variable/nunito',
        'katex/dist/katex.min.css',
        './src/styles/dytiacha-tema.css',
        './src/styles/ilustratsii.css',
      ],
      // Один клас = одна папка в src/content/docs (наприклад `6-klas`). Меню будується само:
      // нова папка = новий клас, новий .md/.mdx файл у ній = нова тема.
      // Групи згорнуті, тож меню коротке; група з відкритою темою розгортається сама.
      // Якщо теми класу мають поле `rozdil`, усередині класу є ще й розділи, як у підручнику.
      sidebar: [
        { label: '🎮 Тренажер', link: '/trenazher/' },
        ...papkyKlasiv().map(({ papka, nomer }) => ({
          label: `${znachokKlasu(nomer)} ${nomer} клас`,
          collapsed: true,
          items: meniuKlasu(papka),
        })),
        { label: '✏️ Як намалювати задачу', collapsed: true, items: [{ autogenerate: { directory: 'vizualizatsiia-zadach' } }] },
        { label: '💡 Поради для навчання', collapsed: true, items: [{ autogenerate: { directory: 'porady' } }] },
      ],
    }),
  ],
});
