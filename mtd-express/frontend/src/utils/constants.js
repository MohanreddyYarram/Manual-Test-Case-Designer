// src/utils/constants.js

export const TYPE_STYLE = {
  "Positive":      { dot:"#22c55e", badge:"#dcfce7", badgeText:"#15803d" },
  "Negative":      { dot:"#ef4444", badge:"#fee2e2", badgeText:"#b91c1c" },
  "Edge Case":     { dot:"#a855f7", badge:"#f3e8ff", badgeText:"#7e22ce" },
  "Boundary":      { dot:"#3b82f6", badge:"#dbeafe", badgeText:"#1d4ed8" },
  "UI Validation": { dot:"#f59e0b", badge:"#fef3c7", badgeText:"#92400e" },
  "Security":      { dot:"#ec4899", badge:"#fce7f3", badgeText:"#9d174d" },
  "Performance":   { dot:"#06b6d4", badge:"#cffafe", badgeText:"#0e7490" },
};

export const PRIORITY_STYLE = {
  "High":   { bg:"#fee2e2", text:"#b91c1c" },
  "Medium": { bg:"#fef9c3", text:"#854d0e" },
  "Low":    { bg:"#dcfce7", text:"#15803d" },
};

export const STATUS_STYLE = {
  "Not Executed": { bg:"#f3f4f6", text:"#6b7280", border:"#d1d5db" },
  "Pass":         { bg:"#dcfce7", text:"#15803d", border:"#86efac" },
  "Fail":         { bg:"#fee2e2", text:"#b91c1c", border:"#fca5a5" },
  "Blocked":      { bg:"#fef3c7", text:"#92400e", border:"#fde68a" },
  "Skipped":      { bg:"#f3e8ff", text:"#7e22ce", border:"#d8b4fe" },
};

export const STATUS_OPTIONS = ["Pass","Fail","Blocked","Skipped","Not Executed"];

export const APP_TYPES = [
  { value:"web",         icon:"🌐", label:"Web Application", sub:"React, Angular, Vue…"  },
  { value:"dynamics365", icon:"⚙️", label:"Dynamics 365",    sub:"CRM / ERP / CE"        },
];
