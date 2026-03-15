# VPanel
The headless CMS for my personal website, built using Express. Uses MongoDB as a database.

## Motivation
I wanted a simple CMS that allows me to shove whatever it is I need to display.
It neede to have basic collaboration features, as well as being flexible enough
for me to fit a wide range of contents there.

## Features
- Simple CMS, dividing content into types, with an associated outside link or markdown and custom tags for each one.
- JWT-authentication for specific routes associated with modifying content
  entries.
- Long-lived read token for displaying content from an external tool.
- Obsidian wikilinks parser.

## Setup

Setup the environment variables as such:

```
MONGO_URI= "<YOUR-MONGODB-URI>"
JWT_SECRET= <YOUR-JWT-KEY>
PUBLIC_URI = <URLs-ALLOWED-TO-INVOKE-GET-METHODS> 
ADMIN_URI = <URLs-ALLOWED-TO-INVOKE-ALL-METHODS>
```

then simply run `npm run start` to run localy.

## Documentation

All the available routes and their usage is documented on the `/api-docs` route.

Each content is stored with the following schema: 

```js
const contentSchema = new mongoose.Schema({
    title: { type: String, required: false, default: 'Test post for Test People'},
    type: {type: String, required: true},
    slug: { type: String, required: true, unique: true },
    hasAPage: { type: Boolean, required: false, default: false},
    published: { type: Boolean, required: false, default: false},
    reader: {type: Number, required: false, default: 0},
    tags: [Tag],
    link: {type: String, required: false},
    excerpt: { type: String, required: false },
    shortExcerpt: {type: String, required: false},
    image: { type:String, required: false },
    markdown: { type: String, required: false },
    html: { type: String, required: false},
    readTime: {type: String, required: false},
}, { timestamps: true }, {strict: true});
```

Each content would ideally have a markdown that goes along with it. This
markdown is then parsed into HTML through `remark`. When parsing the markdwon,
you have the option to parse wiki links format into the standard markdown
hyperlink. In practice, this transforms `[Some Page|this page]` into
`[some-page](this page)`. This is especially made with Obsidian in mind.

Main website is deployed [here](https://www.nawwafsudi.me). Feel free to fork this as neccessary.
