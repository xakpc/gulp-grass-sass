/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export interface SassOptions {
  data?: string
  file?: string
  intendedSyntax?: boolean
  includePaths?: Array<string>
}
export function compileSass(input: string): string
export function compileSassFromFile(filePath: string): string
export function compileSassFromOptions(options: SassOptions): string
