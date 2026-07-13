'use client';

import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Tag, Search, CheckSquare, Square, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEffectivePrice } from '@/lib/discount';

interface Product {
  _id:            string;
  name:           string;
  image:          string;
  price:          number;
  category:       string;
  discountPct?:   number | null;
  discountEndsAt?: string | null;
}

export default function DiscountsPage() {
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [discountPct, setDiscountPct] = useState('');
  const [endsAt,      setEndsAt]      = useState('');

  useEffect(() => {
    fetch('/api/products?limit=100')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  const allSelected  = filtered.length > 0 && filtered.every(p => selected.has(p._id));
  const someSelected = filtered.some(p => selected.has(p._id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(p => next.delete(p._id));
        return next;
      });
    } else {
      setSelected(prev => new Set([...prev, ...filtered.map(p => p._id)]));
    }
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApply = async () => {
    if (selected.size === 0) { toast.error('Select at least one product'); return; }
    const pct = Number(discountPct);
    if (isNaN(pct) || pct < 0 || pct > 100) { toast.error('Discount must be 0–100'); return; }

    setSaving(true);
    try {
      const res = await fetch('/api/products/discount', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds:     Array.from(selected),
          discountPct:    pct,
          discountEndsAt: endsAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }

      // Update local state so UI reflects immediately
      setProducts(prev => prev.map(p =>
        selected.has(p._id)
          ? { ...p, discountPct: pct, discountEndsAt: endsAt || null }
          : p
      ));

      toast.success(
        pct === 0
          ? `Discount removed from ${data.modifiedCount} product${data.modifiedCount !== 1 ? 's' : ''}`
          : `${pct}% discount applied to ${data.modifiedCount} product${data.modifiedCount !== 1 ? 's' : ''}`
      );
      setSelected(new Set());
      setDiscountPct('');
      setEndsAt('');
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAll = async () => {
    if (selected.size === 0) { toast.error('Select at least one product'); return; }
    setDiscountPct('0');
    setEndsAt('');
    // Trigger apply with 0
    setSaving(true);
    try {
      const res = await fetch('/api/products/discount', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: Array.from(selected), discountPct: 0, discountEndsAt: null }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return; }
      setProducts(prev => prev.map(p =>
        selected.has(p._id) ? { ...p, discountPct: 0, discountEndsAt: null } : p
      ));
      toast.success(`Discount removed from ${data.modifiedCount} product${data.modifiedCount !== 1 ? 's' : ''}`);
      setSelected(new Set());
      setDiscountPct('');
      setEndsAt('');
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Apply panel ── */}
        <Card className="lg:col-span-1 h-fit sticky top-6">
          <CardHeader>
            <CardTitle className="text-sm">Apply Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="d-pct">Discount % <span className="text-red-400">*</span></Label>
              <Input
                id="d-pct" type="number" min="0" max="100" step="1"
                placeholder="e.g. 20"
                value={discountPct}
                onChange={e => setDiscountPct(e.target.value)}
              />
              <p className="text-xs text-gray-400">Set to 0 to remove discount</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-ends" className="flex items-center gap-1.5">
                <Clock size={12} /> Ends At
              </Label>
              <Input
                id="d-ends" type="datetime-local"
                value={endsAt}
                onChange={e => setEndsAt(e.target.value)}
              />
              <p className="text-xs text-gray-400">Leave empty for permanent</p>
            </div>

            <div className="pt-2 space-y-2">
              <Button
                onClick={handleApply}
                disabled={saving || selected.size === 0 || discountPct === ''}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Tag size={14} />}
                Apply to {selected.size} product{selected.size !== 1 ? 's' : ''}
              </Button>
              <Button
                variant="outline"
                onClick={handleRemoveAll}
                disabled={saving || selected.size === 0}
                className="w-full rounded-full gap-2 text-gray-600"
              >
                <X size={14} /> Remove discount
              </Button>
            </div>

            {selected.size > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                {selected.size} product{selected.size !== 1 ? 's' : ''} selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Product list ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + select all */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 transition-all"
              />
            </div>
            <button
              onClick={toggleAll}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 border border-gray-200 rounded-xl bg-white"
            >
              {allSelected
                ? <CheckSquare size={15} className="text-red-500" />
                : <Square size={15} />}
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-red-500" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-16 text-sm text-muted-foreground">No products found</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(product => {
                const { isSale, salePrice, discountPct: activePct, originalPrice } = getEffectivePrice(product);
                const isSelected = selected.has(product._id);

                return (
                  <div
                    key={product._id}
                    onClick={() => toggleOne(product._id)}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      {isSelected
                        ? <CheckSquare size={16} className="text-red-500" />
                        : <Square size={16} className="text-gray-300" />}
                    </div>

                    {/* Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-contain bg-gray-50 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                    </div>

                    {/* Price + badge */}
                    <div className="flex-shrink-0 text-right">
                      {isSale ? (
                        <>
                          <p className="text-sm font-bold text-red-500">${salePrice.toFixed(2)}</p>
                          <p className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">${originalPrice.toFixed(2)}</p>
                      )}
                      {isSale && (
                        <Badge variant="secondary" className="text-[10px] mt-0.5 bg-green-100 text-green-700 border-0">
                          {activePct}% off
                        </Badge>
                      )}
                      {product.discountEndsAt && isSale && (
                        <p className="text-[10px] text-amber-500 mt-0.5 flex items-center justify-end gap-0.5">
                          <Clock size={9} />
                          {new Date(product.discountEndsAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
