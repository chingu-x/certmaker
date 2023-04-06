import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"

async function createPDF() {
  const document = await PDFDocument.load(readFileSync("./assets/Chingu Voyage Completion Certificate - Template.pdf"))

  const helveticaFont = await document.embedFont(StandardFonts.Helvetica)
  const helveticaBoldObliqueFont = await document.embedFont(StandardFonts.HelveticaBoldOblique)
  const firstPage = document.getPage(0)

  const dateFormat = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }
  const issueDate = 'on '.concat(Intl.DateTimeFormat('en',dateFormat).format(new Date()))
  firstPage.moveTo(700, 450)
  firstPage.drawText(issueDate, {
    font: helveticaFont,
    size: 28,
  })

  firstPage.moveTo(700, 600);
  firstPage.drawText("Jane Doe", {
    font: helveticaBoldObliqueFont,
    size: 36,
  })

  firstPage.moveTo(675, 370);
  firstPage.drawText("Voyage #44", {
    font: helveticaBoldObliqueFont,
    size: 36,
  })

  writeFileSync("Completed Cert.pdf", await document.save())
}

createPDF().catch((err) => console.log(err))