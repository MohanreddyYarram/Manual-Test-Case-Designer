// src/components/TestCaseCard.jsx
import { TYPE_STYLE, PRIORITY_STYLE, STATUS_STYLE, STATUS_OPTIONS } from "../utils/constants";

const SL = ({ children }) => (
  <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{children}</div>
);

function StandardBody({ tc, status, onStatus }) {
  const ss = STATUS_STYLE[status];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Preconditions */}
      <div>
        <SL>Preconditions</SL>
        <div style={{ fontSize:13, color:"#374151", background:"#fff", border:"1px solid #e5e7eb", borderRadius:7, padding:"9px 13px", lineHeight:1.6 }}>{tc.preconditions}</div>
      </div>

      {/* Steps */}
      <div>
        <SL>Test Steps</SL>
        <div style={{ border:"1px solid #e5e7eb", borderRadius:7, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
            <thead>
              <tr style={{ background:"#eff6ff" }}>
                {["#","Action","Test Data"].map((h,i) => (
                  <th key={h} style={{ textAlign:"left", padding:"8px 12px", color:"#1d4ed8", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"1px solid #e5e7eb", width:i===0?32:i===2?"30%":undefined }}>{h}</th>
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

      {/* Expected result */}
      <div>
        <SL>Expected Result</SL>
        <div style={{ fontSize:13, color:"#15803d", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:7, padding:"10px 13px", lineHeight:1.6 }}>✓ {tc.expectedResult}</div>
      </div>

      {/* Status */}
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

      {/* Tags */}
      {tc.tags?.length > 0 && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {tc.tags.map((tag) => <span key={tag} style={{ fontSize:11, color:"#0078d4", background:"#eff6ff", padding:"3px 8px", borderRadius:4 }}>#{tag}</span>)}
        </div>
      )}
    </div>
  );
}

function BDDBody({ tc, copied, onCopy }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ fontFamily:"'Courier New',monospace", fontSize:12.5, background:"#0f172a", color:"#e2e8f0", borderRadius:8, padding:"18px 20px", lineHeight:2.0, overflowX:"auto" }}>
        {tc.tags?.length > 0 && <div style={{ color:"#818cf8", marginBottom:6 }}>{tc.tags.join(" ")}</div>}
        <div><span style={{ color:"#fbbf24", fontWeight:700 }}>Scenario: </span><span>{tc.title}</span></div>
        {tc.given.map((g,i) => <div key={i}><span style={{ color:"#34d399", fontWeight:700 }}>{i===0?"  Given ":"    And "}</span><span>{g}</span></div>)}
        {tc.when.map((w,i)  => <div key={i}><span style={{ color:"#60a5fa", fontWeight:700 }}>{i===0?"  When " :"    And "}</span><span>{w}</span></div>)}
        {tc.then.map((t,i)  => <div key={i}><span style={{ color:"#f472b6", fontWeight:700 }}>{i===0?"  Then " :"    And "}</span><span>{t}</span></div>)}
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onCopy}
          style={{ fontSize:12, padding:"6px 14px", borderRadius:7, border:"1px solid #e5e7eb", background:copied?"#0078d4":"#fff", color:copied?"#fff":"#374151", cursor:"pointer", fontWeight:600 }}>
          {copied ? "✓ Copied!" : "Copy Gherkin"}
        </button>
      </div>
    </div>
  );
}

export default function TestCaseCard({ tc, mode, isOpen, onToggle, status, onStatus, copied, onCopy }) {
  const ts = TYPE_STYLE[tc.type]        || TYPE_STYLE["Positive"];
  const ps = PRIORITY_STYLE[tc.priority] || PRIORITY_STYLE["Medium"];
  const ss = STATUS_STYLE[status];

  return (
    <div style={{ background:"#fff", border:`1.5px solid ${isOpen?"#0078d4":"#e5e7eb"}`, borderRadius:10, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)", transition:"border-color 0.15s" }}>
      {/* Header */}
      <div onClick={onToggle} style={{ padding:"12px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, userSelect:"none" }}>
        <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:ts.dot, flexShrink:0 }} />
        <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", fontFamily:"monospace", minWidth:50 }}>{tc.id}</span>
        <span style={{ fontSize:13, fontWeight:600, color:"#0f172a", flex:1, lineHeight:1.4 }}>{tc.title}</span>
        <div style={{ display:"flex", gap:5, alignItems:"center", flexShrink:0 }}>
          <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:ts.badge, color:ts.badgeText }}>{tc.type}</span>
          <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:ps.bg, color:ps.text }}>{tc.priority}</span>
          {mode==="standard" && <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, background:ss.bg, color:ss.text, border:`1px solid ${ss.border}` }}>{status}</span>}
          <span style={{ color:"#cbd5e1", fontSize:12, marginLeft:2 }}>{isOpen?"▲":"▼"}</span>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{ borderTop:"1px solid #f3f4f6", padding:"16px 18px", background:"#fafafa" }}>
          {mode==="standard"
            ? <StandardBody tc={tc} status={status} onStatus={onStatus} />
            : <BDDBody tc={tc} copied={copied} onCopy={onCopy} />}
        </div>
      )}
    </div>
  );
}
