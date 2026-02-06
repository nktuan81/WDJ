import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  dishId?: string | null;
  validFrom: string;
  validUntil: string;
  usedCount: number;
  maxUses: number | null;
  active: boolean;
  createdAt: string;
}

const emptyForm = () => ({
  code: '',
  discountPercent: 10,
  dishId: '',
  validFrom: '',
  validUntil: '',
  maxUses: '',
  active: true,
});

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDiscountCodes() as DiscountCode[];
      setCodes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch discount codes:', error);
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const openCreate = () => {
    setEditingCode(null);
    const now = new Date();
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    const until = new Date(now);
    until.setMonth(until.getMonth() + 1);
    setForm({
      ...emptyForm(),
      validFrom: from.toISOString().slice(0, 16),
      validUntil: until.toISOString().slice(0, 16),
    });
    setDialogOpen(true);
  };

  const openEdit = (item: DiscountCode) => {
    setEditingCode(item);
    setForm({
      code: item.code,
      discountPercent: item.discountPercent,
      dishId: item.dishId ?? '',
      validFrom: item.validFrom.slice(0, 16),
      validUntil: item.validUntil.slice(0, 16),
      maxUses: item.maxUses != null ? String(item.maxUses) : '',
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validFrom = new Date(form.validFrom).toISOString();
    const validUntil = new Date(form.validUntil).toISOString();
    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent) || 10,
      dishId: form.dishId.trim() || undefined,
      validFrom,
      validUntil,
      maxUses: form.maxUses ? parseInt(form.maxUses, 10) : undefined,
      active: form.active,
    };
    if (!payload.code) {
      toast.error('Code is required');
      return;
    }
    try {
      setSaving(true);
      if (editingCode) {
        await apiClient.updateDiscountCode(editingCode.id, payload);
        toast.success('Discount code updated');
      } else {
        await apiClient.createDiscountCode(payload);
        toast.success('Discount code created');
      }
      setDialogOpen(false);
      fetchCodes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this discount code?')) return;
    try {
      await apiClient.deleteDiscountCode(id);
      toast.success('Discount code deleted');
      fetchCodes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-dark">
      <div className="bg-charcoal border-b border-champagne/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg border border-champagne/20 text-champagne hover:bg-champagne/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="font-heading text-2xl text-champagne-light">Discount Codes</h1>
              <p className="text-champagne/60 text-sm">Create and manage fortune cookie discounts</p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-burgundy text-champagne hover:bg-burgundy/90 border border-champagne/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Code
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-imperial overflow-hidden p-0">
          {loading ? (
            <div className="p-12 text-center text-champagne/60">Loading...</div>
          ) : codes.length === 0 ? (
            <div className="p-12 text-center text-champagne/60">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No discount codes yet. Add one for fortune cookie rewards.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-champagne/20 text-left text-champagne/70 text-sm">
                    <th className="p-4">Code</th>
                    <th className="p-4">Discount %</th>
                    <th className="p-4">Valid From</th>
                    <th className="p-4">Valid Until</th>
                    <th className="p-4">Used</th>
                    <th className="p-4">Active</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-b border-champagne/10 hover:bg-charcoal/50">
                      <td className="p-4 text-champagne-light font-mono">{c.code}</td>
                      <td className="p-4 text-champagne/80">{c.discountPercent}%</td>
                      <td className="p-4 text-champagne/80 text-sm">{new Date(c.validFrom).toLocaleDateString()}</td>
                      <td className="p-4 text-champagne/80 text-sm">{new Date(c.validUntil).toLocaleDateString()}</td>
                      <td className="p-4 text-champagne/80">{c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ''}</td>
                      <td className="p-4">
                        <span className={c.active ? 'text-green-400' : 'text-champagne/50'}>{c.active ? 'Yes' : 'No'}</span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button variant="ghost" size="sm" className="text-champagne hover:bg-champagne/10" onClick={() => openEdit(c)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-charcoal border-champagne/20 text-champagne max-w-md">
          <DialogHeader>
            <DialogTitle className="text-champagne-light">
              {editingCode ? 'Edit Discount Code' : 'Add Discount Code'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-champagne/80">Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 font-mono"
                placeholder="LUCKY5"
                required
                disabled={!!editingCode}
              />
            </div>
            <div>
              <Label className="text-champagne/80">Discount % (1–100)</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value, 10) || 0 })}
                className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 w-24"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-champagne/80">Valid From</Label>
                <Input
                  type="datetime-local"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Valid Until</Label>
                <Input
                  type="datetime-local"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-champagne/80">Max Uses (optional)</Label>
              <Input
                type="number"
                min={1}
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 w-24"
                placeholder="Unlimited"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-champagne/80">Active</Label>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-champagne/20 text-champagne">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-burgundy text-champagne hover:bg-burgundy/90">
                {saving ? 'Saving...' : editingCode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDiscounts;
