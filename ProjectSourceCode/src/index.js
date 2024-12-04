// *****************************************************
// Import Dependencies
// *****************************************************
// dependencies copied from Lab 8
const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

app.use(express.static(__dirname + '/'));

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// *****************************************************
// Connect to DB
// *****************************************************

// database configuration
const dbConfig = {
  host: process.env.HOST, // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test database connection
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// App Settings
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const user = {
  username: undefined
};

// *****************************************************
// ticket master api for later
// *****************************************************
axios({
  url: `https://app.ticketmaster.com/discovery/v2/events.json`,
  method: 'GET',
  dataType: 'json',
  headers: {
    'Accept-Encoding': 'application/json',
  },
  params: {
    apikey: process.env.API_KEY,
    venueId: 'KovZpa3Wne', //you can choose any artist/event here
    size: 100 // you can choose the number of events you would like to return
  },
})
.then(results => {
  results.data._embedded.events.forEach(event => {
    const eventData = {
      //event_id: event.id,              // Ticketmaster Event ID
      name: event.name,                // Event Name
      date: event.dates.start.dateTime,// Event Date and Time
      //venue_name: event._embedded.venues[0].name, // Venue Name
      //venue_id: event._embedded.venues[0].id,   // Venue ID
      //location: event._embedded.venues[0].location.address.line1, // Venue Location
      description: event.description || 'No description available',  // Event Description
      url: event.url                   // URL to the Event Page
    };

    if(eventData.url && eventData.date) {
      db.none(`
        INSERT INTO ticketMasterEvents(event_name, event_date, description, url)
        VALUES($1, $2, $3, $4);`, 
        [eventData.name, eventData.date, eventData.description, eventData.url]
      )
      .catch(error => {
          console.error('Error inserting event.', error.message);
      });
    }
    
  })
})
.catch(err => {
  console.error('Error fetching events from Ticketmaster API:', err.message);
});



// *****************************************************
// Handlebars Helpers
// *****************************************************
Handlebars.registerHelper('sectionRange', function(start, end) {
  let range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

// *****************************************************
// API Routes
// *****************************************************

app.get('/', (req, res) => {
  res.redirect('/getReviews'); //this will call the /anotherRoute route in the API
});

app.get('/register', (req,res) => {
  res.render('pages/register');
});

app.get('/login', (req,res) => {
  res.render('pages/login');
});
app.get('/forgot', (req,res) => {
  res.render('pages/forgot');
});

//lab 11 api test
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.post('/register', async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const question = req.body.question;
  const query = 'INSERT INTO users (username, password, question) VALUES ($1, $2, $3);';
  try {
      const hash = await bcrypt.hash(password, 10);
      
      await db.none(query, [username, hash, question])
      console.log("user registration success");
      req.session.user = {
            username: username
          };
          req.session.save();
      res.redirect('/getReviews');
  } catch (err) {
      console.log(err.message);
      //allows 'value too long' error in postgres be caught to return a 400 error
      if(err.message === "value too long for type character varying(60)") {
        return res.status(400).json({
          status: 400,
          message: "Username or teacher name Exceeds Character Limit"
        });
      }
      // Redirect to the registration page for other errors
      res.status(500).json({
        status: 500,
        message: "An error occurred during registration. Please try again."
      });
    }
});

app.post('/login', async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = 'SELECT * FROM users WHERE username = $1 LIMIT 1;';

  try {
      const user = await db.one(query, [username])
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
          console.log("login success");
          req.session.user = {
            username: user.username
          };
          req.session.save();
          res.redirect("/getReviews");
      }
      else {
          console.log("incorrect password")
          res.render('pages/login', {
              message : "Incorrect Password"
          }); 
      }
  } catch (err) {
      console.log(err.message)
      if(err.message === "No data returned from the query.") {
        res.render('pages/register', {
          message: "Username Not Found. Please Sign Up."
        });
      }
      else {
        res.redirect('/register');
      }
    }
});

app.get('/getReviews', async (req,res) => {
  const sectionId = req.query.sectionId || null;
  const event = req.query.event || null;

  const query = `SELECT
    r.review_id,
    r.review,
    r.rating,
    s.seat_id,
    s.section,
    s.row,
    s.seat_number,
    u.username,
    e.event_id,
    e.event_name,
    e.event_date,
    i.image_id,
    i.image_url
  FROM
    reviews r
  JOIN
    reviews_to_seats rs ON r.review_id = rs.review_id
  JOIN
    seats s ON s.seat_id = rs.seat_id
  LEFT JOIN
    reviews_to_users ru ON r.review_id = ru.review_id
  LEFT JOIN
    users u ON u.username = ru.username
  JOIN
    reviews_to_events re ON r.review_id = re.review_id
  JOIN
    events e ON e.event_id = re.event_id
  LEFT JOIN
    reviews_to_images ri ON r.review_id = ri.review_id
  LEFT JOIN
    images i ON i.image_id = ri.image_id
  WHERE
    ($1::text IS NULL OR s.section = $1)
  AND 
    ($2::text IS NULL OR e.event_name = $2);`;
  try {
    const reviews = await db.any(query, [sectionId, event]);
    //console.log(reviews);
    res.render('pages/getReviews', { reviews });
  } catch(error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'an error occurred while fetching data',
      error: error.message,
    });
  }
});

// find distinct sections to populate search
app.get('/getSections', async (req, res) => {
  const query = `SELECT DISTINCT section FROM seats ORDER BY section ASC;`;
  try {
    const sections = await db.any(query);
    res.json(sections.map(({ section }) => ({ section })));
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'An error occurred while fetching sections.' });
  }
});

