import { AppShell } from "@/features/shell/app-shell";
import { BaselineWorkspace } from "@/features/baseline";
import { DealSetup } from "@/features/deals";
import { DealOverview, RequestTracker } from "@/features/requests";

const links = [{ label: "Overview", href: "#overview" }, { label: "Requests", href: "#requests" }, { label: "Evidence", href: "#baseline" }];

export default function SamplePage() {
  return <AppShell title="Project Northstar" context="Confirmatory diligence · Synthetic sample" accountLabel="Priya Shah" links={links}><div className="sample-workspace"><section id="overview" className="workspace-frame"><DealOverview /></section><section id="requests" className="workspace-frame"><RequestTracker /></section><section id="baseline" className="workspace-frame"><BaselineWorkspace /></section><section id="deal-setup" className="workspace-frame"><DealSetup /></section></div></AppShell>;
}
