'use client'

import {
  createAdminUser,
  createGalleryCategory,
  deleteAdminUser,
  deleteGalleryCategory,
  fetchAdminCategories,
  fetchAdminUsers,
  resetAdminPassword,
  type AdminUser,
} from '@/api/admin'
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
import type { GalleryCategory } from '@/lib/category-types'
import { FolderTree, Images, LogOut, Trash2, Upload, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useCallback, useEffect, useState } from 'react'

type Tab = 'gallery' | 'categories' | 'users'

const inputClass =
  'mt-1 w-full rounded-xl border border-teak/20 px-3 py-2 text-sm text-teak-dark'
const btnPrimary =
  'rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-teak-dark hover:bg-gold-light disabled:opacity-50'

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [tab, setTab] = useState<Tab>('gallery')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])

  const [uploadCategory, setUploadCategory] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)

  const [newUserName, setNewUserName] = useState('')
  const [newUserPass, setNewUserPass] = useState('')

  const [catSlug, setCatSlug] = useState('')
  const [catLabelEn, setCatLabelEn] = useState('')
  const [catLabelTe, setCatLabelTe] = useState('')
  const [catBlurbEn, setCatBlurbEn] = useState('')
  const [catBlurbTe, setCatBlurbTe] = useState('')
  const [catImage, setCatImage] = useState('')

  useEffect(() => {
    fetchAdminSession()
      .then(setLoggedIn)
      .finally(() => setSessionChecked(true))
  }, [])

  const loadGallery = useCallback(async () => {
    const data = await fetchGallery()
    setItems(data.items)
    setCategories(data.categories)
    if (!uploadCategory && data.categories[0]) {
      setUploadCategory(data.categories[0].slug)
    }
  }, [uploadCategory])

  const loadCategories = useCallback(async () => {
    const list = await fetchAdminCategories()
    setCategories(list)
    if (!uploadCategory && list[0]) setUploadCategory(list[0].slug)
  }, [uploadCategory])

  const loadUsers = useCallback(async () => {
    setUsers(await fetchAdminUsers())
  }, [])

  useEffect(() => {
    if (!loggedIn) return
    loadGallery().catch(() => setItems([]))
    loadUsers().catch(() => setUsers([]))
  }, [loggedIn, loadGallery, loadUsers])

  useEffect(() => {
    if (loggedIn && tab === 'categories') {
      loadCategories().catch(() => setCategories([]))
    }
  }, [loggedIn, tab, loadCategories])

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
    if (!uploadCategory) {
      setMessage('Add a category first.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      await uploadPhotos([...files], uploadCategory)
      setFiles(null)
      setMessage(`Saved ${files.length} photo(s).`)
      await loadGallery()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Remove this photo from the gallery?')) return
    setBusy(true)
    setMessage('')
    try {
      await deletePhoto(id)
      await loadGallery()
      setMessage('Photo removed.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      setUsers(await createAdminUser(newUserName, newUserPass))
      setNewUserName('')
      setNewUserPass('')
      setMessage('User created.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not create user')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this admin user?')) return
    setBusy(true)
    setMessage('')
    try {
      setUsers(await deleteAdminUser(id))
      setMessage('User removed.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const handleResetPassword = async (id: string) => {
    const next = prompt('New password (min 8 characters):')
    if (!next) return
    setBusy(true)
    setMessage('')
    try {
      await resetAdminPassword(id, next)
      setMessage('Password updated.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      setCategories(
        await createGalleryCategory({
          slug: catSlug,
          labelEn: catLabelEn,
          labelTe: catLabelTe,
          blurbEn: catBlurbEn,
          blurbTe: catBlurbTe,
          imageUrl: catImage || null,
        }),
      )
      setCatSlug('')
      setCatLabelEn('')
      setCatLabelTe('')
      setCatBlurbEn('')
      setCatBlurbTe('')
      setCatImage('')
      setMessage('Category added.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not add category')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    setBusy(true)
    setMessage('')
    try {
      setCategories(await deleteGalleryCategory(id))
      await loadGallery()
      setMessage('Category removed.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const categoryTitle = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug)
    return cat?.labelEn ?? slug
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
            Sign in with your admin account to manage the gallery, categories, and
            users.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-teak-dark">Username</span>
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
              <span className="text-sm font-medium text-teak-dark">Password</span>
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

  const tabs: { id: Tab; label: string; icon: typeof Images }[] = [
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-parchment-dark pb-16">
      <header className="border-b border-teak/10 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-teak-dark">
              Site admin
            </h1>
            <p className="text-sm text-teak">
              Gallery photos, image categories, and admin accounts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/#gallery"
              className="rounded-full border border-teak/20 px-4 py-2 text-sm font-medium text-teak-dark hover:bg-parchment"
            >
              View site
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
        <nav className="mx-auto flex max-w-5xl gap-1 px-4 pb-3">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                setMessage('')
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === id
                  ? 'bg-forest text-white'
                  : 'text-teak-dark hover:bg-parchment'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {message ? (
          <p className="rounded-xl bg-white px-4 py-3 text-sm text-teak-dark ring-1 ring-teak/10">
            {message}
          </p>
        ) : null}

        {tab === 'gallery' ? (
          <>
            <form
              onSubmit={handleUpload}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-teak/10"
            >
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-teak-dark">
                <Upload className="h-5 w-5" />
                Upload photos
              </h2>
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
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    disabled={busy || categories.length === 0}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.labelEn}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit" disabled={busy} className={`mt-6 ${btnPrimary}`}>
                {busy ? 'Saving…' : 'Upload'}
              </button>
            </form>

            <section>
              <h2 className="font-display text-lg font-semibold text-teak-dark">
                Photos ({items.length})
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
                        <p className="truncate text-xs text-teak">
                          {categoryTitle(item.category)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleDeletePhoto(item.id)}
                        className="shrink-0 rounded-lg p-2 text-red-700 hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        {tab === 'categories' ? (
          <>
            <form
              onSubmit={handleAddCategory}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-teak/10"
            >
              <h2 className="font-display text-lg font-semibold text-teak-dark">
                Add category
              </h2>
              <p className="mt-1 text-sm text-teak">
                Slug is used in URLs and filters (e.g. <code>custom-doors</code>).
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Slug</span>
                  <input
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Image URL</span>
                  <input
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="/images/craft/03-doors.jpg"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Label (English)</span>
                  <input
                    value={catLabelEn}
                    onChange={(e) => setCatLabelEn(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Label (Telugu)</span>
                  <input
                    value={catLabelTe}
                    onChange={(e) => setCatLabelTe(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Blurb (English)</span>
                  <input
                    value={catBlurbEn}
                    onChange={(e) => setCatBlurbEn(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">Blurb (Telugu)</span>
                  <input
                    value={catBlurbTe}
                    onChange={(e) => setCatBlurbTe(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>
              <button type="submit" disabled={busy} className={`mt-4 ${btnPrimary}`}>
                Add category
              </button>
            </form>

            <ul className="space-y-3">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-teak/10"
                >
                  <div>
                    <p className="font-medium text-teak-dark">
                      {c.labelEn}{' '}
                      <span className="text-sm font-normal text-teak">
                        ({c.slug})
                      </span>
                    </p>
                    <p className="text-sm text-teak">{c.labelTe}</p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDeleteCategory(c.id)}
                    className="rounded-lg px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {tab === 'users' ? (
          <>
            <form
              onSubmit={handleAddUser}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-teak/10"
            >
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-teak-dark">
                <UserPlus className="h-5 w-5" />
                Add admin user
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Username</span>
                  <input
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Password</span>
                  <input
                    type="password"
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    minLength={8}
                    className={inputClass}
                    required
                  />
                </label>
              </div>
              <button type="submit" disabled={busy} className={`mt-4 ${btnPrimary}`}>
                Create user
              </button>
            </form>

            <ul className="divide-y divide-teak/10 rounded-xl bg-white ring-1 ring-teak/10">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-teak-dark">{u.username}</p>
                    <p className="text-xs text-teak">
                      Added {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleResetPassword(u.id)}
                      className="rounded-lg border border-teak/20 px-3 py-1.5 text-sm text-teak-dark"
                    >
                      Reset password
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDeleteUser(u.id)}
                      className="rounded-lg px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </main>
    </div>
  )
}
