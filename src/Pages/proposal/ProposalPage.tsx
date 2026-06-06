/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import {
  FileText, Trash2, Loader2, Search,
  ChevronDown, 
} from "lucide-react";
import toast from "react-hot-toast";
import { useDeleteProposalMutation, useGetAllProposalsQuery, useGetProposalAnalyticsQuery, useUpdateProposalStatusMutation } from "../../redux/features/proposals/proposalApi";

const statusColor: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  sent:     "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusOptions = ["draft", "sent", "accepted", "rejected"];

export default function ProposalPage() {
  const [search, setSearch]         = useState("");
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllProposalsQuery(undefined);
  const { data: analyticsData }      = useGetProposalAnalyticsQuery(undefined);
  const [updateStatus]               = useUpdateProposalStatusMutation();
  const [deleteProposal, { isLoading: isDeleting }] = useDeleteProposalMutation();

  const proposals  = data?.data ?? [];
  const analytics  = analyticsData?.data ?? {};

  const filtered = proposals.filter((p: any) =>
    p.proposalNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.lead?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
      setStatusDropdown(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal(id).unwrap();
      toast.success("Proposal deleted");
      setConfirmId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Failed to load proposals.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Proposals</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {analytics?.totalProposal ?? 0} total
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Draft",    value: analytics?.draftProposal,    color: "bg-slate-50 text-slate-600",  dot: "bg-slate-400" },
          { label: "Sent",     value: analytics?.sentProposal,     color: "bg-blue-50 text-blue-700",    dot: "bg-blue-500"  },
          { label: "Accepted", value: analytics?.acceptedProposal, color: "bg-green-50 text-green-700",  dot: "bg-green-500" },
          { label: "Rejected", value: analytics?.rejectedProposal, color: "bg-red-50 text-red-700",      dot: "bg-red-500"   },
        ].map(({ label, value, color, dot }) => (
          <div key={label} className={`rounded-xl p-4 flex items-center gap-3 ${color}`}>
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
            <div>
              <p className="text-xs opacity-70">{label}</p>
              <p className="text-xl font-semibold">{value ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Proposal No</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Client</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Lead</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Utility Bill</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Total Cost</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No proposals found
                  </td>
                </tr>
              ) : (
                filtered.map((proposal: any, index: number) => (
                  <tr key={proposal._id} className="hover:bg-slate-50 transition-colors">

                    {/* # */}
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                    {/* Proposal number */}
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {proposal.proposalNumber}
                    </td>

                    {/* Client */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-700 text-xs font-semibold">
                            {proposal.client?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-slate-600">{proposal.client?.name ?? "—"}</span>
                      </div>
                    </td>

                    {/* Lead */}
                    <td className="px-5 py-3.5 text-slate-500">
                      {proposal.lead?.name ?? "—"}
                    </td>

                    {/* Utility bill */}
                    <td className="px-5 py-3.5 text-slate-600">
                      ${proposal.utilityBill?.toLocaleString()}
                    </td>

                    {/* Total cost */}
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      ${proposal.savingsProjection?.totalCost?.toLocaleString()}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-5 py-3.5 relative">
                      <button
                        onClick={() =>
                          setStatusDropdown(
                            statusDropdown === proposal._id ? null : proposal._id
                          )
                        }
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${statusColor[proposal.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {proposal.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {/* Dropdown */}
                      {statusDropdown === proposal._id && (
                        <div className="absolute top-10 left-4 z-20 bg-white border border-slate-200 rounded-lg shadow-md py-1 w-32">
                          {statusOptions.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(proposal._id, s)}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors capitalize ${proposal.status === s ? "font-semibold text-blue-600" : "text-slate-600"}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setConfirmId(proposal._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete Proposal?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">
              This action cannot be undone. The proposal will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={isDeleting}
                className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {statusDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setStatusDropdown(null)}
        />
      )}

    </div>
  );
}