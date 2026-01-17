import React, { useState, useEffect, useRef, Component, ReactNode, ErrorInfo } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";
import {
  LayoutDashboard,
  Dna,
  Leaf,
  ShoppingCart,
  Settings,
  Plus,
  ChevronRight,
  Play,
  Loader2,
  ShieldCheck,
  Globe,
  FileText,
  Microscope,
  Lock,
  Database,
  CheckCircle2,
  Clock,
  QrCode,
  Blocks,
  Link,
  Coins,
  Receipt,
  BarChart3,
  Eye,
  Wallet,
  Zap,
  Share2,
  Download,
  Filter,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Scale,
  Briefcase,
  Info,
  CheckSquare,
  Calendar,
  User,
  X,
  ArrowRightLeft,
  ListTodo,
  MoreHorizontal,
  ClipboardList,
  Recycle,
  Droplets,
  Wind,
  Factory,
  Truck,
  Trash2,
  Search
} from "lucide-react";

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-slate-200">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle size={32} />
              <h1 className="text-xl font-bold">System Encountered an Error</h1>
            </div>
            <p className="text-slate-400 mb-6 text-sm">
              The application encountered an unexpected state. This is often caused by malformed data from the AI model.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/50 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <RefreshCw size={16} /> Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Types (BaaS v2 Architecture) ---

type View = "dashboard" | "biosolver" | "marketplace" | "assets" | "compliance" | "settings";

interface TIRScore {
    technology: number; // 30% weight
    ip: number;         // 25% weight
    resources: number;  // 25% weight
    market: number;     // 20% weight
    composite: number;  // 0-100
}

interface BioAnalog {
    species: string;
    mechanism: string;
    key_attribute: string;
}

interface Supplier {
    vendor: string;
    location: string;
    capability: string;
    certification: string;
}

interface RoadmapPhase {
    phase: string;
    duration_months: number;
    deliverables: string;
    cost: number;
}

interface Task {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
}

interface SPP {
    id: string;
    status: "Draft" | "Certified" | "Pending";
    generatedDate: string;
    metrics: {
        co2_footprint_kg: number;
        water_usage_liters: number;
        recyclability_percent: number;
        energy_efficiency_grade: "A" | "B" | "C" | "D";
    };
    materials: {
        name: string;
        percentage: number;
        origin: "Bio-based" | "Recycled" | "Virgin" | "Synthetic";
    }[];
    lifecycle: {
        stage: string;
        impact_score: number; // 1-10
        description: string;
    }[];
    certifications: string[];
}

interface R_D_Asset {
  id: string;
  name: string;
  category: string;
  generated_date: string;
  
  // Scoring & Readiness
  tir_scores: TIRScore;
  trl_current: number;
  trl_target: number;
  risk_profile: "low" | "medium" | "high";
  
  // Deep Data
  bio_analogs: BioAnalog[];
  
  ip_status: {
    blocking_patents: string[];
    freedom_to_operate: string;
    patent_filing_strategy: string;
    moat_duration_years: number;
  };
  
  supply_chain: Supplier[];
  
  financials: {
    capex_total: number;
    roi_horizon_months: number;
    revenue_stream: string;
  };

  regulatory: {
      alignment: string;
      standards: string[];
  };
  
  roadmap: RoadmapPhase[];
  tasks: Task[];

  // Tokenization
  token_status: "Research" | "Co-Dev" | "Bankable";
  contract_address?: string;
  
  // Compliance
  spp?: SPP;
}

interface LogEntry {
    timestamp: string;
    agent: "System" | "Indexer" | "Patent" | "Supplier" | "Synthesizer";
    message: string;
    status: "info" | "success" | "warning" | "error";
}

// --- Mock Data (Based on "Omniphobic" Example) ---

const MOCK_ASSETS: R_D_Asset[] = [
    {
        id: "OMNIP-STRUC-TX-001",
        name: "Structural Omniphobic Textile (PFAS-Free)",
        category: "Advanced Materials",
        generated_date: "2026-01-15",
        tir_scores: {
            technology: 81,
            ip: 72,
            resources: 79,
            market: 88,
            composite: 80
        },
        trl_current: 4,
        trl_target: 7,
        risk_profile: "medium",
        bio_analogs: [
            { species: "Nelumbo nucifera", mechanism: "Hierarchical micro/nano topography", key_attribute: "Superhydrophobicity" },
            { species: "Stenocara gracilipes", mechanism: "Hydrophilic bumps + hydrophobic troughs", key_attribute: "Directional Flow" }
        ],
        ip_status: {
            blocking_patents: ["US10428461B2"],
            freedom_to_operate: "HIGH (substrate textile focus + plasma process)",
            patent_filing_strategy: "Utility Model on Topography",
            moat_duration_years: 18
        },
        supply_chain: [
            { vendor: "Beyond Surface Tech", location: "Switzerland", capability: "Plasma etching", certification: "ISO 9001" },
            { vendor: "OrganoClick", location: "Sweden", capability: "Bio-binders", certification: "EUDR" }
        ],
        financials: {
            capex_total: 450000,
            roi_horizon_months: 24,
            revenue_stream: "Licensing fee + Royalty per meter"
        },
        regulatory: {
            alignment: "EU Green Deal / REACH Compliant",
            standards: ["ISO 20347", "AATCC 22"]
        },
        roadmap: [
            { phase: "Discovery", duration_months: 2, deliverables: "SEM analysis", cost: 45000 },
            { phase: "Development", duration_months: 5, deliverables: "Plasma protocol", cost: 120000 },
            { phase: "Validation", duration_months: 3, deliverables: "AATCC Certification", cost: 50000 }
        ],
        tasks: [
            { id: "T-101", title: "Acquire SEM imagery of lotus leaf", assignee: "Dr. Aris", dueDate: "2026-02-10", status: "done", priority: "high" },
            { id: "T-102", title: "Draft patent claims for topography", assignee: "Legal Team", dueDate: "2026-02-25", status: "in-progress", priority: "high" },
            { id: "T-103", title: "Source biodegradable plasma substrate", assignee: "Procurement", dueDate: "2026-03-01", status: "todo", priority: "medium" }
        ],
        token_status: "Bankable",
        contract_address: "0x71C...9A23",
        spp: {
            id: "SPP-TX-001",
            status: "Certified",
            generatedDate: "2026-01-20",
            metrics: {
                co2_footprint_kg: 4.2,
                water_usage_liters: 120,
                recyclability_percent: 98,
                energy_efficiency_grade: "A"
            },
            materials: [
                { name: "Cellulose Fiber", percentage: 85, origin: "Bio-based" },
                { name: "Plasma Treatment", percentage: 5, origin: "Synthetic" },
                { name: "Bio-binder", percentage: 10, origin: "Bio-based" }
            ],
            lifecycle: [
                { stage: "Sourcing", impact_score: 2, description: "FSC Certified pulp" },
                { stage: "Manufacturing", impact_score: 4, description: "Low-temp plasma" },
                { stage: "Use Phase", impact_score: 1, description: "Wash-less cleaning" },
                { stage: "End of Life", impact_score: 1, description: "Biodegradable" }
            ],
            certifications: ["Oeko-Tex 100", "EU Ecolabel"]
        }
    },
    {
        id: "WIND-BIONIC-BL-042",
        name: "Tubercle Turbine Blade Efficiency",
        category: "Energy",
        generated_date: "2026-01-10",
        tir_scores: {
            technology: 72,
            ip: 64,
            resources: 68,
            market: 71,
            composite: 69
        },
        trl_current: 5,
        trl_target: 8,
        risk_profile: "high",
        bio_analogs: [
            { species: "Megaptera novaeangliae", mechanism: "Leading edge tubercles", key_attribute: "Stall Delay" }
        ],
        ip_status: {
            blocking_patents: ["WO2021045982A1"],
            freedom_to_operate: "MEDIUM (Requires cross-licensing)",
            patent_filing_strategy: "Design Patent",
            moat_duration_years: 12
        },
        supply_chain: [
            { vendor: "LM Wind Power", location: "Denmark", capability: "Composite molding", certification: "ISO 14001" }
        ],
        financials: {
            capex_total: 1200000,
            roi_horizon_months: 48,
            revenue_stream: "Asset Sale"
        },
        regulatory: {
            alignment: "IEC 61400 Compliant",
            standards: ["IEC 61400-1"]
        },
        roadmap: [
            { phase: "Simulation", duration_months: 6, deliverables: "CFD Validated", cost: 150000 },
            { phase: "Wind Tunnel", duration_months: 4, deliverables: "Scale Model Data", cost: 300000 }
        ],
        tasks: [
            { id: "T-201", title: "Run CFD simulations on NACA 0012", assignee: "Sim Team", dueDate: "2026-03-15", status: "in-progress", priority: "high" },
            { id: "T-202", title: "3D Print 1:50 scale model", assignee: "Lab Tech", dueDate: "2026-04-01", status: "todo", priority: "medium" }
        ],
        token_status: "Co-Dev"
    }
];

