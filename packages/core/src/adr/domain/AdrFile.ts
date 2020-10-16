import { Log4brainsError, ValueObject } from "@src/domain";
import { FilesystemPath } from "./FilesystemPath";

type Props = {
  path: FilesystemPath;
};

const reservedFilenames = ["template.md"];

export class AdrFile extends ValueObject<Props> {
  constructor(path: FilesystemPath) {
    super({ path });

    if (path.extension.toLowerCase() !== ".md") {
      throw new Log4brainsError(
        "Only .md files are supported",
        path.pathRelativeToCwd
      );
    }

    if (reservedFilenames.includes(path.basename.toLowerCase())) {
      throw new Log4brainsError("Reserved ADR filename", path.basename);
    }
  }

  get path(): FilesystemPath {
    return this.props.path;
  }

  static isPathValid(path: FilesystemPath): boolean {
    try {
      // eslint-disable-next-line no-new
      new AdrFile(path);
      return true;
    } catch (e) {
      return false;
    }
  }
}
