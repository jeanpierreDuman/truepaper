import PaperList from "./papers/PaperList";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./../styles/index.css";
import PaperAdd from "./papers/PaperAdd";
import PaperEdit from "./papers/PaperEdit";

export default function App() {
  return (
    <div>
      <Router>
        <Container>
          <Row className="mt-4">
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Accueil</Link>
                  </li>
                </ul>
              </nav>

              <Routes>
                <Route path="/" element={<PaperList />} />
                <Route path="/paper/add" element={<PaperAdd />} />
                <Route path="/paper/:id/edit" element={<PaperEdit />} />
              </Routes>
            </div>
          </Row>
        </Container>
      </Router>
    </div>
  );
}
