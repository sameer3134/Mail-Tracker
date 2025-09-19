"use client";

import { useState } from "react";

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchLogs() {
    const key = prompt("Enter admin key");
    if (!key) return;
    setLoading(true);

    const res = await fetch(`/api/logs?perPage=100`, {
      headers: { "x-admin-key": key },
    });

    if (!res.ok) {
      alert("Unauthorized or error");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setLogs(data.results);
    setLoading(false);
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-xl font-bold mb-4">📊 Email Open Logs</h1>
      <button
        onClick={fetchLogs}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Loading..." : "Fetch Logs"}
      </button>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Opened At</th>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Recipient</th>
            <th className="p-2 text-left">IP</th>
            <th className="p-2 text-left">User Agent</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id} className="border-t">
              <td className="p-2">{new Date(l.openedAt).toLocaleString()}</td>
              <td className="p-2">{l.id}</td>
              <td className="p-2">{l.recipient}</td>
              <td className="p-2">{l.ip}</td>
              <td className="p-2 max-w-xs truncate">{l.userAgent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
