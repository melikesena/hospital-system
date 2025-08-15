import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Diagnosis } from '../types';

interface Props {
  appointmentId?: string;
}

export default function DiagnosisList({ appointmentId }: Props) {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = appointmentId ? `/diagnosis/appointment/${appointmentId}` : '/diagnosis/doctor';
        const res = await api.get<Diagnosis[]>(url);

        // Always ensure we have an array
        const data: Diagnosis[] = Array.isArray(res.data) ? res.data : [res.data];
        setDiagnoses(data);
      } catch (err) {
        console.error('Failed to fetch diagnoses', err);
        setDiagnoses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  if (loading) return <p>Loading diagnoses...</p>;
  if (!diagnoses.length) return <p>No diagnoses found.</p>;

  return (
    <div>
      <h3>Diagnoses</h3>
      {diagnoses.map(d => {
        const appt = typeof d.appointment === 'object' ? d.appointment : null;
        const doctorName = appt?.doctor && typeof appt.doctor === 'object' ? appt.doctor.name : 'Unknown';
        const patientName = appt?.patient && typeof appt.patient === 'object' ? appt.patient.name : 'Unknown';
        const date = appt?.date || 'Unknown';

        return (
          <div key={d._id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
            <p>Appointment Date: {date}</p>
            <p>Patient: {patientName}</p>
            <p>Doctor: {doctorName}</p>
            <p>Text: {d.text}</p>
          </div>
        );
      })}
    </div>
  );
}
