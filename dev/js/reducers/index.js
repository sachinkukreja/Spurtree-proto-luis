import {combineReducers} from 'redux';
import ChatList from './reducer-chatlist';
import Products from './reducer-product';
import ProductDetails from './reducer-product-details';

const allReducers = combineReducers(
    {
         products : Products,
         chat : ChatList,
        productdetails : ProductDetails

    });

export default  allReducers;