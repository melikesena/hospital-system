import { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';


interface AuthResponse {
  access_token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      const token = res.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      login(token, payload.role, payload.name);
      if (payload.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
        <Stack spacing={3}>
  {/* email & password input + button ... */}
  {error && <Alert severity="error">{error}</Alert>}

 

  <Typography variant="body2" sx={{ mt: 1 }}>
    Don't have an account?{' '}
    <RouterLink to="/signup" style={{ textDecoration: 'none', color: 'blue' }}>
      Sign Up
    </RouterLink>
  </Typography>
</Stack>
      </Card>
    </Container>
  );
}
