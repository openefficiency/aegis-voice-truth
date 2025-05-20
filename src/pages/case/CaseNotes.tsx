
import React, { useState } from "react";

export default function CaseNotes({ notes, onAddNote }) {
  const [noteText, setNoteText] = useState("");
  return (
    <div className="bg-gray-50 border rounded p-4 mt-2">
      <h3 className="text-lg font-semibold mb-2">Investigation Notes</h3>
      <div className="mb-2">
        {notes ? <div className="text-gray-800 whitespace-pre-wrap">{notes}</div> : (
          <span className="text-gray-400">No notes yet.</span>
        )}
      </div>
      <div className="flex items-start gap-2">
        <textarea
          className="border p-2 rounded w-full"
          rows={2}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Add note..."
        />
        <button
          className="bg-blue-500 text-white rounded px-3 py-1"
          onClick={() => { onAddNote(noteText); setNoteText(""); }}
          disabled={!noteText.trim()}
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
