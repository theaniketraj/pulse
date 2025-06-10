import axios from 'axios';
import { getConfig } from '../utils/config';

// Fetches metrics from a Prometheus-compatible endpoint
export async function fetchMetrics(query: string): Promise<any> {
  const prometheusUrl = getConfig('prometheusUrl');
  if (!prometheusUrl) {
    throw new Error('Prometheus URL not configured');
  }

  try {
    const response = await axios.get(`${prometheusUrl}/api/v1/query`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}