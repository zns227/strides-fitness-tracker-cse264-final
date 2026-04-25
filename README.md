# strides-fitness-tracker-cse264-final

## Project Overview

Welcome to Strides: Fitness Tracker! With this web application, users can log workouts, track their weekly activity, receive workout suggestions, and export their workout history with an expert account.

## Team Members & Roles

Mary Eisenhard: Full Stack Developer - login page, register page, user profile, feedback form, exporting workout functionality

Zainab Spall: Full Stack Developer - backend routes, dashboard functionality, activity and achievement charts, about page

## Application Features

### User Accounts & Roles:

New users can register with an accounton Strides with their name, username, email, and password as either a beginner or an expert.

* Beginners: can see exercise instructions when logging workouts
* Experts: can export their previous workout data

### Database:

Strides uses MongoDB with Mongoose for data persistence. User accounts, workout sessions, and feedback is stored in a MongoDB database. Workout documents store each exercise as a subdocument with fields for name, body part, sets, and reps.

### Interactive UI:

The Strides dashbpoard features an interactive bar chart that shows the number of workouts done per week. The chart is color coded by the body parts targeted and the legend can be clicked to hide and unhide certain body parts. Their is also an achievements tracker that triggers a confetti animation when 5, 10, or 50 workouts are logged. There is also a daily motivational quote that rotates through quotes throughout the week.

### New Library or Framework:

Chart.js via react-chartjs-2 powers the weekly activity visualization, and react-confetti is used for achievement milestone celebrations.

### Internal REST API:

Strides exposes a REST API built with Express.js with the following route groups:

* /api/auth — register, login, logout, and fetch the current user
* /api/workouts — create and retrieve a user's workout sessions
* /api/dashboard — fetch stats, weekly activity data, workout summary, and exercise suggestions

All protected routes use JWT authentication via Bearer tokens.

### External REST API:

Strides integrates with the ExerciseDB API (https://oss.exercisedb.dev/docs#description/introduction) to power the exercise picker when logging workouts and the suggestions feature. Each exercise includes a name, body part, animated GIF demonstration, and step-by-step instructions pulled from the API.

## Installation & Setup Instructions (How to install, run, and configure the application)

* Install:
* Run:
* Configure:

## API Keys & Database Setup 

* Connect to project with MongoDB Driver and copy connection string
* Generate a jwt secret and copy

* In the .env file in server folder:

```
MONGO_URI=
PORT=3000
JWT_SECRET=
```