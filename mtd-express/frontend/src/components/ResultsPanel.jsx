// src/components/ResultsPanel.jsx
import { useState } from "react";

const PRI_STYLE = {
  "High":   { bg:"#fee2e2", text:"#b91c1c", dot:"#ef4444" },
  "Medium": { bg:"#fef9c3", text:"#854d0e", dot:"#f59e0b" },
  "Low":    { bg:"#dcfce7", text:"#15803d", dot:"#22c55e" },
};
const STATUS_STYLE = {
  "Not Executed": { bg:"#f3f4f6", text:"#6b7280", border:"#d1d5db" },
  "Pass":         { bg:"#dcfce7", text:"#15803d", border:"#86efac" },
  "Fail":         { bg:"#fee2e2", text:"#b91c1c", border:"#fca5a5" },
  "Blocked":      { bg:"#fef3c7", text:"#92400e", border:"#fde68a" },
  "Skipped":      { bg:"#f3e8ff", text:"#7e22ce", border:"#d8b4fe" },
};
const STATUS_OPTIONS = ["Pass","Fail","Blocked","Skipped","Not Executed"];

const InfoPanel = ({ title, color, bg, border, children }) => (
  <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"13px 16px" }}>
    <div style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{title}</div>
    {children}
  </div>
);
const InfoRow = ({ color, children }) => (
  <div style={{ fontSize:12.5, color:"#374151", paddingLeft:10, borderLeft:`3px solid ${color}`, marginBottom:6, lineHeight:1.5 }}>{children}</div>
);

