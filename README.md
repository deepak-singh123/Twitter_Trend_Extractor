How to run
install web driver as per browser version
install necessary nodemodules

    "axios": "^1.7.9",
 
    "chromedriver": "^131.0.4",
    
    "cors": "^2.8.5",
    
    "dotenv": "^16.4.7",
    
    "express": "^4.21.2",
    
    "http": "^0.0.1-security",
    
    "http-proxy-agent": "^7.0.2",
    
    "https": "^1.0.0",
    
    "https-proxy-agent": "^7.0.6",
    
    "mongoose": "^8.9.2",
    
    "nodemon": "^3.1.9",
    
    "proxy-agent": "^6.5.0",
    
    "puppeteer": "^23.11.1",
    
    "selenium-webdriver": "^4.27.0"
    
add .env file 
with following credentials
MONGO_URI= //database url (Mongodb)

PORT= 3001 //exmple

PROXY = //By creating account on Proxymesh

EMAIL = // twitter email

PASSWORD =// twitter password

ACCOUNT_USERNAME= // twitter username

PROXY_USERNAME = //proxymesh username

PROXY_PASSWORD = //proxymesh password

AND FINALLY IN index.html     IN THIS LINE            
"const response = await fetch('http://localhost:<PORT>/run_script');"IN PLACE OF PORT ADD YOUR PORT NUMBER AND RUN SERVER BY GOING INTO BACKEND FOLDER 

AND TYPE NODE SERVER.JS AND IN FRONTEND RUN THE HTML FILE




