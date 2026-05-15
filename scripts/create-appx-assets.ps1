$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$root = Split-Path -Parent $PSScriptRoot
$buildDir = Join-Path $root "build"
$appxDir = Join-Path $buildDir "appx"

New-Item -ItemType Directory -Force -Path $buildDir | Out-Null
New-Item -ItemType Directory -Force -Path $appxDir | Out-Null

function New-RoundedRectanglePath {
  param(
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $arc = New-Object System.Drawing.RectangleF($Rect.X, $Rect.Y, $diameter, $diameter)

  $path.AddArc($arc, 180, 90)
  $arc.X = $Rect.Right - $diameter
  $path.AddArc($arc, 270, 90)
  $arc.Y = $Rect.Bottom - $diameter
  $path.AddArc($arc, 0, 90)
  $arc.X = $Rect.X
  $path.AddArc($arc, 90, 90)
  $path.CloseFigure()

  return $path
}

function New-TubeDeskPng {
  param(
    [string]$Path,
    [int]$Width,
    [int]$Height,
    [switch]$Text
  )

  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)),
    ([System.Drawing.Color]::FromArgb(255, 8, 10, 20)),
    ([System.Drawing.Color]::FromArgb(255, 22, 26, 54)),
    45
  )
  $graphics.FillRectangle($bgBrush, 0, 0, $Width, $Height)

  $min = [Math]::Min($Width, $Height)
  $cx = $Width / 2
  $cy = if ($Text) { $Height * 0.40 } else { $Height * 0.50 }

  $cardW = $min * 0.70
  $cardH = $min * 0.55
  $cardX = $cx - ($cardW / 2)
  $cardY = $cy - ($cardH / 2)
  $radius = $min * 0.08

  $shadowRect = New-Object System.Drawing.RectangleF($cardX + ($min * 0.02), $cardY + ($min * 0.03), $cardW, $cardH)
  $shadowPath = New-RoundedRectanglePath -Rect $shadowRect -Radius $radius
  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 0, 0, 0))
  $graphics.FillPath($shadowBrush, $shadowPath)

  $cardRect = New-Object System.Drawing.RectangleF($cardX, $cardY, $cardW, $cardH)
  $cardPath = New-RoundedRectanglePath -Rect $cardRect -Radius $radius
  $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 26, 30, 55))
  $graphics.FillPath($cardBrush, $cardPath)
  $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 142, 152, 255), [Math]::Max(2, $min * 0.012))
  $graphics.DrawPath($cardPen, $cardPath)

  $barH = $cardH * 0.22
  $barRect = New-Object System.Drawing.RectangleF($cardX, $cardY, $cardW, $barH)
  $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 76, 88, 255))
  $graphics.FillRectangle($barBrush, $barRect)

  $dotSize = [Math]::Max(2, $min * 0.035)
  $dotY = $cardY + ($barH / 2) - ($dotSize / 2)
  $dotColors = @(
    [System.Drawing.Color]::FromArgb(255, 255, 92, 120),
    [System.Drawing.Color]::FromArgb(255, 255, 205, 90),
    [System.Drawing.Color]::FromArgb(255, 105, 230, 160)
  )
  for ($i = 0; $i -lt 3; $i++) {
    $dotBrush = New-Object System.Drawing.SolidBrush($dotColors[$i])
    $graphics.FillEllipse($dotBrush, $cardX + ($min * 0.08) + ($i * $dotSize * 1.6), $dotY, $dotSize, $dotSize)
    $dotBrush.Dispose()
  }

  $fontSize = [Math]::Max(10, [int]($min * 0.20))
  $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $td = "TD"
  $textSize = $graphics.MeasureString($td, $font)
  $tdBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 248, 248, 255))
  $graphics.DrawString($td, $font, $tdBrush, $cx - ($textSize.Width / 2), $cardY + $barH + (($cardH - $barH - $textSize.Height) / 2))

  $playBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 82, 116))
  $points = @(
    (New-Object System.Drawing.PointF($cx + ($min * 0.18), $cy + ($min * 0.02))),
    (New-Object System.Drawing.PointF($cx + ($min * 0.18), $cy + ($min * 0.12))),
    (New-Object System.Drawing.PointF($cx + ($min * 0.27), $cy + ($min * 0.07)))
  )
  $graphics.FillPolygon($playBrush, $points)

  if ($Text) {
    $titleFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(12, [int]($min * 0.11)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $subFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(8, [int]($min * 0.035)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $title = "TubeDesk"
    $titleSize = $graphics.MeasureString($title, $titleFont)
    $sub = "DESKTOP SHELL"
    $subSize = $graphics.MeasureString($sub, $subFont)
    $graphics.DrawString($title, $titleFont, $tdBrush, ($Width - $titleSize.Width) / 2, $Height * 0.70)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 186, 190, 218))
    $graphics.DrawString($sub, $subFont, $subBrush, ($Width - $subSize.Width) / 2, $Height * 0.84)
    $subBrush.Dispose()
    $titleFont.Dispose()
    $subFont.Dispose()
  }

  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $graphics.Dispose()
  $bitmap.Dispose()
  $bgBrush.Dispose()
  $shadowBrush.Dispose()
  $cardBrush.Dispose()
  $cardPen.Dispose()
  $barBrush.Dispose()
  $font.Dispose()
  $tdBrush.Dispose()
  $playBrush.Dispose()
}

