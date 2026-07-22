import LocaleShell from '@/components/LocaleShell';
import { homeGenerateMetadata, type SeoLocale } from '@/components/seo';
import { loadMessages } from '@/lib/load-messages';

const LOCALE: SeoLocale = 'fr';

export async function generateMetadata() {
  return homeGenerateMetadata(LOCALE);
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await loadMessages(LOCALE);

  return (
    <LocaleShell locale={LOCALE} messages={messages} dir="ltr">
      {children}
    </LocaleShell>
  );
}
