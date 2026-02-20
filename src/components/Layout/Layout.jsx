import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    Settings,
    TrendingUp,
    ChevronLeft,
    MousePointer2,
    Menu,
    X
} from 'lucide-react';

const Layout = () => {
    const [isManuallyOpen, setIsManuallyOpen] = useState(true);
    const [isHoverEnabled, setIsHoverEnabled] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Stato per il menu mobile

    const location = useLocation();

    // Chiudi il menu mobile quando cambi pagina
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    // Logica di espansione (solo per Desktop)
    const isExpanded = isManuallyOpen || (isHoverEnabled && isMouseOver);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            
            {/* --- OVERLAY MOBILE --- */}
            {/* Appare solo quando il menu mobile è aperto per oscurare il contenuto */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* --- SIDEBAR --- */}
            <aside
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                className={`
                    fixed inset-y-0 left-0 z-70 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
                    md:relative md:translate-x-0 
                    ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
                    ${isExpanded ? 'md:w-64' : 'md:w-20'}
                `}
            >
                {/* HEADER: Logo + Controlli */}
                <div className="h-20 flex items-center px-6 shrink-0 relative">
                    <div className="flex items-center overflow-hidden">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-blue-600 rounded-lg shadow-lg shadow-blue-100">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <span className={`ml-3 font-bold text-xl text-slate-800 transition-opacity duration-300 ${
                            isExpanded || isMobileOpen ? 'opacity-100' : 'md:opacity-0'
                        }`}>
                            FlowCash
                        </span>
                    </div>

                    {/* FRECCIA (Solo Desktop) */}
                    <button
                        onClick={() => setIsManuallyOpen(!isManuallyOpen)}
                        className={`absolute -right-3 top-5 p-1 rounded-full cursor-pointer bg-white border border-slate-200 shadow-md hover:bg-blue-50 text-slate-600 transition-all duration-300 z-50 hidden md:block ${
                            !isExpanded ? 'rotate-180 translate-x-1' : ''
                        }`}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* TASTO CHIUDI (Solo Mobile) */}
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="ml-auto p-2 text-slate-500 md:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* NAVIGAZIONE */}
                <nav className="flex-1 px-3 mt-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    <NavItem
                        icon={<LayoutDashboard size={22} />}
                        label="Dashboard"
                        to="/"
                        active={location.pathname === '/'}
                        isExpanded={isExpanded}
                        isMobileOpen={isMobileOpen}
                    />
                    <NavItem
                        icon={<ArrowLeftRight size={22} />}
                        label="Bilancio giornaliero"
                        to="/daily"
                        active={location.pathname === '/daily'}
                        isExpanded={isExpanded}
                        isMobileOpen={isMobileOpen}
                    />
                    <NavItem
                        icon={<Wallet size={22} />}
                        label="Bilancio Mensile"
                        to="/monthly"
                        active={location.pathname === '/monthly'}
                        isExpanded={isExpanded}
                        isMobileOpen={isMobileOpen}
                    />
                </nav>

                {/* FOOTER */}
                <div className="p-3 border-t border-slate-100 space-y-1 bg-white">
                    <button
                        onClick={() => setIsHoverEnabled(!isHoverEnabled)}
                        className={`w-full flex items-center h-12 rounded-xl transition-all duration-200 group ${
                            isHoverEnabled ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-50'
                        } ${!isExpanded && !isMobileOpen ? 'md:justify-center' : ''}`}
                    >
                        <div className="w-14 flex items-center justify-center shrink-0">
                            <MousePointer2 size={20} fill={isHoverEnabled ? "currentColor" : "none"} />
                        </div>
                        <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                            isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                        }`}>
                            Modo Hover: {isHoverEnabled ? 'ON' : 'OFF'}
                        </span>
                    </button>

                    <NavItem
                        icon={<Settings size={22} />}
                        label="Impostazioni"
                        to="/settings"
                        active={location.pathname === '/settings'}
                        isExpanded={isExpanded}
                        isMobileOpen={isMobileOpen}
                    />
                </div>
            </aside>

            {/* --- AREA CONTENUTO --- */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* NAVBAR SUPERIORE RESPONSIVE */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* TASTO HAMBURGER (Solo Mobile) */}
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>

                        <h2 className="text-base md:text-lg font-bold text-slate-700 capitalize truncate">
                            {location.pathname.substring(1) || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden xs:block text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo</p>
                            <p className="text-xs md:text-sm font-bold text-slate-900">€ 4.250,00</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-sm shrink-0"></div>
                    </div>
                </header>

                {/* CONTENUTO DELLA PAGINA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, to, active, isExpanded, isMobileOpen }) => (
    <Link
        to={to}
        className={`flex items-center h-12 rounded-xl transition-all duration-200 relative group ${
            active 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        <div className="w-14 flex items-center justify-center shrink-0">
            {icon}
        </div>
        
        <span className={`font-semibold whitespace-nowrap transition-all duration-300 ${
            isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
        }`}>
            {label}
        </span>

        {/* Tooltip solo Desktop quando chiusa */}
        {!isExpanded && !isMobileOpen && (
            <div className="absolute left-16 bg-slate-800 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[60] hidden md:block">
                {label}
            </div>
        )}
    </Link>
);

export default Layout;