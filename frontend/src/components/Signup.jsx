import { use, useState } from "react";

export default function SignupPage({ setIsSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      console.log("Signup -> API:", API);

      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      // Inspect status & content-type for debugging
      console.log("signup status:", res.status);
      console.log("content-type:", res.headers.get("content-type"));

      // Safely read response body (prevents 'Unexpected end of JSON input')
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", parseErr, "raw:", text);
        data = { message: "Invalid JSON from server", raw: text };
      }

      if (res.ok) {
        // success (201 or 200)
        console.log("signup success:", data);
        window.location.href = "/dashboard";
        return;
      }

      // non-OK HTTP status
      alert(data?.message || `Signup failed (status ${res.status})`);
    } catch (err) {
      console.error("Network/login error:", err);
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-3 py-2 border rounded"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>
        <hr className="my-4" />
        <p className="text-center mb-2">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsSignup(false)}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
