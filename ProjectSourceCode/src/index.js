// *****************************************************
// <!-- Section 1 : Import Dependencies -->
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
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
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
// <!-- Section 3 : App Settings -->
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
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

app.get('/', (req, res) => {
  res.redirect('/login'); //this will call the /anotherRoute route in the API
});

app.get('/register', (req,res) => {
  res.render('pages/register');
});

app.get('/login', (req,res) => {
  res.render('pages/login');
});

//lab 11 api test
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.post('/register', async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2);';

  try {
      const hash = await bcrypt.hash(password, 10);
      
      await db.none(query, [username, hash])
      //console.log("success");
      res.redirect('/login');
  } catch (err) {
      console.log(err.message);
      //allows 'value too long' error in postgres be caught to return a 400 error
      if(err.message === "value too long for type character varying(60)") {
        return res.status(400).json({
          status: 400,
          message: "Username Exceeds Character Limit"
        });
      }
      else {
        res.redirect('/register');
      }  
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
          console.log("success");
          req.session.user = {
            username: user.username
          };
          req.session.save();
          res.redirect("/addReview");
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
  insert into images (image_url, image_caption)
  values ($1, $2) returning image_id; `;

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
  SELECT event_id FROM events
  WHERE event_name = $1; `;

  const Query8 = `
  insert into reviews_to_events (review_id, event_id)
  values ($1, $2); `;

  try {
    await db.tx(async task => {
      //add review and reviews_to_users
      let review_id = await task.one(Query, [req.body.review, req.body.rating]);
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
      if (req.body.image_url && req.body.image_caption) {
        let image_id = await task.one(Query2, [req.body.image_url, req.body.image_caption]);
        await task.none(Query3, [image_id.image_id, review_id.review_id]);
        // Query 1 and 2 return an object containing review_id and image_id
        // for instance Query2 returns an object like {image_id: 5}
        // to access the image_id from the object, we use image_id.image_id
      } 
    }); 

    res.status(200).json({
      status: 'success',
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

//exporting server and db for tesing
module.exports = {db, server, app};

console.log('Server is listening on port 3000');
