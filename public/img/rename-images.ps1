# Renames the photo set to SEO-friendly filenames.
#
# Run it from the folder that contains the photos:
#   cd $HOME\Desktop\cruisebelgrade\public\img
#   powershell -ExecutionPolicy Bypass -File .\rename-images.ps1
#
# It reports every file it cannot find rather than failing silently, and it
# will not overwrite an existing file.

$map = @{
  # Night shots — the strongest material, use these for heroes
  "PXL_20260819_183148679_MP.jpg"        = "brankov-most-night-belgrade-boat-tour.jpg"
  "PXL_20260727_191248931_MP.jpg"        = "gazela-bridge-night-belgrade-river-cruise.jpg"
  "PXL_20260819_184121953.jpg"           = "kula-belgrade-tower-night-sava-cruise.jpg"
  "PXL_20260819_183257287.jpg"           = "belgrade-waterfront-night-boat-tour.jpg"

  # Sunset and golden hour
  "PXL_20260618_175457629.jpg"           = "danube-sunset-forest-bank-belgrade.jpg"
  "IMG_20250623_204527.jpg"              = "most-na-adi-sunset-belgrade-boat-tour.jpg"
  "PXL_20251102_143247383.jpg"           = "couple-sunset-private-boat-tour-belgrade.jpg"
  "PXL_20260701_181655060.jpg"           = "sava-river-belgrade-old-town-dusk.jpg"

  # Daytime
  "IMG-b2c1cd3297da1749d1ff30f61263a706-V__1_.jpg" = "guest-relaxing-bow-danube-summer-cruise.jpg"
  "IMG_20230305_134034.jpg"              = "most-na-adi-sava-river-belgrade-boat.jpg"
  "IMG_20240203_132001.jpg"              = "boat-bow-calm-water-belgrade-river.jpg"

  # Boat and marina — trust signals, not heroes
  "PXL_20260728_150754319.jpg"           = "boat-helm-cockpit-belgrade-river-tour.jpg"
  "PXL_20251231_141542257.jpg"           = "marina-cukaricki-rukavac-belgrade-boats.jpg"
}

$renamed = 0
$missing = @()

foreach ($old in $map.Keys) {
  if (Test-Path $old) {
    $new = $map[$old]
    if (Test-Path $new) {
      Write-Host "SKIP  $new already exists" -ForegroundColor Yellow
    } else {
      Rename-Item -Path $old -NewName $new
      Write-Host "OK    $old -> $new" -ForegroundColor Green
      $renamed++
    }
  } else {
    $missing += $old
  }
}

Write-Host ""
Write-Host "Renamed $renamed of $($map.Count) files."

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "Not found in this folder:" -ForegroundColor Yellow
  $missing | ForEach-Object { Write-Host "  $_" }
  Write-Host "Check you are in the folder holding the photos."
}
