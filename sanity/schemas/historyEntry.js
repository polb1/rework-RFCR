export default {
  name: 'historyEntry',
  title: 'Història (entrades)',
  type: 'document',
  fields: [
    { name: 'year', title: 'Any', type: 'string' },
    { name: 'title', title: 'Títol', type: 'string' },
    { name: 'text', title: 'Text', type: 'text' },
    { name: 'order', title: 'Ordre', type: 'number' },
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'year' } },
};
