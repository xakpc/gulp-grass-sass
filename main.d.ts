export { SassSyntax, SassOutputStyle } from './index.d.ts'; // Re-export the SassOptions related interfaces

export interface SassOptions {
    sassSyntax?: SassSyntax
    outputStyle?: SassOutputStyle
    includePaths?: Array<string>
}

export function compile(options?: SassOptions): Transform;