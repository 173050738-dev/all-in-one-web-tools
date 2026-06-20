
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

# FileUploader.tsx
$fu = @{}
$fu['拖拽文件到此处，或'] = 'Drag files here, or'
$fu['点击上传'] = 'browse to upload'
$fu['仅支持 PDF 格式'] = 'Only PDF files supported'
$fu['最多'] = 'Max'
$fu['个文件'] = 'files'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\components\FileUploader.tsx" $fu

# useQuotaGuard.ts
$q = @{}
$q['额度守卫 Hook'] = 'Quota Guard Hook'
$q['检查当前用户（或访客）是否有足够额度执行操作'] = 'Check if current user (or guest) has enough quota to perform operation'
$q['返回值包含是否允许、原因、最大文件数限制'] = 'Returns whether allowed, reason, max files limit'
$q['登录用户'] = 'Logged-in user'
$q['如果跨天了，重置额度（前端乐观重置，后端有trigger处理）'] = 'If day changed, reset quota (optimistic reset on frontend, trigger handles backend)'
$q['今日额度已用完（'] = 'Today quota exhausted ('
$q['次），请升级Pro获取更多额度'] = ' uses), upgrade to Pro for more quota'
$q['单次最多处理'] = 'Max '
$q['个文件，当前选择了'] = ' files per request, selected '
$q['个'] = ''
$q['访客模式（更严格）'] = 'Guest mode (stricter)'
$q['访客每日限2次，请登录或注册以获取更多额度'] = 'Guest limited to 2 uses/day. Log in or sign up for more quota'
$q['访客单次只能处理1个文件，请登录以处理更多'] = 'Guest can only process 1 file at a time. Log in to process more'
$q['乐观更新本地状态'] = 'Optimistic local state update'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\hooks\useQuotaGuard.ts" $q

Write-Host "=== Phase 3 done ==="
