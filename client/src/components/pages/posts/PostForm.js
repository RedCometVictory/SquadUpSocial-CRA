import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../../redux/actions/postActions';

const initialState = {title: '', description: '', image_url: ''};

const PostForm = () => {
  const dispatch = useDispatch();
  const [formPostData, setFormPostData] = useState(initialState);
  // const [image_url, setImage] = useState(false);
  // onchange attribute will be passed a string which is the value attr input
  // ensure that name and value attr of input and textareas are the same!!!!
  // const { title, description, image_url } = formPostData;
  const { title, description } = formPostData;
  
  // const fileInputText = React.useRef(null); // clear text from file upload field when called
  const fileInputText = useRef();
  const onChange = e => setFormPostData({ ...formPostData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    // setImage(e.target.files[0]);
    setFormPostData({
      ...formPostData,
      [e.target.name]: e.target.files[0]
    });
  };
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
          <input type="submit" className="btn btn-primary post__form-btn" value="Create Post" />
        </div>
      </form>
    </div>
  );
};
export default PostForm;