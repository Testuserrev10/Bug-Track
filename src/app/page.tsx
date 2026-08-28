"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Bolt,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Copy,
  Filter,
  FolderKanban,
  Gauge,
  Hash,
  Inbox,
  Layers3,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { areaColors, people, seedBugs, severityColors } from "@/lib/mock-data";

const statuses = ["Open", "In Progress", "Blocked", "Resolved", "Closed"] as const;
const viewLabels = {
  overview: "Overview",
  explorer: "Bug explorer",
  kanban: "Kanban board",
  "my-work": "My work",
  reports: "Reports",
} as const;
type View = keyof typeof viewLabels;
type Bug = ReturnType<typeof seedBugs>[number];

type Toast = { id: number; message: string; tone?: "success" | "neutral" };

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const person = people.find((item) => item.name === name) ?? people[0];
  return <span className={`avatar ${small ? "avatar-small" : ""}`} style={{ background: person.color }} title={name}>{initials(name)}</span>;
}

function SeverityPill({ severity }: { severity: Bug["severity"] }) {
  const color = severityColors[severity];
  return <span className="severity-pill" style={{ color, borderColor: `${color}44`, background: `${color}12` }}><span className="severity-dot" style={{ background: color }} />{severity.replace(" · ", " ")}</span>;
}

function AreaPill({ area }: { area: Bug["area"] }) {
  return <span className="area-pill" style={{ color: areaColors[area], borderColor: `${areaColors[area]}40`, background: `${areaColors[area]}10` }}>{area}</span>;
}

function StatusPill({ status }: { status: Bug["status"] }) {
  return <span className={`status-pill status-${status.toLowerCase().replace(" ", "-")}`}><span className="status-dot" />{status}</span>;
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return <div className="mini-bar"><span style={{ width: `${Math.max(8, (value / max) * 100)}%`, background: color }} /></div>;
}

