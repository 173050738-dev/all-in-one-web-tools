import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: 'Tool Hub - Free Online Tools',
    description: 'Discover thousands of free online tools for productivity, creativity, and more.',
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

const locale = 'en';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import('../../public/locales/en/translation.json'))
    .default;

  return (
    <LocaleShell locale={locale} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
