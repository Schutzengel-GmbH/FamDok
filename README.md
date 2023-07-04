## To add a first admin user to the database

    $ curl --location --request POST 'http://localhost:3567/recipe/signup' --header 'rid: emailpassword' --header 'api-key: <API KEY>' --header 'Content-Type: application/json' --data-raw '{"email": "<Email>","password": "password"}'

    $ curl --location --request PUT 'http://localhost:3567/recipe/role' --header 'api-key: <API KEY>' --header 'Content-Type: application/json; charset=utf-8' --data-raw '{"role": "admin", "permissions": []}'

    $ curl --location --request PUT 'http://localhost:3567/recipe/user/role' --header 'api-key: <API KEY>' --header 'Content-Type: application/json; charset=utf-8' --data-raw '{ "userId": "<USER ID> see dashboard", "role": "admin"}'

## Add a user to the user management dashboard

    $ curl --location --request POST 'http://localhost:3567/recipe/dashboard/user' --header 'rid: dashboard' --header 'api-key: <YOUR-API-KEY>' --header 'Content-Type: application/json' --data-raw '{"email": "<YOUR_EMAIL>","password": "<YOUR_PASSWORD>"}'

Login and access /api/user/createAdminUser to create an admin user.
