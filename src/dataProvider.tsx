import { DataProvider } from "@refinedev/core";
import axios from "axios";


const TOKEN_KEY = "auth";

export const dataProvider = (apiUrl: string): DataProvider => {
  
  const httpClient: any = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  
  httpClient.interceptors.request.use((config: any) => {
    const authData = localStorage.getItem(TOKEN_KEY);
    if (authData) {
      const user = JSON.parse(authData);
      const token = user.access_token || user.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return {
    getList: async ({ resource, pagination, filters, sorters }) => {
      const url = `/${resource}`;
      
      
      const current = (pagination as any)?.current || 1;
      const pageSize = (pagination as any)?.pageSize || 10;

      const params: any = {
        _page: current,
        _limit: pageSize,
      };

      
      if (filters && filters.length > 0) {
        filters.forEach((f: any) => {
          if ("field" in f) {
            params[`${f.field}_like`] = f.value;
          }
        });
      }

      
      if (sorters && sorters.length > 0) {
        params._sort = sorters[0].field;
        params._order = sorters[0].order;
      }

      const response = await httpClient.get(url, { params });

      return {
        data: response.data.data || response.data,
        total: parseInt(response.headers["x-total-count"] || response.data.total || "0"),
      };
    },

    getOne: async ({ resource, id }) => {
      const response = await httpClient.get(`/${resource}/${id}`);
      return { data: response.data.data || response.data };
    },

    create: async ({ resource, variables }) => {
      const response = await httpClient.post(`/${resource}`, variables);
      return { data: response.data.data || response.data };
    },

    update: async ({ resource, id, variables }) => {
      const response = await httpClient.put(`/${resource}/${id}`, variables);
      return { data: response.data.data || response.data };
    },

    deleteOne: async ({ resource, id }) => {
      const response = await httpClient.delete(`/${resource}/${id}`);
      return { data: response.data.data || response.data };
    },

    getMany: async ({ resource, ids }) => {
      const response = await httpClient.get(`/${resource}`, {
        params: { id: ids },
      });
      return { data: response.data.data || response.data };
    },

    getApiUrl: () => apiUrl,

    custom: async ({ url, method, payload, query, headers }) => {
      const response = await httpClient.request({
        url,
        method,
        data: payload,
        params: query,
        headers,
      });
      return { data: response.data };
    },
  };
};