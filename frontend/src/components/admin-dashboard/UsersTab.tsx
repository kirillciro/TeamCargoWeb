"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Trash2,
  Loader2,
  Truck,
  X,
  Download,
  FileImage,
} from "lucide-react";
import { fetchWithAuth, type AuthUser } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import type { DriverProfile } from "./types";

// ── AdminUsersTab ─────────────────────────────────────────────────────────────

export default function AdminUsersTab({
  currentUserId,
  dict,
  win98,
}: {
  currentUserId: number;
  dict: Dictionary;
  win98?: boolean;
}) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<{
    user: AuthUser;
    driverProfile: DriverProfile | null;
  } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  type EditState = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    availability: string;
    phone: string;
    whatsapp: string;
    country: string;
    yearsExp: string;
    licenseCats: string;
    languages: string;
    bio: string;
  };
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const load = useCallback(async (q = "") => {
    try {
      const res = await fetchWithAuth(
        `/api/admin/users?search=${encodeURIComponent(q)}`,
      );
      const data = (await res.json()) as { users?: AuthUser[] };
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleRole(u: AuthUser) {
    const newRole = u.role === "admin" ? "user" : "admin";
    setUpdatingId(u.id);
    try {
      await fetchWithAuth(`/api/admin/users/${u.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleVerify(u: AuthUser) {
    const newVerified = !u.isVerified;
    setVerifyingId(u.id);
    try {
      await fetchWithAuth(`/api/admin/users/${u.id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: newVerified }),
      });
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, isVerified: newVerified } : x,
        ),
      );
    } finally {
      setVerifyingId(null);
    }
  }

  async function deleteUser(id: number) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await fetchWithAuth(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function openView(u: AuthUser) {
    setViewUser({ user: u, driverProfile: null });
    setViewLoading(true);
    setSaveMsg(null);
    try {
      const res = await fetchWithAuth(
        `/api/admin/users/${u.id}/driver-profile`,
      );
      const data = (await res.json()) as {
        user: AuthUser;
        driverProfile: DriverProfile | null;
      };
      setViewUser({ user: data.user, driverProfile: data.driverProfile });
      const dp = data.driverProfile;
      setEditState({
        firstName: data.user.firstName ?? "",
        lastName: data.user.lastName ?? "",
        email: data.user.email ?? "",
        role: data.user.role ?? "user",
        isVerified: data.user.isVerified ?? false,
        availability: dp?.availability ?? "available",
        phone: dp?.phone ?? "",
        whatsapp: dp?.whatsapp ?? "",
        country: dp?.country ?? "",
        yearsExp: dp?.years_exp != null ? String(dp.years_exp) : "",
        licenseCats: (dp?.license_cats ?? []).join(", "),
        languages: (dp?.languages ?? []).join(", "),
        bio: dp?.bio ?? "",
      });
    } finally {
      setViewLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!viewUser || !editState) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const [userRes, dpRes] = await Promise.all([
        fetchWithAuth(`/api/admin/users/${viewUser.user.id}/profile`, {
          method: "PATCH",
          body: JSON.stringify({
            firstName: editState.firstName,
            lastName: editState.lastName,
            email: editState.email,
            role: editState.role,
            isVerified: editState.isVerified,
          }),
        }),
        fetchWithAuth(`/api/admin/users/${viewUser.user.id}/driver-profile`, {
          method: "PATCH",
          body: JSON.stringify({
            availability: editState.availability,
            phone: editState.phone || null,
            whatsapp: editState.whatsapp || null,
            country: editState.country || null,
            years_exp: editState.yearsExp
              ? parseInt(editState.yearsExp, 10)
              : null,
            license_cats: editState.licenseCats
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            languages: editState.languages
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            bio: editState.bio || null,
          }),
        }),
      ]);
      const userData = (await userRes.json()) as { user: AuthUser };
      const dpData = (await dpRes.json()) as {
        driverProfile: DriverProfile | null;
      };
      setViewUser({ user: userData.user, driverProfile: dpData.driverProfile });
      setUsers((prev) =>
        prev.map((x) => (x.id === userData.user.id ? userData.user : x)),
      );
      setSaveMsg("[OK] Saved successfully.");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e: unknown) {
      setSaveMsg(`[ERR] ${e instanceof Error ? e.message : "Save failed"}`);
    } finally {
      setSaving(false);
    }
  }

  if (win98) {
    /* ── Win98 render ── */
    const w98Btn: React.CSSProperties = {
      fontFamily: "inherit",
      fontSize: 11,
      background: "#c0c0c0",
      color: "#000",
      border: "2px solid",
      borderColor: "#fff #808080 #808080 #fff",
      padding: "1px 6px",
      cursor: "pointer",
    };
    const w98BtnSunken: React.CSSProperties = {
      ...w98Btn,
      borderColor: "#808080 #fff #fff #808080",
    };
    const w98Input: React.CSSProperties = {
      fontFamily: "inherit",
      fontSize: 11,
      background: "#fff",
      color: "#000",
      border: "2px solid",
      borderColor: "#808080 #fff #fff #808080",
      padding: "2px 6px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    };
    return (
      <>
        <div
          style={{
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            fontSize: 12,
            color: "#000",
            background: "#c0c0c0",
          }}
        >
          {/* toolbar row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: 11 }}>
              {dict.admin.users_title}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 11 }}>Search:</span>
              <input
                value={search}
                style={w98Input}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLoading(true);
                    void load(search);
                  }
                }}
                placeholder={dict.admin.search_placeholder}
              />
              <button
                style={w98Btn}
                onClick={() => {
                  setLoading(true);
                  void load(search);
                }}
              >
                Find
              </button>
            </div>
          </div>

          {/* table */}
          {loading ? (
            <div
              style={{ padding: "20px 0", textAlign: "center", color: "#000" }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                border: "2px solid",
                borderColor: "#808080 #fff #fff #808080",
                background: "#fff",
                overflow: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11,
                }}
              >
                <thead>
                  <tr style={{ background: "#000080", color: "#fff" }}>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_user}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_provider}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_joined}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_status}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_role}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_actions}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Profile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "16px 8px",
                          textAlign: "center",
                          color: "#808080",
                        }}
                      >
                        {dict.admin.no_users_found}
                      </td>
                    </tr>
                  )}
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}
                    >
                      {/* User */}
                      <td
                        style={{
                          padding: "3px 8px",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              background: "#000080",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: "bold",
                              flexShrink: 0,
                              border: "1px solid #808080",
                            }}
                          >
                            {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: 11 }}>
                              {`${u.firstName} ${u.lastName}`.trim() || "—"}
                              {u.id === currentUserId && (
                                <span
                                  style={{
                                    marginLeft: 4,
                                    color: "#808080",
                                    fontSize: 10,
                                  }}
                                >
                                  {dict.admin.you}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 10, color: "#444" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Provider */}
                      <td
                        style={{
                          padding: "3px 8px",
                          fontSize: 11,
                          borderBottom: "1px solid #d4d4d4",
                          textTransform: "capitalize",
                        }}
                      >
                        {u.provider}
                      </td>
                      {/* Joined */}
                      <td
                        style={{
                          padding: "3px 8px",
                          fontSize: 11,
                          borderBottom: "1px solid #d4d4d4",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      {/* Status toggle – Win98 */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "left",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          disabled={verifyingId === u.id}
                          onClick={() => void toggleVerify(u)}
                          title={
                            u.isVerified
                              ? "Click to unverify"
                              : "Click to verify manually"
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            opacity: verifyingId === u.id ? 0.5 : 1,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              position: "relative",
                              flexShrink: 0,
                              width: 28,
                              height: 14,
                              background: u.isVerified ? "#008000" : "#c0c0c0",
                              border: "2px solid",
                              borderColor: "#808080 #fff #fff #808080",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: 1,
                                left: u.isVerified ? 13 : 1,
                                width: 10,
                                height: 8,
                                background: "#c0c0c0",
                                border: "1px solid",
                                borderColor: "#fff #808080 #808080 #fff",
                                transition: "left 0.1s",
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: u.isVerified ? "#006400" : "#804000",
                              fontWeight: "bold",
                              minWidth: 38,
                              display: "inline-block",
                            }}
                          >
                            {verifyingId === u.id
                              ? "..."
                              : u.isVerified
                                ? dict.admin.badge_verified
                                : dict.admin.badge_pending}
                          </span>
                        </button>
                      </td>
                      {/* Role toggle – Win98 */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "left",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          disabled={
                            updatingId === u.id || u.id === currentUserId
                          }
                          onClick={() => void toggleRole(u)}
                          title={
                            u.id === currentUserId
                              ? dict.admin.cannot_change_own_role
                              : dict.admin.toggle_role
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "none",
                            border: "none",
                            cursor:
                              u.id === currentUserId
                                ? "not-allowed"
                                : "pointer",
                            padding: 0,
                            opacity:
                              updatingId === u.id || u.id === currentUserId
                                ? 0.5
                                : 1,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              position: "relative",
                              flexShrink: 0,
                              width: 28,
                              height: 14,
                              background:
                                u.role === "admin" ? "#000080" : "#c0c0c0",
                              border: "2px solid",
                              borderColor: "#808080 #fff #fff #808080",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: 1,
                                left: u.role === "admin" ? 13 : 1,
                                width: 10,
                                height: 8,
                                background: "#c0c0c0",
                                border: "1px solid",
                                borderColor: "#fff #808080 #808080 #fff",
                                transition: "left 0.1s",
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: u.role === "admin" ? "#000080" : "#444",
                              fontWeight:
                                u.role === "admin" ? "bold" : "normal",
                              minWidth: 34,
                              display: "inline-block",
                            }}
                          >
                            {updatingId === u.id
                              ? "..."
                              : u.role === "admin"
                                ? dict.admin.role_admin
                                : dict.admin.role_user}
                          </span>
                        </button>
                      </td>
                      {/* Actions */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "center",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        {u.id !== currentUserId &&
                          (confirmDeleteId === u.id ? (
                            <span
                              style={{
                                display: "inline-flex",
                                gap: 4,
                                alignItems: "center",
                              }}
                            >
                              <button
                                onClick={() => void deleteUser(u.id)}
                                disabled={deletingId === u.id}
                                style={{
                                  ...w98BtnSunken,
                                  color: "#800000",
                                  opacity: deletingId === u.id ? 0.5 : 1,
                                }}
                              >
                                {deletingId === u.id
                                  ? "..."
                                  : dict.admin.confirm}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                style={w98Btn}
                              >
                                {dict.admin.cancel}
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(u.id)}
                              style={w98Btn}
                              title={dict.admin.delete_user}
                            >
                              Del
                            </button>
                          ))}
                      </td>
                      {/* Profile */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "center",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          style={w98Btn}
                          onClick={() => void openView(u)}
                          title="View profile"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Win98 modal ── */}
        {viewUser &&
          (() => {
            const vu = viewUser;
            const dp = viewUser.driverProfile;
            const w98TitleBar: React.CSSProperties = {
              background: "linear-gradient(to right, #000080, #1084d0)",
              color: "#fff",
              padding: "3px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              fontWeight: "bold",
              userSelect: "none",
            };
            const w98TitleBtn: React.CSSProperties = {
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              color: "#000",
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: "bold",
              width: 18,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
            };
            const w98LabelStyle: React.CSSProperties = {
              fontSize: 10,
              color: "#808080",
              marginBottom: 2,
            };
            const w98ValStyle: React.CSSProperties = {
              fontSize: 11,
              color: "#000",
              fontWeight: "bold",
            };
            return (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  background: "rgba(0,0,0,0.45)",
                  overflowY: "auto",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setViewUser(null);
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 680,
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontFamily: "MS Sans Serif, Arial, sans-serif",
                    fontSize: 11,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Title bar */}
                  <div style={w98TitleBar}>
                    <span>👤 User &amp; Driver Profile</span>
                    <button
                      style={w98TitleBtn}
                      onClick={() => setViewUser(null)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Two-panel body */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                    {/* ── Left panel: identity + driver profile ── */}
                    <div
                      style={{
                        flex: "1 1 300px",
                        padding: 10,
                        borderRight: "1px solid #808080",
                        maxHeight: "75vh",
                        overflowY: "auto",
                      }}
                    >
                      {/* Identity card */}
                      <div
                        style={{
                          border: "2px solid",
                          borderColor: "#808080 #fff #fff #808080",
                          background: "#fff",
                          padding: 10,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              background: "#000080",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 24,
                              fontWeight: "bold",
                              border: "2px solid #808080",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {vu.user.avatarUrl ? (
                              <Image
                                src={vu.user.avatarUrl}
                                alt="avatar"
                                width={60}
                                height={60}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            ) : (
                              (
                                vu.user.firstName?.[0] ?? vu.user.email[0]
                              ).toUpperCase()
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 4,
                                marginBottom: 4,
                              }}
                            >
                              {[
                                {
                                  key: "firstName" as const,
                                  label: "First name",
                                },
                                {
                                  key: "lastName" as const,
                                  label: "Last name",
                                },
                              ].map(({ key, label }) => (
                                <div key={key}>
                                  <div
                                    style={{
                                      fontSize: 9,
                                      color: "#808080",
                                      marginBottom: 1,
                                    }}
                                  >
                                    {label}
                                  </div>
                                  <input
                                    value={editState?.[key] ?? ""}
                                    onChange={(e) =>
                                      setEditState((p) =>
                                        p ? { ...p, [key]: e.target.value } : p,
                                      )
                                    }
                                    style={{ ...w98Input, fontSize: 11 }}
                                  />
                                </div>
                              ))}
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "#808080",
                                  marginBottom: 1,
                                }}
                              >
                                Email
                              </div>
                              <input
                                value={editState?.email ?? ""}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p ? { ...p, email: e.target.value } : p,
                                  )
                                }
                                style={{ ...w98Input, fontSize: 11 }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                flexWrap: "wrap" as const,
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: 9,
                                    color: "#808080",
                                    marginBottom: 1,
                                  }}
                                >
                                  Role
                                </div>
                                <select
                                  value={editState?.role ?? "user"}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p ? { ...p, role: e.target.value } : p,
                                    )
                                  }
                                  style={{
                                    ...w98Input,
                                    width: "auto",
                                    fontSize: 11,
                                  }}
                                >
                                  <option value="user">user</option>
                                  <option value="admin">admin</option>
                                </select>
                              </div>
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={editState?.isVerified ?? false}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p
                                        ? { ...p, isVerified: e.target.checked }
                                        : p,
                                    )
                                  }
                                />
                                Verified
                              </label>
                            </div>
                            <div
                              style={{
                                fontSize: 9,
                                color: "#808080",
                                marginTop: 4,
                              }}
                            >
                              {vu.user.provider} · Joined{" "}
                              {new Date(vu.user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver profile */}
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 11,
                          marginBottom: 6,
                          borderBottom: "2px solid #808080",
                          paddingBottom: 2,
                        }}
                      >
                        Driver Profile
                      </div>
                      {viewLoading ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px 0",
                            color: "#808080",
                          }}
                        >
                          Loading...
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 4,
                          }}
                        >
                          <div>
                            <div style={w98LabelStyle}>Availability</div>
                            <select
                              value={editState?.availability ?? "available"}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p
                                    ? { ...p, availability: e.target.value }
                                    : p,
                                )
                              }
                              style={{
                                ...w98Input,
                                width: "100%",
                                fontSize: 11,
                              }}
                            >
                              <option value="available">Available</option>
                              <option value="open">Open to offers</option>
                              <option value="unavailable">Not available</option>
                            </select>
                          </div>
                          <div>
                            <div style={w98LabelStyle}>Years exp.</div>
                            <input
                              value={editState?.yearsExp ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, yearsExp: e.target.value } : p,
                                )
                              }
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div>
                            <div style={w98LabelStyle}>Phone</div>
                            <input
                              value={editState?.phone ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, phone: e.target.value } : p,
                                )
                              }
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div>
                            <div style={w98LabelStyle}>WhatsApp</div>
                            <input
                              value={editState?.whatsapp ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, whatsapp: e.target.value } : p,
                                )
                              }
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={w98LabelStyle}>Country</div>
                            <input
                              value={editState?.country ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, country: e.target.value } : p,
                                )
                              }
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={w98LabelStyle}>
                              License categories (comma-separated)
                            </div>
                            <input
                              value={editState?.licenseCats ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, licenseCats: e.target.value } : p,
                                )
                              }
                              placeholder="e.g. B, C, CE"
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={w98LabelStyle}>
                              Languages (comma-separated)
                            </div>
                            <input
                              value={editState?.languages ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, languages: e.target.value } : p,
                                )
                              }
                              placeholder="e.g. English, Dutch"
                              style={{ ...w98Input, fontSize: 11 }}
                            />
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={w98LabelStyle}>Bio</div>
                            <textarea
                              value={editState?.bio ?? ""}
                              onChange={(e) =>
                                setEditState((p) =>
                                  p ? { ...p, bio: e.target.value } : p,
                                )
                              }
                              rows={3}
                              style={{
                                ...w98Input,
                                fontSize: 11,
                                resize: "vertical" as const,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Right panel: documents ── */}
                    <div
                      style={{
                        flex: "1 1 220px",
                        padding: 10,
                        maxHeight: "75vh",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 11,
                          marginBottom: 6,
                          borderBottom: "2px solid #808080",
                          paddingBottom: 2,
                        }}
                      >
                        Documents
                      </div>
                      {(() => {
                        const docs = [
                          {
                            url: vu.user.licenseFrontUrl,
                            label: "License Front",
                          },
                          {
                            url: vu.user.licenseBackUrl,
                            label: "License Back",
                          },
                          {
                            url: vu.user.passportFrontUrl,
                            label: "Passport Front",
                          },
                          {
                            url: vu.user.passportBackUrl,
                            label: "Passport Back",
                          },
                        ];
                        const hasAny = docs.some((d) => d.url);
                        if (!hasAny)
                          return (
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "#808080 #fff #fff #808080",
                                background: "#fff",
                                padding: 8,
                                color: "#808080",
                                textAlign: "center",
                                fontSize: 11,
                              }}
                            >
                              No documents uploaded yet.
                            </div>
                          );
                        return (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 5,
                            }}
                          >
                            {docs.map(({ url, label }) =>
                              url ? (
                                <div
                                  key={label}
                                  style={{
                                    border: "2px solid",
                                    borderColor: "#808080 #fff #fff #808080",
                                    background: "#fff",
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* Clickable image — opens shared lightbox */}
                                  <div
                                    style={{
                                      position: "relative",
                                      cursor: "zoom-in",
                                      aspectRatio: "3/2",
                                      width: "100%",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewUrl(url);
                                    }}
                                    title="Click to enlarge"
                                  >
                                    <Image
                                      src={url}
                                      alt={label}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      sizes="200px"
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        bottom: 2,
                                        right: 2,
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        fontSize: 9,
                                        padding: "1px 3px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      🔍
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      padding: "3px 4px",
                                      borderTop: "1px solid #c0c0c0",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 10,
                                        color: "#444",
                                        marginBottom: 2,
                                      }}
                                    >
                                      {label}
                                    </div>
                                    <a
                                      href={url.replace(
                                        "/upload/",
                                        "/upload/fl_attachment/",
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        fontSize: 10,
                                        color: "#000080",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        display: "inline-block",
                                      }}
                                    >
                                      ⬇ Download
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={label}
                                  style={{
                                    border: "2px solid",
                                    borderColor: "#808080 #fff #fff #808080",
                                    background: "#f0f0f0",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 8,
                                    gap: 2,
                                    aspectRatio: "3/2",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: 16, color: "#808080" }}
                                  >
                                    🖼
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "#808080",
                                      textAlign: "center",
                                    }}
                                  >
                                    {label}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "5px 10px",
                      textAlign: "right",
                      borderTop: "1px solid #808080",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: saveMsg?.startsWith("[OK]")
                          ? "#006400"
                          : "#800000",
                        fontWeight: "bold",
                      }}
                    >
                      {saveMsg ?? ""}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={w98Btn} onClick={() => setViewUser(null)}>
                        Close
                      </button>
                      <button
                        style={{
                          ...w98Btn,
                          background: "#000080",
                          color: "#fff",
                          borderColor: "#fff #808080 #808080 #fff",
                          opacity: saving || viewLoading ? 0.5 : 1,
                        }}
                        disabled={saving || viewLoading}
                        onClick={() => void handleSaveProfile()}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* ── Win98 image preview lightbox ── */}
        {previewUrl && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
            onClick={() => setPreviewUrl(null)}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                cursor: "pointer",
                padding: "2px 8px",
                fontFamily: "MS Sans Serif, Arial",
                fontSize: 12,
                fontWeight: "bold",
              }}
              onClick={() => setPreviewUrl(null)}
            >
              ✕ Close
            </div>
            <Image
              src={previewUrl}
              alt="Preview"
              width={1200}
              height={900}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                width: "auto",
                height: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  /* ── Modern render ── */
  return (
    <>
      {/* ── Image preview lightbox ── */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <Image
            src={previewUrl}
            alt="Preview"
            width={1200}
            height={900}
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            style={{ width: "auto", height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-lg font-bold text-white">
            {dict.admin.users_title}
          </h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLoading(true);
                  void load(search);
                }
              }}
              placeholder={dict.admin.search_placeholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">{dict.admin.col_user}</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    {dict.admin.col_provider}
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    {dict.admin.col_joined}
                  </th>
                  <th className="px-4 py-3 text-left">
                    {dict.admin.col_status}
                  </th>
                  <th className="px-4 py-3 text-left">{dict.admin.col_role}</th>
                  <th className="px-4 py-3 text-center">
                    {dict.admin.col_actions}
                  </th>
                  <th className="px-4 py-3 text-center">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      {dict.admin.no_users_found}
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs">
                            {`${u.firstName} ${u.lastName}`.trim() || "—"}
                            {u.id === currentUserId && (
                              <span className="ml-1.5 text-[10px] text-slate-500">
                                {dict.admin.you}
                              </span>
                            )}
                          </p>
                          <p className="text-slate-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-slate-400 text-xs capitalize">
                        {u.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        disabled={verifyingId === u.id}
                        onClick={() => void toggleVerify(u)}
                        title={
                          u.isVerified
                            ? "Click to unverify"
                            : "Click to verify manually"
                        }
                        className="inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer group"
                      >
                        <span
                          className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
                            u.isVerified
                              ? "bg-green-500"
                              : "bg-slate-600 group-hover:bg-slate-500"
                          }`}
                        >
                          {verifyingId === u.id ? (
                            <Loader2 className="w-3 h-3 text-white animate-spin absolute inset-0 m-auto" />
                          ) : (
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                                u.isVerified ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          )}
                        </span>
                        <span
                          className={`text-[11px] font-medium min-w-10.5 text-left ${
                            u.isVerified ? "text-green-400" : "text-slate-400"
                          }`}
                        >
                          {u.isVerified
                            ? dict.admin.badge_verified
                            : dict.admin.badge_pending}
                        </span>
                      </button>
                    </td>
                    {/* Role toggle */}
                    <td className="px-4 py-3">
                      <button
                        disabled={updatingId === u.id || u.id === currentUserId}
                        onClick={() => void toggleRole(u)}
                        title={
                          u.id === currentUserId
                            ? dict.admin.cannot_change_own_role
                            : dict.admin.toggle_role
                        }
                        className="inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer group"
                      >
                        <span
                          className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
                            u.role === "admin"
                              ? "bg-amber-500"
                              : "bg-slate-600 group-hover:bg-slate-500"
                          }`}
                        >
                          {updatingId === u.id ? (
                            <Loader2 className="w-3 h-3 text-white animate-spin absolute inset-0 m-auto" />
                          ) : (
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                                u.role === "admin"
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          )}
                        </span>
                        <span
                          className={`text-[11px] font-medium min-w-9 text-left ${
                            u.role === "admin"
                              ? "text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {u.role === "admin"
                            ? dict.admin.role_admin
                            : dict.admin.role_user}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.id !== currentUserId &&
                        (confirmDeleteId === u.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => void deleteUser(u.id)}
                              disabled={deletingId === u.id}
                              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                            >
                              {deletingId === u.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                dict.admin.confirm
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              {dict.admin.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(u.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title={dict.admin.delete_user}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => void openView(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#36B347] hover:bg-[#36B347]/10 transition-colors"
                        title="View driver profile"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── User profile modal ── */}
      {viewUser &&
        (() => {
          const vu = viewUser;
          const dp = viewUser.driverProfile;
          const docs = [
            { url: vu.user.licenseFrontUrl, label: "License Front" },
            { url: vu.user.licenseBackUrl, label: "License Back" },
            { url: vu.user.passportFrontUrl, label: "Passport Front" },
            { url: vu.user.passportBackUrl, label: "Passport Back" },
          ];
          const hasAnyDoc = docs.some((d) => d.url);
          return (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
              onClick={() => setViewUser(null)}
            >
              {/* Centering wrapper */}
              <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div
                  className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ── Header ── */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#36B347]" />
                      <span className="font-bold text-white text-sm">
                        User &amp; Driver Profile
                      </span>
                    </div>
                    <button
                      onClick={() => setViewUser(null)}
                      className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ── Two-column body ── */}
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: identity + driver profile */}
                    <div className="flex-1 min-w-0">
                      {/* Identity card */}
                      <div className="p-5 border-b border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden">
                            {vu.user.avatarUrl ? (
                              <Image
                                src={vu.user.avatarUrl}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (
                                vu.user.firstName?.[0] ?? vu.user.email[0]
                              ).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                  First name
                                </label>
                                <input
                                  value={editState?.firstName ?? ""}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p
                                        ? { ...p, firstName: e.target.value }
                                        : p,
                                    )
                                  }
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                  Last name
                                </label>
                                <input
                                  value={editState?.lastName ?? ""}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p
                                        ? { ...p, lastName: e.target.value }
                                        : p,
                                    )
                                  }
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                                />
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Email
                              </label>
                              <input
                                value={editState?.email ?? ""}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p ? { ...p, email: e.target.value } : p,
                                  )
                                }
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                              />
                            </div>
                            <div className="mt-2 flex items-end gap-4 flex-wrap">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                  Role
                                </label>
                                <select
                                  value={editState?.role ?? "user"}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p ? { ...p, role: e.target.value } : p,
                                    )
                                  }
                                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                                >
                                  <option value="user">user</option>
                                  <option value="admin">admin</option>
                                </select>
                              </div>
                              <label className="flex items-center gap-2 cursor-pointer pb-1.5">
                                <input
                                  type="checkbox"
                                  checked={editState?.isVerified ?? false}
                                  onChange={(e) =>
                                    setEditState((p) =>
                                      p
                                        ? { ...p, isVerified: e.target.checked }
                                        : p,
                                    )
                                  }
                                  className="w-3.5 h-3.5 accent-[#36B347]"
                                />
                                <span className="text-xs text-slate-300">
                                  Verified
                                </span>
                              </label>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-2">
                              <span className="capitalize">
                                {vu.user.provider}
                              </span>
                              {" · "}
                              Joined{" "}
                              {new Date(vu.user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Driver profile */}
                      <div className="p-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                          Driver Profile
                        </p>
                        {viewLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Availability
                              </label>
                              <select
                                value={editState?.availability ?? "available"}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p
                                      ? { ...p, availability: e.target.value }
                                      : p,
                                  )
                                }
                                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50 w-full"
                              >
                                <option value="available">Available</option>
                                <option value="open">Open to offers</option>
                                <option value="unavailable">
                                  Not available
                                </option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {(
                                [
                                  { key: "phone", label: "Phone" },
                                  { key: "whatsapp", label: "WhatsApp" },
                                  { key: "country", label: "Country" },
                                  { key: "yearsExp", label: "Years exp." },
                                ] as const
                              ).map(({ key, label }) => (
                                <div key={key}>
                                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                    {label}
                                  </label>
                                  <input
                                    value={editState?.[key] ?? ""}
                                    onChange={(e) =>
                                      setEditState((p) =>
                                        p ? { ...p, [key]: e.target.value } : p,
                                      )
                                    }
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                                  />
                                </div>
                              ))}
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                License categories{" "}
                                <span className="normal-case font-normal">
                                  (comma-separated)
                                </span>
                              </label>
                              <input
                                value={editState?.licenseCats ?? ""}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p
                                      ? { ...p, licenseCats: e.target.value }
                                      : p,
                                  )
                                }
                                placeholder="e.g. B, C, CE"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Languages{" "}
                                <span className="normal-case font-normal">
                                  (comma-separated)
                                </span>
                              </label>
                              <input
                                value={editState?.languages ?? ""}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p ? { ...p, languages: e.target.value } : p,
                                  )
                                }
                                placeholder="e.g. English, Dutch"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Bio
                              </label>
                              <textarea
                                value={editState?.bio ?? ""}
                                onChange={(e) =>
                                  setEditState((p) =>
                                    p ? { ...p, bio: e.target.value } : p,
                                  )
                                }
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#36B347]/50 resize-y"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: documents */}
                    <div className="w-full sm:w-96 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 p-5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                        Documents
                      </p>
                      {!hasAnyDoc ? (
                        <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 text-sm text-slate-400 text-center">
                          No documents uploaded yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {docs.map(({ url, label }) =>
                            url ? (
                              <div
                                key={label}
                                className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/60 flex flex-col"
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrl(url);
                                  }}
                                  className="relative aspect-8/5 w-full block cursor-zoom-in group"
                                >
                                  <Image
                                    src={url}
                                    alt={label}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 192px"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6 text-white drop-shadow"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l2 2"
                                      />
                                    </svg>
                                  </div>
                                </button>
                                <div className="flex items-center justify-between px-2 py-1.5 border-t border-slate-700 shrink-0">
                                  <p className="text-[10px] font-medium text-slate-400 truncate">
                                    {label}
                                  </p>
                                  <a
                                    href={url.replace(
                                      "/upload/",
                                      "/upload/fl_attachment/",
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-[10px] font-semibold text-[#36B347] hover:text-white transition-colors shrink-0 ml-2"
                                  >
                                    <Download className="w-3 h-3" /> DL
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={label}
                                className="rounded-xl border border-dashed border-slate-700/50 bg-slate-800/30 aspect-8/5 flex flex-col items-center justify-center gap-1.5"
                              >
                                <FileImage className="w-5 h-5 text-slate-600" />
                                <p className="text-[10px] text-slate-600 text-center px-2">
                                  {label}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-800 shrink-0">
                    <div className="text-xs">
                      {saveMsg && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium ${saveMsg.startsWith("[OK]") ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/30" : "bg-red-500/10 text-red-400 ring-1 ring-red-500/30"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${saveMsg.startsWith("[OK]") ? "bg-green-400" : "bg-red-400"}`}
                          />
                          {saveMsg.replace(/^\[OK\] |^\[ERR\] /, "")}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewUser(null)}
                        className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs text-slate-400 hover:bg-slate-800 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => void handleSaveProfile()}
                        disabled={saving || viewLoading}
                        className="rounded-lg bg-[#36B347] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2a9438] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                      >
                        {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
