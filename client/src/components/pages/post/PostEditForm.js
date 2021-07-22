import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Spinner from '../../layouts/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById, updatePostById } from '../../../redux/actions/postActions';

const initialState = {title: '', description: '', image_url: ''};

const PostEditForm = () => {
  const { post_id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const postState = useSelector(state => state.post);
  const { post, loading } = postState;
  const [formPostData, setFormPostData] = useState(initialState);
  // const [image_url, setImage] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  useEffect(() => {
    dispatch(getPostById(post_id));
    setFormPostData({ // on comp load
      title: loading || !post ? '' : post.postData.title,
      description: loading || !post ? '' : post.postData.description,
      image_url: loading || !post ? '' : post.postData.image_url
    })
    // setImage({image_url: loading || !post ? '' : post.postData.image_url})
  }, [dispatch, post_id, loading]);
  // }, [dispatch, post_id, post, loading]);

  const fileInputText = useRef();
  
  // const { title, description, image_url } = formPostData;
  const { title, description } = formPostData;
  
  const onChange = e => setFormPostData({ ...formPostData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    // check file type
    let fileToUpload = e.target.files[0];
    checkFileType(fileToUpload);
    // check file size
    checkFileSize(fileToUpload);
    // setImage(e.target.files[0]);
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
    dispatch(updatePostById(post_id, formPostData, history));
    fileInputText.current.value = ""; // upon submit clear field for image file upload
    // setFormPostData({title: '', description: '', image_url: ''});
    // setFormPostData({title: '', description: ''});
  }
  return (
    loading && !post ? (
      <Spinner /> 
    ) : post === null ? (
      <div>nothing found</div>
    ) : (
      <div className="post post__form-section">
        <form className="form post__form" onSubmit={onSubmit} >
          <h3>Edit Post</h3>
          <div className="post__group">
            <input
              type="text"
              placeholder="Post Title (Optional)"
              className="post__form-title"
              name="title"
              onChange={e => onChange(e)}
              value={title}
            />
          </div>
          <div className="post__group">
            <input
              type="file"
              accept=".jpeg, .jpg, .png, .gif"
              placeholder=".jpeg, .jpg, .png, .gif formats only"
              className="post__form-title file-btn-input"
              name="image_url"
              onChange={handleImageChange}
              ref={fileInputText}
              // value={image_url}
            />
            <label htmlFor="image_url" className="post__form file-btn-label">
              Image
            </label>
          </div>
          <div className="">
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
            <input type="submit" className="btn btn-primary post__form-btn" value="Submit Post Edit" />
          )}
        </form>
      </div>
    )
  );
};
export default PostEditForm;