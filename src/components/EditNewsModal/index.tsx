import styles from '../../styles/News/News.module.css';

interface EditNewsModalProps {
  title: string;
  description: string;
  link: string;
  preview: string | null;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeLink: (value: string) => void;
  onChangeImage: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditNewsModal = ({
  title,
  description,
  link,
  preview,
  onChangeTitle,
  onChangeDescription,
  onChangeLink,
  onChangeImage,
  onSave,
  onCancel
}: EditNewsModalProps) => {
  return (
    <div className={styles.EditModalOverlay}>
      <div className={styles.EditModal}>
        <h2>Edit News</h2>
        <input
          className={styles.NewsInput}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
        <textarea
          className={styles.NewsTextarea}
          placeholder="Description"
          value={description}
          maxLength={255}
          onChange={(e) => onChangeDescription(e.target.value)}
        />
        <input
          className={styles.NewsInput}
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => onChangeLink(e.target.value)}
        />
        <input
          className={styles.NewsFileInput}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            onChangeImage(file || null);
          }}
        />

        {preview && (
          <div className={styles.PreviewContainer}>
            <h3>Preview:</h3>
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

export default EditNewsModal;
