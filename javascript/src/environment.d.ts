declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPEN_API_KEY: string
    }
  }
}
export { }