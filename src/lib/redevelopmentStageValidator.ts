/**
 * 정비사업 추진단계 전이 및 역행 방지 검증 모듈
 *
 * [핵심 규칙]
 * 1. 공고 제목 텍스트 마이닝만으로 단계를 맹목적으로 확정하지 않습니다.
 * 2. 공식 공고 URL과 날짜를 증거로 보존합니다.
 * 3. 기존 단계보다 앞선 단계로 되돌아가는 '단계 역행(Stage Regression)'을 원천 차단합니다.
 *    (예: 이미 '관리처분인가'인 구역에 '조합설립 변경인가' 공고가 나왔다고 '조합설립인가'로 후퇴 방지)
 */

import { RedevelopmentStageType, RedevelopmentNoticeRecord } from "@/types/domainSchema";

/** 추진단계 표준 진행 순서 (숫자가 클수록 성숙된 단계) */
export const STAGE_PROGRESSION_ORDER: Record<RedevelopmentStageType, number> = {
  해제: -1,
  미정: 0,
  기본계획수립: 1,
  정비구역지정: 2,
  추진위원회승인: 3,
  조합설립인가: 4,
  건축심의: 5,
  사업시행인가: 6,
  관리처분인가: 7,
  이주철거: 8,
  착공: 9,
  일반분양: 10,
  준공: 11,
};

export interface StageTransitionResult {
  /** 단계 변경 승인 여부 */
  allowed: boolean;
  /** 최종 적용할 단계 */
  finalStage: RedevelopmentStageType;
  /** 단계 변경 사유 또는 차단 이유 */
  reason: string;
  /** 감사/검토 필요 여부 */
  requiresManualReview: boolean;
  /** 공고 레코드 생성 객체 */
  noticeRecord: Omit<RedevelopmentNoticeRecord, "id" | "created_at">;
}

/**
 * 정비사업 단계 전이 유효성 검증 엔진
 *
 * @param currentStage 현재 구역의 등록 단계
 * @param currentStageDate 현재 단계 고시일 (YYYY-MM-DD)
 * @param candidateStage 새로 감지된 후보 단계
 * @param noticeInfo 공식 공고 메타데이터 (제목, 공고일, URL, 발행처)
 */
export function validateStageTransition(
  currentStage: RedevelopmentStageType,
  currentStageDate: string | undefined,
  candidateStage: RedevelopmentStageType | undefined,
  noticeInfo: {
    projectId: string;
    title: string;
    publishedAt: string;
    sourceUrl?: string;
    sourceName: string;
  }
): StageTransitionResult {
  const currentRank = STAGE_PROGRESSION_ORDER[currentStage] ?? 0;
  const candidateRank = candidateStage ? STAGE_PROGRESSION_ORDER[candidateStage] ?? 0 : 0;

  // 1. 후보 단계가 감지되지 않았거나 '미정'인 경우: 현상 유지
  if (!candidateStage || candidateStage === "미정") {
    return {
      allowed: false,
      finalStage: currentStage,
      reason: "후보 단계가 감지되지 않았거나 미정 상태입니다.",
      requiresManualReview: false,
      noticeRecord: {
        project_id: noticeInfo.projectId,
        title: noticeInfo.title,
        published_at: noticeInfo.publishedAt,
        source_url: noticeInfo.sourceUrl,
        source_name: noticeInfo.sourceName,
        detected_stage: candidateStage,
        is_verified: false,
      },
    };
  }

  // 2. '구역 해제' 고시인 경우: 즉각 반영 (단, 고시 URL 필수)
  if (candidateStage === "해제") {
    const hasProof = Boolean(noticeInfo.sourceUrl && noticeInfo.sourceUrl.length > 5);
    return {
      allowed: hasProof,
      finalStage: hasProof ? "해제" : currentStage,
      reason: hasProof ? "정비구역 해제 고시 확인" : "해제 고시 출처 URL 미비로 보류",
      requiresManualReview: true,
      noticeRecord: {
        project_id: noticeInfo.projectId,
        title: noticeInfo.title,
        published_at: noticeInfo.publishedAt,
        source_url: noticeInfo.sourceUrl,
        source_name: noticeInfo.sourceName,
        detected_stage: "해제",
        is_verified: hasProof,
      },
    };
  }

  // 3. 단계 역행 검증 (중요): 새 단계 순위가 현재 순위보다 낮은 경우 차단
  if (candidateRank < currentRank) {
    return {
      allowed: false,
      finalStage: currentStage,
      reason: `단계 역행 차단: 현재 [${currentStage}(${currentRank})] 단계보다 앞선 [${candidateStage}(${candidateRank})] 변경 공고는 구역의 최신 단계를 후퇴시키지 않습니다. (경미한 변경 고시로 판정)`,
      requiresManualReview: true,
      noticeRecord: {
        project_id: noticeInfo.projectId,
        title: noticeInfo.title,
        published_at: noticeInfo.publishedAt,
        source_url: noticeInfo.sourceUrl,
        source_name: noticeInfo.sourceName,
        detected_stage: candidateStage,
        is_verified: false, // 역행 감지 건은 자동 승인하지 않음
      },
    };
  }

  // 4. 공고일 역전 검증: 새 공고의 날짜가 기존 단계 고시일보다 과거인 경우
  if (currentStageDate && noticeInfo.publishedAt < currentStageDate && candidateRank <= currentRank) {
    return {
      allowed: false,
      finalStage: currentStage,
      reason: `과거 고시일 역전 차단: 공고일(${noticeInfo.publishedAt})이 현 단계 확정일(${currentStageDate}) 이전입니다.`,
      requiresManualReview: false,
      noticeRecord: {
        project_id: noticeInfo.projectId,
        title: noticeInfo.title,
        published_at: noticeInfo.publishedAt,
        source_url: noticeInfo.sourceUrl,
        source_name: noticeInfo.sourceName,
        detected_stage: candidateStage,
        is_verified: false,
      },
    };
  }

  // 5. 정방향 전진 (순방향 단계 진척: 예: 조합설립 -> 사업시행인가 -> 관리처분인가)
  return {
    allowed: true,
    finalStage: candidateStage,
    reason: `정상 단계 진척 승인: [${currentStage}] -> [${candidateStage}] (공고: ${noticeInfo.title})`,
    requiresManualReview: false,
    noticeRecord: {
      project_id: noticeInfo.projectId,
      title: noticeInfo.title,
      published_at: noticeInfo.publishedAt,
      source_url: noticeInfo.sourceUrl,
      source_name: noticeInfo.sourceName,
      detected_stage: candidateStage,
      is_verified: true,
    },
  };
}
