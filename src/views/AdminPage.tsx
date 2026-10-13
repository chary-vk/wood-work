'use client'

import {
  createAdminUser,
  createGalleryCategory,
  deleteAdminUser,
  deleteGalleryCategory,
  fetchAdminCategories,
  fetchAdminUsers,
  updateAdminUser,
  updateGalleryCategory,
  type AdminUser,
} from '@/api/admin'
import {
  deletePhoto,
  fetchAdminSession,
  fetchGallery,
  loginAdmin,
  logoutAdmin,
  photoUrl,
  updatePhoto,
  uploadPhotos,
  type GalleryItem,
} from '@/api/gallery'
import type { GalleryCategory } from '@/lib/category-types'
import {
  ChevronDown,
  ChevronUp,
  FolderTree,
  Images,
  LogOut,
  Pencil,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useCallback, useEffect, useState } from 'react'

type Tab = 'gallery' | 'categories' | 'users'

type CategoryDraft = {
  labelEn: string
  labelTe: string
  blurbEn: string
  blurbTe: string
  imageUrl: string
  sortOrder: number
}

const inputClass =
  'mt-1 w-full rounded-xl border border-teak/20 px-3 py-2 text-sm text-teak-dark'
const btnPrimary =
  'rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-teak-dark hover:bg-gold-light disabled:opacity-50'
