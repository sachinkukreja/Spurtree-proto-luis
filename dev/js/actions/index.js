import fetch from 'isomorphic-fetch'


let chatlist = [];
let contextid = "";
let productdetails = [];
let initialEntity = "";
let ProductSelected;
let color ="";
let UsePrevparams = false;
let query = "";
let ordinalDict = {
    first : 0,
    second : 1,
    third :2,
    fourth: 3
};


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
    if (UsePrevparams)
    {
        searchterm += " " + color + " " +initialEntity;
    }
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
    query = json.query;

        if (dialog.status == "Finished") {
            contextid = "";
            return (dispatch) => {
                dispatch(callIntent(topscoringIntent, entities, actions, dialog));
            };


        } else {
            entities.map((entity)=> {
                if (entity.type == 'ProductCategory') {
                    initialEntity = entity.entity
                }
            });
            contextid = dialog.contextId;
            return (dispatch) => {
                dispatch(callIntent(topscoringIntent, entities, actions, dialog))

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
                if (entities.length == 1) {
                    entity_type.map((type)=> {
                        switch (type) {
                            case "color":

                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${initialEntity} ${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                            dispatch(ProductReceived(productdetails));
                                            UsePrevparams =false;
                                        },()=> {
                                            dispatch(ChatChanged("No Item Found , Please try some other color "));
                                            UsePrevparams = true;
                                        });
                                    });
                                break;

                            case "brand":
                                color = "";
                                actions[0].parameters.map((param)=> {
                                    if (param.name == "color" && param.value != null) {
                                        color = param.value[0].entity;
                                    }
                                });
                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${color} ${initialEntity} ${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                                dispatch(ProductReceived(productdetails));
                                                UsePrevparams = false;
                                            }
                                        ,()=> {
                                                dispatch(ChatChanged("No Item Found , Please try some other brand "));
                                                UsePrevparams = true;
                                            }
                                        );
                                    });
                                break;
                            case "builtin.ordinal":
                                contextid ="";
                                dispatch(callLuisApi(query));
                                break;

                            default:
                                fetch(`http://luisai.sachinkukreja.com/api/search/?ws_key=K5JKXSHBIE76CXXY5V4KBWS6F156GS7N&query=${entities[0].entity}&language=1&output&output_format=JSON`)
                                    .then(response => response.json())
                                    .then(json=> {
                                        dispatch(GetProducts(json.products,dialog)).then(()=> {
                                            dispatch(ProductReceived(productdetails))
                                        },()=> {
                                            dispatch(ChatChanged("No Item Found , Please try a different search"))

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
                                dispatch(ProductReceived(productdetails));
                                initialEntity = ConsolidatedEtities;
                            });
                        })
                }
                else
                {
                    contextid = "";
                    dispatch(callLuisApi(query));
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
                }else if (productdetails.length >1 && entities.length >= 1)
                {
                    let index = -1;
                    entities.map((entity)=>{
                        if (entity.type == "builtin.ordinal")
                        {
                            index = ordinalDict[entity.entity];
                        }

                    });
                    return dispatch(ChatChanged(productdetails[index].name + " Added to Cart"));
                }
                return dispatch(ChatChanged("No Product Selected "));
            break;
            case "None":
                return dispatch => dispatch(ChatChanged("Sorry, I Do not understand that "));
            break;


        }
    }
}

function GetProducts(products,dialog) {
    productdetails = [];
    if (products != null) {
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
    else{
        contextid = "";
        return dispatch =>
        Promise.reject();

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