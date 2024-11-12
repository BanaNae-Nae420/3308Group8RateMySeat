CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL
);

-- CREATE TABLE stadiums ( -- possibly not need
--     stadium_id SERIAL PRIMARY KEY, 
--     stadium_name VARCHAR(60)
-- );

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY, 
    event_name VARCHAR(60),
    event_date DATE,
    -- FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
);

CREATE TABLE IF NOT EXISTS seats (
    row INT PRIMARY KEY,
    section INT,
    seat_number INT[],
);

CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id), --might change, have foreign key in reviews isntead
    FOREIGN KEY (username) REFERENCES users(username),
    photo_url VARCHAR(100)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (section) REFERENCES seats(section),
    FOREIGN KEY (seat_number) REFERENCES seats(seat_number),
    -- FOREIGN KEY (photo_id) REFERENCES photos(photo_id), -- may keep
    rating INT NOT NULL,
    comment TEXT
);

