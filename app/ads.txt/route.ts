export const dynamic = 'force-static';
export const revalidate = 86400;

const ADS_TXT = `# AdSense ads.txt for Korelyy Tools — https://korelyy.com
google.com, pub-7235824755389632, DIRECT, f08c47fec0942fa0
`;

export function GET() {
  return new Response(ADS_TXT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
