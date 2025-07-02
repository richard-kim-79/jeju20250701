# 제주 (Jeju) - 제주도 지역 정보 공유 SNS

제주도 지역 정보에 특화된 트위터 형식의 마이크로블로깅 소셜 미디어 플랫폼입니다.

## 🎯 프로젝트 개요

- **컨셉**: 제주도 지역 정보에 특화된 트위터 형식의 마이크로블로깅 소셜 미디어
- **핵심 가치**: 개방성, 단순성, 신속성, 확장성
- **기술 스택**: Next.js, TypeScript, Tailwind CSS, AWS OpenSearch

## ✨ 주요 기능

### 📱 사용자 기능
- **공개 피드**: 로그인 없이 모든 게시글 조회 가능
- **게시글 작성**: 로그인 후 300자 이내 텍스트 + 최대 4장 이미지 업로드
- **링크 자동 변환**: URL을 자동으로 클릭 가능한 링크로 변환
- **소셜 로그인**: 구글, 네이버, 카카오 계정으로 간편 로그인

### 🔍 검색 기능
- **의미 기반 검색**: AWS OpenSearch k-NN을 활용한 AI 기반 검색
- **키워드 검색**: 전통적인 키워드 매칭 검색
- **실시간 검색**: 타이핑과 동시에 검색 결과 제공

### 🔌 개발자 기능
- **Public API**: API Key를 통한 게시글 데이터 접근
- **RESTful API**: 표준 HTTP 메서드를 활용한 API 설계
- **Rate Limiting**: API 요청 횟수 제한으로 안정성 보장

## 🛠 기술 스택

### Frontend
- **Next.js 14**: App Router, SSR, TypeScript
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Heroicons**: 아이콘 라이브러리
- **Headless UI**: 접근성 고려한 UI 컴포넌트

### Backend
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **TypeScript**: 타입 안정성 보장

### 검색 엔진
- **AWS OpenSearch**: 완전 관리형 검색 서비스
- **k-NN (Vector Search)**: 의미 기반 검색을 위한 벡터 검색
- **HNSW 알고리즘**: 고성능 근사 최근접 이웃 검색

### 인프라
- **AWS S3**: 이미지 파일 저장
- **PostgreSQL**: 주 데이터베이스 (계획)
- **Firebase Auth**: 소셜 로그인 (계획)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- AWS 계정 (OpenSearch, S3 사용 시)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd jeju-sns
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jeju_sns"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Naver OAuth
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_CLIENT_SECRET="your-naver-client-secret"

# Kakao OAuth
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# AWS S3
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="jeju-sns-images"

# AWS OpenSearch
OPENSEARCH_ENDPOINT="your-opensearch-endpoint"
OPENSEARCH_USERNAME="your-opensearch-username"
OPENSEARCH_PASSWORD="your-opensearch-password"
```

4. **데이터베이스 설정**
```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
jeju-sns/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 라우트
│   │   │   ├── posts/      # 게시글 API
│   │   │   └── search/     # 검색 API
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   └── page.tsx        # 메인 페이지
│   ├── components/         # React 컴포넌트
│   │   ├── Header.tsx      # 헤더 컴포넌트
│   │   ├── SearchBar.tsx   # 검색바 컴포넌트
│   │   ├── PostCard.tsx    # 게시글 카드 컴포넌트
│   │   ├── PostFeed.tsx    # 게시글 피드 컴포넌트
│   │   └── LoginButton.tsx # 로그인 버튼 컴포넌트
│   ├── lib/               # 라이브러리 함수
│   │   └── opensearch.ts  # AWS OpenSearch 연동
│   ├── types/             # TypeScript 타입 정의
│   │   └── index.ts       # 공통 타입
│   └── utils/             # 유틸리티 함수
│       └── format.ts      # 포맷팅 함수
├── public/                # 정적 파일
├── package.json           # 프로젝트 설정
└── README.md             # 프로젝트 문서
```

## 🔧 개발 가이드

### 컴포넌트 개발
- 모든 컴포넌트는 TypeScript로 작성
- Tailwind CSS 클래스 사용
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)

### API 개발
- RESTful API 설계 원칙 준수
- 표준 HTTP 상태 코드 사용
- 일관된 응답 형식 유지

### 검색 기능 개발
- AWS OpenSearch k-NN 벡터 검색 활용
- 의미 기반 검색과 키워드 검색 병행
- 검색 성능 최적화

## 📈 개발 로드맵

### Phase 1: MVP (1-2개월)
- [x] 기본 UI/UX 구현
- [x] 게시글 CRUD 기능
- [x] 기본 검색 기능
- [ ] 사용자 인증 시스템
- [ ] 이미지 업로드 기능

### Phase 2: 기능 고도화 (1개월)
- [ ] 소셜 로그인 연동
- [ ] AWS OpenSearch 의미 기반 검색
- [ ] Public API 개발
- [ ] 성능 최적화

### Phase 3: 차별화 및 수익화 (1-2개월)
- [ ] 고급 검색 필터
- [ ] 광고 시스템
- [ ] 모바일 앱 개발
- [ ] 분석 대시보드

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**제주** - 제주도의 모든 정보를 한 곳에서 🏝️
