import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import * as dotenv from 'dotenv'
import { getSuccessfulVoyagers } from './Airtable/VoyageProjects.js'

dotenv.config()

async function createPDF(voyage) {
  const document = await PDFDocument
    .load(readFileSync("./assets/Chingu Voyage Completion Certificate (V5.0) - Template.pdf"))
  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  const certPage = document.getPage(0)

  // Center the participants name & add it to the page
  const pageWidth = certPage.getWidth()
  const voyagerNameWidth = helveticaBoldObliqueFont.widthOfTextAtSize(voyage.certificate_name, 48)
  const voyagerNameLeftPos = pageWidth/2 - voyagerNameWidth/2

  certPage.moveTo(voyagerNameLeftPos,600)
  certPage.drawText(voyage.certificate_name, {
    font: helveticaBoldObliqueFont,
    size: 48,
  })

  // Add the Voyagee role & certificate date to the page
  const roleAndDate = 'as a '.concat(voyage.role, ' on ', process.env.COMPLETION_DATE)
  const roleAndDateWidth = helveticaBoldObliqueFont.widthOfTextAtSize(roleAndDate, 30)
  const roleAndDateLeftPos = pageWidth/2 - roleAndDateWidth/2
  
  certPage.moveTo(roleAndDateLeftPos, 445)
  certPage.drawText(roleAndDate, {
    font: helveticaFont,
    size: 30,
    color: rgb(.267,.267,.275),
  })

  // Add the Voyage name to the page
  certPage.moveTo(675, 370)
  certPage.drawText('Voyage #'.concat(voyage.voyage.slice(1)), {
    font: helveticaBoldObliqueFont,
    size: 36,
  })

  // Write the completed certificate to the local file system
  writeFileSync('Chingu Completion Cert - '
    .concat(voyage.voyage,' - ',voyage.tier,' ',voyage.team_no,' - ',
      voyage.certificate_name,'.pdf'), await document.save())
}

// Retrieve the Chingus who successfully completed the Voyage and generate
// a Completion Certificate for each one.
const successfulVoyagers = await getSuccessfulVoyagers(process.env.VOYAGE)
successfulVoyagers.forEach((voyager) => {
  createPDF(voyager).catch((err) => console.log(err))
})
createPDF().catch((err) => console.log(err))