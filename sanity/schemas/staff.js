export default {
  name: 'staff',
  title: 'Cos tècnic',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'role', title: 'Càrrec', type: 'string' },
    { name: 'nationality', title: 'Nacionalitat', type: 'string' },
    { name: 'contractSince', title: 'Contracte des de', type: 'date' },
    { name: 'contractUntil', title: 'Contracte fins', type: 'date' },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
};
