export { SassSyntax, SassOutputStyle } from './index.d.ts'; // Re-export the SassOptions interface

export interface SassOptions {
    saasSyntax?: SassSyntax
    outputStyle?: SassOutputStyle
    includePaths?: Array<string>
}

export function compile(options?: SassOptions): Transform;