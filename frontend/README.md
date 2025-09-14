# Daily Prompt Notes App

## A full-stack web application where users can:

- **Register / log in** with JSON Web Tokens (JWT)
- **View and answer a daily prompt** (rotates automatically each day)
- **Create, like, and comment on notes**
- **Browse all users’ notes** in a shared feed

## Technology Stack

**Frontend:**
- React Router for client-side navigation
- Axios for API requests
- Custom CSS for styling (responsive design)

**Backend:**
- Django with Django REST Framework
- SQLite database
- JWT authentication 
- CORS headers for cross-origin requests


## Setup Instructions

### 1. Clone the Repository
```
git clone <repository-url>
cd <repository-name>
``` 
### 2. Backend Setup
```
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```
cd frontend
npm install
npm run dev
```

### 4. Using Application
1. Open your web browser and go to: http://localhost:5173
2. Register a new account:
   - Click "Register"
   - Enter a username and password
3. Login with your credentials
4. Start using the app!



