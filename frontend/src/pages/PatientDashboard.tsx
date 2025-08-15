import React, { useState, useEffect } from 'react'; 
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

type Doctor = {
  _id: string;
  name: string;
};

type Prescription = {
  _id: string;
  appointment: string;
  doctor: Doctor | string;
  medicine: string;
  dosage: string;
  createdAt: string;
};

const PatientDashboard: React.FC = () => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const { name: patientName, userId } = useAuth(); // login olmuş kullanıcı ID’si

  // Doktor listesini backendden çek
  useEffect(() => {
    api.get<Doctor[]>('/users/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Doktor listesi alınamadı', err));
  }, []);

  // Mevcut tarihten 1 hafta sonrasına kadar tarihler oluştur
  useEffect(() => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1); // yarından başlasın
      dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    setAvailableDates(dates);
  }, []);

  // Hastanın reçetelerini çek
  useEffect(() => {
    if (!userId) return;
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get<Prescription[]>(`/prescriptions/patient/${userId}`);
        setPrescriptions(res.data);
      } catch (err) {
        console.error('Failed to fetch prescriptions', err);
      }
    };
    fetchPrescriptions();
  }, [userId]);

  // Yeni randevu oluşturma
  const handleCreateAppointment = async () => {
    if (!doctorId || !appointmentDate) return alert('Lütfen tüm alanları doldurun');
    if (!userId) return alert('Patient ID bulunamadı');

    try {
      await api.post('/appointments', {
        doctorId,
        patientId: userId,
        date: new Date(appointmentDate), // backend Date objesi bekliyorsa
      });

      // Doktoru hastaya otomatik ekle
      await api.post(`/users/${userId}/add-doctor/${doctorId}`);

      alert('Randevu oluşturuldu!');
      setDoctorId('');
      setAppointmentDate('');
    } catch (err) {
      console.error(err);
      alert('Randevu oluşturulamadı');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Hoş geldin, {patientName}</h2>

      {/* Randevu listesi */}
      <div style={{ marginTop: '20px' }}>
        <h3>Randevularım</h3>
        <AppointmentList role="patient" />
      </div>

      {/* Reçeteler */}
      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Reçetelerim</h3>
        {prescriptions.length === 0 && <p>Henüz reçeteniz yok.</p>}
        {prescriptions.map(p => (
          <div key={p._id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
            <p>Doktor: {typeof p.doctor === 'string' ? p.doctor : p.doctor.name}</p>
            <p>İlaç: {p.medicine}</p>
            <p>Dozaj: {p.dosage}</p>
            <p>Tarih: {new Date(p.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Yeni randevu alma */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '20px' }}>
        <h3>Yeni Randevu Al</h3>

        {/* Doktor dropdown */}
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          <option value="">Doktor Seç</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </select>

        {/* Tarih dropdown */}
        <select value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}>
          <option value="">Tarih Seç</option>
          {availableDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>

        <button onClick={handleCreateAppointment}>Randevu Oluştur</button>
      </div>
    </div>
  );
};

export default PatientDashboard;
