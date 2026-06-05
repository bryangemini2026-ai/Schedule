# 스케줄 공유 (Schedule Share)

두 사람의 월별 스케줄을 공유·비교하는 로컬 웹앱. 한 명은 간호사(D/E/Off), 다른 한 명은 회사원(특근/잔업 시간).

## 기능

- **A (간호사)**: D (주간) / E (야간) / / (오프) 세 가지 근무 형태
- **B (회사원)**: 특근 시간과 잔업 시간을 각각 숫자로 입력
- **메모**: 날짜별로 자유 메모
- **공휴일**: 한국 공휴일 자동 표시 (2024–2028, 신정·설날·3·1절·어린이날·부처님오신날·현충일·광복절·추석·개천절·한글날·성탄절 + 대체공휴일)
- **요일 색상**: 일요일 빨강, 토요일 파랑
- **자동 저장**: 입력 후 400ms 디바운스로 디스크에 영속
- **월별 요약**: D/E/OFF 일수, 특근/잔업 합계, 메모 개수

## 실행

```bash
node server.js
# 브라우저에서 http://localhost:3000
```

기본 포트: 3000. 변경은 `PORT=4000 node server.js`.

## 외부 접속 (Tailscale)

이 머신에 Tailscale이 실행 중이라면 폰에서도 접속 가능:

1. 폰에 [Tailscale](https://tailscale.com/download) 설치
2. 같은 계정으로 로그인
3. `http://homesub:3000` 접속 (Tailscale 켠 상태)

같은 WiFi(LAN)에서는 `http://<로컬 IP>:3000` 로도 가능.

## 기술 스택

- **백엔드**: Node.js (built-in `http` + `fs`, 의존성 0)
- **프론트엔드**: 단일 HTML 파일, 바닐라 JS, 외부 라이브러리 없음
- **저장소**: 로컬 `data/` 폴더의 JSON 파일

## 데이터

- `data/a.json` — A의 일자별 근무 (`"D" | "E" | "/"`)
- `data/b.json` — B의 일자별 시간 (`{ special, overtime }`)
- `data/messages.json` — 일자별 메모

API:
- `GET /api/{a,b,messages}` — 전체 조회
- `PUT /api/{a,b,messages}` — 전체 교체 (Body: JSON object)

## 버전 관리 (Git)

릴리스는 git tag로 관리.

```bash
git tag                     # 릴리스 목록
git log --oneline --decorate   # 히스토리
git checkout v0.0.1         # 과거 버전 보기 (코드+데이터)
git switch main             # 최신으로 복귀
git diff v0.0.1..v0.1.0     # 두 버전 비교
```

새 릴리스 절차:
1. `index.html` 푸터의 버전 문자열 수정
2. `git add . && git commit -m "v0.1.0: 변경 요약"`
3. `git tag -a v0.1.0 -m "v0.1.0"`

## 버전

| Tag | 설명 |
|-----|------|
| v0.0.1 | 초기 릴리스 (캘린더·D/E/·특근/잔업·메모·공휴일) |

## 라이선스

Private / Personal use.
