import { createClient } from '@sanity/client';
import { SITE } from './site';

export const sanityClient = createClient({
  projectId: SITE.sanity.projectId,
  dataset: SITE.sanity.dataset,
  apiVersion: SITE.sanity.apiVersion,
  // Build-time-only fetches: freshness matters more than CDN speed here.
  useCdn: false,
});

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  cluster: string | null;
  relatedTool: string | null;
  body: unknown[];
  faq: { question: string; answer: string }[];
  publishedAt: string;
  relatedPosts: { title: string; slug: string }[];
}

const POST_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  cluster,
  relatedTool,
  body,
  "faq": coalesce(faq[]{ question, answer }, []),
  publishedAt,
  "relatedPosts": coalesce(relatedPosts[]->{ title, "slug": slug.current }, [])
}`;

/** All published posts, newest first. Build-time fetch only — this site is fully static. */
export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) ${POST_PROJECTION}`
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] ${POST_PROJECTION}`,
    { slug }
  );
}
