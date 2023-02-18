import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"

async function createPDF() {
  const document = await PDFDocument.load(readFileSync("./certtemplate.pdf"));

  const courierBoldFont = await document.embedFont(StandardFonts.Courier);
  const firstPage = document.getPage(0);

  firstPage.moveTo(72, 570);
  firstPage.drawText(new Date().toUTCString(), {
    font: courierBoldFont,
    size: 12,
  });

  firstPage.moveTo(105, 530);
  firstPage.drawText("Ms. Jane,", {
    font: courierBoldFont,
    size: 12,
  });

  firstPage.moveTo(72, 330);
  firstPage.drawText("John Doe \nSr. Vice President Engineering \nLogRocket", {
    font: courierBoldFont,
    size: 12,
    lineHeight: 10,
  });

  writeFileSync("jane-doe.pdf", await document.save());
}

createPDF().catch((err) => console.log(err));