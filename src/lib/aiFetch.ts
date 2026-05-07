'use client'

export async function aiFetch(url: string, opts?: RequestInit): Promise<Response> {
  const resp = await fetch(url, opts)
  if (resp.status === 429) {
    let data: Record<string, unknown> = {}
    try { data = await resp.clone().json() } catch {}
    window.dispatchEvent(new CustomEvent('rate-limit-hit', { detail: data }))
    throw new Error((data.error as string) || 'Tageslimit erreicht (15 Generierungen/Tag). Versuche es morgen wieder.')
  }
  return resp
}
