/**
 * @description [기능]: 로컬 DB 접근성 및 API 동기화 검증용 자체 테스트 스크립트
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: 최초 작성 및 DB 동기화 검증 로직 구현
 */

import { prisma } from '../src/infrastructure/database/prisma';

async function func_RunTest()
{
    console.log("[test_db_sync] DB 연결 확인 및 검증용 임시 상품 입력을 시작합니다.");
    let testProduct: any = null;

    try
    {
        // 1. 로컬 DB에 임의의 상품 데이터를 기입
        testProduct = await prisma.product.create({
            data: {
                name: "검증용_테스트_상품_윤승종",
                description: "로컬 DB 동기화 검증용 임시 상품 데이터입니다.",
                price: 99999,
                stock: 10,
                category: "아크릴 키링"
            }
        });

        console.log(`[test_db_sync] DB 상품 기입 성공. ID: ${testProduct.id}`);

        // 2. API 조회를 통해 즉각적인 동기화 검증 (3002 포트 사용)
        const targetUrl = 'http://localhost:3002/api/products';
        console.log(`[test_db_sync] API 조회를 시작합니다. 대상 URL: ${targetUrl}`);

        const response = await fetch(targetUrl);
        if (!response.ok)
        {
            throw new Error(`[test_db_sync] API 호출에 실패했습니다. 상태 코드: ${response.status}`);
        }

        const products = await response.json();
        
        if (!Array.isArray(products))
        {
            throw new Error("[test_db_sync] 반환된 상품 데이터 형식이 배열이 아닙니다.");
        }

        const found = products.find((p: any) =>
        {
            return p.id === testProduct.id;
        });

        if (found != null)
        {
            console.log("[test_db_sync] 로컬 DB 즉각 API 동기화 검증 성공! 기입된 상품을 API에서 정상적으로 확인했습니다.");
        }
        else
        {
            throw new Error("[test_db_sync] 동기화 검증 실패. DB에는 기입되었으나 API 응답 목록에 존재하지 않습니다.");
        }
    }
    catch (error: any)
    {
        console.error(`[test_db_sync] 테스트 수행 중 오류 발생: ${error.message}`);
        process.exitCode = 1;
    }
    finally
    {
        if (testProduct != null)
        {
            try
            {
                // 3. 테스트용 dummy 상품 로컬 DB에서 삭제
                await prisma.product.delete({
                    where: {
                        id: testProduct.id
                    }
                });
                console.log("[test_db_sync] 임시 테스트 상품에 대한 DB Cleanup을 정상 완료했습니다.");
            }
            catch (cleanupError: any)
            {
                console.error(`[test_db_sync] DB Cleanup 중 오류 발생: ${cleanupError.message}`);
                process.exitCode = 1;
            }
        }
        await prisma.$disconnect();
        console.log("[test_db_sync] 테스트 프로세스가 종료되었습니다.");
    }
}

func_RunTest();
