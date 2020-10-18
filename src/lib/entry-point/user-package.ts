import * as path from 'path';
import { unique } from '../util/util';

export class UserPackage {

    constructor(
        /** Values from the `package.json` file of this entry point. */
        public readonly packageJson: Record<string, any>,
        /** Absolute directory path of this entry point's `package.json` location. */
        public readonly basePath: string,
        /** Relative file path of source root  */
        public readonly sourceRoot: string,
        /** Relative folder path of generated npm package */
        public readonly destFolder: string,
    ) {}

    public get sourceFolderPath(): string {
        return path.join(this.basePath, this.sourceRoot);
    }

    public get moduleId(): string {
        return this.packageJson['name'];
    }

    public get dest(): string {
        return 'dist';
    }

    public get destFolderPath(): string {
        return path.join(this.basePath, this.dest);
    }

    public get destCompiledFolderPath(): string {
        return path.join(this.basePath, this.dest, 'esm2015');
    }

    public get compiledMainFilePath(): string {
        return path.join(this.destCompiledFolderPath, 'public_api.js');
    }

    public get dependencyList(): string[] {
        const dependencies = this.packageJson['dependencies']
        if (dependencies){
            return unique(Object.keys(dependencies));
        }
        return [];
    }

}