const fs = require('fs');
const cp = require('child_process');
const files = cp.execSync('find src -type f -name "*.ts*"').toString().trim().split('\n');
for(let f of files) {
  if (!f) continue;
  let c = fs.readFileSync(f, 'utf8');
  if(c.includes("export const runtime = 'edge';")) {
    fs.writeFileSync(f, c.replace("export const runtime = 'edge';", ''));
    console.log('Fixed', f);
  }
}
