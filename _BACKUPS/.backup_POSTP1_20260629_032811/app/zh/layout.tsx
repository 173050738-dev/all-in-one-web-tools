import LocaleShell from '@/components/LocaleShell';

export async function generateMetadata() {
  return {
    title: '工具库 - 免费在线工具',
    description: '发现数千个免费在线工具，提升您的生产力和创造力。',
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

const locale = 'zh';

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import('../../public/locales/zh/translation.json'))
    .default;

  return (
    <LocaleShell locale={locale} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
