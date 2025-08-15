import { useState } from 'react';
import api from '../api/axiosInstance';
import { TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';

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
    setError('');
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
      <Stack spacing={2}>
        <TextField
          label="Medicine"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Prescription'}
        </Button>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Stack>
    </form>
  );
}
