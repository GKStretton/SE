Nodejs app (mainly back end stuff right now):

Install dependencies with npm install.

How to authenticate google api stuff:

Login to the group gmail account and find the service account created for the gmail account in the api dashboard.
Download the service account json private data and store it in the directory as 'private-key.json'.  
Add the service account email to any calendars you want to use. (go to settings for the individual calendar)

How to authenticate paypal stuff:

At the moment I am using paypal sandbox accounts for mock payment, but they are linked to an api app which is created from my personal account, the app needs to be created again from a business acc.
