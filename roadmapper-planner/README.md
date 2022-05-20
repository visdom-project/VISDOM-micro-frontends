# How to connect the microfrontend to roadmapper database:

### What to do in roadmapper:


1. Change the CORS ORIGIN of the server environment to match the Composer domain

   /Server/.env `CORS_ORIGIN=https://iteavisdom.org`

2. Start the database from the /server folder (requires docker)

   `yarn start-db`

3. Start the server from the same /server folder

   `yarn start`

4. Log in to roadmapper to fetch the required token

   POST `http://localhost:5000/users/login`

   POST request body should be: `{"email": "admin.person1@test.com","password": "test"}`

5. Fetch the token of the logged in user

   POST `http://localhost:5000/users/mytoken`

   Returns a token for authentication, for example: `71dd72c1-73b4-4b73-ae50-1edd3532820d`


### What to do in the microfrontend:


1) Add the fetched token to the microfront api  ```/src/api/api.tsx```

    for example: ```const token = "71dd72c1-73b4-4b73-ae50-1edd3532820d";```