// find distinct events to populate search
app.get('/getEvents', async (req, res) => {
  const query = `SELECT DISTINCT event_name FROM events ORDER BY event_name ASC;`;
  try {
    const events = await db.any(query);
    res.json(events.map(({ event_name }) => ({ event_name })));
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'An error occurred while fetching events.' });
  }
});

app.post('/forgot',async (req,res) => {
  const username = req.body.username;
  const userAnswer = req.body.question.trim();
  const userPassword = req.body.newPassword.trim();
  const query = 'SELECT * FROM users WHERE username = $1 LIMIT 1;';

  try {
    const user = await db.one(query, [username])
    console.log(user)
    if(user.question == userAnswer) {
      console.log("success");
      //update password:
      const hashedPassword= await bcrypt.hash(userPassword,10);
      const queryTWO = 'UPDATE users SET password= $1 WHERE username= $2 RETURNING *; ';
      await db.one(queryTWO,[hashedPassword,username])
      res.render("pages/login",{
        message: `new password is: ${userPassword}`
      });
    } else {
        console.log("incorrect answer to personal question")
        res.render('pages/forgot', {
          message : `Wrong teacher!`
        }); 
      }
  } catch (err) {
      console.log(err.message)
      if(err.message === "No data returned from the query.") {
        res.render('pages/register', {
          message: "Username Not Found. Please Sign Up."
        });
      }
      else {
        res.redirect('/register');
      }
    }
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};
// Authentication Required
app.use(auth);

app.get('/addReview', (req,res) => {
  res.render('pages/addReview');
})

app.post('/addReview', auth, async (req, res) => {
  const Query = `
  insert into reviews (review, rating) 
  values ($1, $2)  returning review_id; `;

  const Query2 = `
  insert into images (image_url)
  values ($1) returning image_id; `;

  const Query3 = `
  insert into reviews_to_images (image_id, review_id)
  values ($1, $2); `; 

  const Query4 = `
  insert into reviews_to_users (username, review_id)
  values ($1, $2); `;

  const Query5 = `
  insert into seats (section, row, seat_number)
  values ($1, $2, $3) returning seat_id; `;

  const Query6 = `
  insert into reviews_to_seats (review_id, seat_id)
  values ($1, $2); `;

  const Query7 = `
  insert into events (event_name)
  values ($1) returning event_id; `;

  const Query8 = `
  insert into reviews_to_events (review_id, event_id)
  values ($1, $2); `;

  try {
    let review_id;

    await db.tx(async task => {
      //add review and reviews_to_users
      review_id = await task.one(Query, [req.body.review, req.body.rating]);
      await task.none(Query4, [req.session.user.username, review_id.review_id]);
      //console.log(review_id);

      //add seat and reviews_to_seats
      let seat_id = await task.one(Query5, [req.body.section, req.body.row, req.body.seatNumber]);
      await task.none(Query6, [review_id.review_id, seat_id.seat_id]);
      //console.log(seat_id);

      //select event and add reviews_to_events
      let event_id = await task.one(Query7, [req.body.eventName]);
      await task.none(Query8, [review_id.review_id, event_id.event_id]);
      //console.log(event_id);

      // add image and reviews_to_images
      if (req.body.image_url) {
        let image_id = await task.one(Query2, [req.body.image_url]);
        await task.none(Query3, [image_id.image_id, review_id.review_id]);
        // Query 1 and 2 return an object containing review_id and image_id
        // for instance Query2 returns an object like {image_id: 5}
        // to access the image_id from the object, we use image_id.image_id
      } 
    }); 

    res.status(200).json({
      status: 'success',
      review_id: review_id,
      message: 'data added successfully',
      // need to add a render 
    });

  } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: 'an error occurred while adding data',
        error: err.message,
      });
    }
});


app.get('/ownReviews', auth, async (req,res) => {
  // dont need this because it is under authentication middleware
  /*if(!req.session||!req.session.user||!req.session.user.username){
    console.log('no user session found');
    return res.redirect('/login');
  } */

  const username= req.session.user.username;
  //console.log('Session: ',req.session);
  //console.log('username: ',username);
  try {
    //console.log('STEP1')
    const reviews = await db.any(
    `SELECT r.review_id, r.review, r.rating, s.seat_number, 
    s.section, s.row, e.event_name, e.event_date, u.username
    FROM reviews r
    JOIN reviews_to_events re ON r.review_id = re.review_id
    JOIN events e ON re.event_id = e.event_id
    JOIN reviews_to_seats rs ON r.review_id = rs.review_id
    JOIN seats s ON rs.seat_id = s.seat_id
    JOIN reviews_to_users ru ON r.review_id = ru.review_id
    JOIN users u ON u.username =ru.username
    WHERE u.username = $1`, [username]);

    res.render('pages/ownReviews', { reviews });
  }
  catch(err) {
    //console.log('STEP6')
    console.error('error finding ownReviews: ', err.message)
    res.status(500).json({
      status: 'error',
      error: err.message,
    });
  }
});


app.get('/logout', (req,res) => {
  req.session.destroy();
  res.render('pages/logout', {message: "Logged Out Successfully"});
});

/*app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Not authenticated');
  }
  try {
    res.status(200).json({
      username: req.session.user.username,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).send('Internal Server Error');
  }
}); */

// starting server
const server = app.listen(3000);

//exporting db,server,app for testing
module.exports = {db, server, app};

console.log('Server is listening on port 3000');