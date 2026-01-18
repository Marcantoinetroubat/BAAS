
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
  Volume2,
  VolumeX,
  StopCircle
} from "lucide-react";

// --- Types ---

type View = "dashboard" | "biosolver" | "marketplace" | "assets" | "compliance" | "settings";

interface TIRScore {
    technology: number;
    ip: number;
    resources: number;
    market: number;
    composite: number;
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
  tir_scores: TIRScore;
  trl_current: number;
  trl_target: number;
  risk_profile: "low" | "medium" | "high";
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
  token_status: "Research" | "Co-Dev" | "Bankable";
  contract_address?: string;
}

// --- Mock Data ---

const MOCK_ASSETS: R_D_Asset[] = [
  {
    id: "ASSET-001",
    name: "Myco-Structure High-Load",
    category: "Construction",
    generated_date: "2024-11-12",
    tir_scores: { technology: 85, ip: 70, resources: 90, market: 65, composite: 78 },
    trl_current: 4,
    trl_target: 7,
    risk_profile: "medium",
    bio_analogs: [{ species: "Mycelium", mechanism: "Hyphal branching", key_attribute: "Compressive strength" }],
    ip_status: { blocking_patents: [], freedom_to_operate: "High", patent_filing_strategy: "Defensive", moat_duration_years: 15 },
    supply_chain: [{ vendor: "BioFab Corp", location: "Netherlands", capability: "Fermentation", certification: "ISO 14001" }],
    financials: { capex_total: 1200000, roi_horizon_months: 36, revenue_stream: "Licensing" },
    regulatory: { alignment: "EU Green Deal", standards: ["EN 1990"] },
    roadmap: [],
    tasks: [],
    token_status: "Bankable"
  },
  {
    id: "ASSET-002",
    name: "Hydro-Repel Lotus Coating",
    category: "Textile",
    generated_date: "2024-12-01",
    tir_scores: { technology: 92, ip: 88, resources: 60, market: 95, composite: 84 },
    trl_current: 6,
    trl_target: 9,
    risk_profile: "low",
    bio_analogs: [{ species: "Nelumbo nucifera", mechanism: "Nanoscale wax pillars", key_attribute: "Self-cleaning" }],
    ip_status: { blocking_patents: [], freedom_to_operate: "Medium", patent_filing_strategy: "Aggressive", moat_duration_years: 20 },
    supply_chain: [{ vendor: "ChemTech", location: "Germany", capability: "Nano-coating", certification: "ISO 9001" }],
    financials: { capex_total: 450000, roi_horizon_months: 18, revenue_stream: "Product Sales" },
    regulatory: { alignment: "REACH Compliant", standards: ["OEKO-TEX"] },
    roadmap: [],
    tasks: [],
    token_status: "Co-Dev"
  }
];

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
              <h1 className="text-xl font-bold">Système en erreur</h1>
            </div>
            <p className="text-slate-400 mb-6 text-sm">
              L'application a rencontré un état inattendu. Cela est souvent dû à une réponse malformée du modèle IA.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/50 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <RefreshCw size={16} /> Redémarrer le système
            </button>
          </div>
        </div>
      );
    }
    // Fixed: Correctly using this.props.children
    return this.props.children;
  }
}

// --- API Client ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const cleanJson = (text: string) => {
    if (!text) return "{}";
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return "{}";
    return text.substring(start, end + 1);
};

// --- Components ---

