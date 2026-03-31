import buildEndpoint from "../utils/buildEndpoint";
import getBaseUrl from "../utils/getBaseUrl"


const base_url = getBaseUrl('mock')  // mock, local, server


export const API_ENDPOINTS = {

  //GET ? status
  budget: buildEndpoint(base_url, `/api/budget`),
  // DELETE ? alarm_id
  deleteAllarm: buildEndpoint(base_url, `/api/mqtt/cart/alarm/delete/`),
  // DELETE ALL ? status
  deleteAllAllarms: buildEndpoint(base_url, `/api/mqtt/alarms/delete/`),
  //PUT 
  editAllarmStatus: buildEndpoint(base_url, `/api/mqtt/alarms/status/change/`),
  //POST
  trayOpen: buildEndpoint(base_url, `/api/mqtt/tray/open/`),
  //POST
  trayStatus: buildEndpoint(base_url, `/api/mqtt/tray/status/`),




};