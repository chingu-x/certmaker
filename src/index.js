import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import * as dotenv from 'dotenv'
import { getSuccessfulVoyagers } from './Airtable/VoyageProjects.js'

dotenv.config()

async function createPDF() {
  const document = await PDFDocument.load(readFileSync("./assets/Chingu Voyage Completion Certificate (V5.0) - Template.pdf"))

  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  const certPage = document.getPage(0)

  const dateFormat = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }
  const issueDate = 'on '.concat(Intl.DateTimeFormat('en',dateFormat).format(new Date()))
  certPage.moveTo(700, 450)
  certPage.drawText(issueDate, {
    font: helveticaFont,
    size: 28,
  })

  const pageWidth = certPage.getWidth()
  const voyagerNameWidth = helveticaBoldObliqueFont.widthOfTextAtSize('Johnson Obliquefontana', 36)
  const voyagerNameLeftPos = pageWidth/2 - voyagerNameWidth/2

  certPage.moveTo(voyagerNameLeftPos,600)
  certPage.drawText('Johnson Obliquefontana', {
    font: helveticaBoldObliqueFont,
    size: 36,
  })

  certPage.moveTo(675, 370)
  certPage.drawText("Voyage #44", {
    font: helveticaBoldObliqueFont,
    size: 36,
  })

  writeFileSync("Completed Cert.pdf", await document.save())
}

const successfulVoyagers = await getSuccessfulVoyagers(process.env.VOYAGE)
console.log('successfulVoyager: ', successfulVoyagers)
createPDF().catch((err) => console.log(err))