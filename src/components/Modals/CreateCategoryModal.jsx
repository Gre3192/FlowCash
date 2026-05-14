import { useState } from "react";
import { FolderPlus, LoaderCircle, Check } from "lucide-react";
import { usePost } from "../../hooks/usePost";
import { API_ENDPOINTS } from "../../api/endpoint";
import { CATEGORY_COLOR_KEYS, CATEGORY_COLORS_MAP } from "../../constants/categoryColors";

export default function CreateCategoryModal({ onClose, reload }) {

    const { postData, loading, error } = usePost();

    const [categoryName, setCategoryName] = useState("");
    const [selectedColor, setSelectedColor] = useState(CATEGORY_COLOR_KEYS[0]);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setCategoryName(e.target.value);
        setErrors((prev) => ({
            ...prev,
            name: "",
        }));
    }

    function validateForm() {
        const newErrors = {};
        if (!categoryName.trim()) {
            newErrors.name = "Il nome della categoria è obbligatorio";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        const payload = {
            name: categoryName.trim(),
            color: selectedColor,
        };
        try {
            const createdCategory = await postData(
                API_ENDPOINTS.categories(),
                payload
            );
            onClose?.();
        } catch (err) {
            console.error(err);
        } finally {
            reload()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FolderPlus size={20} />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Nuova categoria
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Crea una categoria per organizzare entrate o uscite.
                    </p>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Nome categoria
                </label>

                <input
                    type="text"
                    name="name"
                    value={categoryName}
                    onChange={handleChange}
                    placeholder="Es. Abbonamenti"
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-slate-300 bg-white focus:border-slate-900"
                        }`}
                />

                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Colore categoria
                </label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLOR_KEYS.map((colorKey) => {
                        const color = CATEGORY_COLORS_MAP[colorKey];
                        const isSelected = selectedColor === colorKey;
                        return (
                            <button
                                key={colorKey}
                                type="button"
                                onClick={() => setSelectedColor(colorKey)}
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.swatch} transition-all ${isSelected ? `ring-2 ${color.swatchRing} ring-offset-2` : "hover:scale-110"}`}
                                title={color.label}
                            >
                                {isSelected && <Check size={14} className="text-white" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Annulla
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-w-32.5 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        "Crea categoria"
                    )}
                </button>
            </div>
        </form>
    );
}