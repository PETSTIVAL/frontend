import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RouteDef } from './RouteDef';

const AppPages = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.entries({ ...RouteDef }).map(([name, { path, element }], index) => (
          <Route key={name + index} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppPages;
