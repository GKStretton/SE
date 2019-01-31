## Guide to setting up your work environment for the website  
Go to git and create a fork of the main repository  
Copy your fork's url  
Clone fork locally, wherever you want  
Go to main repository and copy url  
run 'git remote add upstream [paste url]'  
run 'git remote -v' and check your urls are correct  
follow [Site Setup] instructions to get the website running with node  
  
## Commit process  
'git fetch upstream'  
'git merge upstream/master'  
you may have merge conflicts - resolve them as git instructs  
'git add .'  
'git commit -m "add whatever commit message is relevent you your additions here"'  
'git push origin master'  
go the the github repository online  
create new pull request  
select your fork  
create pull request  
type in the chat that you have created a pull request so someone else can check it for conficts and then merge it into the main branch  

## [Site Setup]

Install dependencies with npm install.

How to authenticate google api stuff:

Login to the group gmail account and find the service account created for the gmail account in the api dashboard.
Make a new key for the service account, click save as json and store it in a new folder 'tokens' as 'private-key.json'.  
Add the service account email to any calendars you want to use. (go to settings for the individual calendar)

How to authenticate paypal stuff:

Inside the tokens folder, make a file called paypalId.json with the following structure:

{
"clientId":"clientId_on_discord"
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


### MONGO SETUP

##### TODO: check security on this if they actually use it because this was done quickly

1. generate ssh keypair

2. get someone to add your public key to the mongo server

3. Bind the dig ocean server locally

```ssh -L 4321:localhost:27017 root@206.189.245.219 -f -N```

if it stops working (hangs on npm start), restart the ssh -L (ps aux | grep 4321, kill the pids, run ^ again)

If it's really broken check that mongod is running on 206.18.... , if not `mongod --fork --logpath ~/log/mongodb.log`
