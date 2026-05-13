export const ROUTE_PAGE = {

    categoriesTransactionsPage: `/`,
    budgetPage: (transactionId = null) => transactionId ? `/budgetPage/${transactionId}` : "/budgetPage",
    testPage: `/testPage`

};