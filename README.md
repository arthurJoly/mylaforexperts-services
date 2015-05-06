# mylaforexperts-services

Webservices REST for the application Myla For Experts

This server is deployed on Heroku 
and the web services can be access with https://mylaforexperts-services.herokuapp.com

# Get ready as a contributor

Install heroku toolbelt from  https://toolbelt.herokuapp.com 

Log in using 
```
heroku login
```

## Clone

```
heroku keys:add
heroku git:clone --app <appName>
```

## Commit all changes

```
git add .
git commit -a -m "Description of the changes I made"
git push heroku master
git push github master
```

## Running Locally

```
npm install
npm start


