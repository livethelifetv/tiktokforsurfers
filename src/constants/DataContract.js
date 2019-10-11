export default {

    payments: {
        postPaymentAcknowledgeApi : "/top-up/", 
        getAllProductsApi : '/top-up/products' , 
        getTopUpStatusApi : "/top-up/",
        getPendingApi: "/top-up/pending",
        purchaseThresholdReachedKeyPath : "data.topup_limits_data.limit_reached",
        purchaseThresholdValueKeyPath: "data.topup_limits_data.limit",
        topUpEntityId : "id",
        startPollingKey : "start_polling",
        paymentAcknowledgeErrMsgKey :"err_message",
        statusCodeBEAcknowledgeKey : "display_status", 
        statusCodeBEAcknowledgeMap : {
            failed : "FAILED",
            processing : "PROCESSING",
            cancelled: "CANCELLED"
        },
        isConsumableKey: "is_consumable"
    },

    redemption: {
        configApi : "/pepocorn-topups/info/",
        fetchBalanceApi: "",
        isAppUpdateKeyPath: "data.app_upgrade",
        pepoCornsNameKey: "product_name",
        pepoCornsImageKey: "product_image"
    },

    common: {
        resultType : "data.result_type"
    }
}

