import React,{Component} from 'react' ;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ClearContext} from  '../actions/index';

class ChatList extends Component
{

    renderList() {
        if (this.props.chats !== null) {
            return this.props.chats.map(function (object, i) {
                return (<li key={i}>{object}</li>);
            });
        }
    }

    clearContext()
    {
            this.props.ClearContext();
    }

    render() {
        if (!this.props.chats || this.props.chats.length <=0)
        {
            return(<div></div>)
        }

        return (
            <div className="chatlist">
                <div className="clearContext" onClick={this.clearContext()}>X</div>
                <ul>
                {this.renderList()}
                </ul>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return{
        chats:state.chat
    };
}

function matchDispatchToProps(dispatch)
{
    return  bindActionCreators({ClearContext: ClearContext}, dispatch);
}


export default connect(mapStateToProps,matchDispatchToProps)(ChatList);
