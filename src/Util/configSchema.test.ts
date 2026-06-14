import { describe, it, expect } from 'vitest'
import { certConfigSchema } from './configSchema.js'
import { DISTINCTION, VOYAGE, VOYAGEXP } from './constants.js'

const validConfig = {
  TYPE: VOYAGE,
  VOYAGE: 'V60',
  COMPLETION_DATE: 'October 22, 2025',
  CERTIFICATE_PATH: '/tmp/certs/',
  NAME_FONT_PATH: './assets/fonts/SnellRoundhand.ttf',
  TEMPLATE_PATH: '../../assets/template.pdf',
  VOYAGE_CERT_TEMPLATE_ID: 12345
}

describe('certConfigSchema', () => {
  it('parses a valid config', () => {
    expect(certConfigSchema.parse(validConfig)).toEqual({
      ...validConfig,
      TEAMS: '',
      ROLES: ''
    })
  })

  it.each([DISTINCTION, VOYAGE, VOYAGEXP])('accepts TYPE %s', (type) => {
    expect(() => certConfigSchema.parse({ ...validConfig, TYPE: type })).not.toThrow()
  })

  it('rejects an unknown TYPE', () => {
    expect(() => certConfigSchema.parse({ ...validConfig, TYPE: 'Bogus' })).toThrow()
  })

  it('preserves TEAMS and ROLES when provided', () => {
    const config = certConfigSchema.parse({ ...validConfig, TEAMS: 'ALL', ROLES: 'Developer' })
    expect(config.TEAMS).toBe('ALL')
    expect(config.ROLES).toBe('Developer')
  })

  it('rejects CERTIFICATE_PATH without a trailing slash', () => {
    expect(() => certConfigSchema.parse({ ...validConfig, CERTIFICATE_PATH: '/tmp/certs' })).toThrow()
  })

  it('rejects NAME_FONT_PATH with an unsupported extension', () => {
    expect(() => certConfigSchema.parse({ ...validConfig, NAME_FONT_PATH: './assets/fonts/Font.txt' })).toThrow()
  })

  it('accepts NAME_FONT_PATH with a .otf extension', () => {
    expect(() => certConfigSchema.parse({ ...validConfig, NAME_FONT_PATH: './assets/fonts/Font.otf' })).not.toThrow()
  })

  it('rejects TEMPLATE_PATH that does not end in .pdf', () => {
    expect(() => certConfigSchema.parse({ ...validConfig, TEMPLATE_PATH: '../../assets/template.docx' })).toThrow()
  })

  it.each([0, -1, 1.5])('rejects VOYAGE_CERT_TEMPLATE_ID %s', (id) => {
    expect(() => certConfigSchema.parse({ ...validConfig, VOYAGE_CERT_TEMPLATE_ID: id })).toThrow()
  })

  it('rejects a config missing required fields', () => {
    const { COMPLETION_DATE, ...incomplete } = validConfig
    expect(() => certConfigSchema.parse(incomplete)).toThrow()
  })
})
