# Fork our Github repository
Create a new repository on Github. Make sure not to check `initialize the repository with a README`.
<br/>![](images/github_1.png)


Make a clone of the repository that you just created. 

Now naviagate to the directory you just created and add a new remote “upstream” pointing at the original repo. The purpose of adding new remote is to have access to any changes (without affecting our repo) that is made in the future. The command to add this remote is: 

`git remote add upstream slackbot-repo-link`

Now pull all the files from original repo to the fork-repo that we just created.  git pull upstream master

Finally, push all the changes to your new repo’s master.
git push origin master


# Set up a Heroku app

# Set up a MongoDB server


# Create a Slack application

Go to [https://api.slack.com/apps](https://api.slack.com/apps) and log into your Slack account if you are not already logged in. If you get redirected to your workspace after logging in, go back to [https://api.slack.com/apps](https://api.slack.com/apps).

Click on “Create an App”, or if you already have some apps created, click on “Create New App” at the top-right of the page. In the pop-up box, enter a name for your bot in “App Name” and select the workspace that you would like to deploy the bot to. Click “Create App” afterwards. You should now be redirected to your app’s “Basic Information” page.

# Enter environment variables into the `.env` file

We will now make a `.env` file. Make a copy of our `.env.SAMPLE` file by running `cp .env.SAMPLE .env`. Make sure your copied file is named `.env` (without the `.SAMPLE`). Your `.env` file should look like this now:

```
# Fill in the below values by following the instructions in docs/DEPLOY.md
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=
SLACK_AUTH_TOKEN=
MONGODB_URI=
```

Go back to your Slack app’s “Basic Information” page and scroll down to the “App Credentials” section. There, you will find values for Client ID, Client Secret, and Verification Token. Copy and paste these values into your `.env` file in the variables `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_VERIFICATION_TOKEN` respectively. Make sure that there are no spaces between the `=`'s and the values that you pasted.

Next, scroll back up and in the left column of the page, go to the "OAuth & Permissions" page. You should now see the “Bot User OAuth Access Token”. Copy this value into the `SLACK_AUTH_TOKEN` variable, again making sure that there is no space after the `=`.

For the `MONGODB_URI` variable, please follow this guide: [https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/](https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/).

Your `.env` file should now look something like this (these values are fake example values).
```
# Fill in the below values by following the instructions in docs/DEPLOY.md
SLACK_CLIENT_ID=109232264164.1098345726706
SLACK_CLIENT_SECRET=a7491bc91738d97138b72fd6cb
SLACK_VERIFICATION_TOKEN=VisWjg92ksmOksoAi3kf38
SLACK_AUTH_TOKEN=xoxb-1093412282664-108265773406-j47ayaya12k25SMOrcLso4ai3
MONGODB_URI=mongodb+srv://adminuser:dQw4w9WgXcQ@your-bot-name-7dfa.mongodb.net/test?retryWrites=true&w=majority
```

# Enter environment variables into Heroku

We can now set your Heroku config variables. Go to your Heroku page, and in Settings under Config Vars, paste the variable name and variable values from your `.env` file. 

In addition to the variables from your `.env` file, you should also add the following two config variables to Heroku, which will not be necessary to add into your `.env` file:
| Variable Name        | Variable Value                                             | Description            
| -------------------- | ---------------------------------------------------------- | ----------------------------|
| `SLACK_REDIRECT_URI` | `https://your-heroku-app-name.herokuapp.com/api/authorize` | `your-heroku-app-name` is your Heroku app name.            |
| `TZ`                 | `America/Los_Angeles`                                      | This variable is a Heroku-specific variable that controls time zones.         |

Your config variables should now look like this:
![Image of example config variables](images/heroku-config-vars-example.png)

# Insert the following commands into your app

Go to the Slack Applications link given [here](https://api.slack.com/apps). Then, click on your app.
Now, you should be at the "Basic Information" page.
![](images/commandHelp1.png)
<br/>From here, click on "Add features and functionality".
![](images/commandHelp2.png)
<br/>Then, click on "Slash Commands".
![](images/commandHelp3.png)
<br/>Now, you can make the commands. To create a command, go to "Create New Command" and input
the the following:

| Command   | Request URL (Example URLs)         | Short Description            | Usage Hint                |
| --------- | ---------------------------------- | ---------------------------- | ------------------------- |
| /appraise | cgaucho.herokuapp.com/api/appraise | Shows reputation             | [User]                    |
| /hello    | cgaucho.herokuapp.com/api/hello    | Messages hello back          |                           |
| /praise   | cgaucho.herokuapp.com/api/praise   | Gives people 1 rep           | [User]                    |
| /rankings | cgaucho.herokuapp.com/api/rankings | Shows most reputable         |                           |
| /schedule | cgaucho.herokuapp.com/api/schedule | Sends messages at given time | [Create/Delete/List/Help] |

The short description and usage hint doesn't impact how the command works, so feel free to skip that step.

# Add the following Redirect URLs and Bot Token Scopes in your Slack application

Return to the home page. Now, go to the "OAuth & Permissions" tab.
<br/>![](images/scopeHelp1.png)

<br/>Click on "Add New Redirect URL" and your redirect URL. An example of what the website should look like is cgaucho.herokuapp.com/api/authorize
<br/>![](images/scopeHelp3.png)

<br/> Then, scroll down until you get to the box named "Scopes". Click on OAuth Scopes and add the scopes in the following image:
<br/>![](images/scopeHelp2.png)
