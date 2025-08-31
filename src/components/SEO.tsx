import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  image,
}: SEOProps) {
  useEffect(() => {
    const updateMeta = (attr: string, key: string, content?: string) => {
      if (!content) return;
      let meta = document.querySelector(`meta[${attr}='${key}']`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateLink = (rel: string, href?: string) => {
      if (!href) return;
      let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    if (title) {
      document.title = title;
    }

    updateMeta("name", "description", description);
    updateMeta("name", "keywords", keywords);

    const canonicalUrl = canonical || window.location.href;
    updateLink("canonical", canonicalUrl);

    // Open Graph tags
    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:url", canonicalUrl);
    updateMeta("property", "og:image", image);
  }, [title, description, keywords, canonical, image]);

  return null;
}