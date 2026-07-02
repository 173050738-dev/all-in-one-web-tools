import LocaleShell from '@/components/LocaleShell';
import { homeGenerateMetadata, type SeoLocale } from '@/components/seo';

const LOCALE: SeoLocale = 'ar';

export async function generateMetadata() {
  return homeGenerateMetadata(LOCALE);
}

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
    <LocaleShell locale={LOCALE} messages={messages} dir="rtl">
      {children}
    </LocaleShell>
  );
}
