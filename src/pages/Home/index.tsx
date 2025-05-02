import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Home/Home.module.css';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import useAuthStore from '../../lib/state/useAuthStore';
import Nav from '../../components/Nav';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleCreateNews = () => {
    navigate('/news'); 
  };

  const handleCreateGigs = () => {
    navigate('/gigs');
  };

  const handleUploadPhotos = () => {
    navigate('/gallery'); 
  };

  return (
    <>
      <Nav/>

      <div className={styles.Home}>
        <div className={styles.HomeContainer}>
          <div className={styles.HomeContent}>
            <button className={styles.HomeButton} onClick={handleCreateNews}>
              <span className={styles.HomeButtonIcon}>
                <NewspaperIcon fontSize="large" />
              </span>
              <span>Create News</span>
            </button>

            <button className={styles.HomeButton} onClick={handleCreateGigs}>
              <span className={styles.HomeButtonIcon}>
                <LocalActivityIcon fontSize="large" />
              </span>
              <span>Create Gigs</span>
            </button>

            <button className={styles.HomeButton} onClick={handleUploadPhotos}>
              <span className={styles.HomeButtonIcon}>
                <AddPhotoAlternateIcon fontSize="large" />
              </span>
              <span>Upload Your Photos</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
