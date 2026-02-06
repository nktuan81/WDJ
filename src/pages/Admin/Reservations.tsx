import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Reservation {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  notes?: string | null;
  createdAt: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const AdminReservations: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getReservations(
        statusFilter || undefined,
        dateFilter || undefined
      ) as Reservation[];
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await apiClient.updateReservation(id, { status });
      toast.success('Reservation updated');
      fetchReservations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await apiClient.deleteReservation(id);
      toast.success('Reservation deleted');
      fetchReservations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-dark">
      <div className="bg-charcoal border-b border-champagne/10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 rounded-lg border border-champagne/20 text-champagne hover:bg-champagne/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl text-champagne-light truncate">Reservations</h1>
              <p className="text-champagne/60 text-xs sm:text-sm">Manage table bookings</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReservations()}
            disabled={loading}
            className="border-champagne/20 text-champagne hover:bg-champagne/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-champagne/70 text-sm">Status</label>
            <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[140px] bg-charcoal border-champagne/20 text-champagne">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-champagne/70 text-sm">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-charcoal border border-champagne/20 rounded-lg px-3 py-2 text-champagne"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-imperial overflow-hidden p-0"
        >
          {loading ? (
            <div className="p-12 text-center text-champagne/60">Loading...</div>
          ) : reservations.length === 0 ? (
            <div className="p-12 text-center text-champagne/60">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No reservations found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-champagne/20 text-left text-champagne/70 text-sm">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-champagne/10 hover:bg-charcoal/50">
                      <td className="p-4 text-champagne-light">{r.name}</td>
                      <td className="p-4 text-champagne/80 text-sm">{r.email || '—'}</td>
                      <td className="p-4 text-champagne/80">{r.phone}</td>
                      <td className="p-4 text-champagne/80">{r.date}</td>
                      <td className="p-4 text-champagne/80">{r.time}</td>
                      <td className="p-4 text-champagne/80">{r.guests}</td>
                      <td className="p-4">
                        <Select
                          value={r.status}
                          onValueChange={(v) => handleStatusChange(r.id, v)}
                          disabled={updatingId === r.id}
                        >
                          <SelectTrigger className="w-[120px] bg-charcoal-dark border-champagne/20 text-champagne h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDelete(r.id)}
                        >
                          Delete
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
    </div>
  );
};

export default AdminReservations;
