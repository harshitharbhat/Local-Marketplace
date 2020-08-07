import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import StorefrontIcon from "@material-ui/icons/Storefront";
import ExitToApp from "@material-ui/icons/ExitToApp";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import styles from "./HeaderStyles.less";
import Modal from "../Modal/Modal.jsx";
import axios from 'axios';
import { NavLink } from "react-router-dom";


export default function Header(props) {
  const { userObj, setUsersObj, setItemsInList } = props;

  const logoutUser = () => {
    axios.get('/logout').then(response => {
      if (response.status === 200) {
        setUsersObj(null);
      }
    })
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <NavLink to="/"><StorefrontIcon className={styles.craftShopIcon} /></NavLink>
          <Typography className={styles.craftShopHeader} variant="h6">
            The One-stop crafts shop
          </Typography>
          { /* When a user doesn't exist, show login icon */}
          {!userObj && <Modal type="startup" setUsersObj={setUsersObj} />}
          { /* When a user exist, show the bottom three icons */}
          {userObj && <Modal type="settings" userObj={userObj} setItemsInList={setItemsInList} />}
          {
            userObj &&
            <NavLink to="/cartItems" >
              <button
                className={styles.buttonIcon}>
                <Badge badgeContent={userObj.cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </button></NavLink>
          }
          {
            userObj &&
            <NavLink to="/" >
              <button
                className={styles.buttonIcon}
                onClick={logoutUser}
              >
                <ExitToApp />
              </button>
            </NavLink>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
