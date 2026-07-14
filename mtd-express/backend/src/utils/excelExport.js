// src/utils/excelExport.js
// Generates Excel in exact client format:
// A: User Story | B: TC No | C: Test Case Name | D: Step No | E: Actual Step | F: Expected Result
// Each step has its own expected result.
// TC No + Test Case Name merged across all steps of that TC.
// User Story merged across all rows.

const ExcelJS = require("exceljs");

async function generateExcel(result, userStory) {
  const wb       = new ExcelJS.Workbook();
  wb.creator     = "Manual Test Designer";
  wb.created     = new Date();

  const ws = wb.addWorksheet("Test Cases", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });

  // ── Column widths ──────────────────────────────────────────────────────────
  ws.columns = [
    { key: "userStory", width: 13  },   // A
    { key: "tcNo",      width: 10  },   // B
    { key: "tcName",    width: 40  },   // C
    { key: "stepNo",    width: 9   },   // D
    { key: "action",    width: 58  },   // E — Actual Step
    { key: "expected",  width: 58  },   // F — Expected Result
  ];

  // ── Styles ─────────────────────────────────────────────────────────────────
  const thin       = { style: "thin", color: { argb: "FF000000" } };
  const bdr        = { top: thin, left: thin, bottom: thin, right: thin };
  const HDR_FONT   = { name: "Calibri", bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  const HDR_FILL   = { type: "pattern", pattern: "solid", fgColor: { argb: "FF203864" } };
  const TC_FONT    = { name: "Calibri", bold: true, size: 10 };
  const BODY_FONT  = { name: "Calibri", size: 10 };
  const TC_FILLS   = [
    { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } },  // light blue
    { type: "pattern", pattern: "solid", fgColor: { argb: "FFEBF3FB" } },  // lighter blue
  ];
  const WRAP_MID   = { wrapText: true, vertical: "center", horizontal: "center" };
  const WRAP_TOP   = { wrapText: true, vertical: "top",    horizontal: "left"   };
  const WRAP_TOP_C = { wrapText: true, vertical: "top",    horizontal: "center" };

  // ── Header row ─────────────────────────────────────────────────────────────
  const hdr = ws.addRow(["User Story","TC No","Test Case Name","Step No","Actual Step","Expected Result"]);
  hdr.height = 22;
  hdr.eachCell((c) => {
    c.font = HDR_FONT; c.fill = HDR_FILL;
    c.alignment = WRAP_MID; c.border = bdr;
  });

  // ── Data ───────────────────────────────────────────────────────────────────
  const testCases  = result.testCases || [];
  let   curRow     = 2;
  let   usStart    = 2;
  let   totalRows  = 0;

  testCases.forEach((tc, tcIdx) => {
    const steps    = tc.steps || [];
    const n        = steps.length;
    const startRow = curRow;
    const endRow   = curRow + n - 1;
    const fill     = TC_FILLS[tcIdx % 2];

    steps.forEach((step, si) => {
      const r = ws.addRow([
        tcIdx === 0 && si === 0 ? (userStory || result.userStory || "") : "",
        si === 0 ? tc.id : "",
        si === 0 ? tc.name : "",
        step.no,
        step.action,
        step.expected,
      ]);
      r.height = 46;

      // A — User Story
      const ca = r.getCell(1);
      ca.font = TC_FONT; ca.alignment = WRAP_MID; ca.border = bdr;

      // B — TC No
      const cb = r.getCell(2);
      cb.font = TC_FONT; cb.fill = fill;
      cb.alignment = WRAP_MID; cb.border = bdr;

      // C — Test Case Name
      const cc = r.getCell(3);
      cc.font = TC_FONT; cc.fill = fill;
      cc.alignment = WRAP_TOP; cc.border = bdr;

      // D — Step No
      const cd = r.getCell(4);
      cd.font = BODY_FONT; cd.alignment = WRAP_TOP_C; cd.border = bdr;

      // E — Actual Step
      const ce = r.getCell(5);
      ce.font = BODY_FONT; ce.alignment = WRAP_TOP; ce.border = bdr;

      // F — Expected Result
      const cf = r.getCell(6);
      cf.font = BODY_FONT; cf.alignment = WRAP_TOP; cf.border = bdr;

      curRow++;
    });

    // Merge B and C across all steps of this TC
    if (n > 1) {
      ws.mergeCells(startRow, 2, endRow, 2);
      ws.mergeCells(startRow, 3, endRow, 3);
    }

    totalRows += n;

    // Thin separator between TCs
    if (tcIdx < testCases.length - 1) {
      const sep = ws.addRow(["","","","","",""]);
      sep.height = 6;
      sep.eachCell((c) => { c.border = bdr; });
      curRow++;
      totalRows++;
    }
  });

  // Merge A (User Story) across all data rows
  if (totalRows > 1) {
    ws.mergeCells(2, 1, 1 + totalRows, 1);
  }

  // Freeze header
  ws.views = [{ state: "frozen", ySplit: 1 }];

  return wb.xlsx.writeBuffer();
}

module.exports = { generateExcel };