-- create database then select it in psql terminal...
-- apply middleware right after the creation of the database
-- takes time to create db and uuid-oosp
-- \c <database> name to select database to work with
-- \l list all databases
-- \dt show all tables in current selected database

-- can be skipped if db already created via heroku cli
-- CREATE DATABASE squadup_social;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  f_name VARCHAR(60),
  l_name VARCHAR(60),
  username VARCHAR(120) NOT NULL UNIQUE,
  tag_name VARCHAR(120) NOT NULL UNIQUE,
  user_email VARCHAR(60) NOT NULL UNIQUE,
  user_password VARCHAR(60) NOT NULL,
  user_avatar VARCHAR(300),
  user_avatar_filename VARCHAR(600),
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR(120),
  address_2 VARCHAR(120),
  city VARCHAR(120),
  state VARCHAR(120),
  country VARCHAR(120),
  zipcode VARCHAR(10),
  gender VARCHAR(50),
  birth_date DATE,
  company VARCHAR(255),
  status VARCHAR(255),
  interests TEXT,
  bio VARCHAR(360),
  background_image VARCHAR(300),
  background_image_filename VARCHAR(600),
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE socials(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_url VARCHAR(360),
  facebook_url VARCHAR(360),
  twitter_url VARCHAR(360),
  instagram_url VARCHAR(360),
  linkedin_url VARCHAR(360),
  twitch_url VARCHAR(360),
  pinterest_url VARCHAR(360),
  reddit_url VARCHAR(360),
  profile_id UUID,
  FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url VARCHAR(300),
  image_url_filename VARCHAR(600),
  description TEXT NOT NULL,
  user_id UUID,
  FOREIGN KEY(user_id) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url VARCHAR(300),
  image_url_filename VARCHAR(600),
  description TEXT NOT NULL,
  post_id UUID,
  user_id UUID,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows(
  following_id UUID,
  follower_id UUID,
  PRIMARY KEY (following_id, follower_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes(
  id SERIAL PRIMARY KEY,
  post_like UUID DEFAULT NULL,
  comment_like UUID DEFAULT NULL,
  user_id UUID,
  FOREIGN KEY (post_like) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_like) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- this table not used
-- CREATE TYPE member_status AS ENUM ('joined', 'banned');
-- CREATE TABLE members(
  -- member member_status,
  -- circle_id UUID,
  -- user_id UUID,
  -- PRIMARY KEY (circle_id, user_id),
  -- FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE,
  -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- this table is not used
-- CREATE TABLE circles(
  -- id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- owner UUID,
  -- title VARCHAR(360) NOT NULL UNIQUE,
  -- categories TEXT NOT NULL,
  -- tagline TEXT NOT NULL,
  -- FOREIGN KEY (owner) REFERENCES users(id) ON DELETE SET NULL,
  -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );