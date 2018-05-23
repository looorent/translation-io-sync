"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./http/client");
const po_reader_1 = require("./io/po-reader");
const po_writer_1 = require("./io/po-writer");
class Synchronizer {
    constructor(configuration) {
        this.configuration = configuration;
    }
    sync() {
        this.run(false);
    }
    syncAndPurge() {
        this.run(true);
    }
    run(purge) {
        // READER
        const reader = new po_reader_1.PoReader(this.configuration.po);
        const existingTranslations = reader.readAll(this.configuration.targetLocales);
        // TEMPORARY WRITER
        const writer = po_writer_1.PoWriter.buildTemporaryWriter(this.configuration.po.poExtention);
        const clean = () => writer.clean(this.configuration.targetLocales);
        // HTTP CLIENT
        const client = new client_1.Client(this.configuration);
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
        const reader = new po_reader_1.PoReader(this.configuration.po);
        const existingTranslations = reader.readAll(this.configuration.targetLocales);
        const client = new client_1.Client(this.configuration);
        client.init(existingTranslations).then(body => {
            console.log("Initialization completed", body);
        }).catch(err => {
            console.log("An error occurred", err);
        });
    }
}
exports.Synchronizer = Synchronizer;
