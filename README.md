# Day Logger App - Backend 

## Unit Testing in frontend

`./backend-test/validateEmail.test.js -> returns a boolean whether an email is a valid email or not`

`./backend-test/validatePassword.test.js ->  returns a boolean whether a password is a valid  or not`

After installing jest by doing 
```bash
npm install --save-dev jest
```
run `npm run test` on terminal.

## When create new account (signup)

User can make their own account by clicking create new account.
If there is no issue in their email && password format, they are successfully make their account and back to login page.


## Login 

If password does not match, it shows 'login error' message which means user type invalid email/password


## Deployment (Heroku)
`https://cse316-final-project.herokuapp.com`


## Sample User
### email: `test@gmail.com`
### password: `Password1`

## Setup

Run npm install on both frontend and backend to install all necessary packages. 
In order to run on localhost, go to package.json in the frontend and change the proxy url to
`http://localhost:5000` then run npx nodemon server.js.

In order to run on heroku, after any change to the file, do git add . then git commit -m "commit"
then git push heroku master. It will redeploy the code and the code can be accessed through
`https://cse316-final-project.herokuapp.com`
