import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import SettingsModal from "../Settings/SettingsModal.jsx";
import PersonIcon from "@material-ui/icons/Person";
import StartupModal from "../StartUp/StartupModal.jsx";
import ModalStyles from './Modal.less';

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    border: "2px solid #000",
    backgroundColor: "white",
    padding: "35px",
  },
}));

const getContent = (type, setUsersObj, handleClose, userObj, setItemsInList) => {
  let comp;
  switch (type) {
    case "settings":
      comp = <SettingsModal userObj={userObj} setItemsInList={setItemsInList} handleClose={handleClose} />;
      break;
    case "startup":
      comp = <StartupModal setUsersObj={setUsersObj} handleClose={handleClose} />;
      break;
    default:
  }
  return comp;
};

export default (props) => {
  const { type, setUsersObj, userObj, setItemsInList } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalContent = getContent(type, setUsersObj, handleClose, userObj, setItemsInList);

  return (
    <div>
      <Button onClick={handleOpen} color="inherit">
        {type === "settings" ? <SettingsIcon /> : <PersonIcon />}
      </Button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div
            className={ModalStyles.modalContainer} style={{ padding: type === "settings" ? '39px' : '0px' }}>{modalContent}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