const VoiceNarrator = ({ asset }: { asset: R_D_Asset }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Fonction de nettoyage pour éviter que la voix ne prononce les symboles Markdown
    const sanitizeTextForSpeech = (text: string) => {
        return text
            .replace(/\*/g, '')      // Supprime les astérisques
            .replace(/#/g, '')       // Supprime les dièses
            .replace(/_/g, '')       // Supprime les underscores
            .replace(/-/g, ' ')      // Remplace les tirets par des espaces pour une meilleure respiration
            .replace(/\[|\]/g, '')   // Supprime les crochets
            .trim();
    };

    const togglePlayback = async () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        setIsGenerating(true);
        try {
            const prompt = `
                RÔLE : Expert Stratège en Innovation de Rupture & Économie Bleue.
                OBJECTIF : Synthèse décisionnelle de l'actif "${asset.name}" pour un Chef d'Entreprise.
                TON : Captivant, professionnel, inspirant et rapide. Évite absolument tout jargon inutile.
                
                DONNÉES CLÉS :
                Secteur : ${asset.category}
                Biologie : ${asset.bio_analogs.map(b => b.species + " (" + b.mechanism + ")").join(", ")}
                Moat IP : ${asset.ip_status.moat_duration_years} ans.

                INSTRUCTIONS DE NARRATION (Max 75 secondes) :
                1. DÉPASSER L'EXISTANT : Explique pourquoi cette approche biomimétique rend les solutions actuelles (souvent chimiques ou polluantes) totalement obsolètes. Parle de saut qualitatif.
                2. AVANTAGES UTILISATEUR : Insiste sur la valeur pour l'utilisateur final : naturalité, durabilité et expérience enrichie.
                3. IMPACT VERT ET CRÉDIT CARBONE : Souligne comment cet actif génère des crédits carbone et s'aligne sur les exigences environnementales les plus strictes de demain.
                4. LEADERSHIP : Conclus sur la place de leader de marché que cet actif garantit.
                
                IMPORTANT : Ne mets aucun symbole Markdown comme des astérisques ou des dièses dans ta réponse. Utilise uniquement du texte brut. Français uniquement.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            const rawText = response.text || "Analyse stratégique indisponible.";
            const narration = sanitizeTextForSpeech(rawText);
            
            const utterance = new SpeechSynthesisUtterance(narration);
            utterance.lang = 'fr-FR';
            utterance.rate = 1.18; // Vitesse plus rapide pour un ton dynamique et convaincant
            utterance.pitch = 1.0;
            
            utterance.onend = () => setIsPlaying(false);
            utterance.onstart = () => setIsPlaying(true);
            
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("TTS Generation Error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button 
            onClick={togglePlayback}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isPlaying 
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-emerald-500/50"
            }`}
        >
            {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : isPlaying ? (
                <StopCircle size={16} />
            ) : (
                <Volume2 size={16} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
                {isGenerating ? "Synthèse..." : isPlaying ? "En lecture" : "Analyse Stratégique Audio"}
            </span>
            {isPlaying && (
                <div className="flex gap-0.5 items-end h-3 ml-1">
                    <div className="w-0.5 h-full bg-emerald-400 animate-[wave_0.8s_infinite_0.1s]"></div>
                    <div className="w-0.5 h-full bg-emerald-400 animate-[wave_0.8s_infinite_0.3s]"></div>
                    <div className="w-0.5 h-full bg-emerald-400 animate-[wave_0.8s_infinite_0.5s]"></div>
                </div>
            )}
        </button>
    );
};

const TIRChart = ({ scores }: { scores: TIRScore }) => (
    <div className="flex gap-2 h-24 items-end justify-between px-2 pt-4 pb-0 bg-slate-900/50 rounded-lg border border-slate-800 relative">
        <div className="absolute top-2 right-2 text-[10px] text-slate-500 font-mono uppercase">Analyse TIR</div>
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
                            style={{ height: `${val * 0.6}px` }} 
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

const DashboardView = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8">
            <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-gold font-semibold tracking-wide">
                Tableau de bord R&D
            </h1>
            <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mt-1">
                BaaSify v2.1 • Moteur TIR Actif
            </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'SPV Actifs', value: "3", icon: Blocks, color: '#C9A962' },
            { label: 'Score TIR Moyen', value: "72.4", icon: BarChart3, color: '#4ECDC4' },
            { label: 'Actifs Bancables', value: "8", icon: Wallet, color: '#10B981' },
            { label: 'Valeur Pipeline', value: "€4.2M", icon: TrendingUp, color: '#8B5CF6' },
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
                <h3 className="text-lg font-medium text-slate-200 mb-6">Solutions validées récemment</h3>
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
                                <div className="text-xs text-slate-500 mb-0.5">Score TIR</div>
                                <div className={`text-lg font-bold ${asset.tir_scores.composite > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {asset.tir_scores.composite}/100
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-slate-200 mb-4">Statut des Agents</h3>
                <div className="space-y-4">
                    {[
                        { name: "Agent Indexeur", task: "Scraping bio-lit", status: "Idle", color: "bg-blue-500" },
                        { name: "Agent Brevets", task: "Analyse FTO", status: "Active", color: "bg-purple-500" },
                        { name: "Agent Transposeur", task: "Matching Fournisseurs", status: "Active", color: "bg-emerald-500" },
                        { name: "Agent Synthétiseur", task: "Gén. Roadmap", status: "Idle", color: "bg-gold" }
                    ].map((agent, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? agent.color + ' animate-pulse' : 'bg-slate-700'}`} />
                                <span className="text-slate-300">{agent.name}</span>
                            </div>
                            <span className="text-xs text-slate-500">{agent.status === 'Active' ? agent.task : 'En attente'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const BioSolverView = () => {
  const [challengeData, setChallengeData] = useState({ sector: "Textile", problem: "", constraints: "PFAS-Free" });
  const [status, setStatus] = useState<'idle' | 'agents_working' | 'expert_validation' | 'complete'>('idle');
  const [generatedAsset, setGeneratedAsset] = useState<R_D_Asset | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const handleSuggestBottleneck = async () => {
      setIsSuggesting(true);
      try {
          const prompt = `Génère un goulot d'étranglement technique R&D spécifique et aléatoire pour l'industrie "${challengeData.sector}". Problème où la nature pourrait offrir une solution. Sortie: une phrase courte uniquement.`;
          const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
          if (response.text) setChallengeData(prev => ({...prev, problem: response.text.trim()}));
      } catch(e) { console.error(e); } finally { setIsSuggesting(false); }
  };

  const handleSolve = async () => {
    setStatus('agents_working');
    try {
        await new Promise(r => setTimeout(r, 4000));
        setStatus('expert_validation');
        await new Promise(r => setTimeout(r, 2000));

        const prompt = `
            Crée un actif R&D détaillé pour : "${challengeData.problem}" dans le secteur "${challengeData.sector}".
            Génère des scores TIR réalistes.
            Retourne du JSON strict : { "name": "Titre", "category": "Industrie", "tir_scores": { "technology": 0-100, "ip": 0-100, "resources": 0-100, "market": 0-100, "composite": 0-100 }, "trl_current": 1-9, "bio_analogs": [{ "species": "Nom", "mechanism": "Desc", "key_attribute": "Bénéfice" }], "ip_status": { "freedom_to_operate": "High/Med/Low", "moat_duration_years": 18, "patent_filing_strategy": "Stratégie" }, "supply_chain": [{ "vendor": "Nom", "location": "Pays", "capability": "Procédé", "certification": "ISO" }], "financials": { "capex_total": 500000, "roi_horizon_months": 24, "revenue_stream": "Modèle" }, "roadmap": [{ "phase": "Nom", "duration_months": 6, "cost": 100000, "deliverables": "Sortie" }] }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(cleanJson(response.text || "{}"));
        setGeneratedAsset({
            id: `GEN-${Date.now().toString().slice(-6)}`,
            generated_date: new Date().toISOString().split('T')[0],
            risk_profile: "medium",
            token_status: "Co-Dev",
            regulatory: { alignment: "EU Green Deal", standards: ["ISO"] },
            trl_target: 8,
            tasks: [],
            ...data
        });
        setStatus('complete');
    } catch (e) { console.error(e); setStatus('idle'); }
  };

  if (status === 'complete' && generatedAsset) {
      return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-6">
                  <div>
                      <div className="flex items-center gap-4 mb-3">
                          <span className="text-xs font-mono text-emerald-500 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20 uppercase">
                             {generatedAsset.token_status}
                          </span>
                          <VoiceNarrator asset={generatedAsset} />
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
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Score de confiance</div>
                        <div className="text-3xl font-bold text-emerald-400">{generatedAsset.tir_scores.composite}<span className="text-sm text-slate-600">/100</span></div>
                      </div>
                      <TIRChart scores={generatedAsset.tir_scores} />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Leaf size={14} className="text-emerald-500"/> Analogies Biologiques</h3>
                          {generatedAsset.bio_analogs?.map((bio, i) => (
                              <div key={i} className="mb-3 last:mb-0 p-3 bg-slate-950 rounded border border-slate-800">
                                  <div className="italic text-emerald-400 text-sm">{bio.species}</div>
                                  <div className="text-xs text-slate-400 mt-1">{bio.mechanism}</div>
                              </div>
                          ))}
                      </div>
                       <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-purple-500"/> Paysage IP</h3>
                          <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                  <span className="text-slate-400">Liberté d'exploitation</span>
                                  <span className="text-white font-medium">{generatedAsset.ip_status?.freedom_to_operate}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-slate-400">Durée Protection</span>
                                  <span className="text-white font-medium">{generatedAsset.ip_status?.moat_duration_years} ans</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Database size={14} className="text-blue-500"/> Supply Chain</h3>
                           {generatedAsset.supply_chain?.map((sup, i) => (
                              <div key={i} className="mb-2 p-2 flex justify-between items-center border-b border-slate-800/50 last:border-0">
                                  <div>
                                      <div className="text-sm text-white">{sup.vendor}</div>
                                      <div className="text-[10px] text-slate-500">{sup.location}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-gold"/> Données Financières</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-2 bg-slate-950 rounded">
                                  <div className="text-[10px] text-slate-500 uppercase">CAPEX</div>
                                  <div className="text-sm font-bold text-white">€{generatedAsset.financials?.capex_total?.toLocaleString()}</div>
                              </div>
                              <div className="text-center p-2 bg-slate-950 rounded">
                                  <div className="text-[10px] text-slate-500 uppercase">ROI</div>
                                  <div className="text-sm font-bold text-emerald-400">{generatedAsset.financials?.roi_horizon_months}m</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <h3 className="text-sm font-bold text-white mb-4">Roadmap de Validation</h3>
                          <div className="space-y-4 relative pl-4 border-l border-slate-800">
                              {generatedAsset.roadmap?.map((phase, i) => (
                                  <div key={i} className="relative mb-4">
                                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                                      <div className="text-xs text-emerald-500 font-mono">{phase.phase}</div>
                                      <div className="text-sm text-white">{phase.deliverables}</div>
                                      <div className="text-[10px] text-slate-500">€{phase.cost.toLocaleString()} • {phase.duration_months} mois</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <button onClick={() => setStatus('idle')} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-all text-sm font-medium">
                          Nouvelle Simulation
                      </button>
                      <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg shadow-lg shadow-emerald-900/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                          <Wallet size={16} /> Enregistrer dans le Vault
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
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Nouveau Défi Industriel</h2>
                    <p className="text-slate-400 text-sm">Orchestrez le pipeline d'agents pour trouver des solutions à fort TIR.</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Secteur Industriel</label>
                        <div className="flex flex-wrap gap-3">
                            {["Textile", "Énergie", "Construction", "Aéronautique"].map(s => (
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
                             <label className="block text-sm font-medium text-slate-300">Goulot d'étranglement technique</label>
                             <button onClick={handleSuggestBottleneck} disabled={isSuggesting} className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-50">
                                 {isSuggesting ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                                 Suggérer un défi
                             </button>
                        </div>
                        <textarea 
                            value={challengeData.problem}
                            onChange={(e) => setChallengeData({...challengeData, problem: e.target.value})}
                            placeholder="Ex: Réduire la friction dans les pipelines..."
                            className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={handleSolve}
                        disabled={!challengeData.problem}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                    >
                        <Zap size={20} fill="currentColor" /> Déployer les Agents
                    </button>
                </div>
            </div>
        ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <Dna className="absolute inset-0 m-auto text-emerald-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
                    {status === 'agents_working' ? "Orchestration en cours" : "Validation par les Experts"}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    {status === 'agents_working' 
                      ? "L'indexeur cherche des analogues... Brevets analyse la FTO... Transposeur identifie les fournisseurs..." 
                      : "Calcul du score TIR final... Génération du rapport de conformité réglementaire..."}
                </p>
                <div className="mt-8 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i < (status === 'expert_validation' ? 4 : 2) ? 'bg-emerald-500' : 'bg-slate-800'}`} />
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
                <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
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
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} />
                        <SidebarItem icon={Microscope} label="Moteur BioSolver" active={view === "biosolver"} onClick={() => setView("biosolver")} />
                        <SidebarItem icon={Database} label="Actifs Validés" active={view === "assets"} onClick={() => setView("assets")} />
                        <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Marché</div>
                        <SidebarItem icon={ShoppingCart} label="Échange IP" active={view === "marketplace"} onClick={() => setView("marketplace")} />
                        <SidebarItem icon={Coins} label="SPV Tokenisés" active={false} onClick={() => {}} />
                        <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin</div>
                        <SidebarItem icon={ShieldCheck} label="Conformité" active={view === "compliance"} onClick={() => setView("compliance")} />
                        <SidebarItem icon={Settings} label="Paramètres" active={view === "settings"} onClick={() => setView("settings")} />
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <User size={14} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-white truncate">Dr. Aris V..</div>
                                <div className="text-[10px] text-slate-500 truncate">Architecte R&D</div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm flex items-center justify-between px-8 z-10">
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <span className="flex items-center gap-2"><Globe size={14}/> Nœud: EU-West</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="flex items-center gap-2 font-mono text-[10px]">Latence: 14ms</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-8 relative">
                        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none"></div>
                        
                        {view === "dashboard" && <DashboardView />}
                        {view === "biosolver" && <BioSolverView />}
                        {view === "assets" && <div className="text-center text-slate-500 mt-20">Bibliothèque d'actifs chargée</div>}
                        {view === "marketplace" && <div className="text-center text-slate-500 mt-20">Marché IP chargé</div>}
                        {view === "compliance" && <div className="text-center text-slate-500 mt-20">Moteur de conformité chargé</div>}
                        {view === "settings" && <div className="text-center text-slate-500 mt-20">Paramètres système</div>}
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

const root = createRoot(document.getElementById("root")!);
// Fixed: Added missing children prop to ErrorBoundary
root.render(<ErrorBoundary><App /></ErrorBoundary>);
