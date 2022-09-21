import React, { Suspense } from 'react';
import { BrowserRouter } from "react-router-dom";


const Header = React.lazy(() => import("./UI/Header"));
const NewRoutes = React.lazy(() => import("./routes"));

function App() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <BrowserRouter>
        <Header />
        <NewRoutes />
      </BrowserRouter>
    </Suspense>


  );
}

export default App;
