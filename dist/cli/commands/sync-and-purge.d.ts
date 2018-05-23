import { Command } from "clime";
import { ConnectionOptions } from "../connection-options";
export default class  extends Command {
    execute(options: ConnectionOptions): void;
}
