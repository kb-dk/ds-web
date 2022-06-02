// Expand as we go
export interface GenericSearchResult {
  id: string
  visible_date: []
  pages: string[]
  language: []
  solr_summary_record: SolrSummaryRecord
}

interface SolrSummaryRecord {
  id: string
  describing: string
  title: string[]
  creator: string[]
  subject_person: string[]
  description: string[]
  entity_type: string
}
