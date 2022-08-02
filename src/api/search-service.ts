import axios from 'axios';
import { StatsServiceClient } from './SearchAPI';

const axiosStatsInstance = axios.create({
	baseURL: '/ds-api/search',
});

export const SearchService = new StatsServiceClient(axiosStatsInstance);
