import { useState } from "react";

const players = ["JEJEN", "OLA", "JUMIO"];

const defaultQuests = [
  { title: "Update Harga TikTok", type: "Daily", pic: "JEJEN" },
  { title: "Update Harga Shopee", type: "Daily", pic: "OLA" },
  { title: "Update Stok Karantina", type: "Daily", pic: "JUMIO" },
  { title: "Cek Pelanggaran", type: "Daily", pic: "ALL" },
  { title: "Send PID Affiliate", type: "Relationship", pic: "ALL" },
  { title: "Cek Badge", type: "Weekly", pic: "ALL" },
  { title: "Cek Rating", type: "Weekly", pic: "ALL" },
  { title: "Cek Violation", type: "Weekly", pic: "ALL" },
];

export default function App() {
  const [quests, setQuests] = useState(
    defaultQuests.map((q, i) => ({ ...q, id: i, done: false }))
  );

  const toggleQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, done: !q.done } : q
      )
    );
  };

  const total = quests.length;
  const done = quests.filter((q) => q.done).length;
  const percent = Math.round((done / total) * 100);

  return (
    <div style={{ padding: 20, background: "#0f172a", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 32 }}>🎮 BTS Quest Arena</h1>

      <div style={{ marginTop: 20 }}>
        <h3>Progress: {percent}%</h3>
        <div style={{ background: "#1e293b", height: 20, borderRadius: 10 }}>
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: "#22c55e",
              borderRadius: 10,
            }}
          />
        </div>
      </div>

      <h2 style={{ marginTop: 30 }}>📋 Quest List</h2>

      {quests.map((q) => (
        <div
          key={q.id}
          style={{
            background: "#1e293b",
            padding: 15,
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <b>{q.title}</b> ({q.type}) - {q.pic}
          <br />
          <button
            onClick={() => toggleQuest(q.id)}
            style={{
              marginTop: 10,
              padding: "5px 10px",
              background: q.done ? "#ef4444" : "#22c55e",
              border: "none",
              color: "white",
              borderRadius: 6,
            }}
          >
            {q.done ? "Undo" : "Complete"}
          </button>
        </div>
      ))}
    </div>
  );
}