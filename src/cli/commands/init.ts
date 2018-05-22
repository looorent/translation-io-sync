import { Command, command, metadata } from "clime";
import { Synchronizer } from "../../synchronizer";
import { ConnectionOptions } from "../connection-options";

@command({
  description: "Initialize a project on Translation.io",
})
export default class extends Command {
  @metadata
  execute(
    options: ConnectionOptions
  ) {
    const configuration = options.createConfiguration();
    new Synchronizer(configuration).init();
  }
}
