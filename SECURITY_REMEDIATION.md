# 2026-10 Next.js 보안 마이그레이션

기존 Yarn lockfile을 사용하며 Yarn 1.22.22와 Node.js 20.9 이상이 필요합니다. 검증은 Node.js 24.22.1에서 수행했습니다.

Next.js 14.1.4는 2026-10 보안 권고의 수정 버전이 제공되지 않는 계열입니다. 지원되는 Maintenance LTS 15.5.28로 옮기고 React/React DOM은 호환되는 18.3.1을 유지했습니다. sharp 0.35.5를 직접 고정해 Next.js 15의 optional dependency가 이전 sharp에 머물지 않도록 했습니다.

Next.js 15의 비동기 `params`를 영화 상세·메타데이터·출연진·제공사·유사 영화 화면에 반영했습니다. Next.js 15가 고정하는 PostCSS 8.4.31은 같은 8 계열의 수정 버전 8.5.23으로 제한하여 실제 CSS 빌드로 검증했습니다.

## 영화 API 장애 시 동작

기존 upstream 주소를 유지합니다. 홈과 영화 경로는 요청 시 렌더링하여 빌드가 외부 API 가용성에 의존하지 않습니다. 각 API 응답의 HTTP 상태, JSON Content-Type, 파싱과 소비하는 필드의 형태를 검사합니다. 요청은 5초로 제한하고, 네트워크 오류·타임아웃·잘못된 응답은 명시적인 장애 안내와 재시도 링크로 처리합니다. 정상적인 빈 목록은 장애와 다른 안내를 표시합니다.

`cache: "no-store"`를 사용하므로 성공 응답과 실패 응답 모두 영구 캐시하지 않습니다. 재시도 링크는 현재 페이지를 새로 요청하며, API 복구 후 다음 요청에서 정상 콘텐츠로 돌아옵니다. 자동 재시도는 추가하지 않았습니다. 이전 정적 캐시보다 upstream 요청 수가 늘어나는 선택이며, API의 안정성이 회복되면 성공 응답에만 적용하는 캐시를 별도로 검토할 수 있습니다. 영화 메타데이터·영상·출연진·US 제공사·유사 영화의 모든 소비자가 실패와 빈 데이터를 처리합니다. 테스트 데이터는 tests 디렉터리의 별도 mock 프로세스에서만 사용하며 프로덕션 코드나 일반 빌드에는 주입하지 않습니다.

## 검증과 외부 조건

- `yarn install --frozen-lockfile --ignore-scripts --non-interactive`와 `yarn typecheck`가 통과합니다.
- `yarn audit`의 현재 lockfile 경고는 0개입니다. 배포 상태나 향후 권고까지 보장하는 수치는 아닙니다.
- `.next`를 삭제하고 `NODE_OPTIONS='' yarn build`를 실행하여 mock 주입 없는 일반 프로덕션 빌드가 통과했습니다.
- `yarn test`의 API 테스트 78개가 통과했습니다. 6개 API의 정상/빈 결과, 비정상 HTTP 상태, HTML/잘못된 Content-Type, 파싱 실패, null/중첩 필드 오류, 네트워크/타임아웃 및 다음 요청의 복구를 확인합니다.
- `yarn test:routes:real`은 실제 upstream HTTP 404 상태에서 홈·소개·상세·출연진·제공사·유사 영화 6개 경로의 HTTP 200과 장애 안내, 상세 메타데이터 대체를 확인했습니다. 소개 페이지는 정상 콘텐츠를 유지합니다. 이 명령은 현재 장애 상태에 대한 수동 검증이며 upstream이 복구되면 장애 안내 기대값은 달라집니다.
- 같은 일반 빌드 산출물로 `yarn test:routes:mock`을 별도 실행했습니다. 실제 HTML에서 제목/점수/설명/홈페이지/탐색 링크/영상/출연진/제공사/유사 영화 콘텐츠, 빈 결과, 부분 실패, 성공→장애→복구를 확인했습니다. 프로덕션 서버의 캐시가 실패나 mock 응답을 다음 요청에 남기지 않는 것도 검증했습니다.

운영 환경에 대한 공격 요청은 실행하지 않았습니다. 수정 효과는 별도 배포 후 적용됩니다.

## 근거

- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w
- https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
