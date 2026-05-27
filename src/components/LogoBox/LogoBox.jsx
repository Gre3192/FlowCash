import { WalletCards } from "lucide-react";

export default function LogoBox({
    src,
    alt = "Logo",
    icon: Icon = WalletCards,
    size = "md",
    rounded = "xl",
    className = "",
    imageClassName = "",
    iconClassName = "",
}) {

    const sizes = {
        sm: "h-9 w-9",
        md: "h-10 w-10",
        lg: "h-14 w-14",
    };

    const roundedMap = {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
    };

    return (
        <div
            className={`
                flex shrink-0 items-center justify-center overflow-hidden bg-slate-100 shadow-sm
                ${sizes[size] || sizes.md}
                ${roundedMap[rounded] || roundedMap.xl}
                ${className}
            `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`
                        h-full w-full object-cover
                        ${imageClassName}
                    `}
                />
            ) : (
                <Icon
                    size={20}
                    className={`
                        
                        ${iconClassName}
                    `}
                />
            )}
        </div>
    );
}