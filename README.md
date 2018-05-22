# Translation.io Synchronizer

This Typescript implementation acts as a `translation.io` client in order to read PO files:
* to send them to `translation.io`;
* and then to replace the local files with the `translation.io`'s response.

This project is a draft.

## Usage

### Pre-requisites

This service works with PO files:
* you can create them using `gettext`. 
* or, for instance, use [ngx-translate-extract](https://github.com/biesbjerg/ngx-translate-extract) if you work on an Angular/ngx-translate project (`ngx-translate-extract --input ./src --output ./src/assets/i18n/*.pot --clean --sort --format pot`).

### Input

To read/write PO files and send them to Translation.io, you must provide an instance of `TranslationIO.Configuration`.

### Service

A single service `TranslationIO.Synchronizer` offers three methods:
* `init(TranslationIO.Configuration)`: Initialize the `translation.io` project related to your configuration;
* `sync(TranslationIO.Configuration)`: Synchronize your local PO file with the remote one;
* `syncAndPurge(TranslationIO.Configuration)`: Synchronize your local PO file with the remote one AND remove all unused translations.

### Example - Initialization

```typescript
import { TranslationIO } from "translation-io-sync";

const configuration: TranslationIO.Configuration = {
  po: {
    poDirectory: "src/assets/i18n/",
    poExtention: "po"
  },
  service: {
    apiKey: "dqgdqgqsdgqsdg878è§è!§qdfhjvJHVJV",
    version: "2.0",
    hostname: "translation.io"
  },
  targetLocales: ["fr-FR", "nl-BE"],
  sourceLocale: "en"
};

const synchronizer = new TranslationIO.Synchronizer(configuration);
synchronizer.init();
```

### Example - Synchronization 

```typescript
import { TranslationIO } from "translation-io-sync";

const configuration: TranslationIO.Configuration = {
  po: {
    poDirectory: "src/assets/i18n/",
    poExtention: "po"
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