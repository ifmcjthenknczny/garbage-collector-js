# GarbageCollector.js
> Responsive webpage for user item and collection management.
Deployed on https://garbagecollector-itransition.herokuapp.com/.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info
This responsive webpage purpose is to allow users to store their favourite items in created collections. Build with React.js on frontend and Node.js on backend. It implements many features listed below. Try it yourself!

## Technologies
* HTML5
* Sass & CSS3
* Bootstrap 5
* Javascript ES2022
* React.js
* Node.js (with Mongoose, Express, Cors, dotenv packages)
* MongoDB

## Setup
No setup needed just run the deployed page. Just make sure you run proper browser with support for newer language features. For Android, Google Chrome is recommended.

## Features
* Authentication, registering, logout
* Admin, collection and user panel with CRUD activities
* User, collection and item pages
* Light / dark mode
* Two language support, translated on click without reloading
* Tags autocompletion dropdown menu
* Adding comments for items
* Adding / removing likes for items
* Latest added items, Biggest collections, Tagcloud
* Image upload for collection
* Adding own string fields for items
* Responsiveness
* Sorting and filtering though user items
* Markdown formatting support for collection description
* Full-text search through Collections, Comments and Items & search result page
* Clear navigation through page
* Loading spinners
* Subtle, yet pretty Error Page

To do:
* Some code style improvement and unification (destructurized LangContext, ThemeContext used only when necessary, and search backend, button component, nanoid for all maps, props cleanup and passed in destructurizable form, classes props)
* Debounce of input values
* Separate file for globals: constants, links, arrays etc. and more helpers function
* Dark mode colors diversity
* Interactive tags dropdown

## Status
Project is: _finished_

## Inspiration
It is final project of ITransition Intern Front-End Developer training programme.

## Contact
Created purely by Maciej Konieczny.
