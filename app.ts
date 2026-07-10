import type { Metadata } from "next";
import {
  ArrowRight,
  GitBranch,
  Keyboard,
  ListChecks,
  PackagePlus,
  PlayCircle,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import { CtaButton } from "@/components/editorial/cta-button";
import { InstallCard } from "@/components/cli/install-card";
import {
  FaqEditorial,
  type FaqItem,
} from "@/components/editorial/faq-editorial";
import { SectionHead } from "@/components/editorial/section-head";
import { generateFAQSchema } from "@/lib/seo";

/**
 * /cli FAQ — install, commands, CI integration, offline use.
 * Same array feeds the visible <FaqEditorial> AND the FAQPage
 * JSON-LD so rich-result eligibility is satisfied by construction.
 */
const CLI_FAQS: ReadonlyArray<FaqItem> = [
  {
    question: "How do I install the Mesrai CLI?",
    answer:
      "Two ways. (1) `npx mesrai` runs it without installing anything — best for one-off reviews or CI steps. (2) `npm install -g @mesrai/cli` installs it globally and exposes the `mesrai` binary. Both ship the same engine; pick based on whether you want the binary persistent on your machine.",
  },
  {
    question: "Can I run reviews on my local machine before opening a PR?",
    answer:
      "Yes — that's the primary use case. `mesrai review` from the repo root reviews uncommitted + unpushed changes. Pair it with a Git pre-push hook (`mesrai install hook`) and every push is reviewed before it leaves your machine. Same engine as the cloud reviewer; same Mesrai Rules applied.",
  },
  {
    question: "Does the CLI work in CI (GitHub Actions, GitLab CI, CircleCI)?",
    answer:
      "Yes. Add `npx mesrai review --ci` as a step in any CI runner — it auto-detects the PR base + head from the standard CI environment variables (GitHub Actions, GitLab CI, CircleCI, Buildkite, Jenkins). The CLI exits with a non-zero code if blocking-severity findings exist, so it slots cleanly into a required-check gate.",
  },
  {
    question: "Where does the CLI store its config and credentials?",
    answer:
      "Config lives at `~/.config/mesrai/config.json` (Linux/macOS) or `%APPDATA%\\mesrai\\config.json` (Windows). Auth tokens are stored in the OS keychain (macOS Keychain, GNOME Keyring, Windows Credential Manager) — never in plaintext on disk. Rotate or revoke from Settings → CLI Tokens in the web app.",
  },
  {
    question: "Can I review a specific branch or commit range?",
    answer:
      "Yes. `mesrai review --base main --head feature/x` reviews the diff between any two refs. `mesrai review --since HEAD~10` reviews the last 10 commits. `mesrai review path/to/file.ts` reviews a single file. Useful for batch-reviewing legacy branches or auditing a specific change set.",
  },
  {
    question: "Does the CLI work offline or without internet?",
    answer:
      "Partially. The CLI ships an offline ruleset (~120 deterministic rules + lint checks) that runs entirely locally — no network required. The full multi-agent AI review needs a network call to either the Mesrai cloud (default) or your own LLM endpoint (BYOK). Local-only mode is enabled with `mesrai review --offline`.",
  },
];

const cliFaqSchema = generateFAQSchema([...CLI_FAQS]);

export const metadata: Metadata = {
  title: "Mesrai CLI – Local + CI Reviews",
  description:
    "Run the same Mesrai AI review from your terminal — local pre-push hook, CI step, or batch review of a branch. Same engine as PR + IDE.",
  openGraph: {
    title: "Mesrai CLI",
    description:
      "Run AI code review from your terminal. Local pre-push, CI step, branch batch. Same engine as PR + IDE.",
    type: "website",
    url: "https://mesrai.com/cli",
    siteName: "Mesrai AI",
  },
  alternates: { canonical: "https://mesrai.com/cli" },
  robots: { index: true, follow: true },
};

const USECASES = [
  {
    icon: GitBranch,
    title: "Pre-push hook",
    body: "Wire `mesrai review` into your git pre-push hook. Reviews run before code leaves your machine.",
    meta: "local",
  },
  {
    icon: Workflow,
    title: "CI step",
    body: "Drop one shell line into GitHub Actions, GitLab CI, Bitbucket Pipelines, or Azure DevOps. Same engine, same rules, same models.",
    meta: "ci",
  },
  {
    icon: PlayCircle,
    title: "Branch batch",
    body: "Run `mesrai review --all` on a feature branch — get a single report across every changed file before you open the PR.",
    meta: "batch",
  },
  {
    icon: ListChecks,
    title: "Mesrai Rules everywhere",
    body: "CLI reads the same Mesrai Rules + centralized config your cloud workspace uses. Local + remote review stay identical.",
    meta: "rules",
  },
];

/**
 * Local agent roots `mesrai skills install` detects on the machine.
 * Sourced from `apps/cli/src/utils/skills-sync-targets.ts` — keep in
 * sync when new adapters land in the CLI. Order is roughly by adoption
 * (Claude Code → Cursor → Codex first; long tail after).
 */
const SUPPORTED_TOOLS = [
  "Claude Code",
  "Cursor",
  "Codex",
  "Windsurf",
  "OpenCode",
  "Goose",
  "Gemini CLI",
  "Kilo Code",
  "Roo Code",
  "AiderDesk",
  "Agents",
  "Antigravity",
  "Droid",
  "Kiro",
] as const;

const HOW_IT_WORKS = [
  {
    icon: PackagePlus,
    title: "Single installer",
    body:
      "One install URL updates the CLI and writes bundled Mesrai skills into every detected agent root on the machine — no separate repos, no per-IDE setup.",
  },
  {
    icon: Sparkles,
    title: "Agent-friendly output",
    body:
      "`--agent`, `mesrai schema`, and `--fields` give skills, CI runners, and thin MCP layers a stable JSON envelope they can parse without scraping terminal output.",
  },
  {
    icon: Workflow,
    title: "Local + remote review flows",
    body:
      "`mesrai review` for local diffs against your team's Mesrai Rules. `mesrai pr suggestions` for fetching server-side suggestions on an existing GitHub/GitLab PR.",
  },
] as const;

const COMMANDS = [
  {
    cmd: "mesrai auth login",
    desc: "Authorize the CLI to your workspace",
  },
  {
    cmd: "mesrai review",
    desc: "Review the current diff against base branch",
  },
  {
    cmd: "mesrai review --files src/api/users.ts",
    desc: "Review specific files only",
  },
  {
    cmd: "mesrai review --severity high",
    desc: "Set minimum severity threshold for output",
  },
  {
    cmd: "mesrai rules sync",
    desc: "Pull latest Mesrai Rules from your workspace",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://mesrai.com" },
    { "@type": "ListItem", position: 2, name: "CLI", item: "https://mesrai.com/cli" },
  ],
};

export default function CLIPage() {
  return (
    <main className="min-h-screen pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cliFaqSchema) }}
      />
      <section className="bg-grid-subtle border-line border-b px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <header className="flex flex-col gap-4">
            <span className="text-ink-0 font-mono text-[11px] tracking-[0.16em] uppercase">
              // cli
            </span>
            <h1 className="text-ink-0 font-serif text-5xl leading-[1.05] font-normal tracking-tight md:text-6xl lg:text-7xl">
              Reviews from your{" "}
              <em className="text-o-500 font-normal italic">terminal</em>.
            </h1>
            <p className="text-text-secondary max-w-[58ch] text-base leading-[1.6] md:text-lg">
              Run the same multi-agent review on your machine, in CI, or as a
              pre-push hook. Same engine, same rules, same models — review
              before code ever leaves your laptop.
            </p>
            <div className="bg-text-tertiary/40 mt-1 h-px w-12" />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <CtaButton href="https://docs.mesrai.com/guides/cli/introduction">
                Install <ArrowRight className="size-3.5" />
              </CtaButton>
              <CtaButton variant="secondary" href="https://app.mesrai.com/login">
                Get a CLI key
              </CtaButton>
            </div>
          </header>

          <InstallCard />
        </div>
      </section>

      <section className="border-line border-b px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHead numeral="I." label="Where the CLI fits" meta={`${USECASES.length} workflows`} />
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {USECASES.map(({ icon: Icon, title, body, meta }) => (
              <article
                key={title}
                className="border-line bg-bg-1/40 hover:border-line-2 flex gap-4 rounded-md border p-6 transition-colors">
                <span className="border-line text-o-500 grid size-10 shrink-0 place-items-center rounded-md border">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-ink-0 font-serif text-xl leading-[1.15] font-normal tracking-tight">
                      {title}
                    </h3>
                    <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                      {meta}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[13.5px] leading-[1.55]">
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="commands" className="border-line border-b px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHead numeral="II." label="Core Commands" meta={`${COMMANDS.length} essentials`} />
          <ul className="border-line bg-bg-1/40 flex flex-col divide-y divide-[var(--color-line)] overflow-hidden rounded-md border">
            {COMMANDS.map((c) => (
              <li
                key={c.cmd}
                className="flex flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:gap-6">
                <code className="border-line bg-bg-2 text-o-500 inline-flex w-fit shrink-0 items-center rounded border px-2.5 py-1 font-mono text-[12px]">
                  {c.cmd}
                </code>
                <span className="text-text-secondary text-[13.5px] leading-snug">
                  {c.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-line border-b px-6 py-20">
        <div className="mx-auto w-full max-w-4xl">
          <SectionHead numeral="III." label="Reviews show up in the cloud too" meta="audit" />
          <article className="border-line bg-bg-1/40 flex gap-4 rounded-md border p-6">
            <span className="border-line text-o-500 grid size-10 shrink-0 place-items-center rounded-md border">
              <Terminal className="size-4" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-ink-0 font-serif text-xl leading-[1.15] font-normal tracking-tight">
                Every CLI review lands in your workspace
              </h3>
              <p className="text-text-secondary text-[14px] leading-[1.6]">
                CLI reviews appear under{" "}
                <span className="text-ink-0 font-mono text-[12px]">
                  /cli-reviews
                </span>{" "}
                in your Mesrai workspace — full audit trail of who ran what,
                when, and what findings shipped to the cloud or stayed local.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Supported agents — sourced from `apps/cli/src/utils/skills-sync-targets.ts` */}
      <section className="border-line border-b px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHead
            numeral="IV."
            label="Supported agents + IDEs"
            meta={`${SUPPORTED_TOOLS.length} roots`}
          />
          <p className="text-text-secondary max-w-[58ch] text-[14px] leading-[1.6]">
            <code className="text-o-500 font-mono text-[12px]">mesrai skills install</code>{" "}
            auto-detects every agent root present on the machine and writes
            its bundled skills into each one. A `.mesrai-managed-skills.json`
            manifest tracks which files this run owns — re-syncs are
            idempotent, uninstalls leave nothing behind.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {SUPPORTED_TOOLS.map((tool) => (
              <li
                key={tool}
                className="border-line bg-bg-1/40 text-ink-1 font-mono text-[11.5px] rounded-md border px-3 py-2"
              >
                {tool}
              </li>
            ))}
            <li className="border-line bg-bg-1/20 text-ink-3 font-mono text-[11.5px] rounded-md border border-dashed px-3 py-2">
              + more local roots
            </li>
          </ul>
        </div>
      </section>

      {/* How it works — three numbered cards matching subscription/Mesrai-front rhythm */}
      <section className="border-line border-b px-6 py-20">
        <div className="mx-auto w-full max-w-7xl">
          <SectionHead
            numeral="V."
            label="How it works"
            meta={`${HOW_IT_WORKS.length} steps`}
          />
          <ol className="grid gap-3 lg:grid-cols-3 lg:gap-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }, index) => (
              <li
                key={title}
                className="border-line bg-bg-1/40 flex flex-col gap-3 rounded-md border p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="border-line text-o-500 grid size-10 place-items-center rounded-md border">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-ink-0 font-serif text-xl leading-[1.15] font-normal tracking-tight">
                  {title}
                </h3>
                <p className="text-text-secondary text-[13.5px] leading-[1.55]">
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FaqEditorial numeral="?" label="Frequently asked" items={CLI_FAQS} />

      <section className="border-line border-b px-6 py-20 md:py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
          <span className="text-ink-3 font-mono text-[10.5px] tracking-[0.16em] uppercase">
            // install
          </span>
          <h2 className="text-ink-0 font-serif text-4xl leading-[1.05] font-normal tracking-tight md:text-5xl">
            One npm install. Same engine.
          </h2>
          <p className="text-text-secondary max-w-[55ch] text-base leading-[1.6]">
            Free CLI for free-tier workspaces. Get a CLI key from your workspace settings.
          </p>
          <div className="bg-text-tertiary/40 mt-1 h-px w-12" />
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <CtaButton href="https://docs.mesrai.com/guides/cli/introduction">
              Read the docs <ArrowRight className="size-3.5" />
            </CtaButton>
            <CtaButton variant="secondary" href="https://app.mesrai.com/login">
              Sign in
            </CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}
