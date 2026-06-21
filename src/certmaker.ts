import 'dotenv/config'
import { createDistinctionCert } from './CompCerts/DistinctionCert.js'
import { createVoyageCert } from './CompCerts/VoyageCert.js'
import { createVoyageXPCert } from './CompCerts/VoyageXPCert.js'

(async () => {
  switch (process.env.TYPE) {
    case 'DISTINCTION':
      await createDistinctionCert() 
      break  
    case 'VOYAGE': 
      await createVoyageCert()
      break
    case 'VOYAGEXP': 
      await createVoyageXPCert()
      break
    default: 
      console.error(`Invalid TYPE option (${ process.env.TYPE }) specified in .env file. Valid options are 'VOYAGE', 'VOYAGEXP', 'DISTINCTION'. Please correct and retry.`)
  }
})()