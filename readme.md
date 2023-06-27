


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

Certmaker automates the process of creating Voyage completion certificates
that are provided to Chingus who successfully complete a Voyage.

[Process Overview](#process-overview) - [Installation](#installation) - [Usage](#usage) - [Release History](#release-history) - [License](#license)

## Process Overview

Chingucertmaker uses the completion summary for Voyage teams that is maintained
in Airtable.

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
    - or -
node src/index.js
```
Before running it you'll first need to update option values  
in the `.env` file. 

| `.env` Parm    | Description                              |
|----------------|------------------------------------------|
| AIRTABLE_API_KEY | Airtable API key needed to access Airtable |
| AIRTABLE_BASE  | Airtable base id containing the table(s) to be accessed |
| MAILJET_API_KEY | MailJet API key |
| MAILJET_SECRET_KEY | MailJet API Secret key |
| MODE | Mode of operation. `EMAIL` will generate & email certificates. `NOEMAIL` or omitted will generate certificates, but not email them. |
| COMPLETION_DATE | Date to be added to certificates (e.g. 'April 23, 2023') |
| CERTIFICATE_PATH | Path for where certificates will be stored on the local computer (e.g. /Users/jim/Downloads/Chingu_V42_Certificates/) |
| VOYAGE         | The Voyage name (e.g. 'V99') certificates are to be produced for |
| TEAMS          | Teams certs are to be produced for. Use 'ALL' for all teams or a comma separated list of team numbers. |

`env.sample` in the root of the project contains a sample of how to set up a `.env` file.

### Examples

#### Example #1 - Create certificates for all teams in a Voyage

Update the `.env` file as follows:
```
# Airtable
AIRTABLE_API_KEY=key4nOhM9fKbs94Ba
AIRTABLE_BASE=appgoC1weqBUY5EX
# Mailjet API
MAILJET_API_KEY=01e7ab43fsg6fsgh45fs3478ffh5809
MAILJET_SECRET_KEY=84fs55gsfg66hh533gfr309kkk53f2f
# Certificate info
MODE=NOEMAIL
COMPLETION_DATE=April 23, 2023
CERTIFICATE_PATH=/Users/jim/Downloads/Chingu_V42_Certificates/
# Voyage Filters
VOYAGE=V42
TEAMS=ALL

```

Next, run certmaker:
```
npm run start
```

All certificates will be added to the directory specified by the `CERTIFICATE_PATH`
environment variable.

#### Example #2 - Create certificates for specific Voyage teams

Update the `.env` file as follows:
```
# Airtable
AIRTABLE_API_KEY=key4nOhM9fKbs94Ba
AIRTABLE_BASE=appgoC1weqBUY5EX
# Mailjet API
MAILJET_API_KEY=01e7ab43fsg6fsgh45fs3478ffh5809
MAILJET_SECRET_KEY=84fs55gsfg66hh533gfr309kkk53f2f
# Certificate info
MODE=NOEMAIL
COMPLETION_DATE=April 23, 2023
CERTIFICATE_PATH=/Users/jim/Downloads/Chingu_V42_Certificates/
# Voyage Filters
VOYAGE=V42
TEAMS=01,34
```

Next, run certmaker:
```
npm run start
```

Certificates for Voyagers in V43 teams 01 and 34 will be added to the directory specified by the `CERTIFICATE_PATH` environment variable.

## Release History

You can find what changed, when in the [release history](./docs/RELEASE_HISTORY.md)

## License

Copyright 2023 &copy; Chingu, Inc.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
