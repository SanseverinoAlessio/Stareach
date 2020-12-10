# Stareach configuration

## Env variables

### Create an .env file, and add these variables

Specify the base url:
* app.baseURL = for local use "http://localhost:8080"

Specify the type of the environment:
* CI_ENVIRONMENT = production || development

For database, you should set these variables:
* database.default.hostname =
* database.default.database =
* database.default.username =
* database.default.password =
* database.default.DBDriver =

For specifying json web token key, you should use:
* tokenKey =


And is also important for cors, specify the angular host with this:
* angularHost = for local use "http://localhost:4200"

# How to start the server

For starting the server, you can use this command:
"php spark serve" in the server folder.

Your php version, must be >= 7.2
