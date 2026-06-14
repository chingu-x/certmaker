import { z } from 'zod'
import { DISTINCTION, VOYAGE, VOYAGEXP } from './constants.js'

// Validates the CertConfig objects exported from config/*.ts so a typo'd
// path, template ID, or TYPE fails fast at startup instead of mid-run.
export const certConfigSchema = z.object({
  TYPE: z.enum([DISTINCTION, VOYAGE, VOYAGEXP]),
  VOYAGE: z.string(),
  // Optional in input (DistinctionConfig omits both), default to ''
  // so downstream code that reads these fields keeps a `string` type.
  TEAMS: z.string().default(''),
  ROLES: z.string().default(''),
  COMPLETION_DATE: z.string().min(1),
  // Concatenated directly with filenames, so it must end in a path separator.
  CERTIFICATE_PATH: z.string().min(1).endsWith('/'),
  NAME_FONT_PATH: z.string().regex(/\.(ttf|otf)$/i, 'must be a .ttf or .otf font file'),
  TEMPLATE_PATH: z.string().endsWith('.pdf'),
  VOYAGE_CERT_TEMPLATE_ID: z.number().int().positive()
})
