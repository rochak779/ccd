import { AppShell } from "@/features/shell/app-shell";
import { BaselineWorkspace } from "@/features/baseline";
import { DealSetup } from "@/features/deals";
import { RequestTracker, SampleReviewWorkspace } from "@/features/requests";

const links = [{ label: "Overview", href: "#overview" }, { label: "Requests", href: "#requests" }, { label: "Evidence", href: "#baseline" }];

export default async function SamplePage({ searchParams }: { searchParams: Promise<{ evaluation?: string; source?: string }> }) {
  const params = await searchParams;
  const evaluation = params.evaluation === "unavailable" || params.evaluation === "evaluating" ? params.evaluation : "ready";
  const sourceAvailability = params.source === "unavailable" || params.source === "invalid" || params.source === "warning" || params.source === "no-access" ? params.source : "ready";
  return <AppShell title="Project Northstar" context="Confirmatory diligence · Synthetic sample" accountLabel="Priya Shah" links={links}><div className="sample-workspace"><section id="overview" className="workspace-frame"><SampleReviewWorkspace evaluation={evaluation} sourceAvailability={sourceAvailability} /></section><section id="requests" className="workspace-frame"><RequestTracker /></section><section id="baseline" className="workspace-frame"><BaselineWorkspace /></section><section id="deal-setup" className="workspace-frame"><DealSetup /></section></div></AppShell>;
}
