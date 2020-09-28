import {pathExistsSync} from 'fs-extra';
import * as path from 'path';
import { UserPackage } from './user-package';

export async function discoverPackages(projectFolder: string, sourceRoot: string, destFolder: string): Promise<UserPackage> {
    const basePath = path.resolve(projectFolder);
    const pacakgeJsonFilePath = path.join(path.resolve(basePath), 'package.json');
    if (pathExistsSync(pacakgeJsonFilePath)){
        const pacakgeJson = await import(pacakgeJsonFilePath);

        return new UserPackage (
            pacakgeJson as Record<string, any>,
            basePath,
            sourceRoot,
            destFolder
        )
        
    } else {
        console.log('pacakge.json does not exist!!!');
    }
    return null;
}