function Sparkline({ values, color = "#d7ff66" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${34 - ((value - min) / Math.max(1, max - min)) * 27}`).join(" ");
  return <svg className="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function RingChart({ segments, total }: { segments: { value: number; color: string }[]; total: number }) {
  const circumference = 2 * Math.PI * 38;
  const circles = segments.reduce<{ elements: React.ReactNode[]; offset: number }>((result, segment) => {
    const length = (segment.value / total) * circumference;
    result.elements.push(
      <circle
        key={`${segment.color}-${segment.value}`}
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={segment.color}
        strokeWidth="10"
        strokeDasharray={`${length} ${circumference - length}`}
        strokeDashoffset={-result.offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />,
    );
    return { elements: result.elements, offset: result.offset + length };
  }, { elements: [], offset: 0 });

  return <div className="ring-wrap"><svg viewBox="0 0 100 100" className="ring-chart"><circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />{circles.elements}</svg><div className="ring-label"><strong>{total}</strong><span>bugs</span></div></div>;
}

function TopBar({ view, onCreate, search, setSearch, onMenu }: { view: View; onCreate: () => void; search: string; setSearch: (value: string) => void; onMenu: () => void }) {
  return <header className="topbar"><button className="mobile-menu icon-button" onClick={onMenu} aria-label="Open navigation"><Menu size={18} /></button><div className="crumb"><span className="eyebrow">Workspace</span><ChevronRight size={14} /><span>{viewLabels[view]}</span></div><div className="topbar-actions"><div className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bugs, tags, people..." /><kbd>⌘ K</kbd></div><button className="icon-button hide-mobile" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button><button className="icon-button hide-mobile" aria-label="Settings"><Settings2 size={17} /></button><button className="create-button" onClick={onCreate}><Plus size={17} />Create bug</button></div></header>;
}

function Sidebar({ view, setView, open }: { view: View; setView: (view: View) => void; open: boolean }) {
  const nav = [{ id: "overview" as View, label: "Overview", icon: LayoutDashboard }, { id: "explorer" as View, label: "Bug explorer", icon: Inbox, count: 60 }, { id: "kanban" as View, label: "Kanban board", icon: Layers3 }, { id: "my-work" as View, label: "My work", icon: Target, count: 12 }, { id: "reports" as View, label: "Reports", icon: BarChart3 }];
  return <aside className={`sidebar ${open ? "sidebar-open" : ""}`}><div className="brand"><div className="brand-mark"><Bolt size={19} fill="currentColor" /></div><div><strong>quanta<span>qa</span></strong><small>quality intelligence</small></div><button className="sidebar-close icon-button" aria-label="Close navigation"><PanelLeftClose size={16} /></button></div><div className="workspace-select"><span className="workspace-avatar">NX</span><div><strong>Next Horizon</strong><small>Core workspace</small></div><ChevronDown size={15} /></div><nav className="main-nav"><span className="nav-label">Command center</span>{nav.map(({ id, label, icon: Icon, count }) => <button key={id} onClick={() => setView(id)} className={`nav-item ${view === id ? "active" : ""}`}><Icon size={17} /><span>{label}</span>{count && <em>{count}</em>}</button>)}</nav><div className="sidebar-section"><span className="nav-label">Saved views</span><button className="saved-view"><span className="saved-dot critical" />Critical bugs<em>8</em></button><button className="saved-view"><span className="saved-dot blocked" />Release blockers<em>5</em></button><button className="saved-view"><span className="saved-dot mine" />Assigned to me<em>12</em></button><button className="add-view"><Plus size={15} />New saved view</button></div><div className="sidebar-bottom"><div className="pulse-card"><div className="pulse-icon"><Sparkles size={15} /></div><div><strong>QA pulse</strong><span>Strong release health</span></div><span className="pulse-score">84</span></div><div className="user-row"><Avatar name="You" /><div><strong>Maya Chen</strong><span>QA Lead</span></div><MoreHorizontal size={17} /></div></div></aside>;
}

function KpiCard({ label, value, delta, icon: Icon, color, trend, onClick }: { label: string; value: number; delta: string; icon: typeof Activity; color: string; trend: number[]; onClick?: () => void }) {
  return <button className="kpi-card" onClick={onClick} style={{ "--accent": color } as React.CSSProperties}><div className="kpi-top"><span>{label}</span><span className="kpi-icon"><Icon size={16} /></span></div><div className="kpi-value">{value}</div><div className="kpi-footer"><span className="positive"><TrendingUp size={13} />{delta}</span><span>vs last week</span></div><Sparkline values={trend} color={color} /></button>;
}

function Dashboard({ bugs, onFilter }: { bugs: Bug[]; onFilter: (filter: string) => void }) {
  const total = bugs.length;
  const critical = bugs.filter((bug) => bug.severity === "P0 · Critical").length;
  const open = bugs.filter((bug) => bug.status === "Open" || bug.status === "In Progress").length;
  const resolved = bugs.filter((bug) => bug.status === "Resolved" || bug.status === "Closed").length;
  const blocked = bugs.filter((bug) => bug.status === "Blocked").length;
  const areaCounts = (['FE', 'BE', 'Both'] as const).map((area) => ({ area, value: bugs.filter((bug) => bug.area === area).length }));
  const severityCounts = (["P0 · Critical", "P1 · High", "P2 · Medium", "P3 · Low"] as const).map((severity) => ({ severity, value: bugs.filter((bug) => bug.severity === severity).length }));
  const assignees = people.slice(1, 5).map((person) => ({ ...person, count: bugs.filter((bug) => bug.assignee === person.name).length })).sort((a, b) => b.count - a.count);
  const tags = Object.entries(bugs.flatMap((bug) => bug.tags).reduce<Record<string, number>>((acc, tag) => ({ ...acc, [tag]: (acc[tag] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return <div className="view-content"><section className="hero-row"><div><div className="section-kicker"><span className="live-dot" />Live workspace · Updated just now</div><h1>Good morning, Maya<span className="title-star">✦</span></h1><p>Here’s the signal on your quality surface before the next release.</p></div><div className="hero-actions"><button className="secondary-button"><BookOpen size={15} />Release notes</button><button className="secondary-button"><Archive size={15} />Export report</button></div></section><section className="pulse-banner"><div className="pulse-orb"><Gauge size={24} /></div><div className="pulse-copy"><span>Today&apos;s QA pulse</span><strong>Release health is looking <i>strong</i></strong><p>11 bugs need attention across Horizon. Two critical paths are still open.</p></div><div className="pulse-metrics"><div><strong>84<span>%</span></strong><span>health score</span></div><div><strong>2.4<span>d</span></strong><span>avg resolution</span></div><div><strong>92<span>%</span></strong><span>verified</span></div></div><div className="pulse-spark"><Sparkline values={[22, 28, 25, 34, 31, 39, 43, 48, 47]} color="#d7ff66" /></div></section><div className="kpi-grid"><KpiCard label="Total bugs" value={total} delta="12.4%" icon={CircleDot} color="#d7ff66" trend={[38, 42, 40, 48, 45, 53, 51, 60]} onClick={() => onFilter("all")} /><KpiCard label="Critical bugs" value={critical} delta="8.2%" icon={Bolt} color="#ff6b7a" trend={[20, 24, 22, 29, 24, 27, 25, 20]} onClick={() => onFilter("critical")} /><KpiCard label="Open bugs" value={open} delta="4.6%" icon={Inbox} color="#b5a6ff" trend={[52, 48, 50, 54, 48, 46, 42, 45]} onClick={() => onFilter("open")} /><KpiCard label="Resolved" value={resolved} delta="18.9%" icon={CheckCircle2} color="#70e1d4" trend={[18, 22, 26, 25, 31, 33, 39, 46]} onClick={() => onFilter("resolved")} /><KpiCard label="Blocked" value={blocked} delta="2.1%" icon={Target} color="#ffb86b" trend={[10, 12, 11, 15, 13, 11, 14, 12]} onClick={() => onFilter("blocked")} /></div><div className="dashboard-grid"><section className="panel trend-panel"><div className="panel-header"><div><span className="panel-label">Flow over time</span><h2>Bugs created vs resolved</h2></div><button className="select-button">Last 30 days <ChevronDown size={14} /></button></div><div className="legend"><span><i style={{ background: "#d7ff66" }} />Created</span><span><i style={{ background: "#b5a6ff" }} />Resolved</span><span className="legend-note">Today <strong>+8.4%</strong></span></div><div className="chart-area"><div className="y-axis"><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="chart-lines"><div className="grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 600 170" preserveAspectRatio="none"><defs><linearGradient id="areaLime" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d7ff66" stopOpacity=".25" /><stop offset="1" stopColor="#d7ff66" stopOpacity="0" /></linearGradient><linearGradient id="areaViolet" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b5a6ff" stopOpacity=".2" /><stop offset="1" stopColor="#b5a6ff" stopOpacity="0" /></linearGradient></defs><path d="M0 135 C45 122 55 126 88 108 S135 112 163 88 S205 101 238 75 S282 102 315 68 S362 85 395 55 S438 74 468 42 S525 55 600 25 L600 170 L0 170 Z" fill="url(#areaLime)" /><path d="M0 150 C48 144 67 150 98 132 S155 137 183 119 S225 132 258 111 S312 123 342 104 S390 112 425 92 S471 104 503 78 S558 87 600 65 L600 170 L0 170 Z" fill="url(#areaViolet)" /><path d="M0 135 C45 122 55 126 88 108 S135 112 163 88 S205 101 238 75 S282 102 315 68 S362 85 395 55 S438 74 468 42 S525 55 600 25" fill="none" stroke="#d7ff66" strokeWidth="3" /><path d="M0 150 C48 144 67 150 98 132 S155 137 183 119 S225 132 258 111 S312 123 342 104 S390 112 425 92 S471 104 503 78 S558 87 600 65" fill="none" stroke="#b5a6ff" strokeWidth="3" /></svg><div className="x-axis"><span>01 Aug</span><span>08 Aug</span><span>15 Aug</span><span>22 Aug</span><span>29 Aug</span></div></div></div></section><section className="panel area-panel"><div className="panel-header"><div><span className="panel-label">Surface ownership</span><h2>Where bugs live</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="area-content"><RingChart segments={areaCounts.map(({ area, value }) => ({ value, color: areaColors[area] }))} total={total} /><div className="area-legend">{areaCounts.map(({ area, value }) => <button key={area} onClick={() => onFilter(area)}><span><i style={{ background: areaColors[area] }} />{area === "Both" ? "FE + BE" : `${area} only`}</span><strong>{value}<small>{Math.round((value / total) * 100)}%</small></strong></button>)}</div></div><div className="panel-footnote"><TrendingUp size={14} />BE ownership rose <strong>14%</strong> this week</div></section><section className="panel severity-panel"><div className="panel-header"><div><span className="panel-label">Risk profile</span><h2>Severity distribution</h2></div><button className="text-button" onClick={() => onFilter("critical")}>View all <ArrowUp size={13} /></button></div><div className="severity-list">{severityCounts.map(({ severity, value }) => <button key={severity} onClick={() => onFilter(severity)} className="severity-row"><span className="severity-name"><i style={{ background: severityColors[severity] }} />{severity}</span><MiniBar value={value} max={Math.max(...severityCounts.map((item) => item.value))} color={severityColors[severity]} /><strong>{value}</strong></button>)}</div></section><section className="panel assignee-panel"><div className="panel-header"><div><span className="panel-label">Ownership load</span><h2>Bugs by assignee</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="assignee-list">{assignees.map((person) => <button key={person.name} onClick={() => onFilter(person.name)} className="assignee-row"><Avatar name={person.name} small /><span>{person.name}</span><MiniBar value={person.count} max={Math.max(...assignees.map((item) => item.count))} color={person.color} /><strong>{person.count}</strong></button>)}</div></section><section className="panel tags-panel"><div className="panel-header"><div><span className="panel-label">Signal clusters</span><h2>Top tags</h2></div><Tag size={17} className="muted-icon" /></div><div className="tag-cloud">{tags.map(([tag, count]) => <button key={tag} onClick={() => onFilter(tag)}><Hash size={13} />{tag}<em>{count}</em></button>)}</div></section><section className="panel activity-panel"><div className="panel-header"><div><span className="panel-label">Live feed</span><h2>Recent activity</h2></div><button className="text-button">View stream <ChevronRight size={13} /></button></div><div className="activity-list">{bugs.slice(0, 4).map((bug) => <div key={bug.id} className="activity-row"><Avatar name={bug.assignee} small /><div><p><strong>{bug.assignee}</strong> moved <b>{bug.id}</b> to <StatusPill status={bug.status} /></p><span>{bug.title}</span></div><time>{bug.age}h</time></div>)}</div></section></div></div>;
}

function BugExplorer({ bugs, selectedId, onSelect, onUpdate, onCreate }: { bugs: Bug[]; selectedId: string | null; onSelect: (bug: Bug) => void; onUpdate: (id: string, patch: Partial<Bug>) => void; onCreate: () => void }) {
  const [filter, setFilter] = useState("All bugs");
  const [sort, setSort] = useState<"age" | "severity" | "created">("age");
  const filters = ["All bugs", "My bugs", "Critical", "FE", "BE", "Blocked", "Recently created", "Overdue"];
  const filtered = useMemo(() => { const list = bugs.filter((bug) => filter === "All bugs" || (filter === "My bugs" && bug.assignee === "You") || (filter === "Critical" && bug.severity === "P0 · Critical") || (filter === bug.area) || (filter === "Blocked" && bug.status === "Blocked") || (filter === "Recently created" && bug.age < 8) || (filter === "Overdue" && new Date(bug.dueDate) < new Date())); return [...list].sort((a, b) => sort === "severity" ? a.severity.localeCompare(b.severity) : sort === "created" ? b.createdAt.localeCompare(a.createdAt) : b.age - a.age); }, [bugs, filter, sort]);
  return <div className="view-content explorer-view"><section className="page-heading"><div><div className="section-kicker"><ListFilter size={14} />Triage workspace</div><h1>Bug explorer</h1><p>Make the next best decision with the full quality surface in view.</p></div><button className="create-button" onClick={onCreate}><Plus size={17} />Create bug</button></section><div className="explorer-toolbar"><div className="filter-chips">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "chip-active" : ""}>{item}{item === "Critical" && <em>8</em>}</button>)}</div><div className="toolbar-actions"><button className="secondary-button"><Filter size={15} />Filters <span className="filter-count">2</span></button><select className="select-button" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="age">Sort: Age</option><option value="severity">Sort: Severity</option><option value="created">Sort: Newest</option></select></div></div><section className="panel table-panel"><div className="table-summary"><span><strong>{filtered.length}</strong> bugs in <strong>{filter}</strong></span><div><button className="text-button"><Users size={14} />Bulk assign</button><button className="icon-button"><MoreHorizontal size={17} /></button></div></div><div className="bug-table"><div className="table-head"><span>Bug</span><span>Area</span><span>Status</span><span>Assignee</span><span>Age</span><span /></div>{filtered.slice(0, 16).map((bug) => <article key={bug.id} className={`bug-row ${selectedId === bug.id ? "row-selected" : ""}`} onClick={() => onSelect(bug)}><div className="bug-title-cell"><span className="bug-id">{bug.id}</span><strong>{bug.title}</strong><div className="bug-tags">{bug.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div><AreaPill area={bug.area} /><button className="inline-select" onClick={(event) => { event.stopPropagation(); const next = statuses[(statuses.indexOf(bug.status) + 1) % statuses.length]; onUpdate(bug.id, { status: next }); }}><StatusPill status={bug.status} /></button><div className="assignee-cell"><Avatar name={bug.assignee} small /><span>{bug.assignee}</span></div><div className="age-cell"><span className={bug.age > 30 ? "age-warning" : ""}>{bug.age}d</span><SeverityPill severity={bug.severity} /></div><button className="row-more icon-button" onClick={(event) => event.stopPropagation()}><MoreHorizontal size={16} /></button></article>)}</div><div className="table-footer"><span>Showing {Math.min(filtered.length, 16)} of {filtered.length}</span><div><button className="icon-button"><ArrowDown size={15} /></button><button className="icon-button"><ArrowUp size={15} /></button></div></div></section></div>;
}

function Kanban({ bugs, onUpdate, onSelect }: { bugs: Bug[]; onUpdate: (id: string, patch: Partial<Bug>) => void; onSelect: (bug: Bug) => void }) {
  const [dragged, setDragged] = useState<string | null>(null);
  return <div className="view-content"><section className="page-heading"><div><div className="section-kicker"><Layers3 size={14} />Visual workflow</div><h1>Kanban board</h1><p>Move the work forward. Drag a card to update its status.</p></div><div className="board-actions"><button className="secondary-button"><Filter size={15} />Filter board</button><button className="secondary-button"><Users size={15} />Swimlanes</button></div></section><div className="kanban-board">{statuses.map((status) => { const columnBugs = bugs.filter((bug) => bug.status === status); return <section key={status} className="kanban-column" onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged) onUpdate(dragged, { status }); setDragged(null); }}><div className="column-header"><span><i className={`column-dot column-${status.toLowerCase().replace(" ", "-")}`} />{status}</span><em>{columnBugs.length}</em><MoreHorizontal size={16} /></div><div className="column-cards">{columnBugs.slice(0, 8).map((bug) => <article key={bug.id} draggable onDragStart={() => setDragged(bug.id)} onClick={() => onSelect(bug)} className="kanban-card"><div className="card-top"><span className="bug-id">{bug.id}</span><SeverityPill severity={bug.severity} /></div><h3>{bug.title}</h3><div className="bug-tags">{bug.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="card-bottom"><AreaPill area={bug.area} /><Avatar name={bug.assignee} small /></div></article>)}</div><button className="column-add"><Plus size={14} />Add bug</button></section>; })}</div></div>;
}

function Reports({ bugs, onFilter }: { bugs: Bug[]; onFilter: (value: string) => void }) {
  const releases = Array.from(new Set(bugs.map((bug) => bug.release))).map((release) => ({ release, total: bugs.filter((bug) => bug.release === release).length, resolved: bugs.filter((bug) => bug.release === release && (bug.status === "Resolved" || bug.status === "Closed")).length }));
  return <div className="view-content"><section className="page-heading"><div><div className="section-kicker"><BarChart3 size={14} />Quality intelligence</div><h1>Reports</h1><p>Turn bug activity into a confident release narrative.</p></div><button className="secondary-button"><Archive size={15} />Export report</button></section><div className="report-grid"><section className="panel report-hero"><div className="panel-header"><div><span className="panel-label">Release velocity</span><h2>Resolution time</h2></div><span className="report-badge"><TrendingUp size={13} />22% faster</span></div><div className="big-number">2.4<span>days</span></div><Sparkline values={[6, 5.8, 5.2, 5.5, 4.2, 3.8, 3.1, 2.4]} color="#70e1d4" /><div className="report-caption"><span>Average time from open → resolved</span><strong>Target 3.0d</strong></div></section><section className="panel report-trend"><div className="panel-header"><div><span className="panel-label">Ownership trend</span><h2>FE vs BE</h2></div><button className="select-button">Last 90 days <ChevronDown size={14} /></button></div><div className="dual-bars">{["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"].map((label, index) => <div key={label} className="dual-bar"><div className="bar-stack"><i style={{ height: `${38 + index * 7}px`, background: "#d7ff66" }} /><i style={{ height: `${30 + (5 - index) * 7}px`, background: "#b5a6ff" }} /></div><span>{label}</span></div>)}</div><div className="legend report-legend"><span><i style={{ background: "#d7ff66" }} />FE</span><span><i style={{ background: "#b5a6ff" }} />BE</span></div></section><section className="panel release-panel"><div className="panel-header"><div><span className="panel-label">Ship confidence</span><h2>Bugs by release</h2></div><button className="text-button">All releases <ChevronRight size={13} /></button></div><div className="release-list">{releases.map(({ release, total, resolved }) => <button key={release} onClick={() => onFilter(release)} className="release-row"><span className="release-name"><span className="release-icon"><FolderKanban size={15} /></span><span><strong>{release.split(" · ")[1]}</strong><small>{release.split(" · ")[0]}</small></span></span><div><MiniBar value={resolved} max={total} color="#70e1d4" /><small>{resolved}/{total} resolved</small></div><ChevronRight size={14} /></button>)}</div></section><section className="panel aging-panel"><div className="panel-header"><div><span className="panel-label">Time in system</span><h2>Bug aging</h2></div><ClockIcon /></div><div className="aging-grid"><div><strong>0–7d</strong><span>{bugs.filter((bug) => bug.age <= 7).length}</span><i style={{ width: "82%" }} /></div><div><strong>8–21d</strong><span>{bugs.filter((bug) => bug.age > 7 && bug.age <= 21).length}</span><i style={{ width: "58%" }} /></div><div><strong>22–45d</strong><span>{bugs.filter((bug) => bug.age > 21).length}</span><i style={{ width: "32%" }} /></div></div></section></div></div>;
}
function ClockIcon() { return <Activity size={17} className="muted-icon" />; }

function MyWork({ bugs, onSelect }: { bugs: Bug[]; onSelect: (bug: Bug) => void }) {
  const mine = bugs.filter((bug) => bug.assignee === "You");
  return <div className="view-content"><section className="page-heading"><div><div className="section-kicker"><UserRound size={14} />Personal cockpit</div><h1>My work</h1><p>A focused view of what needs your attention next.</p></div><div className="work-avatar"><Avatar name="You" /></div></section><div className="work-grid"><section className="panel workload-card"><div className="panel-header"><div><span className="panel-label">Your workload</span><h2>12 active bugs</h2></div><span className="workload-score">68%</span></div><div className="workload-ring"><RingChart segments={[{ value: 7, color: "#d7ff66" }, { value: 3, color: "#ffb86b" }, { value: 2, color: "#b5a6ff" }]} total={12} /><div><strong>Healthy load</strong><p>2 critical bugs need your eyes today.</p></div></div><div className="workload-bars"><span><i>Open</i><b style={{ width: "70%", background: "#b5a6ff" }} />7</span><span><i>Blocked</i><b style={{ width: "28%", background: "#ffb86b" }} />3</span><span><i>Verifying</i><b style={{ width: "18%", background: "#70e1d4" }} />2</span></div></section><section className="panel attention-card"><div className="panel-header"><div><span className="panel-label">Priority queue</span><h2>Needs attention</h2></div><Bolt size={17} className="muted-icon" /></div>{mine.slice(0, 4).map((bug) => <button key={bug.id} className="attention-row" onClick={() => onSelect(bug)}><SeverityPill severity={bug.severity} /><span><strong>{bug.id}</strong>{bug.title}</span><ChevronRight size={15} /></button>)}</section><section className="panel assigned-card"><div className="panel-header"><div><span className="panel-label">Assigned to you</span><h2>Keep moving</h2></div><button className="text-button">See all <ChevronRight size={13} /></button></div><div className="assigned-list">{mine.slice(4, 9).map((bug) => <button key={bug.id} onClick={() => onSelect(bug)}><span className="bug-id">{bug.id}</span><span>{bug.title}</span><StatusPill status={bug.status} /></button>)}</div></section></div></div>;
}

function BugDrawer({ bug, onClose, onUpdate, onDelete }: { bug: Bug; onClose: () => void; onUpdate: (id: string, patch: Partial<Bug>) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState("");
  return <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside className="bug-drawer"><div className="drawer-header"><div><span className="bug-id">{bug.id}</span><span className="drawer-updated">Updated {bug.age}h ago</span></div><div><button className="icon-button" aria-label="Copy bug ID"><Copy size={16} /></button><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={17} /></button></div></div><div className="drawer-title"><div className="drawer-title-row"><SeverityPill severity={bug.severity} /><AreaPill area={bug.area} /><button className="inline-select" onClick={() => onUpdate(bug.id, { status: statuses[(statuses.indexOf(bug.status) + 1) % statuses.length] })}><StatusPill status={bug.status} /></button></div>{editing ? <input className="title-input" defaultValue={bug.title} onBlur={(event) => { onUpdate(bug.id, { title: event.target.value }); setEditing(false); }} autoFocus /> : <h2 onDoubleClick={() => setEditing(true)}>{bug.title}</h2>}<p className="drawer-description">{bug.description}</p></div><div className="drawer-meta"><div><span>Assignee</span><button onClick={() => onUpdate(bug.id, { assignee: bug.assignee === "You" ? "Maya Chen" : "You" })}><Avatar name={bug.assignee} small />{bug.assignee}<ChevronDown size={13} /></button></div><div><span>Priority</span><button onClick={() => onUpdate(bug.id, { priority: bug.priority === "Urgent" ? "High" : "Urgent" })}><Bolt size={14} />{bug.priority}<ChevronDown size={13} /></button></div><div><span>Release</span><button><FolderKanban size={14} />{bug.release.split(" · ")[1]}<ChevronDown size={13} /></button></div><div><span>Environment</span><button><CircleDot size={14} />{bug.environment}<ChevronDown size={13} /></button></div></div><div className="drawer-section"><div className="drawer-section-title"><h3>Reproduction</h3><span>3 steps</span></div><ol className="steps-list">{bug.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol></div><div className="compare-grid"><div><span>Expected result</span><p>{bug.expected}</p></div><div><span>Actual result</span><p>{bug.actual}</p></div></div><div className="drawer-section"><div className="drawer-section-title"><h3>Activity</h3><span>{bug.activity.length + 1} events</span></div><div className="timeline">{bug.activity.map((item) => <div key={`${item.time}-${item.text}`}><span className="timeline-line" /><Avatar name={bug.assignee} small /><div><p>{item.text}</p><time>{item.time}</time></div></div>)}</div><div className="comment-box"><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a note for the team..." /><div><span>{comment.length}/280</span><button className="small-button" disabled={!comment.trim()} onClick={() => { setComment(""); }}>Comment <ArrowUp size={13} /></button></div></div></div><div className="drawer-footer"><button className="danger-button" onClick={() => onDelete(bug.id)}><Trash2 size={15} />Delete bug</button><button className="primary-button" onClick={() => setEditing(true)}>Edit details <ChevronRight size={15} /></button></div></aside></div>;
}

function BugModal({ onClose, onSave }: { onClose: () => void; onSave: (bug: Bug) => void }) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState<Bug["area"]>("FE");
  const [severity, setSeverity] = useState<Bug["severity"]>("P2 · Medium");
  const [description, setDescription] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  // Hydrate the editor only after mounting so draft data never enters server markup.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const draft = localStorage.getItem("quanta-draft"); if (draft) { const parsed = JSON.parse(draft) as { title?: string; description?: string }; setTitle(parsed.title ?? ""); setDescription(parsed.description ?? ""); } }, []);
  // Persist draft changes and briefly surface the saved state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { localStorage.setItem("quanta-draft", JSON.stringify({ title, description })); setDraftSaved(true); const timeout = setTimeout(() => setDraftSaved(false), 1200); return () => clearTimeout(timeout); }, [title, description]);
  const save = () => { if (!title.trim()) return; const now = new Date().toISOString(); const assignee = people[0].name; onSave({ id: `BUG-${Math.floor(2000 + Math.random() * 100)}`, title, description: description || "No description provided yet.", steps: ["Open the affected workspace", "Repeat the reported flow", "Observe the result"], expected: "The workflow completes as expected.", actual: "The workflow does not complete as expected.", severity, priority: severity === "P0 · Critical" ? "Urgent" : "Medium", area, status: "Open", assignee, reporter: "You", tags: ["needs-triage"], environment: "Staging", browser: "Chrome 128 / macOS", release: "v2.9.0 · Canary", dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), createdAt: now, updatedAt: now, age: 0, activity: [{ text: "Created this bug", time: "just now", initials: "YU" }] }); localStorage.removeItem("quanta-draft"); };
  return <div className="modal-backdrop"><section className="bug-modal"><div className="modal-header"><div><span className="section-kicker"><Sparkles size={14} />Quick capture</span><h2>New bug report</h2><p>Give the team enough signal to act without a meeting.</p></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="modal-body"><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What went wrong?" autoFocus /><span className="char-count">{title.length}/120</span></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the impact and what you observed..." /><span className="char-count">{description.length}/600</span></label><div className="form-grid"><label>Area<select value={area} onChange={(event) => setArea(event.target.value as Bug["area"])}><option>FE</option><option>BE</option><option>Both</option></select></label><label>Severity<select value={severity} onChange={(event) => setSeverity(event.target.value as Bug["severity"])}><option>P0 · Critical</option><option>P1 · High</option><option>P2 · Medium</option><option>P3 · Low</option></select></label><label>Environment<select><option>Staging</option><option>Production</option><option>Preview</option></select></label><label>Release<select><option>v2.9.0 · Canary</option><option>v2.8.0 · Horizon</option></select></label></div><div className="form-helper"><span><Check size={14} /> Draft saved automatically</span>{draftSaved && <em>just now</em>}</div></div><div className="modal-footer"><button className="secondary-button" onClick={onClose}>Cancel <kbd>Esc</kbd></button><button className="create-button" onClick={save} disabled={!title.trim()}><Plus size={16} />Create bug <kbd>⌘ ↵</kbd></button></div></section></div>;
}

export default function Home() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [view, setView] = useState<View>("overview");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Bug | null>(null);
  const [modal, setModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Hydrate persisted bugs after mounting to keep server and client markup aligned.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const saved = localStorage.getItem("quanta-bugs"); setBugs(saved ? JSON.parse(saved) as Bug[] : seedBugs()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("quanta-bugs", JSON.stringify(bugs)); }, [bugs, hydrated]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.querySelector<HTMLInputElement>(".search-box input")?.focus(); } if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); setModal(true); } if (event.key === "Escape") { setModal(false); setSelected(null); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
  const notify = (message: string, tone: Toast["tone"] = "success") => { const id = Date.now(); setToasts((current) => [...current, { id, message, tone }]); setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200); };
  const updateBug = (id: string, patch: Partial<Bug>) => { setBugs((current) => current.map((bug) => bug.id === id ? { ...bug, ...patch, updatedAt: new Date().toISOString() } : bug)); setSelected((current) => current?.id === id ? { ...current, ...patch } : current); notify("Bug updated · the workspace is in sync"); };
  const deleteBug = (id: string) => { setBugs((current) => current.filter((bug) => bug.id !== id)); setSelected(null); notify("Bug deleted · press undo to restore", "neutral"); };
  const drill = (filter: string) => { setView("explorer"); setSearch(filter); notify(`Explorer filtered to ${filter}`); };
  const filteredBugs = search ? bugs.filter((bug) => `${bug.id} ${bug.title} ${bug.tags.join(" ")} ${bug.assignee} ${bug.area}`.toLowerCase().includes(search.toLowerCase())) : bugs;
  const addBug = (bug: Bug) => { setBugs((current) => [bug, ...current]); setModal(false); notify("Bug created · triage signal added"); };
  return <main className="app-shell"><Sidebar view={view} setView={setView} open={sidebarOpen} /><div className="main-area"><TopBar view={view} onCreate={() => setModal(true)} search={search} setSearch={setSearch} onMenu={() => setSidebarOpen(true)} />{!hydrated ? <div className="loading-state"><div className="loading-orb" /><span>Calibrating quality signal...</span></div> : view === "overview" ? <Dashboard bugs={filteredBugs} onFilter={drill} /> : view === "explorer" ? <BugExplorer bugs={filteredBugs} selectedId={selected?.id ?? null} onSelect={setSelected} onUpdate={updateBug} onCreate={() => setModal(true)} /> : view === "kanban" ? <Kanban bugs={filteredBugs} onUpdate={updateBug} onSelect={setSelected} /> : view === "my-work" ? <MyWork bugs={filteredBugs} onSelect={setSelected} /> : <Reports bugs={filteredBugs} onFilter={drill} />}</div>{selected && <BugDrawer bug={selected} onClose={() => setSelected(null)} onUpdate={updateBug} onDelete={deleteBug} />}{modal && <BugModal onClose={() => setModal(false)} onSave={addBug} />}<div className="toast-stack">{toasts.map((toast) => <div key={toast.id} className={`toast toast-${toast.tone}`}><span>{toast.tone === "neutral" ? <Archive size={15} /> : <CheckCircle2 size={15} />}</span>{toast.message}<button onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}><X size={14} /></button></div>)}</div></main>;
}
