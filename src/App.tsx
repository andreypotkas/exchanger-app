import './App.scss';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import Rates from './components/Rates/Rates';

function App() {
  return (
    <div className="App">
      <Rates />
    </div>
  );
}

export default App;
