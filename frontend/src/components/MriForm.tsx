import React, { useState } from 'react';
import { Button, Typography, Stack, Alert } from '@mui/material';
import api from '../api/axiosInstance';

type Props = {
  appointmentId: string;
  onSuccess?: () => void;
};

const MriForm: React.FC<Props> = ({ appointmentId, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/appointments/${appointmentId}/upload-mri`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('MRI uploaded successfully!');
      if (onSuccess) onSuccess();
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Upload MRI</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {message && <Alert severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
    </Stack>
  );
};

export default MriForm;
