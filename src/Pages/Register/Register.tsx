/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Eye, EyeOff, ArrowRight, Mail, Lock, Loader2, Building2 } from "lucide-react"; 
import { Link, useNavigate } from "react-router"; 
import { useCreateUserMutation } from "../../redux/features/users/userApi";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [registerUser, { isLoading, error }] = useCreateUserMutation()
  const navigate = useNavigate();



  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch("https://crm-dashboard-server.vercel.app/api/v1/organization");
        if (!res.ok) throw new Error('Failed to fetch orgs');
        const data = await res.json();
        setOrganizations(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Could not load organizations list.");
      }
    };
    fetchOrganizations();
  }, []);





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const payload = Object.fromEntries(formData.entries());

    try {
      await registerUser(payload).unwrap();
      toast.success("Registration successful!");
      navigate("/login"); // Redirect after success
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Same outer container style as Login */}
      <div className="flex w-full max-w-3xl rounded-xl overflow-hidden border border-slate-200 shadow-sm">

        {/* Left panel - Identical to Login */}
        <div className="hidden md:flex w-56 bg-blue-800 flex-col justify-between p-7 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">S</span>
              </div>
              <span className="text-white font-medium text-sm">SolarCRM</span>
            </div>
            <p className="text-blue-300 text-xs leading-relaxed">
              Manage leads, teams, proposals and payroll — all in one place.
            </p>
          </div>

          <div>
            <div className="border-t border-blue-700 pt-5 flex justify-between">
              {[["480+", "Active leads"], ["12", "Teams"], ["94%", "Close rate"]].map(([num, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-white font-medium text-lg">{num}</p>
                  <p className="text-blue-300 text-[11px] mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-700" />
            </div>
          </div>
        </div>

        {/* Right panel - Applying Login form layout to Register inputs */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-slate-800">Create account</h2>
            <p className="text-slate-500 text-sm mt-1">Get started with your SolarCRM account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Input (with show/hide) */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-9 pr-10 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Organization Select Input (Styled like login input) */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Organization
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="organization"
                  required
                  className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white" // appearance-none removes default arrow
                >
                  <option value="" disabled selected>Select Organization</option>
                  {organizations.map((org: any) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                 {/* Optional: Add a custom dropdown arrow icon here if appearance-none is used */}
              </div>
            </div>

            {/* Error Message (Integrated from Login style) */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <span className="text-red-500 text-xs">
                  {(error as any)?.data?.message || "Registration failed. Please try again."}
                </span>
              </div>
            )}

            {/* Submit Button (Integrated from Login style) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <><span>Register</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Link back to login */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-medium hover:underline">
              Sign in here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}