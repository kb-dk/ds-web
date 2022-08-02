import { GenericSearchResult } from "./GenericSearchResult"
import { GenericRecord } from "./GenericRecord"

export interface ServerResponse {
  data: ServerDataResponse
  response: SearchResponse
}

export interface ServerDataResponse {
  dataFeedElement: Array<GenericRecord>
  response: SearchResponse
}

export interface SearchResponse {
  docs: Array<GenericSearchResult>
  maxScore: number
  numFound: number
  numFoundExact: boolean
  start: number
}
