export function GET({
  site,
  url,
}: {
  site: URL | undefined;
  url: URL;
}) {
  const baseURL =
    site ??
    new URL(
      url.origin
    );

  const sitemapURL =
    new URL(
      "/sitemap-index.xml",
      baseURL
    );

  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapURL.href}`,
    "",
  ].join("\n");

  return new Response(
    body,
    {
      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",
      },
    }
  );
}