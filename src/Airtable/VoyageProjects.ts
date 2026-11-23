import Airtable from 'airtable'
import type { Voyager } from '../Util/types.js'

interface VoyageProjectFields extends Airtable.FieldSet {
  'Email': string
  'What is your Voyage?': string
  'What is your Tier?': string
  'What is your Team number?': number
  'Discord Name (from Applications)': string
  'Certificate name': string
  'Role (from Voyage Signups Link)': string
  'URL of your Github repo:': string
  'URL of your deployed project:': string
}

// Retrieve the Voyagers who successfully completed the Voyage
const getSuccessfulVoyagers = async (voyageName: string, roles: string, teams: string, email_addresses: string[]): Promise<Voyager[]> => {
  return new Promise<Voyager[]>(async (resolve, reject) => {
    const voyagers: Voyager[] = []
    let filter = "AND(" +
        "\n{What is your Voyage?} = \"" + voyageName + "\", " + 
        "\n{Completed Voyage?} = \"Yes\", " +
        "\n{Completion Status} = \"Cert issued\", "
      ;
      

    function getVoyagerRoleQuery(roles: string): string {
      let roleClause = ''
      if (roles !== 'ALL' && roles !== '') {
      // Construct a role filter to select only desired roles
        const rolesToSelect = (roles).split(',')
        for (let role of rolesToSelect) {
          roleClause = roleClause.concat(`\n{Role (from Voyage Signups Link)} = \"${ role }\",`)
        }
      }
      roleClause = roleClause.concat('\n{Role (from Voyage Signups Link)} = \"Technical Guide\"')
      return '\nOR(' + roleClause + ')'
    }

    function getVoyagerEmailQuery(email_addresses: string[]): string {
      let emailClause = ''
      if (email_addresses && email_addresses.length > 0) {
        for (let i = 0; i < email_addresses.length; i++) {
          if (email_addresses[i] === '') {
            continue;
          }
          emailClause = emailClause.concat(`{Email} = \"${ email_addresses[i] }\"`)
          if (i < (email_addresses.length - 1)) {
            emailClause = emailClause.concat(', ')
          }
        }
      }
      if (emailClause === '') {
        return ''
      }
      return '\nOR(' + emailClause + '),'
    }

    function getVoyagerTeamQuery(teams: string): string {
      let teamClause = ''
      if (teams !== 'ALL' && teams !== '') {
        const teamNumbers = teams.split(',')
        for (let i = 0; i < teamNumbers.length; i++) {
          teamClause = teamClause.concat(`{What is your Team number?} = ${ teamNumbers[i] }`)
          if (i < (teamNumbers.length - 1)) {
            teamClause = teamClause.concat(', ')
          }
        }
      }
      return '\nOR(' + teamClause + ')'       
    }

    if (email_addresses && email_addresses.length > 0) {
      const emailQuery = getVoyagerEmailQuery(email_addresses)
      filter +=emailQuery
    }
    
    if (teams === 'ALL') {
      const roleQuery = getVoyagerRoleQuery(roles)
      filter += roleQuery
    } else {
      const teamQuery = getVoyagerTeamQuery(teams)
      filter += teamQuery
    }

    filter += ",\n{Product} != \"\"\n)"
    
    console.log('Filter: ', filter)

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE)
    
    base<VoyageProjectFields>('Voyage Projects').select({
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