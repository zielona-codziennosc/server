# Zielona codzienność's backend 🎉🎉🎉🎉🎉🎉

[![Build Status](https://travis-ci.com/anteeek/hackheroes_temp_server.svg?token=FMjKkwfuVYj8mskr7sDm&branch=master)](https://travis-ci.com/anteeek/hackheroes_temp_server) master

[![Build Status](https://travis-ci.com/anteeek/hackheroes_temp_server.svg?token=FMjKkwfuVYj8mskr7sDm&branch=development)](https://travis-ci.com/anteeek/hackheroes_temp_server) development


###  [Demo](https://trace.papiewski.tk)

## Installation

```sh
npm run deploy
```

## Usage

```sh
npm start
```

## Run tests

```sh
npm test
```

***
## Documentation 

### Routes

  **User related**
  
   * #### `POST /user/login`
  
      `googleIdToken` needed as a value in JSON body. 
      
      Automatically fetches user's e-mail. Creates a new user if needed
   
   * #### `GET /user/:userId` and `DELETE /user/:userId`
   
        Both are self explanatory
   * #### `POST /user/:userId/coordinates`
   
        `coordinates` needed as a value in JSON body.
        
        `set` boolean value optional as a  value in JSON body. 
        
        The endpoint returns an array of matching GUS units from coordinates. 
        Additionally, if `set` flag is true, it sets user's `voivodeshipGusId` to that of given coordinates.
        
   * #### `POST /user/:userId/daily`
   
        `waterConsumption` user's water consumption in liters
        
        `commute` user's today's way of commuting. One of 'eco', 'car', 'bus'. 'eco' is anything emission-free
        
        `plasticWeight` weight of plastic produced by user
        
        If more than one request is made during one day (1:00 - 01:59), each next overwrites the previous.

   * #### `POST /user/:userId/photo DELETE /user/:userId/photo/:photoId`
   
        `photo` attribute is needed. This endpoint is  `multipart` only.
        Adds a photo to user's profile. 
