import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;

  return (
    <Layout user={user}>
      <div>
        Add the bot to your Slack workspace by clicking the button below!
      </div>
      <a href="https://slack.com/oauth/v2/authorize?scope=incoming-webhook,commands,chat:write&client_id=1089398914164.1087443355106">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
      <br></br>
      <br></br>
      {user ? (
        <div>
          You're logged in! Here's what the server knows about you:
          <pre>{JSON.stringify(user, null, "\t")}</pre>
        </div>
      ) : (
        <div>You're not logged in!</div>
      )}
      <br></br>
    </Layout>
  );
}

export default HomePage;
