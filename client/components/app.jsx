import React from "React";

import Header from "./Header/Header.jsx";
import Home from "./Home/Home.jsx";

import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import Cart from "./Cart/Cart.jsx";
import {
    Route,
    HashRouter
} from "react-router-dom";



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userObj: null,
            listOfAllItems: [],
            cartItems: [],
            loading: true
        }
        this.setUsersObj = this.setUsersObj.bind(this);
        this.setItemsInList = this.setItemsInList.bind(this);
    }

    componentDidMount() {
        console.log('GOT IN HERE');
        Promise.allSettled([axios.get('/startUp'), axios.get('/getAllItems')]).then(res => {
            console.log('RES: ', res);
            let finalState = { loading: false };
            if (res[0].status === 'fulfilled') {
                finalState = { ...finalState, userObj: res[0].value.data }
            }
            if (res[1].status === 'fulfilled') {
                finalState = { ...finalState, listOfAllItems: res[1].value.data }
            }
            console.log('FIONAL STATE: ', finalState);
            this.setState(finalState);
        })
    }

    setUsersObj(userObj) {
        this.setState({ userObj });
    }

    setItemsInList(item) {
        this.setState((prevState) => ({
            listOfAllItems: [...prevState.listOfAllItems, item]
        }));
    }

    render() {
        const { userObj, listOfAllItems, loading } = this.state;
        console.log('USER OBJ: ', userObj);
        if (loading) return <CircularProgress color="secondary" />;
        return (
            <div>
                <HashRouter>
                    <Header userObj={userObj} setUsersObj={this.setUsersObj} setItemsInList={this.setItemsInList} />
                    <div>
                        <Route exact path="/" component={(props) =>
                            <Home userObj={userObj} listOfAllItems={listOfAllItems} setUsersObj={this.setUsersObj} {...props} />} />
                        <Route path="/cartItems" component={(props) =>
                            <Cart userObj={userObj} setUsersObj={this.setUsersObj} {...props} />} />

                    </div>
                </HashRouter>
            </div>
        );
    }
}

export default App;