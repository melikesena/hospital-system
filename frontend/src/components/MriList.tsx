import React, { useEffect, useState } from 'react';
import { Typography, Stack, Link, Alert } from '@mui/material';
import api from '../api/axiosInstance';

type MriFile = {
  filename: string;
  url: string;
};

type Props = {
  appointmentId: string;
};

type Appointment = {
  _id: string;
  mriFiles: MriFile[];
};

const MriList: React.FC<Props> = ({ appointmentId }) => {
  const [mriFiles, setMriFiles] = useState<MriFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMri = async () => {
      setLoading(true);
      try {
        // Backend'de /diagnosis/doctor gibi tüm randevuları alabileceğin bir endpoint varsa
        const res = await api.get<Appointment[]>(`/appointments/doctor`);
        // Seçili appointmentId ile filtrele
        const appointment = res.data.find(a => a._id === appointmentId);
        setMriFiles(appointment?.mriFiles || []);
      } catch (err) {
        console.error(err);
        setMriFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMri();
  }, [appointmentId]);

  if (loading) return <Typography>Loading MRI files...</Typography>;
  if (mriFiles.length === 0) return <Alert severity="info">No MRI files uploaded yet.</Alert>;

  return (
    <Stack spacing={1}>
      <Typography variant="h6">MRI Files:</Typography>
      {mriFiles.map((file, idx) => (
        <Link key={idx} href={file.url} target="_blank" rel="noopener noreferrer">
          {file.filename}
        </Link>
      ))}
    </Stack>
  );
};

export default MriList;
