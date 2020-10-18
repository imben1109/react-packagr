import { compileSourceFiles } from './compile/babelc/compile-source-files';
import { discoverPackages } from './entry-point/discover-packages';
import { UserPackage } from './entry-point/user-package';
import { fattenCompiledFiles } from './flatten/rollup/fatten-compiled-files';

export class Packagr {

    /**
     * Constructor of Packagr
     * 
     * @param project Path to react-package.json or pakcage.json file
     * @param sourceFolder Relative Path of source code folder to project
     * @param destFolder Relative Path of source code folder to project
     */
    constructor(
        public readonly project: string,
        public readonly sourceFolder: string,
        public readonly destFolder: string){
    }

    /**
     * bunding package
     */
    public async build() : Promise<void> {
        console.log(`Trying to compile project: '${this.project}' with source folder: '${this.sourceFolder}'`);

        const userPackage: UserPackage = await discoverPackages(this.project, this.sourceFolder, this.destFolder);
        
        compileSourceFiles(userPackage).then(async (compiledOutputFolder: string) => {
            console.log("Completed compile source files to: " + compiledOutputFolder);
        
            console.info('Bundling to FESM2015');
            await fattenCompiledFiles(userPackage, 'es');

            console.log('Bundling to UMD');
            await fattenCompiledFiles(userPackage, 'umd');
        });
    }

}