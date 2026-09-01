export default {
  name: 'news',
  title: 'Notícies',
  type: 'document',
  fields: [
    { name: 'title', title: 'Títol', type: 'string', validation: r => r.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() },
    { name: 'excerpt', title: 'Extracte', type: 'text', rows: 3 },
    { name: 'body', title: 'Cos', type: 'array', of: [{ type: 'block' }] },
    { name: 'date', title: 'Data', type: 'datetime', validation: r => r.required() },
    { name: 'category', title: 'Categoria', type: 'string', options: {
      list: ['Primer equip', 'Club', 'Botiga', 'Patrocinadors', 'Socis', 'Afició'],
    }},
    { name: 'image', title: 'Imatge', type: 'image', options: { hotspot: true } },
    { name: 'author', title: 'Autor', type: 'string' },
  ],
  orderings: [{ title: 'Data (recent)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
};
