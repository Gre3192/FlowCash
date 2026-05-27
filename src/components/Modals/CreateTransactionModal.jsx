import { useState } from "react";
import { FolderPlus, LoaderCircle, ArrowDownLeft, ArrowUpRight, } from "lucide-react";
import { usePost } from "../../hooks/usePost";
import { usePut } from "../../hooks/usePut";
import { API_ENDPOINTS } from "../../api/endpoint";

export default function CreateTransactionModal({
    onClose,
    reload,
    selectedCategoryId,
    formValueForEdit
}) {
    const { postData, loading: postLoading, error: postError } = usePost();
    const { putData, loading: putLoading, error: putError } = usePut();

    console.log(selectedCategoryId);

    console.log(formValueForEdit?.id);


    const loading = postLoading || putLoading
    const error = postError || putError

    const [formData, setFormData] = useState({
        name: formValueForEdit?.name || "",
        type: formValueForEdit?.type || "Expense",
        note: formValueForEdit?.note || "",
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    function handleTypeChange(type) {
        setFormData((prev) => ({
            ...prev,
            type,
        }));

        setErrors((prev) => ({
            ...prev,
            type: "",
        }));
    }

    function validateForm() {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Il nome della transazione è obbligatorio";
        }

        if (!formData.type) {
            newErrors.type = "Seleziona entrata o uscita";
        }

        if (!selectedCategoryId) {
            newErrors.category = "Categoria non selezionata";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (formValueForEdit) {
                const payload = {
                    name: formData.name.trim(),
                    type: formData.type,
                    note: formData.note.trim(),
                    category: selectedCategoryId,
                }
                await putData(API_ENDPOINTS.transactions() + formValueForEdit?.id + "/", payload);
            }
            else {
                const payload = {
                    transaction_name: formData.name.trim(),
                    type: formData.type,
                    note: formData.note.trim(),
                    category_id: selectedCategoryId,
                };
                await postData(API_ENDPOINTS.monthlyOverview(), payload);
            }
            onClose?.();
            reload?.();
        } catch (err) {
            console.error(err);
        }
    }

    const isIncome = formData.type === "Income";
    const isExpense = formData.type === "Expense";


    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <FolderPlus size={20} />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {formValueForEdit ? "Modifica transazione" : "Nuova transazione"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {formValueForEdit ? "Modifica la transazione per la categoria selezionata." : "Crea una nuova entrata o uscita per la categoria selezionata."}
                    </p>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Tipo transazione
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleTypeChange("Income")}
                        className={`
                            inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition
                            ${isIncome
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }
                        `}
                    >
                        <ArrowDownLeft size={14} />
                        Entrata
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTypeChange("Expense")}
                        className={`
                            inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition
                            ${isExpense
                                ? "border-red-600 bg-red-600 text-white"
                                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            }
                        `}
                    >
                        <ArrowUpRight size={14} />
                        Uscita
                    </button>
                </div>

                {errors.type && (
                    <p className="text-xs text-red-500">
                        {errors.type}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Nome transazione
                </label>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Es. Netflix"
                    className={`
                        w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition
                        ${errors.name
                            ? "border-red-400 bg-red-50"
                            : "border-slate-300 bg-white focus:border-slate-900"
                        }
                    `}
                />

                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Note
                </label>

                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Note opzionali"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                />
            </div>

            {errors.category && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {errors.category}
                </p>
            )}

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
                    className="inline-flex min-w-36 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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