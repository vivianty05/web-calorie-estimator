# EatSmart: Food Calorie Counter Web App

A web-based application that uses computer vision to detect pre-cooked food ingredients from images and estimate their calorie content. Users can upload images of food ingredients, review detected items, adjust quantities and units, and calculate total calories.

## Table of Content
- [Motivation](#motivation)
- [Features and Demonstration](#features-and-demonstration)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Limitation](#limitation)
- [Areas for Improvement](#areas-for-improvement)
- [Authors](#authors)

## Motivation
Tracking calorie intake manually is often time-consuming and inaccurate, as it requires users to search for ingredients and estimate portions themselves. This project simplifies the process by using computer vision to automatically detect food ingredients from images and calculate their calories. To improve accuracy, the system uses a well-known food database (Edamam API) for reliable nutritional information. The goal is to make calorie tracking faster, more efficient, and more user-friendly. This project is part of an academic computer vision course and aims to demonstrate how computer vision can be applied to a practical real-world problem in health and lifestyle management.

## Features and Demonstration

### How does the web application work?
<p align="center">
  <img src="images/guide1.png" width="800"/>
</p>
<p align="center">
  <img src="images/guide2.png" width="800"/>
</p>

## Tech Stack
![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Edamam](https://img.shields.io/badge/API-Edamam-lightgreen)
![YOLOv8](https://img.shields.io/badge/Model-YOLOv8-orange)
![CVAT](https://img.shields.io/badge/Tool-CVAT-black)

### Frontend
- **React**
  - JavaScript library for building user interfaces with reusable components
  - Used to build interactive pages: Upload, Review Detection, Calculate

### Backend
- **FastAPI**
  - High-performance web framework for Python APIs
  - Used to handle client requests, logic for calorie calculation, and communicate with the database
  - Integrated Edamam API and YOLOv8 prediction responses

### Database & API
- **PostgreSQL**
  - Open-source relational database for storing food entries and ingredient data 
- **Edamam API**
  - External service used to retrieve calorie values based on ingredient, quantity, and unit

### Computer Vision Model
- **YOLOv8**
  - Real-time object detection model used to identify ingredients from uploaded images  
- **CVAT**
  - Annotation tool used to label ingredients and train/refine the YOLOv8 model

## Installation
 push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://mygit.th-deg.de/vy16417/computervision.git
git branch -M main
git push -uf origin main
```

## Limitation

## Areas for Improvement

## Authors
1. Vivian Theodora Yang
2. Isabella Augustine Yang
3. Jabrayil Mirzayev
4. Enis Jaha
