# LMS - Backend - hindi sigma 1.0 video 294

## Steps -

### 1. installing dependencies -

> npm i express nodemon morgan bcryptjs cors dotenv cookie-parser cloudinary jsonwebtoken mongoose multer nodemailer --save

- **expres** - framework of nodejs

- **nodemon** - autorun on save (as liveserver)

- **morgan** - log info on server, related to accessed path -> *https://www.npmjs.com/package/morgan*

- **mongoose** - for connect to DB -> [dbConnection](config/dbConnection.js)

- **dotenv** - for get variables defined on process level -> *https://www.npmjs.com/package/dotenv*

- **cookie-parser** - with this we can use cookies stored on users browser -> *https://www.npmjs.com/package/cookie-parser*

- **cors** - cross origin resource sharing -> *https://www.npmjs.com/package/cors*

- **bcryptjs** - for encrypt password -> *https://www.npmjs.com/package/bcryptjs*

- **jsonwebtoken** - for token generation and encryption -> *https://www.npmjs.com/package/jsonwebtoken*

- **multer** - media processing service binary to actual media file -> *https://www.npmjs.com/package/multer*

- **cloudinary** - media upload database server -> *https://www.npmjs.com/package/cloudinary*

- **crypto** - for encryption (crypting reset password token) -> *https://www.npmjs.com/package/crypto*

- **razorpay** - for payment interface - *https://www.npmjs.com/package/razorpay*, *https://dashboard.razorpay.com/app/subscriptions*

### 2. creating [server.js](server.js) -

- require app
- PORT
- listen on PORT
-

### 3. creating [app.js](app.js) -

- require express - instance of app
- use - express.json()
- use - cors()
- use - cookieParser()
- use - `/ping` route for check
- use - morgan() - for logging details when any route trigger

### 4. [config/dbConnection.js](config/dbConnection.js)

- _this setting of mongoose will tell mongoose to not use strictquery - means if any information asked by route and it is not exist under DB then it doesn't give error_

> _mongoose.set('strictQuery', false)_

- connectionToDb - (use async await or promise -> then check connection is successful and catch if any error)

- then under [server.js](server.js) check DB conncetion first on listening

- remember MONGO_URI on username or pass should be without special character, if special characters are used need to make changes under MONGO_URI for that special character

### 5. [routes/user.routes.js](routes/user.routes.js)

- now we create user routes :-

- under app.js navigate all user routes through this -> `app.use("/api/v1/user", userRoutes)`

- under [routes/user.routes.js](routes/user.routes.js) mention the routes ->

```
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", getProfile);
```

- under [controllers/user.controlller.js](controllers/user.controlller.js) define all user controllers -> `register, login, logout, getProfile`

### 6. User Controllers -> [controllers/user.controlller.js](controllers/user.controlller.js)

- for register we need user model, so we first create user model -> [models/user.model.js](models/user.model.js)

- for create model we need 2 things from mongoose -> `Schema` and `Model`

- **Schema** - for create structure of user

- **model** - for storing under DB and it tells how we will use it

- then we create userSchema - [models/user.model.js](models/user.model.js)

#### Register -> register controller of user

- Create utils for errors using Error class -> [utils/error.util.js](utils/error.util.js)

- [middlewares/error.middleware.js](middlewares/error.middleware.js) -> middleware defined which can handle all error which we need to send as res to user, and it is placed under app.js after all routes defined,

- if any route/controller gives error we are running next() with error instance , like this -> `return next(new AppError("All fields are required", 400));`

- and that next() will go to next middlewares which is called in last under app.js, named errorMiddleware, and this will res user with error - [middlewares/error.middleware.js](middlewares/error.middleware.js)

- _find in DB if same email already exits_ res error to user

- if not exist, register the user with details - res to user, if any error on user creation time

- TODO - (Done) - upload profile image file and save avatar URL with user details, and save the user again, (get binary media file via multer process and save locally on server then upload image on cloudinary and get url for that image, update avatar details and save user again)

- Store token on users browser - _JWT_, _flush the password_ and then send successfull res to user with user details

#### Login -> Login controller for user

- Check the required fields exist or not, then check user exist or not under DB,

- check passwaord is correct matching with user password - using comparepassword method of user

- Store cookies on browser and send res- 200 to user

#### Logout - logout controller for user

- set cookie null and set cookieOption- maxAge = 0

- send res 200 to user

#### getUser - getting user details

- middleware - isLoggedIn created for check user loggedIn or not using cookies - `[isLoggedIn - middleware](middlewares/auth.middleware.js)`

- middle ware gives err to user or find user based on cookie data then run next() ,getUser method

- if not error send reponce to user with user data

#### forgotPassword - forgot password request accept

- get mail from user, find user by mail on DB and set store a reset token on DB with that user

- send a reset URL to user on mail, if any error - store undefined on token and expiry at user level

#### resetPassword - resetting user password

- get reset token from params which sent at forgotPassword request, and get new password which user have sent

- get user based on that reset token, check users available and expiry time, ig perfect update new password

#### changePassword - if user already know old password

- get old and new pass from req, find user by id on DB

- check old password, if correct update new password and save

#### updateUser - update user details

- get things, which user want to update, get user by id from DB

- upload details , and if avatar also given upload it on cloudinary and save user

###
