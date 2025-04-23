export function triggerFileUpload  (fileInputRef)  {
    if (fileInputRef.current) {
        return fileInputRef.current.click();
    }
}


export function handleImageUpload (event, setProfileImage) {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        return setProfileImage(imageUrl);
    }
}