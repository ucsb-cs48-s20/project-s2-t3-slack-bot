import Layout from "../components/Layout";
import SlackButton from "../components/SlackButton";
function HomePage(props) {
  return (
    <Layout>
      <br />
      <div>
        Add our bot to your Slack workspace by clicking the button below!
      </div>
      <SlackButton></SlackButton>
    </Layout>
  );
}

export default HomePage;
