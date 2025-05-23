# CSCI 499-01  

# 🥄 Spooons - Mental Health Journaling App

## 🧠 Project Overview

**Spooons** is a mental health-focused journaling web application designed to help users track their emotional well-being over time. The app allows users to submit journal entries and uses AI to provide meaningful feedback. By analyzing entries through the **Gemini API**, the app identifies emotional stressors and offers tailored resources to support mental wellness.

This project was created as part of a senior group capstone project, with a focus on leveraging modern technology to promote mental health awareness and provide accessible, data-informed emotional support.

---

## 🛠 Technologies Used

- **Frontend:** React.js, HTML, CSS  
- **Backend:** Django (Python), Django REST Framework  
- **Database:** PostgreSQL  
- **AI Integration:** Gemini API  
- **Authentication:** JWT-based user authentication  
- **Other Tools:** Git, GitHub, Axios  

---

## 🚀 Live Application

[🔗 Click here to view the live app](https://spooons.vercel.app/)  

---

## 👥 Team Members

- **Prasanga Tiwari** 
- **Malak S.**
- **Raitah Jinnat** 
- **Ryan Montoyo**    

---

## 📝 Development Notes

### What We Learned

- How to build a full-stack application using Django and React from the ground up  
- API authentication and secure data flow between frontend and backend  
- Leveraging AI APIs to perform real-time text analysis  
- Working with natural language outputs to classify emotional data and return meaningful results  

### AI Tools Used

- **ChatGPT:** Assisted with debugging and code planning  
- **Gemini API:** Used to analyze journal entries, detect stressors, and return resource suggestions  

---

## 💬 Final Thoughts

Spoons was created with the mission of making mental health support more accessible. By blending journaling, a proven therapeutic technique—with AI insights, we hope this app empowers users to better understand their emotions and take action toward self-care.


## 💻 Local Setup Instructions

## Backend with Django
The first thing you need to do is set up a virtual enivorment. The commands should be run in the root directory. Also, note that I use python3/pip3 for the commands, but if they don't work, use python/pip. Here are the commands:
``` bash
python3 -m venv venv
```
Then:
```bash
source venv/bin/activate  # Mac/Linux
```
Or:
```bash
venv\Scripts\activate  # Windows
```
The purpose of this is to create an isolated enviroment in our computer, where all the correct dependencies of the correction versions are installed. After this, every line in the commandline should start with "(venv)". If at anymore point, you dont see it and you need to run the backend, just go to the root directory and type the second command from above. Anyway, after the two commands, use another command to install the dependencies, which are in the requirements.txt file. 
``` bash
pip3 install -r requirements.txt
```
This will download all the requirements needed for the backend to work. The virtual enviroment is just for Python, since the dependencies for React don't require a virtual enviroment. 
Then, go to the backend directory, which is the directory with manage.py, and run:
``` bash
python3 manage.py runserver
```
If there are no errors, you should get this link: (http://127.0.0.1:8000). If you click it, you will be taken to a webpage that has a 404 error. However, if you go to (http://127.0.0.1:8000/api/hello/), you will see this:
<img width="1346" alt="Screenshot 2025-02-21 at 12 27 27 AM" src="https://github.com/user-attachments/assets/d2f5b2b8-db9f-4c92-9022-d46058d2ec5b" />
If you do, great! Let's move on to the next. 


## Frontend with React
Clear the terminal and go to the frontend directory and enter the command:
```bash
npm install
```
This should install the dependencies for React.

## Running both of them together
Firstly, you need to create a Django server by going to the backend directory with the "manage.py" file. Once you are in that directory, enter:
``` bash
python3 manage.py runserver
```
If that doesn't work, make sure you are in the virtual enviroment by entering the second command from the first section. 
Open a new terminal without closing the one where the previous command was entered, and go to the frontend directory and from there, enter:
```bash
npm start
```
You will receive a link. If you open the link, you will see:
<img width="719" alt="Screenshot 2025-02-21 at 1 01 30 AM" src="https://github.com/user-attachments/assets/cd8abb6e-e285-49c6-b88c-b41b6da61e85" />

That's it!








