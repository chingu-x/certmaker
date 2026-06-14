import { PDFDocument } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import { join } from 'path'
import { sendMail } from '../Mailjet/sendMail.js'
import { getFonts } from '../Util/util.js'
import config from '../../config/DistinctionConfig.js'
import recipientsJson from '../../config/cert_of_distinction_recipients.json' with { type: "json" }
import type { DistinctionRecipient } from '../Util/types.js'

// The committed JSON is a placeholder; the local copy used at runtime has the
// shape { recipients: DistinctionRecipient[] }.
const recipients = recipientsJson as unknown as { recipients: DistinctionRecipient[] }

async function createPDF(recipient: DistinctionRecipient): Promise<PDFDocument> {
  const pdfTemplateBytes = readFileSync(join(import.meta.dirname, config.TEMPLATE_PATH))
  const document = await PDFDocument
  .load(pdfTemplateBytes)
  const { signatureFont, helveticaFont, helveticaBoldObliqueFont } = await getFonts(document, config)
  const certPage = document.getPage(0)

  // Center the participants name & add it to the page
  const pageWidth = certPage.getWidth()
  const voyagerNameWidth = helveticaBoldObliqueFont.widthOfTextAtSize(recipient.certificate_name, 48)
  const voyagerNameLeftPos = pageWidth/2 - voyagerNameWidth/2

  certPage.moveTo(voyagerNameLeftPos,400)
  certPage.drawText(recipient.certificate_name, {
    font: signatureFont,
    size: 48,
  })

  // Add the certificate date to the page
  const certDate = config.COMPLETION_DATE
  const certDateWidth = helveticaBoldObliqueFont.widthOfTextAtSize(certDate, 30)
  
  certPage.moveTo(355, 185)
  certPage.drawText(certDate, {
    font: helveticaFont,
    size: 16
  })

  // Write the completed certificate to the local file system
  writeFileSync(config.CERTIFICATE_PATH
    .concat('Chingu Cert of Distinction - ', recipient.certificate_name,'.pdf'), await document.save())

  // Return the certificate pdf so it can be emailed
  return document
}

// Retrieve the Chingus who have performed a service to Chingu and generate
// a Certificate of Distinction for each one.
const createDistinctionCert = async (): Promise<void> => {
  console.log('createDistinctionCert - ')
  let base64Cert
  for (const recipient of recipients.recipients) {
    console.log(`Processing certificate for ${ recipient.certificate_name }...`)
    // Generate the certificate PDF for this Voyager
    const certDocument = await createPDF(recipient)
      .catch((err) => {
        console.log('Error on recipient: ', recipient)
        console.log('Error: ', err)
        return undefined
    })

    if (!certDocument) continue

    // Convert the PDF to base64 and email it via MailJet
    if (process.env.MODE.toUpperCase() === 'EMAIL') {
      base64Cert = await certDocument.saveAsBase64()
      sendMail(recipient.email, recipient.certificate_name, 'cert.pdf', base64Cert, config.VOYAGE_CERT_TEMPLATE_ID)
    }
  }
}

export { createDistinctionCert }