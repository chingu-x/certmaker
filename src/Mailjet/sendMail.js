import nodeMailjet from 'node-mailjet'

const sendMail = (toEmail, toName, attachmentFileName, attachmentBase64) => {
  nodeMailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY)

  const mailjetReq = nodeMailjet
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
        "TemplateID": process.env.MAILJET_TEMPLATE_ID,
        "TemplateLanguage": true,
        "Variables": {
          "toName": `${ toName }`,
          "reason": reason !== undefined ? reason : ''
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
    console.log('mailjetReq successfully completed')
    res.status(200).json({ 
      message: "Message successfully emailed",
      code: 200
    })
  })
  .catch(async (err) => {
    console.log('Error sending comment: ', err)
    res.status(500).json({
        message: "Message email failed",
        code: 500
    })
  })
}

export { sendMail }