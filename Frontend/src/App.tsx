import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          body, html {
            font-family: 'Poppins', sans-serif;
            overflow-x: hidden;  /* Remove horizontal scrollbar */
          }
        `}
      </style>
<Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: 'white',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '1rem',
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      zIndex: 10001, 
    }
  }}
/>
      <BrowserRouter>
        <div className="min-h-screen text-white bg-black">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
