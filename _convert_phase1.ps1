function Convert-ChineseToEnglish {
    param([string]$path, $replacements)
    $bak = $path + ".bak"
    Copy-Item $path $bak -Force
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    foreach ($pair in $replacements.GetEnumerator()) {
        $c = $c.Replace($pair.Key, $pair.Value)
    }
    [System.IO.File]::WriteAllText($path, $c, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Done: $path"
}

# Register page
$reg = @{}
$reg['<CardTitle className="text-2xl">注册</CardTitle>'] = '<CardTitle className="text-2xl">Sign Up</CardTitle>'
$reg['<Label htmlFor="fullName">昵称</Label>'] = '<Label htmlFor="fullName">Display Name</Label>'
$reg['placeholder="您的称呼"'] = 'placeholder="Your name"'
$reg['<Label htmlFor="email">邮箱</Label>'] = '<Label htmlFor="email">Email</Label>'
$reg['<Label htmlFor="password">密码</Label>'] = '<Label htmlFor="password">Password</Label>'
$reg['placeholder="至少6位"'] = 'placeholder="At least 6 chars"'
$reg['注册成功'] = 'Registration Successful'
$reg['邮箱，点击验证链接完成注册。'] = 'email and click the verification link to complete registration.'
$reg['前往登录'] = 'Go to Login'
$reg['已有账号'] = 'Already have an account'
$reg['直接登录'] = 'Log In'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\register\page.tsx" $reg

# Pricing page
$pri = @{}
$pri['免费版'] = 'Free'
$pri['"每次最多5个文件"'] = '"Max 5 files per request"'
$pri['Pro 月度'] = 'Pro Monthly'
$pri['终身买断'] = 'Lifetime'
$pri['适合偶尔使用的个人用户'] = 'For occasional personal use'
$pri['适合高频使用的专业人士'] = 'For daily professional use'
$pri['一次付费，永久使用'] = 'Pay once, use forever'
$pri['免费开始'] = 'Get Started Free'
$pri['立即订阅'] = 'Subscribe Now'
$pri['终身拥有'] = 'Buy Lifetime'
$pri['最受欢迎'] = 'Most Popular'
$pri['选择适合您的方案'] = 'Choose Your Plan'
$pri['灵活的付费方式，满足不同场景需求'] = 'Flexible pricing for every need'
$pri['创建支付会话失败'] = 'Failed to create checkout session'
$pri['网络错误，请重试'] = 'Network error, please try again'
$pri['/月'] = '/mo'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\pricing\page.tsx" $pri

# Dashboard page
$dash = @{}
$dash['用户仪表盘'] = 'Dashboard'
$dash['查看您的额度、使用记录和订阅状态'] = 'View your quota, usage history, and subscription status'
$dash['当前套餐'] = 'Current Plan'
$dash['今日已用'] = "Today's Usage"
$dash['单次限额'] = 'Per-Request Limit'
$dash['额度进度'] = 'Quota Progress'
$dash['免费版'] = 'Free'
$dash['终身版'] = 'Lifetime'
$dash['个</span>'] = '</span>'
$dash['近期使用记录'] = 'Recent Activity'
$dash['升级Pro'] = 'Upgrade to Pro'
$dash['工具<'] = 'Tool<'
$dash['文件数<'] = 'Files<'
$dash['时间<'] = 'Time<'
$dash['暂无使用记录'] = 'No usage records yet'
$dash['zh-CN'] = 'en-US'
$dash['PDF压缩"]'] = 'PDF Compress"]'
$dash['PDF合并"]'] = 'PDF Merge"]'
$dash['PDF拆分"]'] = 'PDF Split"]'
$dash['PDF转Word"]'] = 'PDF to Word"]'
$dash['批量重命名"]'] = 'Batch Rename"]'
$dash['新建"]'] = 'New"]'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\dashboard\page.tsx" $dash

# Navbar
$nav = @{}
$nav['PDF轻工具'] = 'PDF Tools'
$nav['首页"'] = 'Home"'
$nav['定价"'] = 'Pricing"'
$nav['仪表盘"'] = 'Dashboard"'
$nav['退出"'] = 'Logout"'
$nav['登录"'] = 'Log In"'
$nav['免费注册"'] = 'Sign Up Free"'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\components\Navbar.tsx" $nav

Write-Host "=== Phase 1 complete ==="
