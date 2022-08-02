import axios from "axios"
import { APIServiceClient } from "./api-client"

const axiosStatsInstance = axios.create({
  baseURL: "/ds-api/"
})

export const APIService = new APIServiceClient(axiosStatsInstance)
