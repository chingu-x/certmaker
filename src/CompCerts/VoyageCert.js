import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import { getSuccessfulVoyagers } from '../Airtable/VoyageProjects.js'
import { sendMail } from '../Mailjet/sendMail.js'

// Copied from https://github.com/Hopding/pdf-lib/issues/555#issuecomment-670241308
const createPageLinkAnnotation = (page, uri) => {
  page.doc.context.register(
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

const createPDF = async (voyager) => {
  const document = await PDFDocument
    .load(readFileSync(process.env.TEMPLATE_PATH)) // TODO: Move outside the Voyager processing loop
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  const certPage = document.getPage(0)

  // Center the participants name & add it to the page
  const pageWidth = certPage.getWidth()
  const voyagerNameWidth = helveticaBoldObliqueFont.widthOfTextAtSize(voyager.certificate_name, 48)
  const voyagerNameLeftPos = pageWidth/2 - voyagerNameWidth/2

  certPage.moveTo(voyagerNameLeftPos,400)
  certPage.drawText(voyager.certificate_name, {
    font: helveticaBoldObliqueFont,
    size: 48,
  })

  // Add the Voyager role & certificate date to the page
  const role = voyager.role
  const roleWidth = helveticaBoldObliqueFont.widthOfTextAtSize(role, 18)
  const roleLeftPos = pageWidth/2 - roleWidth/2
  
  certPage.moveTo(roleLeftPos, 295)
  certPage.drawText(role, {
    font: helveticaFont,
    size: 18
  })

  // Add the Voyage name to the page
  certPage.moveTo(405, 672)
  const helveticaObliqueFont = await document.embedFont(StandardFonts.HelveticaOblique)
  certPage.drawText(voyager.voyage.slice(1), {
    font: helveticaObliqueFont,
    size: 24,
  })

  // Add the repo & deployment URL's to the page
  certPage.moveTo(20, 75)
  certPage.drawText('Repo: '.concat(voyager.repo_url), {
    font: helveticaFont,
    size: 12,
    color: rgb(0, 0.53, 0.71)
  })
  const repoLink = createPageLinkAnnotation(certPage, voyager.repo_url)
  certPage.node.set(PDFName.of('Annots'), document.context.obj([repoLink]))

  certPage.moveTo(20, 60)
  certPage.drawText('Deployed at: '.concat(voyager.deployed_url), {
    font: helveticaFont,
    size: 12,
    color: rgb(0, 0.53, 0.71)
  })
  const deployLink = createPageLinkAnnotation(certPage, voyager.deployed_url)
  certPage.node.set(PDFName.of('Annots'), document.context.obj([deployLink]))

  // Write the completed certificate to the local file system
  const teamNo = voyager.team_no > 9 ? voyager.team_no : '0'.concat(voyager.team_no)
  writeFileSync(process.env.CERTIFICATE_PATH
    .concat('Chingu Completion Cert - ',voyager.voyage,' - ',voyager.tier,'-',teamNo,' - ',
      voyager.certificate_name,'.pdf'), await document.save())

  // Return the certificate pdf so it can be emailed
  return document
}

// Retrieve the Chingus who successfully completed the Voyage and generate
// a Completion Certificate for each one.
const createVoyageCert = async () => {
  const successfulVoyagers = await getSuccessfulVoyagers(process.env.VOYAGE)
  let certDocument
  let base64Cert
  for (let voyager of successfulVoyagers) {
    console.log(`Processing certificate for ${ voyager.discord_name } / ${ voyager.certificate_name }...`)
    // Generate the certificate PDF for this Voyager
    certDocument = await createPDF(voyager)
      .catch((err) => {
        console.log('Error on Voyager: ', voyager)
        console.log('Error: ', err)
    })

    // Convert the PDF to base64 and email it via MailJet
    if (process.env.MODE.toUpperCase() === 'EMAIL') {
      base64Cert = await certDocument.saveAsBase64()
      sendMail(voyager.email, voyager.certificate_name, 'cert.pdf', base64Cert, process.env.VOYAGE_CERT_TEMPLATE_ID)
    }
  }
}

export { createVoyageCert }