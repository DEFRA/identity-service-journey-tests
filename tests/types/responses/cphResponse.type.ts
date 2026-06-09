type CPHItems = {
  id: string
  county_parish_holding_number: string
  expired: boolean
  expired_at: null
  allowed_species: string[]
}

export type CPHResponse = {
  items: CPHItems[]
  total_count: number
  total_pages: number
  page_number: number
  page_size: number
}
