// A Chingu Voyager who successfully completed a Voyage, as assembled from
// Airtable records and used to populate a completion certificate.
export interface Voyager {
  number: string
  email: string
  voyage: string
  tier: string
  team_no: string
  discord_name: string
  certificate_name: string
  role: string
  repo_url: string
  deployed_url: string
}

// A recipient of a Certificate of Distinction.
export interface DistinctionRecipient {
  certificate_name: string
  email: string
}

// Settings used to generate and (optionally) email a certificate.
export interface CertConfig {
  TYPE: string
  VOYAGE: string
  TEAMS?: string
  ROLES?: string
  COMPLETION_DATE: string
  CERTIFICATE_PATH: string
  NAME_FONT_PATH: string
  TEMPLATE_PATH: string
  VOYAGE_CERT_TEMPLATE_ID: number
}
