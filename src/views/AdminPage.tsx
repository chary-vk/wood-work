'use client'

import {
  deletePhoto,
  fetchAdminSession,
  fetchGallery,
  loginAdmin,
  logoutAdmin,
  photoUrl,
  uploadPhotos,
  type GalleryItem,
} from '@/api/gallery'
import type { CategoryId } from '@/content/site'
import { LogOut, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useCallback, useEffect, useState } from 'react'

const CATEGORIES: CategoryId[] = [
  'doorFrames',
  'doors',
  'windows',
  'windowShutters',
  'beds',
  'tables',
]

const CATEGORY_LABEL: Record<CategoryId, string> = {
  doorFrames: 'Door frames',
  doors: 'Doors',
  windows: 'Windows',
  windowShutters: 'Window shutters',
  beds: 'Beds',
  tables: 'Tables',
}

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [category, setCategory] = useState<CategoryId>('doors')
  const [files, setFiles] = useState<FileList | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAdminSession()
      .then(setLoggedIn)
      .finally(() => setSessionChecked(true))
  }, [])

  const load = useCallback(async () => {
    const data = await fetchGallery()
    setItems(data.items)
  }, [])

  useEffect(() => {
    if (loggedIn) load().catch(() => setItems([]))
  }, [loggedIn, load])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await loginAdmin(username, password)
      setLoggedIn(true)
    } catch {
      setLoginError('Invalid username or password')
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    setLoggedIn(false)
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!files?.length) {
      setMessage('Choose one or more photos.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      await uploadPhotos([...files], category)
      setFiles(null)
      setMessage(`Saved ${files.length} photo(s) to the gallery.`)
      await load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this photo from the gallery?')) return
    setBusy(true)
    setMessage('')
    try {
      await deletePhoto(id)
      await load()
      setMessage('Photo removed.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment text-teak">
        Loading…
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-parchment px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-teak/10">
          <h1 className="font-display text-2xl font-semibold text-teak-dark">
            Admin login
          </h1>
          <p className="mt-2 text-sm text-teak">
            Sign in to upload and manage gallery photos. On Vercel, set{' '}
            <code className="text-xs">TURSO_*</code>,{' '}
            <code className="text-xs">BLOB_READ_WRITE_TOKEN</code>, and admin
            env vars in the project dashboard.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-teak-dark">
                Username
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-xl border border-teak/20 px-4 py-3"
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-teak-dark">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-teak/20 px-4 py-3"
                autoComplete="current-password"
                required
              />
            </label>
            {loginError ? (
              <p className="text-sm text-red-700">{loginError}</p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-forest py-3 font-semibold text-white hover:bg-forest-light"
            >
              Sign in
            </button>
          </form>
          <Link
            href="/"
            className="mt-6 block text-center text-sm text-forest hover:underline"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment-dark pb-16">
      <header className="border-b border-teak/10 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-teak-dark">
              Gallery admin
            </h1>
            <p className="text-sm text-teak">
              Photos are stored in SQLite metadata plus Vercel Blob (production)
              or <code className="text-xs">public/uploads/gallery</code> (local
              dev).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/#gallery"
              className="rounded-full border border-teak/20 px-4 py-2 text-sm font-medium text-teak-dark hover:bg-parchment"
            >
              View gallery
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full bg-teak-dark px-4 py-2 text-sm font-medium text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        <form
          onSubmit={handleUpload}
          className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-teak/10"
        >
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-teak-dark">
            <Upload className="h-5 w-5" />
            Upload photos
          </h2>
          <p className="mt-1 text-sm text-teak">
            Multiple files at once. Category is saved with each photo for
            filtering on the site.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium">Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={busy}
                onChange={(e) => setFiles(e.target.files)}
                className="mt-1 block w-full text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                disabled={busy}
                className="mt-1 w-full rounded-xl border border-teak/20 px-3 py-2"
              >
                {CATEGORIES.map((id) => (
                  <option key={id} value={id}>
                    {CATEGORY_LABEL[id]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {message ? (
            <p className="mt-4 text-sm text-teak-dark">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 rounded-full bg-gold px-6 py-3 font-semibold text-teak-dark hover:bg-gold-light disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Upload to gallery'}
          </button>
        </form>

        <section>
          <h2 className="font-display text-lg font-semibold text-teak-dark">
            Gallery ({items.length})
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-teak/10"
              >
                <img
                  src={photoUrl(item.path)}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex items-start justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-teak-dark">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-teak">{item.path}</p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 rounded-lg p-2 text-red-700 hover:bg-red-50 disabled:opacity-40"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
