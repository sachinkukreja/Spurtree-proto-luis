export default  function (state=null ,action) {
    switch (action.type) {

        case "PRODUCT_SELECTED":
            console.log("At reducer",action.payload);
            return  action.payload
            break;

        default :
            return state;
            break;

    }

}