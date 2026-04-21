import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { User, Sliders, AlertTriangle, Save, ArrowLeft } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();

  // 🔥 Ye line delete ho gayi thi galti se, ab wapas aa gayi hai
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    name: "",
    role: "batsman", // 🔥 Updated to role
  });

  const [settings, setSettings] = useState({
    defaultOvers: 20,
    winPoints: 2,
    autoFixture: false,
    allowSelfRegistration: false,
  });

  const token = localStorage.getItem("token");

  /* ============================= */
  /* Fetch Existing Data           */
  /* ============================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("http://localhost:5001/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const settingsRes = await axios.get("http://localhost:5001/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.data) setProfile(profileRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* ============================= */
  /* Handle Updates                */
  /* ============================= */

  const updateProfile = async () => {
    try {
      await axios.put("http://localhost:5001/api/admin/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile Updated Successfully ✅");
    } catch (err) {
      alert("Failed to update profile ❌");
    }
  };

  const updateSettings = async () => {
    try {
      await axios.put("http://localhost:5001/api/admin/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Settings Updated Successfully ✅");
    } catch (err) {
      alert("Failed to update settings ❌");
    }
  };

  const deleteAllTournaments = async () => {
    const confirmDelete = window.confirm(
      "⚠️ DANGER: Are you sure? This will delete ALL tournaments permanently!"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:5001/api/admin/delete-all-tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("All tournaments deleted successfully.");
    } catch (err) {
      alert("Failed to delete tournaments.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010806] flex items-center justify-center text-emerald-400 font-medium text-lg animate-pulse">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010806] text-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-10 overflow-y-auto custom-scrollbar">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold text-emerald-50">Admin Settings</h1>
              <p className="text-sm text-slate-400 mt-1">Manage your profile and system configurations</p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a2a1f] border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 transition-all rounded-xl text-sm font-bold"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* ================= Profile Settings ================= */}
              <section className="bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-8 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <User size={20} className="text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-50">Quick Profile Update</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Display Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Player Role</label>
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-medium appearance-none"
                    >
                      <option value="batsman">Batsman</option>
                      <option value="bowler">Bowler</option>
                      <option value="allrounder">All-Rounder</option>
                    </select>
                  </div>

                  <button
                    onClick={updateProfile}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-extrabold tracking-wide rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-2"
                  >
                    <Save size={18} /> UPDATE DETAILS
                  </button>
                </div>
              </section>

              {/* ================= Danger Zone ================= */}
              <section className="bg-red-500/5 p-8 rounded-2xl border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
                </div>

                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  This action is irreversible. All tournaments, teams, and match records will be deleted permanently from the database.
                </p>

                <button
                  onClick={deleteAllTournaments}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 font-bold tracking-wide rounded-xl transition-all"
                >
                  <AlertTriangle size={18} /> DELETE ALL TOURNAMENTS
                </button>
              </section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              
              {/* ================= Tournament Settings ================= */}
              <section className="bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-8 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Sliders size={20} className="text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-50">Global Match Defaults</h2>
                </div>

                <div className="space-y-6">
                  
                  {/* Numbers Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Default Overs</label>
                      <input
                        type="number"
                        value={settings.defaultOvers}
                        onChange={(e) => setSettings({ ...settings, defaultOvers: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all font-medium text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Points for Win</label>
                      <input
                        type="number"
                        value={settings.winPoints}
                        onChange={(e) => setSettings({ ...settings, winPoints: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all font-medium text-center"
                      />
                    </div>
                  </div>

                  <div className="w-full h-px bg-emerald-500/10 my-4"></div>

                  {/* Toggle Switches */}
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer p-4 bg-[#010806] border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all">
                      <div>
                        <p className="text-sm font-bold text-emerald-50">Auto Generate Fixtures</p>
                        <p className="text-[11px] text-slate-400 mt-1">Automatically schedule matches based on teams</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.autoFixture}
                          onChange={(e) => setSettings({ ...settings, autoFixture: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-4 bg-[#010806] border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all">
                      <div>
                        <p className="text-sm font-bold text-emerald-50">Allow Self Registration</p>
                        <p className="text-[11px] text-slate-400 mt-1">Players can request to join teams themselves</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.allowSelfRegistration}
                          onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={updateSettings}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-extrabold tracking-wide rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-6"
                  >
                    <Save size={18} /> SAVE CONFIGURATIONS
                  </button>

                </div>
              </section>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}