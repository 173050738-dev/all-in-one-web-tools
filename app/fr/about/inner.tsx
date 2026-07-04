export const metadata = {
  title: 'À propos | Korelyy - Boîte à outils en ligne gratuite pour le monde entier',
  description:
    "Découvrez l'équipe Korelyy et notre mission. Nous sélectionnons plus de 900 outils gratuits utilisables directement dans le navigateur — IA, image, PDF, bureautique, développement et création — disponibles en 6 langues dans plus de 180 pays.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">À propos de Korelyy</h1>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        Moins de téléchargements. Moins d&apos;installations. Plus de résultats concrets. Le tout dans un seul onglet.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Qui sommes-nous ?</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Korelyy est une équipe distribuée de développeurs indépendants, chefs de produit IA, traducteurs
            multilingues et créateurs de contenu. Depuis notre lancement mi-2024, chaque fonctionnalité que nous
            publions répond à une mission simple : <strong>réunir les meilleurs outils natives du web sous un même
            toit,</strong> pour que plus personne ne passe 20 minutes à chercher, télécharger des installateurs
            volumineux ou fermer des popups publicitaires juste pour redimensionner une image.
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            En juin 2026, Korelyy propose <strong>plus de 900 outils gratuits vérifiés manuellement</strong> — écriture
            et génération d&apos;images par IA, conversion PDF / image / audio, utilitaires texte, aides au
            développement, productivité bureautique et loisirs créatifs. Le site est entièrement localisé en
            <strong> français, anglais, chinois, espagnol, hindi et arabe</strong>, et est utilisé chaque jour par des
            créateurs, étudiants et professionnels dans plus de 180 pays.
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Nos valeurs</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">1. 100 % gratuit, sans contrainte</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Tous les outils principaux sont gratuits. Aucune inscription forcée, aucun numéro de téléphone, aucun
                mur payant de type « regardez une pub pour déverrouiller ».
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">2. Confidentialité par conception</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Images, documents et médias déposés ne servent qu&apos;à la tâche demandée, puis sont supprimés dans
                l&apos;heure. Aucune donnée n&apos;est recyclée en entraînement d&apos;IA.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">3. Vérifiés à la main. Pas de pièges.</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Notre équipe teste chaque outil avant référencement. Installateurs fourre-tout, faux boutons
                « Télécharger » et redirections forcées n&apos;ont pas leur place sur Korelyy.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">4. Localisés et transparents</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Politique de confidentialité, mentions légales, gestion des cookies et contact sont disponibles dans
                les 6 langues, conformément aux lois régionales sur la protection des données.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Pourquoi Korelyy plutôt qu&apos;un portail de téléchargement ?</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Sur un site de téléchargement classique, vous ouvrez 5 onglets, récupérez 3 barres d&apos;outils et repartez
            souvent déçu. Korelyy ne référence que des <strong>outils qui s&apos;exécutent directement dans votre
            navigateur</strong> :
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 leading-relaxed">
            <li>Pas d&apos;installateur exe / dmg / apk. <strong>Ouvrez, utilisez, fermez.</strong> Rien n&apos;encombre votre disque.</li>
            <li>Vraiment multi-plateforme : Windows, macOS, Linux, iOS, Android, tablettes et navigateurs rares fonctionnent de façon identique.</li>
            <li>Pensé pour les créatifs : réécriture, compression d&apos;images, découpage PDF, IA, sous-titres, conversions couleurs au même endroit.</li>
            <li>Pensé pour les développeurs : testeur de regex, formateur JSON, Base64, QR codes, UUID, convertisseurs d&apos;horodatage à portée de clic.</li>
          </ul>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Nous contacter</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Tous les retours comptent : outil cassé, publicité gênante, idée d&apos;outil, partenariat ou demande de
            retrait. Notre petite équipe lit chaque message personnellement.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Publicité &amp; Partenariats</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Support, confidentialité &amp; retrait</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Nous répondons à tout message sérieux sous 1 jour ouvré. Merci de nous aider à améliorer Korelyy.
          </p>
        </section>
      </div>
    </div>
  );
}
