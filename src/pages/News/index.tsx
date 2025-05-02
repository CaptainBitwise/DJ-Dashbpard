import styles from '../../styles/News/News.module.css';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import useNewsStore from '../../lib/state/useNewsStore.ts';
import Nav from '../../components/Nav/index.tsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNewsModal from '../../components/EditNewsModal/index.tsx';
import { NewsItem } from '../../lib/types/news.types.ts';


const NewsPage = () => {
  const { news, fetchNews, createNews, loading, error, page, totalPages, clearError } = useNewsStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);


  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setEditingNewsId(newsItem._id);
    setEditTitle(newsItem.title);
    setEditDescription(newsItem.description);
    setEditLink(newsItem.link);
    setEditPreview(newsItem.imageUrl);
    setIsEditing(true);
  };

  const handleDeleteNews = async (newsItemId: string) => {
    if (confirm('Are you sure you want to delete this news?')) {
      try {
        await useNewsStore.getState().deleteNews(newsItemId);
        await fetchNews();
      } catch (error) {
        console.error('Failed to delete news', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !link || !image) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('image', image);

    await createNews(formData);
    await fetchNews();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLink('');
    setImage(null);
    setPreview(null);
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={clearError}>Clear</button>
    </div>
  );

  return (
    <>
      <Nav />
      {isEditing && (
        <EditNewsModal
          title={editTitle}
          description={editDescription}
          link={editLink}
          preview={editPreview}
          onChangeTitle={setEditTitle}
          onChangeDescription={setEditDescription}
          onChangeLink={setEditLink}
          onChangeImage={(file) => {
            setEditImage(file);
            if (file) {
              setEditPreview(URL.createObjectURL(file));
            }
          }}
          onSave={async () => {
            if (!editTitle || !editDescription || !editLink) {
              alert('All fields are required.');
              return;
            }

            const formData = new FormData();
            formData.append('title', editTitle);
            formData.append('description', editDescription);
            formData.append('link', editLink);
            if (editImage) formData.append('image', editImage);

            if (editingNewsId) {
              await useNewsStore.getState().updateNews(editingNewsId, formData);
              await fetchNews();
            }

            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
      <div className={styles.NewsPageContainer}>
        <h1 className={styles.Title}>News Dashboard</h1>

        <form onSubmit={handleSubmit} className={styles.NewsForm}>
          <h2>Create News</h2>
          <input
            className={styles.NewsInput}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div style={{ position: 'relative' }}>
            <textarea
              className={styles.NewsTextarea}
              placeholder="Description"
              value={description}
              maxLength={255}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '1.2rem',
              color: '#777'
            }}>
              {description.length}/255
            </div>
          </div>

          <input
            className={styles.NewsInput}
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          <input
            className={styles.NewsFileInput}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <div className={styles.PreviewContainer}>
              <h3>Preview:</h3>
              <img src={preview} alt="Preview" className={styles.PreviewImage} />
            </div>
          )}

          <button type="submit" className={styles.SubmitButton}>Publish News</button>
        </form>

        <div className={styles.NewsGrid}>
          {news.length > 0 ? (
            news.map((n) => (
              <div key={n._id} className={styles.NewsCard}>
                <img src={n.imageUrl} alt={n.title} className={styles.NewsCardImage} />
                <div className={styles.NewsCardContent}>
                  <h3>{n.title}</h3>
                  <p>{n.description}</p>
                  <a href={n.link} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>

                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                  }}>
                    <button onClick={() => handleEditNews(n)}
                      style={{
                        background: '#ffc107',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <EditIcon fontSize="small" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteNews(n._id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No news available</p>
          )}
        </div>


        <div className={styles.Pagination}>
          <button
            onClick={() => fetchNews(page - 1)}
            disabled={page <= 1}
            className={styles.PaginationButton}
          >
            Prev
          </button>
          <span className={styles.PageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchNews(page + 1)}
            disabled={page >= totalPages}
            className={styles.PaginationButton}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default NewsPage;
