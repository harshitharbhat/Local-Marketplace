import React from 'react';
import Typography from '@material-ui/core/Typography';
import CartStyles from "../Cart/Cart.less";
import Avatar from "@material-ui/core/Avatar";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";

class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cartItemList: [],
            isButtonDisabled: true,
            checkedOut: false,
            sellerList: [],
            userObj: this.props.userObj
        }
        this.goToCart = this.goToCart.bind(this);
        this.checkOut = this.checkOut.bind(this);
    }

    goToCart() {
        let request = {
            cartItems: this.state.userObj.cartItems
        }
        console.log("cart items from state", request.cartItems);
        axios.post('/cartItems', request).then(response => {
            if (response.status === 200) {
                this.getSellerList(response.data);
            }
        }
        )

        console.log("response", this.state);
    };

    getSellerList(cartItemsList) {
        let sellerList = [];
        cartItemsList.forEach(item => {
            sellerList.push(item.userId);
        })
        console.log("seller list", sellerList);
        let request = {
            sellerList: sellerList
        }
        axios.post('/getSellerList', request).then(response => {
            if (response.status === 200) {
                this.setSellerToItem(response.data, cartItemsList);
                this.setState({ cartItemList: cartItemsList });
                console.log("state", this.state.cartItemList);
            }
        })
    }

    componentWillMount() {
        this.goToCart();
    }

    setSellerToItem(sellersList, cartItemsList) {
        cartItemsList.forEach(item => {
            let seller = sellersList.filter(o1 => item.userId === o1._id);
            if (seller.length != 0) {
                item.sellerName = seller[0].name;
                item.sellerEmail = seller[0].email;
            } else {
                item.sellerName = "Seller/Item no longer available";
                item.sellerEmail = "";
            }
        })
    }

    checkOutOptions(e) {
        this.setState({ isButtonDisabled: false });
    }

    checkOut() {
        this.setState({ checkedOut: true });
    }

    removeFromCart(itemId, setUsersObj) {
        let request = {
            userId: this.state.userObj._id,
            itemId: itemId
        }
        console.log("rem req", request);
        axios.post('/removeObjFromCart', request).then(response => {
            if (response.status === 200) {
                console.log("delete", response.data);
                this.setState({
                    userObj: Object.assign({}, this.state.userObj, { cartItems: response.data.cartItems })
                });
                setUsersObj(this.state.userObj);
                this.goToCart();

            }
        })
    }


    render() {
        const { cartItemList, } = this.state;
        const { setUsersObj } = this.props;
        let totalPrice = 0;
        return (
            <div>
                {
                    cartItemList.map(item => {
                        totalPrice += parseFloat(item.itemPrice.split(",").join(""));
                        return (
                            <div className={CartStyles.root}>
                                <Paper className={CartStyles.paper}>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Avatar variant={"square"} src={item.fileLocation} />
                                        </Grid>
                                        <Grid item xs={6} sm container>
                                            <Grid item xs container direction="column" spacing={2}>
                                                <Grid item xs>
                                                    <Typography gutterBottom variant="subtitle1">
                                                        {item.itemTitle}<br />
                                                        Sold by: {item.sellerName} ({item.sellerEmail})
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                                        <a onClick={() => this.removeFromCart(item._id, setUsersObj)}>Remove from cart</a>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1">{item.itemPrice}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </div>
                        );
                    })
                }
                <div className={CartStyles.root}>
                    <Paper className={CartStyles.paper}>
                        <Grid container spacing={2}>
                            <Grid item xs={10} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Total Amount
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1">{totalPrice}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
                <Card className={CartStyles.card}>
                    <CardContent className={CartStyles.content}>
                        <Typography className={"MuiTypography--heading"} gutterBottom
                            onChange={(e) => this.checkOutOptions(e)}>
                            <h4>Payment Options</h4>
                            <input type="radio" value="COD" name="checkoutOption" /> Cash/Card on delivery <br />
                            <input type="radio" value="COP" name="checkoutOption" /> Cash/Card on pickup <br />
                            <input type="radio" value="CS" name="checkoutOption" /> Contact seller <br />
                        </Typography>
                        {!this.state.checkedOut && (<Button variant="contained" color="primary" onClick={this.checkOut}
                            disabled={this.state.isButtonDisabled}>Checkout</Button>)}
                        {this.state.checkedOut && (<Typography className={"MuiTypography--heading"} gutterBottom>
                            Thank you for shopping at the local market place !</Typography>)}
                    </CardContent>
                </Card>
            </div>
        );
    }

}
export default Cart;