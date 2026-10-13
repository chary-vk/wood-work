/** Vercel / hosting env names for this project */
export function tursoDatabaseUrl() {
  return (
    process.env.wood_TURSO_DATABASE_URL ??
    process.env.TURSO_DATABASE_URL ??
    process.env.DATABASE_URL
  )
}

export function tursoAuthToken() {
  return (
    process.env.wood_TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN
  )
}
