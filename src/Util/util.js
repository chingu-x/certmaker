import { StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFileSync } from 'fs'

// Get fonts to be used in the certificate
const getFonts = async (document) => {
  document.registerFontkit(fontkit)
  const localFontPath = process.env.NAME_FONT_PATH
  const fontBytes = readFileSync(localFontPath)
  const signatureFont = await document.embedFont(fontBytes)
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  
  return {signatureFont, helveticaFont, helveticaBoldObliqueFont}
}

export { getFonts }