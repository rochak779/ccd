"use client";

import { Plus } from "lucide-react";
import { AppShell } from "@/features/shell/app-shell";
import { NORTHSTAR_REQUESTS, RequestTracker } from "@/features/requests";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const urgent = NORTHSTAR_REQUESTS.filter((request) => request.proposal || (request.due && request.due <= "2026-09-08")).length;
  return <AppShell title="All requests" context="Acme Capital · 3 active deals" accountLabel="Priya Shah" links={[{ label: "All requests", href: "/dashboard", current: true }, { label: "Project Northstar", href: "/sample" }, { label: "Deals", href: "/deals/new" }]}><div className={styles.frame}><section className={styles.summary}><div><strong>{NORTHSTAR_REQUESTS.length}</strong><span>Open requests</span></div><div><strong>{urgent}</strong><span>Need attention</span></div><p>Requests across every active deal, ordered for review. Open any row to inspect its source and approved state.</p><a href="/deals/new"><Plus size={17} aria-hidden />New deal</a></section><section className={styles.requests}><RequestTracker title="Requests across your deals" recordLabel="open records" /></section></div></AppShell>;
}
