// src/components/ResultsPanel.jsx
// Standard test cases only. Excel export with columns:
// Test Case No | Test Case Title | Action Step | Expected Result

import { useState } from "react";

const TYPE_STYLE = {
  "Positive":      { dot:"#22c55e", badge:"#dcfce7", badgeText:"#15803d" },
  "Negative":      { dot:"#ef4444", badge:"#fee2e2", badgeText:"#b91c1c" },
  "Edge Case":     { dot:"#a855f7", badge:"#f3e8ff", badgeText:"#7e22ce" },
  "Boundary":      { dot:"#3b82f6", badge:"#dbeafe", badgeText:"#1d4ed8" },
  "UI Validation": { dot:"#f59e0b", badge:"#fef3c7", badgeText:"#92400e" },
  "Security":      { dot:"#ec4899", badge:"#fce7f3", badgeText:"#9d174d" },
  "Performance":   { dot:"#06b6d4", badge:"#cffafe", badgeText:"#0e7490" },
};
const PRI_STYLE = {
  "High":   { bg:"#fee2e2", text:"#b91c1c" },
  "Medium": { bg:"#fef9c3", text:"#854d0e" },
  "Low":    { bg:"#dcfce7", text:"#15803d" },
};
const STATUS_STYLE = {
  "Not Executed": { bg:"#f3f4f6", text:"#6b7280", border:"#d1d5db" },
  "Pass":         { bg:"#dcfce7", text:"#15803d", border:"#86efac" },
  "Fail":         { bg:"#fee2e2", text:"#b91c1c", border:"#fca5a5" },
  "Blocked":      { bg:"#fef3c7", text:"#92400e", border:"#fde68a" },
  "Skipped":      { bg:"#f3e8ff", text:"#7e22ce", border:"#d8b4fe" },
};
const STATUS_OPTIONS = ["Pass","Fail","Blocked","Skipped","Not Executed"];

