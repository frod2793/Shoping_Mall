$env:USERPROFILE = "D:\fork\vercel_profile"
$env:APPDATA = "D:\fork\vercel_profile\AppData\Roaming"
$env:LOCALAPPDATA = "D:\fork\vercel_profile\AppData\Local"
$env:PATH = "D:\fork\node\node-v20.12.2-win-x64;" + $env:PATH

$node = "D:\fork\node\node-v20.12.2-win-x64\node.exe"
$vercel = "D:\fork\Shoping_Mall\node_modules\vercel\dist\index.js"

# Overwrite CLIENT_HOST
& $node $vercel env add CLIENT_HOST production --value "vitamin-mall.com" --force --yes
& $node $vercel env add CLIENT_HOST preview --value "vitamin-mall.com" --force --yes

# Overwrite ADMIN_HOST
& $node $vercel env add ADMIN_HOST production --value "admin.vitamin-mall.com" --force --yes
& $node $vercel env add ADMIN_HOST preview --value "admin.vitamin-mall.com" --force --yes

# Overwrite NEXT_PUBLIC_CLIENT_HOST
& $node $vercel env add NEXT_PUBLIC_CLIENT_HOST production --value "vitamin-mall.com" --force --yes
& $node $vercel env add NEXT_PUBLIC_CLIENT_HOST preview --value "vitamin-mall.com" --force --yes

# Overwrite NEXT_PUBLIC_ADMIN_HOST
& $node $vercel env add NEXT_PUBLIC_ADMIN_HOST production --value "admin.vitamin-mall.com" --force --yes
& $node $vercel env add NEXT_PUBLIC_ADMIN_HOST preview --value "admin.vitamin-mall.com" --force --yes

Write-Output "All Vercel environment variables have been updated to vitamin-mall.com successfully!"
