#!/bin/bash
source .env

echo "creating a user in the app with the admin credentials..."
curl --location --request POST "http://localhost:3567/recipe/signup" --header "rid: emailpassword" --header "api-key: ${API_KEY}" --header "Content-Type: application/json" --data-raw "{\"email\": \"${ADMIN_EMAIL}\",\"password\": \"${ADMIN_PASSWORD}\"}"

echo "creating admin role in supertokens..."
curl --location --request PUT "http://localhost:3567/recipe/role" --header "api-key: ${API_KEY}" --header "Content-Type: application/json; charset=utf-8" --data-raw "{"role": "admin", "permissions": []}"

echo "getting user id..."
json=`curl --location --request GET "http://localhost:3567/recipe/user?email=${ADMIN_EMAIL}" --header "api-key: ${API_KEY}" --header "rid: emailpassword"`

id=`echo $json | sed -nE 's/.*"id":"([^\"]*)",".*/\1/p'`

echo "giving user admin role in supertokens..."
curl --location --request PUT "http://localhost:3567/recipe/user/role" --header "api-key: ${API_KEY}" --header "Content-Type: application/json; charset=utf-8" --data-raw "{ \"userId\": \"${id}\", \"role\": \"admin\"}"

echo "please log into the app with your admin credentials and visit ${NEXT_PUBLIC_APP_URL}/api/user/createAdminUser to finalize your admin user"