import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: "Boîte à Outils - Outils en Ligne Gratuits",
    description: 'Découvrez des milliers d\'outils en ligne gratuits pour la productivité, la créativité et plus encore.',
    alternates: {
      languages: {
        en: '/en',
        zh: '/zh',
        es: '/es',
        hi: '/hi',
        fr: '/fr',
        ar: '/ar',
      },
    },
  };
}

const locale = 'fr';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enMessages = (await import('../../public/locales/en/translation.json'))
    .default;
  const localeMessages = (await import('../../public/locales/fr/translation.json'))
    .default;
  const messages = { ...enMessages, ...localeMessages };

  return (
    <LocaleShell locale={locale} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
