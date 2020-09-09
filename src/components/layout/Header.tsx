import React from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import useToggle from "../../hooks/useToggle";
import MenuPng from "../../assets/menu.png";
import ProfilePng from "../../assets/profile.png";
import SignOutPng from "../../assets/signout.png";
import { auth } from "../../firebase/firebaseUtils";
import {
    StyledHeader,
    Logo,
    LogoLink,
    Nav,
    NavLink,
    MenuIcon,
    ProfileIcon,
    Menu,
    MenuLink,
    SignOut,
} from "./HeaderStyles";

interface Props {
    currentUser: object | null;
}

const Header: React.FC<Props> = ({ currentUser }) => {
    const [drawer, toggleDrawer] = useToggle(false);
    return (
        <>
            <StyledHeader>
                <Logo>
                    <LogoLink to="/">SMDb</LogoLink>
                </Logo>

                <Nav>
                    <NavLink exact to="/">
                        Movies
                    </NavLink>
                    <NavLink exact to="/tv">
                        TV Shows
                    </NavLink>
                    <NavLink exact to="/randomizer">
                        Randomizer
                    </NavLink>
                    <NavLink exact to="/favorites">
                        Favorites
                    </NavLink>
                </Nav>

                <Modal />
                {currentUser ? (
                    <ProfileIcon
                        src={SignOutPng}
                        onClick={() => auth.signOut()}
                    />
                ) : (
                    <Link to="/signin">
                        <ProfileIcon src={ProfilePng} />
                    </Link>
                )}
                <MenuIcon src={MenuPng} onClick={toggleDrawer} />
            </StyledHeader>

            <Menu active={drawer} onClick={toggleDrawer}>
                <MenuLink to="/">Movies</MenuLink>
                <MenuLink to="/tv">TV Shows</MenuLink>
                <MenuLink to="/randomizer">Randomizer</MenuLink>
                <MenuLink to="/favorites">Favorites</MenuLink>
                {currentUser ? (
                    <SignOut onClick={() => auth.signOut()}>Sign Out</SignOut>
                ) : (
                    <MenuLink to="/signin">Sign In</MenuLink>
                )}
            </Menu>
        </>
    );
};

export default Header;
