import React, { useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import SettingsModalStyles from './SettingsModal.less';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import guidItem from '../../lib.js';

const styles = {
  inputRoot: {
    fontSize: 35
  },
  labelRoot: {
    fontSize: 35,
    color: "black",
    "&$labelFocused": {
      color: "black"
    }
  },
  labelFocused: {}
};

const SetttingsModal = ({ classes, userObj, setItemsInList, handleClose }) => {
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imagePreview, setImagePreview] = useState();
  const fileInput = useRef();
  const guidItemUnique = guidItem();

  const showImagePreview = (event) => {
    setImageFileName(event.target.files[0].name);
    let reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(event.target.files[0])
  };

  const onSubmitForm = (e) => {
    let itemObj = {
      itemTitle: itemTitle,
      itemPrice: itemPrice,
      imageFileName: imageFileName,
      fileLocation: setImagePreview,
      userId: userObj._id,
      _id: guidItemUnique,
      userName: userObj.name
    };
    handleClose();
    setTimeout(() => {
      setItemsInList(itemObj);
      window.location.reload();
    }, 1750);
  };

  return (
    <form action="/itemCreate" method="post" enctype="multipart/form-data" className={SettingsModalStyles.formContainer}>
      <h2 className={SettingsModalStyles.formTitle}>Upload an Item</h2>
      <div className={SettingsModalStyles.imageContainer}>
        <label htmlFor="uploadPhoto">
          <input
            style={{ display: 'none' }}
            id="uploadPhoto"
            name="uploadPhoto"
            type="file"
            ref={fileInput}
            onChange={showImagePreview}
          />
          <Button style={{ color: '#3f51b5' }} variant="contained" component="span">
            Upload picture
          </Button>
        </label>
        {imageFileName && <p>{imageFileName}</p>}
        {imagePreview && <img src={imagePreview} alt="icon" width="200" />}
      </div>
      <div>
        <TextField
          id="standard-with-placeholder"
          label="Item Title"
          value={itemTitle}
          name="itemTitle"
          onChange={(e) => { setItemTitle(e.target.value); }}
          InputProps={{ classes: { root: classes.inputRoot } }}
          InputLabelProps={{
            classes: {
              root: classes.labelRoot,
              focused: classes.labelFocused
            }
          }}
          margin="normal"
        />
      </div>
      <div style={{ marginTop: '40px' }}>
        <CurrencyTextField
          label="Amount"
          name="priceAmount"
          variant="outlined"
          value={itemPrice}
          currencySymbol="₹"
          outputFormat="string"
          onChange={(_, value) => { setItemPrice(value); }}
        />
      </div>
      <input type="hidden" value={userObj._id} id="userID" name="userID" />
      <input type="hidden" value={userObj.name} id="userName" name="userName" />
      <input type="hidden" value={guidItemUnique} id="guidItemUnique" name="guidItemUnique" />
      <Button
        className={SettingsModalStyles.itemSubmitButton}
        variant="contained"
        color="primary"
        type="submit"
        onClick={onSubmitForm}
      >
        Submit
      </Button>
    </form>
  );
};

export default withStyles(styles)(SetttingsModal);
