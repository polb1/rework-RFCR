import Badge from '../../components/ui/Badge/Badge.jsx';
import styles from './Legal.module.css';

const CONTENT = {
  'avis-legal': {
    title: 'Avís legal',
    intro: 'Informació sobre el titular d\'aquesta web i les condicions d\'ús del lloc.',
    sections: [
      { h: 'Titular', p: 'Reus FC Reddis, entitat esportiva amb domicili a Reus, Catalunya.' },
      { h: 'Objecte', p: 'Aquesta web ofereix informació institucional, esportiva i comercial del Reus FC Reddis.' },
      { h: 'Propietat intel·lectual', p: 'Els continguts de la web (textos, imatges, logotips, disseny) són propietat del Reus FC Reddis o dels seus llicenciadors.' },
      { h: 'Legislació', p: 'La relació entre l\'usuari i el titular es regeix per la legislació espanyola vigent.' },
    ],
  },
  'politica-de-privadesa': {
    title: 'Política de privadesa',
    intro: 'Tractament de dades personals dels usuaris de la web.',
    sections: [
      { h: 'Responsable', p: 'Reus FC Reddis és el responsable del tractament de les dades recollides a través del lloc web.' },
      { h: 'Finalitat', p: 'Les dades es tracten per gestionar consultes, sol·licituds i comunicacions institucionals del club.' },
      { h: 'Drets', p: 'L\'usuari pot exercir els drets d\'accés, rectificació, supressió, oposició, limitació i portabilitat contactant amb el club.' },
      { h: 'Conservació', p: 'Les dades es conserven durant el temps necessari per complir la finalitat i les obligacions legals.' },
    ],
  },
  'politica-de-cookies': {
    title: 'Política de cookies',
    intro: 'Ús de cookies i tecnologies similars al lloc web.',
    sections: [
      { h: 'Què són', p: 'Les cookies són petits arxius que s\'emmagatzemen al navegador per recordar preferències i millorar l\'experiència d\'ús.' },
      { h: 'Tipus', p: 'Utilitzem cookies tècniques (necessàries pel funcionament) i, prèvia acceptació, cookies analítiques i de màrqueting.' },
      { h: 'Gestió', p: 'Pots configurar l\'ús de cookies al banner de consentiment o des de les preferències del teu navegador.' },
    ],
  },
  'condicions-de-venda': {
    title: 'Condicions de venda',
    intro: 'Condicions aplicables a la compra de productes a la botiga oficial.',
    sections: [
      { h: 'Preus', p: 'Els preus mostrats a la botiga inclouen IVA. Les despeses d\'enviament es calculen al procés de compra.' },
      { h: 'Enviaments', p: 'Els enviaments es realitzen dins del territori espanyol en un termini estimat de 3-7 dies laborables.' },
      { h: 'Devolucions', p: 'Disposes de 14 dies naturals per exercir el dret de desistiment. El producte ha d\'estar en perfectes condicions.' },
      { h: 'Pagament', p: 'Acceptem targeta bancària i altres mètodes disponibles al procés de checkout.' },
    ],
  },
};

export default function Legal({ page }) {
  const c = CONTENT[page];
  if (!c) return null;
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Legal</Badge>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.sub}>{c.intro}</p>
      </header>

      <article className={styles.body}>
        {c.sections.map(s => (
          <section key={s.h}>
            <h2 className={styles.h}>{s.h}</h2>
            <p className={styles.p}>{s.p}</p>
          </section>
        ))}
        <p className={styles.hint}>Document merament informatiu d'aquesta versió de la web.</p>
      </article>
    </main>
  );
}
