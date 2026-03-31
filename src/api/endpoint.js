import buildEndpoint from "../utils/buildEndpoint";
import getBaseUrl from "../utils/getBaseUrl"


const base_url = getBaseUrl('mock')  // mock, local, server


export const API_ENDPOINTS = {

  //GET
  budget: buildEndpoint(base_url, `/api/budget`),
  //GET
  transactionBudget: buildEndpoint(base_url, `/api/transaction-budget`),





};