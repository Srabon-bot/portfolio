"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile, Skill, Project, Message } from "@/types";

type TabType = "overview" | "projects" | "skills" | "profile" | "messages";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  // Data states
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Action states
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [linkCheckLoading, setLinkCheckLoading] = useState(false);
  const [githubImportUrl, setGithubImportUrl] = useState("");
  const [githubImportLoading, setGithubImportLoading] = useState(false);

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<"frontend" | "backend" | "tools" | "ml-data">("frontend");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  function getHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  // Check auth and load initial dashboard data
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch(`${apiBase}/auth/me`, {
          headers: getHeaders(),
          credentials: "include",
        });

        if (!authRes.ok) {
          router.push("/admin/login");
          return;
        }

        const authData = await authRes.json();
        setAdminEmail(authData.email || "Admin");

        // Load data
        const [profRes, skillRes, projRes, msgRes] = await Promise.all([
          fetch(`${apiBase}/profile`).then((r) => (r.ok ? r.json() : {})),
          fetch(`${apiBase}/skills`).then((r) => (r.ok ? r.json() : [])),
          fetch(`${apiBase}/admin/projects`, { headers: getHeaders() }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${apiBase}/admin/messages`, { headers: getHeaders() }).then((r) => (r.ok ? r.json() : [])),
        ]);

        setProfile(profRes);
        setSkills(skillRes);
        setProjects(projRes);
        setMessages(msgRes);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, apiBase]);

  function notify(text: string, type: "success" | "error" = "success") {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function handleLogout() {
    localStorage.removeItem("admin_token");
    await fetch(`${apiBase}/auth/logout`, { method: "POST" });
    router.push("/admin/login");
  }

  /* ── 1. Profile Handlers ────────────────────────────────────────── */
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/admin/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      notify("Profile updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      notify(msg, "error");
    }
  }

  /* ── 2. Skills Handlers ─────────────────────────────────────────── */
  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch(`${apiBase}/admin/skills`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: newSkillName.trim(),
          category: newSkillCategory,
          order: skills.length + 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add skill");
      const created = await res.json();
      setSkills((prev) => [...prev, created]);
      setNewSkillName("");
      notify(`Added skill: ${created.name}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add skill";
      notify(msg, "error");
    }
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm("Are you sure you want to remove this skill?")) return;
    try {
      const res = await fetch(`${apiBase}/admin/skills/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete skill");
      setSkills((prev) => prev.filter((s) => s._id !== id));
      notify("Skill deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete skill";
      notify(msg, "error");
    }
  }

  /* ── 3. Projects Handlers ───────────────────────────────────────── */
  async function handleToggleFeatured(project: Project) {
    const newFeatured = !project.featured;
    try {
      const res = await fetch(`${apiBase}/admin/projects/${project._id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ featured: newFeatured }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update featured state");

      setProjects((prev) => prev.map((p) => (p._id === project._id ? { ...p, featured: newFeatured } : p)));
      notify(`Updated: ${project.title} featured = ${newFeatured}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update featured state";
      notify(msg, "error");
    }
  }

  async function handleToggleStatus(project: Project) {
    const newStatus = project.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`${apiBase}/admin/projects/${project._id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detailMsg = data.details ? data.details.join(" ") : data.error;
        throw new Error(detailMsg || "Publish validation failed");
      }

      setProjects((prev) => prev.map((p) => (p._id === project._id ? { ...p, status: newStatus } : p)));
      notify(`Status changed to ${newStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Publish validation failed";
      notify(msg, "error");
    }
  }

  async function handleImportGithub(e: React.FormEvent) {
    e.preventDefault();
    if (!githubImportUrl) return;

    setGithubImportLoading(true);
    try {
      const res = await fetch(`${apiBase}/admin/projects/import-github`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ repoUrl: githubImportUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "GitHub import failed");

      setProjects((prev) => [data, ...prev]);
      setGithubImportUrl("");
      notify(`Successfully imported: ${data.title}! (Saved as draft)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "GitHub import failed";
      notify(msg, "error");
    } finally {
      setGithubImportLoading(false);
    }
  }

  async function handleCheckLinks() {
    setLinkCheckLoading(true);
    try {
      const res = await fetch(`${apiBase}/admin/check-links`, {
        method: "POST",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Link checker failed");

      // Reload projects
      const updated = await fetch(`${apiBase}/admin/projects`, { headers: getHeaders() }).then((r) => r.json());
      setProjects(updated);
      notify("All project links verified!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Link checker failed";
      notify(msg, "error");
    } finally {
      setLinkCheckLoading(false);
    }
  }

  /* ── 4. Messages Handlers ───────────────────────────────────────── */
  async function handleMarkRead(id: string, read: boolean) {
    try {
      await fetch(`${apiBase}/admin/messages/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ read }),
      });
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)));
    } catch {
      notify("Failed to update message", "error");
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`${apiBase}/admin/messages/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      notify("Message deleted");
    } catch {
      notify("Failed to delete message", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <p className="text-sm font-medium text-accent-soft animate-pulse">Loading Admin Dashboard…</p>
      </div>
    );
  }

  const featuredCount = projects.filter((p) => p.featured).length;
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Top Bar */}
      <header
        className="w-full px-6 py-4 flex items-center justify-between border-b"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-lg text-text tracking-wider">
            Srabon<span className="text-accent">.</span> CMS
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent-soft font-semibold">
            Admin: {adminEmail}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-muted hover:text-text transition-colors"
            style={{ borderColor: "var(--color-border)" }}
          >
            View Live Site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-medium border ${
            feedback.type === "error"
              ? "bg-red-950/90 border-red-500 text-red-200"
              : "bg-amber-950/90 border-amber-500 text-amber-100"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0 flex flex-row md:flex-col gap-2">
          {([
            { id: "overview" as const, label: "📊 Overview", badge: undefined },
            { id: "projects" as const, label: "💼 Projects", badge: projects.length },
            { id: "skills" as const, label: "🛠️ Skills", badge: skills.length },
            { id: "profile" as const, label: "👤 Profile", badge: undefined },
            { id: "messages" as const, label: "✉️ Messages", badge: unreadMessagesCount },
          ] as { id: TabType; label: string; badge?: number }[]).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-accent text-on-accent shadow-lg shadow-amber-900/20"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-on-accent/20 text-on-accent font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 flex flex-col gap-6">
          {/* ── TAB 1: OVERVIEW ──────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-text">System Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-xs text-faint uppercase font-semibold">Total Projects</span>
                  <span className="text-2xl font-bold text-text">{projects.length}</span>
                  <span className="text-xs text-muted">
                    {featuredCount} / 4 featured slots filled
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-xs text-faint uppercase font-semibold">Skills Configured</span>
                  <span className="text-2xl font-bold text-text">{skills.length}</span>
                  <span className="text-xs text-muted">Across 4 categories</span>
                </div>
                <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-xs text-faint uppercase font-semibold">Unread Messages</span>
                  <span className="text-2xl font-bold text-text">{unreadMessagesCount}</span>
                  <span className="text-xs text-muted">Total: {messages.length}</span>
                </div>
                <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                  <span className="text-xs text-faint uppercase font-semibold">Link Health</span>
                  <button
                    onClick={handleCheckLinks}
                    disabled={linkCheckLoading}
                    className="mt-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-on-accent bg-accent hover:opacity-90 transition-opacity"
                  >
                    {linkCheckLoading ? "Checking Links…" : "Verify All Links"}
                  </button>
                </div>
              </div>

              {/* GitHub Importer Strip */}
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-3">
                <h3 className="text-sm font-bold text-text flex items-center gap-2">
                  <span>⚡</span> One-Click GitHub Importer (PRD §10)
                </h3>
                <p className="text-xs text-muted">
                  Paste any GitHub repository URL to automatically fetch its description, stack topics, and generate a draft case study.
                </p>
                <form onSubmit={handleImportGithub} className="flex gap-3 mt-1">
                  <input
                    type="url"
                    required
                    value={githubImportUrl}
                    onChange={(e) => setGithubImportUrl(e.target.value)}
                    placeholder="https://github.com/Srabon-bot/kaist-haalkhata"
                    className="flex-1 rounded-xl px-4 py-2 text-xs outline-none bg-surface-2 border border-border text-text"
                  />
                  <button
                    type="submit"
                    disabled={githubImportLoading}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-on-accent bg-accent hover:opacity-90 disabled:opacity-60"
                  >
                    {githubImportLoading ? "Importing…" : "Import Repo"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── TAB 2: PROJECTS ──────────────────────────────────────── */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text">Project Case Studies</h2>
                  <p className="text-xs text-muted">
                    Featured: {featuredCount}/4 max • Enforces PRD §9 publish validation rules.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {projects.map((p) => (
                  <div
                    key={p._id || p.slug}
                    className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-text">{p.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === "published"
                              ? "bg-success/15 text-success"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-muted">
                          {p.type}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent-soft">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted line-clamp-1">{p.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                          p.featured
                            ? "bg-accent/20 border-accent/40 text-accent-soft"
                            : "border-border text-muted hover:text-text"
                        }`}
                      >
                        {p.featured ? "Unfeature" : "Feature (★)"}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          p.status === "published"
                            ? "bg-surface-2 border border-border text-muted hover:text-text"
                            : "bg-success text-on-accent hover:opacity-90"
                        }`}
                      >
                        {p.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="text-xs px-2.5 py-1.5 text-accent-soft hover:underline"
                      >
                        Preview ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: SKILLS ────────────────────────────────────────── */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-text">Skills &amp; Technologies</h2>

              {/* Add Skill Form */}
              <form
                onSubmit={handleAddSkill}
                className="p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row gap-3 items-center"
              >
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Docker, GraphQL, Redis"
                  className="flex-1 w-full rounded-xl px-4 py-2 text-xs outline-none bg-surface-2 border border-border text-text"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as Skill["category"])}
                  className="w-full sm:w-44 rounded-xl px-3 py-2 text-xs outline-none bg-surface-2 border border-border text-text"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend (MERN)</option>
                  <option value="tools">Tools</option>
                  <option value="ml-data">ML &amp; Data</option>
                </select>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-semibold text-on-accent bg-accent hover:opacity-90"
                >
                  + Add Skill
                </button>
              </form>

              {/* Categorized Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["frontend", "backend", "tools", "ml-data"] as const).map((cat) => {
                  const catSkills = skills.filter((s) => s.category === cat);
                  return (
                    <div key={cat} className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-faint">
                        {cat === "ml-data" ? "ML & Data" : cat.toUpperCase()} ({catSkills.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((s) => (
                          <span
                            key={s._id || s.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-2 border border-border text-text"
                          >
                            {s.name}
                            <button
                              onClick={() => s._id && handleDeleteSkill(s._id)}
                              className="text-faint hover:text-danger font-bold ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TAB 4: PROFILE ───────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-text">Profile &amp; Biography Settings</h2>
              <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">Display Name</label>
                    <input
                      type="text"
                      value={profile.displayName || ""}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">Role Label</label>
                    <input
                      type="text"
                      value={profile.role || ""}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">Location</label>
                    <input
                      type="text"
                      value={profile.location || ""}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">Email</label>
                    <input
                      type="email"
                      value={profile.email || ""}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profile.linkedin || ""}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-faint uppercase">GitHub URL</label>
                    <input
                      type="url"
                      value={profile.github || ""}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-faint uppercase">Tagline (One-line value statement)</label>
                  <textarea
                    rows={2}
                    value={profile.tagline || ""}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="rounded-xl px-4 py-2 text-xs bg-surface-2 border border-border text-text outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="self-end px-6 py-2.5 rounded-xl text-xs font-semibold text-on-accent bg-accent hover:opacity-90"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 5: MESSAGES ──────────────────────────────────────── */}
          {activeTab === "messages" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-text">Contact Inbox ({messages.length})</h2>
              {messages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-surface border border-border text-center text-xs text-muted">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={`p-5 rounded-2xl border transition-colors flex flex-col gap-2 ${
                        m.read ? "bg-surface border-border opacity-70" : "bg-surface-2 border-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-text">{m.name}</span>
                          <span className="text-xs text-muted">({m.email})</span>
                          {!m.read && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => m._id && handleMarkRead(m._id, !m.read)}
                            className="text-xs text-accent-soft hover:underline"
                          >
                            {m.read ? "Mark unread" : "Mark read"}
                          </button>
                          <button
                            onClick={() => m._id && handleDeleteMessage(m._id)}
                            className="text-xs text-danger hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
