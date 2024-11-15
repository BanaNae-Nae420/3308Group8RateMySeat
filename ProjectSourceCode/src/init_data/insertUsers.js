/*This file has multiple purposes.
The first being we can only insert hashed password's into our database. This means we cannot
directly add users via insert.sql.

This file also inserts records into reviews_to_users. This has to be done here since 
insert.sql runs before this script does, so insert.sql would be unable to find the username.

Doing this also allows us to login to user's with already added reviews and test
*/
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');

const db = pgp({
    host: 'db',
    port: 5432,
    database: 'groupDB',
    user: 'postgres',
    password: 'pwd',
}); 

// function to insert data into users
async function insertHashedUsers() {
    const users = [
    [
        { "username": "test1", "password": "test1", "question": "Alice" },
        { "username": "john_doe", "password": "password123", "question": "Bob" },
        { "username": "jane_smith", "password": "password124", "question": "Charlie" },
        { "username": "michael_jones", "password": "password125", "question": "Diana" },
        { "username": "mary_johnson", "password": "password126", "question": "Edward" },
        { "username": "robert_brown", "password": "password127", "question": "Fiona" },
        { "username": "linda_white", "password": "password128", "question": "George" },
        { "username": "david_taylor", "password": "password129", "question": "Hannah" },
        { "username": "patricia_lee", "password": "password130", "question": "Ian" },
        { "username": "james_wilson", "password": "password131", "question": "Julia" },
        { "username": "elizabeth_moore", "password": "password132", "question": "Kevin" },
        { "username": "william_anderson", "password": "password133", "question": "Laura" },
        { "username": "susan_thomas", "password": "password134", "question": "Michael" },
        { "username": "joseph_jackson", "password": "password135", "question": "Nina" },
        { "username": "nancy_white", "password": "password136", "question": "Oliver" },
        { "username": "charles_harris", "password": "password137", "question": "Paula" },
        { "username": "barbara_martin", "password": "password138", "question": "Quentin" },
        { "username": "thomas_young", "password": "password139", "question": "Rachel" },
        { "username": "sarah_king", "password": "password140", "question": "Steve" },
        { "username": "christopher_scott", "password": "password141", "question": "Tina" },
        { "username": "karen_adams", "password": "password142", "question": "Ursula" },
        { "username": "daniel_baker", "password": "password143", "question": "Victor" },
        { "username": "betty_gonzalez", "password": "password144", "question": "Wendy" },
        { "username": "george_carter", "password": "password145", "question": "Xavier" },
        { "username": "dorothy_wilson", "password": "password146", "question": "Yvonne" },
        { "username": "paul_brown", "password": "password147", "question": "Zach" },
        { "username": "jennifer_davis", "password": "password148", "question": "Abby" },
        { "username": "mark_miller", "password": "password149", "question": "Brian" },
        { "username": "martha_williams", "password": "password150", "question": "Clara" },
        { "username": "steven_clark", "password": "password151", "question": "David" },
        { "username": "nancy_rodgers", "password": "password152", "question": "Ella" }
        ]
    ];

    for (const user of users[0]) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.none('INSERT INTO users (username, password, question) VALUES ($1, $2,$3)', [user.username, hashedPassword, user.question]);
    }
    console.log("users inserted with hashed passwords");
} 

