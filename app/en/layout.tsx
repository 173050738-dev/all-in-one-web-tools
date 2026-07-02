import LocaleShell from '@/components/LocaleShell';
import { homeGenerateMetadata, type SeoLocale } from '@/components/seo';

const LOCALE: SeoLocale = 'en';

export async function generateMetadata() {
  return homeGenerateMetadata(LOCALE);
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import('../../public/locales/en/translation.json'))
    .default;

  return (
    <LocaleShell locale={LOCALE} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
