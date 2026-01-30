DevTinder APIs

POST /signup
POST /login
POST /logout

GET /profile/view
PATCH /profile/edit
PATCH /profile/password

POST /request/send/intereted/:userId
POST /request/send/ignored/:userId

POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

GET /connections
GET /requests/received
GET /feed - Gets you the profiles fo other users on platform

Status: ignore, interested, accepted, rejected