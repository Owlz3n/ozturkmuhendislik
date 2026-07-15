Add-Type -AssemblyName System.Drawing

# Kaynak logo dosyasini bul
$files = Get-ChildItem -Path (Get-Location).Path -Filter '*.jpeg'
$src = [System.Drawing.Image]::FromFile($files[0].FullName)
Write-Host "Kaynak:" $files[0].Name "(" $src.Width "x" $src.Height ")"

# Kare kirpma - merkezdeki yapragi ve yaziyi al
$cropSize = $src.Height
$cropX = [int](($src.Width - $cropSize) / 2)
$cropY = 0
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)

# Oncelikle kare kirpma yap (buyuk boyutta)
$croppedBmp = New-Object System.Drawing.Bitmap($cropSize, $cropSize)
$gc = [System.Drawing.Graphics]::FromImage($croppedBmp)
$gc.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gc.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$gc.Dispose()
$src.Dispose()

# Arka plani seffaf yap (acik renkli pikselleri kaldir)
# Arka plan acik bej/beyaz renkte, esik degerini kullanarak kaldiracagiz
$threshold = 220  # Bu degerden yuksek parlakliga sahip pikseller seffaf olacak

for ($y = 0; $y -lt $croppedBmp.Height; $y++) {
    for ($x = 0; $x -lt $croppedBmp.Width; $x++) {
        $pixel = $croppedBmp.GetPixel($x, $y)
        # Piksel cok acik renkteyse (arka plan) seffaf yap
        if ($pixel.R -gt $threshold -and $pixel.G -gt $threshold -and $pixel.B -gt $threshold) {
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        # Yarim seffaf gecis icin (kenar yumusatma)
        elseif ($pixel.R -gt ($threshold - 20) -and $pixel.G -gt ($threshold - 20) -and $pixel.B -gt ($threshold - 20)) {
            $brightness = [int](($pixel.R + $pixel.G + $pixel.B) / 3)
            $alpha = [Math]::Max(0, [Math]::Min(255, [int]((255 - $brightness) * 3)))
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
        }
    }
}

Write-Host "Arka plan seffaf yapildi"

# 64x64 boyutuna kucult
$favSize = 64
$bmp = New-Object System.Drawing.Bitmap($favSize, $favSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver

# Seffaf arka plan
$g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

$destRect = New-Object System.Drawing.Rectangle(0, 0, $favSize, $favSize)
$srcRect2 = New-Object System.Drawing.Rectangle(0, 0, $croppedBmp.Width, $croppedBmp.Height)
$g.DrawImage($croppedBmp, $destRect, $srcRect2, [System.Drawing.GraphicsUnit]::Pixel)

$outPath = Join-Path (Get-Location).Path 'favicon.png'
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$croppedBmp.Dispose()

Write-Host "Favicon olusturuldu: favicon.png (64x64, seffaf arka plan)"
