import nodeMailjet from 'node-mailjet'

const sendMail = (toEmail, toName, attachmentFileName, attachmentBase64) => {
  const mailjet = nodeMailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)

  const mailjetReq = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "To": [
          {
            "Email": `${ toEmail }`,
            "Name": `${ toName }`
          }
        ],
        "TemplateID": parseInt(process.env.MAILJET_TEMPLATE_ID),
        "TemplateLanguage": true,
        "Variables": {
          "toName": `${ toName }`,
        },
        "Attachments": [
          {
            "ContentType": "text/plain",
            "Filename": attachmentFileName,
            "Base64Content": attachmentBase64
          }
      ]
      }
    ]
  })
  mailjetReq
  .then(async (result) => {
    console.log(`...successfully emailed certificate to ${ toEmail }`)
  })
  .catch(async (err) => {
    console.log(`...error emailing certificate to ${ toEmail }`)
    console.log('...err: ', err)
  })
}

export { sendMail }