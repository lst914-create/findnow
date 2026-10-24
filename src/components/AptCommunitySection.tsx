"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AptComment {
  id: string;
  author: string;
  badge: "입주민" | "임장러" | "예비매수자" | "공인중개사";
  category: "실거주후기" | "임장기" | "주차/관리비" | "질문있어요" | "매매/전세";
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

interface AptCommunitySectionProps {
  aptName: string;
  aptId: string;
  region?: string;
  trafficScore?: number;
  schoolScore?: number;
}

export default function AptCommunitySection({
  aptName,
  aptId,
  region = "서울",
}: AptCommunitySectionProps) {
  const storageKey = `chajwo_apt_community_${aptId}`;

  // 투표 상태 (단지별 개별 저장)
  const [recommendVotes, setRecommendVotes] = useState({ up: 28, down: 3, userVote: null as "up" | "down" | null });
  // 피드 상태
  const [comments, setComments] = useState<AptComment[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("전체");
  const [isLoading, setIsLoading] = useState(false);

  // 작성 폼 상태
  const [inputContent, setInputContent] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputBadge, setInputBadge] = useState<"입주민" | "임장러" | "예비매수자" | "공인중개사">("입주민");
  const [inputCategory, setInputCategory] = useState<"실거주후기" | "임장기" | "주차/관리비" | "질문있어요" | "매매/전세">("실거주후기");

  // 단지별 기본 맞춤 시드 생성기
  const generateAptDefaultComments = (): AptComment[] => [
    {
      id: `seed-${aptId}-1`,
      author: `${aptName.slice(0, 3)}입주민`,
      badge: "입주민",
      category: "실거주후기",
      content: `${aptName} 실거주 중입니다. 주변 인프라와 단지 분위기가 조용해서 만족도가 높습니다. 층간소음이나 주차, 관리비 등 궁금한 점 있으시면 댓글 남겨주세요!`,
      createdAt: "3시간 전",
      likes: 14,
    },
    {
      id: `seed-${aptId}-2`,
      author: "주말임장러",
      badge: "임장러",
      category: "임장기",
      content: `지난 주말 ${aptName} 현장 임장 다녀왔습니다. 인근 상권과 대중교통 접근성이 우수하고 동간 채광이 좋네요. 관심 있게 지켜보고 있습니다.`,
      createdAt: "어제",
      likes: 8,
    },
  ];

  // 단지별 데이터 불러오기 (서버 API 우선, 로컬스토리지 백업)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function fetchAptCommunity() {
      try {
        const res = await fetch(`/api/community?targetType=apt&targetId=${encodeURIComponent(aptId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            // 서버 포스트에서 댓글 추출 및 통합
            const allComments: AptComment[] = [];
            data.posts.forEach((p: any) => {
              allComments.push({
                id: p.id,
                author: p.author,
                badge: p.authorBadge || "입주민",
                category: p.subBadge || "실거주후기",
                content: p.content,
                createdAt: p.createdAt,
                likes: p.likes || 0,
              });
              p.comments?.forEach((c: any) => {
                allComments.push({
                  id: c.id,
                  author: c.author,
                  badge: c.badge || "입주민",
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
        console.warn("API fetch error, falling back to localStorage", e);
      }

      // 로컬스토리지 확인
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          if (isMounted) setComments(JSON.parse(saved));
        } else {
          const initial = generateAptDefaultComments();
          if (isMounted) {
            setComments(initial);
            localStorage.setItem(storageKey, JSON.stringify(initial));
          }
        }

        const savedVote = localStorage.getItem(`${storageKey}_vote`);
        if (savedVote && isMounted) {
          setRecommendVotes(JSON.parse(savedVote));
        }
      } catch {
        if (isMounted) setComments(generateAptDefaultComments());
      }
      if (isMounted) setIsLoading(false);
    }

    fetchAptCommunity();

    return () => {
      isMounted = false;
    };
  }, [aptId, aptName]);

  const handleVote = (type: "up" | "down") => {
    if (recommendVotes.userVote) return;
    const updated = {
      up: type === "up" ? recommendVotes.up + 1 : recommendVotes.up,
      down: type === "down" ? recommendVotes.down + 1 : recommendVotes.down,
      userVote: type,
    };
    setRecommendVotes(updated);
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

    const authorName = inputAuthor.trim() || `입주자_${Math.floor(100 + Math.random() * 900)}`;
    const newComment: AptComment = {
      id: `c_${Date.now()}`,
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

    // 단지별 개별 영구 저장 (로컬스토리지 + 서버 파일)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextComments));
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createPost",
          targetType: "apt",
          targetId: String(aptId),
          targetName: aptName,
          category: "apt",
          categoryLabel: "아파트 찾기",
          subBadge: inputCategory,
          title: `[${aptName}] ${inputCategory}: ${newComment.content.slice(0, 30)}...`,
          content: newComment.content,
          author: authorName,
          authorBadge: inputBadge,
          tags: [aptName, inputCategory],
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

  const totalVotes = recommendVotes.up + recommendVotes.down;
  const upPercent = totalVotes > 0 ? Math.round((recommendVotes.up / totalVotes) * 100) : 90;

  return (
    <section className="mt-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      {/* 1. 섹션 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>단지 고유 실시간 소통창구 (단지별 개별 저장)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>💬</span>
            <span>{aptName} 단지 이야기 & 토론</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {aptName} 입주민들과 예비 매수자들이 실거주 만족도, 층간소음, 관리비, 통학로 정보를 단지별로 나누는 전용 공간입니다.
          </p>
        </div>

        {/* 전체 커뮤니티 이동 링크 */}
        <Link
          href={`/community`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors shrink-0"
        >
          <span>전체 커뮤니티 둘러보기</span>
          <span>→</span>
        </Link>
      </div>

      {/* 2. 실거주 추천 투표 위젯 (단지별 고유 투표) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="text-center md:text-left">
          <div className="text-xs font-bold text-blue-800 flex items-center justify-center md:justify-start gap-1">
            <span>📊</span>
            <span>{aptName} 입주민 평가</span>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
            이 단지, 지인에게 실거주로 추천하시나요?
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            총 {totalVotes}명이 평가에 참여했습니다.
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* 추천해요 버튼 */}
          <button
            onClick={() => handleVote("up")}
            disabled={!!recommendVotes.userVote}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              recommendVotes.userVote === "up"
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300"
                : "bg-white hover:bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            <span>👍 추천해요</span>
            <span className="font-black">({recommendVotes.up})</span>
          </button>

          {/* 아쉬워요 버튼 */}
          <button
            onClick={() => handleVote("down")}
            disabled={!!recommendVotes.userVote}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              recommendVotes.userVote === "down"
                ? "bg-slate-700 text-white shadow-sm ring-2 ring-slate-300"
                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            <span>🤔 아쉬워요</span>
            <span className="font-black">({recommendVotes.down})</span>
          </button>
        </div>
      </div>

      {/* 추천율 프로그레스 바 */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>실거주 만족 추천 비율: <strong className="text-blue-600">{upPercent}%</strong></span>
          <span>{totalVotes}명 참여</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${upPercent}%` }} />
          <div className="bg-slate-300 h-full transition-all duration-500" style={{ width: `${100 - upPercent}%` }} />
        </div>
      </div>

      {/* 3. 소통글 필터 탭 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {["전체", "실거주후기", "임장기", "주차/관리비", "질문있어요", "매매/전세"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-slate-400 text-xs ml-auto shrink-0">
          {aptName} 전용 {filteredComments.length}개의 이야기
        </span>
      </div>

      {/* 4. 피드 목록 (단지별 개별 이야기) */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-400">
            {aptName} 이야기를 불러오는 중입니다...
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
            {aptName}에 대한 첫 번째 실거주 이야기나 질문을 남겨보세요!
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{comment.author}</span>
                  <span
                    className={`px-2 py-0.2 rounded-md font-semibold text-[10px] border ${
                      comment.badge === "입주민"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : comment.badge === "임장러"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    {comment.badge}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-white text-slate-500 text-[10px] border border-slate-200">
                    {comment.category}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{comment.createdAt}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[11px] text-slate-400">
                  {aptName} 단지 이야기
                </span>
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs font-semibold ${
                    comment.userLiked
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
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

      {/* 5. 간편 이야기 작성창 */}
      <form onSubmit={handleAddComment} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>✏️</span>
            <span>{aptName}에 대해 이야기 남기기</span>
          </span>
          <span className="text-[11px] text-blue-600 font-semibold">이 단지에 개별 저장됩니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* 말머리 */}
          <select
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="실거주후기">실거주후기</option>
            <option value="임장기">임장기</option>
            <option value="주차/관리비">주차/관리비</option>
            <option value="질문있어요">질문있어요</option>
            <option value="매매/전세">매매/전세</option>
          </select>

          {/* 뱃지 */}
          <select
            value={inputBadge}
            onChange={(e) => setInputBadge(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="입주민">입주민</option>
            <option value="임장러">임장러</option>
            <option value="예비매수자">예비매수자</option>
            <option value="공인중개사">공인중개사</option>
          </select>

          {/* 닉네임 */}
          <input
            type="text"
            placeholder="닉네임 (미입력시 자동)"
            value={inputAuthor}
            onChange={(e) => setInputAuthor(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <div className="relative">
          <textarea
            rows={3}
            placeholder={`${aptName}의 층간소음, 관리비, 통학로, 주차 여건이나 궁금한 점을 남겨주세요...`}
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {aptName}에 소통글 등록하기
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
