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

# Tool: Compress
$t = @{}
$t['PDF压缩</h1>'] = 'Compress PDF</h1>'
$t['减小PDF文件体积，支持超大图纸（A0/A1）智能压缩'] = 'Reduce PDF file size with intelligent compression, supports large blueprints (A0/A1)'
$t['上传文件'] = 'Upload Files'
$t['压缩质量</Label>'] = 'Compression Quality</Label>'
$t['强力压缩'] = 'Maximum'
$t['轻度压缩'] = 'Light'
$t['处理中...'] = 'Processing...'
$t['开始压缩'] = 'Start Compress'
$t['原大小'] = 'Original Size'
$t['压缩后'] = 'Compressed Size'
$t['压缩率'] = 'Compression Ratio'
$t['下载压缩后的文件'] = 'Download Compressed File'
$t['处理失败：'] = 'Processing failed: '
$t['额度不足'] = 'Insufficient quota'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\tools\compress\page.tsx" $t

# Tool: Merge
$t2 = @{}
$t2['PDF合并</h1>'] = 'Merge PDF</h1>'
$t2['多文件拖拽排序，一键合并为单个PDF'] = 'Drag and arrange multiple files, merge into one PDF with one click'
$t2['上传文件（可排序）'] = 'Upload Files (Reorderable)'
$t2['调整合并顺序：'] = 'Arrange merge order:'
$t2['合并中...'] = 'Merging...'
$t2['开始合并'] = 'Start Merge'
$t2['合并完成！'] = 'Merge complete!'
$t2['下载合并后的文件'] = 'Download Merged File'
$t2['请至少上传2个PDF文件进行合并'] = 'Please upload at least 2 PDF files to merge'
$t2['额度不足'] = 'Insufficient quota'
$t2['合并失败：'] = 'Merge failed: '
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\tools\merge\page.tsx" $t2

# Tool: Split
$t3 = @{}
$t3['PDF拆分</h1>'] = 'Split PDF</h1>'
$t3['按页数或范围拆分PDF，支持批量打包下载'] = 'Split PDF by page count or range, supports batch zip download'
$t3['上传与设置'] = 'Upload & Settings'
$t3['拆分为'] = 'Split into'
$t3['每页一个文件'] = 'One file per page'
$t3['自定义范围'] = 'Custom range'
$t3['范围'] = 'Range'
$t3['请输入拆分范围，例如 1-3,5,7-9'] = 'Enter split ranges, e.g. 1-3,5,7-9'
$t3['拆分中...'] = 'Splitting...'
$t3['开始拆分'] = 'Start Split'
$t3['下载全部（ZIP打包）'] = 'Download All (ZIP)'
$t3['下载'] = 'Download'
$t3['请先上传一个PDF文件'] = 'Please upload a PDF file first'
$t3['额度不足'] = 'Insufficient quota'
$t3['拆分失败：'] = 'Split failed: '
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\tools\split\page.tsx" $t3

# Tool: Rename
$t4 = @{}
$t4['批量重命名</h1>'] = 'Batch Rename</h1>'
$t4['图纸编号、正则规则批量重命名PDF文件'] = 'Drawing numbering and regex rules for batch renaming PDF files'
$t4['上传与重命名规则'] = 'Upload & Rename Rules'
$t4['重命名规则'] = 'Rename Rules'
$t4['前缀'] = 'Prefix'
$t4['起始编号'] = 'Starting Number'
$t4['位数'] = 'Digits'
$t4['分隔符'] = 'Separator'
$t4['预览重命名结果'] = 'Preview Rename Results'
$t4['原文件名'] = 'Original Name'
$t4['新文件名'] = 'New Name'
$t4['执行重命名并下载'] = 'Execute Rename & Download'
$t4['重命名中...'] = 'Processing...'
$t4['请先上传文件'] = 'Please upload files first'
$t4['额度不足'] = 'Insufficient quota'
$t4['操作失败：'] = 'Operation failed: '
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\tools\rename\page.tsx" $t4

# Tool: To-Word
$t5 = @{}
$t5['PDF转Word</h1>'] = 'PDF to Word</h1>'
$t5['将PDF中的文本内容和表格提取为可编辑的Word文档'] = 'Extract text content and tables from PDF into editable Word documents'
$t5['上传与转换'] = 'Upload & Convert'
$t5['转换中...'] = 'Converting...'
$t5['开始转换'] = 'Start Convert'
$t5['下载Word文档'] = 'Download Word Document'
$t5['请先上传一个PDF文件'] = 'Please upload a PDF file first'
$t5['额度不足'] = 'Insufficient quota'
$t5['转换失败：'] = 'Conversion failed: '
$t5['该PDF不包含可提取的文本，可能是扫描件'] = 'This PDF contains no extractable text. It may be a scanned document.'
Convert-ChineseToEnglish "D:\projects\PDF工具\src\app\tools\to-word\page.tsx" $t5

Write-Host "=== Tool pages done ==="
