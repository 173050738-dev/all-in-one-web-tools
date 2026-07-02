import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: 'टूल हब - मुफ्त ऑनलाइन टूल्स',
    description: 'उत्पादकता, रचनात्मकता और अधिक के लिए हज़ारों मुफ्त ऑनलाइन टूल्स खोजें।',
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

const locale = 'hi';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enMessages = (await import('../../public/locales/en/translation.json'))
    .default;
  const localeMessages = (await import('../../public/locales/hi/translation.json'))
    .default;
  const messages = { ...enMessages, ...localeMessages };

  return (
    <LocaleShell locale={locale} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
