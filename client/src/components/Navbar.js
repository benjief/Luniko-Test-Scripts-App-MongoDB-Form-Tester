import "bootstrap/dist/css/bootstrap.min.css";
import {
    Navbar,
} from "reactstrap";
import "../styles/Navbar.css";

/**
 * Very simplified version of reactstrap's navbar, which can be found here: https://6-4-0--reactstrap.netlify.app/components/navbar/.
 * @returns said navbar.
 */
function NavBar() {

    const reloadPage = () => {
        window.location.reload();
    }

    return (
        <Navbar
            dark
            expand="md"
            fixed=""
            light>
            <img src={require("../img/logo_exp.png")} alt="Luniko" onClick={reloadPage}></img>
        </Navbar >
    );
}

export default NavBar;
