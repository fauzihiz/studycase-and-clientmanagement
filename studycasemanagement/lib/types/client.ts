export type ClientStatus = 'active' | 'inactive' | 'lead'

export interface Client {
  id: string
  user_id: string
  name: string
  business_name: string | null
  industry: string | null
  email: string | null
  phone: string | null
  website: string | null
  notes: string | null
  status: ClientStatus
  created_at: string
  updated_at: string
}

export type ClientInsert = Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type ClientUpdate = Partial<ClientInsert>
