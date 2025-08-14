import { useState } from 'react';
import api from '../api/axiosInstance';

interface Props {
  appointmentId: string;
  onSuccess?: () => void;
}

export default function DiagnosisForm({ appointmentId, onSuccess }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/diagnosis', { appointment: appointmentId, text });
      setText('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter diagnosis" />
      <button type="submit" disabled={loading}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
