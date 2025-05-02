import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import useGigsStore from '../../lib/state/useGigsStore';
import Nav from '../../components/Nav';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ApiUrl from '../../config/ApiBase';
import styles from '../../styles/Gigs/Gigs.module.css';
import EditGigModal from '../../components/EdiGigModal';
import { GigItem } from '../../lib/types/gig.types';

const GigsPage = () => {
  const { gigs, fetchGigs, createGig, loading, error, page, totalPages, clearError } = useGigsStore();

  const [artistName, setArtistName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  const [editArtistName, setEditArtistName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);


  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!artistName || !subtitle || !location || !date || !link || !image) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('artistName', artistName);
    formData.append('subtitle', subtitle);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('link', link);
    formData.append('image', image);

    await createGig(formData);
    await fetchGigs();
    resetForm();
  };

  const resetForm = () => {
    setArtistName('');
    setSubtitle('');
    setLocation('');
    setDate('');
    setLink('');
    setImage(null);
    setPreview(null);
  };

  if (loading) return <p>Loading gigs...</p>;
  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={clearError}>Clear</button>
    </div>
  );

  const handleDeleteGig = async (id: string) => {
    if (confirm('Are you sure you want to delete this gig?')) {
      try {
        await ApiUrl.delete(`/gigs/${id}`);
        await fetchGigs();
      } catch (error) {
        console.error('Failed to delete gig', error);
      }
    }
  };

  const handleEditGig = (gig: GigItem) => {
    setEditingGigId(gig._id);
    setEditArtistName(gig.artistName);
    setEditSubtitle(gig.subtitle);
    setEditLocation(gig.location);
    setEditDate(gig.date.slice(0, 10));
    setEditLink(gig.link);
    setEditPreview(gig.imageUrl);
    setIsEditing(true);
  };


  return (
    <>
      <Nav />
      {isEditing && (
        <EditGigModal
          artistName={editArtistName}
          subtitle={editSubtitle}
          location={editLocation}
          date={editDate}
          link={editLink}
          preview={editPreview}
          onChangeArtistName={setEditArtistName}
          onChangeSubtitle={setEditSubtitle}
          onChangeLocation={setEditLocation}
          onChangeDate={setEditDate}
          onChangeLink={setEditLink}
          onChangeImage={(file) => {
            setEditImage(file);
            if (file) {
              setEditPreview(URL.createObjectURL(file));
            }
          }}
          onSave={async () => {
            if (!editArtistName || !editSubtitle || !editLocation || !editDate || !editLink) {
              alert('All fields are required.');
              return;
            }

            const formData = new FormData();
            formData.append('artistName', editArtistName);
            formData.append('subtitle', editSubtitle);
            formData.append('location', editLocation);
            formData.append('date', editDate);
            formData.append('link', editLink);
            if (editImage) formData.append('image', editImage);

            if (editingGigId) {
              await useGigsStore.getState().updateGig(editingGigId, formData);
              await fetchGigs();
            }

            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      <div className={styles.container}>
        <h1>Gigs Dashboard</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Create Gig</h2>
          <input type="text" placeholder="Artist Name" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
          <input type="text" placeholder="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} required />
          <input type="file" accept="image/*" onChange={handleImageChange} required />

          {preview && (
            <div className={styles.preview}>
              <h3>Preview:</h3>
              <img src={preview} alt="Preview" />
            </div>
          )}
          <button type="submit">Publish Gig</button>
        </form>

        <div className={styles.gigsGrid}>
          {gigs.length > 0 ? (
            gigs.map((g) => (
              <div key={g._id} className={styles.gigCard}>
                <img src={g.imageUrl} alt={g.artistName} />
                <h3>{g.artistName}</h3>
                <p>{g.subtitle}</p>
                <p>{g.location}</p>
                <p>{new Date(g.date).toLocaleDateString()}</p>
                <a href={g.link} target="_blank" rel="noopener noreferrer">More Info</a>

                <div className={styles.actions}>
                <button onClick={() => handleEditGig(g)} className={styles.editButton}>
                    <EditIcon fontSize="small" /> Edit
                  </button>
                  <button onClick={() => handleDeleteGig(g._id)} className={styles.deleteButton}>
                    <DeleteIcon fontSize="small" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No gigs available</p>
          )}
        </div>

        <div className={styles.pagination}>
          <button onClick={() => fetchGigs(page - 1)} disabled={page <= 1}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => fetchGigs(page + 1)} disabled={page >= totalPages}>Next</button>
        </div>
      </div>
    </>
  );
};

export default GigsPage;
