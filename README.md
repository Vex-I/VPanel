# VPanel
The backend for my personal website, featuring a basic CMS and JWT-authentication. Uses MongoDB for the database.

## Motivation
I wanted a simple API that allows me to manage content from anywhere and share certain privileges in 
doing so.

## Features
- Simple CMS, dividing content into types, with an associated outside link or markdown and custom tags for each one.
- JWT-authentication for specific routes associated with modifying the database.
- Long-lived read token for displaying content.

## Setup

setup the environment variables as such:

```
MONGO_URI= "<YOUR-MONGODB-URI>"
JWT_SECRET= <YOUR-JWT-KEY>
PUBLIC_URI = <URLs-ALLOWED-TO-INVOKE-GET-METHODS> 
ADMIN_URI = <URLs-ALLOWED-TO-INVOKE-ALL-METHODS>
```

then simply run `npm run start` to run localy.

## Documentation

All the available routes and their usage is documented on the `/api-docs` route.

Main website is deployed at [vex-i.pages.dev](vex-i.pages.dev). Feel free to fork this as neccessary.
