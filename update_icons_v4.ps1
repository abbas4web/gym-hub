
$sourcePath = "C:/Users/MaidenCube/.gemini/antigravity/brain/57fbb1da-46d4-42c8-9cb4-d8657dd3f973/gym_hub_icon_1767705126111.png"
$baseDir = "c:\Users\MaidenCube\Documents\GitHub\gym-hub\android\app\src\main\res"

function Resize-Image-AggressiveZoom {
    param([string]$Src, [string]$Dest, [int]$Width, [int]$Height)

    Add-Type -AssemblyName System.Drawing
    $srcImage = [System.Drawing.Image]::FromFile($Src)
    $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Crop 16% from each side (Aggressive zoom to remove ALL rounded corners)
    $cropMargin = [math]::Round($srcImage.Width * 0.16) 
    $cropWidth = $srcImage.Width - ($cropMargin * 2)
    $cropHeight = $srcImage.Height - ($cropMargin * 2)
    
    # Define source rectangle (center crop)
    $srcRect = New-Object System.Drawing.Rectangle($cropMargin, $cropMargin, $cropWidth, $cropHeight)
    # Define destination rectangle (full size)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)

    $graphics.DrawImage($srcImage, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
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
    
    if (-not (Test-Path $targetFolder)) { New-Item -ItemType Directory -Path $targetFolder | Out-Null }

    $destSquare = Join-Path $targetFolder "ic_launcher.png"
    Write-Host "Updating (Aggressive Zoom) $destSquare..."
    Resize-Image-AggressiveZoom -Src $sourcePath -Dest $destSquare -Width $size -Height $size

    $destRound = Join-Path $targetFolder "ic_launcher_round.png"
    Write-Host "Updating (Aggressive Zoom) $destRound..."
    Resize-Image-AggressiveZoom -Src $sourcePath -Dest $destRound -Width $size -Height $size
}

Write-Host "Icon update complete (Aggressive Zoom)!"
