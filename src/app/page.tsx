'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Activity, AlertCircle, AlertTriangle, Anchor, ArrowDownRight, ArrowUpRight, Bell, Bot, Boxes, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Compass, Container, Download, Eye, FileSpreadsheet, FileText, Filter, Gauge, GitBranch, Globe, Info, Layers3, LayoutDashboard, MapPin, Maximize2, Menu, Minimize2, MoreHorizontal, Moon, Navigation, PackageCheck, Plus, RefreshCw, RotateCcw, Route, Search, Settings2, Ship, SlidersHorizontal, Sparkles, Sun, TrendingUp, Users, X, Zap, ZoomIn, ZoomOut,
} from 'lucide-react'

type PageKey = 'Dashboard' | 'Vessels' | 'Berths' | 'Cranes' | 'Congestion' | '72h Plan' | 'Alerts'

type Crane = {
  id: string
  name: string
  type: string
  location: string
  status: 'Active' | 'High Load' | 'Critical Load' | 'Maintenance'
  utilization: number
  movesPerHour: number
  assignedVessel: string
  healthTemp: string
  maintenanceDue: string
  operator: string
  description: string
}

type AlertItem = {
  id: string
  title: string
  category: 'Berth Conflict' | 'Yard Congestion' | 'Equipment' | 'Weather'
  severity: 'Critical' | 'Warning' | 'Info'
  location: string
  timestamp: string
  impact: string
  recommendation: string
}

const cranesData: Crane[] = [
  {
    id: 'CRN-Q04',
    name: 'Gantry Crane Q-04',
    type: 'Liebherr Super Post-Panamax STS',
    location: 'Pier A (Berth A-04)',
    status: 'High Load',
    utilization: 88,
    movesPerHour: 36,
    assignedVessel: 'Ever Given (1,400 TEU load)',
    healthTemp: '76°C (Optimal)',
    maintenanceDue: 'In 4 hours (Team Alpha)',
    operator: 'Gang #4 · Lead: M. Rodriguez',
    description: 'Operating at high cycle speed discharging heavy container stacks. Electrical hoist inspection scheduled for next shift handover.',
  },
  {
    id: 'YRD-WEST',
    name: 'West Yard Stack',
    type: 'High-Density Rubber-Tired Gantry (RTG) Yard Zone',
    location: 'West Terminal Yard Block 7',
    status: 'Critical Load',
    utilization: 91,
    movesPerHour: 42,
    assignedVessel: 'Evergreen & MSC Buffer Overflow',
    healthTemp: 'High Gate Dwell (48 min)',
    maintenanceDue: 'Continuous 24/7 Operations',
    operator: 'Yard Shift Team 1',
    description: 'Yard saturation at 91% capacity. Immediate deployment of 2 supplementary RTG cranes recommended to prevent gate queue congestion.',
  },
  {
    id: 'CRN-Q11',
    name: 'Gantry Crane Q-11',
    type: 'ZPMC Dual-Trolley STS Crane',
    location: 'Pier B (Berth B-12)',
    status: 'Critical Load',
    utilization: 94,
    movesPerHour: 38,
    assignedVessel: 'MSC Irina (Direct Discharge)',
    healthTemp: '81°C (Warm)',
    maintenanceDue: 'In 18 hours',
    operator: 'Gang #2 · Lead: K. Chen',
    description: 'Allocated to MSC Irina turnaround. Handling heavy 40ft refrigerated containers with peak twin-lift cycle efficiency.',
  },
  {
    id: 'YRD-NORTH',
    name: 'North Yard Stack',
    type: 'Automated Stacking Crane (ASC) Intermodal Grid',
    location: 'North Rail Corridor',
    status: 'Active',
    utilization: 73,
    movesPerHour: 28,
    assignedVessel: 'Intermodal Rail Feeders',
    healthTemp: '68°C (Nominal)',
    maintenanceDue: 'In 36 hours',
    operator: 'Automated Remote Station 3',
    description: 'Standard container throughput feeding Alameda Rail Corridor trains. Dwell time stable at 24.2 hours.',
  },
  {
    id: 'CRN-Q07',
    name: 'Gantry Crane Q-07',
    type: 'Konecranes Noell STS 65T',
    location: 'Pier C (Deepwater Slip)',
    status: 'Active',
    utilization: 65,
    movesPerHour: 32,
    assignedVessel: 'CMA CGM Marco Polo',
    healthTemp: '69°C (Normal)',
    maintenanceDue: 'In 48 hours',
    operator: 'Gang #5 · Lead: D. Larson',
    description: 'Deepwater container terminal operations. Hoist and trolley hydraulics in perfect condition.',
  },
  {
    id: 'CRN-RTG03',
    name: 'RTG Transporter RTG-03',
    type: 'Kalmar Hybrid RTG Crane',
    location: 'Terminal Yard Stack C2',
    status: 'Active',
    utilization: 58,
    movesPerHour: 24,
    assignedVessel: 'General Yard Shuffle',
    healthTemp: '65°C (Eco-Mode)',
    maintenanceDue: 'In 72 hours',
    operator: 'Operator: J. Morales',
    description: 'Hybrid electric yard crane operating on low emission mode for local container shuffling and gate dispatch.',
  },
]

const alertsData: AlertItem[] = [
  {
    id: 'ALT-101',
    title: 'Critical Berth Conflict: MSC Irina at Berth B-12',
    category: 'Berth Conflict',
    severity: 'Critical',
    location: 'Berth B-12 (Pier B)',
    timestamp: '10 mins ago',
    impact: 'Estimated 14 hours queue delay and $340,000 demurrage penalty.',
    recommendation: 'Divert upcoming arrival to Pier 400 dedicated fast-track buffer window.',
  },
  {
    id: 'ALT-102',
    title: 'Yard Capacity Threshold Exceeded: West Yard Stack (91%)',
    category: 'Yard Congestion',
    severity: 'Critical',
    location: 'West Yard Stack Block 7',
    timestamp: '25 mins ago',
    impact: 'Dwell time increasing by 45 mins per truck turnaround.',
    recommendation: 'Allocate 2 supplementary RTG units and open auxiliary gate lanes 5 & 6.',
  },
  {
    id: 'ALT-103',
    title: 'Peak Congestion Wave Predicted at 12:00 PM (Index 8.7)',
    category: 'Yard Congestion',
    severity: 'Critical',
    location: 'Port of LA/LB Main Fairway',
    timestamp: '1 hour ago',
    impact: '14 vessels arriving simultaneously causing anchorage bottleneck.',
    recommendation: 'Pre-clear outbound container trains and initiate night-shift crane gang call-up.',
  },
  {
    id: 'ALT-104',
    title: 'Preventative Maintenance Due on Gantry Crane Q-04',
    category: 'Equipment',
    severity: 'Warning',
    location: 'Pier A (Berth A-04)',
    timestamp: '2 hours ago',
    impact: 'Hoist motor duty cycle limit reached in 4 hours.',
    recommendation: 'Schedule 45-min service window during Shift 1 to Shift 2 handover.',
  },
  {
    id: 'ALT-105',
    title: 'Reefer Power Grid Saturation at Pier C',
    category: 'Equipment',
    severity: 'Warning',
    location: 'Pier C Reefer Zone',
    timestamp: '3 hours ago',
    impact: 'Power load at 86% of transformer capacity.',
    recommendation: 'Activate secondary diesel generator substation before 14:00.',
  },
  {
    id: 'ALT-106',
    title: 'High Tidal Surge & Wind Advisory for Outer Anchorage',
    category: 'Weather',
    severity: 'Info',
    location: 'Outer Anchorage Alpha',
    timestamp: '4 hours ago',
    impact: 'Vessel pilot boarding may experience 15-min weather delay.',
    recommendation: 'Tug assistance required for inbound ultra-large container vessels.',
  },
]

type Vessel = {
  name: string
  imo: string
  line: string
  eta: string
  status: 'Anchored' | 'Inbound' | 'Berthed' | 'Scheduled'
  risk: 'Critical' | 'High' | 'Medium' | 'Low'
  teu: string
  berth: string
  cranesAssigned: number
  alternateBerth?: string
  waitSavingsHours?: number
}

const INITIAL_VESSELS: Vessel[] = [
  { name: 'Ever Given', imo: 'IMO 9811000', line: 'Evergreen Line', eta: 'Today, 14:30', status: 'Anchored', risk: 'Critical', teu: '20,124', berth: 'Berth B3 (Pier A)', cranesAssigned: 4, alternateBerth: 'Berth B1', waitSavingsHours: 18 },
  { name: 'MSC Irina', imo: 'IMO 9929429', line: 'MSC Mediterranean', eta: 'Today, 18:00', status: 'Inbound', risk: 'High', teu: '24,346', berth: 'Berth B2 (Pier B)', cranesAssigned: 5, alternateBerth: 'Pier 400', waitSavingsHours: 14 },
  { name: 'CMA CGM Marco Polo', imo: 'IMO 9454436', line: 'CMA CGM', eta: 'Tomorrow, 06:45', status: 'Inbound', risk: 'Medium', teu: '16,022', berth: 'Berth B1 (Deepwater)', cranesAssigned: 3, alternateBerth: 'Berth B4', waitSavingsHours: 8 },
  { name: 'HMM Algeciras', imo: 'IMO 9863297', line: 'HMM Ocean', eta: 'Tomorrow, 11:20', status: 'Scheduled', risk: 'Low', teu: '23,964', berth: 'Berth B4', cranesAssigned: 4, alternateBerth: 'Berth B5', waitSavingsHours: 4 },
  { name: 'OOCL Spain', imo: 'IMO 9839170', line: 'OOCL Shipping', eta: 'Sep 16, 09:00', status: 'Scheduled', risk: 'Low', teu: '21,413', berth: 'Berth B5', cranesAssigned: 3, alternateBerth: 'Berth B6', waitSavingsHours: 2 },
  { name: 'Yang Ming Warranty', imo: 'IMO 9786818', line: 'Yang Ming Transport', eta: 'Sep 16, 15:10', status: 'Scheduled', risk: 'Medium', teu: '14,800', berth: 'Berth B6', cranesAssigned: 2, alternateBerth: 'Berth B7', waitSavingsHours: 6 },
]

