import { PDFDocument, PDFName, PDFPage, PDFString, rgb } from 'pdf-lib'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { getSuccessfulVoyagers } from '../Airtable/VoyageProjects.js'
import { sendMail } from '../Mailjet/sendMail.js'
import { getFonts } from '../Util/util.js'
import config from '../../config/VoyageXPConfig.js'
import type { Voyager } from '../Util/types.js'

// Copied from https://github.com/Hopding/pdf-lib/issues/555#issuecomment-670241308
const createPageLinkAnnotation = (page: PDFPage, uri: string) => {
  return page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [0, 30, 40, 230],
      Border: [0, 0, 2],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    }),
  )
}

const createPDF = async (voyager: Voyager): Promise<PDFDocument> => {
  const pdfTemplateBytes = readFileSync(join(import.meta.dirname, config.TEMPLATE_PATH))
  const document = await PDFDocument
  .load(pdfTemplateBytes)
  const { signatureFont, helveticaFont, helveticaBoldObliqueFont } = await getFonts(document, config)
  const certPage = document.getPage(0)

  // Add the Voyage name to the page
  certPage.moveTo(405, 672)
  certPage.drawText(voyager.voyage.slice(1), {
    font: helveticaFont,
    size: 24,
  })

  // Center the participants name & add it to the page
  const pageWidth = certPage.getWidth()
  const voyagerNameWidth = signatureFont.widthOfTextAtSize(voyager.certificate_name, 40)
  const voyagerNameLeftPos = pageWidth/2 - voyagerNameWidth/2

  certPage.moveTo(voyagerNameLeftPos,290)
  certPage.drawText(voyager.certificate_name, {
    font: signatureFont,
    size: 40,
  })

  // Add the Voyager role to the page
  const role = voyager.role
  const roleWidth = helveticaBoldObliqueFont.widthOfTextAtSize(role, 18)
  const roleLeftPos = pageWidth/2 - roleWidth/2
  
  certPage.moveTo(roleLeftPos, 260)
  certPage.drawText(role, {
    font: helveticaFont,
    size: 18
  })

  // Add the certificate date to the page
  const certDate = config.COMPLETION_DATE
  const certDateWidth = helveticaBoldObliqueFont.widthOfTextAtSize(certDate, 30)
  
  certPage.moveTo(555, 115)
  certPage.drawText(certDate, {
    font: helveticaFont,
    size: 16
  })

  // Add the repo & deployment URL's to the page
  certPage.moveTo(20, 40)
  certPage.drawText('Repo: '.concat(voyager.repo_url), {
    font: helveticaFont,
    size: 12,
    color: rgb(0, 0.53, 0.71)
  })
  const repoLink = createPageLinkAnnotation(certPage, voyager.repo_url)
  certPage.node.set(PDFName.of('Annots'), document.context.obj([repoLink]))

  certPage.moveTo(20, 30)
  certPage.drawText('Deployed at: '.concat(voyager.deployed_url), {
    font: helveticaFont,
    size: 12,
    color: rgb(0, 0.53, 0.71)
  })
  const deployLink = createPageLinkAnnotation(certPage, voyager.deployed_url)
  certPage.node.set(PDFName.of('Annots'), document.context.obj([deployLink]))

  // Write the completed certificate to the local file system
  const teamNo = Number(voyager.team_no) > 9 ? voyager.team_no : '0'.concat(voyager.team_no)
  writeFileSync(config.CERTIFICATE_PATH
    .concat('Chingu Completion Cert - ',voyager.voyage,' - ',voyager.tier,'-',teamNo,' - ',
      voyager.certificate_name,'.pdf'), await document.save())

  // Return the certificate pdf so it can be emailed
  return document
}

// Retrieve the Chingus who successfully completed the Voyage and generate
// a Completion Certificate for each one.
const createVoyageXPCert = async (): Promise<void> => {
  const successfulVoyagers = await getSuccessfulVoyagers(config.VOYAGE, config.ROLES, config.TEAMS)
  let base64Cert
  for (const voyager of successfulVoyagers) {
    console.log(`Processing certificate for ${ voyager.discord_name } / ${ voyager.certificate_name }...`)
    // Generate the certificate PDF for this Voyager
    const certDocument = await createPDF(voyager)
      .catch((err) => {
        console.log('Error on Voyager: ', voyager)
        console.log('Error: ', err)
        return undefined
    })

    if (!certDocument) continue

    // Convert the PDF to base64 and email it via MailJet
    if (process.env.MODE.toUpperCase() === 'EMAIL') {
      base64Cert = await certDocument.saveAsBase64()
      sendMail(voyager.email, voyager.certificate_name, 'cert.pdf', base64Cert, config.VOYAGE_CERT_TEMPLATE_ID)
    }
  }
}

export { createVoyageXPCert }