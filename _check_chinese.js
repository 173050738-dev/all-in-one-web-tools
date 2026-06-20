const fs = require('fs');
const dir = 'D:/projects/PDF工具/src';
const files = [
  'components/FileUploader.tsx',
  'hooks/useQuotaGuard.ts',
  'lib/utils.ts',
  'lib/stripe.ts',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'middleware.ts',
  'store/useStore.ts',
  'app/api/stripe/webhook/route.ts',
  'app/api/stripe/checkout/route.ts'
];
files.forEach(f => {
  const p = dir + '/' + f;
  if (!fs.existsSync(p)) { console.log(f + ': NOT FOUND'); return; }
  const c = fs.readFileSync(p, 'utf8');
  const m = c.match(/[\u4e00-\u9fff]{2,}/g);
  if (m) console.log(f + ': ' + m.join(', '));
  else console.log(f + ': clean');
});
