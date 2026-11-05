"use client";

/*
 * Admin dashboard — the shell around the editing tabs.
 * Vercel-native: every request is same-origin + httpOnly cookie auth
 * (no NEXT_PUBLIC_API_URL, no localStorage tokens). Session is verified
 * via GET /api/admin/me; data loads in parallel; mutations inside the
 * tabs call onChanged() to refresh counts and lists.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile, Skill, Project, Message, Education } from "@/types";
import { seedProfile } from "@/lib/seed-data";
import { api } from "@/lib/admin-client";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { ProfileTab } from "@/components/admin/ProfileTab";
import { SkillsTab } from "@/components/admin/SkillsTab";
import { EducationTab } from "@/components/admin/EducationTab";
import { InboxTab } from "@/components/admin/InboxTab";

type TabType =
  | "overview"
  | "projects"
  | "skills"
  | "education"
  | "profile"
  | "messages";

interface DashboardData {
  projects: Project[];
  skills: Skill[];
  education: Education[];
  profile: Profile | null;
  messages: Message[];
  unread: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [adminEmail, setAdminEmail] = useState("");
  const [data, setData] = useState<DashboardData>({
    projects: [],
    skills: [],
    education: [],
    profile: null,
    messages: [],
    unread: 0,
  });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  /* All five payloads in parallel; shapes are wrapped ({projects: []} etc.) */
  async function refreshAll() {
    const [projects, skills, education, profile, messages] = await Promise.all([
      api<{ projects: Project[] }>("/api/admin/projects"),
      api<{ skills: Skill[] }>("/api/admin/skills"),
      api<{ education: Education[] }>("/api/admin/education"),
      api<{ profile: Profile | null }>("/api/admin/profile"),
      api<{ messages: Message[]; unread: number }>("/api/admin/messages"),
    ]);
    setData({
      projects: projects.data?.projects ?? [],
      skills: skills.data?.skills ?? [],
      education: education.data?.education ?? [],
      profile: profile.data?.profile ?? null,
      messages: messages.data?.messages ?? [],
      unread: messages.data?.unread ?? 0,
    });
  }

  /* Bottom-right toast; success/danger tokens for their allowed purposes */
  const notify = useCallback(
    (text: string, type: "success" | "error" = "success") => {
      setFeedback({ text, type });
      window.setTimeout(() => setFeedback(null), 4000);
    },
    []
  );

  /* Session check first — a 401 sends us to the login screen */
  useEffect(() => {
    let live = true;
    async function init() {
      const me = await api<{ email: string }>("/api/admin/me");
      if (!me.ok) {
        router.replace("/admin/login");
        return;
      }
      if (!live) return;
      setAdminEmail(me.data?.email ?? "Admin");
      await refreshAll();
      if (live) setLoading(false);
    }
    void init();
    return () => {
      live = false;
    };
  }, [router]);

  async function handleLogout() {
    await api("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: "var(--color-accent-soft)" }}
        >
          Loading admin console…
        </p>
      </div>
    );
  }

  const publishedProjects = data.projects.filter((p) => p.status === "published").length;

  const tabs: { id: TabType; label: string; badge?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", badge: data.projects.length },
    { id: "skills", label: "Skills", badge: data.skills.length },
    { id: "education", label: "Education", badge: data.education.length },
    { id: "profile", label: "Profile" },
    { id: "messages", label: "Inbox", badge: data.unread },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header
        className="w-full px-4 md:px-6 py-3 flex items-center justify-between gap-3 border-b sticky top-0 z-30"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="font-bold text-base md:text-lg text-text tracking-wider flex-shrink-0">
            Srabon<span style={{ color: "var(--color-accent)" }}>.</span>
            <span className="hidden sm:inline"> Studio</span>
          </Link>
          <span
            className="text-xs px-2.5 py-1 rounded-full truncate max-w-[16rem]"
            style={{
              background: "color-mix(in srgb, var(--color-accent) 14%, transparent)",
              color: "var(--color-accent-soft)",
              border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
            }}
          >
            {adminEmail}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className="min-h-11 px-3 flex items-center text-xs font-semibold rounded-lg transition-colors hover:border-accent"
            style={{
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="min-h-11 px-3 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            style={{
              color: "var(--color-danger)",
              background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-danger) 35%, transparent)",
            }}
          >
            Log out
          </button>
        </div>
      </header>

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs font-medium border max-w-xs"
          style={
            feedback.type === "error"
              ? {
                  background: "color-mix(in srgb, var(--color-danger) 12%, transparent)",
                  borderColor: "color-mix(in srgb, var(--color-danger) 40%, transparent)",
                  color: "var(--color-danger)",
                }
              : {
                  background: "color-mix(in srgb, var(--color-success) 12%, transparent)",
                  borderColor: "color-mix(in srgb, var(--color-success) 40%, transparent)",
                  color: "var(--color-success)",
                }
          }
        >
          {feedback.text}
        </div>
      )}

      {/* ── Body: tabs rail + content ────────────────────────────────── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-8">
        <nav
          aria-label="Admin sections"
          className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-shrink-0 md:w-52"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap min-h-11 cursor-pointer"
                style={
                  active
                    ? {
                        background: "var(--color-accent)",
                        color: "var(--color-on-accent)",
                      }
                    : {
                        color: "var(--color-muted)",
                        background: "transparent",
                      }
                }
              >
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={
                      active
                        ? { background: "color-mix(in srgb, var(--color-on-accent) 20%, transparent)" }
                        : tab.id === "messages"
                          ? {
                              background:
                                "color-mix(in srgb, var(--color-accent) 16%, transparent)",
                              color: "var(--color-accent-soft)",
                            }
                          : {
                              background: "var(--color-surface-2)",
                              color: "var(--color-muted)",
                            }
                    }
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 flex flex-col gap-5 min-w-0">
          {activeTab === "overview" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-xl font-bold text-text">Overview</h1>
                <p className="text-xs text-muted mt-1">
                  Every save publishes instantly — the public site revalidates server-side.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Projects", value: data.projects.length, sub: `${publishedProjects} published` },
                  { label: "Skills", value: data.skills.length, sub: "Across 4 groups" },
                  { label: "Education cards", value: data.education.length, sub: `${data.education.filter((e) => e.published).length} published` },
                  { label: "Unread messages", value: data.unread, sub: `${data.messages.length} total` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-5 rounded-[10px] paper-shadow flex flex-col gap-1"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  >
                    <span className="text-xs text-faint uppercase font-semibold tracking-wider">
                      {stat.label}
                    </span>
                    <span className="text-2xl font-bold text-text">{stat.value}</span>
                    <span className="text-xs text-muted">{stat.sub}</span>
                  </div>
                ))}
              </div>
              <div
                className="rounded-[10px] p-5 paper-shadow"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
              >
                <h2 className="text-sm font-bold text-text">Session</h2>
                <p className="text-xs text-muted mt-1">
                  Signed in as <span className="font-mono">{adminEmail}</span>. Sessions are
                  httpOnly cookies — nothing sensitive is stored in the browser.
                </p>
                <p className="text-xs text-muted mt-2">
                  Image and resume uploads go to Vercel Blob; make sure the Blob store is
                  attached in the dashboard for production uploads.
                </p>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              projects={data.projects}
              onChanged={refreshAll}
              notify={notify}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab skills={data.skills} onChanged={refreshAll} notify={notify} />
          )}

          {activeTab === "education" && (
            <EducationTab
              education={data.education}
              onChanged={refreshAll}
              notify={notify}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab
              profile={data.profile ?? seedProfile}
              onChanged={refreshAll}
              notify={notify}
            />
          )}

          {activeTab === "messages" && (
            <InboxTab messages={data.messages} onChanged={refreshAll} notify={notify} />
          )}
        </main>
      </div>
    </div>
  );
}
