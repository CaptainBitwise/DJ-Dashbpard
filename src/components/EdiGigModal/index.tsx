import styles from '../../styles/Gigs/Gigs.module.css';

interface EditGigModalProps {
  artistName: string;
  subtitle: string;
  location: string;
  date: string;
  link: string;
  preview: string | null;
  onChangeArtistName: (value: string) => void;
  onChangeSubtitle: (value: string) => void;
  onChangeLocation: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeLink: (value: string) => void;
  onChangeImage: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditGigModal = ({
  artistName,
  subtitle,
  location,
  date,
  link,
  preview,
  onChangeArtistName,
  onChangeSubtitle,
  onChangeLocation,
  onChangeDate,
  onChangeLink,
  onChangeImage,
  onSave,
  onCancel
}: EditGigModalProps) => {
  return (
    <div className={styles.EditModalOverlay}>
      <div className={styles.EditModal}>
        <h2>Edit Gig</h2>
        <input
          type="text"
          placeholder="Artist Name"
          value={artistName}
          onChange={(e) => onChangeArtistName(e.target.value)}
          className={styles.NewsInput}
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => onChangeSubtitle(e.target.value)}
          className={styles.NewsInput}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => onChangeLocation(e.target.value)}
          className={styles.NewsInput}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => onChangeDate(e.target.value)}
          className={styles.NewsInput}
        />
        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => onChangeLink(e.target.value)}
          className={styles.NewsInput}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            onChangeImage(file || null);
          }}
          className={styles.NewsFileInput}
        />

        {preview && (
          <div className={styles.PreviewContainer}>
            <img src={preview} alt="Preview" className={styles.PreviewImage} />
          </div>
        )}

        <div className={styles.ModalButtons}>
          <button onClick={onSave} className={styles.SubmitButton}>
            Save
          </button>
          <button onClick={onCancel} className={styles.CancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGigModal;
