#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

var args = minimist(process.argv.slice(2));

const timezone = moment.tz.guess()

const help = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1. 
-j            Echo pretty JSON from open-meteo API and exit.`; 

if (args.h || args.help) { 
    console.log(help)
    process.exit(0.0)
}

const latitude = args.n || args.s * -1 
const longitude = args.e || args.w * -1 


const openMeteo = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=sunrise,sunset,precipitation_hours&timezone=' + timezone)

const finMeteo = await openMeteo.json()

if (args.j) { 
    console.log(finMeteo)
    process.exit(0)
}

let days; 
if (args.d == null) {days = 1}
else {days = args.d}

let weather = "The sun will rise at "
weather += finMeteo.daily.sunrise[days]
weather += " and set at "
weather += finMeteo.daily.sunset[days]

if (days > 1) { 
    weather += " in " + days + " days." 
}
else if (days == 0){ 
    weather += " today. "
}
else { weather += " tomorrow. "}

if (finMeteo.daily.precipitation_hours[days] != 0) {weather += "Be sure to pack an umbrella!"}
else {weather += "Thankfully, it looks like there won't be rain. "}
console.log(weather)
