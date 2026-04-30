import buildEndpoint from "../utils/buildEndpoint";
import getBaseUrl from "../utils/getBaseUrl"


const base_url = getBaseUrl('local')  // mock, local, server


export const API_ENDPOINTS = {

  //GET
  budget: buildEndpoint(base_url, `/api/budget`),
  //GET
  transactionBudget: buildEndpoint(base_url, `/api/transaction-budget`),
  //GET ? month (da 1 a 12) | year
  monthlyOverview: buildEndpoint(base_url, `/api/flowcash/monthly-overview/`),

};


