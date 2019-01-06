Nodejs app (mainly back end stuff right now):

Install dependencies with npm install.

How to authenticate google api stuff:

Login to the group gmail account and find the service account created for the gmail account in the api dashboard.
Make a new key for the service account, click save as json and store it in a new folder 'tokens' as 'private-key.json'.  
Add the service account email to any calendars you want to use. (go to settings for the individual calendar)

How to authenticate paypal stuff:

Inside the tokens folder, make a file called paypalId.json with the following structure:

{
"clientId":"[clientId_on_discord]"
}

And when testing the paypal transaction you can use the sandbox account login on discord

How to authenticate email:
Add the file emailCredentials.json to tokens with structure:
{
"username":"ourgroupemail",
"password":"ourgrouppassword"
}

Using the form:

Enter a start and end time in the format specified, as well as a name for the event:
If the time slot is valid, the paypal button will pop up.
Pay using the sandbox account (it will transfer £0.01 of fake money)
The page should refresh and the event should be visible with your name.


