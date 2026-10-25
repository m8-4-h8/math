// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://m8-4-h8.github.io',
  base: '/math',
  markdown: {
    // Формулы: $...$ в строке и $$...$$ отдельным блоком.
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
  },
  integrations: [
    starlight({
      title: 'Математика',
      defaultLocale: 'root',
      locales: { root: { label: 'Русский', lang: 'ru' } },
      customCss: ['katex/dist/katex.min.css'],
      // Один класс = одна папка в src/content/docs и одна строка здесь.
      // Темы внутри класса попадают в меню автоматически: новый .md файл = новая тема.
      sidebar: [
        { label: '5 класс', items: [{ autogenerate: { directory: '5-klass' } }] },
      ],
    }),
  ],
});
