"use client";

import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field } from "@/components/ui/controls";
import { AppShell } from "@/features/shell/app-shell";
import styles from "./signin.module.css";

export default function SignInPage() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email) || !password) return setError("Enter your work email and password to continue."); localStorage.setItem("ccd-signed-in", email.toLowerCase()); router.push("/dashboard"); }
  return <AppShell accountLabel="Secure workspace access"><div className={styles.wrap}><section className={styles.intro}><LockKeyhole size={28} aria-hidden /><h1>Welcome back to the deal desk.</h1><p>Sign in to review every diligence request, source and proposed update across your active deals.</p><div><Mail size={18} aria-hidden /><span>Your deal-specific addresses keep incoming threads routed to the correct workspace.</span></div></section><section className={styles.form}><h2>Sign in</h2><p>Use your organisation credentials.</p><form onSubmit={submit} noValidate><Field name="email" label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /><Field name="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />{error && <p className={styles.error} role="alert">{error}</p>}<Button type="submit">Open dashboard<ArrowRight size={17} aria-hidden /></Button></form><a href="/signup">New to CC’d? Create your workspace</a><small>Prototype note: authentication is simulated locally.</small></section></div></AppShell>;
}
