import fetch from 'isomorphic-fetch'


let chatlist = [];
let contextid = "";
let productdetails = [];
let initialEntity = "";
let ProductSelected;
export const SendToLuis = (searchterm) => {
    console.log("Sending to Luis :", searchterm);
    return (dispatch) => {
        dispatch(ChatChanged(searchterm));
        dispatch(callLuisApi(searchterm));
    };
};

export const SelectProduct = (product) => {
    ProductSelected = product;
    contextid = "";
    return {
        type: 'PRODUCT_SELECTED',
        payload: product
    }
};

function callLuisApi(searchterm) {
    console.log("calling Luis Api");
    return dispatch =>fetch(`https://api.projectoxford.ai/luis/v1/application/preview?id=0a4ead29-b2bc-482e-b6ef-c8a0756c07f4&subscription-key=c71fa1b6442b4c73ae3a60abb7bc251b&q=${searchterm}&contextid=${contextid}`)
        .then(response => response.json())
        .then(json => dispatch(getTopScoringIntentandEntites(json)))


}

function getTopScoringIntentandEntites(json) {
    console.log("Got Top Scoring Intent", json);
    let topscoringIntent = json.topScoringIntent.intent;
    let entities = json.entities;
    let actions = json.topScoringIntent.actions;
    let dialog = json.dialog;
    if (dialog.status == "Finished") {
        contextid = "";
        return (dispatch) => {
            dispatch(callIntent(topscoringIntent, entities, actions,dialog));
            initialEntity = ""
        };

    } else {
        entities.map((entity)=> {
            if (entity.type == 'ProductCategory') {
                initialEntity = entity.entity
            }
        });
        contextid = dialog.contextId;
        return (dispatch) => {
            dispatch(callIntent(topscoringIntent, entities, actions,dialog))

        };
    }


}

function callIntent(topscoringIntent, entities, actions,dialog) {

    let entity_type = [];
    entities.map((entity)=> {
        entity_type.push(entity.type);
    });

    return (dispatch) => {
        switch (topscoringIntent) {
            case "SearchProductCategory":
                if (entities.length <= 1) {
                    entity_type.map((type)=> {
                        switch (type) {
                            case "color":

                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${initialEntity} ${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                            dispatch(ProductReceived(productdetails))
                                        });
                                    });
                                break;

                            case "brand":
                                let color = "";
                                actions[0].parameters.map((param)=> {
                                    if (param.name == "color" && param.value != null) {
                                        color = param.value[0].entity;
                                        console.log("Color::" ,color + "Initial Entity::" + initialEntity );
                                    }
                                });
                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${color} ${initialEntity} ${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                            dispatch(ProductReceived(productdetails))
                                        });
                                    });
                                break;

                            default:
                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                            dispatch(ProductReceived(productdetails))
                                        });
                                    });
                                break;

                        }
                    });
                }
                else if (entities.length > 1) {

                    let ConsolidatedEtities = "";
                    entities.map((entity)=> {
                        ConsolidatedEtities += " " + entity.entity;
                    });

                    fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${ConsolidatedEtities}&language=1&output&output_format=JSON`)
                        .then(response => response.json())
                        .then(json=> {
                            dispatch(GetProducts(json.products,dialog)).then(()=> {
                                dispatch(ProductReceived(productdetails))
                            });
                        })
                }
                break;
            case "AddToCart":
                if (ProductSelected != null) {
                    console.log("product selected", ProductSelected);
                    return dispatch(ChatChanged(ProductSelected.name + " Added to Cart"));
                }
                else if (productdetails.length == 1) {
                    console.log("only one product remains");
                    return dispatch(ChatChanged(productdetails[0].name + " Added to Cart"));
                }
                return dispatch(ChatChanged("No Product Select to Add to Cart.."));


        }
    }
}

function GetProducts(products,dialog) {
    productdetails = [];

    console.log("products", products);
    return dispatch => {
        if (products.length == 1) {
            contextid = "";
        }
        else {
            dispatch(ChatChanged(dialog.prompt));
        }
       return Promise.all(
            products.map((product)=> {
                return fetch(`http://luisai.sachinkukreja.com/api/products/${product.id}?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&output_format=JSON`)
                    .then(response => response.json())
                    .then(json => productdetails.push(json.product))
            })
        )

    }
}
export const ProductReceived = (json) => {
    return {
        type: 'PRODUCT_RECEIVED',
        payload: json
    }
};

export const ChatChanged = (chatItem) => {
    chatlist.push(chatItem);
    return {
        type: 'CHAT_CHANGED',
        payload: chatlist
    }
};