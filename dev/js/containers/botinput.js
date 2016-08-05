import React, {Component} from 'react' ;
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {SendToLuis,ChatChanged} from '../actions/index';


class BotInput extends Component {

    handleClick() {
        // Explicitly focus the text input using the raw DOM API.
        if (this._input !== null) {

            this.props.SendToLuis(this._input.value);
            this._input.value = "";
        }
    }

    render() {
        return (
            <div className="bot-input">

                <input ref={(c) => this._input = c} className="input-text"/>
                <input type="button" onClick={this.handleClick.bind(this)} className="search-button"/>

            </div>

        );

    }

    componentDidMount() {

        this.props.ChatChanged("Hi There, What are you looking for ?");
    }

}


function mapStateToProps(state) {
    return {};
}

function matchDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({},{SendToLuis: SendToLuis},{ChatChanged:ChatChanged}), dispatch);

}

export default connect(mapStateToProps, matchDispatchToProps)(BotInput);