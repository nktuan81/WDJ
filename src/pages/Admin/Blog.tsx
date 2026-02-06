import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { ArrowLeft, BookOpen, Plus, Pencil, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

interface BlogPost {
  id: string;
  title_de: string;
  title_en: string;
  title_cn: string;
  content_de: string;
  content_en: string;
  content_cn: string;
  dishId?: string | null;
  image?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = (): Partial<BlogPost> => ({
  title_de: '',
  title_en: '',
  title_cn: '',
  content_de: '',
  content_en: '',
  content_cn: '',
  dishId: '',
  image: '',
  published: false,
});

const AdminBlog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBlogPostsAdmin() as BlogPost[];
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title_de: post.title_de,
      title_en: post.title_en,
      title_cn: post.title_cn,
      content_de: post.content_de,
      content_en: post.content_en,
      content_cn: post.content_cn,
      dishId: post.dishId ?? '',
      image: post.image ?? '',
      published: post.published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_de: form.title_de || '',
      title_en: form.title_en || '',
      title_cn: form.title_cn || '',
      content_de: form.content_de || '',
      content_en: form.content_en || '',
      content_cn: form.content_cn || '',
      dishId: (form.dishId as string)?.trim() || undefined,
      image: (form.image as string)?.trim() || undefined,
      published: form.published ?? false,
    };
    if (!payload.title_de || !payload.title_en || !payload.title_cn ||
        !payload.content_de || !payload.content_en || !payload.content_cn) {
      toast.error('All title and content fields are required');
      return;
    }
    try {
      setSaving(true);
      if (editingPost) {
        await apiClient.updateBlogPost(editingPost.id, payload);
        toast.success('Blog post updated');
      } else {
        await apiClient.createBlogPost(payload);
        toast.success('Blog post created');
      }
      setDialogOpen(false);
      fetchPosts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await apiClient.deleteBlogPost(id);
      toast.success('Blog post deleted');
      fetchPosts();
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
              <h1 className="font-heading text-2xl text-champagne-light">Blog Posts</h1>
              <p className="text-champagne/60 text-sm">Stories behind the velvet curtain</p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-burgundy text-champagne hover:bg-burgundy/90 border border-champagne/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-imperial overflow-hidden p-0">
          {loading ? (
            <div className="p-12 text-center text-champagne/60">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-champagne/60">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No blog posts yet. Add your first story.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-champagne/20 text-left text-champagne/70 text-sm">
                    <th className="p-4">Title (EN)</th>
                    <th className="p-4">Published</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-champagne/10 hover:bg-charcoal/50">
                      <td className="p-4 text-champagne-light">{post.title_en}</td>
                      <td className="p-4">
                        <span className={post.published ? 'text-green-400' : 'text-champagne/50'}>
                          {post.published ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 text-champagne/80 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 flex gap-2">
                        <Button variant="ghost" size="sm" className="text-champagne hover:bg-champagne/10" onClick={() => openEdit(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(post.id)}>
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
        <DialogContent className="bg-charcoal border-champagne/20 text-champagne max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-champagne-light">
              {editingPost ? 'Edit Blog Post' : 'Add Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-champagne/80">Title (DE)</Label>
                <Input
                  value={form.title_de ?? ''}
                  onChange={(e) => setForm({ ...form, title_de: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Title (EN)</Label>
                <Input
                  value={form.title_en ?? ''}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Title (CN)</Label>
                <Input
                  value={form.title_cn ?? ''}
                  onChange={(e) => setForm({ ...form, title_cn: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-champagne/80">Content (DE)</Label>
                <Textarea
                  value={form.content_de ?? ''}
                  onChange={(e) => setForm({ ...form, content_de: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 min-h-[80px]"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Content (EN)</Label>
                <Textarea
                  value={form.content_en ?? ''}
                  onChange={(e) => setForm({ ...form, content_en: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 min-h-[80px]"
                  required
                />
              </div>
              <div>
                <Label className="text-champagne/80">Content (CN)</Label>
                <Textarea
                  value={form.content_cn ?? ''}
                  onChange={(e) => setForm({ ...form, content_cn: e.target.value })}
                  className="bg-charcoal-dark border-champagne/20 text-champagne mt-1 min-h-[80px]"
                  required
                />
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
            <div>
              <Label className="text-champagne/80">Dish ID (optional)</Label>
              <Input
                value={form.dishId ?? ''}
                onChange={(e) => setForm({ ...form, dishId: e.target.value })}
                className="bg-charcoal-dark border-champagne/20 text-champagne mt-1"
                placeholder="Link to menu item"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.published ?? false} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label className="text-champagne/80">Published</Label>
            </div>
            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-champagne/20 text-champagne">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-burgundy text-champagne hover:bg-burgundy/90">
                {saving ? 'Saving...' : editingPost ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
