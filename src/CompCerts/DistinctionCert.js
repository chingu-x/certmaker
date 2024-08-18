import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import { sendMail } from '../Mailjet/sendMail.js'
import recipients from '../../config/cert_of_distinction_20240701.json' assert { type: "json" }

async function createPDF(recipient) {
  const document = await PDFDocument
    .load(readFileSync(process.env.TEMPLATE_PATH)) // TODO: Move outside the Voyager processing loop
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  const certPage = document.getPage(0)

  // Center the participants name & add it to the page
  const pageWidth = certPage.getWidth()
  const recipientNameWidth = helveticaBoldObliqueFont.widthOfTextAtSize(recipient.certificate_name, 48)
  const recipientNameLeftPos = pageWidth/2 - recipientNameWidth/2

  certPage.moveTo(recipientNameLeftPos, 570)
  certPage.drawText(recipient.certificate_name, {
    font: helveticaBoldObliqueFont,
    size: 48,
  })

  // Add the Voyager role & certificate date to the page
  const date = process.env.COMPLETION_DATE
  const dateWidth = helveticaBoldObliqueFont.widthOfTextAtSize(date, 30)
  const dateLeftPos = 445 - dateWidth/2
  
  certPage.moveTo(dateLeftPos, 285)
  certPage.drawText(date, {
    font: helveticaFont,
    size: 24,
    color: rgb(.267,.267,.275),
  })

  // Write the completed certificate to the local file system
  writeFileSync(process.env.CERTIFICATE_PATH
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
      sendMail(recipient.email, recipient.certificate_name, 'cert.pdf', base64Cert, process.env.VOYAGE_CERT_TEMPLATE_ID)
    }
  }
}

export { createDistinctionCert }