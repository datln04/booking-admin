import React, { useState } from 'react';

const ImageUpload = ({ setImage, imageUrl }) => {
  const [preview, setPreview] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {(preview || imageUrl) && <img src={imageUrl ? imageUrl : preview} alt="Preview" style={{ width: '200px' }} />}
    </div>
  );
};

export default ImageUpload;