const forecastData = [
  { hour: '00:00', index: 6.2, vessels: 12, level: 'Moderate' },
  { hour: '04:00', index: 6.8, vessels: 14, level: 'Moderate' },
  { hour: '08:00', index: 7.5, vessels: 17, level: 'High' },
  { hour: '12:00', index: 8.7, vessels: 21, level: 'Critical' },
  { hour: '16:00', index: 8.4, vessels: 19, level: 'Critical' },
  { hour: '20:00', index: 7.9, vessels: 16, level: 'High' },
  { hour: '24:00', index: 7.1, vessels: 15, level: 'High' },
  { hour: '+28h', index: 6.5, vessels: 13, level: 'Moderate' },
  { hour: '+32h', index: 5.9, vessels: 11, level: 'Low' },
  { hour: '+36h', index: 6.4, vessels: 13, level: 'Moderate' },
  { hour: '+40h', index: 7.2, vessels: 16, level: 'High' },
  { hour: '+44h', index: 8.1, vessels: 18, level: 'High' },
  { hour: '+48h', index: 7.8, vessels: 17, level: 'High' },
  { hour: '+52h', index: 6.9, vessels: 14, level: 'Moderate' },
  { hour: '+56h', index: 6.1, vessels: 12, level: 'Moderate' },
  { hour: '+60h', index: 5.4, vessels: 9, level: 'Low' },
  { hour: '+64h', index: 5.2, vessels: 8, level: 'Low' },
  { hour: '+68h', index: 5.8, vessels: 10, level: 'Low' },
  { hour: '+72h', index: 5.5, vessels: 9, level: 'Low' },
]

const navItems = [
  ['Dashboard', LayoutDashboard],
  ['Vessels', Ship],
  ['Berths', Anchor],
  ['Cranes', Boxes],
  ['Congestion', TrendingUp],
  ['72h Plan', CalendarDays],
  ['Alerts', Bell],
] as const


function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  detail,
  badgeText,
  onClick,
}: {
  label: string
  value: string
  change: string
  positive?: boolean
  icon: typeof Ship
  detail: string
  badgeText?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition duration-200 hover:border-sky-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-sky-500"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="rounded-lg bg-sky-50 p-2 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
          <Icon className="size-4" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <strong className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </strong>
        <span
          className={`flex items-center text-xs font-bold ${
            positive
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-rose-700 dark:text-rose-400'
          }`}
        >
          {positive ? (
            <ArrowUpRight className="size-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="size-3.5 mr-0.5" />
          )}
          {change}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{detail}</span>
        {badgeText && (
          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {badgeText}
          </span>
        )}
      </div>
    </button>
  )
}

