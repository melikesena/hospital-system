import { AppBar, Toolbar, Typography, Button} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Role: {role}</Typography>
        <Button
          color="inherit"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
