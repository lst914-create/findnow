"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CommunityPost,
  CommunityCategory,
  COMMUNITY_CATEGORIES,
  INITIAL_COMMUNITY_POSTS,
  COMMUNITY_TOP_TAGS,
} from "@/lib/community-data";

export default function CommunityPage() {
  // 1. 상태 관리
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "comments">("latest");

  // 상세 모달 상태
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  // 새 글 쓰기 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<"apt" | "redev" | "sub" | "region">("apt");
  const [newSubBadge, setNewSubBadge] = useState("임장기");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newAuthorBadge, setNewAuthorBadge] = useState("실거주인증");
  const [newLinkedName, setNewLinkedName] = useState("");
  const [newLinkedLocation, setNewLinkedLocation] = useState("");
  const [newLinkedInfo, setNewLinkedInfo] = useState("");
  const [newTags, setNewTags] = useState("");

  // 투표 생성 옵션
  const [enablePoll, setEnablePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOption1, setPollOption1] = useState("");
  const [pollOption2, setPollOption2] = useState("");

  // 로컬스토리지 연동 (초기화 및 저장)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chajwo_community_posts_v1");
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts(INITIAL_COMMUNITY_POSTS);
        localStorage.setItem("chajwo_community_posts_v1", JSON.stringify(INITIAL_COMMUNITY_POSTS));
      }
    } catch {
      setPosts(INITIAL_COMMUNITY_POSTS);
    }
  }, []);

  const savePosts = (newPostList: CommunityPost[]) => {
    setPosts(newPostList);
    try {
      localStorage.setItem("chajwo_community_posts_v1", JSON.stringify(newPostList));
    } catch (e) {
      console.error("Failed to save posts to localStorage", e);
    }
  };

  // 카테고리별 게시글 개수 집계
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    for (const cat of COMMUNITY_CATEGORIES) {
      if (cat.id !== "all") {
        counts[cat.id] = posts.filter((p) => p.category === cat.id).length;
      }
    }
    return counts;
  }, [posts]);

  // 필터링 및 정렬된 게시글
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        if (selectedCategory !== "all" && post.category !== selectedCategory) return false;
        if (selectedTag && !post.tags.includes(selectedTag.replace("#", ""))) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchContent = post.content.toLowerCase().includes(q);
          const matchTag = post.tags.some((t) => t.toLowerCase().includes(q));
          const matchLinked = post.linkedData?.name.toLowerCase().includes(q);
          if (!matchTitle && !matchContent && !matchTag && !matchLinked) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.likes - a.likes;
        if (sortBy === "comments") return b.comments.length - a.comments.length;
        // latest: 기본 ID 순서 or 시간순 (새로 추가된 글이 위로)
        return 0;
      });
  }, [posts, selectedCategory, selectedTag, searchQuery, sortBy]);

  // 좋아요 토글
  const handleToggleLike = (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = p.userLiked;
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          userLiked: !isLiked,
        };
      }
      return p;
    });
    savePosts(updated);
    if (activePost && activePost.id === postId) {
      const current = updated.find((p) => p.id === postId);
      if (current) setActivePost(current);
    }
  };

  // 투표 참여
  const handleVote = (postId: string, optionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = posts.map((p) => {
      if (p.id === postId && p.poll) {
        if (p.poll.userVotedOptionId) return p; // 이미 투표함
        const newOptions = p.poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...p,
          poll: {
            ...p.poll,
            options: newOptions,
            totalVotes: p.poll.totalVotes + 1,
            userVotedOptionId: optionId,
          },
        };
      }
      return p;
    });
    savePosts(updated);
    if (activePost && activePost.id === postId) {
      const current = updated.find((p) => p.id === postId);
      if (current) setActivePost(current);
    }
  };

  // 댓글 등록
  const handleAddComment = () => {
    if (!activePost || !commentInput.trim()) return;
    const authorName = commentAuthor.trim() || `부동산러_${Math.floor(100 + Math.random() * 900)}`;
    const newComment = {
      id: `c_${Date.now()}`,
      author: authorName,
      badge: "회원",
      content: commentInput.trim(),
      createdAt: "방금 전",
      likes: 0,
    };
    const updated = posts.map((p) => {
      if (p.id === activePost.id) {
        return {
          ...p,
          comments: [newComment, ...p.comments],
        };
      }
      return p;
    });
    savePosts(updated);
    const refreshed = updated.find((p) => p.id === activePost.id);
    if (refreshed) setActivePost(refreshed);
    setCommentInput("");
  };

  // 새 글 작성 제출
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    const catObj = COMMUNITY_CATEGORIES.find((c) => c.id === newCategory);
    const authorName = newAuthor.trim() || `임장탐험가_${Math.floor(100 + Math.random() * 900)}`;

    const tagsArray = newTags
      .split(/[,\s#]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPostItem: CommunityPost = {
      id: `post_${Date.now()}`,
      category: newCategory,
      categoryLabel: catObj ? catObj.label : "부동산",
      subBadge: newSubBadge,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: authorName,
      authorBadge: newAuthorBadge,
      createdAt: "방금 전",
      views: 1,
      likes: 0,
      tags: tagsArray.length > 0 ? tagsArray : [catObj?.label || "부동산"],
      comments: [],
      linkedData: newLinkedName.trim()
        ? {
            type: newCategory,
            name: newLinkedName.trim(),
            location: newLinkedLocation.trim() || "위치 정보 없음",
            extraInfo: newLinkedInfo.trim() || undefined,
            linkHref:
              newCategory === "apt"
                ? "/search"
                : newCategory === "redev"
                ? "/redevelopment"
                : newCategory === "sub"
                ? "/subscriptions"
                : "/regional",
          }
        : undefined,
      poll:
        enablePoll && pollQuestion.trim() && pollOption1.trim() && pollOption2.trim()
          ? {
              id: `poll_${Date.now()}`,
              question: pollQuestion.trim(),
              options: [
                { id: "opt1", text: pollOption1.trim(), votes: 0 },
                { id: "opt2", text: pollOption2.trim(), votes: 0 },
              ],
              totalVotes: 0,
            }
          : undefined,
    };

    savePosts([newPostItem, ...posts]);
    setIsWriteModalOpen(false);

    // 폼 초기화
    setNewTitle("");
    setNewContent("");
    setNewAuthor("");
    setNewLinkedName("");
    setNewLinkedLocation("");
    setNewLinkedInfo("");
    setNewTags("");
    setEnablePoll(false);
    setPollQuestion("");
    setPollOption1("");
    setPollOption2("");

    // 상세 모달 바로 띄우기
    setActivePost(newPostItem);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <span className="text-white text-base sm:text-lg font-bold">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">찾아줘</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                커뮤니티
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/search"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏢 아파트 찾기
              </Link>
              <Link
                href="/redevelopment"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🔨 재개발·정비사업
              </Link>
              <Link
                href="/subscriptions"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏗️ 분양정보
              </Link>
              <Link
                href="/regional"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                📍 지역정보
              </Link>
              <Link
                href="/community"
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
              >
                💬 커뮤니티
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>✏️ 글쓰기</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 커뮤니티 히어로 배너 */}
      <section className="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-10 pb-8 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>데이터 기반 실시간 부동산 오픈 라운지</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                아파트·재개발·분양·지역 커뮤니티
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                실거주민의 솔직한 임장기부터 재개발 조합원 소식, 청약 가점 토론, 동네 학군/상권 정보까지 생생한 부동산 지식을 자유롭게 나눠보세요.
              </p>
            </div>

            {/* 주요 카테고리 빠른 요약 통계 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-blue-300">🏢 아파트 찾기</div>
                <div className="text-lg font-black text-white">{categoryCounts["apt"] || 0}건</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-amber-300">🔨 재개발·정비</div>
                <div className="text-lg font-black text-white">{categoryCounts["redev"] || 0}건</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-emerald-300">🏗️ 분양·청약</div>
                <div className="text-lg font-black text-white">{categoryCounts["sub"] || 0}건</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-purple-300">📍 지역·상권</div>
                <div className="text-lg font-black text-white">{categoryCounts["region"] || 0}건</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 카테고리 탭 & 검색 & 정렬 */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
            {/* 4대 핵심 카테고리 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              {COMMUNITY_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedTag(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 우측 검색창 및 정렬 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="단지명, 구역, 키워드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "popular" | "comments")}
                className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="latest">최신순</option>
                <option value="popular">추천순 🔥</option>
                <option value="comments">댓글많은순 💬</option>
              </select>
            </div>
          </div>

          {/* 태그 바 */}
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-semibold shrink-0 mr-1">인기태그:</span>
            {COMMUNITY_TOP_TAGS.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 본문 피드 영역 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 2열: 게시글 피드 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 커뮤니티 참여 유도 웰컴 배너 */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-indigo-200/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="text-xs font-bold text-indigo-900">
                    찾아줘 커뮤니티는 실제 부동산 데이터와 연결됩니다!
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    단지명이나 분양 공고, 재개발 구역을 언급하면 실거래가와 공고 정보가 자동으로 태깅됩니다.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                의견 나누기
              </button>
            </div>

            {/* 게시글 리스트 */}
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <div className="text-4xl mb-3">🧐</div>
                <div className="text-base font-bold text-slate-700">검색 조건에 맞는 게시글이 없습니다.</div>
                <p className="text-xs text-slate-500 mt-1">
                  선택하신 카테고리나 검색어를 확인하시거나, 첫 번째 질문을 남겨보세요!
                </p>
                <button
                  onClick={() => setIsWriteModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                >
                  새 글 작성하기
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                return (
                  <article
                    key={post.id}
                    onClick={() => setActivePost(post)}
                    className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* 상단 메타 (카테고리 뱃지, 작성자, 작성시간) */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            post.category === "apt"
                              ? "bg-blue-100 text-blue-700"
                              : post.category === "redev"
                              ? "bg-amber-100 text-amber-700"
                              : post.category === "sub"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {post.categoryLabel}
                        </span>
                        {post.subBadge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                            {post.subBadge}
                          </span>
                        )}
                        {post.isHot && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center gap-0.5">
                            <span>🔥</span>
                            <span>인기</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="font-medium text-slate-700">{post.author}</span>
                        {post.authorBadge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500 font-semibold text-[9px] border border-slate-200">
                            {post.authorBadge}
                          </span>
                        )}
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                      {post.title}
                    </h2>

                    {/* 본문 요약 */}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {/* 데이터 연동 카드 (있을 경우) */}
                    {post.linkedData && (
                      <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="p-1 rounded-md bg-white border border-slate-200 text-xs">
                            {post.linkedData.type === "apt"
                              ? "🏢"
                              : post.linkedData.type === "redev"
                              ? "🔨"
                              : post.linkedData.type === "sub"
                              ? "🏗️"
                              : "📍"}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-slate-800 mr-2">{post.linkedData.name}</span>
                            <span className="text-slate-400 text-[11px]">{post.linkedData.location}</span>
                          </div>
                        </div>
                        {post.linkedData.extraInfo && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                            {post.linkedData.extraInfo}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 투표 미리보기 (있을 경우) */}
                    {post.poll && (
                      <div className="mb-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-indigo-900 flex items-center gap-1">
                            <span>📊</span>
                            <span>{post.poll.question}</span>
                          </span>
                          <span className="text-[11px] text-indigo-600 font-semibold">
                            총 {post.poll.totalVotes}명 참여
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {post.poll.options.map((opt) => {
                            const pct =
                              post.poll && post.poll.totalVotes > 0
                                ? Math.round((opt.votes / post.poll.totalVotes) * 100)
                                : 0;
                            const isVoted = post.poll?.userVotedOptionId === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={(e) => handleVote(post.id, opt.id, e)}
                                className={`w-full p-2 rounded-lg text-left relative overflow-hidden transition-all flex items-center justify-between border cursor-pointer ${
                                  isVoted
                                    ? "border-indigo-600 bg-indigo-100/50 font-bold"
                                    : "border-slate-200 bg-white hover:border-indigo-300"
                                }`}
                              >
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-indigo-200/40 transition-all pointer-events-none"
                                  style={{ width: `${pct}%` }}
                                />
                                <span className="relative z-10 text-[11px] text-slate-800">
                                  {isVoted ? "✓ " : ""}
                                  {opt.text}
                                </span>
                                <span className="relative z-10 text-[11px] font-bold text-indigo-700">
                                  {pct}% ({opt.votes}표)
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 하단 태그 및 인터랙션 (추천, 댓글, 조회수) */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-slate-500 font-semibold">
                        <button
                          onClick={(e) => handleToggleLike(post.id, e)}
                          className={`flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer ${
                            post.userLiked ? "text-rose-600 font-bold" : ""
                          }`}
                        >
                          <span>{post.userLiked ? "❤️" : "🤍"}</span>
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                          <span>💬</span>
                          <span>{post.comments.length}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          👁️ {post.views}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* 우측 1열: 커뮤니티 활성화 사이드바 위젯 */}
          <div className="space-y-4">
            {/* 글쓰기 CTA 카드 */}
            <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
                Community Lounge
              </div>
              <h3 className="text-lg font-black leading-snug">
                궁금한 아파트나 재개발 구역이 있나요?
              </h3>
              <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
                실거주자, 조합원, 청약 대기자들이 실시간으로 답변해 드립니다.
              </p>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="mt-4 w-full py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs sm:text-sm hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer"
              >
                ✏️ 질문 & 토론 글 작성하기
              </button>
            </div>

            {/* 오늘의 실시간 HOT 토론 TOP 3 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="text-rose-500">🔥</span>
                  <span>실시간 HOT 토론</span>
                </h4>
                <span className="text-[10px] text-slate-400">실시간 집계</span>
              </div>
              <div className="space-y-3">
                {posts
                  .slice()
                  .sort((a, b) => b.likes + b.comments.length * 2 - (a.likes + a.comments.length * 2))
                  .slice(0, 4)
                  .map((hotPost, idx) => (
                    <div
                      key={hotPost.id}
                      onClick={() => setActivePost(hotPost)}
                      className="flex items-start gap-2.5 group cursor-pointer"
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${
                          idx === 0
                            ? "bg-rose-500 text-white"
                            : idx === 1
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                          {hotPost.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{hotPost.categoryLabel}</span>
                          <span>•</span>
                          <span>추천 {hotPost.likes}</span>
                          <span>•</span>
                          <span>댓글 {hotPost.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 도메인 바로가기 스마트 카드 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                데이터 탐색 허브 바로가기
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/search"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 transition-all flex flex-col gap-1"
                >
                  <span className="text-base">🏢</span>
                  <span className="font-bold">아파트 찾기</span>
                  <span className="text-[10px] text-slate-400">실거래가 비교</span>
                </Link>
                <Link
                  href="/redevelopment"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 text-slate-700 transition-all flex flex-col gap-1"
                >
                  <span className="text-base">🔨</span>
                  <span className="font-bold">재개발 정비</span>
                  <span className="text-[10px] text-slate-400">구역 경계 지도</span>
                </Link>
                <Link
                  href="/subscriptions"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-slate-700 transition-all flex flex-col gap-1"
                >
                  <span className="text-base">🏗️</span>
                  <span className="font-bold">청약홈 분양</span>
                  <span className="text-[10px] text-slate-400">실시간 공고</span>
                </Link>
                <Link
                  href="/regional"
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 text-slate-700 transition-all flex flex-col gap-1"
                >
                  <span className="text-base">📍</span>
                  <span className="font-bold">지역 분석</span>
                  <span className="text-[10px] text-slate-400">상권/학군 지표</span>
                </Link>
              </div>
            </div>

            {/* 커뮤니티 운영 원칙 안내 */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
              <div className="font-bold text-slate-700 mb-1">🛡️ 건강한 커뮤니티를 위한 약속</div>
              <ul className="list-disc list-inside space-y-1">
                <li>근거 없는 시세 조장 및 허위 매물 홍보는 제재됩니다.</li>
                <li>실제 임장 경험이나 팩트 기반 데이터 공유를 권장합니다.</li>
                <li>타인에 대한 비방 및 분쟁 유발 게시글은 무통보 숨김 처리됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 5. 글 상세 모달 (댓글 작성 & 상세 보기) */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                    activePost.category === "apt"
                      ? "bg-blue-100 text-blue-700"
                      : activePost.category === "redev"
                      ? "bg-amber-100 text-amber-700"
                      : activePost.category === "sub"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {activePost.categoryLabel}
                </span>
                {activePost.subBadge && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-xs">
                    {activePost.subBadge}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 모달 스크롤 본문 */}
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              {/* 작성자 정보 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {activePost.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">{activePost.author}</span>
                      {activePost.authorBadge && (
                        <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                          {activePost.authorBadge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{activePost.createdAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLike(activePost.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activePost.userLiked
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{activePost.userLiked ? "❤️" : "🤍"}</span>
                    <span>추천 {activePost.likes}</span>
                  </button>
                </div>
              </div>

              {/* 제목 & 본문 */}
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-3">{activePost.title}</h2>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {activePost.content}
                </div>
              </div>

              {/* 연동 데이터 배너 */}
              {activePost.linkedData && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {activePost.linkedData.type === "apt"
                        ? "🏢"
                        : activePost.linkedData.type === "redev"
                        ? "🔨"
                        : activePost.linkedData.type === "sub"
                        ? "🏗️"
                        : "📍"}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {activePost.linkedData.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {activePost.linkedData.location}
                      </div>
                    </div>
                  </div>
                  {activePost.linkedData.linkHref && (
                    <Link
                      href={activePost.linkedData.linkHref}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 shadow-2xs"
                    >
                      상세 정보 보기 →
                    </Link>
                  )}
                </div>
              )}

              {/* 투표 위젯 */}
              {activePost.poll && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                      <span>📊</span>
                      <span>{activePost.poll.question}</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">
                      총 {activePost.poll.totalVotes}명 참여
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activePost.poll.options.map((opt) => {
                      const pct =
                        activePost.poll && activePost.poll.totalVotes > 0
                          ? Math.round((opt.votes / activePost.poll.totalVotes) * 100)
                          : 0;
                      const isVoted = activePost.poll?.userVotedOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleVote(activePost.id, opt.id)}
                          className={`w-full p-2.5 rounded-xl text-left relative overflow-hidden transition-all flex items-center justify-between border cursor-pointer ${
                            isVoted
                              ? "border-indigo-600 bg-indigo-100 font-bold"
                              : "border-slate-200 bg-white hover:border-indigo-300"
                          }`}
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-200/50 transition-all pointer-events-none"
                            style={{ width: `${pct}%` }}
                          />
                          <span className="relative z-10 text-xs text-slate-900">
                            {isVoted ? "✓ " : ""}
                            {opt.text}
                          </span>
                          <span className="relative z-10 text-xs font-bold text-indigo-700">
                            {pct}% ({opt.votes}표)
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 태그 */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activePost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 댓글 목록 */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span>💬 댓글</span>
                  <span className="text-indigo-600 font-black">{activePost.comments.length}</span>
                </div>

                {activePost.comments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                    첫 번째 댓글을 남겨보세요!
                  </div>
                ) : (
                  activePost.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{comment.author}</span>
                          {comment.badge && (
                            <span className="px-1.5 py-0.2 rounded-md bg-white text-slate-500 font-semibold text-[9px] border border-slate-200">
                              {comment.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 댓글 작성창 */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="닉네임 (미입력시 자동 생성)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-44 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[11px] text-slate-400">자유롭게 의견을 남겨주세요</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="따뜻한 댓글 한마디가 큰 힘이 됩니다..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment();
                  }}
                  className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 새 글 쓰기 모달 */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>✏️ 새 글 작성하기</span>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* 카테고리 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">게시판 카테고리 *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory("apt");
                      setNewSubBadge("임장기");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      newCategory === "apt"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🏢 아파트 찾기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory("redev");
                      setNewSubBadge("조합소식");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      newCategory === "redev"
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔨 재개발·정비
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory("sub");
                      setNewSubBadge("청약고민");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      newCategory === "sub"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🏗️ 분양·청약톡
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCategory("region");
                      setNewSubBadge("학군/교통");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      newCategory === "region"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📍 지역·상권
                  </button>
                </div>
              </div>

              {/* 말머리 뱃지 & 닉네임 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">말머리 구분</label>
                  <select
                    value={newSubBadge}
                    onChange={(e) => setNewSubBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="임장기">임장기</option>
                    <option value="실거주후기">실거주후기</option>
                    <option value="청약고민">청약고민</option>
                    <option value="줍줍속보">줍줍속보</option>
                    <option value="조합소식">조합소식</option>
                    <option value="학군/교통">학군/교통</option>
                    <option value="자유토론">자유토론</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">작성자 닉네임</label>
                  <input
                    type="text"
                    placeholder="미입력시 자동 부여"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* 제목 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">제목 *</label>
                <input
                  type="text"
                  placeholder="예: 마래푸 34평 로열동 실거주 한 달 후기 공유합니다"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* 본문 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">내용 *</label>
                <textarea
                  rows={6}
                  placeholder="궁금한 점이나 이웃들과 나누고 싶은 부동산 이야기를 자유롭게 적어주세요..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* 데이터 연동 (단지/구역 태그) */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span>🔗 관련 단지/구역 데이터 연동 (선택사항)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="단지/구역명 (예: 헬리오시티)"
                    value={newLinkedName}
                    onChange={(e) => setNewLinkedName(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="지역 (예: 송파구 가락동)"
                    value={newLinkedLocation}
                    onChange={(e) => setNewLinkedLocation(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="추가정보 (예: 실거래 19억)"
                    value={newLinkedInfo}
                    onChange={(e) => setNewLinkedInfo(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* 투표 첨부 옵션 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>📊 실시간 찬반/투표 첨부하기</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={enablePoll}
                    onChange={(e) => setEnablePoll(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-sm cursor-pointer"
                  />
                </div>
                {enablePoll && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      placeholder="투표 질문 (예: 18억 예산 갈아타기라면?)"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="선택지 1 (예: 마래푸)"
                        value={pollOption1}
                        onChange={(e) => setPollOption1(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="선택지 2 (예: 헬리오시티)"
                        value={pollOption2}
                        onChange={(e) => setPollOption2(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 태그 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">해시태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: 마래푸, 헬리오시티, 실거주비교"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  게시글 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
