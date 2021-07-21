import {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  UPDATE_POST,
  // LOADING_LIKES,
  CLEAR_POST,
  CLEAR_FEED_POSTS,
  LIKE_POST,
  LIKE_FEED_POST,
  UNLIKE_POST,
  UNLIKE_FEED_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_FEED_POST,
  DELETE_POST,
  DELETE_COMMENT,
  POST_ERROR,
  LIKE_ERROR,
  COMMENT_ERROR
} from '../constants/postConstants';

const initialState = {
  posts: null, // store posts data of users followed
  post: null, // individual post
  loading: true,
  error: {}
};
// console.log(initialState);

const postReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ALL_POSTS: // main feed
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        // remember to use post not posts, we are dealing with individual post!
        post: payload,
        loading: false
      };
    case CREATE_POST:
      return {
        ...state,
        // make copy of current state (posts[]) & add post data to the state.posts[] (passed via payload), will return posts arr to any comp that uses posts state. This updated state (w/new post) will be passed down to comp.
        // place new post and then fill the UI w/the remaining posts stored in the state
        posts: [payload, ...state.posts], // reversing places the latest post on top in the UI
        loading: false
      };
    case UPDATE_POST:
      return {
        ...state,
        post: {
          postData: payload,
          postComments: [...state.post.postComments],
          postLikes: [...state.post.postLikes]
        },
        loading: false
      };

    case CLEAR_POST:
      return {
        ...state,
        post: null,
        // loading: false
      };

    case CLEAR_FEED_POSTS:
      return {
        ...state,
        posts: null
      }

    case LIKE_POST: 
      return {
        ...state,
        post: {
          postData: {...state.post.postData},
          postComments: [...state.post.postComments],
          postLikes: [payload, ...state.post.postLikes]
        },
        loading: false
      };

    case LIKE_FEED_POST: {
      const index = state.posts.findIndex(posti => posti.id === payload.postId);
      state.posts[index].postLikes.push(payload.postLike);
      return {
        ...state,
        loading: false
      };
    };
    case UNLIKE_POST: 
      return {
        ...state,
        post: {
          postData: {...state.post.postData},
          postComments: [...state.post.postComments],
          postLikes: state.post.postLikes.filter(posti => posti.user_id !== payload.userId)
        },
        loading: false
      };
    case UNLIKE_FEED_POST: {
      const index = state.posts.findIndex(posti => posti.id === payload.postId);
      const likeRemoved = state.posts[index].postLikes.filter(
        postLike => postLike.user_id !== payload.userId
      );
      state.posts[index].postLikes = likeRemoved;
      return {
        ...state,
        loading: false
      };
    };
    case LIKE_COMMENT: {
      const index = state.post.postComments.findIndex(comment => comment.id === payload.commentId);
      state.post.postComments[index].commentLikes.push(payload.likeComment);
      return {
        ...state,
        loading: false
      };
    };
    case UNLIKE_COMMENT: {
      const index = state.post.postComments.findIndex(comment => comment.id === payload.commentId);
      const likeRemoved = state.post.postComments[index].commentLikes.filter(
        commentLike => commentLike.user_id !== payload.userId
      );
      state.post.postComments[index].commentLikes = likeRemoved;
      return {
        ...state,
        loading: false
      };
    };
    case CREATE_COMMENT: 
      return {
        ...state,
        post: {
          postData: {...state.post.postData},
          postComments: [payload, ...state.post.postComments],
          postLikes: [...state.post.postLikes]
        },
        loading: false
      };

    case UPDATE_COMMENT:
      state.post.postComments.map(comment => comment.id === payload.commentId ? comment = payload.updatedPostComment : comment);
      return {
        ...state,
        loading: false
      };

    case DELETE_COMMENT:
      const commentRemoved = state.post.postComments.filter(comment => comment.id !== payload.commentId);
      state.post.postComments = commentRemoved;
      return {
       ...state,
       loading: false
      };
    case DELETE_FEED_POST:
      return {
        ...state,
        // filter through posts, similar to map, it creates an arr copy, for each post - filter out the post in the arr that does not equal to the payload. In this case the payload is the postId via the action.
        // return all posts except for the post getting deleted, it matched the _id of the post in the db
        posts: state.posts.filter(post => post.id !== payload),
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case LIKE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case COMMENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default: 
      return state
  }
}
export default postReducer;