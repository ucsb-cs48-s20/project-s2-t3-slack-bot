# Fork our Github repository

Create a fork of our repo by clicking on "Fork" at the top-right of our repo's page: https://github.com/ucsb-cs48-s20/project-s2-t3-slack-bot. Make a local clone of the forked repo using `git clone`.

# Set up a Heroku app

1) Go to https://dashboard.heroku.com/apps. If you are not already logged in, please log in.
2) At the top-right of the page, click on "New" and in the dropdown menu, click "Create new app." Enter a name for your Heroku app and click "Create App." <br/>![](images/github_4.PNG)
3) Go to the Deploy screen of the Heroku Dashboard and connect your forked GitHub repo to the Heroku App. <br/>![](images/github_5.PNG)
4) Before you make your first deployment of your app, you will need to set up config variables in Heroku which will be explained in a later step.

# Create a Slack workspace and Slack application

If you do not have a Slack workspace to deploy your bot to, follow the instructions here to create a new workspace: https://slack.com/help/articles/206845317-Create-a-Slack-workspace.

Next, go to [https://api.slack.com/apps](https://api.slack.com/apps) and log into your Slack account if you are not already logged in. If you get redirected to your workspace after logging in, go back to [https://api.slack.com/apps](https://api.slack.com/apps).

Click on “Create an App”, or if you already have some apps created, click on “Create New App” at the top-right of the page. In the pop-up box, enter a name for your bot in “App Name” and select the workspace that you would like to deploy the bot to. Click “Create App” afterwards. You should now be redirected to your app’s “Basic Information” page.

# Install app to workspace and add Redirect URLs and Bot Token Scopes

Now go to the "OAuth & Permissions" tab located here.
<br/>![](images/scopeHelp1.png)

<br/>Under "Redirect URLs," click on "Add New Redirect URL". Enter your redirect URL, which is a URL of the form `https://cgaucho.herokuapp.com/api/authorize`, with `cgaucho` swapped out for your Heroku app's name. Note that you will only need one redirect URL, unlike the following image. Afterwards, click on "Save URLs."
<br/>![](images/scopeHelp3.png)

<br/> Then, scroll down until you get to the box named "Scopes". Under "Bot Token Scopes," click on "Add an OAuth Scope" and add the four scopes in the following image:
<br/>![](images/scopeHelp2.png)

Finally, scroll to the top of the page and click on the "Install App to Workspace" button. Select a channel for the bot to post in, and click "Allow."

# Set up a MongoDB database

To set up your MongoDB database, please follow this guide:

[https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/](https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/).

Follow the guide up until the end of step 10. One thing to note is that, by the end of step 9, the guide asks you to paste in a string into your app's configuration. Instead of that, temporarily paste it somewhere else (that is safe!). You will need this string for the next step.

# Enter environment variables into the `.env` file

We will now make the `.env` file. Locally on your computer, make a copy of our `.env.SAMPLE` file by running `cp .env.SAMPLE .env`. Make sure your copied file is named `.env` (without the `.SAMPLE`). Your `.env` file should look like this now:

```
# Fill in the below values by following the instructions in docs/DEPLOY.md
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_VERIFICATION_TOKEN=
SLACK_AUTH_TOKEN=
MONGODB_URI=
```

Go back to your Slack app’s “Basic Information” page and scroll down to the “App Credentials” section. There, you will find values for Client ID, Client Secret, and Verification Token. Copy and paste these values into your `.env` file in the variables `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_VERIFICATION_TOKEN` respectively. Make sure that there are no spaces between the `=`'s and the values that you pasted.

Next, scroll back up and in the left column of the page, go to the "OAuth & Permissions" page. You should now see the “Bot User OAuth Access Token”. Copy and paste this value into the `SLACK_AUTH_TOKEN` variable of `.env`, again making sure that there is no space after the `=`.

Finally, for the `MONGODB_URI` variable, paste in the value you created in the previous step.

Your `.env` file should now look something like this (these values are fake example values).
```
# Fill in the below values by following the instructions in docs/DEPLOY.md
SLACK_CLIENT_ID=109232264164.1098345726706
SLACK_CLIENT_SECRET=a7491bc91738d97138b72fd6cb
SLACK_VERIFICATION_TOKEN=VisWjg92ksmOksoAi3kf38
SLACK_AUTH_TOKEN=xoxb-1093412282664-108265773406-j47ayaya12k25SMOrcLso4ai3
MONGODB_URI=mongodb+srv://adminuser:dQw4w9WgXcQ@your-bot-name-7dfa.mongodb.net/test?retryWrites=true&w=majority
```

# Enter environment variables into Heroku and deploy

We can now set your Heroku config variables. Go to your Heroku app's page, and in Settings under Config Vars, paste the variable name and variable values from your `.env` file. However, there is one change you will need to make. In Heroku, instead of entering `MONGODB_URI` as a variable name, you must rename it to `MONGODB_URI_PRODUCTION` instead.

In addition to the variables from your `.env` file, you should also add the following two config variables to Heroku, which will not be necessary to add into your `.env` file:
| Variable Name        | Variable Value                                             | Description            
| -------------------- | ---------------------------------------------------------- | ----------------------------|
| `SLACK_REDIRECT_URI` | `https://your-heroku-app-name.herokuapp.com/api/authorize` | `your-heroku-app-name` is your Heroku app name.            |
| `TZ`                 | `America/Los_Angeles`                                      | This variable is a Heroku-specific variable that controls time zones.         |

Your config variables should now look something like this:
![Image of example config variables](images/heroku-config-vars-example.png)

After setting up your config variables, go to the Deploy tab on Heroku and deploy your master branch.

# Insert the slash commands into your Slack app

Go back to the Slack Applications link given [here](https://api.slack.com/apps). Then, click on your app.
Now, you should be back at the "Basic Information" page.
![](images/commandHelp1.png)
<br/>From here, click on "Add features and functionality".
![](images/commandHelp2.png)
<br/>Then, click on "Slash Commands".
![](images/commandHelp3.png)
<br/>Now, you can make the commands. To create a command, click on "Create New Command" and input
the following five commands, making sure to change `cgaucho` in the request URLs to match your Heroku app's name.

| Command   | Request URL (Example URLs)                   | Short Description            | Usage Hint                |
| --------- | -------------------------------------------- | ---------------------------- | ------------------------- |
| /appraise | `https://cgaucho.herokuapp.com/api/appraise` | Shows reputation             | [User]                    |
| /hello    | `https://cgaucho.herokuapp.com/api/hello`    | Messages hello back          |                           |
| /praise   | `https://cgaucho.herokuapp.com/api/praise`   | Gives a person 1 reputation  | [User]                    |
| /rankings | `https://cgaucho.herokuapp.com/api/rankings` | Shows most reputable         |                           |
| /schedule | `https://cgaucho.herokuapp.com/api/schedule` | Sends messages at given time | [Create/Delete/List/Help] |

The short description and usage hint doesn't impact how the command works, so feel free to skip that step.

# You are now finished deploying our Slack bot!

In your Slack workspace, you can now type "/" to see a list of all commands. Among the list, you should see the commands pertaining to your bot. Also, on your Heroku website, there is also a button that allows others to deploy your bot onto their workspaces.

Something to note is that after you type a command from this bot, you could possibly get an error from **Slackbot** (not the bot that you just deployed). This could either mean that Heroku is "just waking up", or that there is a bug in our code. (hopefully it is just the former!) Here is what an error message from Slackbot looks like: ![](images/slackbot-error.png)
