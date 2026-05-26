import AppRoute from "./AppRoutes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <AppRoute />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  )
}

export default App
