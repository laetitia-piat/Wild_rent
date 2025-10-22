function LegalNotice() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
      <p className="text-sm text-gray-500 mb-8">
        Dernière mise à jour : 18 juillet 2025
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
        <p>
          Le site <strong>Wild Rent</strong> (www.wildrent.fr) est un projet
          fictif réalisé dans le cadre d’un projet scolaire.
        </p>
        <p className="mt-2">
          <strong>Responsable de la publication :</strong> Wild Rent
          <br />
          Email : contact@wildrent.fr
          <br />
          Adresse : 1 rue des Fictifs, 75000 Paris
          <br />
          Téléphone : 06 12 34 56 78
          <br />
          Statut : Projet étudiant fictif – sans finalité commerciale
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Hébergeur du site</h2>
        <p>Le site est hébergé par :</p>
        <p className="mt-2">
          <strong>AlwaysData</strong>
          <br />
          Société AlwaysData SARL
          <br />
          Adresse : 62 rue Tiquetonne, 75002 Paris, France
          <br />
          Site web :{" "}
          <a
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.alwaysdata.com
          </a>
          <br />
          Téléphone : +33 1 23 45 67 89
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Propriété intellectuelle
        </h2>
        <p>
          L’ensemble du contenu du site (textes, images, logos, design, code
          source…) est la propriété exclusive de Wild Rent dans le cadre d’un
          usage pédagogique.
        </p>
        <p className="mt-2">
          Toute reproduction, représentation, diffusion ou exploitation
          partielle ou totale du contenu du site est interdite sans autorisation
          préalable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Données personnelles</h2>
        <p>
          Le site peut collecter des données personnelles via des formulaires de
          contact, de location ou d'inscription. Pour en savoir plus sur la
          collecte et le traitement de ces données, veuillez consulter notre{" "}
          <a href="/privacy-policy" className="text-blue-600 underline">
            politique de confidentialité
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
        <p>
          Le site peut utiliser des cookies pour améliorer l’expérience
          utilisateur et établir des statistiques de navigation. L’utilisateur
          peut configurer son navigateur pour les accepter ou les refuser.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Limitation de responsabilité
        </h2>
        <p>
          Ce site est un <strong>projet fictif à but pédagogique</strong>. Aucun
          service réel de location n’est proposé. Wild Rent ne pourra être tenu
          responsable d’une mauvaise interprétation du caractère fictif du site.
        </p>
      </section>
    </div>
  );
}
export default LegalNotice;
