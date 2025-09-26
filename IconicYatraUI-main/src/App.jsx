import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './Routes/MainRoutes';
import ScrollToTop from "../src/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainRoutes />
    </BrowserRouter>
  );
}

export default App;
