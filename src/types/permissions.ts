export interface VendorPermissions {
    products: {
        create: boolean;
        edit: boolean;
        delete: boolean;
    };
    orders: {
        view: boolean;
        refund: boolean;
    };
    earnings: {
        view: boolean;
        withdraw: boolean;
    };
    settings: {
        editStore: boolean;
    };
}
