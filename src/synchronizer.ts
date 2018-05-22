import { Configuration } from "./configuration.types";
import { Client } from "./http/client";
import { PoReader } from "./io/po-reader";
import { PoWriter } from "./io/po-writer";

export class Synchronizer {

  constructor(private configuration: Configuration) {}

  sync() {
    this.run(false);
  }

  syncAndPurge() {
    this.run(true);
  }

  run(purge: boolean) {
    // READER
    const reader = new PoReader(this.configuration.po);
    const existingTranslations = reader.readAll(this.configuration.targetLocales);

    // TEMPORARY WRITER
    const writer = PoWriter.buildTemporaryWriter(this.configuration.po.poExtention);
    const clean = () => writer.clean(this.configuration.targetLocales);

    // HTTP CLIENT
    const client = new Client(this.configuration);
    client.update(existingTranslations, purge)
          .then(translations => {
            console.log(`${translations.length} locales has been synced successfully: ${translations.map(translation => translation.locale)}`);
            translations.forEach(translation => writer.write(translation));
            writer.commitTo(this.configuration.po, this.configuration.targetLocales);
            clean();
          })
          .catch(err => {
            console.log("An error occurred when syncing with Translation.io", err);
            clean();
          });
  }

  init() {
    // READER
    const reader = new PoReader(this.configuration.po);
    const existingTranslations = reader.readAll(this.configuration.targetLocales);

    const client = new Client(this.configuration);
    client.init(existingTranslations).then(body => {
      console.log("Initialization completed", body);
    }).catch(err => {
      console.log("An error occurred", err);
    });
  }
}
