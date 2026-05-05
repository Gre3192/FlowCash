export const UI_VARIANTS = {

    button: {
        primary: "bg-slate-900 text-white hover:bg-slate-800",
        secondary:
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-600 text-white hover:bg-red-700",
        softDanger:
            "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        income:
            "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    },

    buttonSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
    },

    iconButton: {
        default:
            "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900",
        ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        danger:
            "border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600",
    },

    iconButtonSize: {
        sm: {
            button: "h-7 w-7",
            icon: 14,
        },
        md: {
            button: "h-8 w-8",
            icon: 16,
        },
        lg: {
            button: "h-10 w-10",
            icon: 18,
        },
    },

    input: {
        default:
            "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-200",
        error:
            "border-red-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:ring-red-100",
    },

    pill: {
        neutral: "border-slate-200 bg-slate-50 text-slate-600",
        income: "border-emerald-200 bg-emerald-50 text-emerald-700",
        expense: "border-red-200 bg-red-50 text-red-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        dark: "border-slate-900 bg-slate-900 text-white",
    },

    card: {
        default:
            "border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        hover:
            "hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(15,23,42,0.08)]",
        selected: "border-slate-900 ring-1 ring-slate-900",
        danger: "border-red-200 bg-red-50",
    },

    panel: {
        default: "border-slate-200 bg-white shadow-sm",
        muted: "border-slate-200 bg-slate-50 shadow-sm",
    },

    text: {
        title: "text-slate-900",
        body: "text-slate-700",
        muted: "text-slate-500",
        soft: "text-slate-400",
        income: "text-emerald-600",
        expense: "text-red-600",
        danger: "text-red-600",
    },

    modal: {
        overlay: "bg-black/40",
        box: "bg-white shadow-xl",
        border: "border-slate-200",
    },

    modalSize: {
        sm: {
            width: "w-[420px]",
            height: "h-[420px]",
        },
        md: {
            width: "w-[640px]",
            height: "h-[560px]",
        },
        lg: {
            width: "w-[860px]",
            height: "h-[720px]",
        },
        xl: {
            width: "w-[1100px]",
            height: "h-[760px]",
        },
    },

    modalAnimation: {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.18, ease: "easeOut" },
        },

        scale: {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.96 },
            transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        },

        "slide-up": {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 24 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },

        "slide-down": {
            initial: { opacity: 0, y: -24 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -24 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },

        "slide-left": {
            initial: { opacity: 0, x: 32 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 32 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },

        "slide-right": {
            initial: { opacity: 0, x: -32 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -32 },
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },
    },

    toggleButton: {
        default: {
            active: "border-slate-900 bg-slate-900 text-white",
            inactive:
                "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        },

        income: {
            active: "border-emerald-600 bg-emerald-600 text-white",
            inactive:
                "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        },

        expense: {
            active: "border-red-600 bg-red-600 text-white",
            inactive:
                "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        },

        soft: {
            active: "border-slate-300 bg-slate-100 text-slate-900",
            inactive:
                "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800",
        },
    },

    toggleButtonSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm",
    },
};