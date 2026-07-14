// src/components/InputForm.jsx
import { APP_TYPES } from "../utils/constants";

const ta = {
  width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 13px",
  fontSize:13, color:"#374151", lineHeight:1.65, resize:"vertical", outline:"none",
  fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#fafafa",
  marginTop:6, boxSizing:"border-box",
};
const inp = { ...ta, resize:"none", height:38, lineHeight:"normal" };

const Label = ({ children, required }) => (
  <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>
    {children}{required && <span style={{ color:"#ef4444", marginLeft:2 }}>*</span>}
  </div>
);
const Hint = ({ children }) => (
  <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{children}</div>
);
const CharCount = ({ value = "", max }) => {
  const pct   = value.length / max;
  const color = pct > 0.9 ? "#ef4444" : pct > 0.7 ? "#f59e0b" : "#9ca3af";
  return (
    <div style={{ fontSize:10, color, textAlign:"right", marginTop:3 }}>
      {value.length.toLocaleString()} / {max.toLocaleString()}
    </div>
  );
};

export default function InputForm({ form, onChange, onGenerate, loading }) {
  const set    = (k, v) => onChange({ ...form, [k]: v });
  const canGo  = form.description?.trim() && form.acceptanceCriteria?.trim();
  const isD365 = form.appType === "dynamics365";
  const focus  = (e) => (e.target.style.borderColor = "#0078d4");
  const blur   = (e) => (e.target.style.borderColor = "#e5e7eb");

  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e5e7eb", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid #f3f4f6" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>
          Test Input
        </div>
      </div>

      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:18 }}>

        {/* App Type */}
        <div>
          <Label>Application Type</Label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
            {APP_TYPES.map((opt) => (
              <button key={opt.value} onClick={() => set("appType", opt.value)}
                style={{ border:`2px solid ${form.appType===opt.value?(opt.value==="dynamics365"?"#7c3aed":"#0078d4"):"#e5e7eb"}`, borderRadius:9, padding:"10px 10px 8px", textAlign:"left", cursor:"pointer", background:form.appType===opt.value?(opt.value==="dynamics365"?"#faf5ff":"#eff6ff"):"#fafafa" }}>
                <div style={{ fontSize:18, lineHeight:1, marginBottom:5 }}>{opt.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{opt.label}</div>
                <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Story No */}
        <div>
          <Label>User Story No.</Label>
          <Hint>e.g. 102335 — appears in column A of the Excel export</Hint>
          <input value={form.userStory || ""} onChange={(e) => set("userStory", e.target.value)}
            placeholder="e.g. 102335" style={inp} onFocus={focus} onBlur={blur} />
        </div>

        {/* Feature Description */}
        <div>
          <Label required>Feature Description</Label>
          <Hint>Describe the feature in full detail — the more context, the better the test cases</Hint>
          <textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)}
            rows={10} style={ta} onFocus={focus} onBlur={blur}
            placeholder={isD365
              ? "e.g. Any club user can edit any account — it does NOT require an account-club relationship for their Club, although specific data fields are club only. Must be aware that if changing an account which has a club role..."
              : "e.g. User registration page where new users create an account with name, email and password, followed by email verification..."} />
          <CharCount value={form.description} max={10000} />
        </div>

        {/* Acceptance Criteria */}
        <div>
          <Label required>Acceptance Criteria</Label>
          <Hint>List each criterion on a new line</Hint>
          <textarea value={form.acceptanceCriteria || ""} onChange={(e) => set("acceptanceCriteria", e.target.value)}
            rows={5} style={ta} onFocus={focus} onBlur={blur}
            placeholder={"- Criterion 1\n- Criterion 2\n- Criterion 3"} />
          <CharCount value={form.acceptanceCriteria} max={5000} />
        </div>

        {/* Prerequisite Steps — the key field that solves "Follow TC1" */}
        <div>
          <Label>Prerequisite / Navigation Steps</Label>
          <Hint>
            Paste your common setup steps here (e.g. login + navigation to the feature).
            The AI will inline these at the start of every test case — it will never write "Follow TC1".
          </Hint>
          <textarea value={form.prerequisiteSteps || ""} onChange={(e) => set("prerequisiteSteps", e.target.value)}
            rows={5} style={{ ...ta, background: isD365 ? "#faf5ff" : "#f0f9ff", borderColor: isD365 ? "#e9d5ff" : "#bae6fd" }}
            onFocus={(e) => (e.target.style.borderColor = isD365 ? "#7c3aed" : "#0078d4")}
            onBlur={(e)  => (e.target.style.borderColor = isD365 ? "#e9d5ff" : "#bae6fd")}
            placeholder={isD365
              ? "e.g.\n1. Log in to D365 CRM as a Club User\n2. Navigate to Accounts via left-hand navigation\n3. Open the relevant Account record\n4. Verify the Account summary page is displayed"
              : "e.g.\n1. Open Chrome browser and navigate to https://app.example.com\n2. Log in with a valid registered user account\n3. Verify the dashboard is displayed"} />
          <CharCount value={form.prerequisiteSteps} max={3000} />
        </div>

        {/* Additional Comments */}
        <div>
          <Label>Additional Comments</Label>
          <Hint>Known issues, specific field names, out-of-scope items</Hint>
          <textarea value={form.comments || ""} onChange={(e) => set("comments", e.target.value)}
            rows={3} style={ta} onFocus={focus} onBlur={blur}
            placeholder={isD365
              ? "e.g. Test with System Admin and Sales roles. Business rule fires on save only..."
              : "e.g. Test on Chrome and Edge. Mobile is out of scope..."} />
          <CharCount value={form.comments} max={2000} />
        </div>

        {/* Generate button */}
        <button onClick={onGenerate} disabled={loading || !canGo}
          style={{ background: !canGo||loading ? "#e5e7eb" : isD365 ? "linear-gradient(135deg,#7c3aed,#0078d4)" : "linear-gradient(135deg,#0078d4,#0ea5e9)", color: !canGo||loading ? "#9ca3af" : "#fff", border:"none", borderRadius:9, padding:13, fontSize:14, fontWeight:700, cursor: !canGo||loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loading ? <><Spinner />Copilot is analysing…</> : <>{isD365 ? "⚙" : "✦"} Generate Test Cases</>}
        </button>

        {!canGo && !loading && (
          <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", margin:0 }}>
            Fill in Description and Acceptance Criteria to continue
          </p>
        )}
      </div>
    </div>
  );
}

const Spinner = () => (
  <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite", marginRight:6 }} />
);