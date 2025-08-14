import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <span style={{ marginRight: '10px' }}>Role: {role}</span>
      <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
    </nav>
  );
}
