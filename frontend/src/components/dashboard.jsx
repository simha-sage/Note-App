import { useEffect, useState } from "react";

const AddNote = ({ setData, currentMain }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("personal");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject,
          content,
          visibility,
          type: currentMain.toLowerCase(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      setSubject("");
      setContent("");
      setVisibility("PRIVATE");
      alert("Note added successfully");
      const newNote = await res.json();
      setData((prevData) => [newNote, ...prevData]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-amber-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-amber-100 rounded-xl shadow-lg p-6"
      >
        <h1 className="text-2xl font-semibold mb-6 text-amber-900">
          Add New Note
        </h1>

        {/* Subject */}
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* Content */}
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="6"
          className="w-full mb-4 p-3 rounded bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* Visibility */}
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-white border border-amber-300 focus:outline-none"
        >
          <option value="PRIVATE">Private</option>
          <option value="ADMIN_ONLY">Visible to Admin</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-white border border-amber-300 focus:outline-none"
        >
          <option value="personal">Personal</option>
          <option value="permissions">Permissions</option>
          <option value="reports">Reports</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded transition"
        >
          {loading ? "Submitting..." : "Submit Note"}
        </button>
      </form>
    </div>
  );
};

const Secondary = ({ currentMain, data, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const newData = data.filter((item) => {
    const matchesType = item.type === currentMain.toLowerCase();

    const matchesSearch =
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });
  useEffect(() => {
    setSelectedNote(newData[0] || null);
  }, [currentMain, data, searchTerm]);

  return (
    <div className="flex h-screen">
      <div className="w-4/12 bg-green-600 p-6 shadow flex flex-col">
        <h1 className="text-2xl font-bold mb-4"> {currentMain}</h1>
        <div className="flex flex-col gap-3 p-4 bg-amber-200 rounded-lg">
          <input
            type="text"
            className="bg-amber-100 p-2 rounded"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <input
            type="button"
            value="+ADD NOTE"
            className="bg-amber-300 p-2 rounded"
            onClick={() => setSelectedNote(null)}
          />
        </div>
        {/* list of notes */}
        <div className="flex-1 overflow-y-auto mt-4 bg-amber-100 rounded-xl shadow-lg p-4">
          {data.length === 0 && (
            <p className="text-amber-700 text-center">No notes available</p>
          )}

          {newData.map((item) => (
            <div
              key={item._id || item.id}
              onClick={() => setSelectedNote(item)}
              className={`cursor-pointer p-3 mb-2 rounded border transition truncate
  ${
    selectedNote?._id === item._id
      ? "bg-amber-200 border-amber-400"
      : "bg-white border-amber-300 hover:bg-amber-50"
  }`}
            >
              {item.subject || "Untitled Note"}
            </div>
          ))}
        </div>
      </div>

      <div className="w-8/12">
        {selectedNote ? (
          <div className="h-full bg-amber-200 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-amber-100 rounded-2xl shadow-xl p-8">
              {/* Subject */}
              <h1 className="text-3xl font-bold text-amber-900 mb-6 break-words sticky top-0 bg-amber-100 py-2">
                {selectedNote.subject || "Untitled Note"}
              </h1>

              {/* Divider */}
              <hr className="border-amber-300 mb-6" />

              {/* Content */}
              <p className="text-lg text-amber-800 leading-relaxed whitespace-pre-wrap break-words">
                {selectedNote.content || "No content available."}
              </p>
            </div>
          </div>
        ) : (
          <AddNote setData={setData} currentMain={currentMain} />
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState([
    { id: 1, text: "Sample note" },
    { id: 2, text: "Another note" },
  ]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [currentMain, setCurrentMain] = useState("Personal");

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/getNotes`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch notes");
        const notes = await res.json();
        setData(notes);
      } catch (err) {
        console.error(err);
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
    <div className="flex relative min-h-screen">
      <div className="w-2.5/12 min-h-screen bg-green-300 p-6  shadow ">
        <div className="flex flex-col  justify-between mb-4">
          <div className="flex justify-spacebetween items-center  mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full ">
              <h1 className="text-center text-[24px] font-bold text-white mt-1">
                {user.name.charAt(0).toUpperCase()}
              </h1>
            </div>
            <h1 className="text-xl m-4 font-semibold">
              {user.name.toUpperCase()} ({user.role})
            </h1>
          </div>

          <div>
            <nav className="flex-1 mt-4">
              {[
                {
                  name: "Personal ",
                  action: () => setCurrentMain("Personal"),
                },
                {
                  name: "Admin Orders",
                  action: () => setCurrentMain("AdminOrders"),
                },
                {
                  name: "Reports",
                  action: () => setCurrentMain("Reports"),
                },
                {
                  name: "Permissions",
                  action: () => setCurrentMain("Permissions"),
                },
              ].map((item, index) => (
                <p
                  key={index}
                  className="ml-6 mr-4 my-2 py-2 px-3 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-500 hover:text-amber-300"
                  onClick={item.action}
                >
                  {item.name}
                </p>
              ))}
            </nav>
          </div>

          <div className="flex-col justify-between items-center mb-4 absolute bottom-6">
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>

            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        </div>
      </div>
      <div className="w-10/12 min-h-screen">
        <Secondary currentMain={currentMain} data={data} setData={setData} />
      </div>
    </div>
  );
}
