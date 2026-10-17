"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity, AlertCircle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BarChart3, Boxes, CalendarDays, Check, ChevronLeft, ChevronRight,
  CircleCheck, CloudOff, Database, Download, FileCheck2, FileText,
  History, LayoutDashboard, Menu, Package, RefreshCcw, Search,
  ShieldCheck, Sparkles, UploadCloud, Warehouse, X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import styles from "./stockroom.module.css";

type Item = { code: string; name: string; uom: string; reorder: number };
type Movement = { id: string; date: string; code: string; warehouse: string; direction: "IN" | "OUT"; qty: number; reference: string };
type Rejection = { id: string; reason: string };
type Dataset = { items: Item[]; movements: Movement[]; rejected: Rejection[] };
type Tab = "overview" | "inventory" | "movements" | "reports" | "imports";
type Report = "stock_on_hand" | "below_reorder" | "monthly_out";
type Row = (string | number | ReactNode)[];
const STORAGE = "bokang-stockroom-interview-demo-v3";

const sampleItems = `item_code,item_name,uom,reorder_level
RG-001,Gold ring blank 18ct,Nos,20
CH-010,Silver chain 45cm,Nos,15
BX-100,Gift box small,Nos,50
PL-200,Polishing paste,Kg,2.5
ST-300,Cubic zirconia 2mm,Nos,200`;
const sampleMovements = `movement_id,date,item_code,warehouse,direction,qty,reference
M001,2026-08-03,RG-001,Gaborone,IN,40,PO-1001
M002,2026-08-05,rg-001 ,Gaborone,out,12,SO-2001
M003,2026-08-05,CH-010,Francistown,IN,30,PO-1002
M004,2026/08/07,CH-010,Francistown,OUT,5,SO-2002
M005,2026-08-09,BX-100,Gaborone,IN,120,PO-1003
M005,2026-08-10,BX-100,Gaborone,OUT,10,SO-2003
M006,2026-08-12,XX-999,Gaborone,IN,10,PO-1004
M007,2026-08-14,PL-200,,IN,5,PO-1005
M008,2026-08-15,PL-200,Gaborone,TRANSFER,1,TR-01
M009,2026-08-18,ST-300,Gaborone,IN,-50,PO-1006
M010,2026-08-20,ST-300,Gaborone,IN,abc,PO-1007
M011,2026-08-22,ST-300,Gaborone,IN,150,PO-1008
M012,2026-09-02,RG-001,Francistown,IN,10,PO-1009
M013,2026-09-04,RG-001,Gaborone,OUT,8,SO-2004
M014,2026-09-06,BX-100,Gaborone,OUT,75.5,SO-2005
M015,2026-09-30,PL-200,Gaborone, in ,3.25,PO-1010
M016,2026-09-31,CH-010,Gaborone,IN,5,PO-1011
M017,2026-09-15,CH-010,Francistown,OUT,20,SO-2006`;

