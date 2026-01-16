import React, { useEffect } from "react";

export default function Modal({ title, subtitle = "Fill details and save.", children, onClose }) {
  // Close on ESC + lock body scroll
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl glass"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 18px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.2 }}>
              {title}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
              {subtitle}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn secondary"
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              lineHeight: 1,
              minWidth: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px" }}>{children}</div>
      </div>
    </div>
  );
}


function Field({ label, value, onChange, type = "text", step, min, max, placeholder, autoFocus }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/70">{label}</span>
      <input
        className="input"
        placeholder={placeholder}
        type={type}
        step={step}
        min={min}
        max={max}
        value={value ?? ""}           // ✅ always controlled (prevents remount)
        onChange={onChange}
        autoFocus={autoFocus}
      />
    </label>
  );
}
