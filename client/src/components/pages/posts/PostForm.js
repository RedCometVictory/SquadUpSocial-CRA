import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../redux/actions/postActions';

const initialState = {title: '', description: '', image_url: ''};

const PostForm = () => {
  const dispatch = useDispatch();
  const [formPostData, setFormPostData] = useState(initialState);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  // const [image_url, setImage] = useState(false);
  // onchange attribute will be passed a string which is the value attr input
  // ensure that name and value attr of input and textareas are the same!!!!
  // const { title, description, image_url } = formPostData;
  const { title, description } = formPostData;
  
  // const fileInputText = React.useRef(null);
  // clear text from file upload field when called
  const fileInputText = useRef();
  const onChange = e => setFormPostData({ ...formPostData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    let fileToUpload = e.target.files[0];
    // setImage(e.target.files[0]);
    checkFileType(fileToUpload);
    checkFileSize(fileToUpload);
    setFormPostData({
      ...formPostData,
      [e.target.name]: e.target.files[0]
    });
  };

  // check file type
  const checkFileType = (img) => {
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (types.every(type => img.type !== type)) {
      return setFileTypeError(true);
    }
    return setFileTypeError(false);
  }

  const checkFileSize=(img)=>{
    let size = 3 * 1024 * 1024; // size limit 3mb
    if (img.size > size) {
      return setFileSizeError(true);
    }
    return setFileSizeError(false);
  }

  const onSubmit = e => {
    e.preventDefault();
    // call action and pass to it text set as an object (this is the formData within the action function)
    dispatch(createPost(formPostData));
    // clear form after submitting
    // document.getElementById("form-image").reset();
    fileInputText.current.value = "";
    setFormPostData({title: '', description: '', image_url: ''});
    // document.getElementById("saveForm").reset();
    // setFormData({title: '', description: ''});
    // setImage(false);
  }
  return (
    <div className="post__form-section">
      <form className="form post__form" onSubmit={onSubmit} >
        <input
          type="text"
          placeholder="Post Title (Optional)"
          className="post__form-title"
          name="title"
          onChange={e => onChange(e)}
          value={title}
        />
        <div className="post__group">
          <input
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            placeholder=".jpeg, .jpg, .gif, .png formats only"
            className="post__form-title post__form-image file-btn-input"
            name="image_url"
            onChange={handleImageChange}
            ref={fileInputText}
          />
          <label htmlFor="image_url" className="post__form file-btn-label">
            Image
          </label>
        </div>
        <div className="post__group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Create a post"
            onChange={e => onChange(e)}
            value={description}
            required
          ></textarea>
        </div>
        {fileTypeError || fileSizeError ? (
          <div className="form__error">
            File type or size limit exceeded: jpg, jpeg, png, gif only and size must be less than 3mb.
          </div>
        ) : (
          <input type="submit" className="btn btn-primary post__form-btn" value="Create Post" />
        )}
      </form>
    </div>
  );
};
export default PostForm;