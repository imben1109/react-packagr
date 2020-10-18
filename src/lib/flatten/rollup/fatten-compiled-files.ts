import {rollup, RollupOptions, OutputOptions} from 'rollup';
import { UserPackage } from '../../entry-point/user-package';
import * as rollupJson from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as sourcemaps from 'rollup-plugin-sourcemaps';
import * as commonJs from '@rollup/plugin-commonjs';
import * as postcss from 'rollup-plugin-postcss';
import * as image from '@rollup/plugin-image';
import { ExternalModuleStrategy } from './external-module-strategy';
import * as path from 'path';

export type Format = 'es' | 'umd';

function getDestFolderPath(userPackage: UserPackage,format: Format): string {
    if (userPackage){
        if (format == 'es'){
            return path.join(userPackage.basePath, userPackage.dest, 'fesm2015', userPackage.moduleId + '.js');
        }
        if (format == 'umd'){
            return path.join(userPackage.basePath, userPackage.dest, 'umd', userPackage.moduleId + '.js');
        }
    }
    return null
}

export async function fattenCompiledFiles(userPackage: UserPackage, format: Format): Promise<void> {
    
    const externalModuleStrategy: ExternalModuleStrategy = new ExternalModuleStrategy(format, userPackage.dependencyList);
    
    // rollup process
    const inputOption: RollupOptions =  {
        input: userPackage.compiledMainFilePath,
        
        context: 'this',
        inlineDynamicImports: false,
        preserveSymlinks: false,
        treeshake: false,
        external: (moduleId: string) => externalModuleStrategy.isExternalModule(moduleId),
        plugins: [
            // @ts-ignore
            rollupJson(),
            // @ts-ignore
            postcss(),
            // @ts-ignore
            image(),
            // @ts-ignore
            nodeResolve(),
            // @ts-ignore
            commonJs(),
            // @ts-ignore
            sourcemaps()
            // ,

            // {
            //     transform: (code: string, filePath: string)=>{
            //         console.log(`${filePath}: ${code}`)
            //     }
            // }
        ],
        onwarn: (warning) => {
            console.log(warning)
        }
    };
    const bundle = await rollup(inputOption);

    // rollup output
    const outputOption: OutputOptions = {
        name: userPackage.moduleId,
        file: getDestFolderPath(userPackage, format),
        format: format,
        sourcemap: true 
    };
    console.log(`starting to write bundled file: ${outputOption.file}`)
    await bundle.write(outputOption);

    return Promise.resolve();
}

