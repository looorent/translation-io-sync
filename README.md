# Translation.io Synchronizer

This Typescript implementation acts as a `translation.io` client in order to read PO files:
* to send them to `translation.io`;
* and then to replace the local files with the `translation.io`'s response.

## Usage

### Pre-requisites

This service works with POT files:
* you can create them using `gettext`. 
* or, for instance, use [ngx-translate-extract](https://github.com/biesbjerg/ngx-translate-extract) if you work on an Angular/ngx-translate project (`ngx-translate-extract --input ./src --output ./src/assets/i18n/*.pot --clean --sort --format pot`).

### Input

To read/write PO files and send them to Translation.io, you must provide an instance of `TranslationIO.Configuration`:

TODO

### Service

A single service `TranslationIO.Synchronizer` offers two methods:
* `sync(TranslationIO.Configuration)`
* `syncAndPurge(TranslationIO.Configuration)`

### Example

```typescript
import { TranslationIO } from "translation-io-synchronizer";

const configuration: TranslationIO.Configuration = {
  po: {
    poDirectory: "src/assets/i18n/",
    poExtention: "pot"
  },
  service: {
    apiKey: "dqgdqgqsdgqsdg878è§è!§qdfhjvJHVJV",
    gemVersion: "2.0",
    hostname: "translation.io"
  },
  targetLocales: ["fr-FR", "nl-BE"],
  sourceLocale: "en"
};

const synchronizer = new TranslationIO.Synchronizer(configuration);
synchronizer.sync();
```

## Development

### Install

```
$ npm install
```

If npm fails when installing `node-libcurl`, try to install first using: `npm install node-libcurl --build-from-source`

### Build

```
$ npm run build
```