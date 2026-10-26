"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface RedevComment {
  id: string;
  author: string;
  badge: "조합원" | "임장러" | "투자예정자" | "공인중개사";
  category: "조합소식" | "매물/프리미엄" | "임장후기" | "권리가액/분담금" | "질문있어요";
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

interface RedevelopmentCommunitySectionProps {
  zoneName: string;
  zoneId: string;
  zoneStep?: string;
  zoneLocation?: string;
  premium?: string;
}

export default function RedevelopmentCommunitySection({
  zoneName,
  zoneId,
  zoneStep = "사업진행중",
  zoneLocation = "서울",
  premium,
}: RedevelopmentCommunitySectionProps) {
  const storageKey = `chajwo_redev_community_${zoneId}`;

  // 투자 심리 투표 상태 (구역별 개별 저장)
  const [sentimentVotes, setSentimentVotes] = useState({
    buy: 35,
    wait: 12,
    userVote: null as "buy" | "wait" | null,
  });

  // 피드 상태
  const [comments, setComments] = useState<RedevComment[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("전체");
  const [isLoading, setIsLoading] = useState(false);

  // 작성 폼 상태
  const [inputContent, setInputContent] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputBadge, setInputBadge] = useState<"조합원" | "임장러" | "투자예정자" | "공인중개사">("조합원");
  const [inputCategory, setInputCategory] = useState<"조합소식" | "매물/프리미엄" | "임장후기" | "권리가액/분담금" | "질문있어요">("조합소식");

  // 기본 시드 글 생성 (구역별 맞춤)
  const generateRedevDefaultComments = (): RedevComment[] => [
    {
      id: `seed-r-${zoneId}-1`,
      author: `${zoneName.slice(0, 3)}조합원`,
      badge: "조합원",
      category: "조합소식",
      content: `${zoneName} 조합원입니다. 최근 시공사 및 지자체 인허가 협의가 순조롭게 진행 중이며 다음 단계 일정에 맞춰 착실히 준비되고 있습니다. 조합원 소식이나 현장 궁금한 점 있으면 편하게 댓글 주세요!`,
      createdAt: "2시간 전",
      likes: 19,
    },
    {
      id: `seed-r-${zoneId}-2`,
      author: "정비사업임장러",
      badge: "임장러",
      category: "임장후기",
      content: `${zoneName} 현장 임장 다녀왔습니다. 입지적 장점과 노후도, 상권 접근성을 직접 확인해보니 미래 가치가 기대됩니다.`,
      createdAt: "어제",
      likes: 11,
    },
  ];

  // 구역별 개별 데이터 로드 (API 우선, 로컬스토리지 백업)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchRedevCommunity() {
      try {
        const res = await fetch(`/api/community?targetType=redev&targetId=${encodeURIComponent(zoneId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            const allComments: RedevComment[] = [];
            data.posts.forEach((p: any) => {
              allComments.push({
                id: p.id,
                author: p.author,
                badge: p.authorBadge || "조합원",
                category: p.subBadge || "조합소식",
                content: p.content,
                createdAt: p.createdAt,
                likes: p.likes || 0,
              });
              p.comments?.forEach((c: any) => {
                allComments.push({
                  id: c.id,
                  author: c.author,
                  badge: c.badge || "조합원",
                  category: "질문있어요",
                  content: c.content,
                  createdAt: c.createdAt,
                  likes: c.likes || 0,
                });
              });
            });

            if (isMounted) {
              setComments(allComments);
              localStorage.setItem(storageKey, JSON.stringify(allComments));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Redev API fetch error, falling back to localStorage", e);
      }

      // 로컬스토리지 백업
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          if (isMounted) setComments(JSON.parse(saved));
        } else {
          const initial = generateRedevDefaultComments();
          if (isMounted) {
            setComments(initial);
            localStorage.setItem(storageKey, JSON.stringify(initial));
          }
        }

        const savedVote = localStorage.getItem(`${storageKey}_vote`);
        if (savedVote && isMounted) {
          setSentimentVotes(JSON.parse(savedVote));
        }
      } catch {
        if (isMounted) setComments(generateRedevDefaultComments());
      }
      if (isMounted) setIsLoading(false);
    }

    fetchRedevCommunity();

    return () => {
      isMounted = false;
    };
  }, [zoneId, zoneName]);

  const handleVote = (type: "buy" | "wait") => {
    if (sentimentVotes.userVote) return;
    const updated = {
      buy: type === "buy" ? sentimentVotes.buy + 1 : sentimentVotes.buy,
      wait: type === "wait" ? sentimentVotes.wait + 1 : sentimentVotes.wait,
      userVote: type,
    };
    setSentimentVotes(updated);
    try {
      localStorage.setItem(`${storageKey}_vote`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleLike = async (id: string) => {
    const updated = comments.map((c) => {
      if (c.id === id) {
        const isLiked = c.userLiked;
        return {
          ...c,
          likes: isLiked ? c.likes - 1 : c.likes + 1,
          userLiked: !isLiked,
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleLike", postId: id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const authorName = inputAuthor.trim() || `구역회원_${Math.floor(100 + Math.random() * 900)}`;
    const newComment: RedevComment = {
      id: `rc_${Date.now()}`,
      author: authorName,
      badge: inputBadge,
      category: inputCategory,
      content: inputContent.trim(),
      createdAt: "방금 전",
      likes: 0,
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);
    setInputContent("");

    // 구역별 개별 영구 저장 (로컬스토리지 + 서버 파일)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextComments));
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createPost",
          targetType: "redev",
          targetId: String(zoneId),
          targetName: zoneName,
          category: "redev",
          categoryLabel: "재개발·정비",
          subBadge: inputCategory,
          title: `[${zoneName}] ${inputCategory}: ${newComment.content.slice(0, 30)}...`,
          content: newComment.content,
          author: authorName,
          authorBadge: inputBadge,
          tags: [zoneName, inputCategory],
        }),
      });
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filterCategory === "전체") return true;
    return c.category === filterCategory;
  });

  const totalVotes = sentimentVotes.buy + sentimentVotes.wait;
  const buyPercent = totalVotes > 0 ? Math.round((sentimentVotes.buy / totalVotes) * 100) : 75;

  return (
    <section className="space-y-4 pt-6 border-t border-slate-200">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
          <span>🔨</span>
          <span>{zoneName} 조합원 & 투자자 토론</span>
        </h3>
        <Link
          href="/community"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5 self-start sm:self-auto shrink-0"
        >
          <span>재개발 토론방 전체보기 →</span>
        </Link>
      </div>

      {/* 투자 심리 투표 위젯 (구역별 고유) */}
      <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-50/60 to-orange-50/40 border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-950 flex items-center gap-1">
            <span>📊</span>
            <span>{zoneName} 프리미엄/시세 수준, 투자 의견은?</span>
          </span>
          <span className="text-[10px] text-amber-700 font-semibold">{totalVotes}명 참여</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleVote("buy")}
            disabled={!!sentimentVotes.userVote}
            className={`p-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
              sentimentVotes.userVote === "buy"
                ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                : "bg-white hover:bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            <span>🚀 매수기회/저평가 ({buyPercent}%)</span>
          </button>
          <button
            onClick={() => handleVote("wait")}
            disabled={!!sentimentVotes.userVote}
            className={`p-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
              sentimentVotes.userVote === "wait"
                ? "bg-slate-700 text-white border-slate-800 shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <span>⏳ 관망/조정필요 ({100 - buyPercent}%)</span>
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div className="bg-amber-500 h-full transition-all" style={{ width: `${buyPercent}%` }} />
          <div className="bg-slate-400 h-full transition-all" style={{ width: `${100 - buyPercent}%` }} />
        </div>
      </div>

      {/* 카테고리 필터 태그 */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {["전체", "조합소식", "매물/프리미엄", "임장후기", "권리가액/분담금", "질문있어요"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap text-[11px] transition-colors cursor-pointer ${
              filterCategory === cat
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-slate-400 text-[10px] ml-auto shrink-0">
          {zoneName} 전용 {filteredComments.length}건
        </span>
      </div>

      {/* 댓글 및 소통 피드 목록 */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            {zoneName} 이야기를 불러오는 중입니다...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            {zoneName}에 대한 첫 번째 조합 소식이나 질문을 남겨보세요!
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 text-[11px]">{comment.author}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md font-semibold text-[9px] border ${
                      comment.badge === "조합원"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : comment.badge === "임장러"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {comment.badge}
                  </span>
                  <span className="px-1 py-0.2 rounded bg-white text-slate-500 text-[9px] border border-slate-200">
                    {comment.category}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <span>{zoneName} 구역 토론</span>
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                    comment.userLiked
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{comment.userLiked ? "❤️" : "🤍"}</span>
                  <span>공감 {comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleAddComment} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
          <span>{zoneName} 구역에 의견 남기기</span>
          <span className="text-amber-700">이 구역에 개별 저장됩니다</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <select
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value as any)}
            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700"
          >
            <option value="조합소식">조합소식</option>
            <option value="매물/프리미엄">매물/프리미엄</option>
            <option value="임장후기">임장후기</option>
            <option value="권리가액/분담금">권리가액/분담금</option>
            <option value="질문있어요">질문있어요</option>
          </select>

          <select
            value={inputBadge}
            onChange={(e) => setInputBadge(e.target.value as any)}
            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700"
          >
            <option value="조합원">조합원</option>
            <option value="임장러">임장러</option>
            <option value="투자예정자">투자예정자</option>
            <option value="공인중개사">공인중개사</option>
          </select>

          <input
            type="text"
            placeholder="닉네임"
            value={inputAuthor}
            onChange={(e) => setInputAuthor(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`${zoneName} 조합 소식, 프리미엄, 임장 정보를 남겨주세요...`}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            등록
          </button>
        </div>
      </form>
    </section>
  );
}
