import _ajv, { AnySchema, Options as AjvOptions, ValidateFunction } from 'ajv'
import AjvJTD, { JTDOptions } from 'ajv/dist/jtd'
import type { Options, ErrorObject } from 'ajv'
import { AnyValidateFunction } from 'ajv/dist/core'

type Ajv = _ajv
type AjvSerializerGenerator = typeof AjvCompiler

type AjvJTDCompile = AjvJTD['compileSerializer']
type AjvCompile = (schema: AnySchema, _meta?: boolean) => AnyValidateFunction

declare function buildCompilerFromPool (externalSchemas: { [key: string]: AnySchema | AnySchema[] }, options?: { mode: 'JTD'; customOptions?: JTDOptions; onCreate?: (ajvInstance: Ajv) => void }): AjvCompile
declare function buildCompilerFromPool (externalSchemas: { [key: string]: AnySchema | AnySchema[] }, options?: { mode?: never; customOptions?: AjvOptions; onCreate?: (ajvInstance: Ajv) => void }): AjvCompile

declare function buildSerializerFromPool (externalSchemas: any, serializerOpts?: { mode?: never; } & JTDOptions): AjvJTDCompile

declare function AjvCompiler (opts: { jtdSerializer: true }): AjvCompiler.BuildSerializerFromPool
declare function AjvCompiler (opts?: { jtdSerializer?: false }): AjvCompiler.BuildCompilerFromPool

declare function StandaloneValidator (options: AjvCompiler.StandaloneOptions): AjvCompiler.BuildCompilerFromPool

declare namespace AjvCompiler {
  export type { Options, ErrorObject }
  export { Ajv }

  export type BuildSerializerFromPool = typeof buildSerializerFromPool

  export type BuildCompilerFromPool = typeof buildCompilerFromPool

  export const AjvReference: Symbol

  export enum HttpParts {
    Body = 'body',
    Headers = 'headers',
    Params = 'params',
    Query = 'querystring',
  }

  export type RouteDefinition = {
    method: string,
    url: string,
    httpPart: HttpParts,
    schema?: unknown,
  }

  export type StandaloneRestoreFunction = (opts: RouteDefinition) => ValidateFunction

  export type StandaloneStoreFunction = (opts: RouteDefinition, schemaValidationCode: string) => void

  export type StandaloneOptionsReadModeOn = {
    readMode: true;
    restoreFunction?: StandaloneRestoreFunction
  }

  export type StandaloneOptionsReadModeOff = {
    readMode?: false | undefined;
    storeFunction?: StandaloneStoreFunction;
  }

  export type StandaloneOptions = StandaloneOptionsReadModeOn | StandaloneOptionsReadModeOff

  export type ValidatorFactory = BuildCompilerFromPool | BuildSerializerFromPool

  export type ValidatorCompiler = ReturnType<ValidatorFactory>

  export { StandaloneValidator }

  export const AjvCompiler: AjvSerializerGenerator
  export { AjvCompiler as default }
}

export = AjvCompiler
