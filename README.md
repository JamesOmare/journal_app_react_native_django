# Journal Test Application

This project is a simple journal mobile built using reactnative using expo and for the backend using Python and Django Rest Framework. The project is a simple journal app that allows users to create, read, update and delete journal entries, get a summary of their entries. The project also uses jwt tokens for registration and authentication.

## Table of Contents

- [Getting Started](#getting-started)
    - [Local Development](#local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Features](#features)
- [License](#license)

## Getting Started


### Local Development
Before you begin, make sure you have the following installed on your system:

- Node 14 or higher
- Python 3.6 or higher
- pip (Python package manager)
- Virtual environment (optional but recommended) 
- postgres database

### Prerequisites

Knowledge And/Or Curiosity in React Native and Python.
A postgres database setup.

### Installation

Provide step-by-step instructions on how to install and set up your project in a linux/mac-os setup.

```bash
# Clone the repository
git clone https://github.com/JamesOmare/journal_app_react_native_django.git

# Change into the project directory
cd journal_app_react_native_django

# Move into the backend folder and Create a virtual environment
cd backend
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Make and run migrations
python manage.py makemigrations
python manage.py migrate


# Run the development server
python manage.py runserver


# In some cases the development server port usually localhost:8000 might have issues connecting with react native such as using mobile phones, emulators can use the localhost api, you can use ngrok to create a tunnel to your localhost

# Install ngrok
- Ngrok can be installed "https://ngrok.com/"
- Or you can install it using npm
- npm install -g ngrok

# Create a tunnel to your localhost
- ngrok http 8000

# Copy the forwarding url and replace the localhost:8000 in the api calls in the frontend with the ngrok url
- e.g http://localhost:8000/api/v1/journal/entries/ will be replaced with http://<ngrok_url>/api/v1/journal/entries/

For the mobile app:
# Move into the mobile folder
cd mobile

# Install dependencies
npm install

# Start the expo server
npm start

# Scan the QR code with your phone to view the app on your phone
# Ensure you have the expo app installed on your phone
# You can also run the app on an emulator

```


## Configuration

Change the {your-ngrok-url} in the mobile settings to your ngrok url
In the backed, go to settings and add your postgres configuration from line 81-90


## Features

These are the features available in the application:
### User Management
User registration and authentication based on JWT.
Profile management.
### Journal Entry Management
CRUD operations for journal entries.
Categorization of entries.
### Data Summary
Endpoints to fetch summary data for given periods.
### Security
All endpoints are secure and accessible only by authenticated users.




# License

Free License.
