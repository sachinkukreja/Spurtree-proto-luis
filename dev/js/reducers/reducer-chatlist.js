export default  function  (state=null ,action) {
    switch (action.type) {


        case "CHAT_CHANGED":
            return Object.assign([], state, action.payload)
            break;
        default :
            return state;
            break;

    }

}