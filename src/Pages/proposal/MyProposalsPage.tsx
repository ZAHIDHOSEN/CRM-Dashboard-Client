/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuth } from "../../context/AuthContext";
import { FileText, Loader2 } from "lucide-react";
import { useGetAllProposalsQuery } from "../../redux/features/proposals/proposalApi";

const statusColor: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  sent:     "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyProposalsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetAllProposalsQuery(undefined);

  // filter only this client's proposals
  const allProposals = data?.data ?? [];
  const myProposals  = allProposals.filter(
    (p: any) => p.client?._id === user?._id || p.client === user?._id
  );

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
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-600" />
        <h1 className="text-lg font-semibold text-slate-800">My Proposals</h1>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          {myProposals.length} total
        </span>
      </div>

      {/* Empty state */}
      {myProposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No proposals yet</p>
          <p className="text-slate-400 text-xs mt-1">Your proposals will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myProposals.map((proposal: any) => (
            <div
              key={proposal._id}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Proposal Number</p>
                  <p className="font-semibold text-slate-800">{proposal.proposalNumber}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColor[proposal.status]}`}>
                  {proposal.status}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Utility Bill</p>
                  <p className="text-sm font-medium text-slate-700">
                    ${proposal.utilityBill?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Total Cost</p>
                  <p className="text-sm font-medium text-slate-700">
                    ${proposal.savingsProjection?.totalCost?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Monthly Savings</p>
                  <p className="text-sm font-medium text-green-600">
                    ${proposal.savingsProjection?.monthlySavings?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Yearly Savings</p>
                  <p className="text-sm font-medium text-green-600">
                    ${proposal.savingsProjection?.yearlySavings?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">System Size</p>
                  <p className="text-sm font-medium text-slate-700">
                    {proposal.systemDesign?.systemSize} kW
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Panel Count</p>
                  <p className="text-sm font-medium text-slate-700">
                    {proposal.systemDesign?.panelCount} panels
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Payback Period</p>
                  <p className="text-sm font-medium text-slate-700">
                    {proposal.savingsProjection?.paybackPeriod} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Tax Credit</p>
                  <p className="text-sm font-medium text-slate-700">
                    {proposal.taxCreditIncluded ? "Included" : "Not included"}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {proposal.notes && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 mb-0.5">Notes</p>
                  <p className="text-sm text-slate-600">{proposal.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Created by <span className="text-slate-600 font-medium">{proposal.createdBy?.name}</span>
                </p>
                <p className="text-xs text-slate-400">
                  {proposal.createdAt
                    ? new Date(proposal.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}