const SL = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{children}</div>
);
const InfoPanel = ({ title, color, bg, border, children }) => (
  <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"13px 16px" }}>
    <div style={{ fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{title}</div>
    {children}
  </div>
);
const InfoRow = ({ color, children }) => (
  <div style={{ fontSize:12.5, color:"#374151", paddingLeft:10, borderLeft:`3px solid ${color}`, marginBottom:6, lineHeight:1.5 }}>{children}</div>
);

// ── Excel export ──────────────────────────────────────────────────────────────
// Uses a simple CSV-to-Excel approach — no library needed.
// Each step becomes its own row so testers can fill in results line by line.
function exportToExcel(result) {
  const rows = [];

  // Header row
  rows.push([
    "Test Case No",
    "Test Case Title",
    "Type",
    "Priority",
    "Preconditions",
    "Step No",
    "Action Step",
    "Test Data",
    "Expected Result",
    "Status",
  ]);

  // Data rows — one row per step
  (result.testCases || []).forEach((tc) => {
    tc.steps.forEach((step, idx) => {
      rows.push([
        tc.id,
        idx === 0 ? tc.title : "",                // Title only on first step row
        idx === 0 ? tc.type : "",
        idx === 0 ? tc.priority : "",
        idx === 0 ? tc.preconditions : "",
        step.no,
        step.action,
        step.testData,
        idx === tc.steps.length - 1 ? tc.expectedResult : "", // Expected result on last step
        idx === 0 ? "Not Executed" : "",
      ]);
    });
    // Empty separator row between test cases
    rows.push(["", "", "", "", "", "", "", "", "", ""]);
  });

  // Convert to CSV
  const csv = rows.map((row) =>
    row.map((cell) => {
      const str = String(cell ?? "").replace(/"/g, '""');
      return str.includes(",") || str.includes("\n") || str.includes('"')
        ? `"${str}"`
        : str;
    }).join(",")
  ).join("\n");

  // Add BOM for Excel to recognise UTF-8
  const bom  = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${(result.featureName || "test-cases").replace(/\s+/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Single test case card ─────────────────────────────────────────────────────
function TestCaseCard({ tc, status, onStatus }) {
  const [open, setOpen] = useState(false);
  const ts = TYPE_STYLE[tc.type]    || TYPE_STYLE["Positive"];
  const ps = PRI_STYLE[tc.priority] || PRI_STYLE["Medium"];
  const ss = STATUS_STYLE[status];

  return (
    <div style={{ background:"#fff", border:`1.5px solid ${open?"#0078d4":"#e5e7eb"}`, borderRadius:10, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", transition:"border-color 0.15s" }}>

      {/* Header */}
      <div onClick={() => setOpen(!open)}
        style={{ padding:"12px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, userSelect:"none" }}>
        <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:ts.dot, flexShrink:0 }} />
        <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", fontFamily:"monospace", minWidth:50 }}>{tc.id}</span>
        <span style={{ fontSize:13, fontWeight:600, color:"#0f172a", flex:1, lineHeight:1.4 }}>{tc.title}</span>
        <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:ts.badge, color:ts.badgeText }}>{tc.type}</span>
          <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:ps.bg, color:ps.text }}>{tc.priority}</span>
          <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:ss.bg, color:ss.text, border:`1px solid ${ss.border}` }}>{status}</span>
          <span style={{ color:"#cbd5e1", fontSize:12, marginLeft:2 }}>{open?"▲":"▼"}</span>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ borderTop:"1px solid #f3f4f6", padding:"16px 18px", background:"#fafafa", display:"flex", flexDirection:"column", gap:14 }}>

          {/* Preconditions */}
          <div>
            <SL>Preconditions</SL>
            <div style={{ fontSize:13, color:"#374151", background:"#fff", border:"1px solid #e5e7eb", borderRadius:7, padding:"9px 13px", lineHeight:1.6 }}>{tc.preconditions}</div>
          </div>

          {/* Steps table */}
          <div>
            <SL>Action Steps</SL>
            <div style={{ border:"1px solid #e5e7eb", borderRadius:7, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
                <thead>
                  <tr style={{ background:"#eff6ff" }}>
                    {["#","Action Step","Test Data"].map((h,i) => (
                      <th key={h} style={{ textAlign:"left", padding:"8px 12px", color:"#1d4ed8", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e5e7eb", width:i===0?36:i===2?"30%":undefined }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tc.steps.map((step, i) => (
                    <tr key={i} style={{ background:i%2===0?"#fff":"#f9fafb" }}>
                      <td style={{ padding:"9px 12px", borderBottom:"1px solid #f3f4f6", fontWeight:700, color:"#0078d4" }}>{step.no}</td>
                      <td style={{ padding:"9px 12px", borderBottom:"1px solid #f3f4f6", color:"#374151", lineHeight:1.5 }}>{step.action}</td>
                      <td style={{ padding:"9px 12px", borderBottom:"1px solid #f3f4f6", color:step.testData==="N/A"?"#9ca3af":"#374151", fontStyle:step.testData==="N/A"?"italic":"normal", fontFamily:step.testData!=="N/A"?"monospace":"inherit" }}>{step.testData}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expected Result */}
          <div>
            <SL>Expected Result</SL>
            <div style={{ fontSize:13, color:"#15803d", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:7, padding:"10px 13px", lineHeight:1.6 }}>✓ {tc.expectedResult}</div>
          </div>

          {/* Status buttons */}
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
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

          {tc.tags?.length > 0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {tc.tags.map((tag) => <span key={tag} style={{ fontSize:11, color:"#0078d4", background:"#eff6ff", padding:"3px 8px", borderRadius:4 }}>#{tag}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main results panel ────────────────────────────────────────────────────────
export default function ResultsPanel({ result, isD365 }) {
  const [ftType,    setFtType]    = useState("All");
  const [ftPri,     setFtPri]     = useState("All");
  const [statusMap, setStatusMap] = useState({});

  const cases  = result.testCases || [];
  const types  = ["All", ...new Set(cases.map((tc) => tc.type))];
  const shown  = cases.filter((tc) =>
    (ftType==="All" || tc.type===ftType) &&
    (ftPri==="All"  || tc.priority===ftPri)
  );
  const accent = isD365 ? "#7c3aed" : "#0078d4";

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
          <div style={{ display:"flex", gap:12, flexShrink:0 }}>
            {[
              ["Test Cases", cases.length, "#0078d4"],
              ["High", cases.filter(t=>t.priority==="High").length, "#dc2626"],
              ["Risk", result.totalRisk, result.totalRisk==="High"?"#dc2626":result.totalRisk==="Medium"?"#d97706":"#16a34a"],
            ].map(([l,v,c]) => (
              <div key={l} style={{ textAlign:"center", minWidth:52 }}>
                <div style={{ fontSize:24, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:10, color:"#9ca3af" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Criteria pills */}
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

      {/* Filters + Export buttons */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>TYPE</span>
        {types.map((t) => (
          <button key={t} onClick={() => setFtType(t)}
            style={{ fontSize:11, padding:"4px 10px", borderRadius:20, border:`1px solid ${ftType===t?accent:"#e5e7eb"}`, background:ftType===t?(isD365?"#faf5ff":"#eff6ff"):"#fff", color:ftType===t?accent:"#6b7280", cursor:"pointer", fontWeight:ftType===t?700:400 }}>
            {t}
          </button>
        ))}
        <div style={{ width:1, height:16, background:"#e5e7eb", margin:"0 2px" }} />
        <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>PRIORITY</span>
        {["All","High","Medium","Low"].map((p) => (
          <button key={p} onClick={() => setFtPri(p)}
            style={{ fontSize:11, padding:"4px 10px", borderRadius:20, border:`1px solid ${ftPri===p?"#374151":"#e5e7eb"}`, background:ftPri===p?"#1e293b":"#fff", color:ftPri===p?"#fff":"#6b7280", cursor:"pointer", fontWeight:ftPri===p?700:400 }}>
            {p}
          </button>
        ))}
        <span style={{ fontSize:12, color:"#9ca3af", marginLeft:"auto" }}>{shown.length} test case{shown.length!==1?"s":""}</span>

        {/* Export buttons */}
        <button onClick={() => exportToExcel(result)}
          style={{ fontSize:12, padding:"7px 16px", borderRadius:7, border:"none", background:"#217346", color:"#fff", cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
          📊 Export Excel
        </button>
        <button onClick={() => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:"application/json"}));
          a.download = `${(result.featureName||"test-cases").replace(/\s+/g,"_")}.json`;
          a.click();
        }}
          style={{ fontSize:12, padding:"7px 14px", borderRadius:7, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600 }}>
          ↓ JSON
        </button>
      </div>

      {/* Test case cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {shown.map((tc) => (
          <TestCaseCard
            key={tc.id} tc={tc}
            status={statusMap[tc.id] || "Not Executed"}
            onStatus={(s) => markStatus(tc.id, s)}
          />
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