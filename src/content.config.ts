import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Значок теми (емодзі) для карток на головній сторінці, наприклад `ikonka: 🍕`.
        ikonka: z.string().optional(),
      }),
    }),
  }),
};
