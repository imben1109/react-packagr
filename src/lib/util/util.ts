import * as path from 'path';

export function getCompileFilePath(distFolder: string, sourceFolderPath: string, sourceFilePath: string, compileFileSuffix: string): string{
    const relaticeSourceFilePath = path.relative(sourceFolderPath, sourceFilePath);
    const dirname = path.dirname(relaticeSourceFilePath);
    const filename = path.basename(sourceFilePath, path.extname(sourceFilePath)) + compileFileSuffix;
    const absoluteCompileFilePath = path.resolve(distFolder, dirname, filename);
    const relativeCompileFilePath  = path.relative('.', absoluteCompileFilePath);
    return relativeCompileFilePath;
}

export function unique<T>(value: T[]): T[] {
    return [...new Set(value)];
}