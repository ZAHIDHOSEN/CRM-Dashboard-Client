/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import toast from "react-hot-toast";
import { 
  useGetAllLeadsQuery, 
  useCreateLeadMutation, 
  useUpdateLeadMutation, 
  useDeleteLeadMutation 
} from "../../redux/features/leads/leadsApi";
import { useAuth } from "../../context/AuthContext";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Target, 
  MapPin, 
  User, 
  TrendingUp, 
  Briefcase 
} from "lucide-react";

export default function LeadsPage() {
  const { user } = useAuth();
  const { data: leadsResponse, isLoading } = useGetAllLeadsQuery(undefined);
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();

  // Component Modals UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);

  // Authorization Check Helpers
  const isAdminOrLeader = user?.role === "ADMIN" || user?.role === "LEADER";

  // Form Submit Handler (Dual Create or Update routing)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      stage: formData.get("stage") as string,
      roi_calculation: {
        bill: Number(formData.get("bill")),
        system_size: Number(formData.get("system_size")),
        savings: Number(formData.get("savings")),
      }
    };

    try {
      if (editingLead) {
        await updateLead({ id: editingLead._id, data: payload }).unwrap();
        toast.success("Lead metadata updated successfully");
      } else {
        await createLead(payload).unwrap();
        toast.success("New structural lead deployed successfully");
      }
      closeAndResetModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation processing failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you entirely sure you want to permanently delete this lead entry?")) {
      try {
        await deleteLead(id).unwrap();
        toast.success("Lead item successfully expunged");
      } catch (err: any) {
        toast.error(err?.data?.message || "Deletion sequence failed");
      }
    }
  };

  const openEditModal = (lead: any) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const leads = leadsResponse?.data || [];

  // Stage Badge Dynamic UI Color Assigner
  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "NEW": return "bg-blue-50 text-blue-700 border-blue-200";
      case "APPOINTMENT": return "bg-purple-50 text-purple-700 border-purple-200";
      case "PROPOSAL": return "bg-amber-50 text-amber-700 border-amber-200";
      case "CLOSED": return "bg-green-50 text-green-700 border-green-200";
      case "INSTALLED": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-\[400px\] gap-2 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Fetching active system leads data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper Navigation / Action Header Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leads Registry</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track, schedule, and assign organizational pipeline leads.</p>
        </div>
        
        {isAdminOrLeader && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        )}
      </div>

      {/* Mini Performance Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Monitored Leads", val: leads.length, ico: Target, color: "text-blue-600 bg-blue-50" },
          { label: "New Entries", val: leads.filter((l: any) => l.stage === "NEW").length, ico: TrendingUp, color: "text-purple-600 bg-purple-50" },
          { label: "Proposals Generated", val: leads.filter((l: any) => l.stage === "PROPOSAL").length, ico: Briefcase, color: "text-amber-600 bg-amber-50" },
          { label: "Closed Conversions", val: leads.filter((l: any) => l.stage === "CLOSED" || l.stage === "INSTALLED").length, ico: User, color: "text-green-600 bg-green-50" },
        ].map((c, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{c.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
              <c.ico className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Informational Responsive Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Target className="w-12 h-12 mx-auto text-slate-300 stroke-1 mb-3" />
            <p className="text-sm font-medium">No lead entries registered found in database record storage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Client Representative Name</th>
                  <th className="px-6 py-4">Physical Destination Address</th>
                  <th className="px-6 py-4">Pipeline Execution Stage</th>
                  <th className="px-6 py-4">ROI Metric Configurations</th>
                  <th className="px-6 py-4 text-right">Actions Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {leads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5 max-w-xs truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {lead.address || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStageBadgeClass(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-0.5 text-slate-500">
                      <div><span className="font-medium text-slate-700">Monthly Bill:</span> ${lead.roi_calculation?.bill || 0}</div>
                      <div><span className="font-medium text-slate-700">System Capacity:</span> {lead.roi_calculation?.system_size || 0} kW</div>
                      <div><span className="font-medium text-slate-700">Savings Target:</span> ${lead.roi_calculation?.savings || 0}/yr</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                          title="Modify Entry Information"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                          title="Purge Lead Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Control Creation & Modification Portal (Modal Dialog UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg max-w-lg w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 text-base">
                {editingLead ? "Edit System Lead Details" : "Register Fresh Commercial Lead"}
              </h3>
              <button 
                onClick={closeAndResetModal} 
                className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Client Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingLead?.name || ""}
                    placeholder="E.g., Johnathan Smith"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Destination Deployment Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    defaultValue={editingLead?.address || ""}
                    placeholder="Street name, City, Postcode location code"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Workflow Execution Stage Status</label>
                  <select
                    name="stage"
                    defaultValue={editingLead?.stage || "NEW"}
                    className="w-full h-10 px-3 border border-slate-200 bg-white rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="NEW">NEW</option>
                    <option value="APPOINTMENT">APPOINTMENT</option>
                    <option value="PROPOSAL">PROPOSAL</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="INSTALLED">INSTALLED</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">ROI Analysis Metric Configurations</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Utility Bill ($)</label>
                      <input
                        type="number"
                        name="bill"
                        defaultValue={editingLead?.roi_calculation?.bill || ""}
                        placeholder="120"
                        className="w-full h-9 px-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Size (kW)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="system_size"
                        defaultValue={editingLead?.roi_calculation?.system_size || ""}
                        placeholder="6.5"
                        className="w-full h-9 px-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Savings ($/yr)</label>
                      <input
                        type="number"
                        name="savings"
                        defaultValue={editingLead?.roi_calculation?.savings || ""}
                        placeholder="1400"
                        className="w-full h-9 px-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  className="h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingLead ? "Save Changes" : "Deploy Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}