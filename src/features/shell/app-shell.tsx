"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "./shell.module.css";

export type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "ccd-theme";

export function ThemeProvider({ children }: { children: (theme: ThemePreference, setTheme: (theme: ThemePreference) => void) => ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    queueMicrotask(() => {
      if (saved === "light" || saved === "dark" || saved === "system") setPreference(saved);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = preference === "system" ? (media.matches ? "dark" : "light") : preference;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
    };
    window.localStorage.setItem(THEME_KEY, preference);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference, ready]);

  return <div className={styles.themeRoot}><ThemeBootScript />{children(preference, setPreference)}</div>;
}

function ThemeBootScript() {
  const code = `(function(){try{var p=localStorage.getItem('${THEME_KEY}')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeSelector({ value, onChange }: { value: ThemePreference; onChange: (value: ThemePreference) => void }) {
  const icons = { system: Monitor, light: Sun, dark: Moon } as const;
  return (
    <fieldset className={styles.themeSelector} aria-label="Colour theme">
      <legend>Theme</legend>
      {(["system", "light", "dark"] as const).map((option) => {
        const Icon = icons[option];
        return <label key={option}><input type="radio" name="theme" checked={value === option} onChange={() => onChange(option)} /><Icon aria-hidden="true" size={16} /><span>{option[0].toUpperCase() + option.slice(1)}</span></label>;
      })}
    </fieldset>
  );
}

export type ShellLink = { label: string; href: string; current?: boolean };

export function AppShell({ children, title, context, links = [], homeHref = "/", accountLabel }: { children: ReactNode; title?: string; context?: ReactNode; links?: ShellLink[]; homeHref?: string; accountLabel?: string }) {
  return (
    <ThemeProvider>{(theme, setTheme) => <>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href={homeHref} aria-label="CC’d home">CC’d</a>
          <div className={styles.headerContext}>{context ? <span className={styles.contextMeta}>{context}</span> : null}{accountLabel ? <span>{accountLabel}</span> : null}<ThemeSelector value={theme} onChange={setTheme} /></div>
        </div>
        {links.length ? <nav className={styles.nav} aria-label="Workspace"><div>{links.map((link) => <a key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>{link.label}</a>)}</div></nav> : null}
      </header>
      <main className={styles.main} id="main-content">
        {title ? <section className={styles.contextBand}><h1>{title}</h1>{context ? <div>{context}</div> : null}</section> : null}
        {children}
      </main>
    </>}</ThemeProvider>
  );
}
