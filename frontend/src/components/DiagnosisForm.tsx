import { useState } from 'react';
import api from '../api/axiosInstance';
import { TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';

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
    setError('');
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
      <Stack spacing={2}>
        <TextField
          label="Enter Diagnosis"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Diagnosis'}
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
