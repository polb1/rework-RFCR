export default {
  name: 'product',
  title: 'Productes',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string', validation: r => r.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() },
    { name: 'price', title: 'Preu (€)', type: 'number', validation: r => r.required().min(0) },
    { name: 'category', title: 'Categoria', type: 'string', options: {
      list: ['equipacio', 'roba', 'accessoris', 'infantil'],
    }},
    { name: 'description', title: 'Descripció', type: 'text' },
    { name: 'image', title: 'Imatge', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Destacat', type: 'boolean' },
  ],
  preview: { select: { title: 'name', subtitle: 'category', media: 'image' } },
};
