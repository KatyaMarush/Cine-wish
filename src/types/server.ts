export interface ServerConfig {
  port: number
  host: string
  isProduction: boolean
}

export interface RenderFunction {
  (url: string): Promise<string>
}

export interface ServerError extends Error {
  stack?: string
  status?: number
}
