import { AppShell } from "@/features/shell/app-shell";
import { DealSetup } from "@/features/deals";

export default function NewDealPage() {
  return <AppShell title="Create your first deal" context="Acme Capital · Prepared local prototype" accountLabel="Priya Shah"><div className="workspace-frame"><DealSetup /></div></AppShell>;
}
