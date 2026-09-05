import React, { useEffect, useMemo, useState } from 'react'
import { mediaService } from '../../services'
import ConfirmModal from '../../components/common/ConfirmModal'

const emptyState = 'No media assets yet. Upload a file to populate this gallery.'

export default function MediaGallery() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const response = await mediaService.getAll({ limit: 50 })
      setAssets(response?.assets || [])
      setError('')
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Unable to load media library.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const totalSize = useMemo(
    () => assets.reduce((sum, asset) => sum + (Number(asset.size) || 0), 0),
    [assets]
  )

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      await mediaService.upload(selectedFile)
      setSelectedFile(null)
      await fetchAssets()
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await mediaService.delete(deleteTarget._id)
      setDeleteTarget(null)
      await fetchAssets()
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Delete failed.')
    }
  }

  if (loading) {
    return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading media gallery...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Media Gallery</h1>
          <p className="text-sm text-slate-600">Manage uploaded assets for the company and profile experiences.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <input
              type="file"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
            {selectedFile ? selectedFile.name : 'Choose file'}
          </label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload media'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Total assets</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{assets.length}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Images</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{assets.filter((asset) => asset.mimeType?.startsWith('image/')).length}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Storage used</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{(totalSize / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {assets.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">{emptyState}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => {
            const isImage = asset.mimeType?.startsWith('image/')
            const previewUrl = asset.url || ''

            return (
              <div key={asset._id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="flex h-48 items-center justify-center bg-slate-100">
                  {isImage ? (
                    <img src={previewUrl} alt={asset.originalName || 'Media asset'} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <span className="text-4xl">📄</span>
                      <span className="text-sm font-medium">{asset.originalName || 'Document'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">{asset.originalName || 'Untitled asset'}</div>
                      <div className="text-xs text-slate-500">{asset.mimeType || 'Unknown type'}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(asset)}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{asset.entityType || 'General'}</span>
                    <span>{(Number(asset.size) / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete media asset"
        message={`Are you sure you want to delete "${deleteTarget?.originalName || 'this file'}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
