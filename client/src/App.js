import { BrowserRouter as Router, Route, Routes as Switch } from "react-router-dom"
import { ValidationErrorProvider } from "./pages/TestScriptTestingPage/Context/ValidationErrorContext";
import TestScriptTestingPage from "./pages/TestScriptTestingPage";
import './App.css';

function App() {
  return (
    <ValidationErrorProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" element={<TestScriptTestingPage />} />
          </Switch>
        </Router>
      </div>
    </ValidationErrorProvider>
  );
}

export default App;
