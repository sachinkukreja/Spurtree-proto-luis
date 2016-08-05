import React,{Component} from 'react' ;
import {connect} from 'react-redux';

class ProductDetails extends Component
{
    render()
    {
        if (!this.props.product)
        {
            return(<h4></h4>)
        }


        return (
            <div className="products-description-container" >
                <h3>{this.props.product.name}</h3><img src={`http://luisai.sachinkukreja.com/api/images/products/${this.props.product.id}/${this.props.product.associations.images[0].id}?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N`}/><p>{this.props.product.wholesale_price}</p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        product:state.productdetails
    };
}

export default connect(mapStateToProps )(ProductDetails);