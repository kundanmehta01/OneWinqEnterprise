import React, { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { mediaService } from '../../../services';
import MediaHeader from './components/MediaHeader';
import MediaFilters from './components/MediaFilters';
import MediaGrid from './components/MediaGrid';
import DeleteMediaModal from './components/DeleteMediaModal';

const assetsFrom = (response) => Array.isArray(response) ? response : response?.assets || response?.data || [];

export default function MediaGallery() {
  const [assets, setAssets] = useState([]); const [file, setFile] = useState(null); const [filter, setFilter] = useState('all');
  const [target, setTarget] = useState(null); const [loading, setLoading] = useState(true); const [uploading, setUploading] = useState(false); const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { setAssets(assetsFrom(await mediaService.getAll({ limit: 50 }))); setError(''); } catch (err) { setError(err.response?.data?.error?.message || 'Unable to load media library.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => filter === 'all' ? assets : assets.filter((asset) => filter === 'image' ? asset.mimeType?.startsWith('image/') : asset.mimeType === 'application/pdf'), [assets, filter]);
  const upload = async () => { if (!file) return; setUploading(true); try { await mediaService.upload(file); setFile(null); await load(); } catch (err) { setError(err.response?.data?.error?.message || 'Upload failed.'); } finally { setUploading(false); } };
  const remove = async () => { try { await mediaService.delete(target._id); setTarget(null); await load(); } catch (err) { setError(err.response?.data?.error?.message || 'Delete failed.'); } };
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-indigo-600" /></div>;
  return <div className="space-y-5 p-4 md:p-6"><MediaHeader file={file} onFileChange={setFile} onUpload={upload} uploading={uploading} />{error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase text-slate-400">Total assets</div><div className="mt-2 text-2xl font-bold text-slate-900">{assets.length}</div></div><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase text-slate-400">Images</div><div className="mt-2 text-2xl font-bold text-slate-900">{assets.filter((asset) => asset.mimeType?.startsWith('image/')).length}</div></div><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase text-slate-400">Storage used</div><div className="mt-2 text-2xl font-bold text-slate-900">{(assets.reduce((sum, asset) => sum + Number(asset.size || 0), 0) / 1048576).toFixed(2)} MB</div></div></div><MediaFilters value={filter} onChange={setFilter} /><MediaGrid assets={filtered} onDelete={setTarget} /><DeleteMediaModal asset={target} onClose={() => setTarget(null)} onConfirm={remove} /></div>;
}
