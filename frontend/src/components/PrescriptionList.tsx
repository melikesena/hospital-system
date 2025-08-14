import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Prescription } from '../types';

interface Props {
  appointmentId?: string;
}

export default function PrescriptionList({ appointmentId }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = appointmentId ? `/prescriptions/appointment/${appointmentId}` : '/prescriptions/my';
        const res = await api.get<Prescription[]>(url);
        setPrescriptions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch prescriptions', err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  if (loading) return <p>Loading prescriptions...</p>;

  return (
    <div>
      <h3>Prescriptions</h3>
      {prescriptions.length === 0 && <p>No prescriptions found.</p>}
      {prescriptions.map(p => (
  <div key={p._id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
    <p>
      Appointment ID: {typeof p.appointment === 'string' ? p.appointment : p.appointment._id}
    </p>
    <p>Medicine: {p.medicine}</p>
    <p>Dosage: {p.dosage}</p>
  </div>
))}
    </div>
  );
}
