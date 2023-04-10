# Social Platform HBook
## What's it? What does it do?
Basically it's my take on cloning one of the biggest platform for past decades FACEBOOK. It has or will have all the basic function facebook has like *add friend, post, story, chat,..* The difference is that i'll implement openAI API to try and replicate some of the current popular AI like **chatGPT, DALL·E 2,midjourney,...** 
## Features
1. Basic Facebook 
  - Real-time chat
  - Posting, interacting with post
  - Add/delete friend
  - Real-time notification.
  - Profile edit(name, avatar, background, url)
2.AI add-ons
  - AI chat bot.
  - Image generate with prompt.
3. Advanced features
  - Profile wall decorating.
  - Video call
## How to use
1. Clone this repository url:***https://github.com/PhamTrungHai/social-app.git***
2. Open terminal from the root of the project navigate to the *backend* folder with `cd backend` then run `npm i` to install all dependencies.
3. Create a .env file then add all the evironment varible. The list are:
  -JWT_SECRET
  -MONGODB_URI
  -CLOUDINARY_CLOUD_NAME
  -CLOUDINARY_API_KEY
  -CLOUDINARY_API_SECRET
  -DATABASE_URL
4.After that try running the app with `npm start` and you're application's server side should be ready to go.
5. Now countinue with the *frontend*, repeat step 2 but replace *backend* with *frontend*. 
**Note: You have to be in the root of the project in order to navigate to frontend folder. I suggest open another terminal for running frontend to reduce the time from navigating through backend and frontend**
6. Now to run it use `npm run dev` and your client side code should be running.
## Technologies
- **Backend**
  + *Server*: Nodejs + Express,SocketIO
  + *Database*: MongGoDB,PostGres,Prisma
  + *Other*: Cloudinary, multer,bcryptjs,...
- **Frontend**
  + *Framework*: Vite + Reactjs
  + *Library*: redux, axios, swr, socket.io-client
  + *Styling*: CharkaUI,animate.css,react-toastify
 **I'm still learning so i'm open to constructive criticsm.** :smiling_face_with_tear: 
 **If you have any problem or wanting to collaborate, feel free to contact me on [my facebook] (https://www.facebook.com/trhai256).** :smile: :smile: :smile:
 ***Thank for viewing my project.*** :heart: :heart: :heart:  
