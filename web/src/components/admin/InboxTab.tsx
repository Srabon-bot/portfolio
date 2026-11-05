"use client";

/*
 * InboxTab — contact-form messages. Mark read/unread (PATCH), delete
 * (DELETE ?id=). Unread count comes from GET /api/admin/messages and is
 * also shown in the dashboard tab bar, so every change reports back
 * through onChanged so the shell can refresh its badge.
 */

import { useState } from "react";
import type { Message } from "@/types";
import { api } from "@/lib/admin-client";
import { Pill } from "./atoms";

interface InboxTabProps {
  messages: Message[];
  onChanged: () => Promise<void> | void;
  notify: (text: string, type?: "success" | "error") => void;
}

export function InboxTab({ messages, onChanged, notify }: InboxTabProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  async function toggleRead(msg: Message) {
    const { ok, error } = await api("/api/admin/messages", {
      method: "PATCH",
      body: JSON.stringify({ id: msg._id, read: !msg.read }),
    });
    if (!ok) return notify(error || "Update failed", "error");
    await onChanged();
  }

  async function remove(msg: Message) {
    if (!window.confirm(`Delete the message from “${msg.name}” permanently?`)) return;
    const { ok, error } = await api(`/api/admin/messages?id=${msg._id}`, {
      method: "DELETE",
    });
    if (!ok) return notify(error || "Delete failed", "error");
    notify("Message deleted", "success");
    if (openId === msg._id) setOpenId(null);
    await onChanged();
  }

  /* Every contact message is one visitor's private words: never paginate
     them into a wall — the accordion keeps the list scannable. */
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">
        {messages.length} messages · newest first
      </p>

      {messages.length === 0 && (
        <div
          className="rounded-[10px] p-6 text-center border"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-sm text-muted">
            No messages yet. When someone uses the contact form, it lands here.
          </p>
        </div>
      )}

      {messages.map((msg) => {
        const isOpen = openId === msg._id;
        const date = msg.createdAt
          ? new Date(msg.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Unknown date";
        return (
          <div
            key={msg._id}
            className="rounded-[10px] border transition-colors hover:border-accent/40"
            style={{
              background: "var(--color-surface)",
              borderColor: isOpen
                ? "color-mix(in srgb, var(--color-accent) 40%, var(--color-border))"
                : "var(--color-border)",
            }}
          >
            <div className="p-4 flex items-center gap-3">
              {/* Unread dot — diamond accent marker, consistent with site language */}
              <span
                aria-hidden="true"
                className={`inline-block w-2 h-2 flex-shrink-0 ${msg.read ? "opacity-0" : ""}`}
                style={{ transform: "rotate(45deg)", background: "var(--color-accent)" }}
              />
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : (msg._id ?? null))}
                className="flex-1 min-w-0 text-left cursor-pointer"
              >
                <span className="block text-sm font-semibold text-text truncate">
                  {msg.name}
                </span>
                <span className="block text-xs text-faint truncate">
                  {msg.email} · {date}
                </span>
              </button>
              {!msg.read && <Pill tone="gold">Unread</Pill>}
            </div>

            {isOpen && (
              <div className="px-4 pb-4 flex flex-col gap-3">
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--color-text)" }}
                >
                  {msg.message}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`mailto:${msg.email}?subject=Re: your portfolio message`}
                    className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-text flex items-center cursor-pointer transition-colors hover:border-accent"
                    style={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    Reply by email
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleRead(msg)}
                    className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-text cursor-pointer transition-colors hover:border-accent"
                    style={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {msg.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(msg)}
                    className="min-h-11 px-4 rounded-lg text-xs font-mono font-semibold text-danger hover:opacity-80 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
