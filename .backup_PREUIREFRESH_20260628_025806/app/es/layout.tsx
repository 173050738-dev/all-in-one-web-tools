import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: 'Herramientas Online - Gratis',
    description: 'Descubre miles de herramientas en línea gratuitas para productividad, creatividad y más.',
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

const locale = 'es';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enMessages = (await import('../../public/locales/en/translation.json'))
    .default;
  const localeMessages = (await import('../../public/locales/es/translation.json'))
    .default;
  const messages = { ...enMessages, ...localeMessages };

  return (
    <LocaleShell locale={locale} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
