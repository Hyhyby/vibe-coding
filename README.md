## 오늘의 띠별 운세 - 개발 가이드

### 시작하기
1. 로컬 서버 실행(파이썬):
   - `py -m http.server 5500`
   - 열기: `http://localhost:5500/my-webpage/`

2. 카카오톡 공유 설정
   - `assets/kakao-config.sample.js`를 `assets/kakao-config.js`로 복사 후 키 입력:
     ```js
     window.KAKAO_APP_KEY = '카카오_JavaScript_키';
     ```
   - Kakao Developers → 앱 설정 → 플랫폼 → Web 도메인에 `http://localhost:5500` 추가

3. 운세 데이터(API → 로컬)
   - `assets/fetch-fortunes.ps1 -ApiUrl "https://example.com/zodiac.json"`
   - 저장 위치: `assets/fortunes.json`

### 배포 팁
- 민감 정보가 담긴 `assets/kakao-config.js`는 `.gitignore`로 커밋 제외됨
- 필요 시 `assets/kakao-config.sample.js`만 커밋하세요

