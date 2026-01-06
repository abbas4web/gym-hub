
$sourcePath = "C:/Users/MaidenCube/.gemini/antigravity/brain/57fbb1da-46d4-42c8-9cb4-d8657dd3f973/gym_hub_icon_1767705126111.png"
$baseDir = "c:\Users\MaidenCube\Documents\GitHub\gym-hub\android\app\src\main\res"

function Resize-Image {
    param([string]$Src, [string]$Dest, [int]$Width, [int]$Height)

    Add-Type -AssemblyName System.Drawing
    $srcImage = [System.Drawing.Image]::FromFile($Src)
    $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    # High-quality settings
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Draw full bleed - no padding
    $graphics.DrawImage($srcImage, 0, 0, $Width, $Height)
    $srcImage.Dispose()
    
    $destBitmap.Save($Dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Dispose()
    $graphics.Dispose()
}

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $targetFolder = Join-Path $baseDir $folder
    
    # Ensure directory exists
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder | Out-Null
    }

    # Overwrite typical icon files
    $destSquare = Join-Path $targetFolder "ic_launcher.png"
    Write-Host "Updating $destSquare ($size x $size)..."
    Resize-Image -Src $sourcePath -Dest $destSquare -Width $size -Height $size

    $destRound = Join-Path $targetFolder "ic_launcher_round.png"
    Write-Host "Updating $destRound ($size x $size)..."
    Resize-Image -Src $sourcePath -Dest $destRound -Width $size -Height $size
}

Write-Host "Icon update complete! (Full bleed)"
