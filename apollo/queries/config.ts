import { GeneralConfig, SearchConfig } from "../../types/generated/graphql";
import { gql } from "@apollo/client";


export const SYSTEM_CONFIG = gql`
  query typesenseSearch{
    typeseSenseSystemConfig {
      general {
        module_status
        admin_api_key
        cloud_key
        index_name
        node
        port
        protocol
        search_api_key
      }
      search_result {
        status
        product_per_page
        sort_option {
          attribute
          label
          order
        }
      }
    }
  }
`;

export type SysytemConfigQuery = {
    Response: {
     general : GeneralConfig,
     search_result : SearchConfig
    };
  };

