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
  MoreHorizontal
} from "lucide-react";

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  declare props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

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
        contract_address: "0x71C...9A23"
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
  const [status, setStatus] = useState<'idle' | 'agents_working' | 'expert_validation' | 'complete'>('idle');
  const [generatedAsset, setGeneratedAsset] = useState<R_D_Asset | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const handleSuggestBottleneck = async () => {
      setIsSuggesting(true);
      try {
          if (!ai) return;
          const prompt = `Generate a specific, complex, and random technical R&D bottleneck for the "${challengeData.sector}" industry. It should be a problem where nature/biomimicry might offer a solution (e.g. adhesion, friction, structural color, filtration). Output ONLY the one-sentence problem description.`;
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
    setStatus('agents_working');
    
    try {
        if (!ai) throw new Error("AI not initialized");
        
        // Simulating the 4-step agent pipeline delay
        await new Promise(r => setTimeout(r, 2000)); // Indexer
        await new Promise(r => setTimeout(r, 2000)); // Patent
        await new Promise(r => setTimeout(r, 2000)); // Transposer
        setStatus('expert_validation');
        await new Promise(r => setTimeout(r, 1500)); // Expert

        const prompt = `
            Act as the "Synthesizer Agent" for the BaaS platform. 
            Create a detailed R&D Asset for this problem: "${challengeData.problem}" in the sector: "${challengeData.sector}".
            
            You MUST generate the TIR Scores (Technology, IP, Resources, Market) based on realistic assessment.
            Also generate 3-5 initial tasks for the roadmap.

            Return JSON matching this schema:
            {
                "name": "Technical Title",
                "category": "Industry Category",
                "tir_scores": { "technology": 0-100, "ip": 0-100, "resources": 0-100, "market": 0-100, "composite": 0-100 },
                "trl_current": 1-9,
                "bio_analogs": [{ "species": "Latin Name", "mechanism": "Short description", "key_attribute": "Benefit" }],
                "ip_status": { "freedom_to_operate": "High/Med/Low", "moat_duration_years": number, "patent_filing_strategy": "Strategy description" },
                "supply_chain": [{ "vendor": "Name", "location": "Country", "capability": "Process", "certification": "ISO..." }],
                "financials": { "capex_total": number, "roi_horizon_months": number, "revenue_stream": "Model" },
                "roadmap": [{ "phase": "Name", "duration_months": number, "cost": number, "deliverables": "Output" }],
                "tasks": [{ "id": "T-1", "title": "Task Name", "assignee": "Role", "dueDate": "YYYY-MM-DD", "status": "todo", "priority": "high/medium/low" }]
            }
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

        setGeneratedAsset(asset);
        setStatus('complete');

    } catch (e) {
        console.error(e);
        setStatus('idle');
    }
  };

  if (status === 'complete' && generatedAsset) {
      return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                        <div className="flex gap-3">
                            {["Textile", "Energy", "Construction", "Aerospace"].map(s => (
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <Dna className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                    {status === 'agents_working' && "Agents Orchestration Active"}
                    {status === 'expert_validation' && "Expert Validation & Scoring"}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    {status === 'agents_working' && "Indexeur searching analogs... Brevets analyzing FTO... Transposeur matching suppliers..."}
                    {status === 'expert_validation' && "Calculating TIR Score (Tech, IP, Resources, Market)... Generating Regulatory Alignment Report..."}
                </p>

                <div className="mt-8 flex justify-center gap-2">
                    {['Index', 'Patent', 'Supply', 'Synth', 'Expert'].map((step, i) => (
                        <div key={step} className={`w-2 h-2 rounded-full transition-all duration-500 ${i < (status === 'expert_validation' ? 4 : 2) ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

const App = () => {
    const [view, setView] = useState<View>("dashboard");

    return (
        <ErrorBoundary>
            <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
                {/* Sidebar */}
                <div className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                            <Dna size={18} className="text-white" />
                        </div>
                        <div>
                            <div className="font-serif font-bold text-lg tracking-wide text-white">BaaSify</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Biomimicry as a Service</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Platform</div>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} />
                        <SidebarItem icon={Microscope} label="BioSolver Engine" active={view === "biosolver"} onClick={() => setView("biosolver")} />
                        <SidebarItem icon={Database} label="Validated Assets" active={view === "assets"} onClick={() => setView("assets")} />
                        
                        <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Marketplace</div>
                        <SidebarItem icon={ShoppingCart} label="IP Exchange" active={view === "marketplace"} onClick={() => setView("marketplace")} />
                        <SidebarItem icon={Coins} label="Tokenized SPVs" active={false} onClick={() => {}} />
                        
                        <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin</div>
                        <SidebarItem icon={ShieldCheck} label="Compliance" active={view === "compliance"} onClick={() => setView("compliance")} />
                        <SidebarItem icon={Settings} label="Settings" active={view === "settings"} onClick={() => setView("settings")} />
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <User size={14} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">Dr. Aris V.</div>
                                <div className="text-[10px] text-slate-500 truncate">Lead R&D Architect</div>
                            </div>
                            <Settings size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm flex items-center justify-between px-8 z-10">
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-2"><Globe size={14}/> Global Node: EU-West</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="flex items-center gap-2"><Clock size={14}/> Latency: 14ms</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
                                <SearchIcon size={18} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 transition-colors relative">
                                <BellIcon size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-slate-950"></span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable View Area */}
                    <main className="flex-1 overflow-y-auto p-8 relative">
                        {/* Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none"></div>
                        
                        {view === "dashboard" && <DashboardView />}
                        {view === "biosolver" && <BioSolverView />}
                        {/* Placeholders for other views */}
                        {view === "assets" && <div className="text-center text-slate-500 mt-20">Asset Library Module Loaded</div>}
                        {view === "marketplace" && <div className="text-center text-slate-500 mt-20">IP Marketplace Module Loaded</div>}
                        {view === "compliance" && <div className="text-center text-slate-500 mt-20">Compliance Engine Loaded</div>}
                        {view === "settings" && <div className="text-center text-slate-500 mt-20">System Settings Loaded</div>}
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

const SearchIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const BellIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
