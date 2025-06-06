export const orderTypeEN = {
    title: 'Order Type:',
    values: [
        { title: 'Self Order', orderType: '1', onFilterValue: 1 },
        { title: 'Convention Shipment', orderType: '2', onFilterValue: 2 },
        { title: 'For a Rep', orderType: '5', onFilterValue: 5 },
        { title: 'Drop-Shipment Retail', orderType: '3', onFilterValue: 3 },
        { title: 'Drop-Shipment Vaccine', orderType: '4', onFilterValue: 4 }
    ]
}

//onFilterValue because Backend use number value

export const orderTypeFR = {
    title: 'Type de commande:',
    values: [
        { title: 'Auto-commande', orderType: '1', onFilterValue: 1 },
        { title: 'Expédition conventionnée', orderType: '2', onFilterValue: 2 },
        { title: 'Pour un représentant', orderType: '5', onFilterValue: 5 },
        { title: 'Vente au détail en livraison directe', orderType: '3', onFilterValue: 3 },
        { title: 'Vaccin de livraison directe', orderType: '4', onFilterValue: 4 }
    ]
}

export const productStatusEN = {
    title: 'Product Status:',
    values: [
        { value: "all", title: "All", checked: true, show: true },
        { value: "1", title: "Available", class: "available", checked: false, show: true },
        { value: "2", title: "Training Required", class: "training-required", checked: false, show: true },
        { value: "3", title: "Out Of Stock", class: "out-of-stock", checked: false, show: true },
        { value: "4", title: "Cease Use/Expired", class: "cease-use-Expired", checked: false, show: true },
        { value: "5", title: "Quantity Limit Reached", class: "quantity-limit-reached", checked: false, show: true },
        { value: "6", title: "Threshold Exceeded", class: "threshold-exceeded", checked: false, show: true },
        { value: "7", title: "Unavailable", class: "unavailable", checked: false, show: false },
        { value: "8", title: "Cold Chain Order Limit Reached", class: "cold-chain-order-limit-reached", checked: false, show: false },
        { value: "9", title: "Order Limit Reached", class: "sample-promo-order-limit-reached", checked: false, show: false },
        { value: "10", title: "Not Released for Use", class: "not-released", checked: false, show: false },
        { value: "11", title: "Missing shipment eligibility", class: "missing-shipment", checked: false, show: false },
        { value: "12", title: "No Allocation", class: "quantity-limit-reached", checked: false, show: false },
        { value: "13", title: "Monthly Order Limit Reached", class: "quantity-limit-reached", checked: false, show: false },
        { value: "14", title: "Sample Order Limit Reached", class: "sample-promo-order-limit-reached", checked: false, show: false }
    ]
}

export const productStatusFR = {
    title: 'État du produit:',
    values: [
        { value: "all", title: "Toute", checked: true, show: true },
        { value: "1", title: "Disponible", class: "available", checked: false, show: true },
        { value: "2", title: "Formation requise", class: "training-required", checked: false, show: true },
        { value: "3", title: "En rupture de stock", class: "out-of-stock", checked: false, show: true },
        { value: "4", title: "Cesser d'utiliser/Expiré", class: "cease-use-Expired", checked: false, show: true },
        { value: "5", title: "Limite de quantité atteinte", class: "quantity-limit-reached", checked: false, show: true },
        { value: "6", title: "Seuil dépassé", class: "threshold-exceeded", checked: false, show: true },
        { value: "7", title: "Indisponible", class: "unavailable", checked: false, show: false },
        { value: "8", title: "Limite de commande de la chaîne du froid atteinte", class: "cold-chain-order-limit-reached", checked: false, show: false },
        { value: "9", title: "Limite de commande atteinte", class: "sample-promo-order-limit-reached", checked: false, show: false },
        { value: "10", title: "Non autorisé à être utilisé", class: "not-released", checked: false, show: false },
        { value: "11", title: "Éligibilité des envois manquants", class: "missing-shipment", checked: false, show: false },
        { value: "12", title: "Aucune allocation", class: "quantity-limit-reached", checked: false, show: false },
        { value: "13", title: "Limite de commande mensuelle atteinte", class: "quantity-limit-reached", checked: false, show: false },
        { value: "14", title: "Limite de commande d'échantillons atteinte", class: "sample-promo-order-limit-reached", checked: false, show: false }
    ]
}

export const productStatusOnOrderHistoryFilterEN = {
    title: 'Product Status:',
    values: [
        {
            title: "Unavailable",
            value: 0
        },
        {
            title: "In Progress",
            value: 7301
        },
        {
            title: "Shipped (In Transit)",
            value: 7302
        },
        {
            title: "Delivered",
            value: 7303
        },
        {
            title: "Returned",
            value: 7304
        },
        {
            title: "Rejected",
            value: 7306
        },
        {
            title: "Sent to Shipper",
            value: 7316
        },
        {
            title: "Cancelled",
            value: 7317
        }
    ]
}

export const productStatusOnOrderHistoryFilterFR = {
    title: 'État du produit:',
    values: [
        {
            title: "Indisponible",
            value: 0
        },
        {
            title: "En cours",
            value: 7301
        },
        {
            title: "Expédié (en transit)",
            value: 7302
        },
        {
            title: "livré",
            value: 7303
        },
        {
            title: "Renvoyé à",
            value: 7304
        },
        {
            title: "Rejetée",
            value: 7306
        },
        {
            title: "Envoyé à l'expéditeur",
            value: 7316
        },
        {
            title: "Annulé",
            value: 7317
        }
    ]
}



export const productTypeEN = {
    title: 'Product Type:',
    values: [
        { title: 'RX', orderType: '1', checked: false },
        { title: 'Promotional', orderType: '2', checked: false },
    ]
}


export const productTypeFR = {
    title: 'Type de produit:',
    values: [
        { title: 'RX', orderType: '1', checked: false },
        { title: 'Promotionnelle', orderType: '2', checked: false },
    ]
}

// English PeriodType object
export const periodTypeEN = {
    title: 'Period Type:',
    values: [
        { title: 'Monthly', periodType: '1', onFilterValue: 1 },
        { title: 'Bi-Monthly', periodType: '2', onFilterValue: 2 },
        { title: 'Quarterly', periodType: '3', onFilterValue: 3 },
        { title: 'Half-Yearly', periodType: '4', onFilterValue: 4 },
        { title: 'Yearly', periodType: '5', onFilterValue: 5 },
        { title: 'Lifetime', periodType: '6', onFilterValue: 6 }
    ]
}

// French PeriodType object
export const periodTypeFR = {
    title: 'Type de période:',
    values: [
        { title: 'Mensuel', periodType: '1', onFilterValue: 1 },
        { title: 'Bi-Mensuel', periodType: '2', onFilterValue: 2 },
        { title: 'Trimestriel', periodType: '3', onFilterValue: 3 },
        { title: 'Semestriel', periodType: '4', onFilterValue: 4 },
        { title: 'Annuel', periodType: '5', onFilterValue: 5 },
        { title: 'À vie', periodType: '6', onFilterValue: 6 }
    ]
}

