import Airtable from 'airtable'

// Retrieve the Voyagers who successfully completed the Voyage
const getSuccessfulVoyagers = async (voyageName) => {
  return new Promise(async (resolve, reject) => {
    let voyagers = []

    let filter
    if (process.env.TEAMS === 'ALL') {
      // Create a filter to extract all team members who successfully completed
      filter = "AND(" + 
        "{What is your Voyage?} = \"" + voyageName + "\", " + 
        "{Completed Voyage?} = \"Yes\" " + 
      ")"
    } else {
      // Create a filter to extract team members from specific teams who 
      // successfully completed
      const teamNumbers = process.env.TEAMS.split(',')
      const teamConditions = teamNumbers.map(teamNumber => {
        return '{'.concat('What is your Team number?}',' = ',teamNumber)
      })

      let orClause = ''
      for (let i = 0; i < teamConditions.length; i++) {
        orClause = orClause.concat(teamConditions[i],)
        if (i < (teamConditions.length - 1)) {
          orClause = orClause.concat(', ')
        }
      }

      filter = "AND(" + 
        "{What is your Voyage?} = \"" + voyageName + "\", " + 
        "{Completed Voyage?} = \"Yes\" , " + 
        "OR(" + orClause + ") " + 
      ")"
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)
    
    base('Voyage Projects').select({ 
      filterByFormula: filter,
      view: 'Voyage Project Submissions' 
    })
    .eachPage(function page(records, fetchNextPage) {
      // Return an object array containing Voyagers who successfully 
      // completed the Voyage
      let voyagerNo = 0
      for (let record of records) {
        voyagerNo = ++voyagerNo
        const tierName = record.get('What is your Tier?').slice(0,6)
        voyagers.push({ 
          number: `${ voyagerNo }`,
          email: `${ record.get('Email') }`,
          voyage: `${ record.get('What is your Voyage?') }`,
          tier: `${ tierName }`,
          team_no: `${ record.get('What is your Team number?') }`,
          discord_name: `${ record.get('Discord Name (from Applications)') }`,
          certificate_name: `${ record.get('Certificate name')}`,
          role: `${ record.get('Role (from Voyage Signups Link)') }`,
          repo_url: `${ record.get('URL of your Github repo:') }`,
          deployed_url: `${ record.get('URL of your deployed project:') }`,
        })      
      }

      // To fetch the next page of records, call 'fetchNextPage'.
      // If there are more records, 'page' will get called again.
      // If there are no more records, 'done' will get called.
      fetchNextPage()
    }, function done(err) {
      if (err) { 
        console.error('getSuccessfulVoyagers - filter: ', filter)
        console.error(err) 
        reject(err) 
      }
      resolve(voyagers)
    })
  })
}

export { getSuccessfulVoyagers }