// function to insert data into reviews_to_users
async function insertReviewUsers() {
    const reviewUsers = [
        { username: 'john_doe', review_id: 1 },
        { username: 'jane_smith', review_id: 2 },
        { username: 'michael_jones', review_id: 3 },
        { username: 'mary_johnson', review_id: 4 },
        { username: 'robert_brown', review_id: 5 },
        { username: 'linda_white', review_id: 6 },
        { username: 'david_taylor', review_id: 7 },
        { username: 'patricia_lee', review_id: 8 },
        { username: 'james_wilson', review_id: 9 },
        { username: 'elizabeth_moore', review_id: 10 },
        { username: 'william_anderson', review_id: 11 },
        { username: 'susan_thomas', review_id: 12 },
        { username: 'joseph_jackson', review_id: 13 },
        { username: 'nancy_white', review_id: 14 },
        { username: 'charles_harris', review_id: 15 },
        { username: 'barbara_martin', review_id: 16 },
        { username: 'thomas_young', review_id: 17 },
        { username: 'sarah_king', review_id: 18 },
        { username: 'christopher_scott', review_id: 19 },
        { username: 'karen_adams', review_id: 20 },
        { username: 'daniel_baker', review_id: 21 },
        { username: 'betty_gonzalez', review_id: 22 },
        { username: 'george_carter', review_id: 23 },
        { username: 'dorothy_wilson', review_id: 24 },
        { username: 'paul_brown', review_id: 25 },
        { username: 'jennifer_davis', review_id: 26 },
        { username: 'mark_miller', review_id: 27 },
        { username: 'martha_williams', review_id: 28 },
        { username: 'steven_clark', review_id: 29 },
        { username: 'nancy_rodgers', review_id: 30 },
        { username: 'john_doe', review_id: 31 },
        { username: 'jane_smith', review_id: 32 },
        { username: 'michael_jones', review_id: 33 },
        { username: 'mary_johnson', review_id: 34 },
        { username: 'robert_brown', review_id: 35 },
        { username: 'linda_white', review_id: 36 },
        { username: 'david_taylor', review_id: 37 },
        { username: 'patricia_lee', review_id: 38 },
        { username: 'james_wilson', review_id: 39 },
        { username: 'elizabeth_moore', review_id: 40 },
        { username: 'william_anderson', review_id: 41 },
        { username: 'susan_thomas', review_id: 42 },
        { username: 'joseph_jackson', review_id: 43 },
        { username: 'nancy_white', review_id: 44 },
        { username: 'charles_harris', review_id: 45 },
        { username: 'barbara_martin', review_id: 46 },
        { username: 'thomas_young', review_id: 47 },
        { username: 'sarah_king', review_id: 48 },
        { username: 'christopher_scott', review_id: 49 },
        { username: 'karen_adams', review_id: 50 },
        { username: 'daniel_baker', review_id: 51 },
        { username: 'betty_gonzalez', review_id: 52 },
        { username: 'george_carter', review_id: 53 },
        { username: 'dorothy_wilson', review_id: 54 },
        { username: 'paul_brown', review_id: 55 },
        { username: 'jennifer_davis', review_id: 56 },
        { username: 'mark_miller', review_id: 57 },
        { username: 'martha_williams', review_id: 58 },
        { username: 'steven_clark', review_id: 59 },
        { username: 'nancy_rodgers', review_id: 60 },
        { username: 'john_doe', review_id: 61 },
        { username: 'jane_smith', review_id: 62 },
        { username: 'michael_jones', review_id: 63 },
        { username: 'mary_johnson', review_id: 64 },
        { username: 'robert_brown', review_id: 65 },
        { username: 'linda_white', review_id: 66 },
        { username: 'david_taylor', review_id: 67 },
        { username: 'patricia_lee', review_id: 68 },
        { username: 'james_wilson', review_id: 69 },
        { username: 'elizabeth_moore', review_id: 70 },
        { username: 'william_anderson', review_id: 71 },
        { username: 'susan_thomas', review_id: 72 },
        { username: 'joseph_jackson', review_id: 73 },
        { username: 'nancy_white', review_id: 74 },
        { username: 'charles_harris', review_id: 75 },
        { username: 'barbara_martin', review_id: 76 },
        { username: 'thomas_young', review_id: 77 },
        { username: 'sarah_king', review_id: 78 },
        { username: 'christopher_scott', review_id: 79 },
        { username: 'karen_adams', review_id: 80 },
        { username: 'daniel_baker', review_id: 81 },
        { username: 'betty_gonzalez', review_id: 82 },
        { username: 'george_carter', review_id: 83 },
        { username: 'dorothy_wilson', review_id: 84 },
        { username: 'paul_brown', review_id: 85 },
        { username: 'jennifer_davis', review_id: 86 },
        { username: 'mark_miller', review_id: 87 },
        { username: 'martha_williams', review_id: 88 },
        { username: 'steven_clark', review_id: 89 },
        { username: 'nancy_rodgers', review_id: 90 },
        { username: 'john_doe', review_id: 91 },
        { username: 'jane_smith', review_id: 92 },
        { username: 'michael_jones', review_id: 93 },
        { username: 'mary_johnson', review_id: 94 },
        { username: 'robert_brown', review_id: 95 },
        { username: 'linda_white', review_id: 96 },
        { username: 'david_taylor', review_id: 97 },
        { username: 'patricia_lee', review_id: 98 },
        { username: 'james_wilson', review_id: 99 },
        { username: 'elizabeth_moore', review_id: 100 }
    ];

    for (const reviewUser of reviewUsers) {
        await db.none('INSERT INTO reviews_to_users (username, review_id) VALUES ($1, $2)', [reviewUser.username, reviewUser.review_id]);
    }
    console.log("review_to_users entries inserted");
}

insertHashedUsers()
    .then(insertReviewUsers)
    .then(() => db.$pool.end())
    .catch(err => console.error('Error inserting users', err));
