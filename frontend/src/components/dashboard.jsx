import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          window.location.href = "/";
          return;
        }
        const data = await res.json();
        setUser(data);
        console.log("User data:", data);
      } catch (err) {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/";
  }

  if (loading) return <div className="text-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Welcome, {user.name} ({user.role})
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600">Email: {user.email}</p>
    </div>
  );
}
