# ecb-exam

This application displays a list of cars retrieved from json files stored in the "examen/data" folder.
Click on any of the records and a modal window will be presented so you can specify a person that will give maintenance to the car and an estimated date, after click "Save changes" the car will be marked as "In maintenance", the background color will change and a button will be displayed so you can unmark the car.
Changes made will be stored in the same server json files

The nodejs application supports next methods:
- GET: Returns a list of cars for maintenance
- POST: Modifies one record with "id" specified via string parameter, accepts a car object

Car json example:
```
{
  "person":"John Doe",
  "description":"oil change ",
  "make":" Volkswaguen",
  "model":"Tiguan",
  "estimatedate":"2022/01/06",
  "id":3343,
  "km":13500,
  "image":"images/tiguan.jpg",
  "inMaintenance":true
}
```

# Steps to run the application
After clonning the repository, install packages for nodejs and react application:
```
cd ecb-exam
npm install
cd exam
npm install
```
Start the nodejs server by running the next command:
```
cd ecb-exam
node server/index.js
```

Start the react application by running the next command(in a new console):
```
cd ecb-exam/exam
nom start
```
