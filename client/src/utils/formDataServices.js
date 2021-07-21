export const registerForm = (formRegData) => {
  const { firstName, lastName, username, tagName, email, password, avatar } = formRegData;

  let formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("username", username);
  formData.append("tagName", tagName);
  formData.append("email", email);
  formData.append("password", password);
  avatar && formData.append("avatar", avatar);

  return formData;
};
export const addPostForm = (formPostData) => {
  const {title, image_url, description} = formPostData;

  let formData = new FormData();
  title && formData.append("title", title);
  formData.append("description", description);
  image_url && formData.append("image_url", image_url);
  
  return formData;
};
export const editPostForm = (formPostData) => {
  const {title, image_url, description} = formPostData;

  let formData = new FormData();
  title && formData.append("title", title);
  formData.append("description", description);
  image_url && formData.append("image_url", image_url);
  // for (let [key, value] of formData.entries()) {
    // console.log(`${key}: ${value}`);
    // console.log(`XOXOXOXOXOXOXOXOXO`);
    // console.dir(`${key}: ${value}`);
  // }
  
  return formData;
};
export const addCommentForm = (formCommentData) => {
  const {title, image_url, description} = formCommentData;

  let formData = new FormData();
  title && formData.append("title", title);
  formData.append("description", description);
  image_url && formData.append("image_url", image_url);

  return formData;
};
export const addProfileForm = (formData) => {
  let data = new FormData();

  formData.address && data.append("address", formData.address);
  formData.address2 && data.append("address2", formData.address2);
  formData.city && data.append("city", formData.city);
  formData.state && data.append("state", formData.state);
  formData.country && data.append("country", formData.country);
  formData.zipcode && data.append("zipcode", formData.zipcode);
  formData.gender && data.append("gender", formData.gender); 
  data.append("birthday", formData.birthday);
  formData.company && data.append("company", formData.company);
  formData.status && data.append("status", formData.status);
  formData.interests && data.append("interests", formData.interests);
  formData.bio && data.append("bio", formData.bio);
  formData.background_image  && data.append("background_image", formData.background_image);
  formData.youtube && data.append("youtube", formData.youtube);
  formData.facebook && data.append("facebook", formData.facebook);
  formData.twitter && data.append("twitter", formData.twitter);
  formData.instagram && data.append("instagram", formData.instagram);
  formData.linkedin && data.append("linkedin", formData.linkedin);
  formData.twitch && data.append("twitch", formData.twitch);
  formData.pinterest && data.append("pinterest", formData.pinterest);
  formData.reddit && data.append("reddit", formData.reddit);

  return data;
};
export const editProfileForm = (formData) => {
  let data = new FormData();

  formData.f_name && data.append("f_name", formData.f_name);
  formData.l_name && data.append("l_name", formData.l_name);
  formData.username && data.append("username", formData.username);
  formData.tag_name && data.append("tag_name", formData.tag_name);
  formData.user_email && data.append("user_email", formData.user_email);
  formData.user_avatar && data.append("user_avatar", formData.user_avatar);
  formData.address && data.append("address", formData.address);
  formData.address2 && data.append("address2", formData.address2);
  formData.city && data.append("city", formData.city);
  formData.state && data.append("state", formData.state);
  formData.country && data.append("country", formData.country);
  formData.zipcode && data.append("zipcode", formData.zipcode);
  formData.gender && data.append("gender", formData.gender); 
  data.append("birthday", formData.birthday);
  formData.company && data.append("company", formData.company);
  formData.status && data.append("status", formData.status);
  formData.interests && data.append("interests", formData.interests);
  formData.bio && data.append("bio", formData.bio);
  formData.background_image && data.append("background_image", formData.background_image);
  formData.youtube && data.append("youtube", formData.youtube);
  formData.facebook && data.append("facebook", formData.facebook);
  formData.twitter && data.append("twitter", formData.twitter);
  formData.instagram && data.append("instagram", formData.instagram);
  formData.linkedin && data.append("linkedin", formData.linkedin);
  formData.twitch && data.append("twitch", formData.twitch);
  formData.pinterest && data.append("pinterest", formData.pinterest);
  formData.reddit && data.append("reddit", formData.reddit);

  return data;
};