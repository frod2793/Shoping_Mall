$files = @(
    "src/app/api/admin/dashboard/route.ts",
    "src/app/api/admin/login/route.ts",
    "src/app/api/admin/logout/route.ts",
    "src/app/api/admin/orders/[id]/status/route.ts",
    "src/app/api/admin/orders/route.ts",
    "src/app/api/admin/products/[id]/route.ts",
    "src/app/api/admin/products/route.ts",
    "src/app/api/admin/upload/route.ts",
    "src/app/api/orders/[id]/verify/route.ts",
    "src/app/api/orders/track/route.ts",
    "src/app/api/orders/route.ts",
    "src/app/api/products/[id]/route.ts",
    "src/app/api/products/image/[id]/route.ts",
    "src/app/api/products/route.ts",
    "src/app/page.tsx",
    "src/app/products/[id]/page.tsx"
)

foreach ($file in $files) {
    $path = Join-Path "d:\fork\Shoping_Mall" $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -notmatch "export const runtime = 'edge'") {
            $newContent = "export const runtime = 'edge';`r`n" + $content
            Set-Content -Path $path -Value $newContent -Encoding UTF8
            Write-Host "Updated $file"
        } else {
            Write-Host "Skipped $file (already has runtime)"
        }
    } else {
        Write-Host "Not found: $file"
    }
}
