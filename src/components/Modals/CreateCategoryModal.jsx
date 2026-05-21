import { useState } from "react";
import { FolderPlus, LoaderCircle } from "lucide-react";
import { usePost } from "../../hooks/usePost";
import { API_ENDPOINTS } from "../../api/endpoint";
import { usePut } from "../../hooks/usePut"

const CATEGORY_TYPES = [
    { key: "income", label: "Entrata", color: "bg-emerald-500", textColor: "text-emerald-700", ringColor: "ring-emerald-300", bgLight: "bg-emerald-50" },
    { key: "expense", label: "Uscita", color: "bg-rose-500", textColor: "text-rose-700", ringColor: "ring-rose-300", bgLight: "bg-rose-50" },
    { key: "mixed", label: "Mista", color: "bg-slate-500", textColor: "text-slate-700", ringColor: "ring-slate-300", bgLight: "bg-slate-50" },
];

export default function CreateCategoryModal({

    onClose,
    reload,
    formValueForEdit,

}) {

    const { postData, loading: postLoading, error: postError } = usePost();
    const { putData, loading: putLoading, error: putError } = usePut();

    const loading = postLoading || putLoading

    const [categoryName, setCategoryName] = useState(formValueForEdit?.name || "");
    const [selectedType, setSelectedType] = useState("mixed");
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
            // type: selectedType,
        };

        try {
            if (formValueForEdit) {
                await putData(API_ENDPOINTS.categories() + formValueForEdit?.id + "/", payload);
            }
            else {
                await postData(API_ENDPOINTS.categories(), payload);
            }
            onClose?.();
        } catch (err) {
            console.postError(err);
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
                        {formValueForEdit ? 'Modifica categoria' : 'Nuova categoria'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {formValueForEdit ? ' Modifica la categoria per organizzare entrate o uscite.' : 'Crea una categoria per organizzare entrate o uscite.'}
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
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.name ? "border-red-400 bg-red-50" : "border-slate-300 bg-white focus:border-slate-900"}`}
                />
                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Tipo categoria
                </label>
                <div className="flex gap-2">
                    {CATEGORY_TYPES.map((type) => {
                        const isSelected = selectedType === type.key;
                        return (
                            <button
                                key={type.key}
                                type="button"
                                onClick={() => setSelectedType(type.key)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${isSelected
                                    ? `${type.bgLight} ${type.textColor} border-current ring-2 ${type.ringColor}`
                                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                    }`}
                            >
                                <span className={`h-2.5 w-2.5 rounded-full ${type.color}`} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {postError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {postError}
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
                        formValueForEdit ? "Modifica" : "Crea"
                    )}
                </button>
            </div>
        </form>
    );
}