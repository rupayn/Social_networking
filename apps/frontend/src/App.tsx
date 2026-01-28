import { useSelector } from "react-redux";

import { Outlet } from "react-router";
import type { RootState } from "./redux/store";

function App() {
  const theme = useSelector((state: RootState) => state?.theme.value);

  return (
    <>
      <div data-theme={theme}>
        <Outlet />
      </div>
    </>
  );
}

export default App;
