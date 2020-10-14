// This file is only responsible for importing the User model and exporting an object with it as a property
const User = require('./User');
const Post = require('./Post');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };