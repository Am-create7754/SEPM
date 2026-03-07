import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [settings, setSettings] = useState({
    defaultOvers: 20,
    winPoints: 2,
    autoFixture: false,
    allowSelfRegistration: false,
  });

  const token = localStorage.getItem("token");

  /* ============================= */
  /*   Protect Route (Admin Only)  */
  /* ============================= */
  // useEffect(() => {
  //   if (!token || role !== "admin") {
  //     navigate("/login");
  //   }
  // }, [token, role, navigate]);

  /* ============================= */
  /*      Fetch Existing Data      */
  /* ============================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const settingsRes = await axios.get("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(profileRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  /* ============================= */
  /*        Handle Updates         */
  /* ============================= */

  const updateProfile = async () => {
    try {
      await axios.put("/api/admin/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile Updated Successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const updateSettings = async () => {
    try {
      await axios.put("/api/admin/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Settings Updated Successfully");
    } catch (err) {
      alert("Failed to update settings");
    }
  };

  const deleteAllTournaments = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will delete ALL tournaments permanently!"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete("/api/admin/delete-all-tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("All tournaments deleted");
    } catch (err) {
      alert("Failed to delete tournaments");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-20 py-10">
          <div className="flex items-center justify-between mb-10">
  <h1 className="text-2xl font-semibold">
    Admin Settings
  </h1>

  <button
    onClick={() => navigate("/admin")}
    className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 transition rounded-lg text-sm font-medium"
  >
    ← Back
  </button>
</div>

          {/* ================= Profile Settings ================= */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>

            <div className="bg-[#0a2a1f] p-6 rounded-xl border border-emerald-500/20 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full p-2 bg-black border border-emerald-500/30 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-2 bg-black border border-emerald-500/30 rounded"
              />

              <button
                onClick={updateProfile}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
              >
                Update Profile
              </button>
            </div>
          </section>

          {/* ================= Tournament Settings ================= */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              Tournament Default Settings
            </h2>

            <div className="bg-[#0a2a1f] p-6 rounded-xl border border-emerald-500/20 space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  Default Overs
                </label>
                <input
                  type="number"
                  value={settings.defaultOvers}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultOvers: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-black border border-emerald-500/30 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Points for Win
                </label>
                <input
                  type="number"
                  value={settings.winPoints}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      winPoints: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-black border border-emerald-500/30 rounded"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.autoFixture}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoFixture: e.target.checked,
                    })
                  }
                />
                <span>Auto Generate Fixtures</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowSelfRegistration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowSelfRegistration: e.target.checked,
                    })
                  }
                />
                <span>Allow Player Self Registration</span>
              </div>

              <button
                onClick={updateSettings}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded"
              >
                Save Settings
              </button>
            </div>
          </section>

          {/* ================= Danger Zone ================= */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-red-400">
              Danger Zone
            </h2>

            <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/40">
              <p className="text-sm mb-4">
                This action is irreversible. All tournaments will be deleted permanently.
              </p>

              <button
                onClick={deleteAllTournaments}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Delete All Tournaments
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
