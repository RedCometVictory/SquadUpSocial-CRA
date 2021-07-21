import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../layouts/Spinner';
import PostItem from '../posts/PostItem';
import PostForm from '../posts/PostForm';
import { getAllPosts } from '../../../redux/actions/postActions';

const Posts = () => {
  const dispatch = useDispatch();
  const postState = useSelector(state => state.post);
  const { posts, loading } = postState;

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);
  
  // fetch posts from api, place into state as soon as module loads
  return loading ? (
    <Spinner />
    ) : (
      <section className="posts-page-wrapper">
        <div className="post">
          <PostForm />
        </div>
        <div className="post__feed">
          {posts && posts.length > 0 ? (
            <Fragment>
              {/* must keep to one line */}
              {posts && posts.map((post, i) => <PostItem post={post} key={i} />)}
            </Fragment>
          ) : (
            <div>
              No posts found. Follow profiles in order to start seeing posts in your feed.
            </div>
          )}
        </div>
      </section>
    )
};
export default Posts;