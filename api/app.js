import template from 'lodash/fp/template';
import HttpClient from '../Utils/HttpClient';
import * as API from '../api';

const httpClient = HttpClient.auth();
const openHttpClient = HttpClient.api();

export function getConnections() {
  return httpClient.get(API.FETCH_CONNECTIONS);
}
export function postRemoveConnection(connectionId) {
  return httpClient.post(template(API.REMOVE_CONNECTION)({ connectionId }));
}
export function getServices() {
  return openHttpClient.get(API.FETCH_SERVICES);
}
export function getMe() {
  return httpClient.get(API.ME);
}

export function postMe(payload) {
  return httpClient.post(API.ME, payload);
}

export function getPingConnection(connectionId) {
  return httpClient.post(template(API.PING_CONNECTION)({ connectionId }));
}

export function getUrlMeta(url) {
  return openHttpClient.get(API.FETCH_URL_META, { params: { url } });
}

export function postUploadFileToService(service, data) {
  return httpClient.post(template(API.UPLOAD_FILE_TO_CLOUD)({ service }), data);
}

export function getBraintreeClientToken() {
  return httpClient.get(API.GET_BRAINTREE_CLIENT_TOKEN);
}

export function getAllPlans() {
  return openHttpClient.get(API.GET_PLANS);
}

export function subscribe(planId, data) {
  return httpClient.post(template(API.SUBSCRIBE_PLAN)({ planId }), data);
}

export function subscriptions() {
  return httpClient.get(API.SUBSCRIPTIONS);
}

export function cancelSubscription() {
  return httpClient.post(API.CANCEL_SUBSCRIPTION);
}

export function updatePayment(payload) {
  return httpClient.post(API.UPDATE_PAYMENT, payload);
}

export function fetchActivities(params) {
  return httpClient.get(API.FETCH_ACTIVITIES, { params });
}

export function fetchStatistics(params) {
  return httpClient.get(API.FETCH_STATISTICS, { params });
}

export function postAuthUpload(payload) {
  return httpClient.post(API.AUTH_UPLOAD, payload);
}
export function getUploadInQueue() {
  return httpClient.get(API.UPLOADS_IN_QUEUE);
}
export { httpClient, openHttpClient };
