# MedTracker — Java Spring Boot + React

## Stack
- Backend: Java 21 + Spring Boot 3.2 + H2 + JWT (port 8080)
- Frontend: React + Vite + Tailwind CSS (port 3000)

## Setup & Run

### 1. Install Maven (if not installed)
Download from https://maven.apache.org/download.cgi
Extract to C:\maven, add C:\maven\bin to PATH

### 2. Build & Start Backend
```
cd medtracker/backend
mvn clean package -DskipTests
java -jar target/medtracker-backend-1.0.0.jar
```

### 3. Start Frontend
```
cd medtracker/frontend
npm install
npm run dev
```

### 4. Open browser
http://localhost:3000

## Login
- Admin: admin@medtracker.com / admin123
- User:  user@medtracker.com / admin123

## H2 Console (dev)
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:medtracker
