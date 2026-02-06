import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Utensils, Plus, Pencil, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'] as const;
const CATEGORIES = ['protein', 'vegetable', 'starch', 'soup'] as const;

interface MenuItem {
  id: string;
  name_de: string;
  name_en: string;
  name_cn: string;
  description_de: string;
  description_en: string;
  description_cn: string;
  price: number;
  element: string;
  category: string;
  image?: string | null;
  story_de?: string | null;
  story_en?: string | null;
  story_cn?: string | null;
  available: boolean;
  createdAt: string;
}

const emptyItem = (): Partial<MenuItem> => ({
  name_de: '',
  name_en: '',
  name_cn: '',
  description_de: '',
  description_en: '',
  description_cn: '',
  price: 0,
  element: 'fire',
  category: 'protein',
  image: '',
  available: true,
});

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>(emptyItem());
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMenu() as MenuItem[];
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyItem());
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name_de: item.name_de,
      name_en: item.name_en,
      name_cn: item.name_cn,
      description_de: item.description_de,
      description_en: item.description_en,
      description_cn: item.description_cn,
      price: item.price,
      element: item.element,
      category: item.category,
      image: item.image ?? '',
      story_de: item.story_de ?? '',
      story_en: item.story_en ?? '',
      story_cn: item.story_cn ?? '',
      available: item.available,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name_de: form.name_de || '',
      name_en: form.name_en || '',
      name_cn: form.name_cn || '',
      description_de: form.description_de || '',
      description_en: form.description_en || '',
      description_cn: form.description_cn || '',
      price: Number(form.price) || 0,
      element: form.element || 'fire',
      category: form.category || 'protein',
      image: form.image || undefined,
      story_de: form.story_de || undefined,
      story_en: form.story_en || undefined,
      story_cn: form.story_cn || undefined,
      available: form.available ?? true,
    };
    if (!payload.name_de || !payload.name_en || !payload.name_cn || !payload.description_de || !payload.description_en || !payload.description_cn) {
      toast.error('All name and description fields are required');
      return;
    }
    try {
      setSaving(true);
      if (editingItem) {
        await apiClient.updateMenuItem(editingItem.id, payload);
        toast.success('Menu item updated');
      } else {
        await apiClient.createMenuItem(payload);
        toast.success('Menu item created');
      }
      setDialogOpen(false);
      fetchMenu();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await apiClient.deleteMenuItem(id);
      toast.success('Menu item deleted');
      fetchMenu();
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
              <h1 className="font-heading text-2xl text-champagne-light">Menu Items</h1>
              <p className="text-champagne/60 text-sm">Add, edit, or remove dishes</p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-burgundy text-champagne hover:bg-burgundy/90 border border-champagne/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-imperial overflow-hidden p-0">
          {loading ? (
            <div className="p-12 text-center text-champagne/60">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-champagne/60">
              <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No menu items yet. Add your first dish.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-champagne/20 text-left text-champagne/70 text-sm">
                    <th className="p-4">Name (EN)</th>
                    <th className="p-4">Element</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Available</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-champagne/10 hover:bg-charcoal/50">
                      <td className="p-4 text-champagne-light">{item.name_en}</td>
                      <td className="p-4 text-champagne/80 capitalize">{item.element}</td>
                      <td className="p-4 text-champagne/80 capitalize">{item.category}</td>
                      <td className="p-4 text-champagne/80">€{item.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={item.available ? 'text-green-400' : 'text-champagne/50'}>
                          {item.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <Button variant="ghost" size="sm" className="text-champagne hover:bg-champagne/10" onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(item.id)}>
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
        <DialogContent className="bg-charcoal border-champagne/20 text-champagne max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-champagne-light">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-champagne/80">Name (DE)</Label>
                <Input
                  value={form.name_de ?? ''}
                  onChange={(e) => setForm({ ...form, name_de: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Name (EN)</Label>
                <Input
                  value={form.name_en ?? ''}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Name (CN)</Label>
                <Input
                  value={form.name_cn ?? ''}
                  onChange={(e) => setForm({ ...form, name_cn: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-champagne/80">Description (DE)</Label>
                <Input
                  value={form.description_de ?? ''}
                  onChange={(e) => setForm({ ...form, description_de: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Description (EN)</Label>
                <Input
                  value={form.description_en ?? ''}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Description (CN)</Label>
                <Input
                  value={form.description_cn ?? ''}
                  onChange={(e) => setForm({ ...form, description_cn: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div>
                <Label className="text-champagne/80">Price (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price ?? 0}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 w-24"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Element</Label>
                <Select value={form.element ?? 'fire'} onValueChange={(v) => setForm({ ...form, element: v })}>
                  <SelectTrigger className="w-[120px] bg-charcoal-dark border-champagne/20 text-champagne mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ELEMENTS.map((el) => (
                      <SelectItem key={el} value={el}>{el}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-champagne/80">Category</Label>
                <Select value={form.category ?? 'protein'} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="w-[120px] bg-charcoal-dark border-champagne/20 text-champagne mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.available ?? true}
                  onCheckedChange={(v) => setForm({ ...form, available: v })}
                />
                <Label className="text-champagne/80">Available</Label>
              </div>
            </div>
            <div>
              <Label className="text-champagne/80">Image URL (optional)</Label>
              <Input
                value={form.image ?? ''}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                placeholder="https://..."
              />
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-champagne/20 text-champagne">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-burgundy text-champagne hover:bg-burgundy/90">
                {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMenu;
