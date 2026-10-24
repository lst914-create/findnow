import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "community-store.json");

interface CommunityItem {
  id: string;
  targetType?: "apt" | "redev" | "sub" | "general";
  targetId?: string;
  targetName?: string;
  category: "apt" | "redev" | "sub" | "region";
  categoryLabel: string;
  subBadge?: string;
  title: string;
  content: string;
  author: string;
  authorBadge?: string;
  createdAt: string;
  views: number;
  likes: number;
  tags: string[];
  comments: {
    id: string;
    author: string;
    badge?: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
  poll?: {
    id: string;
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
}

function loadPosts(): CommunityItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return parsed.posts || [];
    }
  } catch (e) {
    console.error("Failed to read community-store.json:", e);
  }
  return [];
}

function savePosts(posts: CommunityItem[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts }, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write community-store.json:", e);
  }
}

// GET: /api/community?targetType=apt&targetId=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType"); // 'apt' | 'redev'
  const targetId = searchParams.get("targetId");     // '1', '29', etc.
  const category = searchParams.get("category");

  const posts = loadPosts();

  if (targetType && targetId) {
    const filtered = posts.filter(
      (p) => p.targetType === targetType && String(p.targetId) === String(targetId)
    );
    return NextResponse.json({ posts: filtered, count: filtered.length });
  }

  if (category && category !== "all") {
    const filtered = posts.filter((p) => p.category === category);
    return NextResponse.json({ posts: filtered, count: filtered.length });
  }

  return NextResponse.json({ posts, count: posts.length });
}

// POST: /api/community
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const posts = loadPosts();

    // 1. 새 글 작성
    if (action === "createPost") {
      const {
        targetType = "general",
        targetId,
        targetName,
        category = "apt",
        categoryLabel,
        subBadge = "실거주후기",
        title,
        content,
        author,
        authorBadge,
        tags = [],
        poll,
      } = body;

      const newPost: CommunityItem = {
        id: `post-${Date.now()}`,
        targetType,
        targetId: targetId ? String(targetId) : undefined,
        targetName,
        category,
        categoryLabel: categoryLabel || (category === "apt" ? "아파트 찾기" : "재개발·정비"),
        subBadge,
        title: title || `${targetName || "단지"} 이야기`,
        content,
        author: author || "익명회원",
        authorBadge: authorBadge || "입주민",
        createdAt: "방금 전",
        views: 1,
        likes: 0,
        tags: tags.length > 0 ? tags : [targetName || "부동산"],
        comments: [],
        poll: poll || undefined,
      };

      const updated = [newPost, ...posts];
      savePosts(updated);
      return NextResponse.json({ success: true, post: newPost });
    }

    // 2. 댓글 추가
    if (action === "addComment") {
      const { postId, author, badge, content } = body;
      const targetPost = posts.find((p) => p.id === postId);
      if (!targetPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const newComment = {
        id: `c-${Date.now()}`,
        author: author || "익명",
        badge: badge || "회원",
        content,
        createdAt: "방금 전",
        likes: 0,
      };

      targetPost.comments.unshift(newComment);
      savePosts(posts);
      return NextResponse.json({ success: true, comment: newComment });
    }

    // 3. 좋아요 토글
    if (action === "toggleLike") {
      const { postId } = body;
      const targetPost = posts.find((p) => p.id === postId);
      if (!targetPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      targetPost.likes += 1;
      savePosts(posts);
      return NextResponse.json({ success: true, likes: targetPost.likes });
    }

    // 4. 투표 참여
    if (action === "votePoll") {
      const { postId, optionId } = body;
      const targetPost = posts.find((p) => p.id === postId);
      if (!targetPost || !targetPost.poll) {
        return NextResponse.json({ error: "Poll not found" }, { status: 404 });
      }

      const opt = targetPost.poll.options.find((o) => o.id === optionId);
      if (opt) {
        opt.votes += 1;
        targetPost.poll.totalVotes += 1;
        savePosts(posts);
      }
      return NextResponse.json({ success: true, poll: targetPost.poll });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Community API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
