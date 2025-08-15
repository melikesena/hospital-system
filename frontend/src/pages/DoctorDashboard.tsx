import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import DiagnosisForm from '../components/DiagnosisForm';
import DiagnosisList from '../components/DiagnosisList';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionList from '../components/PrescriptionList';
import api from '../api/axiosInstance';

const DoctorDashboard: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [prescriptionMedicine, setPrescriptionMedicine] = useState('');
  const [prescriptionDosage, setPrescriptionDosage] = useState('');
  const [patientId, setPatientId] = useState('');

  // Bağımsız formlar için işlevler
  const handleAddDiagnosis = async () => {
    if (!appointmentId || !diagnosisText) return alert('Fill all fields');
    try {
      await api.post('/diagnosis', { appointment: appointmentId, text: diagnosisText });
      alert('Diagnosis added!');
    } catch (err) {
      console.error(err);
      alert('Failed to add diagnosis');
    }
  };

  const handleAddPrescription = async () => {
    if (!appointmentId || !prescriptionMedicine || !prescriptionDosage) return alert('Fill all fields');
    try {
      await api.post('/prescriptions', {
        appointmentId,
        medicine: prescriptionMedicine,
        dosage: prescriptionDosage,
      });
      alert('Prescription added!');
    } catch (err) {
      console.error(err);
      alert('Failed to add prescription');
    }
  };

  const handleAddPatient = async () => {
    if (!patientId) return alert('Enter patient ID');
    try {
      const doctorId = localStorage.getItem('userId'); 
      await api.post(`/users/${patientId}/add-doctor/${doctorId}`);
      alert('Patient added!');
    } catch (err) {
      console.error(err);
      alert('Failed to add patient');
    }
  };

  const handleCreateAppointment = async () => {
    if (!patientId || !appointmentId) return alert('Enter required info');
    try {
      await api.post('/appointments', {
        doctor: localStorage.getItem('userId'),
        patient: patientId,
        date: appointmentId, // ISO string
      });
      alert('Appointment created!');
    } catch (err) {
      console.error(err);
      alert('Failed to create appointment');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Doctor Dashboard</h2>

      {/* Randevu listesi */}
      <h3>Your Appointments</h3>
      <AppointmentList role="doctor" onSelect={setSelectedAppointment} />

      {/* Seçilen randevuya bağlı işlemler */}
      {selectedAppointment && (
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '20px' }}>
          <h3>Selected Appointment: {selectedAppointment}</h3>

          <h4>Add Diagnosis</h4>
          <DiagnosisForm
            appointmentId={selectedAppointment}
            onSuccess={() => setSelectedAppointment(selectedAppointment)}
          />

          <h4>Diagnoses</h4>
          <DiagnosisList appointmentId={selectedAppointment} />

          <h4>Add Prescription</h4>
          <PrescriptionForm
            appointmentId={selectedAppointment}
            onSuccess={() => setSelectedAppointment(selectedAppointment)}
          />

          <h4>Prescriptions</h4>
          <PrescriptionList appointmentId={selectedAppointment || ''} />
        </div>
      )}

      {/* Bağımsız işlemler */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '20px' }}>
        <h3>Independent Actions</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4>Add Diagnosis</h4>
          <input placeholder="Appointment ID" value={appointmentId} onChange={e => setAppointmentId(e.target.value)} />
          <input placeholder="Diagnosis text" value={diagnosisText} onChange={e => setDiagnosisText(e.target.value)} />
          <button onClick={handleAddDiagnosis}>Add Diagnosis</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Add Prescription</h4>
          <input placeholder="Appointment ID" value={appointmentId} onChange={e => setAppointmentId(e.target.value)} />
          <input placeholder="Medicine" value={prescriptionMedicine} onChange={e => setPrescriptionMedicine(e.target.value)} />
          <input placeholder="Dosage" value={prescriptionDosage} onChange={e => setPrescriptionDosage(e.target.value)} />
          <button onClick={handleAddPrescription}>Add Prescription</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Add Patient</h4>
          <input placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <button onClick={handleAddPatient}>Add Patient</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Create Appointment</h4>
          <input placeholder="Patient ID" value={patientId} onChange={e => setPatientId(e.target.value)} />
          <input placeholder="Date (ISO string)" value={appointmentId} onChange={e => setAppointmentId(e.target.value)} />
          <button onClick={handleCreateAppointment}>Create Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
