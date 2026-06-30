/**
 * @description [기능]: Next.js API 및 Dynamic 페이지 경로에 'export const runtime = 'edge';'를 자동으로 안전하게 삽입하는 임시 스크립트입니다.
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

        // 이미 edge 설정이 되어 있는지 체크
        if (content.includes("runtime = 'edge'") === false && content.includes('runtime = "edge"') === false)
        {
            // 파일의 가장 처음에 edge 선언 추가
            const updatedContent = `export const runtime = 'edge';\n` + content;
            fs.writeFileSync(fullPath, updatedContent, 'utf8');
            console.log(`[InjectEdge] 성공적으로 Edge 설정을 추가했습니다: ${relPath}`);
        }
        else
        {
            console.log(`[InjectEdge] 이미 Edge 설정이 되어 있습니다: ${relPath}`);
        }
    }
    else
    {
        console.error(`[InjectEdge] 파일을 찾을 수 없습니다: ${relPath}`);
    }
});
