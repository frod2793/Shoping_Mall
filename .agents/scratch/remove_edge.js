/**
 * @description [기능]: Next.js API 및 Dynamic 페이지 경로에 들어있는 'export const runtime = 'edge';'를 자동으로 안전하게 제거하는 스크립트입니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: 최초 작성
 */

const fs = require('fs');
const path = require('path');

const targetFiles = [
    'src/app/page.tsx',
    'src/app/products/[id]/page.tsx',
    'src/app/api/admin/dashboard/route.ts',
    'src/app/api/admin/login/route.ts',
    'src/app/api/admin/logout/route.ts',
    'src/app/api/admin/orders/[id]/status/route.ts',
    'src/app/api/admin/orders/route.ts',
    'src/app/api/admin/products/[id]/route.ts',
    'src/app/api/admin/products/route.ts',
    'src/app/api/admin/upload/route.ts',
    'src/app/api/orders/[id]/verify/route.ts',
    'src/app/api/orders/track/route.ts',
    'src/app/api/orders/route.ts',
    'src/app/api/products/[id]/route.ts',
    'src/app/api/products/image/[id]/route.ts',
    'src/app/api/products/route.ts'
];

targetFiles.forEach((relPath) =>
{
    const fullPath = path.join(__dirname, '../../', relPath);
    if (fs.existsSync(fullPath) === true)
    {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // UTF-8 BOM 제거
        if (content.startsWith('\uFEFF') === true)
        {
            content = content.slice(1);
        }

        // edge 설정 제거
        if (content.includes("export const runtime = 'edge';\n") === true)
        {
            const updatedContent = content.replace("export const runtime = 'edge';\n", "");
            fs.writeFileSync(fullPath, updatedContent, 'utf8');
            console.log(`[RemoveEdge] 성공적으로 Edge 설정을 제거했습니다: ${relPath}`);
        }
        else if (content.includes("export const runtime = 'edge';") === true)
        {
            const updatedContent = content.replace("export const runtime = 'edge';", "");
            fs.writeFileSync(fullPath, updatedContent, 'utf8');
            console.log(`[RemoveEdge] 성공적으로 Edge 설정을 제거했습니다: ${relPath}`);
        }
        else
        {
            console.log(`[RemoveEdge] Edge 설정이 없습니다: ${relPath}`);
        }
    }
    else
    {
        console.error(`[RemoveEdge] 파일을 찾을 수 없습니다: ${relPath}`);
    }
});