const btnSecondary =
  'rounded-lg border border-teak/20 px-3 py-1.5 text-sm font-medium text-teak-dark hover:bg-parchment disabled:opacity-50'

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

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(null)

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoCategory, setPhotoCategory] = useState('')

  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editUserName, setEditUserName] = useState('')
  const [editUserPass, setEditUserPass] = useState('')

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

  const startEditPhoto = (item: GalleryItem) => {
    setEditingPhotoId(item.id)
    setPhotoTitle(item.title)
    setPhotoCategory(item.category)
  }

  const cancelEditPhoto = () => {
    setEditingPhotoId(null)
    setPhotoTitle('')
    setPhotoCategory('')
  }

  const savePhotoEdit = async () => {
    if (!editingPhotoId) return
    setBusy(true)
    setMessage('')
    try {
      const data = await updatePhoto(editingPhotoId, {
        title: photoTitle,
        category: photoCategory,
      })
      setItems(data.items)
      setCategories(data.categories)
      cancelEditPhoto()
      setMessage('Photo updated.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed')
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
      if (editingPhotoId === id) cancelEditPhoto()
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

  const startEditUser = (u: AdminUser) => {
    setEditingUserId(u.id)
    setEditUserName(u.username)
    setEditUserPass('')
  }

  const cancelEditUser = () => {
    setEditingUserId(null)
    setEditUserName('')
    setEditUserPass('')
  }

  const saveUserEdit = async () => {
    if (!editingUserId) return
    setBusy(true)
    setMessage('')
    try {
      await updateAdminUser(editingUserId, {
        username: editUserName,
        password: editUserPass || undefined,
      })
      await loadUsers()
      cancelEditUser()
      setMessage('User updated.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed')
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
      if (editingUserId === id) cancelEditUser()
      setMessage('User removed.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete failed')
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

  const startEditCategory = (c: GalleryCategory) => {
    setEditingCategoryId(c.id)
    setCategoryDraft({
      labelEn: c.labelEn,
      labelTe: c.labelTe,
      blurbEn: c.blurbEn,
      blurbTe: c.blurbTe,
      imageUrl: c.imageUrl ?? '',
      sortOrder: c.sortOrder,
    })
  }

  const cancelEditCategory = () => {
    setEditingCategoryId(null)
    setCategoryDraft(null)
  }

  const saveCategoryEdit = async () => {
    if (!editingCategoryId || !categoryDraft) return
    setBusy(true)
    setMessage('')
    try {
      setCategories(
        await updateGalleryCategory(editingCategoryId, {
          labelEn: categoryDraft.labelEn,
          labelTe: categoryDraft.labelTe,
          blurbEn: categoryDraft.blurbEn,
          blurbTe: categoryDraft.blurbTe,
          imageUrl: categoryDraft.imageUrl || null,
          sortOrder: categoryDraft.sortOrder,
        }),
      )
      cancelEditCategory()
      await loadGallery()
      setMessage('Category updated.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const j = index + direction
    if (j < 0 || j >= categories.length) return
    const a = categories[index]
    const b = categories[j]
    setBusy(true)
    setMessage('')
    try {
      await updateGalleryCategory(a.id, { sortOrder: b.sortOrder })
      await updateGalleryCategory(b.id, { sortOrder: a.sortOrder })
      setCategories(await fetchAdminCategories())
      setMessage('Order updated.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not reorder')
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
      if (editingCategoryId === id) cancelEditCategory()
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
              Edit gallery photos, categories, and admin users.
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
                    <div className="p-3">
                      {editingPhotoId === item.id ? (
                        <div className="space-y-2">
                          <label className="block">
                            <span className="text-xs font-medium text-teak">Title</span>
                            <input
                              value={photoTitle}
                              onChange={(e) => setPhotoTitle(e.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-medium text-teak">
                              Category
                            </span>
                            <select
                              value={photoCategory}
                              onChange={(e) => setPhotoCategory(e.target.value)}
                              className={inputClass}
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                  {c.labelEn}
                                </option>
                              ))}
                            </select>
                          </label>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={savePhotoEdit}
                              className={btnPrimary}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={cancelEditPhoto}
                              className={btnSecondary}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-teak-dark">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-teak">
                              {categoryTitle(item.category)}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => startEditPhoto(item)}
                              className="rounded-lg p-2 text-teak-dark hover:bg-parchment"
                              aria-label="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleDeletePhoto(item.id)}
                              className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
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
                Slug cannot be changed after creation (used by gallery photos).
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
              {categories.map((c, index) => (
                <li
                  key={c.id}
                  className="rounded-xl bg-white p-4 ring-1 ring-teak/10"
                >
                  {editingCategoryId === c.id && categoryDraft ? (
                    <div className="space-y-3">
                      <p className="text-sm text-teak">
                        Slug: <code>{c.slug}</code> (fixed)
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm font-medium">Label (English)</span>
                          <input
                            value={categoryDraft.labelEn}
                            onChange={(e) =>
                              setCategoryDraft({
                                ...categoryDraft,
                                labelEn: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium">Label (Telugu)</span>
                          <input
                            value={categoryDraft.labelTe}
                            onChange={(e) =>
                              setCategoryDraft({
                                ...categoryDraft,
                                labelTe: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm font-medium">Image URL</span>
                          <input
                            value={categoryDraft.imageUrl}
                            onChange={(e) =>
                              setCategoryDraft({
                                ...categoryDraft,
                                imageUrl: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm font-medium">Blurb (English)</span>
                          <input
                            value={categoryDraft.blurbEn}
                            onChange={(e) =>
                              setCategoryDraft({
                                ...categoryDraft,
                                blurbEn: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="text-sm font-medium">Blurb (Telugu)</span>
                          <input
                            value={categoryDraft.blurbTe}
                            onChange={(e) =>
                              setCategoryDraft({
                                ...categoryDraft,
                                blurbTe: e.target.value,
                              })
                            }
                            className={inputClass}
                          />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={saveCategoryEdit}
                          className={btnPrimary}
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={cancelEditCategory}
                          className={btnSecondary}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-teak-dark">
                          {c.labelEn}{' '}
                          <span className="text-sm font-normal text-teak">
                            ({c.slug})
                          </span>
                        </p>
                        <p className="text-sm text-teak">{c.labelTe}</p>
                        {c.blurbEn ? (
                          <p className="mt-1 text-xs text-teak/80 line-clamp-2">
                            {c.blurbEn}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          onClick={() => moveCategory(index, -1)}
                          className="rounded-lg p-2 text-teak hover:bg-parchment disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === categories.length - 1}
                          onClick={() => moveCategory(index, 1)}
                          className="rounded-lg p-2 text-teak hover:bg-parchment disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => startEditCategory(c)}
                          className="rounded-lg p-2 text-teak-dark hover:bg-parchment"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteCategory(c.id)}
                          className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
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
                <li key={u.id} className="px-4 py-3">
                  {editingUserId === u.id ? (
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium">Username</span>
                        <input
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">
                          New password (optional)
                        </span>
                        <input
                          type="password"
                          value={editUserPass}
                          onChange={(e) => setEditUserPass(e.target.value)}
                          placeholder="Leave blank to keep current"
                          minLength={8}
                          className={inputClass}
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={saveUserEdit}
                          className={btnPrimary}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={cancelEditUser}
                          className={btnSecondary}
                        >
                          <X className="mr-1 inline h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
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
                          onClick={() => startEditUser(u)}
                          className={btnSecondary}
                        >
                          <Pencil className="mr-1 inline h-3.5 w-3.5" />
                          Edit
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
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </main>
    </div>
  )
}
