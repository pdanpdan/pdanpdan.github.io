import { createContentLoader } from 'vitepress';

function truncateText(text, length) {
  if (typeof text === 'string' && text.length > length) {
    return `${ text.substring(0, length - 3) }...`;
  }

  return typeof text === 'string' ? text : '';
}

function formatDate(raw) {
  const date = new Date(raw);
  date.setUTCHours(12);
  return {
    ts: +date,
    iso: Number.isNaN(+date) ? null : date.toISOString().slice(0, 10),
    pretty: Number.isNaN(+date) ? null : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

function getImagePath(url) {
  return url.split('.').slice(0, -1).join('.');
}

export default createContentLoader('pages/posts/*.md', {
  transform(raw) {
    const tagStats = {};

    const posts = raw
      .filter(({ url }) => url !== '/posts/')
      .map(({ url, frontmatter }) => {
        const notArrayTags = typeof frontmatter.tags === 'string' && frontmatter.tags.trim().length > 0 ? [frontmatter.tags] : ['-/-'];
        const postTags = Array.isArray(frontmatter.tags) ? frontmatter.tags : notArrayTags;

        postTags.forEach((tag) => {
          if (tagStats[tag] === undefined) {
            tagStats[tag] = 0;
          }
          tagStats[tag] += 1;
        });

        return {
          title: frontmatter.title,
          excerpt: truncateText(frontmatter.description, 150),
          image: getImagePath(url),
          author: frontmatter.author || 'PDan',
          href: url,
          date: formatDate(frontmatter.date),
          tags: postTags,
          featured: frontmatter.featured === true,
        };
      })
      .sort((a, b) => b.date.ts - a.date.ts);

    const tagNames = Object.keys(tagStats).sort((t1, t2) => (tagStats[t2] - tagStats[t1]));
    const tagStatus = Object.fromEntries(tagNames.map((tag) => ([tag, true])));

    let featured = posts.filter((post) => post.featured);
    if (featured.length < 3) {
      featured = [
        ...featured,
        ...posts.filter((post) => featured.includes(post) === false).slice(0, 10 - featured.length),
      ];
    }

    return {
      tags: {
        names: tagNames,
        stats: tagStats,
        status: tagStatus,
      },

      posts,

      featured,
    };
  },
});
