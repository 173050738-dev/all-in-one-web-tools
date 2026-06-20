
function Convert-ChineseToEnglish {
    param([string]$path, $replacements)
    $bak = $path + ".bak"
    if (-not (Test-Path $bak)) { Copy-Item $path $bak -Force }
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    foreach ($pair in $replacements.GetEnumerator()) {
        $c = $c.Replace($pair.Key, $pair.Value)
    }
    [System.IO.File]::WriteAllText($path, $c, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Done: $path"
}

# lib/utils.ts
$utils = @{}
$utils['合并 Tailwind CSS 类名，自动处理冲突'] = 'Merge Tailwind CSS class names, auto-resolve conflicts'
$utils['用于 shadcn/ui 组件和全局样式合并'] = 'Used for shadcn/ui components and global style merging'
$utils['格式化文件大小显示'] = 'Format file size for display'
$utils['字节数'] = 'File size in bytes'
$utils['如 "1.5 MB"'] = 'e.g. "1.5 MB"'
$utils['生成带时间戳的唯一文件名，避免覆盖'] = 'Generate unique filename with timestamp to avoid overwrites'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\lib\utils.ts" $utils

# lib/stripe.ts
$stripe = @{}
$stripe['Stripe 服务端实例'] = 'Stripe server instance'
$stripe['使用懒加载避免构建时因缺少环境变量而报错'] = 'Lazy load to avoid build errors when env vars are missing'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\lib\stripe.ts" $stripe

# lib/supabase/client.ts
$sclient = @{}
$sclient['浏览器端 Supabase 客户端'] = 'Browser-side Supabase client'
$sclient['用于前端组件中直接操作用户数据（受RLS策略保护）'] = 'Used in frontend components for user data operations (protected by RLS policies)'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\lib\supabase\client.ts" $sclient

# lib/supabase/server.ts
$sserver = @{}
$sserver['服务端 Supabase 客户端（用于 Next.js API Routes / Server Components）'] = 'Server-side Supabase client (for Next.js API Routes / Server Components)'
$sserver['自动携带 cookie，可绕过RLS进行管理员操作（需Service Role Key）'] = 'Auto-carries cookies, can bypass RLS for admin operations (requires Service Role Key)'
$sserver['在 Server Component 中 set cookie 可能失败，可忽略'] = 'Setting cookie in Server Component may fail, can be ignored'
$sserver['同上'] = 'Same as above'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\lib\supabase\server.ts" $sserver

# middleware.ts
$mid = @{}
$mid['Next.js Middleware'] = 'Next.js Middleware'
$mid['保护需要登录的页面（如仪表盘），未登录用户重定向到登录页'] = 'Protects pages that require login (e.g. dashboard), redirects unauthenticated users to login'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\middleware.ts" $mid

# store/useStore.ts
$store = @{}
$store['用户角色类型'] = 'User role type'
$store['用户信息接口'] = 'User info interface'
$store['全局状态存储'] = 'Global state store'
$store['包含用户认证状态、额度信息、处理结果等'] = 'Contains user auth state, quota info, processing results etc.'
$store['访客模式额度（无登录用户）'] = 'Guest mode quota (no logged-in user)'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\store\useStore.ts" $store

# API: stripe/webhook/route.ts
$wh = @{}
$wh['Stripe Webhook 接收端点'] = 'Stripe Webhook endpoint'
$wh['处理支付成功事件，更新用户角色和订阅状态'] = 'Handle payment success events, update user role and subscription status'
$wh['需要在 Stripe Dashboard 中配置此端点，并设置签名密钥'] = 'Configure this endpoint in Stripe Dashboard and set the signing secret'
$wh['缺少签名'] = 'Missing signature'
$wh['Webhook 签名验证失败: '] = 'Webhook signature verification failed: '
$wh['更新用户角色'] = 'Update user role'
$wh['更新订阅记录'] = 'Update subscription record'
$wh['未处理的 Stripe 事件: '] = 'Unhandled Stripe event: '
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\api\stripe\webhook\route.ts" $wh

# API: stripe/checkout/route.ts
$co = @{}
$co['Stripe Checkout Session 创建接口'] = 'Stripe Checkout Session creation endpoint'
$co['接收前端传来的 priceId 和 mode，返回 Stripe Checkout URL'] = 'Receive priceId and mode from frontend, return Stripe Checkout URL'
$co['需要用户已登录'] = 'Requires user to be logged in'
$co['未登录'] = 'Not logged in'
$co['参数缺失'] = 'Missing parameters'
$co['查询或创建 Stripe Customer'] = 'Query or create Stripe Customer'
$co['创建支付会话失败'] = 'Failed to create checkout session'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\api\stripe\checkout\route.ts" $co

Write-Host "=== Phase 4 (lib/api/store) done ==="
