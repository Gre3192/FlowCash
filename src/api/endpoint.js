import buildEndpoint from "../utils/buildEndpoint";
import getBaseUrl from "../utils/getBaseUrl"


const base_url = getBaseUrl('local')  // mock, local, server


export const API_ENDPOINTS = {


  transactionBudgets: buildEndpoint(base_url, `/api/transaction-budgets`),

  transactionMovements: buildEndpoint(base_url, `/api/transaction-movements`),

  monthlyOverview: buildEndpoint(base_url, `/api/flowcash/monthly-overview/`),

  categories: buildEndpoint(base_url, `/api/categories/`),

  transactions: buildEndpoint(base_url, `/api/transactions/`),


};


