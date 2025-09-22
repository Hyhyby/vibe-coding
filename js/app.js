document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('actionButton');
    const kakaoShareBtn = document.getElementById('kakaoShare');
    const kakaoStatus = document.getElementById('kakaoStatus');
    const zodiacGrid = document.querySelector('.zodiac-grid');
    const outputType = document.getElementById('outputType');
    const outputText = document.getElementById('outputText');
    const outputMeta = document.getElementById('outputMeta');

    if (!button || !zodiacGrid || !outputType || !outputText || !outputMeta) {
        console.warn('Required elements not found.');
        return;
    }

    let fortunesByZodiac = {
        rat: [
            '새로운 연락이 찾아옵니다. 먼저 반갑게 응대하세요.',
            '작은 정리가 큰 효율을 만듭니다. 책상 정리 추천!',
            '금전운 보통, 지출을 기록하면 안정됩니다.',
        ],
        ox: [
            '꾸준함이 빛나는 날. 밀린 일을 차근히 해결해보세요.',
            '건강운 양호. 가벼운 스트레칭으로 컨디션 업!',
            '평온함 속에서 좋은 아이디어가 싹틉니다.',
        ],
        tiger: [
            '도전운 상승! 해보고 싶던 일을 시도해보세요.',
            '주변의 격려가 힘이 됩니다. 감사 표현 잊지 마세요.',
            '작은 행운이 따라옵니다. 긍정적인 마음 유지!',
        ],
        rabbit: [
            '휴식이 필요합니다. 마음을 쉬게 하는 시간을 가지세요.',
            '소소하지만 확실한 행복을 느끼는 하루.',
            '대화운 좋음. 솔직함이 관계를 단단하게 합니다.',
        ],
        dragon: [
            '존재감이 드러나는 날. 자신감을 표현해보세요.',
            '협업운 호조. 함께하면 더 빠르고 즐겁습니다.',
            '금전운 무난. 계획적 지출로 안정감을 챙기세요.',
        ],
        snake: [
            '관찰력이 돋보입니다. 놓친 디테일을 발견하게 됩니다.',
            '지적 호기심이 커집니다. 배움을 즐겨보세요.',
            '평정심을 유지하면 좋은 결과가 따릅니다.',
        ],
        horse: [
            '활동성이 높아집니다. 가벼운 운동이 행운을 부릅니다.',
            '사교운 상승. 새로운 인맥이 생길 수 있어요.',
            '속도 조절이 관건. 급할수록 돌아가세요.',
        ],
        goat: [
            '감수성이 풍부해집니다. 예술 감상에 좋은 날.',
            '가족운 호조. 따뜻한 대화가 위로가 됩니다.',
            '작은 선물이 행운을 가져옵니다.',
        ],
        monkey: [
            '재치가 빛나는 날. 유머가 분위기를 살립니다.',
            '문제 해결 능력이 돋보입니다. 자신감을 가지세요.',
            '새로운 앱/툴이 생산성을 올려줍니다.',
        ],
        rooster: [
            '정돈과 계획이 운을 부릅니다. 체크리스트를 써보세요.',
            '평소 미뤘던 일을 끝내기 좋습니다.',
            '칭찬이 큰 동력이 됩니다. 스스로 칭찬도 해주세요.',
        ],
        dog: [
            '신뢰가 핵심인 날. 약속을 지키면 좋은 기회가 옵니다.',
            '건강운 무난. 수분 섭취에 신경 써보세요.',
            '도움 요청을 받으면 기쁜 마음으로 응대하세요.',
        ],
        pig: [
            '여유가 행운을 부릅니다. 천천히 하지만 꾸준히.',
            '맛있는 음식이 좋은 인연을 부릅니다.',
            '수입·지출 균형이 맞아 안정감을 느낍니다.',
        ],
    };

    const loadExternalFortunes = async () => {
        try {
            const res = await fetch('assets/fortunes.json', { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            if (data && typeof data === 'object') {
                fortunesByZodiac = { ...fortunesByZodiac, ...data };
                console.log('Loaded fortunes.json');
            }
        } catch (e) {
            console.warn('Could not load fortunes.json');
        }
    };

    const palette = [
        ['#0f172a', '#60a5fa'],
        ['#1f2937', '#34d399'],
        ['#111827', '#f472b6'],
        ['#0b1020', '#fbbf24'],
        ['#0f766e', '#93c5fd'],
        ['#1e293b', '#a78bfa'],
        ['#052e2b', '#fb7185'],
        ['#1b1a55', '#22c55e'],
        ['#2d1b69', '#fde047'],
        ['#1f1147', '#38bdf8'],
        ['#092635', '#fca5a5'],
        ['#0a0a0a', '#f59e0b'],
        ['#0d1321', '#ef4444'],
        ['#0b3d91', '#f472b6'],
        ['#162447', '#e879f9'],
    ];

    const randomOf = (list) => list[Math.floor(Math.random() * list.length)];

    const updateBackground = () => {
        const [bg, accent] = randomOf(palette);
        document.documentElement.style.setProperty('--bg', bg);
        document.documentElement.style.setProperty('--accent', accent);
        document.body.style.background = `radial-gradient(1200px 800px at 10% 10%, #111827 0%, ${bg} 50%)`;
    };

    const pop = () => {
        const card = document.querySelector('.card');
        if (!card) return;
        card.animate([
            { transform: 'scale(1)', filter: 'brightness(1)' },
            { transform: 'scale(1.02)', filter: 'brightness(1.1)' },
            { transform: 'scale(1)', filter: 'brightness(1)' },
        ], { duration: 220, easing: 'ease-out' });
    };

    let selectedZodiac = 'rat';

    const render = () => {
        updateBackground();
        const list = fortunesByZodiac[selectedZodiac] || fortunesByZodiac.rat;
        // Deterministic pick per day and zodiac: hash(date+zodiac)
        const date = new Date();
        const seed = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${selectedZodiac}`;
        let hash = 0; for (let i = 0; i < seed.length; i++) { hash = (hash * 31 + seed.charCodeAt(i)) >>> 0; }
        const index = hash % list.length;
        const text = list[index];
        outputType.textContent = '오늘의 운세 (띠별)';
        outputText.textContent = text;
        const formatted = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        const labelMap = { rat:'쥐띠', ox:'소띠', tiger:'호랑이띠', rabbit:'토끼띠', dragon:'용띠', snake:'뱀띠', horse:'말띠', goat:'양띠', monkey:'원숭이띠', rooster:'닭띠', dog:'개띠', pig:'돼지띠' };
        outputMeta.textContent = `${formatted} · ${labelMap[selectedZodiac]}`;
        pop();
    };

    button.addEventListener('click', render);

    // KakaoTalk Share
    const initKakao = () => {
        const KAKAO_APP_KEY = window.KAKAO_APP_KEY || '';
        if (typeof Kakao === 'undefined') return false;
        if (!KAKAO_APP_KEY) return false;
        if (!Kakao.isInitialized()) Kakao.init(KAKAO_APP_KEY);
        kakaoStatus && (kakaoStatus.textContent = `Kakao SDK 초기화됨 · 도메인: ${location.origin}`);
        return true;
    };

    const shareKakao = () => {
        const ok = initKakao();
        const text = outputText.textContent || '오늘의 운세를 확인해보세요!';
        const labelMap = { rat:'쥐띠', ox:'소띠', tiger:'호랑이띠', rabbit:'토끼띠', dragon:'용띠', snake:'뱀띠', horse:'말띠', goat:'양띠', monkey:'원숭이띠', rooster:'닭띠', dog:'개띠', pig:'돼지띠' };
        const label = labelMap[selectedZodiac] || '띠';
        const shareTitle = `오늘의 띠별 운세 · ${label}`;
        const shareDesc = text;
        const shareUrl = location.href;

        if (ok) {
            try {
                Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: shareTitle,
                        description: shareDesc,
                        imageUrl: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png',
                        link: { mobileWebUrl: shareUrl, webUrl: shareUrl }
                    },
                    buttons: [
                        { title: '열어보기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }
                    ]
                });
            } catch (e) {
                console.error('Kakao Share error:', e);
                kakaoStatus && (kakaoStatus.textContent = `Kakao Share error: ${e?.message || e}`);
                alert(`카카오 공유 오류: ${e?.message || e}`);
            }
        } else {
            // Fallback: copy to clipboard
            const fallback = `${shareTitle}\n${shareDesc}\n${shareUrl}`;
            navigator.clipboard?.writeText(fallback).then(() => {
                alert('카카오 설정 전이므로 클립보드에 복사했어요. 붙여넣기로 공유해주세요!');
            }).catch(() => {
                alert('공유 링크: ' + shareUrl);
            });
        }
    };

    kakaoShareBtn?.addEventListener('click', shareKakao);
    zodiacGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.zbtn');
        if (!btn) return;
        selectedZodiac = btn.dataset.zodiac || 'rat';
        document.querySelectorAll('.zbtn').forEach(el => {
            const isSelected = el === btn;
            el.classList.toggle('selected', isSelected);
            el.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        // Selection only; content updates when clicking the main action button
    });

    // Load local JSON overrides then render
    loadExternalFortunes().finally(() => {
        const initialized = initKakao();
        if (!initialized) {
            kakaoStatus && (kakaoStatus.textContent = 'Kakao SDK 미설정 또는 도메인 미등록. 공유 시 클립보드로 대체됩니다.');
        }
        render();
    });
});

