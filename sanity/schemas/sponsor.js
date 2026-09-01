export default {
  name: 'sponsor',
  title: 'Patrocinadors',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string', validation: r => r.required() },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'tier', title: 'Nivell', type: 'string', options: {
      list: ['principal', 'or', 'plata', 'colab'],
    }},
  ],
  preview: { select: { title: 'name', subtitle: 'tier', media: 'logo' } },
};
