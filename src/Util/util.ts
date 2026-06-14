import { PDFDocument, PDFFont, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFileSync } from 'fs'
import type { CertConfig } from './types.js'

interface CertFonts {
  signatureFont: PDFFont
  helveticaFont: PDFFont
  helveticaBoldObliqueFont: PDFFont
}

// Get fonts to be used in the certificate
const getFonts = async (document: PDFDocument, config: CertConfig): Promise<CertFonts> => {
  document.registerFontkit(fontkit)
  const localFontPath = config.NAME_FONT_PATH
  const fontBytes = readFileSync(localFontPath)
  const signatureFont = await document.embedFont(fontBytes)
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)

  return {signatureFont, helveticaFont, helveticaBoldObliqueFont}
}

export { getFonts }