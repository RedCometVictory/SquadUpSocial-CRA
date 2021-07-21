import React from 'react';
// import { Link } from 'react-router-dom';

const ProfileSocials = ({
  socials: {
    youtube_url,
    facebook_url,
    twitter_url,
    instagram_url,
    linkedin_url,
    twitch_url,
    pinterest_url,
    reddit_url
  }
}) => {
  return (
    <div className="profile__socials-wrapper">
      <div className="profile__socials">
        {youtube_url && (
          <a className="profile__social" href={youtube_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube fa-2x"></i>
          </a>
        )}
        {facebook_url && (
          <a className="profile__social" href={facebook_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook fa-2x"></i>
          </a>
        )}
        {twitter_url && (
          <a className="profile__social" href={twitter_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter fa-2x"></i>
          </a>
        )}
        {instagram_url && (
          <a className="profile__social" href={instagram_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
        )}
        {linkedin_url && (
          <a className="profile__social" href={linkedin_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        )}
        {twitch_url && (
          <a className="profile__social" href={twitch_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitch fa-2x"></i>
          </a>
        )}
        {pinterest_url && (
          <a className="profile__social" href={pinterest_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-pinterest fa-2x"></i>
          </a>
        )}
        {reddit_url && (
          <a className="profile__social" href={reddit_url} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-reddit fa-2x"></i>
          </a>
        )}
      </div>
    </div>
  );
};
export default ProfileSocials;