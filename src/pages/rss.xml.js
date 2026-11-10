import rss
  from "@astrojs/rss";

import {
  getCollection,
} from "astro:content";

import {
  SITE,
} from "../config/site";

export async function GET(
  context
) {
  const posts =
    (await getCollection("posts"))
      .filter(
        (post) =>
          !post.data.draft
      )
      .sort(
        (a, b) =>
          b.data.date.getTime() -
          a.data.date.getTime()
      );

  return rss({
    title:
      SITE.title,

    description:
      SITE.description,

    site:
      context.site ??
      context.url.origin,

    items:
      posts.map(
        (post) => ({
          title:
            post.data.title,

          description:
            post.data.description,

          pubDate:
            post.data.date,

          link:
            `/blog/${post.id}/`,
        })
      ),

    customData:
      `<language>${SITE.language}</language>`,
  });
}