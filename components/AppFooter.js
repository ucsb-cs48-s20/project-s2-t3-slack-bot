import Container from "react-bootstrap/Container";

function AppFooter() {
  return (
    <Container style={{ fontWeight: "italic" }}>
      <br />
      Source Code:{" "}
      <a href="https://github.com/ucsb-cs48-s20/project-s2-t3-slack-bot">
        GitHub
      </a>
    </Container>
  );
}

export default AppFooter;
