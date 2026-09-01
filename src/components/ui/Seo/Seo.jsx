const SITE = 'Reus FC Reddis';

export default function Seo({ title, description, image, jsonLd }) {
  const fullTitle = title ? `${title} · ${SITE}` : `${SITE} | Web Oficial del Club`;
  const desc = description || 'Web oficial del Reus FC Reddis. Notícies, partits, plantilla, botiga i tota l\'actualitat del club roig-i-negre de Reus.';
  const img = image || '/assets/badges/rfcr.webp';

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ca_ES" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
