import { Command, command, metadata } from "clime";
import { Synchronizer } from "../../synchronizer";
import { ConnectionOptions } from "../connection-options";

@command({
  description: "Synchronize your PO files with your translation.io project.",
})
export default class extends Command {
  @metadata
  execute(
    options: ConnectionOptions
  ) {
    const configuration = options.createConfiguration();
    new Synchronizer(configuration).sync();
  }
}
