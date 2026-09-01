export default {
  name: 'boardMember',
  title: 'Directiva',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'role', title: 'Càrrec', type: 'string' },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'order', title: 'Ordre', type: 'number' },
  ],
  orderings: [{ title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
};
