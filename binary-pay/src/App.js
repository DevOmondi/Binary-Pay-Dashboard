import './App.css';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';


function App() {
  return (
    <div className="App">
        <SignIn/>
        <SignUp/>
        <Dashboard/>
    </div>
  );
}

export default App;
