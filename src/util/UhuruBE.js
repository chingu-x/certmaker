import fetch from 'node-fetch'

  const sendEmail = async (environment, email, name, messageID) => {
    return new Promise(async (resolve, reject) => {
      const { UHURUBE_URL } = environment.getOperationalVars()
      let response = await fetch(UHURUBE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "messageType": messageID,
          "toEmail": `${ email }`,
          "toName": `${ name }`
        })
      });
      console.log(`UHURUBE_URL: ${ UHURUBE_URL } Result status: ${ response.status } - ${ response.statusText }`)
      
      if (response.status === 200) {
        resolve(recordID)
      } else {
        reject({
          "errorStatus": `${ response.status }`,
          "errorText": `${ response.statusText }`
        })
      }
    })
  }

export { sendEmail }
