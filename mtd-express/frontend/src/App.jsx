// src/App.jsx
import { useState } from "react";
import InputForm    from "./components/InputForm";
import ResultsPanel from "./components/ResultsPanel";
import { generateTestCases } from "./services/api";

const EMPTY = { description:"", acceptanceCriteria:"", comments:"", appType:"web" };

export default function App() {
  const [form,    setForm]    = useState(EMPTY);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isD365 = form.appType === "dynamics365";

  const handleGenerate = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      setResult(await generateTestCases(form));
    } catch (err) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setForm(EMPTY); setResult(null); setError(""); };

  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f5", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#111827" }}>

      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 28px", height:54, display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:isD365?"linear-gradient(135deg,#742774,#0078d4)":"linear-gradient(135deg,#0078d4,#50e6ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>
            {isD365 ? "⚙" : "✦"}
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, lineHeight:1.2, color:"#0f172a" }}>Manual Test Designer</div>
            <div style={{ fontSize:10, color:"#6b7280", lineHeight:1.2 }}>Powered by Microsoft Copilot</div>
          </div>
        </div>
        <div style={{ height:20, width:1, background:"#e5e7eb" }} />
        <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:isD365?"#f3e8ff":"#eff6ff", color:isD365?"#7e22ce":"#1d4ed8", border:`1px solid ${isD365?"#d8b4fe":"#bfdbfe"}` }}>
          {isD365 ? "Dynamics 365 Mode" : "Web App Mode"}
        </span>
        {result && (
          <button onClick={handleReset}
            style={{ marginLeft:"auto", fontSize:12, padding:"7px 14px", borderRadius:7, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer", fontWeight:600 }}>
            New Session
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px 60px", display:"grid", gridTemplateColumns:result?"380px 1fr":"520px", justifyContent:"center", gap:24, alignItems:"start" }}>

        <InputForm form={form} onChange={setForm} onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", color:"#b91c1c", padding:"12px 16px", borderRadius:9, fontSize:13 }}>
            ⚠ {error}
          </div>
        )}

        {result && <ResultsPanel result={result} isD365={isD365} />}

        {!result && !loading && !error && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, color:"#9ca3af", gap:12 }}>
            <div style={{ fontSize:48, opacity:0.3 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:600, color:"#d1d5db" }}>Fill in the form and click Generate</div>
            <div style={{ fontSize:13 }}>Test cases will appear here — export to Excel in one click</div>
          </div>
        )}

        {loading && (
          <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:40, textAlign:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ width:38, height:38, border:"3px solid #e5e7eb", borderTopColor:"#0078d4", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
            <div style={{ fontSize:14, color:"#374151", fontWeight:500 }}>Copilot is analysing your user story…</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginTop:6 }}>This may take 10–20 seconds</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin:0; padding:0; }
        textarea::placeholder { color: #d1d5db; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:3px; }
      `}</style>
    </div>
  );
}