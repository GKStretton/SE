Nodejs app (mainly back end stuff right now):

Install dependencies with npm install.

How to authenticate google api stuff:

Login to the group gmail account and find the service account created for the gmail account in the api dashboard.
Download the service account json private data and store it in a new folder 'tokens' as 'private-key.json'.  
Add the service account email to any calendars you want to use. (go to settings for the individual calendar)

How to authenticate paypal stuff:

Inside the tokens folder, make a file called paypalId.json with the following structure:

{
"clientId":"[clientId_on_discord]"
}

And when testing the paypal transaction you can use the sandbox account login on discord
