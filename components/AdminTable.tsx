"use client";

import { useState } from "react";
import {
  Eye,
  Check,
  X,
  Download,
  RefreshCw,
  MessageCircle
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Applicant } from "../lib/sheets";
import { toCSV, downloadCSV } from "../lib/utils";

type TabKey = "all" | "pending_payment" | "awaiting_verification" | "registered" | "dropped";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending_payment", label: "Pending" },
  { key: "awaiting_verification", label: "Awaiting Verification" },
  { key: "registered", label: "Registered" },
  { key: "dropped", label: "Dropped" }
];

const CSV_HEADERS = [
  "refCode", "name", "phone", "location", "experience",
  "reason", "canAttend", "status", "receiptUrl", "timestamp"
];

interface AdminTableProps {
  initialApplicants: Applicant[];
  adminPassword: string;
}

export default function AdminTable({ initialApplicants, adminPassword }: AdminTableProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [tab, setTab] = useState<TabKey>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approvedRef, setApprovedRef] = useState<{ ref: string; name: string; phone: string } | null>(null);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const trainingDate = process.env.NEXT_PUBLIC_TRAINING_DATE ?? "TBD";

  const filtered =
    tab === "all" ? applicants : applicants.filter((a) => a.status === tab);

  // Stats
  const stats = {
    total: applicants.length,
    pending: applicants.filter((a) => a.status === "pending_payment").length,
    verified: applicants.filter((a) => a.status === "awaiting_verification").length,
    registered: applicants.filter((a) => a.status === "registered").length,
    dropped: applicants.filter((a) => a.status === "dropped").length
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/get-applicants", {
        headers: { Authorization: `Bearer ${adminPassword}` }
      });
      const data = await res.json();
      if (data.rows) setApplicants(data.rows);
    } finally {
      setRefreshing(false);
    }
  };

  const updateStatus = async (ref: string, status: string) => {
    setActionLoading(`${ref}-${status}`);
    try {
      const res = await fetch("/api/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPassword}`
        },
        body: JSON.stringify({ ref, status })
      });
      const data = await res.json();
      if (data.success) {
        setApplicants((prev) =>
          prev.map((a) => (a.refCode === ref ? { ...a, status } : a))
        );
        if (status === "registered") {
          const applicant = applicants.find((a) => a.refCode === ref);
          if (applicant) {
            setApprovedRef({ ref, name: applicant.name, phone: applicant.phone });
          }
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    const csv = toCSV(filtered as unknown as Record<string, string>[], CSV_HEADERS);
    downloadCSV(csv, `gearbox-applicants-${tab}-${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Pending", value: stats.pending, color: "text-white/60" },
          { label: "Awaiting", value: stats.verified, color: "text-amber-400" },
          { label: "Registered", value: stats.registered, color: "text-green-400" },
          { label: "Dropped", value: stats.dropped, color: "text-red-400" }
        ].map((s) => (
          <div key={s.label} className="card text-center py-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Approved WhatsApp prompt */}
      {approvedRef && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-green-400 font-semibold text-sm">
              ✅ {approvedRef.name} approved!
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              Send them the confirmation message on WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/${approvedRef.phone}?text=${encodeURIComponent(
              `Hi ${approvedRef.name}, your payment has been confirmed! Your training reference is *${approvedRef.ref}*. Training starts ${trainingDate}. We'll send you the group link shortly. Welcome aboard! 🎉`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            onClick={() => setApprovedRef(null)}
          >
            <MessageCircle className="w-4 h-4" />
            Message on WhatsApp
          </a>
        </div>
      )}

      {/* Filter tabs + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-[#F5A623] text-[#0A0F1E]"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.label}
              {t.key !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({applicants.filter((a) => a.status === t.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            id="admin-refresh-btn"
            onClick={refresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            id="admin-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-white/40 text-lg">No applicants found</p>
          <p className="text-white/20 text-sm mt-1">
            {tab === "all" ? "No applications yet." : `No applicants with status: ${tab}`}
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/2">
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Ref</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Name</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Phone</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Location</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Experience</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Receipt</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Date</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((applicant, idx) => (
                <tr
                  key={applicant.refCode}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                    idx % 2 === 0 ? "" : "bg-white/[0.01]"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-[#F5A623] font-semibold whitespace-nowrap">
                    {applicant.refCode}
                  </td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap max-w-[150px] truncate">
                    {applicant.name}
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                    <a
                      href={`https://wa.me/${applicant.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#F5A623] transition-colors"
                    >
                      {applicant.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{applicant.location}</td>
                  <td className="px-4 py-3 text-white/70 whitespace-nowrap">{applicant.experience}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={applicant.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {applicant.receiptUrl ? (
                      <a
                        href={applicant.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#F5A623] hover:underline text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </a>
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">
                    {applicant.timestamp
                      ? new Date(applicant.timestamp).toLocaleDateString("en-NG", {
                          day: "numeric", month: "short", year: "numeric"
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {applicant.status !== "registered" && (
                        <button
                          id={`approve-${applicant.refCode}`}
                          onClick={() => updateStatus(applicant.refCode, "registered")}
                          disabled={actionLoading === `${applicant.refCode}-registered`}
                          title="Approve"
                          className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs font-medium transition-all disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                          Approve
                        </button>
                      )}
                      {applicant.status !== "dropped" && (
                        <button
                          id={`reject-${applicant.refCode}`}
                          onClick={() => updateStatus(applicant.refCode, "dropped")}
                          disabled={actionLoading === `${applicant.refCode}-dropped`}
                          title="Reject"
                          className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs font-medium transition-all disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WhatsApp float for admin (quick contact) */}
      {waNumber && (
        <p className="text-white/30 text-xs text-right">
          Total showing: {filtered.length} of {applicants.length}
        </p>
      )}
    </div>
  );
}
