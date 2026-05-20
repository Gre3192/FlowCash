import { Pencil, Trash2, ListChecks, WalletCards } from "lucide-react";
import "./TransactionCard.scss";
import LogoBox from "../LogoBox/LogoBox";
import InfoBadge from "../Badges/InfoBadge/InfoBadge"
import AmountRatio from "../AmountRatio/AmountRatio";
import KindBadge from "../Badges/KindBadge/KindBadge";
import EdgeProgressBar from "../EdgeProgressBar/EdgeProgressBar";
import MoreActionsMenu from "../MoreActionMenu/MoreActionMenu"
import { IconButton } from "../../ui";
import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { ROUTE_PAGE } from "../../routes/routePage"
import { useDelete } from "../../hooks/useDelete";
import { API_ENDPOINTS } from "../../api/endpoint";



export default function TransactionCard({
    transaction,
    logo,
    onClick,
    selectedMonth,
    selectedYear,
    reloadMonthlyOverview
}) {

    const navigate = useNavigate();
    const { deleteData } = useDelete();

    const moreActions = [
        {
            label: "Movimenti",
            icon: ListChecks,
            onClick: (transaction) => {
                onEdit?.(transaction);
            },
        },
        {
            label: "Budget",
            icon: Pencil,
            onClick: (transaction) => {
                handleGoToBudgetPage(transaction);
            },
        },
        {
            label: "Elimina",
            icon: Trash2,
            variant: "danger",
            onClick: (transaction) => { handleDeleteTransaction(transaction) },
        },
    ];
    function handleGoToBudgetPage() {
        navigate(ROUTE_PAGE.budgetPage.replace(":id", transaction.id));
    }

    async function handleDeleteBudget() {
        if (!transaction?.id) return;

        try {
            setOpenTransactionMenuId(null);

            await deleteData(
                API_ENDPOINTS.transactions(
                    {
                        month: selectedMonth,
                        year: selectedYear,
                    },
                    transaction.id
                )
            );

            reloadMonthlyOverview?.();
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        }
    }

    async function handleDeleteTransaction() {
        if (!transaction?.id) return;
        try {
            await deleteData(API_ENDPOINTS.transactions(
                {},
                transaction.id
            )
            );
            reloadMonthlyOverview?.();
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        }
    }

    return (
        <div onClick={onClick} className="transaction-card" >

            <LogoBox src={logo} alt={transaction?.name ?? "Logo"} />

            <div className="min-w-0 flex-1 ml-3">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                        {transaction?.name ?? "Transazione"}
                    </h3>
                    <InfoBadge label={transaction.progress.toFixed(0) + "%"} />
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                    <KindBadge type={transaction.type} />
                    <IconButton icon={WalletCards} size={'sm'} />
                </div>
            </div>

            <div className="hidden min-w-40 flex-col items-end mr-3 sm:flex">
                <AmountRatio firstNum={formatCurrency(transaction.current)} secondNum={formatCurrency(transaction.target)} />
                <div className="mt-1 text-xs font-semibold text-slate-500">
                    Rimanenti:{" "}
                    <span className="font-bold text-slate-900">
                        {formatCurrency(transaction.remaining)}
                    </span>
                </div>
                <EdgeProgressBar value={transaction.progress} />
            </div>

            <MoreActionsMenu
                item={transaction}
                actions={moreActions}
            />
        </div>
    );
}
