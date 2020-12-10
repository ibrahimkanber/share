import AuthContextProvider from "./context/AuthContex";
import AppRouter from "./Router/Router";

function App() {

  return (
      <AuthContextProvider>
      <AppRouter />
      </AuthContextProvider>
  );
}

export default App;
