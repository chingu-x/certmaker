


[contributors-shield]: https://img.shields.io/github/contributors/chingu-x/certmaker.svg?style=for-the-badge
[contributors-url]: https://github.com/chingu-x/certmaker/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/chingu-x/certmaker.svg?style=for-the-badge
[forks-url]: https://github.com/chingu-x/certmaker/network/members
[stars-shield]: https://img.shields.io/github/stars/chingu-x/certmaker.svg?style=for-the-badge
[stars-url]: https://github.com/chingu-x/certmaker/stargazers
[issues-shield]: https://img.shields.io/github/issues/chingu-x/certmaker.svg?style=for-the-badge
[issues-url]: https://github.com/chingu-x/certmaker/issues

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

# certmaker

certmaker creates Voyage Completion Certificates, VoyageXP Completion
Certificates, and Certificates of Distinction for Chingu Voyagers and
contributors.

[Process Overview](#process-overview) - [Installation](#installation) - [Usage](#usage) - [Configuration](#configuration) - [Release History](#release-history) - [License](#license)

## Process Overview

For Voyage Completion and VoyageXP Completion Certificates it uses the
completion summary data for Voyage teams that is maintained in Airtable. For
Certificates of Distinction it uses recipient data maintained in
[`config/cert_of_distinction_recipients.json`](./config/cert_of_distinction_recipients.json)
in this repo.

## Installation

To install this app:
```
git clone https://github.com/chingu-x/certmaker.git
npm i
```

To run the app check out the information in the *_'Usage'_* section below.

certmaker must be defined in the Discord server and granted administrator
permissions. 
## Usage

certmaker is a command line application (CLI). The basic command to run it is:
```
npm run start
```

The certificate type generated, and whether certificates are emailed, are
controlled by the `TYPE` and `MODE` values in the `.env` file. The content of
each certificate (Voyage, dates, paths, fonts, etc.) is controlled by the
matching file under `config/` - see [Configuration](#configuration) below.

## Configuration

### `.env`

| `.env` Parm    | Description                              |
|----------------|------------------------------------------|
| AIRTABLE_API_KEY | Airtable API key needed to access Airtable |
| AIRTABLE_BASE  | Airtable base id containing the table(s) to be accessed |
| MAILJET_API_KEY | MailJet API key |
| MAILJET_SECRET_KEY | MailJet API Secret key |
| TYPE | The type of certificate to create - `VOYAGE`, `VOYAGEXP` or `DISTINCTION` |
| MODE | Mode of operation. `EMAIL` will generate & email certificates. `NOEMAIL` or omitted will generate certificates, but not email them. |

`env.sample` in the root of the project contains a sample of how to set up a `.env` file.

### Certificate type config files

Each `TYPE` reads its certificate content settings from a matching file under `config/`:

| `TYPE` | Config file |
|----------------|------------------------------------------|
| VOYAGE | [`config/VoyageConfig.js`](./config/VoyageConfig.js) |
| VOYAGEXP | [`config/VoyageXPConfig.js`](./config/VoyageXPConfig.js) |
| DISTINCTION | [`config/DistinctionConfig.js`](./config/DistinctionConfig.js) |

Each config file exports the following fields:

| Field | Description |
|----------------|------------------------------------------|
| VOYAGE | The Voyage name (e.g. `'V99'`) certificates are to be produced for. |
| TEAMS | Teams certs are to be produced for. Use `'ALL'` for all teams or a comma separated list of team numbers. Not used for `DISTINCTION`. |
| ROLES | Comma separated list of Voyager roles to include on certificates (e.g. `'Product Owner,Scrum Master,UI/UX,Developer,Voyage Guide'`). |
| COMPLETION_DATE | Date to be added to certificates (e.g. `'April 23, 2023'`). |
| CERTIFICATE_PATH | Path where generated certificates are written on the local computer (e.g. `'/Users/jim/Downloads/Chingu_V42_Certificates/'`). |
| NAME_FONT_PATH | Path to the True Type (`.ttf`) signature font used for participant names, relative to the project root (e.g. `'./assets/fonts/SnellRoundhand.ttf'`). |
| TEMPLATE_PATH | Path to the PDF certificate template, relative to `src/CompCerts/` (e.g. `'../../assets/Chingu Voyage Completion Certificate (V6.0) - Template.pdf'`). |
| VOYAGE_CERT_TEMPLATE_ID | MailJet template ID used to email the certificate when `MODE=EMAIL`. |

`DISTINCTION` certificates additionally read their recipient list from
[`config/cert_of_distinction_recipients.json`](./config/cert_of_distinction_recipients.json)
instead of Airtable.

### Examples

#### Example #1 - Create Voyage Completion Certificates for all teams

Update `.env`:
```
AIRTABLE_API_KEY=key4nOhM9fKbs94Ba
AIRTABLE_BASE=appgoC1weqBUY5EX
MAILJET_API_KEY=01e7ab43fsg6fsgh45fs3478ffh5809
MAILJET_SECRET_KEY=84fs55gsfg66hh533gfr309kkk53f2f
TYPE=VOYAGE
MODE=NOEMAIL
```

Update `config/VoyageConfig.js`:
```js
const config = {
  TYPE: VOYAGE,
  VOYAGE: 'V42',
  TEAMS: 'ALL',
  ROLES: 'Product Owner,Scrum Master,UI/UX,Developer,Voyage Guide',
  COMPLETION_DATE: 'April 23, 2023',
  CERTIFICATE_PATH: '/Users/jim/Downloads/Chingu_V42_Certificates/',
  NAME_FONT_PATH: './assets/fonts/SnellRoundhand.ttf',
  TEMPLATE_PATH: '../../assets/Chingu Voyage Completion Certificate (V6.0) - Template.pdf',
  VOYAGE_CERT_TEMPLATE_ID: 123456789
}
```

Next, run certmaker:
```
npm run start
```

All certificates will be added to the directory specified by `CERTIFICATE_PATH`.

#### Example #2 - Create & email certificates for specific Voyage teams

Set `MODE=EMAIL` in `.env`, and in `config/VoyageConfig.js` set
`TEAMS: '01,34'`. Certificates for Voyagers on teams 01 and 34 will be
generated, written to `CERTIFICATE_PATH`, and emailed using the MailJet
template specified by `VOYAGE_CERT_TEMPLATE_ID`.

#### Example #3 - Create VoyageXP Completion Certificates

Set `TYPE=VOYAGEXP` in `.env`, then update `config/VoyageXPConfig.js` with the
Voyage, team, role, date, path and template settings described above.

#### Example #4 - Create Certificates of Distinction

Set `TYPE=DISTINCTION` in `.env`, update `config/DistinctionConfig.js`, and
list recipients (email & certificate name) in
`config/cert_of_distinction_recipients.json`.

## Release History

You can find what changed, when in the [release history](./docs/RELEASE_HISTORY.md)

## License

Copyright 2023 &copy; Chingu, Inc.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
