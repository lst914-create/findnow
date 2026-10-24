export type CommunityCategory = "all" | "apt" | "redev" | "sub" | "region";

export interface CommunityPoll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  badge?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  category: "apt" | "redev" | "sub" | "region";
  categoryLabel: string;
  subBadge?: string; // 예: [임장기], [실거주후기], [조합소식], [청약고민], [학군/교통]
  title: string;
  content: string;
  author: string;
  authorBadge?: string; // 예: 실거주인증, 조합원, 청약대기, 부동산전문가
  createdAt: string;
  views: number;
  likes: number;
  userLiked?: boolean;
  comments: CommunityComment[];
  tags: string[];
  // 데이터 연동 (단지/분양/재개발 메타정보 태그)
  linkedData?: {
    type: "apt" | "sub" | "redev" | "region";
    name: string;
    location: string;
    extraInfo?: string; // 예: "최근 실거래 18.5억" or "분양가 8.4억" or "관리처분인가"
    linkHref?: string;
  };
  poll?: CommunityPoll;
  isHot?: boolean;
  isNotice?: boolean;
}

export const COMMUNITY_CATEGORIES = [
  { id: "all" as const, label: "전체 피드", icon: "🔥", desc: "모든 부동산 실시간 토론" },
  { id: "apt" as const, label: "아파트 찾기", icon: "🏢", desc: "실거주 후기, 임장기, 층간소음, 급매 정보" },
  { id: "redev" as const, label: "재개발·정비", icon: "🔨", desc: "조합원 소식, 시공사, 사업시행/관리처분인가" },
  { id: "sub" as const, label: "분양·청약톡", icon: "🏗️", desc: "청약 가점, 특공 자격, 무순위 줍줍, 완판 예측" },
  { id: "region" as const, label: "지역·상권·학군", icon: "📍", desc: "GTX/교통 호재, 학원가, 상권, 동네 이야기" },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    category: "sub",
    categoryLabel: "분양·청약톡",
    subBadge: "줍줍속보",
    isHot: true,
    title: "동탄역 대방 엘리움 무순위 잔여세대 2가구 떴습니다! 시세차익 얼마 보시나요?",
    content: `오늘 청약홈에 동탄역 대방 엘리움 취소후 재공급(무순위) 2가구 공고가 정식 등록되었습니다.\n\n분양가 당시 가격 그대로 나와서 전용 84㎡ 기준 6억 초반대인데, 인근 동탄역 롯데캐슬 등 실거래가 고려하면 안전마진 최소 4~5억 이상 예상됩니다.\n화성시 거주 무주택 세대구성원 조건이라 경쟁률 역대급 터질 것 같네요. 다들 청약 넣으실 계획인가요?`,
    author: "동탄출퇴근러",
    authorBadge: "청약대기",
    createdAt: "10분 전",
    views: 1420,
    likes: 87,
    tags: ["동탄역대방엘리움", "무순위줍줍", "화성시", "안전마진"],
    linkedData: {
      type: "sub",
      name: "동탄역 대방 엘리움 (무순위)",
      location: "경기도 화성시 오산동",
      extraInfo: "분양가 6.2억 / 예상 마진 4억+",
      linkHref: "/subscriptions",
    },
    poll: {
      id: "poll-1",
      question: "동탄역 대방 무순위, 청약 신청하실 건가요?",
      options: [
        { id: "opt-1", text: "조건 되어서 무조건 청약 접수한다! (로또)", votes: 342 },
        { id: "opt-2", text: "화성시 거주자가 아니라서 아쉽게 패스 ㅠ", votes: 198 },
        { id: "opt-3", text: "대출 여력 부족해서 고민 중", votes: 45 },
      ],
      totalVotes: 585,
    },
    comments: [
      {
        id: "c1",
        author: "화성시민3년차",
        badge: "실거주인증",
        content: "화성시민인데 무주택 유지하길 정말 잘했네요. 전 재산 털어서라도 무조건 넣습니다!",
        createdAt: "8분 전",
        likes: 19,
      },
      {
        id: "c2",
        author: "가점68점",
        badge: "부동산전문가",
        content: "당첨되면 바로 전세 놓을 수 있는지 실거주의무 여부 꼭 입주자모집공고문 확인하세요. 안전마진은 확실합니다.",
        createdAt: "5분 전",
        likes: 14,
      },
    ],
  },
  {
    id: "post-2",
    category: "redev",
    categoryLabel: "재개발·정비",
    subBadge: "조합소식",
    isHot: true,
    title: "성수전략정비구역 4지구 77층 초고층 설계 변경안 주민 설명회 후기",
    content: `주말에 열린 성수 4지구 초고층 특화설계 총회 다녀왔습니다.\n\n기존 50층 제한에서 77층 랜드마크 타워로 한강 영구조망 세대 비율을 대폭 끌어올린 안이 압도적 찬성을 얻었습니다. 시공사 브랜드 경쟁도 현대건설 디에이치 vs 삼성물산 래미안 양자구도로 엄청 치열하네요.\n조합원 분담금 예상치와 향후 사업시행인가 타임라인 정리 공유드립니다.`,
    author: "성수한강러",
    authorBadge: "조합원",
    createdAt: "35분 전",
    views: 2890,
    likes: 154,
    tags: ["성수전략정비구역", "성수4지구", "초고층77층", "한강조망"],
    linkedData: {
      type: "redev",
      name: "성수전략정비구역 제4지구",
      location: "서울시 성동구 성수동2가",
      extraInfo: "사업시행인가 준비 / 77층 초고층",
      linkHref: "/redevelopment",
    },
    comments: [
      {
        id: "c3",
        author: "압구정주민",
        badge: "부동산전문가",
        content: "압구정 맞은편에서 성수 초고층 올라가면 양쪽 한강변 스카이라인이 완전히 뉴욕 맨해튼급 되겠네요.",
        createdAt: "22분 전",
        likes: 27,
      },
    ],
  },
  {
    id: "post-3",
    category: "apt",
    categoryLabel: "아파트 찾기",
    subBadge: "임장기",
    isHot: true,
    title: "마포래미안푸르지오(마래푸) vs 헬리오시티 34평 18억대 실거주 비교 임장기",
    content: `직장이 광화문/여의도라 마래푸를 볼지, 학군과 대단지 인프라 보고 헬리오시티로 내려갈지 한 달 내내 고민하며 주말마다 두 단지 임장 다녀왔습니다.\n\n1. 교통: 광화문·여의도 접근성은 마래푸 압승(도보+5호선/2호선). 강남·잠실 출퇴근은 헬리오시티 압승.\n2. 언덕/평지: 헬리오 평지 대단지의 쾌적함 vs 마래푸 경사로 있지만 커뮤니티 연결 잘 됨.\n3. 초품아/학원가: 헬리오 가락초·대치동 셔틀 우세.\n\n현재 18억대 예산으로 84타입 갈아타기 하신다면 여러분의 선택은?`,
    author: "여의도금융맨",
    authorBadge: "실거주인증",
    createdAt: "1시간 전",
    views: 3410,
    likes: 189,
    tags: ["마포래미안푸르지오", "헬리오시티", "실거주비교", "임장후기", "갈아타기"],
    linkedData: {
      type: "apt",
      name: "마포래미안푸르지오 / 헬리오시티",
      location: "마포구 아현동 / 송파구 가락동",
      extraInfo: "전용 84㎡ 기준 실거래 18.5억 ~ 19억선",
      linkHref: "/search",
    },
    poll: {
      id: "poll-2",
      question: "18억 예산 갈아타기라면 당신의 선택은?",
      options: [
        { id: "opt-a", text: "마포래미안푸르지오 (CBD/여의도 직주근접)", votes: 412 },
        { id: "opt-b", text: "송파 헬리오시티 (강남접근성/초대단지 평지)", votes: 531 },
      ],
      totalVotes: 943,
    },
    comments: [
      {
        id: "c4",
        author: "마래푸입주자",
        badge: "실거주인증",
        content: "광화문 직장이시면 마래푸 출퇴근 삶의 질 차이가 엄청납니다. 아침 30분 더 자는게 커요.",
        createdAt: "45분 전",
        likes: 31,
      },
      {
        id: "c5",
        author: "송파파파",
        badge: "실거주인증",
        content: "아이 초등학교 들어갈 나이면 헬리오 대치동 학원가 셔틀 도는 인프라 무시 못합니다.",
        createdAt: "30분 전",
        likes: 24,
      },
    ],
  },
  {
    id: "post-4",
    category: "region",
    categoryLabel: "지역·상권·학군",
    subBadge: "학군/교통",
    isHot: false,
    title: "GTX-A 수서-동탄 개통 6개월차, 주변 아파트 체감 교통과 상권 변화 솔직 정리",
    content: `GTX-A 개통 직후부터 매일 수서역 환승해서 양재로 출퇴근하는 주민입니다.\n\n출퇴근 시간대에 17분만에 동탄에서 수서 도착하는건 정말 혁명 맞습니다. 다만 수서역에서 3호선/수인분당선 갈아타는 막장 환승 통로 걷는 시간(약 5~7분) 감안하셔야 합니다.\n그래도 광역버스 입석 기다리던 시절 생각하면 삶의 만족도 200% 상승했습니다. 동탄역 롯데백화점 상권 유동인구도 주말마다 꽉 찹니다.`,
    author: "동탄수서통근",
    authorBadge: "실거주인증",
    createdAt: "2시간 전",
    views: 1820,
    likes: 92,
    tags: ["GTX-A", "동탄역", "수서역", "출퇴근후기", "교통호재"],
    linkedData: {
      type: "region",
      name: "동탄2신도시 역세권",
      location: "경기도 화성시 동탄역로",
      extraInfo: "GTX-A 수서역 17분 주파",
      linkHref: "/regional",
    },
    comments: [
      {
        id: "c6",
        author: "판교개발자",
        content: "삼성역까지 전구간 완전 개통되면 진짜 강남 접근성 종결이겠네요. 좋은 정보 감사합니다.",
        createdAt: "1시간 전",
        likes: 12,
      },
    ],
  },
  {
    id: "post-5",
    category: "sub",
    categoryLabel: "분양·청약톡",
    subBadge: "청약고민",
    isHot: false,
    title: "청약가점 58점, 서울 84타입 가점제 당첨 가능성 있을까요? 아니면 추첨제 노려야 할까요?",
    content: `부양가족 3명, 무주택 10년 유지해서 현재 58점 만들어두었습니다.\n최근 서울 분양 단지들 커트라인 보니까 84는 60점대 후반에서 70점까지 치솟던데, 58점이면 서울 비규제지역 59타입 가점제를 넣어야 할지, 아니면 84 추첨제(추첨 비율 60%)에 베팅하는게 나을지 선배님들 조언 부탁드립니다.`,
    author: "청약간절러",
    authorBadge: "청약대기",
    createdAt: "3시간 전",
    views: 1150,
    likes: 43,
    tags: ["청약가점", "가점58점", "추첨제", "서울분양", "특공"],
    comments: [
      {
        id: "c7",
        author: "청약멘토",
        badge: "부동산전문가",
        content: "58점이면 강북권 인기 단지 59타입은 충분히 당첨권입니다. 84는 가점 노리지 마시고 무조건 추첨제 물량으로 분산 전략 세우세요.",
        createdAt: "2시간 전",
        likes: 18,
      },
    ],
  },
  {
    id: "post-6",
    category: "redev",
    categoryLabel: "재개발·정비",
    subBadge: "현장임장",
    isHot: false,
    title: "한남3구역 이주율 90% 돌파 현장 상황 및 인근 한남4·5구역 시세 분위기",
    content: `오늘 한남동 재개발 구역 쭉 둘러보고 왔습니다.\n한남3구역은 펜스 작업 및 이주가 거의 막바지 단계라 공가가 많고 철거 임박 분위기입니다.\n덕분에 인근 한남4구역과 5구역 지분 매물 프리미엄 호가가 다시 강세를 보이고 있네요. 한남뉴타운 전체 완공되면 용산공원 + 한강 영구조망으로 대한민국 원탑 부촌 예약입니다.`,
    author: "용산임장러",
    authorBadge: "부동산전문가",
    createdAt: "4시간 전",
    views: 2210,
    likes: 110,
    tags: ["한남3구역", "한남뉴타운", "한남4구역", "철거이주", "용산공원"],
    linkedData: {
      type: "redev",
      name: "한남3재정비촉진구역",
      location: "서울시 용산구 한남동",
      extraInfo: "이주율 90% 돌파 / 철거 착공 예정",
      linkHref: "/redevelopment",
    },
    comments: [],
  },
  {
    id: "post-7",
    category: "apt",
    categoryLabel: "아파트 찾기",
    subBadge: "실거주후기",
    isHot: false,
    title: "구축 30년차 아파트 올수리 인테리어 비용 7,000만원 들인 솔직한 후기 (섀시/배관/단열)",
    content: `신축 분양가가 너무 비싸서 입지 좋은 서울 역세권 1994년식 32평 아파트 매수 후 턴키 올수리 들어갔습니다.\n\n- 시스템 에어컨 4대 및 천장 단내림\n- LG 하이샤시 로이복층유리 전면 교체\n- 엑셀 배관 전면 교체 및 난방 온수 분배기 신설\n\n결과적으로 섀시와 단열 꼼꼼히 하니 우풍 하나도 없고 신축 부럽지 않네요. 구축 매수 고민하시는 분들 배관과 단열 체크리스트 공유해 드립니다.`,
    author: "인테리어완성",
    authorBadge: "실거주인증",
    createdAt: "5시간 전",
    views: 2980,
    likes: 215,
    tags: ["구축올수리", "인테리어비용", "단열배관", "섀시교체", "구축매수"],
    comments: [
      {
        id: "c8",
        author: "구축고민중",
        content: "배관 교체할 때 누수 테스트 어떻게 하셨는지 궁금합니다! 스크랩해둘게요.",
        createdAt: "3시간 전",
        likes: 9,
      },
    ],
  },
];

export const COMMUNITY_TOP_TAGS = [
  "#무순위줍줍",
  "#임장후기",
  "#청약가점",
  "#조합원소식",
  "#GTX호재",
  "#동탄역",
  "#성수전략정비",
  "#마래푸",
  "#학군지비교",
  "#올수리인테리어",
];
