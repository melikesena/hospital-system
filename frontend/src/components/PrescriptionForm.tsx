import { useState } from 'react';
import api from '../api/axiosInstance';

interface Props {
  appointmentId: string;
  onSuccess?: () => void;
}

export default function PrescriptionForm({ appointmentId, onSuccess }: Props) {
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/prescriptions', { appointmentId, medicine, dosage });
      setMedicine('');
      setDosage('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Medicine" value={medicine} onChange={e => setMedicine(e.target.value)} />
      <input placeholder="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} />
      <button type="submit" disabled={loading}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
