import Link from "next/link";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";

function AppNavbar(props) {
  return (
    <Navbar bg="dark">
      <Container style={{ color: "white", fontWeight: "bold" }}>
        <a>Academic Boost+ Slack Bot</a>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
