CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL
);

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

