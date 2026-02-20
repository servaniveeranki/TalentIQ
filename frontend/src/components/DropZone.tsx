"use client";

import { useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: Accept;
}

const DEFAULT_ACCEPT: Accept = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

export default function DropZone({ onFiles, multiple = false, label = "Upload Resume", accept }: DropZoneProps) {
  const [dropped, setDropped] = useState<string[]>([]);

  const onDrop = useCallback((files: File[]) => {
    setDropped(files.map(f => f.name));
    onFiles(files);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple, accept: accept ?? DEFAULT_ACCEPT,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `1px dashed ${isDragActive ? "var(--accent)" : "var(--border-md)"}`,
        background: isDragActive ? "var(--accent-dim)" : "var(--bg3)",
        borderRadius: "8px",
        padding: "20px 16px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
        outline: "none",
      }}
    >
      <input {...getInputProps()} />
      <div style={{ fontSize: "20px", marginBottom: "6px", lineHeight: 1, color: isDragActive ? "var(--accent)" : "var(--text-3)" }}>
        {isDragActive ? "↓" : "↑"}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
        {label}
      </div>
      {dropped.length > 0 ? (
        <div style={{ fontSize: "11px", color: "var(--accent)", fontFamily: "'Geist Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {dropped.join(", ")}
        </div>
      ) : (
        <div style={{ fontSize: "11px", color: "var(--text-3)" }}>
          pdf · docx · txt — max 5MB
        </div>
      )}
    </div>
  );
}