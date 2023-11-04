import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import Logo from "../assets/images/logo.png";

export default function Navbar() {
  const [isLoggedin, setIsLoggedIn] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <div className="flex items-center">
      <NavigationMenu className="flex justify-between content-between max-w-none">
        <Link to={"/"} draggable="false">
          <img src={Logo} draggable="false" alt="logo" className="w-16 h-16" />
        </Link>
        <NavigationMenuList>
          <NavigationMenuItem className="flex items-center gap-4">
            {isLoggedin ? (
              <>
                <Link to={"/books"}>Book fees</Link>
                <Link to={"/"}>Tuition fees</Link>
                <Button
                  className="hover:bg-primary hover:text-white"
                  variant="outline"
                  onClick={() => {
                    auth.signOut();
                    navigate("/");
                  }}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to={"/signup"}>
                  <Button
                    className="hover:bg-primary hover:text-white"
                    variant="outline">
                    Sign Up
                  </Button>
                </Link>
                <Link to={"/login"}>
                  <Button
                    className="hover:bg-primary hover:text-white"
                    variant="outline">
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
