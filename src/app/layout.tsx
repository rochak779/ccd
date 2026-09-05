import type { Metadata } from "next";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "CC’d — Evidence-linked diligence",
  description:
    "Turn ordinary diligence email into an evidence-linked tracker proposal with a human decision.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body data-direction-seed="9aa6803b">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html:
              "<!-- THESIS: evidence is held in one decisive frame, never scattered dashboard cards. OWN-WORLD: violet paper, ink frame, lavender context, yellow human action, condensed display and neutral evidence rows. STORY: see the request, test its support, understand that a person decides. FIRST VIEWPORT: dark header above a broad lavender claim joined to a three-compartment evidence frame; the prepared decision closes the right pane. FORM: framed evidence desk, fifth grounded direction, seed 9aa6803b. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->",
          }}
        />
        {children}
      </body>
    </html>
  );
}
