declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TYPE: string
      MODE: string
      AIRTABLE_API_KEY: string
      AIRTABLE_BASE: string
      MAILJET_API_KEY: string
      MAILJET_SECRET_KEY: string
      TEAMS?: string
    }
  }
}

export {}