function PortMap({ onSelect }: { onSelect: (berth: string) => void }) {
  const [zoom, setZoom] = useState(1)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)

  const handleZoomIn  = () => setZoom((z) => Math.min(3, +(z + 0.4).toFixed(1)))
  const handleZoomOut = () => setZoom((z) => Math.max(1, +(z - 0.4).toFixed(1)))
  const handleResetZoom = () => setZoom(1)

  // Vessel / berth pins — status drives color like the reference image
  const pins = [
    { cx: 18,  cy: 52,  label: 'Berth A-04',  vessel: 'Ever Given',       eta: 'Berthed · Departure 18:30', status: 'Critical' },
    { cx: 36,  cy: 44,  label: 'Berth B-12',  vessel: 'MSC Irina',         eta: 'Conflict · ETA 18:00',      status: 'Full'     },
    { cx: 28,  cy: 68,  label: 'Berth C-07',  vessel: 'CMA CGM Marco Polo',eta: 'Mooring · ETA +6h',          status: 'Moored'   },
    { cx: 62,  cy: 60,  label: 'Berth A-11',  vessel: 'HMM Algeciras',     eta: 'Berthed · On Track',         status: 'Loading'  },
    { cx: 76,  cy: 26,  label: 'Berth B-03',  vessel: 'OOCL Spain',        eta: 'Berthed · Stable',           status: 'Empty'    },
    { cx: 52,  cy: 75,  label: 'Berth C-10',  vessel: 'Yang Ming Warranty',eta: 'Alongside · 22:00 ETA',       status: 'Alongside'},
    { cx: 86,  cy: 70,  label: 'Pier 400',    vessel: 'Open Fast-Track',   eta: 'Available · Buffer Clear',   status: 'Empty'    },
    // Inbound vessels at sea
    { cx: 72,  cy: 18,  label: 'MSC Irina',   vessel: 'MSC Irina',         eta: 'ETA: Today 18:00 (+2h)',     status: 'Critical' },
    { cx: 86,  cy: 42,  label: 'CMA CGM',     vessel: 'CMA CGM Marco Polo',eta: 'ETA: Apr 14, 06:45 (+3h)',   status: 'Moored'   },
  ]

  const statusColor: Record<string, string> = {
    Alongside: '#f97316',  // orange
    Full:      '#ef4444',  // red
    Moored:    '#f59e0b',  // amber
    Loading:   '#3b82f6',  // blue
    Empty:     '#6b7280',  // gray
    Critical:  '#ef4444',  // red
  }

  const legendItems = [
    { color: '#f97316', label: 'Alongside' },
    { color: '#ef4444', label: 'Full / Critical' },
    { color: '#f59e0b', label: 'Moored' },
    { color: '#3b82f6', label: 'Loading' },
    { color: '#6b7280', label: 'Empty' },
  ]

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-[#1e2d42] bg-[#0d1b2a] text-white select-none"
      style={{ height: 360 }}
      aria-label="Vessel Map"
    >
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5 bg-[#0d1b2a]/90 backdrop-blur-sm border-b border-[#1e2d42]">
        <span className="text-sm font-bold tracking-wide text-white flex items-center gap-2">
          <MapPin className="size-3.5 text-sky-400" /> Vessel Map
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-emerald-400 animate-pulse">● AIS LIVE</span>
          <span className="ml-2 text-[10px] font-mono text-slate-400">LA/LB Port Complex</span>
        </div>
      </div>

      {/* Zoomable SVG World Map */}
      <div
        className="absolute inset-0 top-9 transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          viewBox="0 0 100 85"
          className="w-full h-full"
          style={{ background: 'transparent' }}
        >
          {/* Ocean grid lines */}
          {[10,20,30,40,50,60,70,80].map(v => (
            <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke="#0e2235" strokeWidth="0.3" />
          ))}
          {[10,20,30,40,50,60,70,80,90].map(v => (
            <line key={`v${v}`} x1={v} y1="0" x2={v} y2="85" stroke="#0e2235" strokeWidth="0.3" />
          ))}

          {/* ── Simplified continent fills (world map approximation) ── */}
          {/* North America */}
          <path
            d="M5,8 L22,5 L28,8 L30,14 L26,18 L24,24 L20,28 L15,32 L10,38 L6,44 L4,50 L2,55 L4,60 L8,62 L12,60 L16,55 L18,50 L20,45 L18,40 L16,35 L12,30 L10,25 L8,20 L6,14 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* Mexico / Central America */}
          <path
            d="M16,55 L22,52 L26,54 L28,58 L26,62 L22,64 L18,62 L16,58 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.3"
          />
          {/* South America */}
          <path
            d="M22,64 L28,60 L34,58 L36,62 L34,70 L30,76 L26,80 L22,78 L18,72 L18,66 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* Europe */}
          <path
            d="M46,4 L54,3 L58,6 L56,10 L52,12 L48,12 L45,10 L44,7 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* Africa */}
          <path
            d="M46,14 L54,12 L58,16 L60,24 L58,34 L54,42 L50,48 L46,50 L42,46 L40,38 L40,28 L42,20 L44,16 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* Asia */}
          <path
            d="M58,4 L72,3 L82,6 L88,10 L90,16 L86,20 L80,22 L74,20 L68,18 L64,14 L60,12 L58,8 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* India */}
          <path
            d="M68,22 L74,20 L76,26 L74,32 L70,34 L66,30 L66,24 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.3"
          />
          {/* Southeast Asia */}
          <path
            d="M80,22 L88,20 L92,24 L90,30 L84,32 L80,28 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.3"
          />
          {/* Australia */}
          <path
            d="M80,50 L90,48 L94,52 L92,60 L86,62 L80,60 L78,54 Z"
            fill="#1a2e42" stroke="#243d54" strokeWidth="0.4"
          />
          {/* Greenland */}
          <path
            d="M30,2 L38,1 L40,5 L38,9 L32,10 L28,7 Z"
            fill="#172636" stroke="#243d54" strokeWidth="0.3"
          />

          {/* ── Shipping lane dotted lines ── */}
          <path d="M28,42 Q50,38 72,36" fill="none" stroke="#1d3a52" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.6"/>
          <path d="M28,42 Q38,50 46,50" fill="none" stroke="#1d3a52" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.5"/>

          {/* ── Vessel / Berth pins ── */}
          {pins.map((pin) => {
            const col = statusColor[pin.status] ?? '#6b7280'
            const isHovered = hoveredPin === pin.label
            return (
              <g key={pin.label}>
                {/* Outer pulse ring */}
                {(pin.status === 'Critical' || pin.status === 'Full') && (
                  <circle cx={pin.cx} cy={pin.cy} r="2.4" fill="none" stroke={col} strokeWidth="0.5" opacity="0.5" className="animate-ping" style={{transformOrigin:`${pin.cx}px ${pin.cy}px`}} />
                )}
                {/* Pin dot */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r={isHovered ? 2 : 1.6}
                  fill={col}
                  stroke="white"
                  strokeWidth="0.3"
                  style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  onMouseEnter={() => setHoveredPin(pin.label)}
                  onMouseLeave={() => setHoveredPin(null)}
                  onClick={() => onSelect(pin.label)}
                />
                {/* Hover popup label */}
                {isHovered && (
                  <g>
                    <rect
                      x={pin.cx + 2.5} y={pin.cy - 6}
                      width={30} height={9}
                      rx="1" ry="1"
                      fill="#0d1b2a" stroke="#1e3a54" strokeWidth="0.4"
                    />
                    <text x={pin.cx + 3.5} y={pin.cy - 2.5} fill="white" fontSize="2.2" fontWeight="bold" fontFamily="monospace">
                      {pin.vessel}
                    </text>
                    <text x={pin.cx + 3.5} y={pin.cy + 1} fill="#94a3b8" fontSize="1.8" fontFamily="monospace">
                      {pin.eta}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Zoom controls (right side like reference) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="flex size-7 items-center justify-center rounded bg-[#1a2d42] border border-[#2a3f56] text-slate-200 hover:bg-sky-700 hover:text-white transition text-sm font-bold"
          title="Zoom In"
        >+</button>
        <button
          onClick={handleZoomOut}
          className="flex size-7 items-center justify-center rounded bg-[#1a2d42] border border-[#2a3f56] text-slate-200 hover:bg-sky-700 hover:text-white transition text-sm font-bold"
          title="Zoom Out"
        >−</button>
        <button
          onClick={handleResetZoom}
          className="flex size-7 items-center justify-center rounded bg-[#1a2d42] border border-[#2a3f56] text-slate-300 hover:bg-slate-700 transition text-[9px] font-bold font-mono"
          title="Reset"
        >{(zoom * 100).toFixed(0)}%</button>
      </div>

      {/* Bottom Legend bar — exactly like reference image */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-4 px-4 py-2 bg-[#0b1825]/95 border-t border-[#1e2d42] text-[10px] font-semibold">
        {legendItems.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full inline-block shrink-0" style={{ background: item.color }} />
            <span className="text-slate-300">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ShiftPlanGrid({
  onOpenAlternateDrawer,
  onSelectBerth,
}: {
  onOpenAlternateDrawer: () => void
  onSelectBerth: (berth: string) => void
}) {
  const shifts = [
    { name: 'Shift 1 (07:00 - 15:00)', supervisor: 'Capt. J. Miller', status: 'Active Shift' },
    { name: 'Shift 2 (15:00 - 23:00)', supervisor: 'D. Vance', status: 'Upcoming' },
    { name: 'Shift 3 (23:00 - 07:00)', supervisor: 'R. Kowalski', status: 'Scheduled' },
  ]

  const berthAssignments = [
    {
      berth: 'Berth A-04 (Pier A)',
      s1: { vessel: 'Ever Given', cranes: 4, status: 'Conflict (Backlog)', color: 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200' },
      s2: { vessel: 'Ever Given', cranes: 4, status: 'Unloading 1,400 TEU', color: 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200' },
      s3: { vessel: 'HMM Algeciras', cranes: 3, status: 'Scheduled arrival', color: 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200' },
    },
    {
      berth: 'Berth B-12 (Pier B)',
      s1: { vessel: 'MSC Irina', cranes: 5, status: 'Anchored Offshore', color: 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200' },
      s2: { vessel: 'MSC Irina', cranes: 5, status: 'Recommended Diversion', color: 'bg-sky-50 border-sky-300 text-sky-900 dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-200' },
      s3: { vessel: 'Open Slot', cranes: 2, status: 'Buffer Window', color: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-400' },
    },
    {
      berth: 'Berth C-07 (Deepwater)',
      s1: { vessel: 'CMA CGM Polo', cranes: 3, status: 'Inbound Departure', color: 'bg-sky-50 border-sky-300 text-sky-900 dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-200' },
      s2: { vessel: 'Yang Ming', cranes: 3, status: 'Scheduled', color: 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200' },
      s3: { vessel: 'Yang Ming', cranes: 3, status: 'Unloading', color: 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200' },
    },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              72-Hour Shift Supervisor Operations Plan
            </h2>
            <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              Official Shift Ready
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Berth allocations, gantry crane matrix, and supervisor handover timeline for Los Angeles Terminal 400.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenAlternateDrawer}
            className="flex items-center gap-1.5 rounded-lg border border-sky-600 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/80 dark:text-sky-300 transition"
          >
            <Route className="size-4" /> Simulate Reroute Strategy
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            title="Export / Print this Operational Plan into PDF"
          >
            <FileText className="size-4 text-sky-600" /> Create into PDF
          </button>
        </div>
      </div>

      {/* Shift Header Columns */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[750px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
              <th className="p-3 font-bold text-slate-700 dark:text-slate-300 w-1/4">Berth Location (Click to Inspect)</th>
              {shifts.map((s) => (
                <th key={s.name} className="p-3 font-bold text-slate-700 dark:text-slate-300 w-1/4">
                  <div className="text-xs">{s.name}</div>
                  <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    Lead: {s.supervisor} · <span className="font-semibold text-sky-600 dark:text-sky-400">{s.status}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {berthAssignments.map((row) => (
              <tr key={row.berth} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3">
                  <button
                    onClick={() => onSelectBerth(row.berth.split(' (')[0])}
                    className="font-bold text-slate-800 hover:text-sky-600 text-left hover:underline transition dark:text-slate-200 dark:hover:text-sky-400 flex items-center gap-1.5"
                    title={`Click to view ${row.berth} details`}
                  >
                    <Anchor className="size-3.5 text-sky-500 shrink-0" />
                    <span>{row.berth}</span>
                  </button>
                </td>
                {[row.s1, row.s2, row.s3].map((cell, idx) => (
                  <td key={idx} className="p-2">
                    <div className={`rounded-lg border p-2.5 transition ${cell.color}`}>
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{cell.vessel}</span>
                        <span className="rounded bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-semibold">
                          {cell.cranes} Cranes
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] opacity-90">{cell.status}</div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DataTable({
  onSelect,
  onOpenReroute,
  onSelectBerth,
}: {
  onSelect: (v: Vessel) => void
  onOpenReroute: (v: Vessel) => void
  onSelectBerth: (berth: string) => void
}) {
  const vessels = usePortStore(state => state.vessels.length > 0 ? state.vessels : INITIAL_VESSELS);
  const [filter, setFilter] = useState('All vessels')
  const [query, setQuery] = useState('')

  const list = useMemo(
    () =>
      vessels.filter(
        (v) =>
          (filter === 'All vessels' || v.risk === filter.replace(' risk', '')) &&
          `${v.name} ${v.line} ${v.imo}`.toLowerCase().includes(query.toLowerCase())
      ),
    [filter, query]
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 p-4 gap-3 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Live Vessel Traffic Queue</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {list.length} container vessels in Port of LA/Long Beach approach queue
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search IMO, Vessel, Line..."
              className="h-8.5 w-44 rounded-lg border border-slate-300 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8.5 rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            <option>All vessels</option>
            <option>Critical risk</option>
            <option>High risk</option>
            <option>Medium risk</option>
            <option>Low risk</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Vessel & Carrier Line</th>
              <th className="px-3 py-3">ETA / Arrival</th>
              <th className="px-3 py-3">Queue Status</th>
              <th className="px-3 py-3">Congestion Risk</th>
              <th className="px-3 py-3">TEU Load</th>
              <th className="px-3 py-3">Assigned Berth</th>
              <th className="px-3 py-3 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {list.map((v) => (
              <tr key={v.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3">
                  <button onClick={() => onSelect(v)} className="flex items-center gap-3 text-left group">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 dark:bg-sky-950 dark:text-sky-300">
                      <Ship className="size-4" />
                    </span>
                    <div>
                      <span className="block font-bold text-slate-900 group-hover:text-sky-600 dark:text-slate-100 dark:group-hover:text-sky-400">
                        {v.name}
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                        {v.line} · {v.imo}
                      </span>
                    </div>
                  </button>
                </td>
                <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-300">{v.eta}</td>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {v.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      v.risk === 'Critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : v.risk === 'High'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : v.risk === 'Medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {v.risk} Risk
                  </span>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">{v.teu} TEU</td>
                <td className="px-3 py-3">
                  <button
                    onClick={() => onSelectBerth(v.berth.split(' (')[0])}
                    className="font-semibold text-sky-700 hover:text-sky-900 hover:underline text-left dark:text-sky-400 flex items-center gap-1"
                    title={`Click to inspect ${v.berth} details`}
                  >
                    <Anchor className="size-3 text-sky-500" />
                    <span>{v.berth}</span>
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => onOpenReroute(v)}
                    className="rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
                  >
                    Alternate Route
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AlternateRoutingDrawer({
  vessel,
  onClose,
  onApply,
}: {
  vessel: Vessel
  onClose: () => void
  onApply: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Alternate Routing Engine
              </span>
              <span className="text-xs text-slate-500">LA/LB Terminal Optimization</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
              Reroute Strategy for {vessel.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Carrier: {vessel.line} · Load: {vessel.teu} TEU · Current: {vessel.berth}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 dark:border-rose-900/60 dark:bg-rose-950/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="text-xs">
                <strong className="font-bold text-rose-900 dark:text-rose-200">Current Hotspot Bottleneck</strong>
                <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                  {vessel.berth} is experiencing 87% berth saturation. Remaining queued at this location adds{' '}
                  <strong className="underline">24 hours of delay</strong> and costs ~$42,000 in additional fuel & demurrage.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Recommended Reroute Destination
                </span>
                <h3 className="mt-1 text-base font-bold text-emerald-950 dark:text-emerald-100">
                  Shift to {vessel.alternateBerth || 'Berth A-09 (Oakland Slip)'}
                </h3>
              </div>
              <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                Save {vessel.waitSavingsHours || 18} Hours
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-emerald-200 bg-white/80 p-2 dark:border-emerald-800 dark:bg-slate-900/60">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Queue Time Saved</span>
                <strong className="block text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  -{vessel.waitSavingsHours || 18} hrs
                </strong>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-white/80 p-2 dark:border-emerald-800 dark:bg-slate-900/60">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Fuel & Operational Savings</span>
                <strong className="block text-sm font-bold text-emerald-700 dark:text-emerald-400">$340,000</strong>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-white/80 p-2 dark:border-emerald-800 dark:bg-slate-900/60">
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Cranes Assigned</span>
                <strong className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  {vessel.cranesAssigned + 1} Gantry Cranes
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApply()
              onClose()
            }}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700"
          >
            <Check className="size-4" /> Apply Alternate Routing Plan
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateScheduleModal({
  activeCategory,
  onClose,
  onSave,
}: {
  activeCategory: string
  onClose: () => void
  onSave: (entry: string) => void
}) {
  const [vessel, setVessel] = useState('MSC Irina')
  const [berth, setBerth] = useState('Berth B-12 (Pier B)')
  const [shift, setShift] = useState('Shift 1 (07:00 - 15:00)')
  const [cranes, setCranes] = useState('4 Gantry Cranes')
  const [teu, setTeu] = useState('1,850 TEU')
  const [strategy, setStrategy] = useState('Priority Berth Allocation')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEntry = `${berth.split(' (')[0]} · ${vessel} · ${shift.split(' (')[0]} (${cranes}) · ${strategy} [${teu}]`
    onSave(newEntry)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <Plus className="size-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">Create Operational Schedule</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Configure berth window, crane crew, and vessel discharge sequence for {activeCategory}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Vessel</label>
              <select
                value={vessel}
                onChange={(e) => setVessel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="MSC Irina">MSC Irina (IMO 9929429)</option>
                <option value="Ever Given">Ever Given (IMO 9811000)</option>
                <option value="CMA CGM Marco Polo">CMA CGM Marco Polo</option>
                <option value="HMM Algeciras">HMM Algeciras</option>
                <option value="OOCL Spain">OOCL Spain</option>
                <option value="Yang Ming Warranty">Yang Ming Warranty</option>
                <option value="Maersk Mc-Kinney">Maersk Mc-Kinney Møller</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Berth Allocation</label>
              <select
                value={berth}
                onChange={(e) => setBerth(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="Berth A-04 (Pier A)">Berth A-04 (Pier A)</option>
                <option value="Berth B-12 (Pier B)">Berth B-12 (Pier B)</option>
                <option value="Berth C-07 (Deepwater)">Berth C-07 (Deepwater Slip)</option>
                <option value="Berth A-11 (Pier A)">Berth A-11 (Pier A North)</option>
                <option value="Pier 400 (Terminal 400)">Pier 400 (Dedicated Fast-Track)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shift Window</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="Shift 1 (07:00 - 15:00)">Shift 1 (07:00 - 15:00) · Capt. J. Miller</option>
                <option value="Shift 2 (15:00 - 23:00)">Shift 2 (15:00 - 23:00) · D. Vance</option>
                <option value="Shift 3 (23:00 - 07:00)">Shift 3 (23:00 - 07:00) · R. Kowalski</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crane Gang Allocation</label>
              <select
                value={cranes}
                onChange={(e) => setCranes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="2 Gantry Cranes">2 Gantry Cranes (Standard throughput)</option>
                <option value="3 Gantry Cranes">3 Gantry Cranes (32 moves/hr)</option>
                <option value="4 Gantry Cranes">4 Gantry Cranes (High throughput)</option>
                <option value="5 Gantry Cranes">5 Gantry Cranes (Max Surge Gang)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target TEU Load</label>
              <input
                type="text"
                value={teu}
                onChange={(e) => setTeu(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                placeholder="e.g. 1,800 TEU"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Strategy Directives</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              >
                <option value="Priority Berth Allocation">Priority Berth Allocation</option>
                <option value="Congestion Mitigation Reroute">Congestion Mitigation Reroute</option>
                <option value="Standard Scheduled Turnaround">Standard Scheduled Turnaround</option>
                <option value="Fast-Track Discharge">Fast-Track Discharge</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-3 text-[11px] text-sky-900 flex items-start gap-2">
            <Sparkles className="size-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              PortWise AI will automatically synchronize crane crews, gate appointments, and yard stack slotting for this shift schedule.
            </span>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
            >
              <Check className="size-4" /> Save & Publish Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CraneDetailModal({
  crane,
  onClose,
  onReassign,
}: {
  crane: Crane
  onClose: () => void
  onReassign: () => void
}) {
  const [maintenanceRequested, setMaintenanceRequested] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                <Boxes className="size-3.5" /> Equipment & Gantry Telemetry
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                {crane.id}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{crane.name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{crane.type} · {crane.location}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Utilization Bar */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">Operational Utilization Rate</span>
              <span className={crane.utilization >= 90 ? 'text-rose-600' : crane.utilization >= 75 ? 'text-amber-600' : 'text-emerald-700'}>
                {crane.utilization}% ({crane.status})
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-500 ${
                  crane.utilization >= 90 ? 'bg-rose-500' : crane.utilization >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${crane.utilization}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] text-slate-500">Cycle Speed / Throughput</span>
              <strong className="block mt-0.5 font-bold text-sky-700 text-sm">{crane.movesPerHour} moves / hr</strong>
              <span className="text-[10px] text-slate-500">Twin-lift container mode</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] text-slate-500">Assigned Vessel / Stack</span>
              <strong className="block mt-0.5 font-bold text-slate-900 text-sm">{crane.assignedVessel}</strong>
              <span className="text-[10px] text-slate-500">{crane.location}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] text-slate-500">Hoist & Hydraulic Health</span>
              <strong className="block mt-0.5 font-bold text-slate-900">{crane.healthTemp}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold">Telemetry Nominal</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] text-slate-500">Next Service Window</span>
              <strong className="block mt-0.5 font-bold text-slate-900">{crane.maintenanceDue}</strong>
              <span className="text-[10px] text-slate-500">Shift Handover Inspection</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Operator & Gang Allocation</span>
            <p className="mt-0.5 font-semibold text-slate-800">{crane.operator}</p>
            <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">{crane.description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              setMaintenanceRequested(true)
              setTimeout(() => setMaintenanceRequested(false), 3000)
            }}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
          >
            {maintenanceRequested ? '✓ Tech Dispatched' : 'Request Maintenance'}
          </button>
          <button
            onClick={() => {
              onClose()
              onReassign()
            }}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
          >
            <Route className="size-4" /> Reassign to Berth B-12
          </button>
        </div>
      </div>
    </div>
  )
}

function PdfReportModal({ onClose }: { onClose: () => void }) {
  const handlePrint = () => {
    // Open a new print-only window with just the PDF content
    const content = document.getElementById('pdf-report-doc')?.innerHTML
    if (!content) return
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PortWise AI · Terminal Dispatch Report</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; padding: 32px; font-size: 12px; }
            h1 { font-size: 20px; font-weight: 900; margin-top: 4px; }
            h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; font-size: 11px; }
            th { background: #f1f5f9; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
            .kpi-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; background: #f8fafc; }
            .kpi-label { font-size: 10px; color: #64748b; display: block; }
            .kpi-value { font-size: 18px; font-weight: 900; display: block; }
            .sign-row { display: flex; justify-content: space-between; align-items: flex-end; }
            .mono { font-family: monospace; }
            .sky { color: #0369a1; }
            .rose { color: #e11d48; }
            .green { color: #15803d; }
            .section { margin-bottom: 28px; }
            .header-meta { display: flex; gap: 24px; font-size: 10px; color: #64748b; font-family: monospace; margin-top: 4px; }
            .divider { border-top: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          ${content}
          <script>window.onload = function(){ window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div
      className="pdf-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pdf-print-content w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl text-slate-900"
      >
        {/* This inner div is what we extract for printing */}
        <div id="pdf-report-doc">
          <div className="divider">
            <div className="text-[10px] font-bold tracking-widest uppercase text-sky-700 font-mono">
              PORT OF LOS ANGELES &amp; LONG BEACH COMPLEX · OFFICIAL OPERATIONS BRIEFING
            </div>
            <h1>DAILY TERMINAL DISPATCH &amp; CONGESTION REPORT</h1>
            <div className="header-meta">
              <span>DOC REF: PW-2026-0913-S1</span>
              <span>DATE: Sep 13, 2026 · 22:30 PST</span>
              <span>SUPERVISOR: Capt. J. Miller · Shift 1</span>
            </div>
          </div>

          {/* Report Content */}
          <div className="mt-6 space-y-6 text-xs">
            {/* Executive Summary */}
            <div className="section">
              <h3>1. Executive KPI Summary</h3>
              <div className="kpi-grid">
                <div className="kpi-box">
                  <span className="kpi-label">Queue Traffic</span>
                  <strong className="kpi-value">84 Vessels</strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">Critical Berths</span>
                  <strong className="kpi-value rose">3 Hotspots</strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">Port Saturation</span>
                  <strong className="kpi-value">87% Cap.</strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">AI Demurrage Saved</span>
                  <strong className="kpi-value green">-$340K</strong>
                </div>
              </div>
            </div>

            {/* Berth Table */}
            <div className="section">
              <h3>2. Berth Allocation Matrix</h3>
              <table>
                <thead>
                  <tr>
                    <th>Berth</th>
                    <th>Assigned Vessel</th>
                    <th>Cranes</th>
                    <th>Occupancy</th>
                    <th>Action Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold">Berth A-04 (Pier A)</td>
                    <td>Ever Given — 20,124 TEU</td>
                    <td>4 STS Cranes</td>
                    <td className="rose font-bold">87% (Hotspot)</td>
                    <td>Shift 2 crane boost</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Berth B-12 (Pier B)</td>
                    <td>MSC Irina — 24,346 TEU</td>
                    <td>5 STS Cranes</td>
                    <td className="rose font-bold">94% (Conflict)</td>
                    <td className="sky font-bold">Reroute to Pier 400 (–14 hrs)</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Berth C-07 (Deepwater)</td>
                    <td>CMA CGM Marco Polo — 16,022 TEU</td>
                    <td>3 STS Cranes</td>
                    <td className="green font-bold">74% (Normal)</td>
                    <td>Standard turnaround</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Pier 400 Fast-Track</td>
                    <td>Open Slot / Diversion Buffer</td>
                    <td>4 STS Cranes</td>
                    <td className="green font-bold">34% (Clear)</td>
                    <td>Accept MSC Irina diversion</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 72-Hour Outlook */}
            <div className="section">
              <h3>3. 72-Hour Congestion Index Outlook</h3>
              <table>
                <thead>
                  <tr>
                    <th>Time Window</th>
                    <th>Congestion Index</th>
                    <th>Queued Vessels</th>
                    <th>Demurrage Penalty</th>
                    <th>Risk Level</th>
                    <th>AI Directive</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold">Today 08:00 – 12:00</td>
                    <td>7.5 / 10</td>
                    <td>17 vessels</td>
                    <td>$850,000</td>
                    <td>High</td>
                    <td>Pre-clear rail corridors</td>
                  </tr>
                  <tr style={{background:'#fff1f2'}}>
                    <td className="font-bold">Today 12:00 – 16:00 ◀ PEAK</td>
                    <td className="rose font-bold">8.7 / 10</td>
                    <td>21 vessels</td>
                    <td className="rose font-bold">$1,200,000</td>
                    <td className="rose font-bold">CRITICAL</td>
                    <td>Reroute MSC Irina → Pier 400</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Today 16:00 – 20:00</td>
                    <td>8.4 / 10</td>
                    <td>19 vessels</td>
                    <td>$1,050,000</td>
                    <td>Critical</td>
                    <td>Shift 2 crane boost at Pier A</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Tonight 20:00 – 24:00</td>
                    <td>7.9 / 10</td>
                    <td>16 vessels</td>
                    <td>$780,000</td>
                    <td>High</td>
                    <td>Yard stack re-shuffle</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Day 2 (+28h – +48h)</td>
                    <td>6.4–7.8 / 10</td>
                    <td>13–17 vessels</td>
                    <td>$420K – $680K</td>
                    <td>Moderate – High</td>
                    <td>Re-sequence Pier A arrivals</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Day 3 (+56h – +72h)</td>
                    <td className="green font-bold">5.4 / 10</td>
                    <td>9 vessels</td>
                    <td className="green font-bold">$190,000</td>
                    <td className="green font-bold">Low (Optimal)</td>
                    <td>Buffer clearance achieved</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sign-off */}
            <div className="sign-row" style={{marginTop:'32px', paddingTop:'16px', borderTop:'1px solid #cbd5e1'}}>
              <div>
                <span style={{fontSize:'10px',color:'#64748b', display:'block'}}>Operations Director Signature:</span>
                <strong className="mono" style={{fontSize:'14px'}}>_______________________</strong>
              </div>
              <div style={{textAlign:'center'}}>
                <span style={{fontSize:'10px',color:'#64748b', display:'block'}}>Shift Supervisor:</span>
                <strong className="mono" style={{fontSize:'14px'}}>Capt. J. Miller</strong>
              </div>
              <div style={{textAlign:'right', fontSize:'10px', color:'#94a3b8', fontFamily:'monospace'}}>
                PortWise AI Certified Report<br/>Generated: Sep 13, 2026 · 22:30 PST
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-4 no-print">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close Preview
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
          >
            <FileText className="size-4" /> Print / Save as PDF Document
          </button>
        </div>
      </div>
    </div>
  )
}

function BerthsView({
  onSelectBerth,
  onOpenPdf,
  onOpenScheduleModal,
}: {
  onSelectBerth: (berth: string) => void
  onOpenPdf: () => void
  onOpenScheduleModal: () => void
}) {
  const berths = [
    { name: 'Berth A-04', pier: 'Pier A Container Terminal', vessel: 'Ever Given', teu: '20,124 TEU', cranes: 4, saturation: 87, risk: 'Critical', status: 'High Hotspot Backlog', note: 'Crane Gang #4 discharging 1,400 TEU. Turnaround delayed 3.5h.' },
    { name: 'Berth B-12', pier: 'Pier B Oakland Slip', vessel: 'MSC Irina', teu: '24,346 TEU', cranes: 5, saturation: 94, risk: 'Critical', status: 'Conflict Detected', note: 'Severe congestion bottleneck. AI recommends diversion to Pier 400.' },
    { name: 'Berth C-07', pier: 'Pier C Deepwater Slip', vessel: 'CMA CGM Marco Polo', teu: '16,022 TEU', cranes: 3, saturation: 74, risk: 'Medium', status: 'Scheduled Mooring', note: 'Expected arrival tomorrow 06:45. Draft verified at 16.5m.' },
    { name: 'Berth A-11', pier: 'Pier A North Quay', vessel: 'HMM Algeciras', teu: '23,964 TEU', cranes: 4, saturation: 62, risk: 'Low', status: 'Standard Operation', note: 'Nominal discharge rate of 34 moves/hour. Shift handover on track.' },
    { name: 'Berth B-03', pier: 'Pier B East Buffer', vessel: 'OOCL Spain', teu: '21,413 TEU', cranes: 3, saturation: 45, risk: 'Low', status: 'Buffer Slot Available', note: 'Yard buffer clear. Capable of receiving secondary overflow.' },
    { name: 'Pier 400', pier: 'Terminal 400 Dedicated', vessel: 'Open Fast-Track', teu: '24,000 TEU Cap', cranes: 4, saturation: 34, risk: 'Low', status: 'Clear Fast-Track Window', note: 'Prime target for MSC Irina rerouting plan (Saves 14 hours).' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Berth Planning & Occupancy Matrix</h2>
            <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
              6 Active Berths
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time berth saturation, crane allocations, and vessel assignment matrix for Port of LA/LB.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
          >
            <Plus className="size-4" /> Create New Schedule
          </button>
          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="size-4 text-sky-600" /> Create into PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {berths.map((b) => (
          <div
            key={b.name}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-sky-400 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">{b.pier}</span>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Anchor className="size-4 text-sky-600" /> {b.name}
                  </h3>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    b.risk === 'Critical'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : b.risk === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {b.saturation}% Full
                </span>
              </div>

              {/* Saturation bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full ${
                    b.saturation >= 90 ? 'bg-rose-500' : b.saturation >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${b.saturation}%` }}
                />
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Docked Vessel:</span>
                  <strong className="text-slate-800 font-bold">{b.vessel}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Gantry Cranes:</span>
                  <strong className="text-sky-700 font-bold">{b.cranes} Active Cranes</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">TEU Volume:</span>
                  <strong className="text-slate-800">{b.teu}</strong>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {b.note}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => onSelectBerth(b.name)}
                className="w-full rounded-lg bg-sky-50 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
              >
                Inspect Telemetry &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CranesView({
  onSelectCrane,
  onOpenPdf,
  onOpenScheduleModal,
}: {
  onSelectCrane: (crane: Crane) => void
  onOpenPdf: () => void
  onOpenScheduleModal: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Yard Stack & Gantry Crane Management</h2>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              18 Cranes Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            STS quay cranes, container yard saturation, and live mechanical telemetry. Click any crane to inspect.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
          >
            <Plus className="size-4" /> Create New Schedule
          </button>
          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="size-4 text-sky-600" /> Create into PDF
          </button>
        </div>
      </div>

      {/* Cranes & Stacks Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cranesData.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCrane(c)}
            className="group flex flex-col justify-between text-left rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-sky-400 hover:shadow-md transition cursor-pointer"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500">{c.id} · {c.location}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition flex items-center gap-1.5 mt-0.5">
                    <Boxes className="size-4 text-sky-600" /> {c.name}
                  </h3>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    c.status === 'Critical Load'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : c.status === 'High Load'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {c.utilization}% Load
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full ${
                    c.utilization >= 90 ? 'bg-rose-500' : c.utilization >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${c.utilization}%` }}
                />
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Throughput Speed:</span>
                  <strong className="text-sky-700 font-bold">{c.movesPerHour} moves / hr</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Assigned Target:</span>
                  <strong className="text-slate-800 font-bold">{c.assignedVessel.split(' (')[0]}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Service Due:</span>
                  <strong className="text-slate-700">{c.maintenanceDue}</strong>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {c.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
              <span>Inspect Telemetry & Specs</span>
              <ChevronRight className="size-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function CongestionView({
  onOpenAlternate,
  onOpenPdf,
  onOpenScheduleModal,
}: {
  onOpenAlternate: () => void
  onOpenPdf: () => void
  onOpenScheduleModal: () => void
}) {
  const timeline72h = [
    { window: 'Today 08:00 - 12:00', index: 7.5, vessels: 17, cost: '$850,000', risk: 'High', action: 'Pre-clear rail corridors' },
    { window: 'Today 12:00 - 16:00 (PEAK 🔴)', index: 8.7, vessels: 21, cost: '$1,200,000', risk: 'Critical', action: 'Reroute MSC Irina to Pier 400' },
    { window: 'Today 16:00 - 20:00', index: 8.4, vessels: 19, cost: '$1,050,000', risk: 'Critical', action: 'Shift 2 crane boost at Pier A' },
    { window: 'Tonight 20:00 - 24:00', index: 7.9, vessels: 16, cost: '$780,000', risk: 'High', action: 'Yard stack re-shuffle' },
    { window: 'Tomorrow (+28h - +36h)', index: 6.4, vessels: 13, cost: '$420,000', risk: 'Moderate', action: 'Normal berth intake' },
    { window: 'Day 2 (+40h - +48h)', index: 7.8, vessels: 17, cost: '$680,000', risk: 'High', action: 'Re-sequence Pier A arrivals' },
    { window: 'Day 3 (+56h - +72h)', index: 5.4, vessels: 9, cost: '$190,000', risk: 'Low (Optimal)', action: 'Buffer clearance achieved' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">72-Hour Congestion Forecast & Analytics</h2>
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 animate-pulse">
              Peak Index 8.7 at 12PM
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Hour-by-hour terminal saturation prediction, anchorage queue costs, and demurrage mitigation timeline.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenAlternate}
            className="flex items-center gap-1.5 rounded-lg border border-sky-600 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100"
          >
            <Route className="size-4" /> Simulate Reroute Strategy
          </button>
          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="size-4 text-sky-600" /> Create into PDF
          </button>
        </div>
      </div>

      {/* Demurrage Cost Mitigation Banner */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
          <span className="text-[10px] font-bold text-rose-900 uppercase">Anchorage Delay Exposure</span>
          <strong className="block text-2xl font-black text-rose-700 mt-1">$1,200,000 / Day</strong>
          <span className="text-xs text-rose-800">14 vessels in offshore wait pattern</span>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <span className="text-[10px] font-bold text-emerald-900 uppercase">Projected AI Savings</span>
          <strong className="block text-2xl font-black text-emerald-700 mt-1">-$340,000 Saved</strong>
          <span className="text-xs text-emerald-800">Via Berth B-12 to Pier 400 diversion</span>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
          <span className="text-[10px] font-bold text-sky-900 uppercase">Queue Resolution Time</span>
          <strong className="block text-2xl font-black text-sky-700 mt-1">-18 Hours Wait</strong>
          <span className="text-xs text-sky-800">Average turn time reduced to 26h</span>
        </div>
      </div>

      {/* 72-Hour Timeline Matrix Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">72-Hour Operational Congestion Matrix</h3>
          <span className="text-xs text-slate-500 font-mono">Telemetry updated live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-100/70 text-[10px] uppercase font-bold tracking-wider text-slate-600">
              <tr>
                <th className="p-3">Time Window</th>
                <th className="p-3">Congestion Score (0-10)</th>
                <th className="p-3">Queued Vessels</th>
                <th className="p-3">Demurrage Penalty</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Recommended AI Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {timeline72h.map((t, idx) => (
                <tr
                  key={idx}
                  className={t.risk === 'Critical' ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50'}
                >
                  <td className="p-3 font-bold text-slate-900">{t.window}</td>
                  <td className="p-3 font-bold font-mono">
                    <span className={t.index >= 8.5 ? 'text-rose-600' : t.index >= 7.0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {t.index} / 10.0
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{t.vessels} vessels</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{t.cost}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        t.risk === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : t.risk === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.risk}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-sky-800">{t.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AlertsView({
  onSelectBerth,
  onOpenPdf,
  onOpenScheduleModal,
}: {
  onSelectBerth: (berth: string) => void
  onOpenPdf: () => void
  onOpenScheduleModal: () => void
}) {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All')
  const [mitigatedAlerts, setMitigatedAlerts] = useState<Record<string, boolean>>({})

  const list = alertsData.filter((a) => filter === 'All' || a.severity === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Terminal Operational Alerts Center</h2>
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
              12 Active Telemetry Alerts
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time incident feed requiring shift supervisor attention and dispatch authorization.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
          >
            <Plus className="size-4" /> Create New Schedule
          </button>
          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="size-4 text-sky-600" /> Create into PDF
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['All', 'Critical', 'Warning', 'Info'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              filter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat} Alerts {cat === 'All' ? '(12)' : cat === 'Critical' ? '(3)' : cat === 'Warning' ? '(5)' : '(4)'}
          </button>
        ))}
      </div>

      {/* Alerts Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((alert) => (
          <div
            key={alert.id}
            className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition ${
              mitigatedAlerts[alert.id]
                ? 'border-emerald-300 bg-emerald-50/40 opacity-75'
                : alert.severity === 'Critical'
                ? 'border-rose-300 bg-rose-50/20'
                : alert.severity === 'Warning'
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-600 text-white'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-500 text-white'
                        : 'bg-sky-600 text-white'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{alert.id} · {alert.timestamp}</span>
                </div>
                {mitigatedAlerts[alert.id] && (
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    ✓ Mitigated
                  </span>
                )}
              </div>

              <h3 className="mt-2 text-sm font-bold text-slate-900">{alert.title}</h3>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">Location: {alert.location}</p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-white/80 p-3 text-xs space-y-1.5">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Impact:</span>
                  <p className="text-slate-800">{alert.impact}</p>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-sky-700 font-bold uppercase block">AI Recommendation:</span>
                  <p className="text-sky-950 font-medium">{alert.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end gap-2">
              {alert.location.includes('Berth') && (
                <button
                  onClick={() => onSelectBerth(alert.location.split(' (')[0])}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Inspect Berth
                </button>
              )}
              <button
                onClick={() => setMitigatedAlerts((prev) => ({ ...prev, [alert.id]: true }))}
                className="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
              >
                {mitigatedAlerts[alert.id] ? 'Mitigation Applied ✓' : 'Apply AI Mitigation'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


import { usePortStore } from '../store/usePortStore'

export default function Page() {
  const [active, setActive] = useState<PageKey>('Dashboard')
  
  // Initialize Zustand store on mount
  useEffect(() => {
    usePortStore.getState().setVessels(INITIAL_VESSELS);
    // Note: berthAssignments is inside ShiftPlanGrid, we need to extract it or set it there.
  }, []);

  const vessels = usePortStore(state => state.vessels.length > 0 ? state.vessels : INITIAL_VESSELS);
  const [forecastTab, setForecastTab] = useState<'Congestion index' | 'Wait time'>('Congestion index')
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null)
  const [selectedBerth, setSelectedBerth] = useState<string | null>(null)
  const [selectedCrane, setSelectedCrane] = useState<Crane | null>(null)
  const [pdfReportOpen, setPdfReportOpen] = useState(false)
  const [scheduleModalCategory, setScheduleModalCategory] = useState<string | null>(null)
  const [rerouteVessel, setRerouteVessel] = useState<Vessel | null>(null)
  const [recommendationApplied, setRecommendationApplied] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotQuery, setCopilotQuery] = useState('')
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello Capt. Miller. I am your PortWise AI Copilot. You can ask me to reassign berths, forecast queue delays, optimize crane shifts, or evaluate demurrage savings.',
    },
  ])

  const handleSendCopilot = async (text?: string) => {
    const q = text || copilotQuery
    if (!q.trim()) return

    const userMsg = q.trim()
    setCopilotQuery('')
    setCopilotMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    
    // Add a loading message
    setCopilotMessages((prev) => [...prev, { role: 'assistant', text: 'Analyzing port data...' }])

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: userMsg,
          payload: {
            cranes: cranesData.map(c => ({ id: c.id, status: c.status, load: c.utilization })),
            vessels: vessels.map(v => ({ id: v.id, status: v.status, etd: v.etd })),
          }
        }),
      });
      
      const result = await response.json();
      
      // Remove loading message and add real response
      setCopilotMessages((prev) => {
        const filtered = prev.slice(0, prev.length - 1);
        if (!result.success) {
          return [...filtered, { role: 'assistant', text: `API Error: ${result.error || 'Unknown error'}` }];
        }
        
        // Execute dynamic action!
        if (result.data.actionType === 'REROUTE' && result.data.targetVesselId) {
          usePortStore.getState().updateVesselBerth(result.data.targetVesselId, result.data.newLocation);
        }

        return [...filtered, { role: 'assistant', text: result.data.reply }];
      });
    } catch (error) {
      setCopilotMessages((prev) => {
        const filtered = prev.slice(0, prev.length - 1);
        return [...filtered, { role: 'assistant', text: 'Error connecting to Bob AI. Please check server.' }];
      });
    }
  }

  const navigate = (page: string) => setActive(page as PageKey)

  return (
    <div>
      <main className="min-h-screen bg-slate-100/70 text-slate-900 transition-colors duration-200">
        {/* Top Header Navigation Bar - Navy Blue */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#0c182b] px-4 shadow-sm lg:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('Dashboard')}
              className="flex size-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-black text-white shadow-xs hover:bg-sky-500"
            >
              PW
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  PortWise <span className="text-sky-400">Terminal Ops</span>
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  LA/LB Complex
                </span>
              </div>
              <div className="text-[10px] font-medium text-slate-400">
                Container Congestion Predictor & Port Operations Optimiser
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-3 py-1 text-xs font-semibold text-slate-200">
              <span className="size-2 rounded-full bg-emerald-400" />
              Shift 1 Active · Lead: Capt. J. Miller
            </div>

            {/* AI Copilot Button right next to notification icon */}
            <button
              onClick={() => setCopilotOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-600/20 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-600 hover:text-white transition shadow-xs"
              title="PortWise AI Copilot"
            >
              <Bot className="size-4 text-sky-400" />
              <span>AI Copilot</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={() => navigate('Alerts')}
              className="relative rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
              title="Operational Alerts"
            >
              <Bell className="size-4" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex size-8 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-xs">
              JM
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Workspace Navy Blue Sidebar */}
          <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-800 bg-[#0c182b] p-4 text-slate-100 lg:block">
            <div className="mb-6">
              <div className="mb-3 px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                PORT OPERATIONS WORKSPACE
              </div>
              {navItems.map(([label, Icon]) => (
                <button
                  key={label}
                  onClick={() => navigate(label)}
                  className={`mb-1.5 flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-bold transition ${
                    active === label
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 text-sky-400" />
                    <span>{label}</span>
                  </div>
                  {label === 'Vessels' && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-300 border border-rose-500/30">
                      84
                    </span>
                  )}
                  {label === 'Alerts' && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/30">
                      12
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Dashboard Section */}
          <section className="min-w-0 flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-[1500px]">
              {/* Supervisor Greeting Header */}
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Terminal Operations</span>
                    <ChevronRight className="size-3" />
                    <span className="font-bold text-slate-800">{active}</span>
                  </div>
                  <h1 className="mt-1 text-2xl font-black text-slate-900 lg:text-3xl">
                    {active === 'Dashboard' ? 'Good Morning, Supervisor' : active}
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Port Operations Overview · Los Angeles / Long Beach Complex
                  </p>
                </div>
              </div>

              {/* View Router */}
              {active === '72h Plan' ? (
                <ShiftPlanGrid
                  onOpenAlternateDrawer={() => setRerouteVessel(vessels[0])}
                  onSelectBerth={setSelectedBerth}
                />
              ) : active === 'Vessels' ? (
                <DataTable
                  onSelect={setSelectedVessel}
                  onOpenReroute={setRerouteVessel}
                  onSelectBerth={setSelectedBerth}
                />
              ) : active === 'Berths' ? (
                <BerthsView
                  onSelectBerth={setSelectedBerth}
                  onOpenPdf={() => setPdfReportOpen(true)}
                  onOpenScheduleModal={() => setScheduleModalCategory('Berths')}
                />
              ) : active === 'Cranes' ? (
                <CranesView
                  onSelectCrane={setSelectedCrane}
                  onOpenPdf={() => setPdfReportOpen(true)}
                  onOpenScheduleModal={() => setScheduleModalCategory('Cranes')}
                />
              ) : active === 'Congestion' ? (
                <CongestionView
                  onOpenAlternate={() => setRerouteVessel(vessels[1])}
                  onOpenPdf={() => setPdfReportOpen(true)}
                  onOpenScheduleModal={() => setScheduleModalCategory('Congestion')}
                />
              ) : active === 'Alerts' ? (
                <AlertsView
                  onSelectBerth={setSelectedBerth}
                  onOpenPdf={() => setPdfReportOpen(true)}
                  onOpenScheduleModal={() => setScheduleModalCategory('Alerts')}
                />
              ) : (
                <>
                  {/* KPI Stat Cards - Total Port Overview */}
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                      label="Vessels in Port"
                      value="84"
                      change="12.4%"
                      positive={false}
                      icon={Ship}
                      detail="LA/LB approach queue"
                      badgeText="Vessels"
                      onClick={() => navigate('Vessels')}
                    />
                    <StatCard
                      label="Hotspot Risk"
                      value="3"
                      change="Elevated"
                      positive={false}
                      icon={AlertTriangle}
                      detail="Critical berths queued"
                      badgeText="Risk"
                      onClick={() => navigate('Berths')}
                    />
                    <StatCard
                      label="Berth Saturation"
                      value="87%"
                      change="4.1%"
                      positive={false}
                      icon={Anchor}
                      detail="Critical limit: 85%"
                      badgeText="Berth"
                      onClick={() => navigate('Berths')}
                    />
                    <StatCard
                      label="Operational Alerts"
                      value="12"
                      change="3 Urgent"
                      positive={false}
                      icon={Bell}
                      detail="Requires supervisor action"
                      badgeText="Alerts"
                      onClick={() => navigate('Alerts')}
                    />
                  </div>

                  {/* 2-Column Grid: Left PORT MAP | Right CONGESTION GRAPH */}
                  <div className="mt-6 grid gap-6 xl:grid-cols-2 items-stretch">
                    {/* PORT MAP Panel */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                              <MapPin className="size-4 text-sky-600" /> PORT MAP TELEMETRY
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Live telemetry pins: 🟢 B1 (Nominal) · 🟡 B2 (Medium) · 🔴 B3 (Critical)
                            </p>
                          </div>
                        </div>
                        <PortMap onSelect={setSelectedBerth} />
                      </div>
                      {selectedBerth && (
                        <div className="mt-3 flex items-center justify-between rounded-lg border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs">
                          <span className="font-bold text-sky-900">
                            {selectedBerth} Selected · 4 Gantry Cranes Active
                          </span>
                          <button
                            onClick={() => setSelectedBerth(selectedBerth)}
                            className="font-bold text-sky-700 hover:underline"
                          >
                            View Berth Details &rarr;
                          </button>
                        </div>
                      )}
                    </div>

                    {/* CONGESTION RISK FORECAST CHART - DARK MODE LIKE IMAGE */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0c1421] p-6 shadow-xs text-slate-200 h-full min-h-[400px]">
                      <div className="flex items-start justify-between pb-3">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-wide">
                            {forecastTab === 'Congestion index' ? 'Congestion forecast' : 'Wait time forecast'}
                          </h2>
                          <p className="mt-1.5 text-xs text-slate-400">
                            {forecastTab === 'Congestion index' ? 'Predicted index for the next 72 hours' : 'Expected vessel waiting hours for the next 72 hours'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-[#1a2942] p-1 text-xs">
                          <button
                            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${forecastTab === 'Congestion index' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setForecastTab('Congestion index')}
                          >
                            Congestion index
                          </button>
                          <button
                            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${forecastTab === 'Wait time' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => setForecastTab('Wait time')}
                          >
                            Wait time
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-5 mb-8">
                        <div className="text-[4rem] font-medium text-[#f47285] leading-none tracking-tight">
                          {forecastTab === 'Congestion index' ? '8.7' : '15h'}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1 text-[#f47285] text-sm font-bold">
                            <TrendingUp className="size-4" strokeWidth={3} /> {forecastTab === 'Congestion index' ? '+14.2%' : '+2.5h'}
                          </div>
                          <div className="text-slate-500 text-xs font-semibold">
                            {forecastTab === 'Congestion index' ? 'High risk' : 'Severe delay'}
                          </div>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="relative mt-auto h-48 border-l border-slate-700 pl-3">
                        <div className="flex h-full items-end gap-2.5 px-1">
                          {(forecastTab === 'Congestion index'
                            ? [30, 42, 45, 52, 60, 58, 68, 65, 75, 71, 78, 85, 83, 80, 83, 72, 78, 68, 65, 71, 62, 65, 62, 59]
                            : [10, 15, 20, 25, 30, 35, 40, 45, 55, 65, 75, 95, 90, 85, 75, 65, 55, 45, 35, 30, 25, 20, 15, 10]
                          ).map((val, idx) => {
                            const actualValue = forecastTab === 'Congestion index' ? (val / 10).toFixed(1) : Math.round((val / 100) * 16) + 'h';
                            const labelTime = idx === 0 ? 'Now' : '+' + (idx * 3) + 'h';
                            
                            return (
                              <div key={idx} className="relative flex-1 flex flex-col justify-end h-full group">
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl border border-slate-600">
                                  {labelTime}: {actualValue}
                                </div>
                                
                                {forecastTab === 'Congestion index' && idx === 11 && (
                                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">9</span>
                                )}
                                {forecastTab === 'Wait time' && idx === 11 && (
                                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300">15h</span>
                                )}
                                <div 
                                  className={`w-full rounded-t-[4px] transition-all duration-300 ${idx >= 12 ? 'bg-[#d85c70] group-hover:bg-[#eb6a80]' : 'bg-[#0275a8] group-hover:bg-[#038bc7]'}`}
                                  style={{ height: `${val}%` }}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* X-Axis Labels */}
                      <div className="mt-3 flex justify-between text-[11px] text-slate-500 font-medium px-4">
                        <span>Now</span>
                        <span>+24h</span>
                        <span>+48h</span>
                        <span>+72h</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Crane Detail Telemetry Modal */}
        {selectedCrane && (
          <CraneDetailModal
            crane={selectedCrane}
            onClose={() => setSelectedCrane(null)}
            onReassign={() => setRerouteVessel(vessels[1])}
          />
        )}

        {/* PDF Official Report Document Preview & Print Modal */}
        {pdfReportOpen && (
          <PdfReportModal onClose={() => setPdfReportOpen(false)} />
        )}

        {/* Create Schedule Modal */}
        {scheduleModalCategory && (
          <CreateScheduleModal
            activeCategory={scheduleModalCategory}
            onClose={() => setScheduleModalCategory(null)}
            onSave={() => setScheduleModalCategory(null)}
          />
        )}

        {/* Berth Detail Popover Modal */}
        {selectedBerth && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
            onClick={() => setSelectedBerth(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
                      <Anchor className="size-3.5" /> Berth Telemetry & Telematics
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                      Sensor ID: BRT-{selectedBerth.replace(/[^0-9]/g, '') || '04'}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedBerth} Detailed Information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Location: {selectedBerth.includes('A') ? 'Pier A Container Terminal (South Quay)' : selectedBerth.includes('B') ? 'Pier B Oakland Slip (Deep Channel)' : selectedBerth.includes('400') ? 'Terminal 400 Fast-Track Slip' : 'Pier C Deepwater Slip'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBerth(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                {/* Berth Saturation Bar */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">Occupancy & Capacity Saturation</span>
                    <span className={selectedBerth.includes('B-12') || selectedBerth.includes('A-04') || selectedBerth === 'B2' || selectedBerth === 'B3' ? 'text-rose-600' : 'text-emerald-700'}>
                      {selectedBerth.includes('B-12') ? '94% (Critical Hotspot)' : selectedBerth.includes('A-04') ? '87% (High Load)' : selectedBerth.includes('C-07') ? '74% (Nominal)' : selectedBerth.includes('A-11') ? '62% (Stable)' : selectedBerth.includes('B-03') ? '45% (Buffer Open)' : selectedBerth.includes('400') ? '34% (Clear)' : '58% (Normal)'}
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        selectedBerth.includes('B-12') || selectedBerth.includes('A-04') || selectedBerth === 'B2'
                          ? 'bg-rose-500'
                          : selectedBerth.includes('C-07')
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: selectedBerth.includes('B-12') ? '94%' : selectedBerth.includes('A-04') ? '87%' : selectedBerth.includes('C-07') ? '74%' : selectedBerth.includes('A-11') ? '62%' : selectedBerth.includes('B-03') ? '45%' : selectedBerth.includes('400') ? '34%' : '58%'
                      }}
                    />
                  </div>
                </div>

                {/* Berth Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-500">Currently Docked / Assigned</span>
                    <strong className="block mt-0.5 font-bold text-slate-900 text-sm">
                      {selectedBerth.includes('B-12') || selectedBerth === 'B2' ? 'MSC Irina' : selectedBerth.includes('A-04') || selectedBerth === 'B3' ? 'Ever Given' : selectedBerth.includes('C-07') || selectedBerth === 'B1' ? 'CMA CGM Marco Polo' : selectedBerth.includes('A-11') || selectedBerth === 'B4' ? 'HMM Algeciras' : selectedBerth.includes('400') ? 'Available Fast-Track' : 'OOCL Spain'}
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      {selectedBerth.includes('B-12') ? 'IMO 9929429 · MSC Line' : selectedBerth.includes('A-04') ? 'IMO 9811000 · Evergreen' : 'Commercial Container Vessel'}
                    </span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-500">STS Gantry Cranes</span>
                    <strong className="block mt-0.5 font-bold text-sky-700 text-sm">
                      {selectedBerth.includes('B-12') ? '5 Gantry Cranes' : selectedBerth.includes('A-04') ? '4 Gantry Cranes' : '3 Gantry Cranes'}
                    </strong>
                    <span className="text-[10px] text-emerald-600 font-semibold">32 - 38 moves / hour</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-500">Quay Length & Draft</span>
                    <strong className="block mt-0.5 font-bold text-slate-900">380m Length · 17.5m Draft</strong>
                    <span className="text-[10px] text-slate-500">Super Post-Panamax Capable</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-500">Current Turnaround ETA</span>
                    <strong className="block mt-0.5 font-bold text-slate-900">
                      {selectedBerth.includes('B-12') ? 'Today, 18:00 (Delayed)' : selectedBerth.includes('A-04') ? 'Today, 14:30' : 'Tomorrow, 06:45'}
                    </strong>
                    <span className="text-[10px] text-slate-500">Shift 1 & 2 Handover</span>
                  </div>
                </div>

                {/* AI Relocation Recommendation */}
                <div className={`rounded-xl border p-3.5 ${
                  selectedBerth.includes('B-12') || selectedBerth.includes('A-04') || selectedBerth === 'B2'
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : 'border-sky-200 bg-sky-50 text-sky-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
                    <Sparkles className="size-4" />
                    <span>PortWise AI Operational Directive</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {selectedBerth.includes('B-12')
                      ? '⚠️ Critical Conflict Alert: Heavy backlog detected at Berth B-12. PortWise AI recommends rerouting MSC Irina to Pier 400 to avoid a 14-hour queue and save $340,000 in demurrage costs.'
                      : selectedBerth.includes('A-04')
                      ? '⚠️ High Congestion: Shift 2 crane boost recommended to clear Ever Given 1,400 TEU backlog.'
                      : '✅ Optimal Performance: Berth operational parameters are within nominal thresholds. Proceed with standard shift schedule.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  onClick={() => setSelectedBerth(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedBerth(null)
                    setRerouteVessel(selectedBerth.includes('B-12') ? vessels[1] : vessels[0])
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs"
                >
                  <Route className="size-4" /> Alternate Route Strategy &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vessel Detail Popover Modal */}
        {selectedVessel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
            onClick={() => setSelectedVessel(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                    Vessel Specification
                  </span>
                  <h2 className="mt-0.5 text-xl font-bold text-slate-900">
                    {selectedVessel.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedVessel.line} · {selectedVessel.imo}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVessel(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500">Arrival Schedule</span>
                  <strong className="block mt-0.5 font-bold text-slate-900">{selectedVessel.eta}</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500">Congestion Risk</span>
                  <strong className="block mt-0.5 font-bold text-rose-600">{selectedVessel.risk} Risk</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500">Assigned Location</span>
                  <strong className="block mt-0.5 font-bold text-slate-900">{selectedVessel.berth}</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] text-slate-500">TEU Capacity</span>
                  <strong className="block mt-0.5 font-bold text-slate-900">{selectedVessel.teu} TEU</strong>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVessel(null)
                    setRerouteVessel(selectedVessel)
                  }}
                  className="flex-1 rounded-lg bg-sky-600 py-2.5 text-xs font-bold text-white hover:bg-sky-700"
                >
                  Alternate Route Strategy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alternate Routing Drawer Modal */}
        {rerouteVessel && (
          <AlternateRoutingDrawer
            vessel={rerouteVessel}
            onClose={() => setRerouteVessel(null)}
            onApply={() => setRecommendationApplied(true)}
          />
        )}

        {/* PortWise AI Copilot Drawer Modal */}
        {copilotOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setCopilotOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-[#0c182b] px-5 py-4 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">PortWise AI Copilot</h3>
                    <span className="text-[10px] text-sky-400 font-medium">Real-time Port Intelligence</span>
                  </div>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Suggested Operational Queries
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Reroute Berth B-12 MSC Irina',
                    'Forecast peak congestion window',
                    'West Yard Stack crane boost',
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSendCopilot(preset)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 shadow-2xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {copilotMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white text-xs">
                        <Bot className="size-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-sky-600 text-white font-medium'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t border-slate-200 p-4 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendCopilot()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    placeholder="Ask Copilot about berths, cranes, shifts..."
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

