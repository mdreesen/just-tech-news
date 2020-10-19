// first initialize express
const router = require('express').Router();
// then require the file
const { User, Post, Vote, Comment } = require('../../models');
const { restore } = require('../../models/User');

// GET api/users
// Access our User model and run .findAll() method
// this is equivalent to something like this:
// select * from users;
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
            attributes: { exclude: ['password'] }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET api/users/:id - get user with this specific ID
router.get('/:id', (req, res) => {
    // this indicates that we only want to find one piece of data and bring it back
    // this is also like doing this:
    // select * from user where id = 1;
    User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            // replace the existing `include` with this
            include: [{
                    model: Post,
                    attributes: ['id', 'title', 'post_url', 'created_at']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                },
                {
                    model: Post,
                    attributes: ['title'],
                    through: Vote,
                    as: 'voted_posts'
                }
            ]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST api/users
// expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
// This is like using this SQL query here:
// INSERT INTO users
// (username, email, password)
// VALUES
//("Lernantino", "lernantino@gmail.com", "password1234");
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// PUT api/users/:id - update user with this specific ID
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This looks just like this SQL query:
    // UPDATE users
    // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    // WHERE id = 1;
    User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        });
});

// Delete api/users/:id - delete a specific user
router.delete('/:id', (req, res) => {
    // User.destroy method deletes the user 
    User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id' });
                return
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err);
        });
});

// export router
module.exports = router;