$assets = @(
  @{ Name = "icon.png"; Width = 1024; Height = 1024; Text = $true; Root = $true },
  @{ Name = "StoreLogo.png"; Width = 50; Height = 50; Text = $false },
  @{ Name = "Square44x44Logo.png"; Width = 44; Height = 44; Text = $false },
  @{ Name = "Square150x150Logo.png"; Width = 150; Height = 150; Text = $false },
  @{ Name = "Square310x310Logo.png"; Width = 310; Height = 310; Text = $true },
  @{ Name = "Wide310x150Logo.png"; Width = 310; Height = 150; Text = $false },
  @{ Name = "SplashScreen.png"; Width = 620; Height = 300; Text = $true }
)

foreach ($asset in $assets) {
  $target = if ($asset.Root) { Join-Path $buildDir $asset.Name } else { Join-Path $appxDir $asset.Name }
  New-TubeDeskPng -Path $target -Width $asset.Width -Height $asset.Height -Text:([bool]$asset.Text)

  if (-not $asset.Root) {
    Copy-Item $target (Join-Path $buildDir $asset.Name) -Force
  }
}

# Common scaled tile variants. These help prevent Store validation from finding Electron defaults.
$scales = @(100, 125, 150, 200, 400)
$baseSizes = @{
  "StoreLogo" = @{ W = 50; H = 50; Text = $false }
  "Square44x44Logo" = @{ W = 44; H = 44; Text = $false }
  "Square150x150Logo" = @{ W = 150; H = 150; Text = $false }
  "Square310x310Logo" = @{ W = 310; H = 310; Text = $true }
  "Wide310x150Logo" = @{ W = 310; H = 150; Text = $false }
}

foreach ($name in $baseSizes.Keys) {
  foreach ($scale in $scales) {
    $w = [Math]::Round($baseSizes[$name].W * $scale / 100)
    $h = [Math]::Round($baseSizes[$name].H * $scale / 100)
    $file = "$name.scale-$scale.png"
    New-TubeDeskPng -Path (Join-Path $appxDir $file) -Width $w -Height $h -Text:([bool]$baseSizes[$name].Text)
    Copy-Item (Join-Path $appxDir $file) (Join-Path $buildDir $file) -Force
  }
}

Write-Host "Generated TubeDesk AppX tile assets in $buildDir and $appxDir"
Get-ChildItem $buildDir -Filter *.png | Select-Object Name, Length
