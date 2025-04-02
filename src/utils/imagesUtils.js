export const triggerFileUpload = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
};

export const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);
    }
};