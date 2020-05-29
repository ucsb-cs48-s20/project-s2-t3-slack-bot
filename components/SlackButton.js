function SlackButton() {
  return (
    <>
      <br />
      <div>
        Add our bot to your Slack workspace by clicking the button below!
      </div>
      <a href="https://slack.com/oauth/v2/authorize?scope=incoming-webhook,commands,chat:write&client_id=1089398914164.1087443355106">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    </>
  );
}

export default SlackButton;
