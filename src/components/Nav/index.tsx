import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../lib/state/useAuthStore';
import styles from '../../styles/Nav/Nav.module.css';

const Nav = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className={styles.NavContainer}>
      <h1 className={styles.NavLogo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        DJ Dashboard
      </h1>
      <span>{username || 'Guest'}</span>
    </nav>
  );
};

export default Nav;
