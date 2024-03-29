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

## CLI

Three subcommands are exposed by `translation-io-sync`: `init`, `sync` and `sync-and-purge`.
```
USAGE

    translation-io-sync <subcommand>

  SUBCOMMANDS

    init           - Initialize a project on Translation.io
    sync-and-purge - Synchronize And purge your PO files with your translation.io project.
    sync           - Synchronize your PO files with your translation.io project.
```

```
  Initialize a project on Translation.io

  USAGE

    translation-io-client <init | sync | sync-and-purge> [...options]

  OPTIONS

    -a, --api-key <apiKey>                       - Your project's api key for translation.io
    -s, --source-locale <sourceLocale>           - The source language
    -d, --destination-locale <destinationLocale> - The destination languages (separated by a comma)
    -p, --po-directory <poDirectory>             - Path to the folder that contains your PO files that will be sent and replaced.
    -e, --po-extention <poExtention>             - Extention of your PO files (do not include a 'dot')
```

## Development

### Install

```
$ npm install
```

### Build

```
$ npm run build
```

bin/cli.js init -a 43d55a5cea8a4616b10d9e67ec8a0d85 -s en -d fr -p source -e po


### Sample

If you want to build and test this CLI easily, you can:
* create a project in Translation.io from `"en"` to `"fr"`
* clone this project
* build it: `npm run build` (it will build the CLI into the `cli` folder)
* from this root folder, run `bin/cli.js init -a <token> -s en -d fr -p example -e "po"`
