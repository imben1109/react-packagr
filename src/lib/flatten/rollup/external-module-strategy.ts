import * as path from 'path';

export type Format = 'es' | 'umd';

export class ExternalModuleStrategy {

    constructor(
        public readonly format: Format,
        public denpendencies: string[]) {

    }

    isExternalModule(moduleId: string): boolean {
        if (path.isAbsolute(moduleId) || moduleId.startsWith('.') || moduleId.startsWith('/')){
            return false;
        }

        if (this.format != 'umd'){
            return true;
        }

        if (this.denpendencies.indexOf(moduleId) > -1){
            return false
        }

        return true;
    }
    
}