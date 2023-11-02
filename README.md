# LMS - Backend - hindi sigma 1.0 video 294

## Steps -

### 1. installing dependencies -

> npm i express nodemon morgan bcryptjs cors dotenv cookie-parser cloudinary jsonwebtoken mongoose multer nodemailer --save

- **expres** - framework of nodejs

- **nodemon** - autorun on save (as liveserver)

- **morgan** - log info on server, related to accessed path - *https://www.npmjs.com/package/morgan*

-

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

### 5.
