/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {useGetAllTrainingQuery,useDeleteTrainingMutation,useTogglePublishTrainingMutation,
  useCreateTrainingMutation,
} from "../../redux/features/training/trainingApi";
import { BookOpen, Loader2, Search, Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import TrainingStats from "../../components/training/TrainingStats";
import TrainingTable from "../../components/training/TrainingTable";

const roleOptions = ["ADMIN", "LEADER", "SETTER", "CLOSER", "INSTALLER", "CLIENT"];

export default function Training() {
  const { user } = useAuth();
  const [search, setSearch]       = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", role: "SETTER",
    videoUrl: "", duration: "", xpReward: "",
  });

  const { data, isLoading, isError }  = useGetAllTrainingQuery(undefined);
  const [deleteTraining, { isLoading: isDeleting }] = useDeleteTrainingMutation();
  const [togglePublish] = useTogglePublishTrainingMutation();
  const [createTraining, { isLoading: isCreating }] = useCreateTrainingMutation();

  const trainings = data?.data ?? [];

  const filtered = trainings.filter((t: any) =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTraining(id).unwrap();
      toast.success("Training deleted");
      setConfirmId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await togglePublish(id).unwrap();
      toast.success("Publish status updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTraining({
        ...form,
        duration: Number(form.duration),
        xpReward: Number(form.xpReward),
        organization: (user as any)?.organization,
        createdBy: user?._id,
      }).unwrap();
      toast.success("Training created");
      setShowModal(false);
      setForm({ title: "", description: "", role: "SETTER", videoUrl: "", duration: "", xpReward: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
      Failed to load trainings.
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <h1 className="text-lg font-semibold text-slate-800">Training</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {trainings.length} total
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search training..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Training
          </button>
        </div>
      </div>

      {/* Stats component */}
      <TrainingStats trainings={trainings} />

      {/* Table component */}
      <TrainingTable
        trainings={filtered}
        onDelete={(id) => setConfirmId(id)}
        onTogglePublish={handleTogglePublish}
      />

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">Add Training Module</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Title</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Training title"
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description" rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Video URL</label>
                <input type="url" required value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Duration (min)</label>
                  <input type="number" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="30"
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">XP Reward</label>
                  <input type="number" value={form.xpReward}
                    onChange={(e) => setForm({ ...form, xpReward: e.target.value })}
                    placeholder="100"
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
            <h3 className="text-base font-semibold text-slate-800 text-center">Delete Training?</h3>
            <p className="text-sm text-slate-500 text-center mt-1.5 mb-5">This action cannot be undone.</p>
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

    </div>
  );
}