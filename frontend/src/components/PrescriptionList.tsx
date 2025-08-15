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
     {prescriptions.map(p => {
  const appt = typeof p.appointment === 'object' ? p.appointment : null;
  const patientName = appt?.patient?.name ?? 'Unknown';
  const doctorName = appt?.doctor?.name ?? 'Unknown';
  const date = appt?.date ?? 'Unknown';

  return (
    <div key={p._id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
      <p>Appointment Date: {date}</p>
      <p>Patient: {patientName}</p>
      <p>Doctor: {doctorName}</p>
      <p>Medicine: {p.medicine}</p>
      <p>Dosage: {p.dosage || 'N/A'}</p>
    </div>
  );
})}





    </div>
  );
}
