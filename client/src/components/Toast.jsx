import React, { useEffect } from "react";

export default function Toast({
  message,
  onClose,
  duration = 3500,
}) {
  useEffect(() => {
    if (!message) return;

    const t = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          minWidth: 260,
          maxWidth: 420,
          padding: "14px 16px",
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(20,20,20,0.92), rgba(40,40,40,0.92))",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          color: "#fff",
          fontSize: 14,
          lineHeight: 1.4,
          animation: "toast-slide-in 260ms ease-out",
          pointerEvents: "auto",
        }}
        role="status"
        aria-live="polite"
      >
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ fontSize: 18, lineHeight: 1 }}>🔔</div>

          <div style={{ flex: 1 }}>{message}</div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes toast-slide-in {
            from {
              transform: translateY(12px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
