import { useEffect, ChangeEvent } from 'react';
import useGalleryStore from '../../lib/state/useGalleryStore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../lib/state/useAuthStore';
import styles from '../../styles/Gallery/Gallery.module.css';

import imageCompression from 'browser-image-compression';


import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Nav from '../../components/Nav';

const GalleryPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { images, fetchGallery, uploadImages, reorderImages, deleteImage, loading, error, clearError } = useGalleryStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        } else {
            fetchGallery();
        }
    }, [isAuthenticated, fetchGallery, navigate]);


    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const filesArray = Array.from(e.target.files);

            const invalidFiles = filesArray.filter(file => !validTypes.includes(file.type));
            if (invalidFiles.length > 0) {
                alert('Only JPG, PNG, or WEBP images are allowed.');
                return;
            }

            const currentImages = images || [];
            if (currentImages.length + filesArray.length > 10) {
                alert('Max 10 images allowed.');
                return;
            }

            try {
                const options = {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 2048,
                    useWebWorker: true,
                };

                const compressedFiles = await Promise.all(
                    filesArray.map(file => imageCompression(file, options))
                );

                uploadImages(compressedFiles);
            } catch (error) {
                console.error('Error compressing images:', error);
                alert('Failed to compress images.');
            }
        }
    };


    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reordered = Array.from(images);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        reorderImages(reordered);
    };

    const handleDeleteImage = (publicId: string) => {
        if (confirm('Are you sure you want to delete this image?')) {
            deleteImage(publicId);
        }
    };


    if (loading) return <p>Loading gallery...</p>;

    if (error === 'Gallery not found') {
        return (
            <div className={styles.errorContainer}>
                <p>No gallery found. Please upload images to create one.</p>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={!images || images.length >= 10}
                    className={styles.uploadInput}
                />

            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <button onClick={clearError} className={styles.errorButton}>Clear</button>
            </div>
        );
    }

    return (
        <>
            <Nav />
            <div className={styles.pageContainer}>

                <h1 className={styles.title}>Gallery Manager</h1>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!images || images.length >= 10}
                    className={styles.uploadInput}
                />

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="gallery" direction="horizontal">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={styles.galleryContainer}
                            >
                                {Array.from({ length: 10 }).map((_, index) => {
                                    const img = images[index];
                                    return (
                                        <Draggable key={img ? img.publicId : `empty-${index}`} draggableId={img ? img.publicId : `empty-${index}`} index={index} isDragDisabled={!img}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...(img ? provided.dragHandleProps : {})}
                                                    className={styles.card}
                                                    onClick={!img ? () => document.getElementById('fileInput')?.click() : undefined}
                                                >
                                                    {img ? (
                                                        <>
                                                            <img src={img.url} alt="Gallery" className={styles.image} />
                                                            <button
                                                                onClick={() => handleDeleteImage(img.publicId)}
                                                                className={styles.deleteButton}
                                                                aria-label="Delete image"
                                                            >
                                                                <RemoveCircleIcon style={{ fontSize: '1.8rem' }} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className={styles.addImagePlaceholder}>
                                                            <AddToPhotosIcon style={{ fontSize: '4rem', color: '#00bcd4' }} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    );
};

export default GalleryPage;
