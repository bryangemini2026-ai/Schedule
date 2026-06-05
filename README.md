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
| v0.1.0 | UI 리디자인 (따뜻한 팔레트·글래스모피즘·요약 stat) |
| v0.1.1 | Today 버튼 동작 수정 (셀 선택 연동) |
| v0.2.0 | 스케줄 입력 시스템 개선 (키보드 D/E/·다중선택·일괄 적용·필터 토글) |
| v0.2.1 | A 분홍, B 파랑, OFF 인디고, B 시간 레벨별 색상 (≤1.0/2.5/4.5/>4.5h) |
| v0.2.2 | OFF 분홍(D동일)·진한 배경, B-3(4.5h) 어두운 배경 |

## 색상 레전드

### A (간호사 D/E/Off)
| 상태 | 텍스트 | 배경 |
|------|--------|------|
| D (데이) | pink-500 `#ec4899` | pink-50 `#fdf2f8` |
| E (이브닝) | orange-700 `#d97706` | orange-50 `#fffbeb` |
| OFF (/) | pink-500 `#ec4899` | pink-200 `#fbcfe8` (D보다 진함) |

### B (회사원 시간 합계)
| 구간 | 텍스트 | 배경 |
|------|--------|------|
| ≤ 1.0h | blue-500 `#3b82f6` | blue-100 `#dbeafe` |
| 1.0h < x ≤ 2.5h | blue-700 `#1d4ed8` | blue-200 `#bfdbfe` |
| 2.5h < x ≤ 4.5h | blue-100 `#dbeafe` | blue-700 `#1d4ed8` |
| > 4.5h (7.0h 포함) | blue-100 `#dbeafe` | blue-900 `#1e3a8a` |

## 라이선스

Private / Personal use.
