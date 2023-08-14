import Header from "./components/Header/Header";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header></Header>
    </Router>
  );
}

export default App;
