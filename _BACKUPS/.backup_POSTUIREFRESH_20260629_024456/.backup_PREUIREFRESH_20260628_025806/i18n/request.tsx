import { notFound } from "next/navigation";

export const SUPPORTED_LOCALES = ["en", "zh", "es", "hi", "fr", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "en";

function deepMerge(target: any, source: any): any {
  const out: any = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = out[key];
    if (
      sv !== null &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv !== null &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      out[key] = deepMerge(tv, sv);
    } else if (tv === undefined || tv === null || (typeof tv === "object" && !Array.isArray(tv) && Object.keys(tv).length === 0)) {
      out[key] = sv;
    }
  }
  return out;
}

export async function getRequestConfig({ request }: { request?: Request }) {
  let locale: SupportedLocale = DEFAULT_LOCALE;

  if (request) {
    const pathname = new URL(request.url).pathname;
    const match = SUPPORTED_LOCALES.find((l) =>
      pathname.startsWith(`/${l}`)
    );
    if (match) locale = match;
  }

  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    notFound();
  }

  const [localeMessages, defaultMessages] = await Promise.all([
    import(`../public/locales/${locale}/translation.json`),
    locale === DEFAULT_LOCALE
      ? Promise.resolve({ default: {} as any })
      : import(`../public/locales/${DEFAULT_LOCALE}/translation.json`),
  ]);

  const messages =
    locale === DEFAULT_LOCALE
      ? localeMessages.default
      : deepMerge(localeMessages.default, defaultMessages.default);

  return { locale, messages };
}

export default getRequestConfig;
