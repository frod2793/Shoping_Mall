$env:USERPROFILE = "D:\fork\vercel_profile"
$env:APPDATA = "D:\fork\vercel_profile\AppData\Roaming"
$env:LOCALAPPDATA = "D:\fork\vercel_profile\AppData\Local"
$env:PATH = "D:\fork\node\node-v20.12.2-win-x64;" + $env:PATH

$node = "D:\fork\node\node-v20.12.2-win-x64\node.exe"
$vercel = "D:\fork\Shoping_Mall\node_modules\vercel\dist\index.js"

# Overwrite ADMIN_HOST with multiple allowed domains
& $node $vercel env add ADMIN_HOST production --value "admin-shoping-mall-six.vercel.app, admin.vitamin-mall.com" --force --yes
& $node $vercel env add ADMIN_HOST preview --value "admin-shoping-mall-six.vercel.app, admin.vitamin-mall.com" --force --yes

# Overwrite NEXT_PUBLIC_ADMIN_HOST with multiple allowed domains
& $node $vercel env add NEXT_PUBLIC_ADMIN_HOST production --value "admin-shoping-mall-six.vercel.app, admin.vitamin-mall.com" --force --yes
& $node $vercel env add NEXT_PUBLIC_ADMIN_HOST preview --value "admin-shoping-mall-six.vercel.app, admin.vitamin-mall.com" --force --yes

Write-Output "Admin host variables updated successfully!"
