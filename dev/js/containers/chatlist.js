import React,{Component} from 'react' ;
import {connect} from 'react-redux';

class ChatList extends Component
{

    renderList() {
        if (this.props.chats !== null) {
            return this.props.chats.map(function (object, i) {
                return (<li key={i}>{object}</li>);
            });
        }
    }

    render() {
        if (!this.props.chats || this.props.chats.length <=0)
        {
            return(<div></div>)
        }

        return (
            <div className="chatlist">
                {this.renderList()}
            </div>
        );
    }

}


function mapStateToProps(state) {
    return{
        chats:state.chat
    };
}



export default connect(mapStateToProps)(ChatList);
