import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <main>
        <Outlet /> {/* 👈 This renders child components like SelectDataset, DatasetPage, etc. */}
      </main>
    </>
  );
};

export default Layout;