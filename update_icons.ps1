
$sourcePath = "C:/Users/MaidenCube/.gemini/antigravity/brain/57fbb1da-46d4-42c8-9cb4-d8657dd3f973/gym_hub_icon_1767705126111.png"
$baseDir = "c:\Users\MaidenCube\Documents\GitHub\gym-hub\android\app\src\main\res"

# Function to resize image
function Resize-Image {
    param([string]$Src, [string]$Dest, [int]$Width, [int]$Height)

    Add-Type -AssemblyName System.Drawing
    $srcImage = [System.Drawing.Image]::FromFile($Src)
    $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

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
    
    # Create directory if it doesn't exist (though it should)
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder | Out-Null
    }

    # Replace ic_launcher.png
    $destSquare = Join-Path $targetFolder "ic_launcher.png"
    Write-Host "Updating $destSquare ($size x $size)..."
    Resize-Image -Src $sourcePath -Dest $destSquare -Width $size -Height $size

    # Replace ic_launcher_round.png (Using same image for simplicity, usually masked by OS)
    $destRound = Join-Path $targetFolder "ic_launcher_round.png"
    Write-Host "Updating $destRound ($size x $size)..."
    Resize-Image -Src $sourcePath -Dest $destRound -Width $size -Height $size
}

Write-Host "Icon update complete!"
