﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.tsx");

const nextConfig = {
  // 【开发预览模式】output: 'export' 与 middleware.ts 不兼容，dev server 会 500/ERR_ABORTED
  // 【生产静态构建】恢复下一行，并临时重命名 middleware.ts 为 middleware.ts.bak 后再 npm run build
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: { 
    optimizeCss: true,
  },
};

export default withNextIntl(nextConfig);
