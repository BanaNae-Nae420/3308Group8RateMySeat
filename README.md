# 3308 Group-8 RateMySeat
## Project Description
**Rate My Seat** is a website that allows you to rate and view rating for seats in Colorado stadiums. Users can:
- Add, edit, and delete their own reviews (if logged in)
* View other people’s reviews
+ Check upcoming events at the stadiums

Rate My Seat lets you make sure you get the best seat to meet your needs!

## Contributors
Carson Mattei, Derek Marraudino, Jordan Law, Aidan Rotter

## Technology Stack Used for Project
**Front End** : HTML, CSS, Bootstrap, Handlebars
**Back End** : Node.js, Express.js, PostgreSQL
**External API's** : Ticket Master API
**Testing Tools** : Mocha, Chai
**Deployment Enviornment** : Render
**Containerization** : Docker
**Version Control** : Git with Github

## Prerequisites to Run Application
This software needs to be installed if you intend to locally run the application
Docker, git

## Instructions on How to Run Application Locally
Assuming you have docker and git properly installed, clone the repo to your local computer. An environmental file (.env) must be added with the following info
```
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_DB=""

SESSION_SECRET=""
API_KEY=""
HOST="db"
```
Note `API_KEY` must be from Ticket Master Developer Discovery API

Run `docker compose up -d` to run docker decomposed from the terminal
Once tests run, go to http://localhost:3000/

## How to Run Tests
The tests will automatically be ran when docker is brought up. Please note they will only run if there is no existing volume. 

Use `docker compose down -v` to delete an existing volume.

## Deployed Application

https://ratemyseat.onrender.com/
