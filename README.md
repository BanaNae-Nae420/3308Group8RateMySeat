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
Ensure the following are installed on your machine:
- Docker
* Git

## Instructions on How to Run Application Locally
1. Clone the repository to your local computer (assuming SSH):
`git clone git@github.com:BanaNae-Nae420/3308Group8RateMySeat.git`

2. Create a .env file in the root directory with the following variables:
```
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_DB=""

SESSION_SECRET=""
API_KEY=""
HOST="db"
```
`API_KEY` must be from Ticket Master Developer Discovery API

3. Run the application using Docker:
`docker compose up -d`

4. Access the application in your browser at: 
http://localhost:3000/

## How to Run Tests
The tests will automatically be ran when docker is brought up. Please note they will only run if there is no existing volume. 

Use `docker compose down -v` to delete an existing volume.

## Deployed Application

https://ratemyseat.onrender.com/
