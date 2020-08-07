import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HomeStyles from './Home.less';
import CardMedia from "@material-ui/core/CardMedia";
import axios from "axios";
import { NavLink } from "react-router-dom";

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userObj: this.props.userObj
        }
        this.onAddCart = this.onAddCart.bind(this);
    }

    isUserLoggedIn(userObj) {
        return (userObj) ? "" : "Please login to add items to Cart";
    }

    listedItem(userObj, item) {
        if (userObj) {
            return (userObj._id === item.userId) ? true : false;
        }
        return false;
    }

    disableCart(userObj, item) {
        if (userObj) {
            if (this.alreadyInCart(userObj, item._id)) {
                return true;
            } else {
                return this.listedItem(userObj, item)
            }
        }
        return true;
    }

    onAddCart(e, selectedItem, setUsersObj) {
        let newCartItems = this.props.userObj.cartItems.push(selectedItem);
        this.setState({
            userObj: Object.assign({}, this.state.userObj, { cartItems: newCartItems })
        });

        let request = {
            userId: this.props.userObj._id,
            selectedItem: selectedItem
        }
        axios.post('/addCart', request).then(response => {
            if (response.status === 200) {
                console.log("Added to cart");
            }
        }).catch((err) => {
            console.log("Error occured", err);
        })
        setUsersObj(this.state.userObj);
    }

    alreadyInCart(userObj, itemId) {
        if (userObj) {
            if (userObj.cartItems.indexOf(itemId) > -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    render() {
        const { listOfAllItems, userObj, setUsersObj } = this.props;
        console.log('userObj');
        return (
            <div>
                {
                    listOfAllItems.map(item => {
                        console.log('ITEM: ', item);
                        return (
                            <Card className={HomeStyles.card}>
                                <CardMedia className={HomeStyles.media} square image={item.fileLocation} />
                                <CardContent className={HomeStyles.content}>
                                    <Typography className={"MuiTypography--heading"} gutterBottom >
                                        {item.itemTitle} by {item.userName}
                                    </Typography>
                                    <Typography className={"MuiTypography--heading"} gutterBottom >
                                        {item.itemPrice}
                                    </Typography>
                                    <Typography className={"MuiTypography--heading"} gutterBottom >
                                        {this.isUserLoggedIn(userObj)}
                                    </Typography>
                                    <Typography className={"MuiTypography--heading"} gutterBottom >
                                        {this.listedItem(userObj, item) ? "Item listed by you" : ""}
                                    </Typography>
                                    <NavLink to={this.disableCart(userObj, item) ? '#' : '/cartItems'}>
                                        <Button variant="contained" color="primary" key={item._id} disabled={this.disableCart(userObj, item)}
                                            onClick={(e) => this.onAddCart(e, item._id, setUsersObj)} >
                                            {this.alreadyInCart(userObj, item._id) ? "Already in cart" : "Add to Cart"}
                                        </Button>
                                    </NavLink>
                                </CardContent>
                            </Card>
                        );
                    })
                }
            </div>
        );
    }
}

export default Home;