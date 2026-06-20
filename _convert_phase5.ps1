
function Fix-File {
    param([string]$path, $replacements)
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    foreach ($pair in $replacements.GetEnumerator()) {
        $c = $c.Replace($pair.Key, $pair.Value)
    }
    [System.IO.File]::WriteAllText($path, $c, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Fixed: $path"
}

# compress
Fix-File "D:\projects\PDF工具\src\app\tools\compress\page.tsx" @{
    '"平衡"' = '"Balanced"'
}

# split
Fix-File "D:\projects\PDF工具\src\app\tools\split\page.tsx" @{
    'setError("页码Range无效");' = 'setError("Invalid page range");'
    '<Label htmlFor="range">页码Range（可选）</Label>' = '<Label htmlFor="range">Page Range (optional)</Label>'
    'placeholder="例如：1-3,5,7-9，留空则拆分全部页面"' = 'placeholder="e.g. 1-3,5,7-9, leave empty for all pages"'
    '成功拆分' = 'Successfully split'
    ' 页</p>' = ' page(s)</p>'
    '单页拆分模式' = 'Single page split mode'
    '包含多页' = 'contains multiple pages'
    '每页生成一个' = 'Generate one file per page'
    '支持格式' = 'Supported format'
    '用逗号分隔' = 'comma separated'
    '打包文件' = 'packaged file'
}

# rename
Fix-File "D:\projects\PDF工具\src\app\tools\rename\page.tsx" @{
    '批量PDF图纸重命名</h1>' = 'Batch Rename PDF</h1>'
    '加后缀' = 'Add Suffix'
    '正则替换' = 'Regex Replace'
    '图纸编号' = 'Drawing Number'
    '后缀' = 'Suffix'
    '正则表达式' = 'Regex Pattern'
    '替换为' = 'Replace With'
    '项目名称' = 'Project Name'
    '重命名预览' = 'Rename Preview'
    '处理中...' = 'Processing...'
    '开始重命名' = 'Start Rename'
    '重命名失败：' = 'Rename failed: '
    '图纸重命名' = 'Drawing Rename'
    '图纸编号规则批量重命名' = 'Drawing numbering rules batch rename'
    '上传与设置' = 'Upload & Settings'
    '重新保存以更新内部元数据' = 'Re-save to update internal metadata'
    '可以在这里设置文档标题等元数据' = 'Set document title and other metadata here'
    '下载打包文件' = 'Download ZIP'
}

# to-word
Fix-File "D:\projects\PDF工具\src\app\tools\to-word\page.tsx" @{
    '此文件由 PDF轻工具 转换生成。' = 'This file was converted by PDF Tools.'
    '注意：由于浏览器端技术限制，当前版本为演示框架。生产环境建议集成 pdfjs-dist + mammoth 实现完整文本提取与排版保留。' = 'Note: Due to browser-side limitations, this is a demo framework. For production, consider pdfjs-dist + mammoth for complete text extraction and layout preservation.'
    '转换完成！' = 'Conversion complete!'
    '提取所有文本内容' = 'Extract all text content'
    '本身不提供文本提取' = 'does not provide text extraction natively'
    '由于纯前端限制' = 'Due to pure frontend limitations'
    '这里作为演示框架生成可下载文档' = 'this demo generates a downloadable document'
    '真实项目可集成' = 'Production projects can integrate'
    '实现完整文本提取' = 'for full text extraction'
    '生成一个简单的' = 'Generate a simple'
    '实际上是带有' = 'actually with'
    '兼容大部分编辑器' = 'compatible with most editors'
    '真正的' = 'Real'
    '生成需要' = 'generation requires'
    '这里为了控制包体积使用' = 'Using for bundle size control'
    '当前版本为演示框架' = 'Current version is a demo framework'
    '文本内容' = 'text content'
    '生成可编辑的' = 'Generate editable'
}

Write-Host "=== Tool page UI text done ==="