// ── Single test case card ─────────────────────────────────────────────────────
function TestCaseCard({ tc, index, status, onStatus }) {
  const [open, setOpen] = useState(false);
  const fills = ["#EBF3FB","#F0F4FF","#F5F0FF"];
  const dots  = ["#0078d4","#7c3aed","#06b6d4"];
  const dot   = dots[index % dots.length];
  const fill  = fills[index % fills.length];
  const ss    = STATUS_STYLE[status];

  return (
    <div style={{ background:"#fff", border:`1.5px solid ${open?"#0078d4":"#e5e7eb"}`, borderRadius:10, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", transition:"border-color 0.15s" }}>

      {/* Header */}
      <div onClick={() => setOpen(!open)}
        style={{ padding:"12px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, userSelect:"none", background:open?fill:"#fff" }}>
        <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:dot, flexShrink:0 }} />
        <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", fontFamily:"monospace", minWidth:42 }}>{tc.id}</span>
        <span style={{ fontSize:13, fontWeight:600, color:"#0f172a", flex:1, lineHeight:1.4 }}>{tc.name}</span>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:10, color:"#6b7280" }}>{tc.steps?.length} steps</span>
          <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:ss.bg, color:ss.text, border:`1px solid ${ss.border}` }}>{status}</span>
          <span style={{ color:"#cbd5e1", fontSize:12 }}>{open?"▲":"▼"}</span>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ borderTop:"1px solid #f3f4f6", padding:"0", background:"#fafafa" }}>

          {/* Steps table — matches Excel format exactly */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
              <thead>
                <tr style={{ background:"#1e3a5f" }}>
                  {["Step No","Actual Step","Expected Result"].map((h,i) => (
                    <th key={h} style={{ textAlign:"left", padding:"9px 14px", color:"#fff", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", width:i===0?72:undefined }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(tc.steps || []).map((step, i) => (
                  <tr key={i} style={{ background:i%2===0?"#fff":"#f8fafc", borderBottom:"1px solid #f0f0f0" }}>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:"#0078d4", verticalAlign:"top", width:72 }}>{step.no}</td>
                    <td style={{ padding:"10px 14px", color:"#374151", lineHeight:1.6, verticalAlign:"top" }}>{step.action}</td>
                    <td style={{ padding:"10px 14px", color:"#15803d", lineHeight:1.6, verticalAlign:"top", background:i%2===0?"#f0fdf4":"#e8faf0" }}>{step.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status buttons */}
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", padding:"12px 16px", borderTop:"1px solid #f3f4f6" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#6b7280" }}>MARK AS</span>
            {STATUS_OPTIONS.map((s) => {
              const s2 = STATUS_STYLE[s];
              return (
                <button key={s} onClick={(e) => { e.stopPropagation(); onStatus(s); }}
                  style={{ fontSize:11, padding:"5px 11px", borderRadius:6, border:`1px solid ${status===s?s2.border:"#e5e7eb"}`, background:status===s?s2.bg:"#fff", color:status===s?s2.text:"#6b7280", cursor:"pointer", fontWeight:status===s?700:400 }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function ResultsPanel({ result, isD365 }) {
  const [statusMap, setStatusMap] = useState({});
  const accent   = isD365 ? "#7c3aed" : "#0078d4";
  const cases    = result.testCases || [];
  const markStatus = (id, s) => setStatusMap((p) => ({ ...p, [id]:s }));

  const exec = { total:cases.length, pass:0, fail:0, blocked:0 };
  Object.values(statusMap).forEach((s) => {
    if (s==="Pass") exec.pass++;
    else if (s==="Fail") exec.fail++;
    else if (s==="Blocked") exec.blocked++;
  });
  const done = exec.pass + exec.fail + exec.blocked;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Summary */}
      <div style={{ background:"#fff", border:`1px solid ${isD365?"#d8b4fe":"#bfdbfe"}`, borderRadius:12, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:4 }}>{result.featureName}</div>
            <div style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>{result.summary}</div>
          </div>
          <div style={{ display:"flex", gap:16, flexShrink:0 }}>
            {[
              ["TCs",  cases.length, accent],
              ["Steps", cases.reduce((a,tc)=>a+(tc.steps?.length||0),0), "#374151"],
              ["Risk",  result.totalRisk, result.totalRisk==="High"?"#dc2626":result.totalRisk==="Medium"?"#d97706":"#16a34a"],
            ].map(([l,v,c]) => (
              <div key={l} style={{ textAlign:"center", minWidth:44 }}>
                <div style={{ fontSize:24, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:10, color:"#9ca3af" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance criteria */}
        {result.acceptanceCriteria?.length > 0 && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #f3f4f6" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#15803d", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>✓ Acceptance Criteria</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {result.acceptanceCriteria.map((ac,i) => (
                <span key={i} style={{ background:"#f0fdf4", border:"1px solid #86efac", color:"#166534", fontSize:11, padding:"3px 10px", borderRadius:20 }}>{ac}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Execution progress */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Execution Progress</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 }}>
          {[["Total",exec.total,"#374151"],["Pass",exec.pass,"#15803d"],["Fail",exec.fail,"#b91c1c"],["Blocked",exec.blocked,"#92400e"]].map(([l,v,c]) => (
            <div key={l} style={{ textAlign:"center", background:"#f9fafb", borderRadius:8, padding:"8px 4px" }}>
              <div style={{ fontSize:20, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ height:5, background:"#f3f4f6", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${exec.total>0?(done/exec.total)*100:0}%`, background:`linear-gradient(90deg,#22c55e,${accent})`, borderRadius:4, transition:"width 0.4s" }} />
        </div>
        <div style={{ fontSize:10, color:"#9ca3af", marginTop:5 }}>{done}/{exec.total} executed</div>
      </div>

      {/* Test case cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {cases.map((tc, i) => (
          <TestCaseCard key={tc.id} tc={tc} index={i}
            status={statusMap[tc.id] || "Not Executed"}
            onStatus={(s) => markStatus(tc.id, s)} />
        ))}
      </div>

      {/* Info panels */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {result.riskAreas?.length > 0 && (
          <InfoPanel title="⚠ Risk Areas" color="#dc2626" bg="#fef2f2" border="#fecaca">
            {result.riskAreas.map((r,i) => <InfoRow key={i} color="#dc2626">{r}</InfoRow>)}
          </InfoPanel>
        )}
        {result.testDataRequired?.length > 0 && (
          <InfoPanel title="📦 Test Data Required" color="#0369a1" bg="#eff6ff" border="#bae6fd">
            {result.testDataRequired.map((d,i) => <InfoRow key={i} color="#0369a1">{d}</InfoRow>)}
          </InfoPanel>
        )}
        {result.outOfScope?.length > 0 && (
          <InfoPanel title="🚫 Out of Scope" color="#6b7280" bg="#f9fafb" border="#e5e7eb">
            {result.outOfScope.map((o,i) => <InfoRow key={i} color="#6b7280">{o}</InfoRow>)}
          </InfoPanel>
        )}
      </div>
    </div>
  );
}