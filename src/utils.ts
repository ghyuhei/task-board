export function extractTags(content: string): string[] {
  const tagRegex = /#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]+/g;
  const matches = content.match(tagRegex);
  if (!matches) return [];
  return [...new Set(matches.map(tag => tag.slice(1)))];
}

export function getTagColor(tag: string): string {
  const colors = [
    '#FFB4B4', // red
    '#B4D7FF', // blue
    '#FFE5B4', // orange
    '#C8F7C8', // green
    '#E5D4FF', // purple
    '#FFE4E1', // pink
    '#B4F7F7', // cyan
    '#F7E4B4', // yellow
  ];

  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