const INDUSTRIES = [
    "Textile", 
    "Energy", 
    "Construction", 
    "Aerospace", 
    "Automotive", 
    "Cosmetics", 
    "Packaging", 
    "Agriculture", 
    "Marine"
];

// --- API Client ---

let ai: GoogleGenAI;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
} catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
}

const cleanJson = (text: string) => {
    if (!text) return "{}";
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    let start = -1;
    if (firstBrace === -1 && firstBracket === -1) return "{}";
    if (firstBrace !== -1 && firstBracket === -1) start = firstBrace;
    else if (firstBrace === -1 && firstBracket !== -1) start = firstBracket;
    else start = Math.min(firstBrace, firstBracket);
    const lastBrace = text.lastIndexOf('}');
    const lastBracket = text.lastIndexOf(']');
    let end = -1;
    if (lastBrace === -1 && lastBracket === -1) return "{}";
    if (lastBrace !== -1 && lastBracket === -1) end = lastBrace;
    else if (lastBrace === -1 && lastBracket !== -1) end = lastBracket;
    else end = Math.max(lastBrace, lastBracket);
    if (start === -1 || end === -1 || start > end) return "{}";
    return text.substring(start, end + 1);
};

// --- Components ---

const Tooltip = ({ content, children }: { content: string, children?: ReactNode }) => (
    <div className="group relative flex items-center">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
      active
        ? "bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500"
        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const TIRChart = ({ scores }: { scores: TIRScore }) => (
    <div className="flex gap-2 h-24 items-end justify-between px-2 pt-4 pb-0 bg-slate-900/50 rounded-lg border border-slate-800 relative">
        <div className="absolute top-2 right-2 text-[10px] text-slate-500 font-mono">TIR ANALYSIS</div>
        {['technology', 'ip', 'resources', 'market'].map((key) => {
            const val = scores[key as keyof TIRScore];
            return (
                <div key={key} className="flex flex-col items-center gap-1 w-full group">
                     <div className="relative w-full flex justify-center">
                        <div 
                            className={`w-3 rounded-t-sm transition-all duration-1000 ${
                                key === 'technology' ? 'bg-blue-500' :
                                key === 'ip' ? 'bg-purple-500' :
                                key === 'resources' ? 'bg-emerald-500' : 'bg-gold'
                            }`}
                            style={{ height: `${val * 0.6}px` }} // scaling for 60px max height approx
                        />
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {val}
                        </div>
                     </div>
                     <span className="text-[9px] uppercase text-slate-500 font-mono tracking-tighter">{key.substring(0,4)}</span>
                </div>
            )
        })}
    </div>
);

const TaskBoard = ({ tasks, onTaskUpdate, onAddTask }: { tasks: Task[], onTaskUpdate: (id: string, updates: Partial<Task>) => void, onAddTask: (task: Omit<Task, "id" | "status">) => void }) => {
    const [newTask, setNewTask] = useState<Partial<Task>>({ title: "", assignee: "Unassigned", priority: "medium", dueDate: new Date().toISOString().split('T')[0] });
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (!newTask.title?.trim()) return;
        onAddTask(newTask as any);
        setNewTask({ title: "", assignee: "Unassigned", priority: "medium", dueDate: new Date().toISOString().split('T')[0] });
        setIsAdding(false);
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2"><ClipboardList size={20}/> Project Tasks</h3>
                 <button onClick={() => setIsAdding(!isAdding)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isAdding ? 'bg-slate-800 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>
                     {isAdding ? <X size={16}/> : <Plus size={16}/>} {isAdding ? "Cancel" : "New Task"}
                 </button>
             </div>

             {isAdding && (
                 <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-xl grid gap-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs text-slate-500 mb-1">Task Title</label>
                             <input 
                                type="text" 
                                value={newTask.title} 
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                                placeholder="e.g. Conduct initial stress test..."
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs text-slate-500 mb-1">Assignee</label>
                                 <select 
                                    value={newTask.assignee}
                                    onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                                 >
                                     <option>Unassigned</option>
                                     <option>Dr. Aris</option>
                                     <option>Legal Team</option>
                                     <option>Procurement</option>
                                     <option>Sim Team</option>
                                     <option>Lab Tech</option>
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-xs text-slate-500 mb-1">Priority</label>
                                 <select 
                                    value={newTask.priority}
                                    onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                                 >
                                     <option value="low">Low</option>
                                     <option value="medium">Medium</option>
                                     <option value="high">High</option>
                                 </select>
                             </div>
                         </div>
                     </div>
                     <div className="flex justify-end">
                         <button onClick={handleAdd} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/20">Add to Board</button>
                     </div>
                 </div>
             )}

            <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                {['todo', 'in-progress', 'done'].map((status) => (
                    <div key={status} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
                         <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                             <h3 className="capitalize font-bold text-slate-300 text-sm">{status.replace('-', ' ')}</h3>
                             <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-mono">{tasks.filter(t => t.status === status).length}</span>
                         </div>
                         <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                             {tasks.filter(t => t.status === status).map(task => (
                                 <div key={task.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-600 group transition-all shadow-sm">
                                     <div className="flex justify-between items-start mb-2">
                                         <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${
                                             task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                             task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                             'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                         }`}>{task.priority}</span>
                                         
                                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                             {status !== 'todo' && <button onClick={() => onTaskUpdate(task.id, { status: status === 'done' ? 'in-progress' : 'todo' })} className="p-1 hover:bg-slate-800 rounded text-slate-400" title="Move Back"><ArrowRightLeft size={12}/></button>}
                                             {status !== 'done' && <button onClick={() => onTaskUpdate(task.id, { status: status === 'todo' ? 'in-progress' : 'done' })} className="p-1 hover:bg-emerald-500/20 rounded text-emerald-500" title="Advance"><CheckSquare size={12}/></button>}
                                         </div>
                                     </div>
                                     <p className="text-sm text-slate-200 font-medium mb-3 leading-snug">{task.title}</p>
                                     <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800/50 pt-2">
                                         <div className="flex items-center gap-1"><User size={10}/> {task.assignee}</div>
                                         <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && status !== 'done' ? 'text-red-400' : ''}`}><Calendar size={10}/> {task.dueDate}</div>
                                     </div>
                                 </div>
                             ))}
                             {tasks.filter(t => t.status === status).length === 0 && (
                                 <div className="h-20 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-600">
                                     No tasks
                                 </div>
                             )}
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AgentTerminal = ({ logs }: { logs: LogEntry[] }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs h-64 overflow-y-auto shadow-inner relative">
            <div className="absolute top-2 right-3 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
            <div className="space-y-1.5 pt-2">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 opacity-0 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-forwards">
                        <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                        <span className={`font-bold shrink-0 w-24 ${
                            log.agent === 'System' ? 'text-blue-400' :
                            log.agent === 'Indexer' ? 'text-purple-400' :
                            log.agent === 'Patent' ? 'text-pink-400' :
                            log.agent === 'Supplier' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{log.agent}:</span>
                        <span className={`${
                            log.status === 'success' ? 'text-emerald-300' :
                            log.status === 'warning' ? 'text-amber-300' :
                            log.status === 'error' ? 'text-red-400' : 'text-slate-300'
                        }`}>{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
                <div className="animate-pulse text-emerald-500 font-bold">_</div>
            </div>
        </div>
    );
};

// --- Views ---

const DashboardView = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationPhase(1), 100);
    const timer2 = setTimeout(() => setAnimationPhase(2), 400);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);

  return (
    <div className="relative min-h-full">
        <div className={`mb-8 transition-all duration-700 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-gold font-semibold tracking-wide">
                R&D Ecosystem Overview
            </h1>
            <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mt-1">
                BaaSify v2.0 • TIR Engine Active
            </p>
        </div>

        <section className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8 transition-all duration-1000 delay-200 ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { label: 'Active SPVs', value: "3", icon: Blocks, color: '#C9A962' },
            { label: 'Avg TIR Score', value: "72.4", icon: BarChart3, color: '#4ECDC4' },
            { label: 'Bankable Assets', value: "8", icon: Wallet, color: '#10B981' },
            { label: 'Pipeline Value', value: "€4.2M", icon: TrendingUp, color: '#8B5CF6' },
          ].map((metric) => (
            <div key={metric.label} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="absolute -top-3 -right-3 opacity-5 group-hover:opacity-10 transition-opacity" style={{ color: metric.color }}>
                <metric.icon size={80} />
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-2">
                {metric.label}
              </div>
              <div className="text-2xl font-light font-serif" style={{ color: metric.color }}>
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-slate-200">Recent Validated Solutions</h3>
                    <button className="text-xs text-emerald-500 hover:text-emerald-400">View All</button>
                </div>
                <div className="space-y-4">
                    {MOCK_ASSETS.map(asset => (
                        <div key={asset.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-white">{asset.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${asset.token_status === 'Bankable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {asset.token_status}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">{asset.id} • {asset.category}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 mb-0.5">TIR Score</div>
                                <div className={`text-lg font-bold ${asset.tir_scores.composite > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {asset.tir_scores.composite}/100
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-slate-200 mb-4">Agent Network Status</h3>
                <div className="space-y-4">
                    {[
                        { name: "Agent Indexeur", task: "Scraping bio-lit", status: "Idle", color: "bg-blue-500" },
                        { name: "Agent Brevets", task: "FTO Analysis", status: "Active", color: "bg-purple-500" },
                        { name: "Agent Transposeur", task: "Supplier Match", status: "Active", color: "bg-emerald-500" },
                        { name: "Agent Synthétiseur", task: "Roadmap Gen", status: "Idle", color: "bg-gold" }
                    ].map((agent, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? agent.color + ' animate-pulse' : 'bg-slate-700'}`} />
                                <span className="text-slate-300">{agent.name}</span>
                            </div>
                            <span className="text-xs text-slate-500">{agent.status === 'Active' ? agent.task : 'Waiting'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const BioSolverView = () => {
  const [step, setStep] = useState(1);
  const [challengeData, setChallengeData] = useState({
    sector: "Textile",
    problem: "",
    constraints: "PFAS-Free"
  });
  const [status, setStatus] = useState<'idle' | 'queued' | 'processing' | 'validating' | 'complete'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [generatedAsset, setGeneratedAsset] = useState<R_D_Asset | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [taskId, setTaskId] = useState<string>("");

  const addLog = (agent: LogEntry["agent"], message: string, status: LogEntry["status"] = "info") => {
      setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agent,
          message,
          status
      }]);
  };
  
  const handleSuggestBottleneck = async () => {
      setIsSuggesting(true);
      try {
          if (!ai) return;
          const prompt = `Generate a specific, complex, and random technical R&D bottleneck for the "${challengeData.sector}" industry. It should be a problem where nature/biomimicry might offer a solution. Output ONLY the one-sentence problem description.`;
          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt
          });
          if (response.text) {
              setChallengeData(prev => ({...prev, problem: response.text.trim()}));
          }
      } catch(e) {
          console.error(e);
      } finally {
          setIsSuggesting(false);
      }
  };

  const handleSolve = async () => {
    setStatus('queued');
    setLogs([]);
    const tid = `TASK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTaskId(tid);
    
    // Simulate Async Queue
    addLog('System', `Request received. Task ID: ${tid}`, 'info');
    await new Promise(r => setTimeout(r, 800));
    addLog('System', 'Authenticating with API Gateway...', 'info');
    await new Promise(r => setTimeout(r, 800));
    addLog('System', 'Task enqueued in Redis (Priority: High)', 'success');
    
    setStatus('processing');
    
    try {
        if (!ai) throw new Error("AI not initialized");
        
        // Simulating the Agent Pipeline
        await new Promise(r => setTimeout(r, 1000));
        addLog('Indexer', `Scanning biological literature for "${challengeData.problem}"...`, 'info');
        
        await new Promise(r => setTimeout(r, 1500));
        addLog('Indexer', 'Found 12 potential bio-analogs.', 'success');
        addLog('Indexer', 'Filtering for TRL > 3 feasibility...', 'info');

        await new Promise(r => setTimeout(r, 1200));
        addLog('Patent', 'Checking global patent databases (WIPO, USPTO)...', 'info');
        addLog('Patent', 'Analyzing Freedom-to-Operate (FTO) vectors...', 'warning');

        await new Promise(r => setTimeout(r, 1500));
        addLog('Supplier', 'Matching with EU Green Deal certified vendors...', 'info');
        
        setStatus('validating');
        addLog('System', 'Synthesizing data package...', 'info');

        const prompt = `
            Act as the "Synthesizer Agent". Create a detailed R&D Asset for: "${challengeData.problem}" in "${challengeData.sector}".
            Generate TIR Scores, roadmap, and tasks.
            Return JSON matching the R_D_Asset schema structure (omitting TS types).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(cleanJson(response.text || "{}"));
        
        // Enrich with ID and default structure
        const asset: R_D_Asset = {
            id: `GEN-${Date.now().toString().slice(-6)}`,
            generated_date: new Date().toISOString().split('T')[0],
            risk_profile: data.tir_scores?.composite > 70 ? "low" : "medium",
            token_status: data.tir_scores?.composite > 75 ? "Bankable" : "Co-Dev",
            regulatory: { alignment: "EU Green Deal / REACH", standards: ["ISO 14040"] },
            trl_target: 8,
            ...data
        };

        addLog('Synthesizer', 'Asset structure generated.', 'success');
        addLog('System', 'Calculating TIR Composite Score...', 'info');
        await new Promise(r => setTimeout(r, 800));
        
        setGeneratedAsset(asset);
        setStatus('complete');
        addLog('System', `Task ${tid} completed successfully.`, 'success');

    } catch (e) {
        console.error(e);
        addLog('System', 'Error in agent pipeline execution.', 'error');
        setStatus('idle');
    }
  };

  if (status === 'complete' && generatedAsset) {
      return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setStatus('idle')} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                      <ArrowRightLeft size={20} />
                  </button>
                  <div className="text-sm text-slate-500 font-mono">Result for Task: {taskId}</div>
              </div>
              
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-emerald-500 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20">
                             {generatedAsset.token_status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">ID: {generatedAsset.id}</span>
                      </div>
                      <h1 className="text-3xl font-serif text-white mb-2">{generatedAsset.name}</h1>
                      <div className="flex gap-4 text-sm text-slate-400">
                          <span>{generatedAsset.category}</span>
                          <span>•</span>
                          <span>TRL {generatedAsset.trl_current} → {generatedAsset.trl_target}</span>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Confidence Score</div>
                        <div className="text-3xl font-bold text-emerald-400">{generatedAsset.tir_scores.composite}<span className="text-sm text-slate-600">/100</span></div>
                      </div>
                      <TIRChart scores={generatedAsset.tir_scores} />
                  </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                  {/* Left Column: Bio & IP */}
                  <div className="space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Leaf size={14} className="text-emerald-500"/> Bio-Analogs</h3>
                          {generatedAsset.bio_analogs?.map((bio, i) => (
                              <div key={i} className="mb-3 last:mb-0 p-3 bg-slate-950 rounded border border-slate-800">
                                  <div className="italic text-emerald-400 text-sm">{bio.species}</div>
                                  <div className="text-xs text-slate-400 mt-1">{bio.mechanism}</div>
                              </div>
                          ))}
                      </div>
                       <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-purple-500"/> IP Landscape</h3>
                          <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                  <Tooltip content="Freedom to Operate: Ability to produce without infringing on IP.">
                                      <span className="text-slate-400 border-b border-dotted border-slate-600 cursor-help">Freedom to Operate</span>
                                  </Tooltip>
                                  <span className="text-white font-medium text-right max-w-[120px]">{generatedAsset.ip_status?.freedom_to_operate}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-slate-400">Moat Duration</span>
                                  <span className="text-white font-medium">{generatedAsset.ip_status?.moat_duration_years} Years</span>
                              </div>
                               <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20 text-xs text-purple-300 mt-2">
                                  Strategy: {generatedAsset.ip_status?.patent_filing_strategy}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Middle Column: Roadmap & Supply */}
                  <div className="space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Database size={14} className="text-blue-500"/> Supply Chain</h3>
                           {generatedAsset.supply_chain?.map((sup, i) => (
                              <div key={i} className="mb-2 p-2 flex justify-between items-center border-b border-slate-800/50 last:border-0">
                                  <div>
                                      <div className="text-sm text-white">{sup.vendor}</div>
                                      <div className="text-[10px] text-slate-500">{sup.location}</div>
                                  </div>
                                  <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">{sup.certification}</div>
                              </div>
                          ))}
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gold"/> Financials</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center p-2 bg-slate-950 rounded">
                                  <div className="text-[10px] text-slate-500 uppercase">CAPEX</div>
                                  <div className="text-sm font-bold text-white">€{generatedAsset.financials?.capex_total?.toLocaleString()}</div>
                              </div>
                              <div className="text-center p-2 bg-slate-950 rounded">
                                  <div className="text-[10px] text-slate-500 uppercase">ROI Horizon</div>
                                  <div className="text-sm font-bold text-emerald-400">{generatedAsset.financials?.roi_horizon_months} mths</div>
                              </div>
                          </div>
                          <div className="text-xs text-slate-400 border-t border-slate-800 pt-2">
                              Model: {generatedAsset.financials?.revenue_stream}
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="space-y-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-4">Validation Roadmap</h3>
                          <div className="space-y-4 relative pl-4 border-l border-slate-800 ml-2">
                              {generatedAsset.roadmap?.map((phase, i) => (
                                  <div key={i} className="relative">
                                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                                      <div className="text-xs text-emerald-500 font-mono mb-0.5">{phase.phase}</div>
                                      <div className="text-sm text-white mb-1">{phase.deliverables}</div>
                                      <div className="text-[10px] text-slate-500">€{phase.cost.toLocaleString()} • {phase.duration_months} mo</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <button 
                        onClick={() => setStatus('idle')}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all text-sm font-medium"
                      >
                          Start New Simulation
                      </button>
                      <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                          <Wallet size={16} /> Save to Vault
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
        {status === 'idle' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">New Industrial Challenge</h2>
                    <p className="text-slate-400 text-sm">Orchestrate the 4-Agent Pipeline to find high-TIR biomimetic solutions.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Industrial Sector</label>
                        <div className="flex flex-wrap gap-3">
                            {INDUSTRIES.map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setChallengeData({...challengeData, sector: s})}
                                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${challengeData.sector === s ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-700 text-slate-400'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                             <label className="block text-sm font-medium text-slate-300">Technical Bottleneck</label>
                             <button 
                                onClick={handleSuggestBottleneck}
                                disabled={isSuggesting}
                                className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
                             >
                                 {isSuggesting ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                                 Suggest Random Challenge
                             </button>
                        </div>
                        <textarea 
                            value={challengeData.problem}
                            onChange={(e) => setChallengeData({...challengeData, problem: e.target.value})}
                            placeholder="e.g. Reduce friction in pipelines using shark-skin textures..."
                            className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleSolve}
                        disabled={!challengeData.problem}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                    >
                        <Zap size={20} fill="currentColor" /> Deploy Agents
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                    <div className={`absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent ${status !== 'complete' ? 'animate-spin' : ''}`}></div>
                    <Dna className="absolute inset-0 m-auto text-emerald-500" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                    {status === 'queued' && "Queueing Task..."}
                    {status === 'processing' && "Agent Swarm Active"}
                    {status === 'validating' && "Finalizing Synthesis"}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                    Task ID: <span className="font-mono text-emerald-400">{taskId}</span>
                </p>

                <AgentTerminal logs={logs} />

                <div className="mt-8 flex justify-center gap-2">
                    {['queued', 'processing', 'validating', 'complete'].map((s, i) => (
                        <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            ['queued', 'processing', 'validating', 'complete'].indexOf(status) >= i ? 'bg-emerald-500 scale-125' : 'bg-slate-800'
                        }`} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

const ComparisonOverlay = ({ assets, onClose }: { assets: R_D_Asset[], onClose: () => void }) => (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-3">
                    <ArrowRightLeft className="text-emerald-500" /> Asset Comparison
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
                <div className="grid border border-slate-800 rounded-xl overflow-hidden bg-slate-950" style={{ gridTemplateColumns: `200px repeat(${assets.length}, 1fr)` }}>
                    {/* Header Row */}
                    <div className="bg-slate-900/80 p-4 border-b border-r border-slate-800 font-bold text-slate-400 text-sm">Metric</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="bg-slate-900/50 p-4 border-b border-r border-slate-800 last:border-r-0 font-bold text-white text-sm">
                            {asset.name}
                            <div className="text-[10px] text-slate-500 font-normal mt-1">{asset.id}</div>
                        </div>
                    ))}

                    {/* TIR Composite */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">TIR Composite</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-white">
                            <span className={`text-lg font-bold ${asset.tir_scores.composite > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {asset.tir_scores.composite}
                            </span>
                            <span className="text-xs text-slate-500">/100</span>
                        </div>
                    ))}

                    {/* Technology Score */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-500 text-xs pl-8">Technology</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm">
                            {asset.tir_scores.technology}
                        </div>
                    ))}

                     {/* IP Score */}
                     <div className="p-4 border-b border-r border-slate-800 text-slate-500 text-xs pl-8">IP Strategy</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm">
                            {asset.tir_scores.ip}
                        </div>
                    ))}
                    
                    {/* Category */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">Category</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm">
                            {asset.category}
                        </div>
                    ))}

                    {/* TRL */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">Readiness Level</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm">
                            TRL {asset.trl_current} <span className="text-slate-600">→</span> {asset.trl_target}
                        </div>
                    ))}

                    {/* CAPEX */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">Est. CAPEX</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm font-mono">
                            €{asset.financials.capex_total.toLocaleString()}
                        </div>
                    ))}

                    {/* ROI */}
                    <div className="p-4 border-b border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">ROI Horizon</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300 text-sm">
                            {asset.financials.roi_horizon_months} Months
                        </div>
                    ))}

                    {/* Token Status */}
                    <div className="p-4 border-r border-slate-800 text-slate-400 text-sm font-medium bg-slate-900/30">Token Status</div>
                    {assets.map(asset => (
                        <div key={asset.id} className="p-4 border-r border-slate-800 last:border-r-0">
                            <span className={`text-xs px-2 py-1 rounded border ${
                                asset.token_status === 'Bankable' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                                {asset.token_status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const AssetsView = () => {
    const [selectedAssetId, setSelectedAssetId] = useState<string>(MOCK_ASSETS[0].id);
    const [activeTab, setActiveTab] = useState<'passport' | 'tasks'>('passport');
    const [compareMode, setCompareMode] = useState(false);
    const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Local state for assets to allow task updates (in a real app this would be global store)
    const [assets, setAssets] = useState<R_D_Asset[]>(MOCK_ASSETS);
    
    const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
    const filteredAssets = assets.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleCompareSelection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedForCompare.includes(id)) {
            setSelectedForCompare(prev => prev.filter(item => item !== id));
        } else if (selectedForCompare.length < 3) {
            setSelectedForCompare(prev => [...prev, id]);
        }
    };

    const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
        setAssets(prev => prev.map(asset => {
            if (asset.id !== selectedAssetId) return asset;
            return {
                ...asset,
                tasks: asset.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
            };
        }));
    };

    const handleAddTask = (newTask: Omit<Task, "id" | "status">) => {
        setAssets(prev => prev.map(asset => {
            if (asset.id !== selectedAssetId) return asset;
            const task: Task = {
                id: `T-${Date.now()}`,
                ...newTask,
                status: 'todo'
            };
            return { ...asset, tasks: [...asset.tasks, task] };
        }));
    };

    return (
        <>
            <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
                {/* Left Sidebar: Asset List */}
                <div className="w-80 flex flex-col gap-4 border-r border-slate-800 pr-6">
                    <div className="mb-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white">Digital Vault</h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setCompareMode(!compareMode); setSelectedForCompare([]); }} 
                                    className={`p-2 rounded-lg border transition-colors ${compareMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                                    title="Compare Assets"
                                >
                                    <ArrowRightLeft size={16}/>
                                </button>
                                <button className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20"><Plus size={16}/></button>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Vault..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pb-20">
                        {filteredAssets.map(asset => (
                            <div 
                                key={asset.id}
                                onClick={() => !compareMode && setSelectedAssetId(asset.id)}
                                className={`p-4 rounded-xl border transition-all group relative ${
                                    selectedAsset.id === asset.id && !compareMode
                                    ? "bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-900/10" 
                                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                } ${compareMode ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                                {compareMode && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedForCompare.includes(asset.id)}
                                            onChange={() => {}} 
                                            onClick={(e) => toggleCompareSelection(asset.id, e)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                        asset.token_status === 'Bankable' ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20' : 'text-amber-400 bg-amber-950/30 border-amber-500/20'
                                    }`}>
                                        {asset.token_status}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{asset.generated_date}</span>
                                </div>
                                <h3 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors line-clamp-1">{asset.name}</h3>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xs text-slate-500">{asset.id}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-slate-500 uppercase">TIR</span>
                                        <span className={`text-sm font-bold ${asset.tir_scores.composite > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{asset.tir_scores.composite}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {compareMode && (
                        <div className="absolute bottom-8 left-8 w-[19rem] p-4 bg-slate-800 border-t border-slate-700 rounded-t-xl z-20 shadow-2xl">
                             <div className="flex justify-between items-center mb-3">
                                 <span className="text-sm font-bold text-white">{selectedForCompare.length} Selected</span>
                                 <button onClick={() => setCompareMode(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                             </div>
                             <button 
                                disabled={selectedForCompare.length < 2}
                                className="w-full py-2 bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-bold transition-colors"
                             >
                                 Compare Assets
                             </button>
                        </div>
                    )}
                </div>

                {/* Main Content: Asset Passport */}
                <div className="flex-1 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                         <div className="relative z-10">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                     <h1 className="text-2xl font-serif font-bold text-white mb-2">{selectedAsset.name}</h1>
                                     <div className="flex gap-6 text-sm text-slate-400">
                                         <span className="flex items-center gap-2"><Globe size={14}/> {selectedAsset.category}</span>
                                         <span className="flex items-center gap-2"><ShieldCheck size={14}/> {selectedAsset.risk_profile.toUpperCase()} Risk</span>
                                         {selectedAsset.contract_address && <span className="flex items-center gap-2 font-mono text-emerald-400"><Link size={14}/> {selectedAsset.contract_address}</span>}
                                     </div>
                                </div>
                                <div className="bg-white p-2 rounded-lg">
                                     <QrCode size={80} className="text-slate-900"/>
                                </div>
                             </div>
                             
                             <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg w-fit border border-slate-800">
                                 <button 
                                    onClick={() => setActiveTab('passport')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'passport' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                    <FileText size={14} /> Passport Data
                                 </button>
                                 <button 
                                    onClick={() => setActiveTab('tasks')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                    <ListTodo size={14} /> Project Tasks
                                    <span className="bg-slate-700 text-white text-[10px] px-1.5 rounded-full">{selectedAsset.tasks.length}</span>
                                 </button>
                             </div>
                         </div>
                    </div>

                    {activeTab === 'passport' ? (
                        <>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">TIR Scoring</h3>
                                        <Tooltip content="Technology, IP, Resources, Market - A composite readiness score.">
                                            <Info size={14} className="text-slate-500 hover:text-slate-300 cursor-help"/>
                                        </Tooltip>
                                    </div>
                                    <TIRChart scores={selectedAsset.tir_scores} />
                                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Composite Score</span>
                                        <span className="text-xl font-bold text-emerald-400">{selectedAsset.tir_scores.composite}/100</span>
                                    </div>
                                </div>
                                <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-2 gap-8">
                                    <div>
                                         <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Financial Readiness</h3>
                                         <div className="space-y-3">
                                             <div className="flex justify-between text-sm">
                                                 <Tooltip content="Estimated Capital Expenditure for pilot phase"><span className="text-slate-400 border-b border-dotted border-slate-600">Total CAPEX (Est.)</span></Tooltip>
                                                 <span className="text-white font-mono">€{selectedAsset.financials.capex_total.toLocaleString()}</span>
                                             </div>
                                             <div className="flex justify-between text-sm">
                                                 <span className="text-slate-400">ROI Horizon</span>
                                                 <span className="text-white font-mono">{selectedAsset.financials.roi_horizon_months} months</span>
                                             </div>
                                             <div className="flex justify-between text-sm">
                                                 <span className="text-slate-400">Token Status</span>
                                                 <span className="text-emerald-400 font-bold">{selectedAsset.token_status}</span>
                                             </div>
                                         </div>
                                    </div>
                                    <div>
                                         <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Regulatory & IP</h3>
                                         <div className="space-y-3">
                                             <div className="flex justify-between text-sm">
                                                 <Tooltip content="Legal assessment of ability to commercialize without infringement"><span className="text-slate-400 border-b border-dotted border-slate-600">FTO Status</span></Tooltip>
                                                 <span className="text-white font-medium text-right text-xs max-w-[120px]">{selectedAsset.ip_status.freedom_to_operate}</span>
                                             </div>
                                             <div className="flex justify-between text-sm">
                                                 <span className="text-slate-400">EU Alignment</span>
                                                 <span className="text-emerald-400 font-medium text-xs text-right">{selectedAsset.regulatory.alignment}</span>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Supply Chain & Execution</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedAsset.supply_chain.map((sup, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                                            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-500 font-bold">
                                                {sup.vendor.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-200">{sup.vendor}</div>
                                                <div className="text-xs text-slate-500">{sup.location} • {sup.capability}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <TaskBoard 
                            tasks={selectedAsset.tasks} 
                            onTaskUpdate={handleTaskUpdate}
                            onAddTask={handleAddTask}
                        />
                    )}
                </div>
            </div>

            {compareMode && selectedForCompare.length >= 2 && (
                <ComparisonOverlay 
                    assets={assets.filter(a => selectedForCompare.includes(a.id))} 
                    onClose={() => setCompareMode(false)}
                />
            )}
        </>
    );
};

const MarketplaceView = () => (
    <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-serif font-bold text-slate-200">Solution Marketplace</h2>
                <p className="text-slate-400 text-sm font-light mt-1">Trade and license verified biomimetic IP assets.</p>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 text-sm hover:text-white hover:border-slate-500 transition-colors">
                    <Filter size={14} /> TIR > 75 (Bankable)
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ASSETS.map((asset) => (
                <div key={asset.id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-xl">
                    <div className="h-40 bg-slate-800 relative p-6 overflow-hidden">
                        <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono border border-white/10 flex items-center gap-1 text-white">
                             {asset.category}
                        </div>
                        <Leaf className="text-emerald-500/20 absolute -bottom-4 -left-4" size={120} />
                        <div className="absolute bottom-4 left-4 z-10">
                             <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Composite Score</div>
                             <div className="text-3xl font-serif font-medium text-white">{asset.tir_scores.composite}</div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">{asset.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                             Fully validated solution based on {asset.bio_analogs[0]?.species}. High FTO and EU Green Deal aligned.
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-6 pt-4 border-t border-slate-800">
                             <span>TRL {asset.trl_current}</span>
                             <span>{asset.financials.roi_horizon_months}m ROI Horizon</span>
                        </div>

                        <div className="flex gap-2">
                            {asset.token_status === 'Bankable' ? (
                                <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/20">
                                    License Now
                                </button>
                            ) : (
                                <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium border border-slate-700">
                                    Co-Develop
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ComplianceView = () => {
    // In a real app, this would use global state
    const [assets, setAssets] = useState<R_D_Asset[]>(MOCK_ASSETS);
    const [selectedAssetId, setSelectedAssetId] = useState<string>(MOCK_ASSETS[0].id);
    const [searchQuery, setSearchQuery] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
    const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleGenerateSPP = async () => {
        setIsGenerating(true);
        try {
             if (!ai) throw new Error("AI not initialized");
             const prompt = `
                Generate a sustainable product passport (SPP) JSON for this industrial asset: 
                Name: ${selectedAsset.name}
                Category: ${selectedAsset.category}
                Bio-Analog: ${selectedAsset.bio_analogs[0]?.species}

                Estimate realistic environmental metrics.
                Output JSON strictly adhering to this schema:
                {
                    "co2_footprint_kg": number,
                    "water_usage_liters": number,
                    "recyclability_percent": number,
                    "energy_efficiency_grade": "A" | "B" | "C" | "D",
                    "materials": [{"name": string, "percentage": number, "origin": "Bio-based" | "Recycled" | "Virgin" | "Synthetic"}],
                    "lifecycle": [{"stage": "Manufacturing" | "Distribution" | "Use" | "End of Life", "impact_score": number (1-10), "description": string}],
                    "certifications": string[]
                }
             `;

             const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const data = JSON.parse(cleanJson(response.text || "{}"));
            
            const newSPP: SPP = {
                id: `SPP-${Date.now().toString().slice(-6)}`,
                status: "Certified",
                generatedDate: new Date().toISOString().split('T')[0],
                metrics: {
                    co2_footprint_kg: data.co2_footprint_kg || 10,
                    water_usage_liters: data.water_usage_liters || 100,
                    recyclability_percent: data.recyclability_percent || 80,
                    energy_efficiency_grade: data.energy_efficiency_grade || "B"
                },
                materials: data.materials || [],
                lifecycle: data.lifecycle || [],
                certifications: data.certifications || []
            };

            setAssets(prev => prev.map(a => a.id === selectedAssetId ? { ...a, spp: newSPP } : a));

        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
             {/* Left Sidebar: Asset Audit List */}
             <div className="w-80 flex flex-col gap-4 border-r border-slate-800 pr-6">
                <div className="mb-2">
                    <h2 className="text-lg font-bold text-white mb-4">Audit Queue</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter assets..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredAssets.map(asset => (
                        <div 
                            key={asset.id}
                            onClick={() => setSelectedAssetId(asset.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                selectedAsset.id === asset.id 
                                ? "bg-slate-800 border-emerald-500/50 shadow-md" 
                                : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`w-2 h-2 rounded-full mt-1.5 ${asset.spp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></span>
                                <span className="text-[10px] text-slate-500 font-mono">{asset.id}</span>
                            </div>
                            <h3 className={`text-sm font-medium ${selectedAsset.id === asset.id ? 'text-white' : 'text-slate-400'} ml-4 line-clamp-1`}>{asset.name}</h3>
                            <div className="ml-4 mt-1">
                                {asset.spp ? (
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex w-fit items-center gap-1">
                                        <CheckCircle2 size={8}/> Passport Ready
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-slate-800 text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">Pending Audit</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content: Digital Product Passport */}
            <div className="flex-1 overflow-y-auto">
                {selectedAsset.spp ? (
                    <div className="space-y-6">
                        {/* Passport Header */}
                        <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <QrCode size={120} className="text-emerald-500"/>
                            </div>
                            <div className="relative z-10 flex gap-6">
                                <div className="bg-white p-2 rounded-xl shadow-xl">
                                    <QrCode size={80} className="text-slate-900"/>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-serif font-bold text-white tracking-wide">Digital Product Passport</h1>
                                        <span className="bg-emerald-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Verified</span>
                                    </div>
                                    <p className="text-slate-300 font-medium mb-1">{selectedAsset.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">UUID: {selectedAsset.spp.id} • REV: 1.0 • {selectedAsset.spp.generatedDate}</p>
                                    <div className="flex gap-2 mt-4">
                                        {selectedAsset.spp.certifications.map(c => (
                                            <span key={c} className="text-[10px] border border-slate-600 rounded px-2 py-1 text-slate-400">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/20 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Carbon Footprint</span>
                                    <Wind size={16} className="text-slate-400"/>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{selectedAsset.spp.metrics.co2_footprint_kg} <span className="text-sm font-normal text-slate-500">kg CO2e</span></div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full" style={{ width: '35%' }}></div>
                                </div>
                                <div className="text-[10px] text-emerald-400 mt-2">Top 10% of category</div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/20 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Water Intensity</span>
                                    <Droplets size={16} className="text-blue-400"/>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{selectedAsset.spp.metrics.water_usage_liters} <span className="text-sm font-normal text-slate-500">L / unit</span></div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '20%' }}></div>
                                </div>
                                <div className="text-[10px] text-blue-400 mt-2">-40% vs conventional</div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/20 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Circularity</span>
                                    <Recycle size={16} className="text-amber-400"/>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{selectedAsset.spp.metrics.recyclability_percent}% <span className="text-sm font-normal text-slate-500">Recyclable</span></div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${selectedAsset.spp.metrics.recyclability_percent}%` }}></div>
                                </div>
                                <div className="text-[10px] text-amber-400 mt-2">Design for Disassembly</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Composition */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-white mb-6">Material Composition</h3>
                                <div className="space-y-4">
                                    {selectedAsset.spp.materials.map((m, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-300">{m.name}</span>
                                                <span className="text-slate-500">{m.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                                                <div 
                                                    className={`h-full ${m.origin === 'Bio-based' ? 'bg-emerald-500' : m.origin === 'Recycled' ? 'bg-blue-500' : 'bg-slate-600'}`} 
                                                    style={{ width: `${m.percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-[10px] text-slate-600 mt-0.5 text-right">{m.origin}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Lifecycle */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-white mb-6">Lifecycle Assessment (LCA)</h3>
                                <div className="space-y-0 relative border-l border-slate-800 ml-2">
                                    {selectedAsset.spp.lifecycle.map((step, i) => (
                                        <div key={i} className="pl-6 pb-6 relative last:pb-0">
                                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-sm font-medium text-slate-200">{step.stage}</h4>
                                                    <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                                                </div>
                                                <span className={`text-xs font-bold ${step.impact_score < 4 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    Impact: {step.impact_score}/10
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <ShieldCheck size={40} className="text-slate-600"/>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Passport Found</h2>
                        <p className="text-slate-400 max-w-md mb-8">
                            This asset has not yet undergone the environmental impact audit required for the EU Green Deal compliance.
                        </p>
                        <button 
                            onClick={handleGenerateSPP}
                            disabled={isGenerating}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all"
                        >
                            {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>}
                            {isGenerating ? "Auditing Asset..." : "Generate Digital Passport"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsView = () => (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-white mb-2">Service Models & Billing</h2>
        <p className="text-slate-400">Choose how you want to collaborate with the BaaS platform. Four tiers designed for scale.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Offer 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4"><Briefcase size={20}/></div>
                  <h3 className="text-lg font-bold text-white">Internal R&D CoS</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[40px]">De-risk your own innovation pipeline with verified biomimetic solutions.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-blue-500 shrink-0"/> 20-50 Challenges/Year</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-blue-500 shrink-0"/> Full IP Ownership</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-blue-500 shrink-0"/> Infra Cost + Margin</li>
              </ul>
              <div className="mt-auto">
                  <div className="text-2xl font-bold text-white mb-4">€4k<span className="text-xs font-normal text-slate-500"> / challenge</span></div>
                  <button className="w-full py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 font-medium text-sm">Start Internal</button>
              </div>
          </div>

          {/* Offer 2 */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col relative shadow-[0_0_20px_rgba(16,185,129,0.05)]">
              <div className="mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4"><ShieldCheck size={20}/></div>
                  <h3 className="text-lg font-bold text-white">Enterprise Licensing</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[40px]">Acquire "Solution Modules" ready for prototyping and scaling.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Full Technical Dossier</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Pre-Qualified Suppliers</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-emerald-500 shrink-0"/> Geo/Sector Exclusivity</li>
              </ul>
              <div className="mt-auto">
                  <div className="text-2xl font-bold text-white mb-4">€150k<span className="text-xs font-normal text-slate-500"> / license</span></div>
                  <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold text-sm shadow-lg shadow-emerald-900/20">License Solution</button>
              </div>
          </div>

          {/* Offer 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4"><Database size={20}/></div>
                  <h3 className="text-lg font-bold text-white">Marketplace Sub</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[40px]">Continuous access to our stream of verified solutions.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-purple-500 shrink-0"/> Read-Only Access (Tier 1)</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-purple-500 shrink-0"/> Download Assets (Tier 2)</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-purple-500 shrink-0"/> Priority Support</li>
              </ul>
              <div className="mt-auto">
                  <div className="text-2xl font-bold text-white mb-4">€8k<span className="text-xs font-normal text-slate-500"> / month</span></div>
                  <button className="w-full py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 font-medium text-sm">Subscribe Tier 2</button>
              </div>
          </div>

          {/* Offer 4 */}
          <div className="bg-gradient-to-br from-slate-900 to-[#C9A962]/10 border border-[#C9A962]/30 rounded-2xl p-6 flex flex-col relative overflow-hidden">
               <div className="absolute top-3 right-3 text-[10px] font-mono text-[#C9A962] border border-[#C9A962]/30 px-2 py-0.5 rounded uppercase">ADGM Regulated</div>
              <div className="mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A962]/10 text-[#C9A962] flex items-center justify-center mb-4"><Coins size={20}/></div>
                  <h3 className="text-lg font-bold text-white">Token RWA</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[40px]">Scale capital via dNFTs representing underlying royalty streams.</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-[#C9A962] shrink-0"/> Fractional IP Ownership</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-[#C9A962] shrink-0"/> Royalty Waterfall</li>
                  <li className="flex gap-2 text-xs text-slate-300"><CheckCircle2 size={14} className="text-[#C9A962] shrink-0"/> Liquid Secondary Market</li>
              </ul>
              <div className="mt-auto">
                  <div className="text-2xl font-bold text-white mb-4">60/40<span className="text-xs font-normal text-slate-500"> Split</span></div>
                  <button className="w-full py-2 bg-[#C9A962] text-slate-900 rounded-lg hover:bg-[#b89a55] font-bold text-sm">Invest in SPV</button>
              </div>
          </div>
      </div>
    </div>
);

const App = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
      <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full bg-slate-950 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 text-emerald-500 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"><Dna size={20} className="text-white" /></div>
            <span className="text-xl font-bold tracking-tight text-white">BaaS<span className="font-light text-emerald-500">ify</span></span>
          </div>
          <div className="mb-6 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl flex flex-col gap-1 cursor-pointer hover:border-emerald-500/50 transition-colors group">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Current Node</span>
            <div className="flex items-center justify-between"><span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Paris-Industrial-1</span><div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div></div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <SidebarItem icon={Microscope} label="Bio-Solver (Agent)" active={currentView === "biosolver"} onClick={() => setCurrentView("biosolver")} />
          <SidebarItem icon={ShoppingCart} label="Marketplace" active={currentView === "marketplace"} onClick={() => setCurrentView("marketplace")} />
          <SidebarItem icon={Lock} label="Digital Vault" active={currentView === "assets"} onClick={() => setCurrentView("assets")} />
          <SidebarItem icon={ShieldCheck} label="Compliance" active={currentView === "compliance"} onClick={() => setCurrentView("compliance")} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <SidebarItem icon={Briefcase} label="Business Models" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="hover:text-slate-300 cursor-pointer">Platform</span>
                <ChevronRight size={14} />
                <span className="text-white capitalize bg-slate-900 px-2 py-1 rounded border border-slate-800">{currentView === "biosolver" ? "Biomimetic Solver" : currentView === 'assets' ? 'Asset Passport' : currentView === 'settings' ? 'Monetization' : currentView}</span>
            </div>
            <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                    <Globe size={12} /> EU Green Deal Ready
                 </button>
            </div>
        </header>
        
        <ErrorBoundary>
            {currentView === "dashboard" && <DashboardView />}
            {currentView === "biosolver" && <BioSolverView />}
            {currentView === "marketplace" && <MarketplaceView />}
            {currentView === "assets" && <AssetsView />}
            {currentView === "compliance" && <ComplianceView />}
            {currentView === "settings" && <SettingsView />}
        </ErrorBoundary>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);