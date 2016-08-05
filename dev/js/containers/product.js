import React,{Component} from 'react' ;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SelectProduct} from  '../actions/index';

class Product extends Component
{
    showProductdetails(product)
    {
        this.props.SelectProduct(product);
    }

    renderProductList()
    {
        console.log("Product at Container",this.props.product);
        return this.props.product.map((product)=>{
            return(
<li key={product.id} onClick={()=>this.showProductdetails(product)}><h3>{product.name}</h3><img src={`http://luisai.sachinkukreja.com/api/images/products/${product.id}/${product.associations.images[0].id}?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N`}/><p>{product.wholesale_price}</p>
    </li>
            );
        });
    }


render() {

    if (!this.props.product)
    {
        return(<h4></h4>)
    }


    return (
        <div className="products-container" >
            {this.renderProductList()}
        </div>
    );
}

}
function mapStateToProps(state) {
    return{
        product:state.products
};
}

function matchDispatchToProps(dispatch)
{
    return  bindActionCreators({SelectProduct: SelectProduct}, dispatch);
}

export default connect(mapStateToProps , matchDispatchToProps)(Product);
