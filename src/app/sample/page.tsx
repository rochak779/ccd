import { AppShell } from "@/features/shell/app-shell";
import { BaselineWorkspace } from "@/features/baseline";
import { DealSetup } from "@/features/deals";
import { AccessDenied, RequestTracker, SampleReviewWorkspace, type FailureScenario } from "@/features/requests";

const links = [{ label: "Overview", href: "#overview" }, { label: "Requests", href: "#requests" }, { label: "Evidence", href: "#baseline" }];

export default async function SamplePage({ searchParams }: { searchParams: Promise<{ evaluation?: string; source?: string; failure?: string; persona?: string }> }) {
  const params = await searchParams;
  const evaluation = params.evaluation === "unavailable" || params.evaluation === "evaluating" ? params.evaluation : "ready";
  const sourceAvailability = params.source === "unavailable" || params.source === "invalid" || params.source === "warning" || params.source === "no-access" ? params.source : "ready";
  const failures: FailureScenario[] = ["parser", "model", "interrupted", "unsupported", "no-attachment", "unrelated"];
  const failure = failures.includes(params.failure as FailureScenario) ? params.failure as FailureScenario : undefined;
  if (params.persona === "member-without-access") return <AppShell title="Deal unavailable" context="Local persona demonstration" accountLabel="Alex Morgan"><AccessDenied /></AppShell>;
  return <AppShell title="Project Northstar" context="Confirmatory diligence · Synthetic sample" accountLabel="Priya Shah" links={links}><div className="sample-workspace"><section id="overview" className="workspace-frame"><SampleReviewWorkspace evaluation={evaluation} sourceAvailability={sourceAvailability} failure={failure} /></section><section id="requests" className="workspace-frame"><RequestTracker /></section><section id="baseline" className="workspace-frame"><BaselineWorkspace /></section><section id="deal-setup" className="workspace-frame"><DealSetup /></section></div></AppShell>;
}
