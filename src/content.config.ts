import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writeups = defineCollection({
  loader: glob({ base: './src/content/writeups', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(50).min(1),
    description: z.string().max(100).optional(),
    pubDate: z.coerce.date(),
  })
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // Reference a single author from the `authors` collection by `id`
    //author: reference('authors'),
    // Reference an array of related posts from the `blog` collection by `id`
    //relatedPosts: z.array(reference('blog')),
  })
});


export const collections = { writeups, blog };