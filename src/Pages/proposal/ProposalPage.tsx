/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {useGetAllProposalsQuery, useGetProposalAnalyticsQuery, useUpdateProposalStatusMutation,
  useDeleteProposalMutation,
  useCreateProposalMutation,
} from "../../redux/features/proposals/proposalApi";
import { useGetAllLeadsQuery } from "../../redux/features/leads/leadsApi";
import { useGetAllUsersQuery } from "../../redux/features/users/userApi";
import { useAuth } from "../../context/AuthContext";
import { FileText, Trash2, Loader2, Search, ChevronDown, Plus, X,} from "lucide-react";
import toast from "react-hot-toast";

const statusColor: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  sent:     "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusOptions = ["draft", "sent", "accepted", "rejected"];

const emptyForm = {
  lead: "", client: "",
  utilityBill: "", roofType: "",
  totalCost: "", monthlySavings: "", yearlySavings: "", paybackPeriod: "",
  systemSize: "", panelCount: "", inverterType: "", batteryIncluded: false,
  taxCreditIncluded: true, financingOption: "", notes: "",
};

export default function ProposalPage() {
  const { user } = useAuth();

  const [search, setSearch]               = useState("");
  const [confirmId, setConfirmId]         = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [showModal, setShowModal]         = useState(false);
  const [form, setForm]                   = useState(emptyForm);

  const { data, isLoading, isError }              = useGetAllProposalsQuery(undefined);
  const { data: analyticsData }                   = useGetProposalAnalyticsQuery(undefined);
  const { data: leadsData }                       = useGetAllLeadsQuery(undefined);
  const { data: usersData }                       = useGetAllUsersQuery(undefined);
  const [updateStatus]                            = useUpdateProposalStatusMutation();
  const [deleteProposal, { isLoading: isDeleting }] = useDeleteProposalMutation();
  const [createProposal, { isLoading: isCreating }] = useCreateProposalMutation();

  const proposals  = data?.data ?? [];
  const analytics  = analyticsData?.data ?? {};
  const allLeads   = leadsData?.data ?? [];
  const allUsers   = usersData?.data?.allUsers ?? [];

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProposal({
        lead:         form.lead,
        client:       form.client,
        createdBy:    user?._id,
        organization: (user as any)?.organization,
        utilityBill:  Number(form.utilityBill),
        roofType:     form.roofType,
        taxCreditIncluded: form.taxCreditIncluded,
        financingOption:   form.financingOption,
        notes:        form.notes,
        savingsProjection: {
          totalCost:     Number(form.totalCost),
          monthlySavings: Number(form.monthlySavings),
          yearlySavings:  Number(form.yearlySavings),
          paybackPeriod:  Number(form.paybackPeriod),
        },
        systemDesign: {
          systemSize:      Number(form.systemSize),
          panelCount:      Number(form.panelCount),
          inverterType:    form.inverterType,
          batteryIncluded: form.batteryIncluded,
        },
      }).unwrap();
      toast.success("Proposal created");
      setShowModal(false);
      setForm(emptyForm);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create proposal");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Failed to load proposals.
    </div>
  );

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
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Proposal
          </button>
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

                    <td className="px-5 py-3.5 text-slate-400 text-xs">{index + 1}</td>

                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {proposal.proposalNumber}
                    </td>

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

                    <td className="px-5 py-3.5 text-slate-500">
                      {proposal.lead?.name ?? "—"}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">
                      ${proposal.utilityBill?.toLocaleString()}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      ${proposal.savingsProjection?.totalCost?.toLocaleString()}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-5 py-3.5 relative">
                      <button
                        onClick={() => setStatusDropdown(statusDropdown === proposal._id ? null : proposal._id)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${statusColor[proposal.status] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {proposal.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
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

      {/* Create proposal modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-2xl mx-4 shadow-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">Add Proposal</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">

              {/* Lead + Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Lead</label>
                  <select required value={form.lead}
                    onChange={(e) => setForm({ ...form, lead: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select lead...</option>
                    {allLeads.map((l: any) => (
                      <option key={l._id} value={l._id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Client</label>
                  <select required value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select client...</option>
                    {allUsers.map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name} — {u.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Utility bill + Roof type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Utility Bill ($)</label>
                  <input type="number" required value={form.utilityBill}
                    onChange={(e) => setForm({ ...form, utilityBill: e.target.value })}
                    placeholder="0"
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Roof Type</label>
                  <input type="text" value={form.roofType}
                    onChange={(e) => setForm({ ...form, roofType: e.target.value })}
                    placeholder="Asphalt, Metal..."
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Savings projection */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Savings Projection</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Total Cost ($)</label>
                    <input type="number" required value={form.totalCost}
                      onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Monthly ($)</label>
                    <input type="number" required value={form.monthlySavings}
                      onChange={(e) => setForm({ ...form, monthlySavings: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Yearly ($)</label>
                    <input type="number" required value={form.yearlySavings}
                      onChange={(e) => setForm({ ...form, yearlySavings: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Payback (yrs)</label>
                    <input type="number" required value={form.paybackPeriod}
                      onChange={(e) => setForm({ ...form, paybackPeriod: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* System design */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">System Design</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Size (kW)</label>
                    <input type="number" required value={form.systemSize}
                      onChange={(e) => setForm({ ...form, systemSize: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Panels</label>
                    <input type="number" required value={form.panelCount}
                      onChange={(e) => setForm({ ...form, panelCount: e.target.value })}
                      placeholder="0"
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Inverter Type</label>
                    <input type="text" required value={form.inverterType}
                      onChange={(e) => setForm({ ...form, inverterType: e.target.value })}
                      placeholder="String, Micro..."
                      className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 h-9 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.batteryIncluded}
                        onChange={(e) => setForm({ ...form, batteryIncluded: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600"
                      />
                      <span className="text-xs text-slate-500">Battery included</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Financing + Tax credit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Financing Option</label>
                  <input type="text" value={form.financingOption}
                    onChange={(e) => setForm({ ...form, financingOption: e.target.value })}
                    placeholder="Cash, Loan, Lease..."
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 h-9 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.taxCreditIncluded}
                      onChange={(e) => setForm({ ...form, taxCreditIncluded: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                    <span className="text-xs text-slate-500">Tax credit included</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Notes</label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isCreating}
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm mx-4 shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete Proposal?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)}
                className="flex-1 h-9 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={isDeleting}
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
        <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(null)} />
      )}

    </div>
  );
}