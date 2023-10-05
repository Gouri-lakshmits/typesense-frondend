

export type ResultType = {
    hits?: {
      document: {
        product_name: string;
        image_url: string;
        category?: [];
        id: string;
        price: string;
        sku: string;
        created_at: string;
      };
    }[];
  };
  

  export type ResultPageType = {
  hits?: {
    document: {
      page_title: string;
      page_id: string;
      url: string;
    };
  }[];
};
 export type CategoryType = {
    hits?: {
      document: {
        category_name: string;
        url: string;
        category_id: string;
        path: string;
      };
    }[];
  };
  