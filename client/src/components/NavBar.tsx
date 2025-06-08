import { Button } from 'antd';

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 w-full">
      <img
        src="/saigeware-horizontal-removebg-preview.png"
        alt="saigeware logo"
        className="h-12 w-auto"
      />
      <Button size='large' className="px-6">
        Login
      </Button>
    </nav>
  );
}

export default NavBar
