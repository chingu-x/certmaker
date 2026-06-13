import { PDFDocument, PDFName, PDFString, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import { sendMail } from '../Mailjet/sendMail.js'
import { getFonts } from '../Util/util.js'
import config from '../../config/DistinctionConfig.js'
import recipients from '../../config/cert_of_distinction_recipients.json' with { type: "json" }

async function createPDF(recipient) {
  const document = await PDFDocument
    .load(readFileSync(config.TEMPLATE_PATH)) 
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
const createDistinctionCert = async () => {
  console.log('createDistinctionCert - ')
  let certDocument
  let base64Cert
  for (let recipient of recipients.recipients) {
    console.log(`Processing certificate for ${ recipient.certificate_name }...`)
    // Generate the certificate PDF for this Voyager
    certDocument = await createPDF(recipient)
      .catch((err) => {
        console.log('Error on recipient: ', recipient)
        console.log('Error: ', err)
    })

    // Convert the PDF to base64 and email it via MailJet
    if (process.env.MODE.toUpperCase() === 'EMAIL') {
      base64Cert = await certDocument.saveAsBase64()
      sendMail(recipient.email, recipient.certificate_name, 'cert.pdf', base64Cert, config.VOYAGE_CERT_TEMPLATE_ID)
    }
  }
}

export { createDistinctionCert }