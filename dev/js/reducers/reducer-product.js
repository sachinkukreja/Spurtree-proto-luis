export default  function (state=null ,action) {
    switch (action.type) {

        case "PRODUCT_RECEIVED":
            console.log("At reduicer",action.payload);
            return  action.payload
            break;

        default :
            return state;
            break;

    }

}