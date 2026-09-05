import { z } from "zod";
import type { Workspace } from "../data/repository.ts";

export const coverageStateSchema = z.enum([
  "SUPPORTED", "PARTIALLY_SUPPORTED", "MENTIONED_ONLY", "IRRELEVANT", "UNREADABLE", "MISSING",
]);

const assessmentSchema = z.object({
  requestItemId: z.string().min(1),
  state: coverageStateSchema,
  sourceIds: z.array(z.string().min(1)),
  evidenceIds: z.array(z.string().min(1)),
  reason: z.string().min(1),
});

export const preparedEvaluationSchema = z.object({
  requestId: z.string().min(1),
  assessments: z.array(assessmentSchema),
});

export type CoverageAssessment = z.infer<typeof assessmentSchema>;
export type PreparedEvaluation = z.infer<typeof preparedEvaluationSchema>;
export type EvaluationState = "READY" | "INVALID_OUTPUT" | "RETRYABLE_FAILURE" | "PREPARED_FALLBACK";

export type EvaluationResult = {
  state: EvaluationState;
  assessments: CoverageAssessment[];
  proposal?: Workspace["proposals"][number];
  findings: Workspace["findings"];
  error?: string;
};

const locatorKey = (locator: Workspace["evidence"][number]["locator"]): string => JSON.stringify(locator);

function validateEvaluation(workspace: Workspace, input: unknown): PreparedEvaluation {
  const parsed = preparedEvaluationSchema.parse(input);
  const request = workspace.requests.find(({ id }) => id === parsed.requestId);
  if (!request) throw new Error(`Unknown request ${parsed.requestId}`);
  const itemIds = new Set(request.items.map(({ id }) => id));
  const sourceIds = new Set(workspace.sources.map(({ id }) => id));
  const evidenceById = new Map(workspace.evidence.map((evidence) => [evidence.id, evidence]));
  if (parsed.assessments.length !== request.items.length) throw new Error("Evaluation must cover every request item exactly once");
  const seen = new Set<string>();
  for (const assessment of parsed.assessments) {
    if (!itemIds.has(assessment.requestItemId) || seen.has(assessment.requestItemId)) throw new Error(`Invalid or duplicate request item ${assessment.requestItemId}`);
    seen.add(assessment.requestItemId);
    for (const sourceId of assessment.sourceIds) if (!sourceIds.has(sourceId) && !workspace.messages.some(({ id }) => id === sourceId)) throw new Error(`Unknown source ${sourceId}`);
    for (const evidenceId of assessment.evidenceIds) {
      const evidence = evidenceById.get(evidenceId);
      if (!evidence || evidence.supportsRequestItemId !== assessment.requestItemId) throw new Error(`Invalid evidence relationship ${evidenceId}`);
      if (!sourceIds.has(evidence.sourceId) || !locatorKey(evidence.locator)) throw new Error(`Invalid evidence locator ${evidenceId}`);
    }
    if (assessment.state === "SUPPORTED" && assessment.evidenceIds.length === 0) throw new Error(`Supported item ${assessment.requestItemId} requires evidence`);
  }
  return parsed;
}

export function percentagePointDelta(previous: { rawValue: number; unit: string }, current: { rawValue: number; unit: string }): number | null {
  if (previous.unit !== current.unit || previous.unit !== "PERCENT") return null;
  return Math.round((current.rawValue - previous.rawValue) * 10_000) / 100;
}

function conflictFinding(workspace: Workspace, requestId: string): Workspace["findings"][number] | undefined {
  const request = workspace.requests.find(({ id }) => id === requestId);
  if (!request) return undefined;
  const response = workspace.messages.find(({ dealId, classification, bodyText }) =>
    dealId === request.dealId && classification === "DILIGENCE_RESPONSE" && /concentration\s+remains\s+stable/i.test(bodyText));
  const previous = workspace.baselineClaims.find(({ state, subject, period, unit }) =>
    state === "CONFIRMED" && /concentration/i.test(subject) && period === "FY25" && unit === "PERCENT");
  const itemIds = new Set(request.items.filter(({ period }) => period === "FY26").map(({ id }) => id));
  const current = workspace.evidence.find(({ supportsRequestItemId }) => itemIds.has(supportsRequestItemId));
  if (!response || !previous || !current) return undefined;
  const delta = percentagePointDelta(previous, { rawValue: current.rawValue, unit: previous.unit });
  if (delta === null || Math.abs(delta) < 0.01) return undefined;
  return {
    id: `finding_${request.id.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_conflict`, dealId: request.dealId,
    type: "POTENTIAL_CONFLICT", state: "OPEN", suggestedSeverity: "HIGH", confirmedSeverity: null,
    sourceIds: [previous.sourceId, current.sourceId, response.id],
    reason: `Management describes concentration as stable while comparable ${previous.period} and FY26 observations changed from ${previous.displayValue} to ${current.displayValue} (${Math.abs(delta)} percentage points).`,
  };
}

export function evaluateCoverage(workspace: Workspace, raw: unknown, options: { fallback?: unknown; retryable?: boolean } = {}): EvaluationResult {
  let input: PreparedEvaluation;
  let state: EvaluationState = "READY";
  try { input = validateEvaluation(workspace, raw); }
  catch (error) {
    if (options.fallback !== undefined) {
      try { input = validateEvaluation(workspace, options.fallback); state = "PREPARED_FALLBACK"; }
      catch { return { state: options.retryable ? "RETRYABLE_FAILURE" : "INVALID_OUTPUT", assessments: [], findings: [], error: error instanceof Error ? error.message : "Invalid evaluation" }; }
    } else return { state: options.retryable ? "RETRYABLE_FAILURE" : "INVALID_OUTPUT", assessments: [], findings: [], error: error instanceof Error ? error.message : "Invalid evaluation" };
  }
  const request = workspace.requests.find(({ id }) => id === input.requestId)!;
  const supportedItems = input.assessments.filter(({ state }) => state === "SUPPORTED").map(({ requestItemId }) => requestItemId);
  const missingItems = input.assessments.filter(({ state }) => state !== "SUPPORTED").map(({ requestItemId }) => requestItemId);
  const conflict = conflictFinding(workspace, request.id);
  const findings: Workspace["findings"] = [];
  if (missingItems.length) findings.push({ id: `finding_${request.id.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_missing`, dealId: request.dealId, type: "MISSING_EVIDENCE", state: "OPEN", suggestedSeverity: "MEDIUM", confirmedSeverity: null, sourceIds: [...new Set(input.assessments.flatMap(({ sourceIds }) => sourceIds))].length ? [...new Set(input.assessments.flatMap(({ sourceIds }) => sourceIds))] : [request.sourceMessageId], reason: `${supportedItems.length} of ${request.items.length} required evidence components are supported.` });
  if (conflict) findings.push(conflict);
  return {
    state, assessments: input.assessments, findings,
    proposal: { id: `proposal_${request.id.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`, requestId: request.id, previousStatus: request.approvedStatus, proposedStatus: missingItems.length ? "PARTIAL_EVIDENCE_MISSING" : "READY_TO_COMPLETE", proposalState: "READY", supportedItems, missingItems, findingIds: findings.map(({ id }) => id), requiresHumanApproval: true },
  };
}
