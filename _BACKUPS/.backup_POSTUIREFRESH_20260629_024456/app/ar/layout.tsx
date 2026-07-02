import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: 'مُركّز الأدوات - أدوات مجانية عبر الإنترنت',
    description: 'اكتشف آلاف الأدوات المجانية عبر الإنترنت للمنتجات والإبداع والمزيد.',
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

const locale = 'ar';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const enMessages = (await import('../../public/locales/en/translation.json'))
    .default;
  const localeMessages = (await import('../../public/locales/ar/translation.json'))
    .default;
  const messages = { ...enMessages, ...localeMessages };

  return (
    <LocaleShell locale={locale} messages={messages} dir="rtl">
      {children}
    </LocaleShell>
  );
}
