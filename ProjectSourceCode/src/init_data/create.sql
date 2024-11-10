CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    password VARCHAR(60) NOT NULL
);

-- reviews
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY NOT NULL,
  review VARCHAR(200),
  rating DECIMAL NOT NULL
);

-- image for reviews
DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE IF NOT EXISTS images (
  image_id SERIAL PRIMARY KEY NOT NULL,
  image_url VARCHAR(300) NOT NULL,
  image_caption VARCHAR(200)
);

-- stadium seat
DROP TABLE IF EXISTS seats CASCADE;
CREATE TABLE IF NOT EXISTS seats (
    seat_id SERIAL PRIMARY KEY NOT NULL,
    section INT,
    row INT,
    seat_number INT
    -- FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
);

-- stadium event
DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY NOT NULL, 
    event_name VARCHAR(60),
    event_date DATE
    -- FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
);

-- review to user
DROP TABLE IF EXISTS reviews_to_users CASCADE;
CREATE TABLE reviews_to_users (
  username VARCHAR(60) NOT NULL,
  review_id INT NOT NULL,
  FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (review_id) REFERENCES reviews (review_id) ON DELETE CASCADE
);

-- image to review
DROP TABLE IF EXISTS reviews_to_images CASCADE;
CREATE TABLE reviews_to_images (
  image_id INT NOT NULL,
  review_id INT NOT NULL,
  FOREIGN KEY (image_id) REFERENCES images (image_id) ON DELETE CASCADE,
  FOREIGN KEY (review_id) REFERENCES reviews (review_id) ON DELETE CASCADE
);

-- seat to review
DROP TABLE IF EXISTS reviews_to_seats CASCADE;
CREATE TABLE reviews_to_seats (
    review_id INT NOT NULL,
    seat_id INT NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews (review_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats (seat_id) ON DELETE CASCADE
);

-- event to review
DROP TABLE IF EXISTS reviews_to_events CASCADE;
CREATE TABLE reviews_to_events (
    review_id INT NOT NULL,
    event_id INT NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews (review_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE
);




/*
CREATE TABLE stadiums ( -- possibly not need
    stadium_id SERIAL PRIMARY KEY, 
    stadium_name VARCHAR(60)
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY, 
    event_name VARCHAR(60),
    event_date DATE,
    FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
);

CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    section INT,
    row INT,
    seat_number INT,
    FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
);

CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id), --might change, have foreign key in reviews isntead
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    photo_url VARCHAR(100)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    -- FOREIGN KEY (photo_id) REFERENCES photos(photo_id), -- may keep
    rating INT NOT NULL,
    comment TEXT
);
*/