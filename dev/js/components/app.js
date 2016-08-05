import React from 'react' ;
import BotInput from '../containers/botinput'
import Products from '../containers/product'
import ChatList from '../containers/chatlist'
import ProductDetails from '../containers/product-description'

require ('../../scss/style.css');


const App = ()=> (
    <div>
        <div className="right w-30 background-theme h-full fixed">
                <ChatList  />
                <BotInput className />
                </div>
            <div className="left w-70">
        <Products />
                <ProductDetails/>
                </div>
    </div>
);

export default App;