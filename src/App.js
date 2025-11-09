import { Flip, ToastContainer } from 'react-toastify';
import './App.css';
import { AuthProvider } from './context/authContext';
import { LoaderProvider } from './context/loaderContext';
import AppRoutes from './routes/routes';

function App() {
  return (
    <div className="App">
      <LoaderProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LoaderProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />
    </div>
  );
}

export default App;
