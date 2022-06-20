# Assignment implementation by Alisher Aliev for Virta Ltd.
This an implementation of the assignment that consists of a NodeJS API service
and a MySQL database service

## **Start up**
There are several options to start the application
### **Option 1: Using Docker**
If you have `Docker` and `Docker-Compose` installed on your device,
then the simpliest form to start the project is to execute the following terminal command
from the project's root directory

```
docker-compose up -d
```
Using this command the API-service will listen on port `3001`.
<br>
MySQL container will have host port open on `3307`.
<br>
`mysql/` directory contains SQL-files for creating tables and populating them with some initial data, so that you can play around with some data straight away
<br>
The API-service on NodeJS uses `ts-node-dev` for auto-reloading in TypeScript projects. `docker-compose.yml` file was actually configured to share the volumes with `src/` sirectory. That is, if you do changes to the files in that directory, the app running inside the container will detect the changes and recompile 👍

### **Option 2: Fully local run**
Make sure that you have `node` installed, as well as a `MySQL` server!

Open terminal in the root of the project's directory and execute the following commands:
```
npm install
```
then
```
npm run dev
```
You can use the SQL-files in the `mysql/` directory to create tables and populate them with some initial data.

**Important**
<br>
The project's root directory has file `.env` that is used to specify ports for the application to run on
and data for connecting to your local `MySQL` server. If any of the data is different, then modify values in that file!

### **Option 3: Connecting to Docker database**
You can also have your locally run NodeJS app being connected to the MySQL database in Docker container.
<br>
Execute steps of **Option 1** and **Option 2**. But make sure that `MYSQL_PORT` inside the `.env` file has correct value!
<br>
Here, Dockerized MySQL instance is exposing port `3307` to the host by default!.

## **Building the project**
Open terminal in the project's root directory and run the follwoing command:
```
npm run build
```
This will call TypeScript to transpile the `.ts` files to `.js` and build the project. 
<br>
Built files will be visible in the `build/` directory.
<br>
To run the built project execute the following command:
```
npm run prod
```
You can also built and start the project using Docker-Compose. For that execute the following command:
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## **Endpoints**

### **Company endpoints**
API-endpoints for `Company` entity
- `POST /company/` - to create a company;
- `GET /company/all` - to get all companies;
- `GET /company/:id` - to get a company by a given numeric ID;
- `PUT /company/` - to update an existing company;
- `POST /company/:id/add-child` - to register a relationship between two unrelated existing companies;
- `POST /company/:id/remove-child` - to remove a relationship between two parent-child existing companies;
- `DELETE /company/:id` - to delete an existing company;
<br>
<br>
**Special endpoint**
- `GET /company/:id/station-data` - to obtain station data (stationId,
stationName, maxPower) from an existing company identified by the supplied ID and all its children;

### **Station endpoints**
API-endpoints for `Station` entity
- `POST /station/` - to create a station;
- `GET /station/all` - to get all stations;
- `GET /station/:id` - to get a station by a given numeric ID;
- `PUT /station/` - to update an existing station;
- `DELETE /station/:id` - to delete an existing station;

### **Station-Type endpoints**
API-endpoints for `Station-Type` entity
- `POST /station-type/` - to create a station-type;
- `GET /station-type/all` - to get all station-types;
- `GET /station-type/:id` - to get a station-type by a given numeric ID;
- `PUT /station-type/` - to update an existing station-type;
- `DELETE /station-type/:id` - to delete an existing station-type;