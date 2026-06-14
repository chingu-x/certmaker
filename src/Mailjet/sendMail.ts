import Mailjet from 'node-mailjet'

const sendMail = (toEmail: string, toName: string, attachmentFileName: string, attachmentBase64: string, templateId: number): void => {
  const mailjet = Mailjet.Client.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)

  const mailjetReq = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
          "From": {
            "Email": "service@chingu.io",
            "Name": "Chingu Admin Team"
          },
        "To": [
          {
            "Email": `${ toEmail }`,
            "Name": `${ toName }`
          }
        ],
        "TemplateID": templateId,
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