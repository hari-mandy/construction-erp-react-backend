# Backend functionalites for the ERP Dashboard.

The Database used here is MySQl Which runs on the Mamp Pro. The frame work used here is Express js.

## Acknowledgements

This Project Contains only the backend Functionalites. For Experiencing the UI visit [Construction ERP Frontend using react](https://github.com/hari-mandy/construction-epr-react).

## Core Libraries Used

-   cors v2.8.5
-   dotenv v16.4.7
-   express v4.21.2
-   mysql v2.18.1
-   node-cron v3.0.3
-   nodemailer v6.10.0
-   uuid v11.1.0

## Features

-   Email template was developed for the password reset.
-   Random tokens were created for the reset password url's.
-   To connect with mamp pro's MySql socket path is mentioned.
-   Using node-cron the tokens will be not valid after 10 minutes from the created time.

## Folder Structure

```.
├── Config
│    ├── database.js            # Establish the connection with the database.
├── Controllers
│   ├── user-controllers.js     # Have the functions for Executing Query's.
├── Routes
│   ├── user-routes.js          # Have the path for the api Url's.
├── Utils
│   ├── clean-reset-tokens.js.  # Have function to reset tokens after 10 minutes.
│   ├── password-reset-mail.js. # Have the Mail tempalte for passwod reset.
├── index.js                    # file to connect all the functions.
├── package-lock.json
├── package.json
└── README.md
```

## Installation

This a Fullstack application but this Project has only Backend functions. to experience frontend UI visit [construction-erp-react](https://github.com/hari-mandy/construction-epr-react).

Go to project directory and run (make sure you have node installed first).

```bash
  npm install
  npm start
```
