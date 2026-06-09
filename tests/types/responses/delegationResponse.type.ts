export type DelegationResponse = {
  id: string
  county_parish_holding_id: string
  county_parish_holding_number: string
  delegating_user_id: string
  delegating_user_name: string
  delegated_user_id: string
  delegated_user_name: string
  delegated_user_role_id: string
  delegated_user_role_name: string
  delegated_user_email: string
  invitation_expires_at: string
  invitation_accepted_at: string | null
  invitation_rejected_at: string | null
  revoked_at: string | null
  revoked_by_id: string | null
  revoked_by_name: string | null
  expires_at: string | null
  active: boolean
}
