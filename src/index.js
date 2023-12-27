import 'dotenv/config'
import { createHolidayCert } from './CompCerts/HolidayCert.js'
import { createVoyageCert } from './CompCerts/VoyageCert.js'

(async () => {
  switch (process.env.TYPE) {
    case 'HOLIDAY':
      await createHolidayCert() 
      break
    case 'VOYAGE': 
      await createVoyageCert()
      break
    default: 
      console.error(`Invalid TYPE option (${ process.env.TYPE }) specified in .env file. Valid options are 'VOYAGE' or 'HACKATHON'. Please correct and retry.`)
  }
})()