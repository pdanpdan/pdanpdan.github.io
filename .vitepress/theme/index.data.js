import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createContentLoader } from 'vitepress';

function truncateText(text, length) {
  if (typeof text === 'string' && text.length > length) {
    return text.substring(0, length - 3) + "...";
  }

  return typeof text === 'string' ? text : '';
}

function formatDate(raw) {
  const date = new Date(raw);
  date.setUTCHours(12);
  return {
    ts: +date,
    iso: isNaN(date) ? null : date.toISOString().slice(0, 10),
    pretty: isNaN(date) ? null : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

function getImagePath(url) {
  const filename = url.split('.').slice(0, -1).join('.') + '.png';
  return existsSync(resolve('pages', ...filename.split('/')))
    ? filename
    : null;
}

export default createContentLoader('pages/posts/*.md', {
  excerpt: false,

  transform(raw) {
    return raw
      .filter(({ url }) => url !== '/posts/')
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        excerpt: truncateText(frontmatter.description, 100),
        image: getImagePath(url),
        author: frontmatter.author || 'PDan',
        href: url,
        date: formatDate(frontmatter.date),
      }))
      .sort((a, b) => b.date.ts - a.date.ts);
  }
})