function parseCSV(csv: string) {
  const lines: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  const text = csv.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((c === "\r" || c === "\n") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some(Boolean)) lines.push(row);
      row = []; cell = "";
    } else cell += c;
  }
  if (quoted) throw new Error("Malformed CSV: unclosed quoted field");
  row.push(cell.trim());
  if (row.some(Boolean)) lines.push(row);
  if (!lines.length) throw new Error("The CSV is empty");
  const headers = lines.shift()!;
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate CSV column");
  return {
    headers,
    records: lines.map((values, idx) => {
      if (values.length !== headers.length) throw new Error("Incorrect number of CSV fields on row " + (idx + 2));
      return Object.fromEntries(headers.map((key, i) => [key, values[i]])) as Record<string, string>;
    }),
  };
}
function isISODate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date + "T00:00:00Z");
  return Number.isFinite(d.valueOf()) && d.toISOString().slice(0, 10) === date;
}
function loadDemo(itemsCSV: string, movementsCSV: string): Dataset {
  const itemRows = parseCSV(itemsCSV), moveRows = parseCSV(movementsCSV);
  for (const field of ["item_code", "item_name", "uom", "reorder_level"])
    if (!itemRows.headers.includes(field)) throw new Error("items.csv is missing " + field);
  for (const field of ["movement_id", "date", "item_code", "warehouse", "direction", "qty", "reference"])
    if (!moveRows.headers.includes(field)) throw new Error("movements.csv is missing " + field);
  const items = itemRows.records.map(r => ({
    code: (r.item_code ?? "").toUpperCase(), name: r.item_name ?? "", uom: r.uom ?? "", reorder: Number(r.reorder_level ?? ""),
  }));
  const codes = new Set(items.map(i => i.code));
  if (items.some(i => !i.code || !i.name || !i.uom || !Number.isFinite(i.reorder) || i.reorder < 0) || codes.size !== items.length)
    throw new Error("Invalid or duplicate item in items.csv");
  const movements: Movement[] = [], rejected: Rejection[] = [], acceptedIds = new Set<string>();
  for (const r of moveRows.records) {
    const m = {
      id: r.movement_id ?? "", date: r.date ?? "", code: (r.item_code ?? "").toUpperCase(), warehouse: r.warehouse ?? "",
      direction: (r.direction ?? "").toUpperCase(), qty: Number(r.qty ?? ""), reference: r.reference ?? "",
    };
    let reason = "";
    if (acceptedIds.has(m.id)) reason = "duplicate id";
    else if (!isISODate(m.date)) reason = "bad date";
    else if (!codes.has(m.code)) reason = "unknown item";
    else if (!m.warehouse) reason = "missing warehouse";
    else if (m.direction !== "IN" && m.direction !== "OUT") reason = "bad direction";
    else if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(r.qty ?? "") || !(m.qty > 0)) reason = "bad qty";
    if (reason) rejected.push({ id: m.id, reason });
    else { movements.push(m as Movement); acceptedIds.add(m.id); }
  }
  return { items, movements, rejected };
}
const sample = loadDemo(sampleItems, sampleMovements);
const nav = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "inventory", name: "Inventory", icon: Boxes },
  { id: "movements", name: "Movements", icon: Activity },
  { id: "reports", name: "Reports", icon: BarChart3 },
  { id: "imports", name: "Import & audit", icon: UploadCloud },
] as const;
const nfmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });
function num(x: number) { return nfmt.format(x); }
function Badge({ children, variant = "success" }: {children: ReactNode; variant?: "success" | "warning" | "danger" | "neutral"}) {
  return <span className={styles.badge} data-variant={variant}>{children}</span>;
}
function Table({ headers, rows }: { headers: string[]; rows: Row[] }) {
  return <div className={styles.tableScroll}><table className={styles.table}>
    <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
    <tbody>{rows.length ? rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j}>{v}</td>)}</tr>) : <tr><td colSpan={headers.length} className={styles.empty}>No records found.</td></tr>}</tbody>
  </table></div>;
}
function Panel({ title, sub, children, action }: { title: string; sub?: string; children: ReactNode; action?: ReactNode }) {
  return <section className={styles.panel}>
    <div className={styles.panelTop}><div><h2>{title}</h2>{sub ? <p>{sub}</p> : null}</div>{action}</div>
    {children}
  </section>;
}
function exportCSV(name: string, headers: string[], rows: (string | number)[][]) {
  const q = (x: string | number) => '"' + String(x).replace(/"/g, '""') + '"';
  const body = [headers, ...rows].map(r => r.map(q).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function StockroomClient() {
  const reduceMotion = useReducedMotion();
  const [dataset, setDataset] = useState<Dataset>(sample);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("ALL");
  const [report, setReport] = useState<Report>("stock_on_hand");
  const [itemCode, setItemCode] = useState("RG-001");
  const [asOf, setAsOf] = useState("2026-08-31");
  const [itemsFile, setItemsFile] = useState<File | null>(null);
  const [movesFile, setMovesFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE);
      if (stored) {
        const value = JSON.parse(stored) as Dataset;
        if (Array.isArray(value.items) && Array.isArray(value.movements) && Array.isArray(value.rejected))
          setDataset(value);
      }
    } catch { /* keep safe sample */ }
    setReady(true);
  }, []);
  function persist(value: Dataset) {
    setDataset(value);
    try { localStorage.setItem(STORAGE, JSON.stringify(value)); }
    catch { setError("Browser storage is unavailable; the import will not persist after refreshing."); }
  }
  function reset() {
    persist(sample); setItemsFile(null); setMovesFile(null);
    setNotice("Restored the original 5-item assessment sample."); setError(""); setPage(1);
  }
  function navigate(id: Tab) { setTab(id); setSearch(""); setDirection("ALL"); setPage(1); setMenuOpen(false); }
  async function importFiles() {
    setNotice(""); setError("");
    if (!itemsFile || !movesFile) { setError("Choose both items.csv and movements.csv."); return; }
    if (itemsFile.size + movesFile.size > 3_000_000) { setError("Total CSV upload must be under 3MB in the demo."); return; }
    try {
      const result = loadDemo(await itemsFile.text(), await movesFile.text());
      persist(result); setPage(1); setNotice("Imported " + result.items.length + " items, " + result.movements.length + " accepted and " + result.rejected.length + " rejected rows.");
    } catch(e) { setError(e instanceof Error ? e.message : "Import failed"); }
  }
  const model = useMemo(() => {
    const totals: Record<string, number> = {}, byWarehouse: Record<string, number> = {},
      byMonth: Record<string, {in: number; out: number}> = {}, outs: Record<string, number> = {};
    dataset.items.forEach(i => { totals[i.code] = 0; });
    for (const m of dataset.movements) {
      const signed = m.qty * (m.direction === "IN" ? 1 : -1);
      totals[m.code] = (totals[m.code] || 0) + signed;
      const key = m.code + "|" + m.warehouse;
      byWarehouse[key] = (byWarehouse[key] || 0) + signed;
      const month = m.date.slice(0, 7);
      if (!byMonth[month]) byMonth[month] = { in: 0, out: 0 };
      byMonth[month][m.direction === "IN" ? "in" : "out"] += m.qty;
      if (m.direction === "OUT") outs[month + "|" + m.code] = (outs[month + "|" + m.code] || 0) + m.qty;
    }
    return { totals, byWarehouse, byMonth, outs,
      low: dataset.items.filter(i => (totals[i.code] || 0) < i.reorder),
      grand: Object.values(totals).reduce((a,b) => a + b, 0) };
  }, [dataset]);
  const rows = [...dataset.movements].sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter(m => (direction === "ALL" || direction === m.direction) && Object.values(m).join(" ").toLowerCase().includes(search.toLowerCase()));
  const pageSize = 8, totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pages = rows.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);
  const reportData: {headers: string[]; raw: (string | number)[][]} = report === "stock_on_hand"
    ? { headers: ["Item code", "Warehouse", "Stock on hand"], raw: Object.entries(model.byWarehouse).sort().map(([k, v]) => [...k.split("|"), v]) }
    : report === "below_reorder"
      ? { headers: ["Item code", "Item name", "Quantity", "Reorder level"], raw: model.low.map(i => [i.code, i.name, model.totals[i.code] || 0, i.reorder]) }
      : { headers: ["Month", "Item code", "Quantity out"], raw: Object.entries(model.outs).sort().map(([k, v]) => [...k.split("|"), v]) };
  const picked = dataset.items.find(i => i.code === itemCode) || dataset.items[0];
  const history = dataset.movements.filter(m => m.code === picked?.code && m.date <= asOf)
    .reduce((v,m) => v + (m.direction === "IN" ? m.qty : -m.qty), 0);
  const months = Object.entries(model.byMonth).sort();
  const maxMonthly = Math.max(1, ...months.map(([,v]) => Math.max(v.in, v.out)));
  const enter = reduceMotion ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.24 } };
  return <div className={styles.shell}>
    <aside className={styles.sidebar + (menuOpen ? " " + styles.sidebarOpen : "")} aria-label="Stockroom navigation">
      <div className={styles.brand}><span className={styles.brandIcon}><Boxes size={23}/></span><span>stockroom<span className={styles.brandDot}>.</span></span></div>
      <div className={styles.navSection}>Workspace</div>
      <nav className={styles.nav}>{nav.map(n => <button type="button" key={n.id} className={tab === n.id ? styles.navActive : ""} onClick={() => navigate(n.id)}><n.icon size={18}/>{n.name}{tab === n.id ? <span className={styles.navMarker}/> : null}</button>)}</nav>
      <div className={styles.sideBottom}><div className={styles.sidebarBadge}><ShieldCheck size={17}/> Local demo workspace</div><p>Inventory management showcase<br/>Explore stock, movements and reporting</p><a href="/" className={styles.studioLink}><ArrowLeft size={15}/> Back to App Studio</a></div>
    </aside>
    {menuOpen ? <button aria-label="Close navigation" type="button" className={styles.backdrop} onClick={() => setMenuOpen(false)}/> : null}
    <div className={styles.main}>
      <header className={styles.topbar}><div className={styles.topLeft}><button type="button" className={styles.menuToggle} aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21}/></button><span>Workspace</span><span className={styles.chevron}>/</span><strong>{nav.find(n => n.id === tab)?.name}</strong></div><div className={styles.topRight}><span className={styles.connection}><span/> Browser demo</span><span className={styles.avatar}>BJ</span></div></header>
      <main className={styles.content}>
        <div className={styles.pageHead}><div><div className={styles.kicker}><Sparkles size={13}/> Apjakal practical showcase</div><h1>{({ overview: "Inventory overview", inventory: "Inventory management", movements: "Stock movement ledger", reports: "Reports & insights", imports: "Import & audit" })[tab]}</h1><p>Traceable stock control for inventory, replenishment and movement auditing.</p></div><button type="button" className={styles.reset} onClick={reset}><RefreshCcw size={15}/> Reset sample</button></div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} {...enter}>
            {tab === "overview" ? <>
              <div className={styles.hero}><div><div className={styles.heroEyebrow}><span/> LIVE DATA OVERVIEW</div><h2>Smarter inventory.<br/><em>Clearer decisions.</em></h2><p>From incoming receipts to reorder intelligence — turn imperfect CSV transactions into a reliable ledger.</p><button type="button" onClick={() => navigate("imports")}>Import stock data <ArrowRight size={15}/></button></div><div className={styles.heroArt} aria-hidden="true"><Warehouse size={116} strokeWidth={1}/><span className={styles.heroCircle}/></div></div>
              <div className={styles.metrics}>{[
                { label: "Active stock items", value: dataset.items.length, extra: "Item master catalogue", icon: Package, tone: "blue" },
                { label: "Units on hand", value: model.grand, extra: "Across all warehouses", icon: Boxes, tone: "green" },
                { label: "Reorder alerts", value: model.low.length, extra: "Below stock threshold", icon: AlertCircle, tone: "orange" },
                { label: "Accepted movements", value: dataset.movements.length, extra: dataset.rejected.length + " rows rejected", icon: Activity, tone: "purple" },
              ].map((m, i) => <motion.article className={styles.metric} key={m.label} initial={reduceMotion ? false : { opacity:0, y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}><div className={styles.metricTop}><span>{m.label}</span><span className={styles.metricIcon} data-tone={m.tone}><m.icon size={19}/></span></div><strong>{num(m.value)}</strong><small>{m.extra}</small></motion.article>)}</div>
              <div className={styles.twoCol}>
                <Panel title="Movement activity" sub="Inbound and outbound quantity by month" action={<Badge variant="neutral"><CalendarDays size={12}/> All months</Badge>}>
                  <div className={styles.legend}><span><i className={styles.inColor}/> Stock in</span><span><i className={styles.outColor}/> Stock out</span></div>
                  {months.length ? <div className={styles.chart}>{months.map(([month, m]) => <div className={styles.chartGroup} key={month}><div className={styles.chartBars}><motion.div className={styles.barIn} initial={{height:0}} animate={{height: Math.max(3, m.in/maxMonthly*100)+"%"}} transition={{duration:reduceMotion ? 0 : .55}} title={"Received: "+num(m.in)}/><motion.div className={styles.barOut} initial={{height:0}} animate={{height:Math.max(3,m.out/maxMonthly*100)+"%"}} transition={{duration:reduceMotion ? 0 :.6}} title={"Dispatched: "+num(m.out)}/></div><span>{month.slice(5)} / {month.slice(2,4)}</span></div>)}</div>:<p className={styles.empty}>No movement history yet.</p>}
                </Panel>
                <Panel title="Reorder watchlist" sub="Items below their configured threshold" action={<Badge variant={model.low.length ? "warning" : "success"}>{model.low.length} alerts</Badge>}>
                  <div className={styles.alertList}>{model.low.length ? model.low.slice(0,5).map(i => <div className={styles.alertItem} key={i.code}><span className={styles.alertIcon}><AlertCircle size={16}/></span><div><strong>{i.name}</strong><small>{i.code} · Minimum {num(i.reorder)}</small></div><Badge variant="warning">{num(model.totals[i.code] || 0)} left</Badge></div>) : <div className={styles.allGood}><CircleCheck size={22}/> All items above reorder point</div>}</div>
                </Panel>
              </div>
              <Panel title="Recent accepted movements" sub="Validated transactions, latest first" action={<button className={styles.linkButton} onClick={() => navigate("movements")}>View all <ArrowRight size={14}/></button>}>
                <Table headers={["Date","Movement ID","Item","Warehouse","Type","Quantity"]} rows={rows.slice(0,6).map(m => [m.date, m.id, m.code, m.warehouse, <Badge key={m.id} variant={m.direction === "IN" ? "success" : "warning"}>{m.direction === "IN" ? <ArrowDownRight size={12}/> : <ArrowUpRight size={12}/>} {m.direction}</Badge>, num(m.qty)])}/>
              </Panel>
            </> : null}
            {tab === "inventory" ? <>
              <Panel title="Item catalogue" sub="Stock on hand is computed from accepted stock movements" action={<span className={styles.count}>{dataset.items.length} items</span>}>
                <div className={styles.filterRow}><div className={styles.search}><Search size={16}/><input aria-label="Search inventory" placeholder="Search product or SKU..." value={search} onChange={e => setSearch(e.target.value)}/></div><button type="button" className={styles.outlineButton} onClick={() => exportCSV("stockroom-inventory.csv",["Code","Name","UOM","Quantity","Reorder"],dataset.items.map(i=>[i.code,i.name,i.uom,model.totals[i.code]||0,i.reorder]))}><Download size={15}/> Export CSV</button></div>
                <Table headers={["Item code","Description","Unit","On hand","Reorder level","Status"]} rows={dataset.items.filter(i=>(i.code+" "+i.name).toLowerCase().includes(search.toLowerCase())).map(i => [<strong key={i.code}>{i.code}</strong>,i.name,i.uom,num(model.totals[i.code]||0),num(i.reorder),<Badge key={i.code} variant={(model.totals[i.code]||0)<i.reorder?"warning":"success"}>{(model.totals[i.code]||0)<i.reorder?"Reorder":"Healthy"}</Badge>])}/>
              </Panel>
              <div className={styles.spacer}/>
              <Panel title="Historical stock balance" sub="Review stock at any selected date">
                <div className={styles.lookup}><label>Choose item<select value={picked?.code||""} onChange={e=>setItemCode(e.target.value)}>{dataset.items.map(i=><option value={i.code} key={i.code}>{i.code} — {i.name}</option>)}</select></label><label>As of date<input type="date" value={asOf} onChange={e=>setAsOf(e.target.value)}/></label><div className={styles.lookupResult}><History size={21}/><span>Stock at date <strong>{num(history)} {picked?.uom||"units"}</strong></span></div></div>
              </Panel>
            </> : null}
            {tab === "movements" ? <Panel title="Movement register" sub="Validation rules are applied before transactions enter the ledger" action={<span className={styles.count}>{rows.length} matching</span>}>
              <div className={styles.filterRow}><div className={styles.search}><Search size={16}/><input aria-label="Search movements" placeholder="Find item, warehouse or reference..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></div><select aria-label="Movement direction" className={styles.select} value={direction} onChange={e=>{setDirection(e.target.value);setPage(1)}}><option value="ALL">All directions</option><option value="IN">Inbound</option><option value="OUT">Outbound</option></select><button type="button" className={styles.outlineButton} onClick={()=>exportCSV("stockroom-movements.csv",["ID","Date","Item","Warehouse","Direction","Qty","Reference"],rows.map(m=>[m.id,m.date,m.code,m.warehouse,m.direction,m.qty,m.reference]))}><Download size={15}/> Export</button></div>
              <Table headers={["ID","Date","Item code","Warehouse","Direction","Quantity","Reference"]} rows={pages.map(m => [m.id,m.date,<strong key={m.code}>{m.code}</strong>,m.warehouse,<Badge key={m.id} variant={m.direction==="IN"?"success":"warning"}>{m.direction}</Badge>,num(m.qty),m.reference])}/>
              <div className={styles.pagination}><span>Page {Math.min(page,totalPages)} of {totalPages}</span><div><button type="button" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page"><ChevronLeft size={16}/></button><button type="button" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} aria-label="Next page"><ChevronRight size={16}/></button></div></div>
            </Panel> : null}
            {tab === "reports" ? <>
              <div className={styles.reportCards}>{([
                ["stock_on_hand","Stock by warehouse","Quantity per item and location",Warehouse],
                ["below_reorder","Reorder intelligence","Items needing replenishment",AlertCircle],
                ["monthly_out","Monthly outbound","Monthly usage by stock item",BarChart3],
              ] as const).map(([id,title,sub,Icon])=><motion.button whileHover={reduceMotion?undefined:{y:-3}} key={id} type="button" onClick={()=>setReport(id)} className={styles.reportChoice} data-selected={report===id}><Icon size={20}/><strong>{title}</strong><span>{sub}</span>{report===id?<Check className={styles.reportCheck} size={16}/>:null}</motion.button>)}</div>
              <Panel title="Inventory report" sub="Reports calculated from the demonstration inventory records" action={<button className={styles.outlineButton} type="button" onClick={()=>exportCSV("stockroom-"+report+".csv",reportData.headers,reportData.raw)}><Download size={14}/> Export</button>}>
                <Table headers={reportData.headers} rows={reportData.raw.map(r => r.map(v=>typeof v==="number"?num(v):v))}/>
                <div className={styles.info}><Database size={17}/> Reports and totals reflect the sample inventory or files you import here. They are not connected to a live warehouse.</div>
              </Panel>
            </> : null}
            {tab === "imports" ? <>
              <div className={styles.twoCol}>
                <Panel title="Import CSV inventory" sub="Both files are required; imports replace your browser demo dataset">
                  <div className={styles.info}><CloudOff size={18}/> Your CSV is processed locally in this browser. Nothing is uploaded to a server.</div>
                  <div className={styles.fileFields}><label className={styles.uploadField}><FileText size={20}/><span><strong>{itemsFile?.name || "Choose items.csv"}</strong><small>Item catalogue with reorder levels</small></span><input type="file" accept=".csv,text/csv" aria-label="Items CSV" onChange={(e:ChangeEvent<HTMLInputElement>)=>setItemsFile(e.target.files?.[0]||null)}/></label><label className={styles.uploadField}><FileCheck2 size={20}/><span><strong>{movesFile?.name || "Choose movements.csv"}</strong><small>Incoming/outgoing stock transactions</small></span><input type="file" accept=".csv,text/csv" aria-label="Movements CSV" onChange={(e:ChangeEvent<HTMLInputElement>)=>setMovesFile(e.target.files?.[0]||null)}/></label></div>
                  <button className={styles.importButton} type="button" onClick={()=>void importFiles()}><UploadCloud size={17}/> Import and validate files</button>
                  {error ? <div role="alert" className={styles.error}><AlertCircle size={15}/>{error}</div>:null}
                  {notice ? <div role="status" className={styles.success}><CircleCheck size={15}/>{notice}</div>:null}
                </Panel>
                <Panel title="Validation priorities" sub="Rejected rows do not affect stock balances">
                  <div className={styles.rules}>{[
                    ["01","duplicate id","Only previously accepted IDs block a duplicate"],
                    ["02","bad date","Real ISO dates (YYYY-MM-DD) only"],
                    ["03","unknown item","Item must exist in the item master"],
                    ["04","missing warehouse","Warehouse must be provided"],
                    ["05","bad direction","IN and OUT movements only"],
                    ["06","bad qty","Positive decimal quantities required"],
                  ].map(([n,name,sub])=><div className={styles.rule} key={n}><span>{n}</span><div><strong>{name}</strong><small>{sub}</small></div><Check size={15}/></div>)}</div>
                </Panel>
              </div>
              <Panel title="Rejected movement audit" sub="Bad records are retained in a separate rejection list" action={<Badge variant={dataset.rejected.length?"warning":"success"}>{dataset.rejected.length} rejected</Badge>}>
                <Table headers={["Movement ID","Rejection reason"]} rows={dataset.rejected.map(x=>[<strong key={x.id}>{x.id}</strong>,<Badge key={x.reason} variant="danger">{x.reason}</Badge>])}/>
              </Panel>
            </> : null}
          </motion.div>
        </AnimatePresence>
        <footer className={styles.footer}><span>© 2026 Stockroom · Designed & developed by Bokang Jobe</span><span><ShieldCheck size={14}/> Interview sample · No client data · {ready ? "Local storage enabled" : "Loading saved data"}</span></footer>
      </main>
    </div>
    <nav className={styles.mobileNav} aria-label="Mobile workspace navigation">{nav.map(n=><button type="button" key={n.id} className={tab===n.id?styles.mobileActive:""} onClick={()=>navigate(n.id)}><n.icon size={19}/><span>{n.id==="imports"?"Import":n.name.split(" ")[0]}</span></button>)}</nav>
  </div>;
}
