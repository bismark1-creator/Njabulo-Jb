const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTVBHOUNaM2VLTWVGbmk2RDdKeko2ZXdZZHhZSmJhRWFwM3R3RE1vOEFsaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNDZOcmNBaTlGNFdoR0p2aExqSmpqbWc3UVRFbUtLb01KRlUxY3dUVk1qbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDRlBwWVFYdWJITks5NGU5VDgveVVmUE9Fc2RpS2NXWHBLQUFwRWIyYVZrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWbXpOWkp0YnFzbjErZUFnZkFhNmMxOGxST1Z4cWU1NUhPTGRFdTlsRTJvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndIYXhOR3NIWnVnbWplVHptdmlpa2RMVXIvZlRPa0pLU1IrME5HeElpRW89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhSOE82NHgvTnZNcHgxWmRrdmFkRy9UTUpDYmZuNjY2L0c0RmRUdVJuSFE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSUhWbmZlVW9vaXdYNFFaUmtHUkFEVDE0cTdjRmxUN2RraFdVTUVnQzZYZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicGlBcDNjSGo4THJ6YTVNdktYYjFNUmhxRnNjemRQZk9Mb21ibmV1QWpRMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNtZDBUelFmNFRnUFRIUmdZU2dzOWkrMkhmQmpDM0VYMEFKczd4anlTWjhubEIrcWNrNTkrKzhxTDB1clMwZVI0b01NZTZjUWZJZ0p2SEdBQU1ub0FRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM3LCJhZHZTZWNyZXRLZXkiOiJIY2E5STlnNE8xYVRQR0hwZmhwRlhaZTZRMnBBMjNWanJoMFladytyQytnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJVVTRPR3QydFFNZXhjSWE3bW5QTjBnIiwicGhvbmVJZCI6IjA4NzBkMTM2LTg2ZTYtNDczNC1iOTg1LTVjNjUzN2QwNjZhYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJTOHJwOUFnK0ZrYk5GMkVOVWs1Z05Jb0h4WkE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSjZvYTlWVjV5S3hBR0UyaGNpMWg2end4YUE4PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik1SUVlQU1I4IiwibWUiOnsiaWQiOiIyMzM1MzE1MTA1OTc6OUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTnZ3dTlBREVQRDYrTHdHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMFg2QVJHVkM1b2V2ZWtqZnFta2dKVUJsbDc4RHphbWR2MTNucEViY1FpWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNjczc0gyNVZWVEdVNWdTYzJUbVliUjBwbUpKeDRHSkNJekFLS0tmNzRueXBlOXNlamFYZ1prWGRGMDlKbHlrdFNrZkNxMnhmcHJ5cVFhK2oxR1FVQXc9PSIsImRldmljZVNpZ25hdHVyZSI6Im9pMzkxWUZ4Mkp6WmNOOWR1VzNLQnlnQ0ltNkdOL2M1OGxIRHUwZkg0REVFQWJBc0VkdTRCR1Y5KzJuY3pYWnRVVEFTMFAzVXN4cUhxbTRmTGdSUEJRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjMzNTMxNTEwNTk3OjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZEYrZ0VSbFF1YUhyM3BJMzZwcElDVkFaWmUvQTgycG5iOWQ1NlJHM0VJbSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczODQyMzY3OH0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Bismark",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "233531510597",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
