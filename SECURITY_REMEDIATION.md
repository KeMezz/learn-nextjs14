# 2026-10 Next.js 보안 마이그레이션

기존 Yarn lockfile을 사용하며 Yarn 1.22.22와 Node.js 20.9 이상이 필요합니다. 검증은 Node.js 24.22.1에서 수행했습니다.

Next.js 14.1.4는 2026-10 보안 권고의 수정 버전이 제공되지 않는 계열입니다. 지원되는 Maintenance LTS 15.5.28로 옮기고 React/React DOM은 호환되는 18.3.1을 유지했습니다. sharp 0.35.5를 직접 고정해 Next.js 15의 optional dependency가 이전 sharp에 머물지 않도록 했습니다.

Next.js 15의 비동기 `params`를 영화 상세·메타데이터·출연진·제공사·유사 영화 화면에 반영했습니다. `fetch`의 `force-cache`를 명시해 Next.js 14의 기존 캐시 동작을 유지합니다. Next.js 15가 고정하는 PostCSS 8.4.31은 같은 8 계열의 수정 버전 8.5.23으로 제한하여 실제 CSS 빌드로 검증했습니다.

## 검증과 외부 조건

- `yarn install --frozen-lockfile --ignore-scripts`와 `yarn typecheck`가 통과합니다.
- `yarn audit`의 현재 lockfile 경고는 0개입니다. 배포 상태나 향후 권고까지 보장하는 수치는 아닙니다.
- 실제 영화 API가 JSON 대신 HTML을 반환하여 일반 `yarn build`는 홈 화면 prerender에서 실패했습니다. API 응답을 로컬 fixture로 대체한 환경에서는 프로덕션 빌드, 홈·소개·상세·출연진·제공사·유사 영화 6개 경로의 HTTP 200과 본문 검사가 통과했습니다. 실서비스 API의 정상 응답을 확인한 뒤 배포해야 합니다.

운영 환경에 대한 공격 요청은 실행하지 않았습니다. 수정 효과는 별도 배포 후 적용됩니다.

## 근거

- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w
- https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
