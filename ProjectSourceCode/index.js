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

app.post('/register', async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = 'INSERT INTO users (username, password) VALUES ($1, $2);';

  try {
      const hash = await bcrypt.hash(password, 10);
      
      await db.none(query, [username, hash])
      console.log("success");
      res.redirect('/login');
  } catch (err) {
      console.log(err.message);
      res.redirect('/register');
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
          req.session.user = user;
          req.session.save();
          res.redirect("/discover");
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

app.get('/logout', (req,res) => {
  req.session.destroy();
  res.render('pages/logout', {message: "Logged Out Successfully"});
});



  
// starting server
app.listen(3000);
console.log('Server is listening on port 3000');