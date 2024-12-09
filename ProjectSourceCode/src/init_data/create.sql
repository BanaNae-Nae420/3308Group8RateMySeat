-- users
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(60) PRIMARY KEY NOT NULL,
  password VARCHAR(60) NOT NULL,
  question VARCHAR(60) NOT NULL
);

-- reviews
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY NOT NULL,
  review VARCHAR(200),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL
);

-- image for reviews
DROP TABLE IF EXISTS images CASCADE;
CREATE TABLE IF NOT EXISTS images (
  image_id SERIAL PRIMARY KEY NOT NULL,
  image_url VARCHAR(500)
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
    event_name VARCHAR(100),
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

-- ticket master events
DROP TABLE IF EXISTS ticketMasterEvents;
CREATE TABLE ticketMasterEvents (
  event_id SERIAL PRIMARY KEY NOT NULL,
  event_name VARCHAR(100),
  event_date TIMESTAMP,
  description TEXT,
  url VARCHAR(500),
  image_url VARCHAR(500)
);