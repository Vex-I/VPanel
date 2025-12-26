# VPanel
The backend for my personal website, featuring a basic CMS and JWT-authentication. Uses MongoDB for the database

## Features
---
- Simple CMS, dividing content into types, with an associated outside link or markdown and custom tags for each one.
- JWT-authentication for specific routes associated with modifying the database.

## Setup

setup the environment variables as such:
``
MONGO_URI= "<YOUR-MONGODB-URI>"
JWT-SECRET= <YOUR-JWT-KEY>
``
simple run `npm run start` to test the API

## Documentation

All the available routes and their usage is documented on the `/api-docs` route.

Main website is deployed at [vex-i.pages.dev](vex-i.pages.dev). Feel free to fork this as neccessary.
