export default {
  name: 'player',
  title: 'Jugadors',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string', validation: r => r.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() },
    { name: 'number', title: 'Dorsal', type: 'number' },
    { name: 'position', title: 'Posició', type: 'string', options: {
      list: ['Porter', 'Defensa', 'Migcampista', 'Davanter'],
    }},
    { name: 'birthYear', title: 'Any de naixement', type: 'number' },
    { name: 'nationality', title: 'Nacionalitat (ISO)', type: 'string' },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Biografia', type: 'text' },
  ],
  preview: { select: { title: 'name', subtitle: 'position', media: 'photo' } },
};
