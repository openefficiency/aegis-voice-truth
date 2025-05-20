
import React, { useState } from "react";

export default function CaseEvidenceUploader({ onUpload }) {
  const [val, setVal] = useState("");
  return (
    <div className="bg-gray-50 border rounded p-4 mt-2">
      <h3 className="text-lg font-semibold mb-2">Evidence Upload</h3>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded p-1 flex-grow"
          placeholder="Paste link to evidence (demo)"
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded px-3 py-1"
          onClick={() => { onUpload(val); setVal(""); }}
          disabled={!val.trim()}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
