# NgPwa

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## About PWA.
Progressive Web App is a concept of web development where web apps work like Mobile app.

## Profits
Cost saving for owner(no need to build mobile app and web app)
No need to develop separate mobile app for any website
From a user perspective there is no need to install apk.
When an android/app releases a new update then we have to update from the play store but in PWA we don't have to update manually when an update available PWA automatically updates in the background.

## Limitations.
Only HTML support devices  can use PWA.
No app store or play store for PWA.
Just a web app, and I can't connect with native apps.
For eg. (can’t) login with social media apps(fb, twitter etc). In a web app when we click on login with fb and then redirect to installed facebook app and then get a login token from fb apps and you can login in your web app..but in PWA you can’t do this.

## How PWA works
Using HTML service workers.
Service workers intelligent catching (first time take time to load then download catch site in your local storage and then load from catch so we can load offline too)

## STEPS ANGULAR PWA
1) Create an Angular application
2) add @angular/pwa package
3) Understand the files added/modified by @angular/pwa package
--> It adds different png files for different splash images for various resolutions icon-128x128.png, icon-144x144.png, icon-152x152.png, icon-192x192.png, icon-384x384.png, icon-512x512.png. Additionally, it adds ngsw-config.json and manifest.webmanifest for configuration purposes. Also, it modifies angular.json, package.json, index.html and app.module.ts .

--- Ngsw-config.json ---

It’s a configuration file in JSON format. Mainly this file is responsible for the generation of ngsw-worker.js (serviceworker.js). You don’t have to write code for that. Just set a certain configuration and you’re done. Ultimately this ngsw-worker.js helps to caches resources/assets with a specific caching strategy

 --- Manifest.webmanifest ---

Primarily, it consists of how the PWA application will look when it opens up. Here you can set options like splash screen icon, background color, display, etc.
Angular.json
Added src/manifest.webmanifest file under assets, so that it will be served with the site. That links ngswConfigPath and serviceWorker enabling the production configuration in build schematics.
	
 --- App.module.ts ----
“app.module.ts is used to import theServiceWorkerModule for registering ngsw-config.js (only for production mode).
 
## Run the application locally

A PWA only runs on https and localhost environments. 
The Angular CLI is limited because the service worker doesn’t work with the ng serve command. You have to create a build and host it separately, perhaps using http-server
To see a PWA in action, follow the below steps.
Run ng build --prod command. It will create files under dist/angular-pwa folder.
Navigate to that folder using cd dist/angular-pwa
Run http-server command (npm i -g http-server)
Open

We can create a script to shorten this process. Open a terminal and run npm run start-pwa command. That’s it!
"start-pwa": "ng build --prod && http-server -p 8080 -c-1 dist/ng-pwa"
 
## Deploy a PWA to production
create a prod build using ng build --prod and then deploy that distribution on the cloud.




## Push Notification - 28/12/2021

reference link -  https://medium.com/mighty-ghost-hack/angular-8-firebase-cloud-messaging-push-notifications-cc80d9b36f82