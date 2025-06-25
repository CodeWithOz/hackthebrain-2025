This project is a platform that matches immigrant doctors in Canada with hospitals that need their skills. It translates the credentials of the doctors to their Canadian equivalents in order to match the credentials to the requirements of the hospitals. Hospitals specify their needs in the form of job postings, and doctors apply to those jobs via the platform.

## Features

- Doctor registration and profile management
- Hospital registration and profile management
- Credential mapping (evaluate which Canadian requirements are met by immigrant credentials, and suggest actions to fill any gaps)
- Credential matching
- Automated application
- Job postings
- Notifications

## Tech Stack

- Next.js
- TypeScript
- Prisma

## User Flows

### Doctor

1. Landing Page Sample: doctor specifies their qualifications from their country of origin, their experience, and their location. System converts their credentials to Canadian equivalents, then finds best matching jobs for the doctor. System presents the results to the doctor, in the form of the doctor's equivalent credentials and the jobs for which the doctor is a match.
2. Doctor tries to view results without logging in, and is redirected to login/signup page.
3. Doctor logs in, and is redirected to dashboard.

### Hospital

1. Landing Page Sample: hospital admin specifies their needs in the form of job postings. System finds best matching doctors for the hospital. System presents the results to the hospital, in the form of the doctor's equivalent credentials.
2. Hospital admin tries to view results without logging in, and is redirected to login/signup page.
3. Hospital admin logs in, and is redirected to dashboard.

