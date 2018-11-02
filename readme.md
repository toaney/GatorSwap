#gatorswap

##current working routes

name      url          verb    desc.
===============================================
INDEX   /listings                    GET   Display a grid of all listing
NEW     /listings/new                GET   Displays form to make a new listing
CREATE  /listings                    POST  Add new listing to DB
SHOW    /listings/:id                GET   Shows details about one listing

NEW     listings/:id/messages/new    GET   Displays form to write a new message
CREATE  listings/:id/messages        POST  Add new message(associated with current listing and user) to DB. 
 
OTHER   /register                    GET   Displays form to create a new user
        /register                    POST  Add new user to DB
        /login                       GET   Displays form to log in
        /login                       POST  Post Log in information with middleware
        /logout                      GET   Log out

##Views
* Landing Page
* Listings Page that lists all listings
* header and footer partials
* show route desplay each listing details
* Add in body-parser
* New messages with nested routes
* message new and create/post routes

##Search
*search listings caption, description and/or category

##Image upload
* install Claudinary
* configure Claudinary
TODO: THUMNAILS

##Authentication
* packages needed for auth: passport, sessions

##Register
* Configure Passport

##Login
* Add login routes

##Logout
* Add logout route
* Prevent user from adding a message if not signed in

##Users Listings Association
* Prevent an unauthenticated user from creating a listing
* Save username and _id to newly created listing

##Users Messages Association
* Associate users and messages
* Save author's name to a message automatically

DATA SCHEMA
##Add Mongoose and set up mongodb at mlab
* Install and configure Mongoose
* Create listing model
* Refactor Mongoose Code; Create a models directory; Use module.exports
* Require everything correctly
* Create the User, Category, Message model
* TODO: Display messages on listing show page





