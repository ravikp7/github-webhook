## Github Webhook
---
This express server can be used to run a script for deployment on your server triggered by [Github Webhooks](https://developer.github.com/webhooks/) when code is merged or pushed to master branch.

### Usage
- All enviroment variables need to be specefied in `.env` in root of this directory.
- Example format for `.env` file
```
GITHUB_WEBHOOK_SECRET=RBUNEsjE4njsT6JWBVoqrKxC6OZE9VdMnwFq
PORT=4000
ROUTE=/github-master-deploy
EXEC_COMMAND=~/deploy.sh
``` 
- `npm i` & `npm start` to run the server.




