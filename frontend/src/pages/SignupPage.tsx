import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import api from '../api/axiosInstance';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', {
        name,
        email,
        password,
        role: 'patient',
        age: age === '' ? undefined : Number(age),
        gender,
      });
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
              <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
              <TextField label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} fullWidth />
              {message && <Alert severity={message.includes('successful') ? 'success' : 'error'}>{message}</Alert>}
              <Button type="submit" variant="contained" size="large">Sign Up</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignupPage;

export {};
