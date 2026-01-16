import React from "react";

export default function Toast({ message, onClose }){
  if (!message) return null;
  return (
    <div style={{
      position:"fixed", right:16, bottom:16, maxWidth:420,
      background:"rgba(0,0,0,0.75)", border:"1px solid rgba(255,255,255,0.12)",
      padding:"10px 12px", borderRadius: 12, backdropFilter:"blur(8px)"
    }}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10}}>
        <div>{message}</div>
        <button className="btn secondary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
